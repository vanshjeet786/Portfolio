import React, { useEffect, useRef } from 'react';
import { ScrollEngine } from '@/systems/ScrollEngine';
import { useInteractionStore } from '@/stores/useInteractionStore';

interface ScrollManagerProps {
  enabled?: boolean;
}

/**
 * ScrollManager
 * Mounts the ScrollEngine and syncs its state with InteractionStore.
 */
export const ScrollManager: React.FC<ScrollManagerProps> = ({ enabled = true }) => {
  const engineRef = useRef<ScrollEngine | null>(null);
  const setScrollProgress = useInteractionStore((state) => state.setScrollProgress);

  useEffect(() => {
    if (!enabled) return;

    const engine = new ScrollEngine();
    engine.init();
    engineRef.current = engine;

    let rafId: number;
    const tick = (time: number) => {
      engine.update(time);
      setScrollProgress(engine.getProgress());
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      engine.destroy();
      engineRef.current = null;
    };
  }, [enabled, setScrollProgress]);

  return null;
};
