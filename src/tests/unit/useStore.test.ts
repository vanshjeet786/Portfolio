import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/stores/useStore';

describe('Zustand useStore', () => {
  beforeEach(() => {
    useStore.setState({
      progress: 0,
      activeScene: 0,
      isModalOpen: false,
    });
  });

  it('should initialize with default state', () => {
    const state = useStore.getState();
    expect(state.progress).toBe(0);
    expect(state.activeScene).toBe(0);
    expect(state.isModalOpen).toBe(false);
  });

  it('should update modal state', () => {
    useStore.getState().setModalOpen(true);
    expect(useStore.getState().isModalOpen).toBe(true);
    useStore.getState().setModalOpen(false);
    expect(useStore.getState().isModalOpen).toBe(false);
  });
});
