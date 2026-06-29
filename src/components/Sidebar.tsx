import React, { useState, useEffect } from 'react';
import { 
  Settings2, 
  Database, 
  Layers, 
  Play,
  Terminal,
  Target,
  Zap,
  LineChart
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSimulation } from '../context/SimulationContext';
import StressTestPanel from './StressTestPanel';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
  const { requestAddress, resetSimulation, setIsComparisonOpen } = useSimulation();
  
  const [associativity, setAssociativity] = useState('4-way');
  const [policy, setPolicy] = useState('LRU');
  
  const [manualAddr, setManualAddr] = useState('0x4F20');
  const [patternMode, setPatternMode] = useState<'Manual' | 'Linear' | 'Cyclic'>('Manual');
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation loop for patterns
  useEffect(() => {
    let interval: any;
    if (isSimulating && patternMode !== 'Manual') {
      let counter = 0;
      interval = setInterval(() => {
        let addr = '';
        if (patternMode === 'Linear') {
          addr = `0x${(Math.floor(Math.random() * 1000) + counter).toString(16).toUpperCase().padStart(4, '0')}`;
          counter += 8;
        } else if (patternMode === 'Cyclic') {
          const base = 0x1000;
          const offset = (counter % 32) * 4;
          addr = `0x${(base + offset).toString(16).toUpperCase().padStart(4, '0')}`;
          counter++;
        }
        requestAddress(addr);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isSimulating, patternMode, requestAddress]);

  return (
    <aside className="w-[420px] h-full glass border-r border-white/10 flex flex-col z-20 transition-all">
      <div className="p-10 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center space-x-4 mb-4">
          <Settings2 className="w-8 h-8 text-neonPink" />
          <h2 className="font-black text-white uppercase tracking-[0.2em] text-xl">Control Panel</h2>
        </div>
        <p className="text-xs text-white/40 font-mono tracking-widest uppercase">Hardware level logic configuration</p>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-10">
        {/* Advanced Analytics Trigger */}
        <button 
          onClick={() => setIsComparisonOpen(true)}
          className="w-full flex items-center justify-between p-6 bg-neonPink/10 border-2 border-neonPink/30 rounded-2xl group hover:bg-neonPink/20 transition-all shadow-[0_8px_30px_rgba(255,0,127,0.15)] hover:scale-[1.02]"
        >
          <div className="flex items-center space-x-5">
            <LineChart className="w-10 h-10 text-neonPink" />
            <div className="text-left">
              <span className="block text-lg font-black text-white uppercase tracking-tighter">Open Analytics</span>
              <span className="block text-[10px] text-neonPink/60 uppercase font-mono tracking-[0.2em] mt-1">Comparative Insights</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-neonPink/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-neonPink group-hover:text-black transition-all">
            <Zap className="w-5 h-5" />
          </div>
        </button>

        <StressTestPanel />

        <section className="space-y-6 p-8 rounded-2xl bg-neonPink/5 border-2 border-neonPink/20">
          <div className="flex items-center space-x-3 text-neonPink">
            <Target className="w-6 h-6" />
            <label className="text-sm font-black uppercase tracking-[0.1em]">Address Console</label>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Manual Injection</span>
              <div className="flex space-x-3">
                <input 
                  type="text"
                  value={manualAddr}
                  onChange={(e) => setManualAddr(e.target.value)}
                  className="flex-1 bg-black/60 border-2 border-white/10 rounded-xl px-5 py-4 text-lg text-neonPink focus:border-neonPink outline-none font-mono transition-all"
                  placeholder="0x..."
                />
                <button 
                  onClick={() => requestAddress(manualAddr)}
                  className="p-4 border-2 border-neonPink/30 rounded-xl hover:bg-neonPink text-neonPink hover:text-white transition-all"
                >
                  <Zap className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Pattern Generation</span>
              <div className="grid grid-cols-3 gap-3">
                {['Manual', 'Linear', 'Cyclic'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPatternMode(mode as any)}
                    className={cn(
                      "py-3 text-[10px] uppercase font-black border-2 rounded-xl transition-all",
                      patternMode === mode 
                        ? "border-neonPink bg-neonPink/20 text-neonPink"
                        : "border-white/5 bg-white/5 text-white/20 hover:border-white/20 hover:text-white"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cache Params */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-white">
            <Database className="w-6 h-6" />
            <label className="text-sm font-black uppercase tracking-[0.1em]">Replacement Policy</label>
          </div>
          <select 
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            className="w-full bg-midnight border-2 border-white/10 rounded-xl px-6 py-4 text-base text-white focus:border-neonPink outline-none transition-all appearance-none cursor-pointer"
          >
            <option>LRU</option>
            <option>FIFO</option>
            <option>ML-Driven</option>
          </select>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-3 text-white">
            <Layers className="w-6 h-6" />
            <label className="text-sm font-black uppercase tracking-[0.1em]">Set Associativity</label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Direct', '2-way', '4-way', 'Full'].map((opt) => (
              <button
                key={opt}
                onClick={() => setAssociativity(opt)}
                className={cn(
                  "py-4 text-xs uppercase font-black border-2 transition-all duration-200 rounded-xl",
                  associativity === opt 
                    ? "border-neonPink bg-neonPink/10 text-neonPink shadow-[0_0_15px_rgba(255,0,127,0.3)]"
                    : "border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:text-white"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* System Terminal */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3 text-white/30">
            <Terminal className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.2em] font-black">Trace Console</span>
          </div>
          <div className="h-48 p-5 bg-black/60 border-2 border-white/5 rounded-2xl font-mono text-[11px] text-white/50 leading-relaxed overflow-y-auto custom-scrollbar">
            <div className="text-green-500/80 mb-2 font-black">{`[SYSTEM_BOOT_SUCCESS]`}</div>
            {`> kernel_ready: TRUE`} <br/>
            {`> pattern_engine: ${patternMode.toLowerCase()}`} <br/>
            {`> policy_hook: ${policy}_LOADED`} <br/>
            <div className="mt-4 border-t border-white/5 pt-4 text-[9px] text-neonPink font-black tracking-widest uppercase">
              Streaming trace data...
            </div>
            {`> set_0x04: miss_event_classification`}
          </div>
        </section>
      </div>

      <div className="p-10 mt-auto space-y-4 bg-white/[0.02] border-t border-white/10">
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={cn(
            "w-full flex items-center justify-center space-x-4 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-sm transition-all duration-300 hover:scale-[1.02]",
            isSimulating
              ? "bg-red-500 border-2 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              : "bg-neonPink border-2 border-neonPink text-white shadow-[0_0_25px_rgba(255,0,127,0.5)]"
          )}
        >
          <Play className={cn("w-6 h-6", isSimulating ? "fill-white" : "fill-white")} />
          <span>{isSimulating ? 'Terminate Eng' : 'Launch Simulation'}</span>
        </button>
        <button 
          onClick={resetSimulation}
          className="w-full py-4 text-xs uppercase font-black text-white/20 hover:text-neonPink transition-colors tracking-widest"
        >
          Factory Reset State
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
