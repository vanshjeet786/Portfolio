import { create } from 'zustand';

interface LoadStoreState {
  introLoaded: boolean;
  compassLoaded: boolean;
  isFirstTwoScenesLoaded: boolean;
  preloadingStarted: boolean;
  progress: number;
  statusText: string;
  setIntroLoaded: (loaded: boolean) => void;
  setCompassLoaded: (loaded: boolean) => void;
  setPreloadingStarted: (started: boolean) => void;
  setProgress: (progress: number) => void;
  setStatusText: (text: string) => void;
}

export const useLoadStore = create<LoadStoreState>((set) => ({
  introLoaded: false,
  compassLoaded: false,
  isFirstTwoScenesLoaded: false,
  preloadingStarted: false,
  progress: 0,
  statusText: 'Initializing portfolio...',
  setIntroLoaded: (loaded) =>
    set((state) => {
      const isFirstTwoScenesLoaded = loaded && state.compassLoaded;
      return {
        introLoaded: loaded,
        isFirstTwoScenesLoaded,
      };
    }),
  setCompassLoaded: (loaded) =>
    set((state) => {
      const isFirstTwoScenesLoaded = state.introLoaded && loaded;
      return {
        compassLoaded: loaded,
        isFirstTwoScenesLoaded,
      };
    }),
  setPreloadingStarted: (preloadingStarted) => set({ preloadingStarted }),
  setProgress: (progress) => set({ progress }),
  setStatusText: (statusText) => set({ statusText }),
}));
