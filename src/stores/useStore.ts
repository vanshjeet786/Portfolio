import { create } from 'zustand';

interface StoreState {
  progress: number;
  setProgress: (progress: number) => void;
  activeScene: number;
  setActiveScene: (index: number) => void;
}

// Defines the total number of sequential scenes
// 0: Home, 1: Compass, 2: Void, 3: Skillometer, 4: Void, 5: Ethereal Network, 6: Void, 7: Stance
export const SCENE_COUNT = 10;

export const useStore = create<StoreState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress: Math.max(0, Math.min(1, progress)) }),
  activeScene: 0,
  setActiveScene: (activeScene) => set({ activeScene }),
}));
