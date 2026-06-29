import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GlobalStatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full h-8 bg-black/80 backdrop-blur-md border-b border-neonPink/30 z-[60] flex items-center justify-between px-6 font-mono text-[10px] tracking-widest"
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neonPink animate-pulse" />
          <span className="text-neonPink uppercase">System Status: Operational</span>
        </div>
        <span className="text-white/20">|</span>
        <span className="text-white/40 uppercase">Encrypted Link: Active</span>
      </div>
      
      <div className="flex items-center space-x-6 text-neonPink/80">
        <span className="uppercase">Uptime: 12d 04h 22m</span>
        <span className="font-bold">{time.toLocaleTimeString([], { hour12: false })}</span>
      </div>
    </motion.div>
  );
};

export default GlobalStatusBar;
