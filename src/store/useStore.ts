import { create } from 'zustand';

interface StoreState {
  visitedSections: string[];
  currentSection: string;
  addVisitedSection: (sectionId: string) => void;
  setCurrentSection: (sectionId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  visitedSections: ['home'],
  currentSection: 'home',
  addVisitedSection: (sectionId) =>
    set((state) => ({
      visitedSections: state.visitedSections.includes(sectionId)
        ? state.visitedSections
        : [...state.visitedSections, sectionId],
    })),
  setCurrentSection: (sectionId) =>
    set(() => ({
      currentSection: sectionId,
    })),
}));
