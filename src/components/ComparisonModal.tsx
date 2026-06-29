import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart, TrendingUp, Zap, HelpCircle } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { useSimulation } from '../context/SimulationContext';

const ComparisonModal: React.FC = () => {
  const { stats, isComparisonOpen, setIsComparisonOpen } = useSimulation();

  if (!isComparisonOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-12"
      >
        <motion.div
          initial={{ scale: 0.95, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full h-full max-w-7xl glass border-2 border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-[0_0_80px_rgba(255,0,127,0.3)]"
        >
          {/* Header */}
          <div className="p-12 border-b-2 border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center space-x-6">
              <div className="p-5 bg-neonPink/10 rounded-2xl border-2 border-neonPink/20 text-neonPink">
                <BarChart className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Advanced Analytics Engine</h2>
                <p className="text-sm text-white/40 font-mono tracking-[0.3em] uppercase mt-2">
                  Comparative Performance Metrics & Shadow Trace Logs
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsComparisonOpen(false)}
              className="p-4 hover:bg-white/10 rounded-full transition-all group"
            >
              <X className="w-12 h-12 text-white/20 group-hover:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-neonPink/5 border-2 border-neonPink/20 p-10 rounded-[2rem] shadow-xl">
                <span className="text-xs text-neonPink uppercase font-black tracking-widest block mb-4">ML Efficiency Rating</span>
                <span className="text-6xl font-black tracking-tighter text-white">{stats.hitRate.toFixed(1)}%</span>
                <div className="mt-6 flex items-center space-x-3 text-sm text-green-400 font-black uppercase tracking-widest">
                  <TrendingUp className="w-5 h-5" />
                  <span>+{(stats.hitRate - stats.lruHitRate).toFixed(1)}% vs LRU</span>
                </div>
              </div>
              <div className="bg-white/5 border-2 border-white/10 p-10 rounded-[2rem] shadow-xl">
                <span className="text-xs text-white/40 uppercase font-black tracking-widest block mb-4">Power Profile</span>
                <span className="text-6xl font-black tracking-tighter text-white">{stats.powerCost.toFixed(2)} <span className="text-2xl text-white/20 ml-2">mW</span></span>
                <div className="mt-6 flex items-center space-x-3 text-sm text-white/20 font-black uppercase tracking-widest">
                  <Zap className="w-5 h-5" />
                  <span>Est. Overhead Detected</span>
                </div>
              </div>
              <div className="bg-white/5 border-2 border-white/10 p-10 rounded-[2rem] shadow-xl">
                <span className="text-xs text-white/40 uppercase font-black tracking-widest block mb-4">Miss Distribution</span>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center uppercase font-mono text-xs font-black">
                    <span className="text-white/40">Conflict</span>
                    <span className="text-neonPink">{stats.conflictMisses}</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-neonPink shadow-[0_0_10px_#FF007F]" 
                      style={{ width: `${(stats.conflictMisses / (stats.conflictMisses + stats.capacityMisses || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center uppercase font-mono text-xs font-black">
                    <span className="text-white/40">Capacity</span>
                    <span className="text-slate-400">{stats.capacityMisses}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hit Rate Chart */}
            <div className="h-[500px] bg-black/40 rounded-[2.5rem] p-12 border-2 border-white/5 relative shadow-2xl">
              <div className="absolute top-10 left-12 flex items-center space-x-4">
                <TrendingUp className="w-6 h-6 text-white/20" />
                <h3 className="text-xs uppercase font-black text-white/40 tracking-[0.4em]">Cumulative Hit Rate (%) Pipeline</h3>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.history} margin={{ top: 40, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="cycle" hide />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 12, fill: '#666', fontWeight: 900 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '2px solid #333', borderRadius: '16px', fontSize: '12px', padding: '15px', fontWeight: 900 }}
                  />
                  <Legend verticalAlign="top" height={60} iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 900 }} />
                  <Line 
                    name="ML-Driven Engine"
                    type="monotone" 
                    dataKey="ml" 
                    stroke="#FF007F" 
                    strokeWidth={5}
                    dot={false}
                  />
                  <Line 
                    name="LRU Legacy Base"
                    type="monotone" 
                    dataKey="lru" 
                    stroke="#666" 
                    strokeDasharray="10 10"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line 
                    name="Belady Optimal"
                    type="monotone" 
                    dataKey="optimal" 
                    stroke="#00F0FF" 
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Lower Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12">
              <div className="bg-white/5 rounded-[2rem] p-10 border-2 border-white/5 space-y-8 flex flex-col justify-center">
                 <h4 className="text-sm uppercase font-black tracking-[0.4em] text-white/20 border-b-2 border-white/5 pb-6 flex items-center justify-between">
                    Shadow Architecture Log
                    <HelpCircle className="w-6 h-6" />
                 </h4>
                 <div className="space-y-6 font-mono text-xs text-white/40 leading-relaxed">
                   <div className="flex space-x-6">
                     <span className="text-neonPink font-black">[ML]</span>
                     <span>Predictor suppressed eviction of 0xAF20 (Recency High, Frequency Mid)</span>
                   </div>
                   <div className="flex space-x-6">
                     <span className="text-slate-500 font-black">[LRU]</span>
                     <span>Evicted 0xAF20 due to linear recency threshold check</span>
                   </div>
                   <div className="flex space-x-6 border-t border-white/10 pt-6">
                     <span className="text-yellow-500 font-black">[GAIN]</span>
                     <span className="text-white">Prevented cache-miss on cycle T+1 (Intelligent Pre-warm)</span>
                   </div>
                 </div>
              </div>

              <div className="bg-neonPink/5 rounded-[2rem] p-12 border-2 border-dashed border-neonPink/20 flex flex-col items-center justify-center text-center space-y-8">
                <div className="p-6 bg-white/5 rounded-full border-2 border-white/10">
                  <TrendingUp className="w-12 h-12 text-neonPink" />
                </div>
                <div>
                   <h4 className="text-2xl font-black uppercase tracking-widest text-white">Generate Session Report</h4>
                   <p className="text-sm text-white/30 max-w-sm mt-4 italic leading-relaxed">
                     Compile trace logs, hit-rate deltas, and power metrics into a formal binary-ready report.
                   </p>
                </div>
                <div className="flex space-x-6">
                  <button className="px-12 py-5 bg-neonPink text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_#FF007F]">
                    Export JSON
                  </button>
                  <button className="px-12 py-5 border-2 border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                    PDF Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComparisonModal;
