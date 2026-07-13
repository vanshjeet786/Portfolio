import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const ScrollManager = () => {
  const { progress, setProgress } = useStore();

  useEffect(() => {
    let targetProgress = progress;
    let currentProgress = progress;
    let animationFrameId: number;

    const handleWheel = (e: WheelEvent) => {
      // Normalize wheel delta and adjust sensitivity
      const delta = e.deltaY * 0.0001;
      targetProgress = Math.max(0, Math.min(1, targetProgress + delta));
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const update = () => {
      // Smooth interpolation for cinematic feel
      currentProgress = lerp(currentProgress, targetProgress, 0.05);

      // Only update store if there's a significant change to avoid React re-renders spam
      if (Math.abs(currentProgress - useStore.getState().progress) > 0.0001) {
          setProgress(currentProgress);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Run once on mount

  return null; // Component doesn't render anything
};
