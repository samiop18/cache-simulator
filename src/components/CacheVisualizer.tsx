import React from 'react';
import { Layout, Search, Hash, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import * as Tooltip from '@radix-ui/react-tooltip';

const CacheVisualizer: React.FC = () => {
  const { blocks, lastAccessId, lastResult, setActiveBlockId } = useSimulation();

  return (
    <Tooltip.Provider delayDuration={100}>
      <div className="flex-1 glass rounded-3xl border-2 border-white/10 flex flex-col overflow-hidden relative group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-neonPink/30" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-neonPink/30" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-neonPink/30" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-neonPink/30" />

        <div className="p-10 border-b-2 border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center space-x-4">
            <Layout className="w-8 h-8 text-neonPink" />
            <h3 className="font-black uppercase tracking-[0.2em] text-xl">Cache Array Visualizer</h3>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="text-white/20 hover:text-white/60 transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content 
                side="right" 
                className="z-[100] bg-black/95 border-2 border-white/10 p-8 rounded-2xl backdrop-blur-xl max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200"
              >
                <div className="space-y-6">
                  <h4 className="text-sm font-black uppercase text-neonPink border-b border-white/10 pb-4 tracking-widest">Memory Architecture Terms</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-wider">Tag Bits</p>
                      <p className="text-[10px] text-white/40 mt-2 font-mono uppercase leading-relaxed">Unique identifier for the memory block currently stored in the cache line.</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-wider">Index</p>
                      <p className="text-[10px] text-white/40 mt-2 font-mono uppercase leading-relaxed">Determines which set in the cache the memory block can be stored in.</p>
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-wider">Offset</p>
                      <p className="text-[10px] text-white/40 mt-2 font-mono uppercase leading-relaxed">Specifies the exact byte or word within a cache line.</p>
                    </div>
                  </div>
                </div>
                <Tooltip.Arrow className="fill-white/10" />
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-neonPink shadow-[0_0_15px_#FF007F]" />
              <span className="text-xs text-white/60 uppercase font-black tracking-widest">Hit</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_#EF4444]" />
              <span className="text-xs text-white/60 uppercase font-black tracking-widest">Miss</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
              <span className="text-xs text-yellow-500/80 uppercase font-black tracking-widest">Opt-Evict</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-10 overflow-y-auto">
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
            {blocks.map((block) => {
              const isLastAccessed = lastAccessId === block.id;
              const isHit = isLastAccessed && lastResult === 'hit';
              const isMiss = isLastAccessed && lastResult === 'miss';

              return (
                <Tooltip.Root key={block.id}>
                  <Tooltip.Trigger asChild>
                    <motion.div
                      onClick={() => setActiveBlockId(block.id)}
                      layoutId={`block-${block.id}`}
                      className={`
                        aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-3 transition-all duration-300 cursor-pointer relative overflow-hidden
                        ${block.isValid 
                          ? 'bg-white/5 border-white/20 hover:border-neonPink shadow-lg' 
                          : 'bg-transparent border-white/5 opacity-20 hover:opacity-40'}
                        ${block.isGoldenGlow ? 'golden-glow' : ''}
                        group/block
                      `}
                      animate={isHit ? {
                        backgroundColor: ['#FF007F40', '#FF007F80', '#FF007F40'],
                        scale: [1, 1.1, 1],
                        borderColor: '#FF007F'
                      } : isMiss ? {
                        backgroundColor: block.isGoldenGlow ? ['#FFD70040', '#FFD70080', '#FFD70040'] : ['#EF444440', '#EF444480', '#EF444440'],
                        scale: [1, 0.9, 1],
                        borderColor: block.isGoldenGlow ? '#FFD700' : '#EF4444'
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <span className={`text-sm font-black font-mono transition-colors ${block.isValid ? (isHit ? 'text-neonPink' : isMiss ? 'text-red-400' : 'text-white') : 'text-white/20'}`}>
                        {block.isValid ? block.tag : '0x----'}
                      </span>
                      <div className="mt-3 flex flex-col items-center">
                        <span className="text-[8px] text-white/30 font-mono uppercase font-black tracking-tighter">
                          RRI_LVL: {block.predictiveRRI}
                        </span>
                        <div className="w-10 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                           <div className="h-full bg-neonPink/40" style={{ width: `${(8 - block.predictiveRRI) / 8 * 100}%` }} />
                        </div>
                      </div>
                    </motion.div>
                  </Tooltip.Trigger>
                  {block.isValid && (
                    <Tooltip.Content side="top" className="bg-black/95 border-2 border-white/10 p-5 rounded-xl text-xs font-mono text-white shadow-2xl z-[110]">
                      <div className="space-y-1">
                        <p className="text-neonPink font-black border-b border-white/10 pb-2 mb-2 uppercase">Block Metadata</p>
                        <p>ID: <span className="text-white/60">{block.id.toString().padStart(2, '0')}</span></p>
                        <p>TAG: <span className="text-white/60">{block.tag}</span></p>
                        <p>FREQ: <span className="text-white/60">{block.accessFrequency} Accesses</span></p>
                      </div>
                      <Tooltip.Arrow className="fill-white/10" />
                    </Tooltip.Content>
                  )}
                </Tooltip.Root>
              );
            })}
          </div>
        </div>

        <div className="p-8 bg-black/40 border-t-2 border-white/5 flex items-center justify-between">
           <div className="flex items-center space-x-12 text-xs text-white/40 uppercase font-black tracking-[0.2em]">
              <div className="flex items-center space-x-3">
                <span className="bg-white/10 px-3 py-1 rounded-md text-white font-mono">SPACE</span>
                <span>Play / Pause</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-white/10 px-3 py-1 rounded-md text-white font-mono">KEY_R</span>
                <span>Soft Reset</span>
              </div>
           </div>
           <div className="flex items-center space-x-4 bg-neonPink/5 px-6 py-3 rounded-xl border-2 border-neonPink/20 shadow-[0_0_15px_rgba(255,0,127,0.1)]">
            <Hash className="w-5 h-5 text-neonPink" />
            <span className="text-sm font-mono text-white font-black uppercase">Active Blocks: {blocks.filter(b => b.isValid).length} / 64</span>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default CacheVisualizer;
