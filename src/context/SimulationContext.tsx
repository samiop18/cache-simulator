import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { CacheBlock, SimulationStats, LogEntry, PlaybackState } from '../types';

interface SimulationContextType {
  blocks: CacheBlock[];
  stats: SimulationStats;
  logs: LogEntry[];
  playback: PlaybackState;
  activeBlockId: number | null;
  setActiveBlockId: (id: number | null) => void;
  requestAddress: (address: string) => void;
  resetSimulation: () => void;
  setPlayback: (state: Partial<PlaybackState>) => void;
  lastAccessId: number | null;
  lastResult: 'hit' | 'miss' | null;
  isComparisonOpen: boolean;
  setIsComparisonOpen: (open: boolean) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const CACHE_SIZE = 64;

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blocks, setBlocks] = useState<CacheBlock[]>(() => 
    Array.from({ length: CACHE_SIZE }, (_, i) => ({
      id: i,
      tag: '0x0000',
      setIndex: i,
      isValid: false,
      isDirty: false,
      predictiveRRI: 7,
      accessFrequency: 0,
      mlConfidence: 0,
      lastAccess: 0,
      isGoldenGlow: false
    }))
  );

  const [stats, setStats] = useState<SimulationStats>({
    hits: 0,
    misses: 0,
    hitRate: 0,
    lruHitRate: 0,
    optimalHitRate: 0,
    latency: 0,
    confidence: 89,
    history: [],
    conflictMisses: 0,
    capacityMisses: 0,
    powerCost: 0
  });

  const [playback, setPlaybackState] = useState<PlaybackState>({
    isPaused: false,
    speed: 1
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null);
  const [lastAccessId, setLastAccessId] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<'hit' | 'miss' | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const cycleRef = useRef(0);
  const lruCacheRef = useRef<string[]>([]);
  const lruStatsRef = useRef({ hits: 0, misses: 0 });
  const optimalStatsRef = useRef({ hits: 0, misses: 0 });

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    setLogs(prev => [{ time, message, type }, ...prev].slice(0, 50));
  }, []);

  const predictRRI = (block: CacheBlock): number => {
    const freqWeight = block.accessFrequency * 0.5;
    const recencyWeight = (cycleRef.current - block.lastAccess) * -0.1;
    const score = freqWeight + recencyWeight;
    if (score > 10) return 0;
    if (score > 5) return 1;
    if (score > 2) return 3;
    return 7;
  };

  const requestAddress = useCallback((address: string) => {
    if (playback.isPaused) return;

    cycleRef.current += 1;
    const tag = address.slice(0, 4);

    // 1. LRU Baseline
    const lruIndex = lruCacheRef.current.indexOf(tag);
    if (lruIndex !== -1) {
      lruStatsRef.current.hits += 1;
      lruCacheRef.current.splice(lruIndex, 1);
      lruCacheRef.current.unshift(tag);
    } else {
      lruStatsRef.current.misses += 1;
      lruCacheRef.current.unshift(tag);
      if (lruCacheRef.current.length > CACHE_SIZE) lruCacheRef.current.pop();
    }

    // 2. Optimal Baseline (Belady - Mocked for real-time behavior)
    // In a real simulator, we'd need future access info. 
    // Here we simulate it being slightly better than ML initially, then capped.
    const isOptimalHit = Math.random() > 0.15; // 85% optimal hit rate ceiling mock
    if (isOptimalHit) optimalStatsRef.current.hits += 1;
    else optimalStatsRef.current.misses += 1;

    // 3. Main ML Simulation
    setBlocks(prevBlocks => {
      const hitIndex = prevBlocks.findIndex(b => b.isValid && b.tag === tag);
      const newBlocks = [...prevBlocks];

      if (hitIndex !== -1) {
        setLastAccessId(hitIndex);
        setLastResult('hit');
        
        const block = newBlocks[hitIndex];
        newBlocks[hitIndex] = {
          ...block,
          accessFrequency: block.accessFrequency + 1,
          lastAccess: cycleRef.current,
          predictiveRRI: Math.max(0, block.predictiveRRI - 1),
          mlConfidence: Math.min(100, block.mlConfidence + (Math.random() * 5)),
          isGoldenGlow: false
        };

        setStats(s => {
          const newHits = s.hits + 1;
          const total = newHits + s.misses;
          const hitRate = (newHits / total) * 100;
          const shadowTotal = lruStatsRef.current.hits + lruStatsRef.current.misses;
          const lruRate = (lruStatsRef.current.hits / shadowTotal) * 100;
          const optTotal = optimalStatsRef.current.hits + optimalStatsRef.current.misses;
          const optRate = (optimalStatsRef.current.hits / optTotal) * 100;

          return {
            ...s,
            hits: newHits,
            hitRate,
            lruHitRate: lruRate,
            optimalHitRate: optRate,
            latency: 1.2,
            confidence: Math.min(98, s.confidence + (Math.random() * 0.5)),
            powerCost: s.powerCost + 0.05,
            history: [...s.history, { cycle: cycleRef.current, ml: hitRate, lru: lruRate, optimal: optRate }].slice(-50)
          };
        });

        return newBlocks;
      } else {
        setLastResult('miss');
        
        // Categorize Miss
        const isCapacity = prevBlocks.every(b => b.isValid);
        
        let victimIndex = prevBlocks.findIndex(b => !b.isValid);
        let intelligentEviction = false;

        if (victimIndex === -1) {
          const rrisedBlocks = prevBlocks.map(b => ({ ...b, predictiveRRI: predictRRI(b) }));
          victimIndex = rrisedBlocks.reduce((maxIdx, b, idx, arr) => b.predictiveRRI > arr[maxIdx].predictiveRRI ? idx : maxIdx, 0);
          intelligentEviction = rrisedBlocks[victimIndex].predictiveRRI >= 7;
        }

        setLastAccessId(victimIndex);

        newBlocks[victimIndex] = {
          id: victimIndex,
          tag: tag,
          setIndex: victimIndex,
          isValid: true,
          isDirty: false,
          predictiveRRI: 3, 
          accessFrequency: 1,
          mlConfidence: 70 + Math.random() * 15,
          lastAccess: cycleRef.current,
          isGoldenGlow: intelligentEviction
        };

        setStats(s => {
          const newMisses = s.misses + 1;
          const total = s.hits + newMisses;
          const hitRate = (s.hits / total) * 100;
          const shadowTotal = lruStatsRef.current.hits + lruStatsRef.current.misses;
          const lruRate = (lruStatsRef.current.hits / shadowTotal) * 100;
          const optTotal = optimalStatsRef.current.hits + optimalStatsRef.current.misses;
          const optRate = (optimalStatsRef.current.hits / optTotal) * 100;

          return {
            ...s,
            misses: newMisses,
            hitRate,
            lruHitRate: lruRate,
            optimalHitRate: optRate,
            conflictMisses: s.conflictMisses + (isCapacity ? 0 : 1),
            capacityMisses: s.capacityMisses + (isCapacity ? 1 : 0),
            latency: 45.5,
            confidence: victimIndex === -1 ? Math.max(75, s.confidence - 2) : s.confidence,
            powerCost: s.powerCost + 0.25,
            history: [...s.history, { cycle: cycleRef.current, ml: hitRate, lru: lruRate, optimal: optRate }].slice(-50)
          };
        });

        return newBlocks;
      }
    });

    setTimeout(() => setLastResult(null), 1000 / playback.speed);
  }, [playback.isPaused, playback.speed, addLog]);

  const setPlayback = useCallback((state: Partial<PlaybackState>) => {
    setPlaybackState(prev => ({ ...prev, ...state }));
  }, []);

  const resetSimulation = useCallback(() => {
    setBlocks(Array.from({ length: CACHE_SIZE }, (_, i) => ({
      id: i,
      tag: '0x0000',
      setIndex: i,
      isValid: false,
      isDirty: false,
      predictiveRRI: 7,
      accessFrequency: 0,
      mlConfidence: 0,
      lastAccess: 0,
      isGoldenGlow: false
    })));
    setStats({ hits: 0, misses: 0, hitRate: 0, lruHitRate: 0, optimalHitRate: 0, latency: 0, confidence: 89, history: [], conflictMisses: 0, capacityMisses: 0, powerCost: 0 });
    setLogs([]);
    lruCacheRef.current = [];
    lruStatsRef.current = { hits: 0, misses: 0 };
    optimalStatsRef.current = { hits: 0, misses: 0 };
    cycleRef.current = 0;
    addLog('Simulation reset sequence complete.', 'info');
  }, [addLog]);

  // Global Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaybackState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      }
      if (e.code === 'KeyR') {
        resetSimulation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetSimulation]);

  return (
    <SimulationContext.Provider value={{ 
      blocks, 
      stats, 
      logs, 
      playback,
      activeBlockId, 
      setActiveBlockId, 
      requestAddress, 
      resetSimulation,
      setPlayback,
      lastAccessId,
      lastResult,
      isComparisonOpen,
      setIsComparisonOpen
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
