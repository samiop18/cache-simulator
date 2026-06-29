import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Zap, ShieldCheck, BrainCircuit, Activity, BarChart3, Database, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

const SideBadge: React.FC<{ Icon: LucideIcon; label: string }> = ({ Icon, label }) => (
  <motion.div 
    whileHover={{ x: -10, color: '#FF007F' }}
    className="flex items-center space-x-6 text-neonPink/40 transition-colors group cursor-pointer"
  >
    <div className="p-5 border border-neonPink/20 rounded-2xl bg-neonPink/5 group-hover:border-neonPink shadow-[0_0_15px_rgba(255,0,127,0.1)] transition-all">
      <Icon size={28} />
    </div>
    <div className="flex flex-col text-left">
      <span className="text-xs uppercase tracking-[0.4em] font-black text-white/60 group-hover:text-neonPink transition-colors">{label}</span>
      <span className="text-[9px] text-neonPink/30 uppercase font-mono tracking-widest mt-1">LINK: STABLE</span>
    </div>
  </motion.div>
);

const RightSideBadge: React.FC<{ Icon: LucideIcon; label: string }> = ({ Icon, label }) => (
  <motion.div 
    whileHover={{ x: 10, color: '#FF007F' }}
    className="flex items-center flex-row-reverse space-x-reverse space-x-6 text-neonPink/40 transition-colors group cursor-pointer"
  >
    <div className="p-5 border border-neonPink/20 rounded-2xl bg-neonPink/5 group-hover:border-neonPink shadow-[0_0_15px_rgba(255,0,127,0.1)] transition-all">
      <Icon size={28} />
    </div>
    <div className="flex flex-col text-right">
      <span className="text-xs uppercase tracking-[0.4em] font-black text-white/60 group-hover:text-neonPink transition-colors">{label}</span>
      <span className="text-[9px] text-neonPink/30 uppercase font-mono tracking-widest mt-1">LINK: STABLE</span>
    </div>
  </motion.div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; delay: number }> = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="bg-white/[0.02] border border-white/5 p-12 rounded-[2rem] group hover:bg-white/[0.04] transition-all text-center md:text-left shadow-2xl relative overflow-hidden"
  >
    <div className="text-neonPink/60 mb-8 flex justify-center md:justify-start scale-125">{icon}</div>
    <h3 className="text-white font-black uppercase text-lg tracking-widest mb-4">{title}</h3>
    <p className="text-white/20 text-xs leading-relaxed uppercase font-mono tracking-wider">{desc}</p>
  </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden bg-black selection:bg-neonPink/30 z-10 custom-scrollbar">
      {/* Enhanced Side Badges - Middle Edges */}
      <div className="fixed left-12 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col space-y-16 z-50">
        <SideBadge Icon={Cpu} label="Hardware" />
        <SideBadge Icon={Terminal} label="Backend" />
      </div>

      <div className="fixed right-12 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col space-y-16 z-50">
        <RightSideBadge Icon={Zap} label="Response" />
        <RightSideBadge Icon={Globe} label="Access" />
      </div>

      {/* Subtle Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      {/* Hero Section - Scaled for Viewport Visibility */}
      <section className="relative w-full flex flex-col items-center justify-center px-12 pt-16 pb-12">
        <div className="relative z-10 text-center max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center space-x-12 mb-12 opacity-30">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-white" />
              <span className="text-white text-[10px] font-black uppercase tracking-[1em] whitespace-nowrap">
                System Architecture v1.1
              </span>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-white" />
            </div>

            <h1 className="flex flex-col items-center font-black uppercase tracking-[0.1em] text-white leading-[0.8] mb-12">
              <span className="text-4xl md:text-5xl tracking-[0.5em] opacity-80 mb-6">Intelligent</span>
              <span className="text-7xl md:text-[8rem] text-neonPink drop-shadow-[0_0_20px_rgba(255,0,127,0.3)]">Memory</span>
              <span className="text-7xl md:text-[8rem] text-neonPink drop-shadow-[0_0_20px_rgba(255,0,127,0.3)]">Systems</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col items-center"
          >
            <motion.button
              onClick={onLaunch}
              whileHover={{ scale: 1.05, boxShadow: "0_0_50px_rgba(255,0,127,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-16 py-8 bg-neonPink/10 border-2 border-neonPink text-neonPink font-black uppercase tracking-[0.8em] text-sm overflow-hidden rounded-2xl transition-all hover:bg-neonPink hover:text-white"
            >
              <span className="relative z-10 group-hover:animate-glitch">
                [ Enter Simulation ]
              </span>
            </motion.button>
            
            <div className="mt-12 flex items-center space-x-6 text-[10px] text-white/20 uppercase font-mono tracking-[0.3em] bg-white/[0.01] px-8 py-4 rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-neonPink/40" />
              <span>Authorization Verified</span>
              <span className="text-white/5 mx-2">|</span>
              <span className="text-white/40 font-black tracking-normal">SYS_ID: 0x792FE</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative w-full max-w-7xl px-12 py-24 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <FeatureCard 
            icon={<BrainCircuit size={48} />} 
            title="Predictive RRI" 
            desc="Heuristic-based re-reference prediction logic."
            delay={0.1}
          />
          <FeatureCard 
            icon={<BarChart3 size={48} />} 
            title="Analytics" 
            desc="Comparative metrics against LRU and Optimal."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Activity size={48} />} 
            title="Telemetry" 
            desc="Real-time power and throughput profiling."
            delay={0.3}
          />
          <FeatureCard 
            icon={<Database size={48} />} 
            title="Workload" 
            desc="Industrial-grade stress testing at scale."
            delay={0.4}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.02] py-24 px-12 bg-black/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-16 md:space-y-0 opacity-40">
           <div className="flex flex-col space-y-4 text-center md:text-left">
             <h4 className="text-white text-xs font-black uppercase tracking-[0.5em]">Simulated Environment Active</h4>
             <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-mono">Kernel v4.2.0-stable // Neural Layer Connected</p>
           </div>
           
           <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-right space-y-4">
             <p className="font-black text-white">PROJECT: INTELLIGENT MEMORY SIMULATOR</p>
             <p className="text-neonPink">STABLE BUILD 01.12.2026 // SYSTEM_ID: 792FE</p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
