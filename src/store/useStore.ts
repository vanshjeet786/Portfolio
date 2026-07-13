import { create } from 'zustand'

interface StoreState {
  progress: number;
  setProgress: (progress: number) => void;
  activeScene: number;
  setActiveScene: (index: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress: Math.max(0, Math.min(1, progress)) }),
  activeScene: 0,
  setActiveScene: (activeScene) => set({ activeScene }),
}))
