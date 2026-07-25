import { create } from 'zustand';

interface StoreState {
  progress: number;
  setProgress: (progress: number) => void;
  jumpToScene: (index: number) => void;
  activeScene: number;
  setActiveScene: (index: number) => void;
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

// Defines the total number of sequential scenes
// 0: Home, 1: Compass, 2: Void, 3: Skillometer, 4: Void, 5: Stance, 6: Void, 7: Ethereal Network
export const SCENE_COUNT = 10;

export const useStore = create<StoreState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress: Math.max(0, Math.min(1, progress)) }),
  jumpToScene: (index) => {
    const boundedIndex = Math.max(0, Math.min(SCENE_COUNT - 1, index));
    const progress = boundedIndex / (SCENE_COUNT - 1);
    set({ progress, activeScene: boundedIndex });
    window.dispatchEvent(new CustomEvent('portfolio:jump-to-scene', { detail: { progress } }));
  },
  activeScene: 0,
  setActiveScene: (activeScene) => set({ activeScene }),
  isModalOpen: false,
  setModalOpen: (isModalOpen) => set({ isModalOpen }),
}));
