import { useEffect, useRef } from 'react';

type Role = 'director' | 'lead' | 'member' | 'assoc';

interface TeamNode {
  id: number;
  name: string;
  role: Role;
  team: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Colors {
  accent: string;
  ink: string;
  inkSoft: string;
  surface: string;
  isDark: boolean;
}

const NODE_DATA: Omit<TeamNode, 'x' | 'y' | 'vx' | 'vy'>[] = [
  { id: 0,  name: 'Felipe Gutiérrez Apráez',            role: 'director', team: 0 },
  { id: 1,  name: 'Sebastián David Cáceres Navarro',    role: 'director', team: 0 },
  { id: 2,  name: 'Daniel Andrés Munevar Quiñones',     role: 'director', team: 0 },
  { id: 3,  name: 'Pablo Sarmiento Tamayo',             role: 'lead',     team: 1 },
  { id: 4,  name: 'Manuel Santiago Suaza Quiroga',      role: 'lead',     team: 2 },
  { id: 5,  name: 'Fredy A. Chaparro Castro',           role: 'lead',     team: 3 },
  { id: 6,  name: 'Iván David Gómez Silva',             role: 'lead',     team: 0 },
  { id: 7,  name: 'Santiago Hincapié Rueda',            role: 'member',   team: 1 },
  { id: 8,  name: 'Luis David Camero Hernández',        role: 'member',   team: 1 },
  { id: 9,  name: 'Alicia Pineda Fory',                 role: 'member',   team: 2 },
  { id: 10, name: 'Juan David Prieto Garzón',           role: 'member',   team: 2 },
  { id: 11, name: 'Santiago Valbuena Guzmán',           role: 'member',   team: 2 },
  { id: 12, name: 'Ángela Verónica Bobadilla Beltrán',  role: 'member',   team: 2 },
  { id: 13, name: 'Jesús Sandoval Santana',             role: 'member',   team: 2 },
  { id: 14, name: 'Daniel A. Castillo González',        role: 'member',   team: 2 },
  { id: 15, name: 'Juan José Rincón Perico',            role: 'member',   team: 2 },
  { id: 16, name: 'Samuel Luque Navia',                 role: 'member',   team: 2 },
  { id: 17, name: 'Johan S. Castiblanco Galeano',       role: 'member',   team: 2 },
  { id: 18, name: 'Alejandro Alvernia Liévano',         role: 'member',   team: 2 },
  { id: 19, name: 'Andrés Felipe Ayala Mansilla',       role: 'member',   team: 3 },
  { id: 20, name: 'Juan Camilo Torres Mestra',          role: 'member',   team: 3 },
  { id: 21, name: 'Alejandro Bernal López',             role: 'member',   team: 3 },
  { id: 22, name: 'Nicolás Puerta',                     role: 'member',   team: 3 },
  { id: 23, name: 'Daniela Martínez Rincón',            role: 'assoc',    team: 4 },
];

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 2],
  [0, 3], [0, 4], [0, 5], [0, 6],
  [2, 3], [2, 4], [2, 5],
  [3, 4], [4, 5],
  [3, 7], [3, 8], [1, 7],
  [4, 9], [4, 10], [4, 11], [4, 12], [4, 13],
  [4, 14], [4, 15], [4, 16], [4, 17], [4, 18],
  [5, 19], [5, 20], [5, 21], [5, 22], [6, 19],
  [0, 23],
];

// Precomputed adjacency for hover highlighting
const ADJ_SET = new Set(EDGES.flatMap(([a, b]) => [`${a}-${b}`, `${b}-${a}`]));
const isConnected = (a: number, b: number) => ADJ_SET.has(`${a}-${b}`);

function initNodes(W: number, H: number): TeamNode[] {
  const cx = W / 2;
  const cy = H / 2;
  // Team sectors in radians: mecánica upper-left, electrónica right, software lower-left
  const sectors: Record<number, number> = { 0: 0, 1: -2.1, 2: 0.2, 3: 2.2, 4: -0.6 };
  const counters: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  const sizes: Record<number, number> = {};
  for (const nd of NODE_DATA) sizes[nd.team] = (sizes[nd.team] || 0) + 1;

  return NODE_DATA.map(nd => {
    const idx = counters[nd.team]++;
    const size = sizes[nd.team];
    let x: number, y: number;

    if (nd.team === 0) {
      // Directors cluster near center
      const a = (idx / Math.max(size - 1, 1)) * Math.PI * 2;
      x = cx + Math.cos(a) * 55 + (Math.random() - 0.5) * 20;
      y = cy + Math.sin(a) * 55 + (Math.random() - 0.5) * 20;
    } else {
      const base = sectors[nd.team];
      const spread = size > 1 ? ((idx / (size - 1)) - 0.5) * (Math.PI / 2.2) : 0;
      const angle = base + spread;
      const r = (nd.role === 'lead' ? 160 : 290) + (Math.random() - 0.5) * 40;
      x = cx + Math.cos(angle) * r;
      y = cy + Math.sin(angle) * r;
    }
    return { ...nd, x, y, vx: 0, vy: 0 };
  });
}

function stepPhysics(
  nodes: TeamNode[],
  W: number,
  H: number,
  hovered: number | null,
  alpha: number,
) {
  const K_REP = 9000;
  const K_SPRING = 0.08;
  const REST = 165;
  const K_GRAV = 0.005;
  const DAMP = 0.84;
  const MAX_V = 6;       // clamp per-frame speed so nothing flies off
  const PAD = 110;
  const cx = W / 2;
  const cy = H / 2;

  const fx = new Float64Array(nodes.length);
  const fy = new Float64Array(nodes.length);

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const d2 = Math.max(dx * dx + dy * dy, 1);
      const d = Math.sqrt(d2);
      const f = K_REP / d2;
      fx[i] -= (dx / d) * f; fy[i] -= (dy / d) * f;
      fx[j] += (dx / d) * f; fy[j] += (dy / d) * f;
    }
  }

  for (const [a, b] of EDGES) {
    const dx = nodes[b].x - nodes[a].x;
    const dy = nodes[b].y - nodes[a].y;
    const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
    const f = K_SPRING * (d - REST);
    fx[a] += (dx / d) * f; fy[a] += (dy / d) * f;
    fx[b] -= (dx / d) * f; fy[b] -= (dy / d) * f;
  }

  for (let i = 0; i < nodes.length; i++) {
    const g = K_GRAV * (nodes[i].role === 'director' ? 5 : nodes[i].role === 'lead' ? 2.5 : 1);
    fx[i] -= (nodes[i].x - cx) * g;
    fy[i] -= (nodes[i].y - cy) * g;
  }

  for (let i = 0; i < nodes.length; i++) {
    // Pin the hovered node: hold it still so its name stays readable/selectable
    if (i === hovered) { nodes[i].vx = 0; nodes[i].vy = 0; continue; }

    let vx = (nodes[i].vx + fx[i] * alpha) * DAMP;
    let vy = (nodes[i].vy + fy[i] * alpha) * DAMP;

    // Clamp speed so a close repulsion spike can't fling a node across the canvas
    const sp = Math.sqrt(vx * vx + vy * vy);
    if (sp > MAX_V) { vx = (vx / sp) * MAX_V; vy = (vy / sp) * MAX_V; }

    nodes[i].vx = vx;
    nodes[i].vy = vy;
    nodes[i].x = Math.max(PAD, Math.min(W - PAD, nodes[i].x + vx));
    nodes[i].y = Math.max(PAD, Math.min(H - PAD, nodes[i].y + vy));
    if (nodes[i].x <= PAD || nodes[i].x >= W - PAD) nodes[i].vx *= -0.35;
    if (nodes[i].y <= PAD || nodes[i].y >= H - PAD) nodes[i].vy *= -0.35;
  }
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  nodes: TeamNode[],
  W: number,
  H: number,
  hovered: number | null,
  colors: Colors
) {
  ctx.clearRect(0, 0, W, H);
  const edgeBase = colors.isDark ? 'rgba(255,255,255,' : 'rgba(28,26,27,';

  // Edges
  for (const [a, b] of EDGES) {
    const na = nodes[a];
    const nb = nodes[b];
    const isHl = hovered !== null && (hovered === a || hovered === b);
    ctx.beginPath();
    ctx.moveTo(na.x, na.y);
    ctx.lineTo(nb.x, nb.y);
    if (isHl) {
      ctx.strokeStyle = colors.accent;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.5;
    } else if (hovered !== null) {
      ctx.strokeStyle = edgeBase + '0.04)';
      ctx.globalAlpha = 1;
      ctx.lineWidth = 0.6;
    } else {
      ctx.strokeStyle = edgeBase + '0.14)';
      ctx.globalAlpha = 1;
      ctx.lineWidth = 0.8;
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Nodes
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const isHov = hovered === i;
    const isConn = hovered !== null && hovered !== i && isConnected(hovered, i);
    const isFaded = hovered !== null && !isHov && !isConn;

    let fontSize: number;
    let fontStr: string;
    let color: string;

    if (n.role === 'director') {
      fontSize = 14; fontStr = '800'; color = colors.accent;
    } else if (n.role === 'lead') {
      fontSize = 13; fontStr = '700'; color = colors.ink;
    } else {
      fontSize = 11.5; fontStr = '500'; color = colors.inkSoft;
    }
    if (n.role === 'assoc') fontStr += ' italic';
    if (isHov) { fontSize += 2.5; color = colors.accent; fontStr = '800'; }
    if (isConn) color = colors.ink;

    ctx.font = `${fontStr} ${fontSize}px Archivo, 'IBM Plex Sans', sans-serif`;
    const tw = ctx.measureText(n.name).width;
    const px = 6, py = 4;

    ctx.globalAlpha = isFaded ? 0.14 : 1;

    // Director / hovered glow (radial gradient, no filter blur)
    if ((n.role === 'director' || isHov) && !isFaded) {
      const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, tw / 2 + 28);
      gr.addColorStop(0, colors.accent + (colors.isDark ? '28' : '1a'));
      gr.addColorStop(1, colors.accent + '00');
      ctx.fillStyle = gr;
      ctx.globalAlpha = isFaded ? 0 : (isHov ? 1 : 0.8);
      ctx.fillRect(n.x - tw / 2 - 28, n.y - fontSize - 12, tw + 56, fontSize + 24);
      ctx.globalAlpha = isFaded ? 0.14 : 1;
    }

    // Background pill for readability
    ctx.fillStyle = colors.surface;
    ctx.globalAlpha = isFaded ? 0 : (n.role === 'director' || isHov ? 0.88 : 0.72);
    ctx.fillRect(n.x - tw / 2 - px, n.y - fontSize / 2 - py, tw + px * 2, fontSize + py * 2);

    // Label
    ctx.globalAlpha = isFaded ? 0.14 : 1;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.name, n.x, n.y);

    // Dot marker for directors and leads
    if ((n.role === 'director' || n.role === 'lead') && !isFaded) {
      ctx.beginPath();
      ctx.arc(n.x, n.y + Math.ceil(fontSize / 2) + 5, n.role === 'director' ? 2.5 : 1.8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }
}

export default function TeamGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef  = useRef<TeamNode[]>([]);
  const mouseRef  = useRef<{ x: number; y: number } | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const colorsRef = useRef<Colors>({ accent: '#9d142c', ink: '#1c1a1b', inkSoft: '#6c6660', surface: '#ffffff', isDark: false });
  const animRef   = useRef<number>(0);
  const sizeRef   = useRef({ W: 0, H: 0 });
  const pausedRef = useRef(false);
  const alphaRef  = useRef(1);   // simulation "temperature" — decays so the cloud settles

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const readColors = () => {
      const dsEl = canvas.closest('.ras-ds') as HTMLElement | null;
      const cs = dsEl ? getComputedStyle(dsEl) : null;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      colorsRef.current = {
        accent:  cs?.getPropertyValue('--accent').trim()   || (isDark ? '#df4a64' : '#9d142c'),
        ink:     cs?.getPropertyValue('--ink').trim()      || (isDark ? '#f1ece6' : '#1c1a1b'),
        inkSoft: cs?.getPropertyValue('--ink-soft').trim() || (isDark ? '#a8a29b' : '#6c6660'),
        surface: cs?.getPropertyValue('--surface').trim()  || (isDark ? '#1d1a1d' : '#ffffff'),
        isDark,
      };
    };

    const resize = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (!W || !H) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { W, H };
      if (!nodesRef.current.length) { nodesRef.current = initNodes(W, H); alphaRef.current = 1; }
      readColors();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const io = new IntersectionObserver(([e]) => { pausedRef.current = !e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMouseLeave = () => { mouseRef.current = null; hoveredRef.current = null; };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const tick = () => {
      animRef.current = requestAnimationFrame(tick);
      if (pausedRef.current) return;

      const { W, H } = sizeRef.current;
      const nodes = nodesRef.current;
      if (!W || !H || !nodes.length) return;

      const mx = mouseRef.current?.x ?? null;
      const my = mouseRef.current?.y ?? null;

      // Resolve hover first, so physics can pin the node under the cursor (max ~36px reach)
      if (mx !== null && my !== null) {
        let best = -1, bestD = 1300;
        for (let i = 0; i < nodes.length; i++) {
          const dx = nodes[i].x - mx, dy = nodes[i].y - my;
          const d = dx * dx + dy * dy;
          if (d < bestD) { best = i; bestD = d; }
        }
        hoveredRef.current = best >= 0 ? best : null;
      }

      // Cool the simulation toward a calm floor so the layout settles instead of drifting
      alphaRef.current = Math.max(0.12, alphaRef.current * 0.99);

      stepPhysics(nodes, W, H, hoveredRef.current, alphaRef.current);

      drawFrame(ctx, nodes, W, H, hoveredRef.current, colorsRef.current);
    };

    document.fonts.ready.then(() => { animRef.current = requestAnimationFrame(tick); });

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect(); mo.disconnect(); io.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="swarm-graph-canvas"
      aria-label="Red de colaboradores del equipo SWARM"
    />
  );
}
