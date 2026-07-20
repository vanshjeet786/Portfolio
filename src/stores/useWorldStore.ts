import { create } from 'zustand';

export interface WorldStoreState {
  loadedWorlds: string[];
  activeWorld: string | null;
  warmingWorld: string | null;
  registerWorldLoaded: (worldName: string) => void;
  registerWorldUnloaded: (worldName: string) => void;
  setActiveWorld: (worldName: string | null) => void;
  setWarmingWorld: (worldName: string | null) => void;
}

export const useWorldStore = create<WorldStoreState>((set) => ({
  loadedWorlds: [],
  activeWorld: null,
  warmingWorld: null,
  registerWorldLoaded: (worldName) =>
    set((state) => ({
      loadedWorlds: state.loadedWorlds.includes(worldName)
        ? state.loadedWorlds
        : [...state.loadedWorlds, worldName],
    })),
  registerWorldUnloaded: (worldName) =>
    set((state) => ({
      loadedWorlds: state.loadedWorlds.filter((w) => w !== worldName),
    })),
  setActiveWorld: (activeWorld) => set({ activeWorld }),
  setWarmingWorld: (warmingWorld) => set({ warmingWorld }),
}));
