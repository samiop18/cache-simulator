import React from 'react';
import { Cpu, Zap } from 'lucide-react';

const TopNav: React.FC = () => {
  return (
    <header className="h-28 border-b border-white/10 flex items-center justify-between px-12 bg-midnight/50 backdrop-blur-xl z-10 transition-all">
      <div className="flex items-center space-x-6">
        <div className="p-3 rounded-xl bg-neonPink/10 border border-neonPink/20">
          <Cpu className="w-10 h-10 text-neonPink animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter neon-text uppercase leading-none">
            ML-CACHE SIMULATOR
          </h1>
          <span className="text-white/20 text-xs font-mono tracking-widest uppercase mt-1 block">Hardware Neural Layer v1.0</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3 px-5 py-2 rounded-full border border-green-500/30 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-green-500 uppercase font-black tracking-widest">Operational</span>
        </div>
        <div className="flex items-center space-x-3 text-white/40 hover:text-neonPink transition-all cursor-pointer group">
          <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-base font-black uppercase tracking-tighter">Core Select</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
