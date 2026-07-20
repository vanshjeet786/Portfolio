import { useEffect } from 'react';
import { useStore, SCENE_COUNT } from '@/stores/useStore';
import { SoundEngine } from '@/utils/SoundEngine';

export const ScrollManager = () => {
  const { setProgress } = useStore();
  
  useEffect(() => {
    let targetProgress = useStore.getState().progress;
    let currentProgress = useStore.getState().progress;
    let animationFrameId: number;
    let hasStartedAudio = false;
    
    let lastWheelTime = Date.now();
    let isScrolling = false;
    
    const handleWheel = (e: WheelEvent) => {
      // Normalize wheel delta and adjust sensitivity
      const delta = e.deltaY * 0.00015;
      targetProgress = Math.max(0, Math.min(1, targetProgress + delta));
      lastWheelTime = Date.now();
      isScrolling = true;
      
      // Start ambient audio on first scroll interaction
      if (!hasStartedAudio) {
        SoundEngine.startAmbientDrone();
        hasStartedAudio = true;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    
    // Also try to start on click just in case
    const handleClick = () => {
      if (!hasStartedAudio) {
        SoundEngine.startAmbientDrone();
        hasStartedAudio = true;
      }
    };
    window.addEventListener('click', handleClick);

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const update = () => {
      const now = Date.now();
      
      // Magnetic Snapping Logic
      // If user hasn't scrolled for 500ms, start snapping to the nearest scene
      if (isScrolling && now - lastWheelTime > 500) {
        isScrolling = false;
      }
      
      if (!isScrolling) {
        // Calculate the nearest scene index
        const totalScenes = SCENE_COUNT;
        const segmentSize = 1 / (totalScenes - 1);
        const nearestIndex = Math.round(targetProgress / segmentSize);
        const nearestProgress = nearestIndex * segmentSize;
        
        // If we are close enough to a scene, magnetize targetProgress towards it
        const distanceToNearest = Math.abs(targetProgress - nearestProgress);
        // Magnetic threshold: snap if within 30% of the segment size
        if (distanceToNearest < segmentSize * 0.3) {
           targetProgress = lerp(targetProgress, nearestProgress, 0.02); // gentle magnetic pull
        }
      }

      // Smooth interpolation for cinematic feel
      currentProgress = lerp(currentProgress, targetProgress, 0.08);
      
      // Update procedural audio engine
      if (hasStartedAudio) {
        SoundEngine.updateAmbientDrone(currentProgress);
      }
      
      // Only update store if there's a significant change to avoid React re-renders spam
      if (Math.abs(currentProgress - useStore.getState().progress) > 0.0001) {
          setProgress(currentProgress);
      }
      
      animationFrameId = requestAnimationFrame(update);
    };
    
    update();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [setProgress]);

  return null;
};
