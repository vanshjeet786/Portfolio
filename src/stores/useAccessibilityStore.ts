import { create } from 'zustand';

export interface AccessibilityStoreState {
  prefersReducedMotion: boolean;
  highContrastEnabled: boolean;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
}

export const useAccessibilityStore = create<AccessibilityStoreState>((set) => ({
  prefersReducedMotion: false,
  highContrastEnabled: false,
  setReducedMotion: (prefersReducedMotion) => set({ prefersReducedMotion }),
  setHighContrast: (highContrastEnabled) => set({ highContrastEnabled }),
}));
