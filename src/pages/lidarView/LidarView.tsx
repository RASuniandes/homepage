import { useEffect, useRef, useState } from 'react';
import * as ROSLIB from 'roslib';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, ShieldAlert, Zap, Target } from 'lucide-react';

export default function LidarView() {
  const radarRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('OFFLINE');
  const [scanTopic, setScanTopic] = useState<ROSLIB.Topic | null>(null);
  const [lastDetection, setLastDetection] = useState<number>(0);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: 'ws://192.168.0.108:9090' });
    const topic = new ROSLIB.Topic({
      ros,
      name: '/scan',
      messageType: 'sensor_msgs/LaserScan'
    });

    ros.on('connection', () => setStatus('CONNECTED'));
    ros.on('error', () => setStatus('ERROR'));
    ros.on('close', () => setStatus('OFFLINE'));

    setScanTopic(topic);
    return () => ros.close();
  }, []);

  useEffect(() => {
    if (!scanTopic) return;

    const unsubscribe = scanTopic.subscribe((msg: any) => {
      const { ranges, angle_min, angle_increment } = msg;
      
      ranges.forEach((r: number, i: number) => {
        // Filter out infinite or invalid readings (common in LiDAR)
        if (r > 0 && isFinite(r) && r < 10) { 
          const angle = (angle_min + i * angle_increment) * (180 / Math.PI);
          const [px, py] = distanceAngleToXY(r, angle);
          addPoint(px, py);
          setLastDetection(Date.now());
        }
      });
    });

    return () => scanTopic.unsubscribe();
  }, [scanTopic]);

  function addPoint(x: number, y: number) {
    const container = radarRef.current;
    if (!container) return;

    const point = document.createElement('div');
    point.className = 'absolute w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_8px_#FAAE1F] z-20 transition-opacity duration-1000';
    point.style.left = `${x}%`;
    point.style.top = `${y}%`;
    point.style.transform = 'translate(-50%, -50%)';

    container.appendChild(point);

    // Fade and Cleanup
    requestAnimationFrame(() => {
      setTimeout(() => { point.style.opacity = '0'; }, 700);
      setTimeout(() => { point.remove(); }, 1200);
    });
  }

  function distanceAngleToXY(distance: number, angle: number) {
    // Normalizing distance: assuming max range of 5 meters for visualization
    const scale = (distance / 5) * 50; 
    const rad = (angle - 90) * (Math.PI / 180); // Adjusting -90 to point Forward Up
    const x = 50 + scale * Math.cos(rad);
    const y = 50 + scale * Math.sin(rad);
    return [x, y];
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 overflow-hidden select-none" style={{ fontFamily: "'Rajdhani', sans-serif" }}>

      {/* Header Info */}
      <div className="max-w-7xl mx-auto flex justify-between items-start mb-8 mt-12">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-yellow-500" style={{ fontFamily: "'Space Mono', monospace" }}>
            SWARM_LIDAR_V1.5
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Radio className={`w-4 h-4 ${status === 'CONNECTED' ? 'text-green-500' : 'text-red-600'}`} />
            <span className="text-xs font-mono tracking-widest uppercase">{status} // 192.168.0.108</span>
          </div>
        </motion.div>

        <div className="text-right font-mono text-[10px] text-gray-500 space-y-1 hidden md:block">
          <p>RANGE_MAX: 5.0m</p>
          <p>SENSITIVITY: HIGH</p>
          <p>PROTOCOL: ROS_BRIDGE_WS</p>
        </div>
      </div>

      {/* Main Radar Display */}
      <div className="relative flex justify-center items-center h-[70vh]">
        
        {/* Background Grid Elements */}
        <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none">
            <div className="w-[80vh] h-[80vh] border border-red-900 rounded-full flex justify-center items-center">
                <div className="w-2/3 h-2/3 border border-red-900 rounded-full flex justify-center items-center">
                    <div className="w-1/3 h-1/3 border border-red-900 rounded-full" />
                </div>
            </div>
            {/* Crosshair Axes */}
            <div className="absolute w-[85vh] h-[1px] bg-red-900/50" />
            <div className="absolute h-[85vh] w-[1px] bg-red-900/50" />
        </div>

        {/* The Actual Radar Container */}
        <div 
          ref={radarRef}
          className="relative w-[75vh] h-[75vh] rounded-full border-2 border-red-900/40 bg-gradient-to-b from-red-900/5 to-transparent overflow-hidden shadow-[0_0_50px_rgba(134,38,51,0.2)]"
        >
          {/* Sweeping Line Effect */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-full h-full origin-top-left bg-gradient-to-tr from-yellow-500/20 to-transparent border-l border-yellow-500/30 z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ top: '50%', left: '50%' }}
          />

          {/* Compass Markers */}
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold text-red-700">000°</span>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-red-700">180°</span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-700 font-mono">090°</span>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-700 font-mono">270°</span>

          {/* Center Origin (The Robot) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="relative">
                <Target className="w-8 h-8 text-yellow-500 animate-pulse" />
                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-20" />
            </div>
          </div>
        </div>

        {/* Side Telemetry Cards */}
        <div className="absolute left-10 bottom-10 space-y-4 hidden lg:block w-64">
           <TelemetryCard icon={<ShieldAlert className="w-4 h-4" />} title="PROXIMITY ALERT" value="CLEAR" color="text-green-500" />
           <TelemetryCard icon={<Zap className="w-4 h-4" />} title="SAMPLE RATE" value="40Hz" color="text-yellow-500" />
        </div>
      </div>
    </div>
  );
}

function TelemetryCard({ icon, title, value, color }: any) {
    return (
        <div className="bg-zinc-900/40 border-l-2 border-red-900 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mb-1">
                {icon} {title}
            </div>
            <div className={`text-xl font-black italic tracking-tighter ${color}`}>{value}</div>
        </div>
    )
}