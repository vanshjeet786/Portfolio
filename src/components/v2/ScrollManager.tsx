import { useEffect } from 'react';
import { useStore } from '@/stores/useStore';

export const ScrollManager = () => {
  const { setProgress } = useStore();
  
  useEffect(() => {
    let targetProgress = useStore.getState().progress;
    let currentProgress = useStore.getState().progress;
    let animationFrameId: number;
    
    const handleWheel = (e: WheelEvent) => {
      // Normalize wheel delta and adjust sensitivity
      const delta = e.deltaY * 0.00015;
      targetProgress = Math.max(0, Math.min(1, targetProgress + delta));
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const update = () => {
      // Smooth interpolation for cinematic feel
      currentProgress = lerp(currentProgress, targetProgress, 0.08);
      
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
  }, [setProgress]);

  return null;
};
