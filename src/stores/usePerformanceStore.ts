import { create } from 'zustand';

export type PerformanceTier = 'low' | 'medium' | 'high';

export interface PerformanceStoreState {
  fps: number;
  memoryUsage: number;
  performanceTier: PerformanceTier;
  setPerformanceStats: (fps: number, memory: number) => void;
  setPerformanceTier: (tier: PerformanceTier) => void;
}

export const usePerformanceStore = create<PerformanceStoreState>((set) => ({
  fps: 60,
  memoryUsage: 0,
  performanceTier: 'high',
  setPerformanceStats: (fps, memoryUsage) => set({ fps, memoryUsage }),
  setPerformanceTier: (performanceTier) => set({ performanceTier }),
}));
