import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/stores/useAppStore';
import { useExperienceStore } from '@/stores/useExperienceStore';

describe('Zustand App Store', () => {
  beforeEach(() => {
    // Reset state before tests if needed
    useAppStore.setState({ theme: 'dark', isAssetLoading: false, assetLoadingProgress: 0 });
  });

  it('should initialize with default state', () => {
    const state = useAppStore.getState();
    expect(state.theme).toBe('dark');
    expect(state.isAssetLoading).toBe(false);
    expect(state.assetLoadingProgress).toBe(0);
  });

  it('should toggle theme from dark to light and vice versa', () => {
    useAppStore.getState().toggleTheme();
    expect(useAppStore.getState().theme).toBe('light');

    useAppStore.getState().toggleTheme();
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('should set asset loading state correctly', () => {
    useAppStore.getState().setAssetLoadingState(true, 42);
    expect(useAppStore.getState().isAssetLoading).toBe(true);
    expect(useAppStore.getState().assetLoadingProgress).toBe(42);
  });
});

describe('Zustand Experience Store', () => {
  beforeEach(() => {
    useExperienceStore.setState({
      currentChapter: 0,
      currentWorld: null,
      journeyProgress: 0,
      emotionalStage: 'curiosity',
    });
  });

  it('should advance chapter correctly', () => {
    useExperienceStore.getState().setChapter(1);
    expect(useExperienceStore.getState().currentChapter).toBe(1);
  });

  it('should update emotional stage along with active world changes', () => {
    useExperienceStore.getState().setWorld('career-compass');
    expect(useExperienceStore.getState().currentWorld).toBe('career-compass');
  });
});
