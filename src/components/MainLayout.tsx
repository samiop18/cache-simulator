import React from 'react';
import CacheVisualizer from './CacheVisualizer';
import LiveMetrics from './LiveMetrics';

const MainLayout: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Main Center Area - Cache State Visualizer */}
      <div className="col-span-12 lg:col-span-8 h-full flex flex-col">
        <CacheVisualizer />
      </div>

      {/* Right Side - Live Metrics */}
      <div className="col-span-12 lg:col-span-4 h-full flex flex-col">
        <LiveMetrics />
      </div>
    </div>
  );
};

export default MainLayout;
