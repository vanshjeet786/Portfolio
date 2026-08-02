import { useEffect, useRef, useState } from 'react';
import { useLoadStore } from '@/stores/useLoadStore';
import gsap from 'gsap';
import { ContourLines } from './ContourLines';
import { CornerCounter } from './CornerCounter';

export const TopographicLoader = () => {
  const { progress, isFirstTwoScenesLoaded } = useLoadStore();
  const [shouldRender, setShouldRender] = useState(true);
  const [isFracturing, setIsFracturing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When the progress is nominally complete
    if (isFirstTwoScenesLoaded && containerRef.current && contentWrapperRef.current) {

      // 1. Trigger the fracturing behavior in the canvas
      setIsFracturing(true);

      const tl = gsap.timeline({
        onComplete: () => setShouldRender(false),
      });

      // 2. We wait a bit to let the user see the fracture effect (approx 2s as planned)
      // and then fade everything out.
      tl.to(contentWrapperRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        delay: 2.0, // Minimum display time threshold + fracture viewing
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
      }, "-=0.4"); // Overlap the container fade with the content fade
    }
  }, [isFirstTwoScenesLoaded]);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#151618] z-[9999] flex flex-col items-center justify-center select-none"
    >
      <div ref={contentWrapperRef} className="absolute inset-0 w-full h-full">
         <ContourLines isFracturing={isFracturing} />
         <CornerCounter progress={progress} />
      </div>
    </div>
  );
};
