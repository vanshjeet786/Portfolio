/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useCallback } from 'react';
import { useExperienceStore } from '@/stores/useExperienceStore';

interface ExperienceContextType {
  currentChapter: number;
  currentWorld: string | null;
  journeyProgress: number;
  emotionalStage: string;
  advanceChapter: () => void;
  goToWorld: (worldName: string | null) => void;
  updateProgress: (progress: number) => void;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentChapter,
    currentWorld,
    journeyProgress,
    emotionalStage,
    setChapter,
    setWorld,
    setJourneyProgress,
    setEmotionalStage,
  } = useExperienceStore();

  const advanceChapter = useCallback(() => {
    setChapter(currentChapter + 1);
  }, [currentChapter, setChapter]);

  const goToWorld = useCallback(
    (worldName: string | null) => {
      setWorld(worldName);
      if (worldName) {
        // Map worlds to emotional stages as defined in specifications
        const emotionalStages: Record<string, string> = {
          'career-compass': 'hope',
          skillometer: 'understanding',
          leaderboard: 'precision',
          stance: 'calm',
          exiles: 'connection',
          creator: 'trust',
        };
        const stage = emotionalStages[worldName] || 'discovery';
        setEmotionalStage(stage);
      }
    },
    [setWorld, setEmotionalStage]
  );

  const updateProgress = useCallback(
    (progress: number) => {
      setJourneyProgress(progress);
    },
    [setJourneyProgress]
  );

  return (
    <ExperienceContext.Provider
      value={{
        currentChapter,
        currentWorld,
        journeyProgress,
        emotionalStage,
        advanceChapter,
        goToWorld,
        updateProgress,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

export const useExperience = () => {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
};
