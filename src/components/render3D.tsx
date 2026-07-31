import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


/**
 * Render3D — interactive viewer + driveable Three.js twin of the SWARM robot.
 *
 * Geometry: each STL is loaded raw (no offset) and placed using the exact
 * <joint origin> / <visual origin> pairs from SWARM.xacro. In that file every
 * child link's visual origin is the exact negative of its joint origin, which
 * means each mesh already sits in the assembly's world frame — the pivot
 * group below just recreates that relationship so wheels can spin around
 * their real axle instead of their mesh's arbitrary local origin.
 *
 * Axis convention: URDF/ROS is Z-up, X-forward. three.js is Y-up. All part
 * math below is done directly in raw URDF coordinates, then the whole thing
 * is nested inside a single `urdfRoot` that is rotated -90° about X to
 * convert Z-up -> Y-up once, at the top, instead of remapping every offset
 * by hand (which is where it's easy to end up with a "torcido" robot).
 *
 * Driving: WASD / arrow keys run a differential-drive integrator using the
 * same wheel_radius / wheel_separation values as the `gz-sim-diff-drive-system`
 * plugin in the xacro, so wheel spin roughly matches how fast the chassis
 * actually moves.
 */

// ---- Physical constants pulled straight from SWARM.xacro -----------------
const WHEEL_RADIUS = 0.02; // m
const WHEEL_SEPARATION = 0.24; // m
const MM_TO_M = 0.001; // <mesh scale="0.001 0.001 0.001">

type Vec3 = [number, number, number];

interface PartDef {
  file: string;
  /** joint origin — where this part's frame sits relative to base_link (raw URDF xyz, Z-up) */
  jointOrigin: Vec3;
  /** visual origin — offset of the mesh inside its own link frame (raw URDF xyz, Z-up) */
  visualOrigin: Vec3;
  color: string;
  roughness: number;
  metalness: number;
  wheel?: 'left' | 'right';
}

const PARTS: Record<string, PartDef> = {
  base_link: {
    file: 'base_link.stl',
    jointOrigin: [0, 0, 0],
    visualOrigin: [0, 0, 0],
    color: '#c7cbd1',
    roughness: 0.35,
    metalness: 0.6,
  },
  lidar_1: {
    file: 'lidar_1.stl',
    jointOrigin: [0.0, 0.0, 0.14],
    visualOrigin: [-0.0, -0.0, -0.14],
    color: 'white',
    roughness: 0.4,
    metalness: 0.3,
  },
  camera_1: {
    file: 'camera_1.stl',
    jointOrigin: [0.34, 0.0, 0.12],
    visualOrigin: [-0.34, 0.0, -0.12],
    color: 'white',
    roughness: 0.5,
    metalness: 0.2,
  },
  front_caster_1: {
    file: 'front_caster_1.stl',
    jointOrigin: [0.34, 0.0, 0.0],
    visualOrigin: [-0.34, 0.0, 0.0],
    color: '#8f9299',
    roughness: 0.45,
    metalness: 0.7,
  },
  back_caster_1: {
    file: 'back_caster_1.stl',
    jointOrigin: [-0.34, 0.0, 0.0],
    visualOrigin: [0.34, 0.0, 0.0],
    color: '#8f9299',
    roughness: 0.45,
    metalness: 0.7,
  },
  left_wheel_1: {
    file: 'left_wheel_1.stl',
    jointOrigin: [0.000252, 0.12, 0.02008],
    visualOrigin: [-0.000252, -0.12, -0.02008],
    color: '#121212',
    roughness: 0.9,
    metalness: 0.05,
    wheel: 'left',
  },
  right_wheel_1: {
    file: 'right_wheel_1.stl',
    jointOrigin: [0.000252, -0.12, 0.02008],
    visualOrigin: [-0.000252, 0.12, -0.02008],
    color: '#121212',
    roughness: 0.9,
    metalness: 0.05,
    wheel: 'right',
  },
};

// A splash of brand color on the chassis trim reads better than flat "silver"
// everywhere — swap base_link's color below if you'd rather keep it neutral.
const ACCENT = '#9d142c';

interface Render3DProps {
  /** folder (relative to public/) that holds the 7 STL files */
  modelsBasePath?: string;
  className?: string;
  /** viewer height — any valid CSS size */
  height?: string;
}

export default function Render3D({
  modelsBasePath = ``,
  className = '',
  height = '560px',
}: Render3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Exposed to the UI so the reset button can reach back into the scene
  const resetViewRef = useRef<() => void>(() => {});
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    const cleanupFns: Array<() => void> = [];

    // ---- Scene / camera / renderer ---------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#15120F');
    scene.fog = new THREE.Fog('#15120F', 3, 10);

    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / mount.clientHeight,
      0.01,
      100
    );
    // placeholder position — replaced by an auto-fit once geometry is loaded
    camera.position.set(1.2, 0.9, 1.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ---- Lighting ------------------------------------------------------------
    scene.add(new THREE.HemisphereLight('#8892a6', '#120e0b', 0.75));

    const key = new THREE.DirectionalLight('#fff3e6', 2.3);
    key.position.set(2.2, 3, 2);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 10;
    key.shadow.camera.left = -1.2;
    key.shadow.camera.right = 1.2;
    key.shadow.camera.top = 1.2;
    key.shadow.camera.bottom = -1.2;
    key.shadow.bias = -0.0005;
    scene.add(key);

    const rim = new THREE.DirectionalLight(ACCENT, 1.1);
    rim.position.set(-2, 1.2, -1.6);
    scene.add(rim);

    const fill = new THREE.DirectionalLight('#e8ecf5', 0.4);
    fill.position.set(-1, 0.6, 2);
    scene.add(fill);

    // ---- Ground + soft radial spotlight so the card reads as intentional,
    // not just "a dark hole" on either a light or dark page ------------------
    const groundCanvas = document.createElement('canvas');
    groundCanvas.width = 512;
    groundCanvas.height = 512;
    const ctx = groundCanvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, 'rgba(122,31,46,0.35)');
    gradient.addColorStop(0.45, 'rgba(40,32,28,0.25)');
    gradient.addColorStop(1, 'rgba(21,18,15,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    const spotTexture = new THREE.CanvasTexture(groundCanvas);

    const spot = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.2),
      new THREE.MeshBasicMaterial({ map: spotTexture, transparent: true, depthWrite: false })
    );
    spot.rotation.x = -Math.PI / 2;
    spot.position.y = 0.002;
    scene.add(spot);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(6, 64),
      new THREE.MeshStandardMaterial({ color: '#1a1714', roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(6, 24, '#3a332c', '#221d18');
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    grid.position.y = 0.001;
    scene.add(grid);

    // ---- Controls --------------------------------------------------------
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.4;
    controls.maxDistance = 6;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.6;

    // ---- Robot assembly ----------------------------------------------------
    // robotRoot: the "drive" frame — moves/turns in world (Y-up) space as
    // the person drives. urdfRoot: fixes the Z-up -> Y-up axis convention
    // exactly once, so every part below it can keep using raw xacro numbers.
    const robotRoot = new THREE.Group();
    const urdfRoot = new THREE.Group();
    urdfRoot.rotation.x = -Math.PI / 2;
    robotRoot.add(urdfRoot);
    scene.add(robotRoot);

    const wheelGroups: { left?: THREE.Group; right?: THREE.Group } = {};
    const loader = new STLLoader();
    const entries = Object.entries(PARTS);
    let loadedCount = 0;

    const fitCameraToRobot = () => {
      const box = new THREE.Box3().setFromObject(robotRoot);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const fitDist =
        (maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360))) * 1.55;

      const dir = new THREE.Vector3(0.9, 0.62, 0.95).normalize();
      const camPos = center.clone().addScaledVector(dir, fitDist);

      camera.position.copy(camPos);
      camera.near = fitDist / 50;
      camera.far = fitDist * 20;
      camera.updateProjectionMatrix();
      controls.target.copy(center);
      controls.update();

      resetViewRef.current = () => {
        camera.position.copy(camPos);
        controls.target.copy(center);
        controls.update();
      };
    };

    entries.forEach(([name, part]) => {
      loader.load(
        `${modelsBasePath}/${part.file}`,
        (geometry) => {
          if (disposed) return;
          geometry.computeVertexNormals();

          const material = new THREE.MeshStandardMaterial({
            color: name === 'base_link' ? ACCENT : part.color,
            roughness: part.roughness,
            metalness: part.metalness,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.scale.setScalar(MM_TO_M);
          mesh.position.set(...part.visualOrigin);

          const pivot = new THREE.Group();
          pivot.position.set(...part.jointOrigin);
          pivot.add(mesh);
          urdfRoot.add(pivot);

          if (part.wheel) wheelGroups[part.wheel] = pivot;

          loadedCount += 1;
          setProgress(Math.round((loadedCount / entries.length) * 100));
          if (loadedCount === entries.length) {
            fitCameraToRobot();
            setReady(true);
          }
        },
        undefined,
        () => {
          if (!disposed) setError(`No se pudo cargar ${part.file}. Revisa que esté en ${modelsBasePath}/`);
        }
      );
    });

    // ---- Differential-drive keyboard control ------------------------------
    const keys = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => keys.add(e.key.toLowerCase());
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    cleanupFns.push(() => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    });

    const MAX_LINEAR = 0.6; // m/s
    const MAX_ANGULAR = 1.4; // rad/s
    let heading = 0;

    // ---- Resize handling ---------------------------------------------------
    const resizeObserver = new ResizeObserver(() => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(mount);
    cleanupFns.push(() => resizeObserver.disconnect());

    // ---- Animation loop ------------------------------------------------------
    const clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);

      const forward =
        (keys.has('w') || keys.has('arrowup') ? 1 : 0) -
        (keys.has('s') || keys.has('arrowdown') ? 1 : 0);
      const turn =
        (keys.has('a') || keys.has('arrowleft') ? 1 : 0) -
        (keys.has('d') || keys.has('arrowright') ? 1 : 0);

      const linear = forward * MAX_LINEAR;
      const angular = turn * MAX_ANGULAR;

      if (forward !== 0 || turn !== 0) {
        heading += angular * dt;
        robotRoot.position.x += Math.cos(heading) * linear * dt;
        robotRoot.position.z -= Math.sin(heading) * linear * dt;
        robotRoot.rotation.y = heading;
        controls.target.lerp(
          new THREE.Vector3(robotRoot.position.x, controls.target.y, robotRoot.position.z),
          0.15
        );
      }

      // Wheel axle in the xacro points along local Y (<axis xyz="0 1 0"/>),
      // which is still local Y here since urdfRoot's axis-fix rotation is
      // applied to the parent, not to each pivot's own local frame.
      const vLeft = linear - (angular * WHEEL_SEPARATION) / 2;
      const vRight = linear + (angular * WHEEL_SEPARATION) / 2;
      if (wheelGroups.left) wheelGroups.left.rotation.y += (vLeft / WHEEL_RADIUS) * dt;
      if (wheelGroups.right) wheelGroups.right.rotation.y -= (vRight / WHEEL_RADIUS) * dt;

      controls.autoRotate = autoRotateRef.current && forward === 0 && turn === 0;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    // ---- Cleanup ---------------------------------------------------------------
    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      cleanupFns.forEach((fn) => fn());
      controls.dispose();
      renderer.dispose();
      spotTexture.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelsBasePath]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#15120F] shadow-[0_20px_60px_-20px_rgba(122,31,46,0.35)] ring-1 ring-inset ring-white/[0.04] ${className}`}
    >
      {/* subtle top glass highlight so the card reads as a surface, not a flat void */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent" />

      <div ref={mountRef} style={{ height }} className="w-full touch-none" />

      {/* Loading overlay */}
      {!ready && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#15120F]">
          <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#E3A6AD] transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/50">
            Ensamblando SWARM · {progress}%
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#15120F] px-6 text-center">
          <p className="max-w-sm text-sm text-white/70">{error}</p>
        </div>
      )}

      {/* Controls overlay */}
      {ready && (
        <>
          <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white/50">
              SWARM · Robot
            </span>
            <span className="text-xs text-white/40">
              Arrastra para orbitar · WASD / flechas para conducir
            </span>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setAutoRotate((v) => !v)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors ${
                autoRotate
                  ? 'border-[#7A1F2E] bg-[#7A1F2E]/90 text-white'
                  : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              Auto-rotar
            </button>
            <button
              onClick={() => resetViewRef.current()}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur transition-colors hover:bg-white/10"
            >
              Reiniciar vista
            </button>
          </div>
        </>
      )}
    </div>
  );
}