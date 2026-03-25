import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as ROSLIB from "roslib";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Activity, gauge } from "lucide-react";

// ROS Configuration
const ros = new ROSLIB.Ros({ url: 'ws://192.168.0.108:9090' });
const movementTopic = new ROSLIB.Topic({
  ros,
  name: '/movement',
  messageType: 'std_msgs/String'
});

const keyToIndex: Record<string, number> = {
  ArrowUp: 1,
  ArrowLeft: 3,
  ArrowRight: 5,
  ArrowDown: 7,
};

export default function ControllerView() {
  const [speed, setSpeed] = useState(50);
  const [angle, setAngle] = useState(180);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Status Handlers
  useEffect(() => {
    ros.on('connection', () => setIsConnected(true));
    ros.on('error', () => setIsConnected(false));
    ros.on('close', () => setIsConnected(false));
  }, []);

  const buttons = useMemo(() => [
    null,
    { name: "Forward", command: "forward", icon: <ArrowUp className="w-8 h-8" /> },
    null,
    { name: "Left", command: "left", icon: <ArrowLeft className="w-8 h-8" /> },
    { name: "Turn", command: "turn", icon: <RotateCw className="w-8 h-8" /> },
    { name: "Right", command: "right", icon: <ArrowRight className="w-8 h-8" /> },
    null,
    { name: "Backward", command: "backward", icon: <ArrowDown className="w-8 h-8" /> },
    null,
  ], []);

  const sendCommand = (index: number | string) => {
    let direction = "";
    let idx: number | null = null;
    
    if (typeof index === "string") {
      direction = index.replace("Arrow", "").toLowerCase();
      idx = keyToIndex[index];
    } else {
      if (buttons[index] === null) return;
      direction = buttons[index]!.name.toLowerCase();
      idx = index;
    }
    
    setActiveIndex(idx);

    const message = new ROSLIB.Message({
      speed: speed,
      direction: direction,
      angle: angle
    });

    movementTopic.publish(message);
    setTimeout(() => setActiveIndex(null), 150);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8" style={{ fontFamily: "'Rajdhani', sans-serif" }}>

      <div className="max-w-5xl mx-auto mt-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-l-4 border-yellow-500 pl-6"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase" 
              style={{ fontFamily: "'Space Mono', monospace", background: 'linear-gradient(135deg, #862633, #FAAE1F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Mission Control
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-600'}`} />
            <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase">
              {isConnected ? "System Online" : "System Offline - Check ROSBridge"}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Telemetry & Sliders */}
          <div className="space-y-8">
            <ControlSlider 
              label="Velocity" 
              value={speed} 
              max={100} 
              onChange={setSpeed} 
              color="from-red-900 to-red-600"
              unit="m/s"
            />
            <ControlSlider 
              label="Articulation Angle" 
              value={angle} 
              max={360} 
              onChange={setAngle} 
              color="from-yellow-700 to-yellow-500"
              unit="°"
            />
            
            <div className="bg-gradient-to-br from-red-900/10 to-transparent border border-red-900/30 p-6 rounded-xl">
              <h3 className="text-yellow-500 font-bold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> DIAGNOSTICS
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="text-gray-400">NODE_STATUS: <span className="text-white">ACTIVE</span></div>
                <div className="text-gray-400">LATENCY: <span className="text-white">12ms</span></div>
                <div className="text-gray-400">TOPIC: <span className="text-white">/movement</span></div>
                <div className="text-gray-400">IP: <span className="text-white">192.168.0.108</span></div>
              </div>
            </div>
          </div>

          {/* Grid Controller */}
          <div 
            className="relative flex justify-center items-center p-8 bg-zinc-900/20 rounded-3xl border border-white/5 shadow-2xl"
            onKeyDown={(e) => keyToIndex[e.key] !== undefined && sendCommand(e.key)}
            tabIndex={0}
          >
            <div className="grid grid-cols-3 gap-4 w-full max-w-[400px] aspect-square">
              {buttons.map((btn, idx) => (
                <div key={idx} className="aspect-square">
                  {btn ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendCommand(idx)}
                      className={`w-full h-full flex items-center justify-center rounded-2xl border-2 transition-all duration-150
                        ${activeIndex === idx 
                          ? 'bg-yellow-500 border-white text-black shadow-[0_0_30px_rgba(250,174,31,0.5)]' 
                          : 'bg-black/50 border-red-900/50 text-yellow-500 hover:border-yellow-500/50'}`}
                    >
                      {btn.icon}
                    </motion.button>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-red-900/20 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Corner Decorative Elements */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-900" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Sliders to keep code clean
function ControlSlider({ label, value, max, onChange, color, unit }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-xl font-bold tracking-widest text-gray-400 uppercase">{label}</label>
        <div className="text-3xl font-black text-white italic">
          {value}<span className="text-sm text-yellow-500 ml-1 font-normal not-italic">{unit}</span>
        </div>
      </div>
      <div className="relative h-4 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
        />
        <input 
          type="range" 
          min="0" 
          max={max} 
          value={value} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
}