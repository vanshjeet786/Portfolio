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
      if (useStore.getState().isModalOpen) return;

      // Calculate dynamic friction based on proximity to nearest scene center
      const totalScenes = SCENE_COUNT;
      const segmentSize = 1 / (totalScenes - 1);
      const nearestIndex = Math.round(targetProgress / segmentSize);
      const nearestProgress = nearestIndex * segmentSize;

      const distanceToNearest = Math.abs(targetProgress - nearestProgress);
      const stanceProgress = 7 / (totalScenes - 1);
      const distanceToStance = Math.abs(targetProgress - stanceProgress);
      const stanceRange = segmentSize * 0.72;
      const stanceSlowdown = distanceToStance < stanceRange
        ? 0.52 + 0.48 * (distanceToStance / stanceRange)
        : 1;

      // Normalize wheel delta and slow down near Stance so the model has room to settle.
      const baseDelta = e.deltaY * 0.000105 * stanceSlowdown;

      // If we are within 20% of a segment to the center, apply friction
      const frictionThreshold = segmentSize * 0.2;
      let frictionMultiplier = 1;

      if (distanceToNearest < frictionThreshold) {
        // Friction increases as distance decreases. Max friction is 70% reduction (multiplier = 0.3)
        // distanceToNearest / frictionThreshold is 0 at center, 1 at edge
        frictionMultiplier = 0.3 + 0.7 * (distanceToNearest / frictionThreshold);
      }

      const adjustedDelta = baseDelta * frictionMultiplier;

      targetProgress = Math.max(0, Math.min(1, targetProgress + adjustedDelta));
      lastWheelTime = Date.now();
      isScrolling = true;
      
      // Start ambient audio on first scroll interaction
      if (!hasStartedAudio) {
        SoundEngine.startAmbientDrone();
        hasStartedAudio = true;
      }
    };

    const handleSceneJump = (event: Event) => {
      const { progress } = (event as CustomEvent<{ progress: number }>).detail;
      targetProgress = Math.max(0, Math.min(1, progress));
      currentProgress = targetProgress;
      isScrolling = false;
      setProgress(targetProgress);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('portfolio:jump-to-scene', handleSceneJump);
    
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
      window.removeEventListener('portfolio:jump-to-scene', handleSceneJump);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [setProgress]);

  return null;
};
