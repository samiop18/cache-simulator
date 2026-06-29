import React, { useRef } from 'react';
import { 
  Upload, 
  Play, 
  Pause, 
  FastForward, 
  Rewind, 
  FileCode,
  AlertCircle
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { clsx } from 'clsx';

const StressTestPanel: React.FC = () => {
  const { playback, setPlayback, requestAddress, resetSimulation } = useSimulation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const addresses = content.split(/[\n,]+/).map(a => a.trim()).filter(a => a.startsWith('0x'));
      
      if (addresses.length > 0) {
        resetSimulation();
        let i = 0;
        const interval = setInterval(() => {
          if (playback.isPaused) return;
          if (i >= addresses.length) {
            clearInterval(interval);
            return;
          }
          requestAddress(addresses[i]);
          i++;
        }, 800 / playback.speed);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      <div className="bg-neonPink/5 border-2 border-neonPink/20 rounded-2xl overflow-hidden p-8 space-y-6">
        <div className="flex items-center space-x-3 text-neonPink">
          <Upload className="w-6 h-6" />
          <h3 className="text-sm font-black uppercase tracking-widest">Stress Tester</h3>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neonPink/30 bg-black/40 rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-neonPink/10 hover:border-neonPink transition-all group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
            className="hidden" 
            accept=".trace,.csv,.txt"
          />
          <div className="p-4 bg-neonPink/10 rounded-full text-neonPink group-hover:scale-110 transition-transform">
            <FileCode className="w-10 h-10" />
          </div>
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white">Upload Trace</p>
            <p className="text-[10px] text-white/20 mt-2 uppercase font-mono">.trace / .csv (0x Addresses)</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border-2 border-white/5">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-4 h-4 text-white/20" />
            <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Buffer Status</span>
          </div>
          <span className="text-[10px] text-neonPink font-mono uppercase font-black tracking-widest">Balanced</span>
        </div>
      </div>

      <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Playback Control</h3>
          <span className="text-xs font-mono text-neonPink font-black tracking-widest bg-neonPink/10 px-3 py-1 rounded-md">{playback.speed}x</span>
        </div>

        <div className="flex items-center justify-center space-x-8">
          <button 
           onClick={() => setPlayback({ speed: Math.max(0.5, playback.speed - 0.5) })}
           className="p-5 bg-white/5 border-2 border-white/10 rounded-full hover:bg-white/10 text-white/40 transition-all"
          >
            <Rewind className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setPlayback({ isPaused: !playback.isPaused })}
            className="p-8 bg-neonPink rounded-full shadow-[0_0_30px_#FF007F] hover:scale-110 transition-all text-white"
          >
            {playback.isPaused ? <Play className="w-8 h-8 fill-white" /> : <Pause className="w-8 h-8 fill-white" />}
          </button>

          <button 
            onClick={() => setPlayback({ speed: Math.min(4, playback.speed + 0.5) })}
            className="p-5 bg-white/5 border-2 border-white/10 rounded-full hover:bg-white/10 text-white/40 transition-all"
          >
            <FastForward className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[0.5, 1, 2, 4].map(s => (
            <button
              key={s}
              onClick={() => setPlayback({ speed: s })}
              className={clsx(
                "py-3 text-[10px] font-black uppercase rounded-xl border-2 transition-all",
                playback.speed === s 
                  ? "bg-neonPink border-neonPink text-white shadow-[0_0_10px_#FF007F]"
                  : "bg-white/5 border-white/10 text-white/20 hover:border-white/20 hover:text-white"
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StressTestPanel;
