import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Activity, Brain, Fingerprint } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const BlockInspector: React.FC = () => {
  const { blocks, activeBlockId, setActiveBlockId } = useSimulation();
  
  const block = activeBlockId !== null ? blocks[activeBlockId] : null;

  return (
    <AnimatePresence>
      {block && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 w-80 h-full glass border-l border-white/10 z-[70] shadow-2xl flex flex-col pt-12"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cpu className="w-5 h-5 text-neonPink" />
              <h3 className="font-bold uppercase tracking-widest text-sm">Block Inspector</h3>
            </div>
            <button 
              onClick={() => setActiveBlockId(null)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white/40" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-white/30">
                <Fingerprint className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Identification</span>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-white/5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[11px] text-white/40 uppercase">Tag Address</span>
                  <span className="text-neonPink font-mono font-bold">{block.tag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-white/40 uppercase">Set Index</span>
                  <span className="text-white font-mono">{block.setIndex}</span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-white/30">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Real-Time Metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                  <span className="block text-[8px] text-white/30 uppercase mb-1">Access Freq</span>
                  <span className="text-xl font-bold">{block.accessFrequency}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                  <span className="block text-[8px] text-white/30 uppercase mb-1">Status</span>
                  <span className={`text-[10px] font-bold ${block.isValid ? 'text-green-500' : 'text-red-500'}`}>
                    {block.isValid ? 'VALID' : 'INVALID'}
                  </span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center space-x-2 text-white/30">
                <Brain className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">ML Prediction</span>
              </div>
              <div className="bg-neonPink/5 p-4 rounded-lg border border-neonPink/20 space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] text-neonPink/60 uppercase font-bold">Confidence Score</span>
                    <span className="text-neonPink font-mono text-[10px]">{Math.round(block.mlConfidence)}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${block.mlConfidence}%` }}
                      className="h-full bg-neonPink" 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5">
                  <span className="text-[9px] text-white/40 uppercase">Predictive RRI</span>
                  <span className="text-sm font-bold text-neonPink">{block.predictiveRRI}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="p-6 mt-auto border-t border-white/10 bg-black/20 italic text-[9px] text-white/20">
            {`> Memory line trace initialized...`} <br/>
            {`> Ready for hardware debug.`}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlockInspector;
