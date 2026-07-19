import { create } from 'zustand';

export interface ExperienceStoreState {
  currentChapter: number;
  currentWorld: string | null;
  journeyProgress: number;
  emotionalStage: string;
  setChapter: (chapter: number) => void;
  setWorld: (world: string | null) => void;
  setJourneyProgress: (progress: number) => void;
  setEmotionalStage: (stage: string) => void;
}

export const useExperienceStore = create<ExperienceStoreState>((set) => ({
  currentChapter: 0,
  currentWorld: null,
  journeyProgress: 0,
  emotionalStage: 'curiosity',
  setChapter: (currentChapter) => set({ currentChapter }),
  setWorld: (currentWorld) => set({ currentWorld }),
  setJourneyProgress: (journeyProgress) => set({ journeyProgress }),
  setEmotionalStage: (emotionalStage) => set({ emotionalStage }),
}));
