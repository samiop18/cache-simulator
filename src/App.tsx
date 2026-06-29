import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import MainLayout from './components/MainLayout';
import LandingPage from './components/LandingPage';
import GlobalStatusBar from './components/GlobalStatusBar';
import MouseOrb from './components/MouseOrb';
import BlockInspector from './components/BlockInspector';
import type { ViewMode } from './types';
import { SimulationProvider } from './context/SimulationContext';
import ComparisonModal from './components/ComparisonModal';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      } 
    },
    exit: { 
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden font-mono bg-black selection:bg-neonPink/30">
      {/* Persistent Global Elements */}
      <div className="blueprint-grid" />
      <div className="scanline" />
      <MouseOrb />
      <SimulationProvider>
        <BlockInspector />
        <ComparisonModal />
        <AnimatePresence mode="wait">
        {viewMode === 'landing' ? (
          <motion.div
            key="landing"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="w-full h-full"
          >
            <LandingPage onLaunch={() => setViewMode('dashboard')} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full h-full flex flex-col pt-8"
          >
            <GlobalStatusBar />
            
            <div className="flex h-full w-full">
              <motion.div variants={itemVariants}>
                <Sidebar />
              </motion.div>

              <div className="flex flex-col flex-1 min-w-0">
                <motion.div variants={itemVariants}>
                  <TopNav />
                </motion.div>
                <motion.main className="flex-1 overflow-y-auto p-6">
                  <motion.div variants={itemVariants}>
                    <MainLayout />
                  </motion.div>
                </motion.main>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </SimulationProvider>
    </div>
  );
}

export default App;
