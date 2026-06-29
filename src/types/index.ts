import type { ReactNode } from 'react';

export type ViewMode = 'landing' | 'dashboard';

export type LayoutProps = {
  children: ReactNode;
  viewMode: ViewMode;
};

export type CacheBlock = {
  id: number;
  tag: string;
  setIndex: number;
  isValid: boolean;
  isDirty: boolean;
  predictiveRRI: number; // 0 (likely to be reused soon) to 7 (unlikely)
  accessFrequency: number;
  mlConfidence: number;
  lastAccess: number;
  isGoldenGlow?: boolean;
};

export type SimulationStats = {
  hits: number;
  misses: number;
  hitRate: number;
  lruHitRate: number;
  optimalHitRate: number;
  latency: number;
  confidence: number;
  history: {
    cycle: number;
    ml: number;
    lru: number;
    optimal: number;
  }[];
  conflictMisses: number;
  capacityMisses: number;
  powerCost: number; // in mW
};

export type LogEntry = {
  time: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ml';
};

export type PlaybackState = {
  isPaused: boolean;
  speed: number;
};
