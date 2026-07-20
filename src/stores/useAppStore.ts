import { create } from 'zustand';

export interface AppStoreState {
  theme: 'light' | 'dark';
  isAssetLoading: boolean;
  assetLoadingProgress: number;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setAssetLoadingState: (loading: boolean, progress: number) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  theme: 'dark',
  isAssetLoading: false,
  assetLoadingProgress: 0,
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),
  setAssetLoadingState: (isAssetLoading, assetLoadingProgress) =>
    set({ isAssetLoading, assetLoadingProgress }),
}));
