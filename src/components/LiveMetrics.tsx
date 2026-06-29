import React, { useMemo } from 'react';
import { Activity, BarChart3, Binary, BrainCircuit, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { clsx } from 'clsx';

const MetricCard: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode; trend?: number }> = ({ label, value, sub, icon, trend }) => (
  <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-neonPink transition-colors">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
      {icon}
    </div>
    <p className="text-xs text-white/40 uppercase font-black tracking-[0.2em] mb-3">{label}</p>
    <div className="flex items-baseline space-x-4">
      <AnimatePresence mode="wait">
        <motion.h4 
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="text-4xl font-black neon-text tracking-tighter"
        >
          {value}
        </motion.h4>
      </AnimatePresence>
      <span className={clsx(
        "text-xs font-black tracking-widest uppercase",
        trend && trend > 0 ? "text-green-400" : trend && trend < 0 ? "text-red-400" : "text-white/20"
      )}>
        {sub}
      </span>
    </div>
  </div>
);

const Sparkline: React.FC<{ data: { ml: number }[] }> = ({ data }) => {
  const points = useMemo(() => {
    if (data.length === 0) return "";
    const width = 300;
    const height = 80;
    const mlValues = data.map(d => d.ml);
    const max = Math.max(...mlValues, 100);
    const min = Math.min(...mlValues, 0);
    const range = max - min || 1;
    
    return mlValues.map((val, i) => {
      const x = (i / (mlValues.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");
  }, [data]);

  return (
    <div className="mt-8 h-20 w-full flex flex-col justify-end">
      <div className="flex justify-between text-[10px] text-white/30 uppercase mb-3 px-2 font-black tracking-[0.3em]">
        <span>ML Efficiency Pulse</span>
        <span className="text-neonPink">CALIBRATING</span>
      </div>
      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
        <motion.polyline
          fill="none"
          stroke="#FF007F"
          strokeWidth="3"
          strokeLinejoin="round"
          points={points}
          animate={{
            opacity: [0.6, 1, 0.6],
            filter: ["drop-shadow(0 0 4px #FF007F)", "drop-shadow(0 0 10px #FF007F)", "drop-shadow(0 0 4px #FF007F)"]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};

const LiveMetrics: React.FC = () => {
  const { stats, logs } = useSimulation();
  
  const delta = stats.hitRate - stats.lruHitRate;

  return (
    <div className="h-full space-y-10 flex flex-col">
      {/* Title */}
      <div className="flex items-center space-x-4 px-4">
        <Activity className="w-8 h-8 text-neonPink" />
        <h3 className="font-black uppercase tracking-[0.2em] text-xl">System Telemetry</h3>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-8">
        <MetricCard 
          label="Hit Rate" 
          value={`${stats.hitRate.toFixed(1)}%`} 
          sub={`${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% vs LRU`} 
          trend={delta}
          icon={<BarChart3 className="w-16 h-16" />} 
        />
        
        <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-neonPink transition-colors">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-white/40 uppercase font-black tracking-[0.2em] mb-4">Architecture Comparison</p>
              <div className="flex items-baseline space-x-8">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">ML Neural</span>
                  <span className="text-xl font-black text-neonPink">{stats.hitRate.toFixed(1)}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">LRU Legacy</span>
                  <span className="text-xl font-black text-white/40">{stats.lruHitRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <TrendingUp className="w-12 h-12 opacity-10 text-neonPink" />
          </div>
          <Sparkline data={stats.history} />
        </div>
      </div>

      {/* ML Insight Panel */}
      <div className="flex-1 glass-pink rounded-3xl border-2 border-neonPink/30 flex flex-col overflow-hidden shadow-[0_0_40px_rgba(255,0,127,0.1)]">
        <div className="p-8 border-b-2 border-neonPink/20 flex items-center justify-between bg-neonPink/5">
          <div className="flex items-center space-x-4">
            <BrainCircuit className="w-6 h-6 text-neonPink" />
            <h4 className="text-sm font-black uppercase text-neonPink tracking-[0.2em]">ML Replacement Engine</h4>
          </div>
          <div className="px-4 py-1.5 rounded-full border-2 border-neonPink/40 text-[10px] text-neonPink uppercase font-black animate-pulse">
            Neural Thread Active
          </div>
        </div>
        
        <div className="p-8 flex-1 space-y-8 flex flex-col">
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-white/60 uppercase font-black tracking-widest">
              <span>Predictor Confidence</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={Math.round(stats.confidence)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-neonPink font-mono font-black"
                >
                  {Math.round(stats.confidence)}%
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={false}
                animate={{ width: `${stats.confidence}%` }}
                transition={{ type: "spring", stiffness: 50 }}
                className="h-full bg-neonPink shadow-[0_0_15px_#FF007F]" 
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h5 className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em]">Neural Decision Stream</h5>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-neonPink animate-ping" />
                <span className="text-[9px] text-neonPink/60 uppercase font-black">Incoming</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col-reverse">
              {logs.map((log, i) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={`${log.time}-${i}`} 
                  className="flex space-x-4 text-[11px] font-mono leading-relaxed mb-4 last:mb-0 bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]"
                >
                  <span className="text-neonPink/40 shrink-0">[{log.time}]</span>
                  <span className={clsx(
                    "font-bold uppercase tracking-tight",
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-green-400' : 
                    log.type === 'ml' ? 'text-neonPink' :
                    log.type === 'warning' ? 'text-yellow-400' : 'text-white/60'
                  )}>
                    {log.message}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMetrics;
