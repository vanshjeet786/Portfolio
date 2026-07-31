import { useEffect, useRef, useState } from 'react';
import { useLoadStore } from '@/stores/useLoadStore';
import gsap from 'gsap';

export const Preloader = () => {
  const { progress, statusText, isFirstTwoScenesLoaded } = useLoadStore();
  const [shouldRender, setShouldRender] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<SVGSVGElement>(null);

  // Animate progress bar filling
  useEffect(() => {
    if (barRef.current) {
      gsap.to(barRef.current, {
        width: `${progress}%`,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [progress]);

  // Handle fade-out on complete
  useEffect(() => {
    if (isFirstTwoScenesLoaded && containerRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setShouldRender(false),
      });

      tl.to([textRef.current, percentRef.current, barRef.current?.parentElement], {
        opacity: 0,
        y: -15,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.in',
      })
      .to(hudRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in',
        delay: -0.4,
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power4.inOut',
      });
    }
  }, [isFirstTwoScenesLoaded]);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#050505] z-[9999] flex flex-col items-center justify-center select-none"
    >
      {/* Decorative cyber grid backdrop background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.035),transparent_65%)] pointer-events-none" />

      {/* Futuristic HUD spinning circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg
          ref={hudRef}
          className="absolute w-full h-full animate-[spin_10s_linear_infinite]"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(0, 240, 255, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="40 180"
          />
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="rgba(245, 158, 11, 0.2)"
            strokeWidth="1"
            strokeDasharray="120 40 20 40"
            className="animate-[spin_6s_linear_infinite_reverse]"
          />
        </svg>

        {/* Dynamic percentage indicator */}
        <div
          ref={percentRef}
          className="text-4xl font-extralight tracking-widest text-white/90 font-mono"
        >
          {progress}<span className="text-lg text-white/40">%</span>
        </div>
      </div>

      {/* Progress & Sub-status Container */}
      <div className="mt-12 flex flex-col items-center w-80 max-w-md">
        {/* Sleek slim loading bar */}
        <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden relative mb-6">
          <div
            ref={barRef}
            className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#00f0ff] to-[#f59e0b] shadow-[0_0_8px_#00f0ff]"
          />
        </div>

        {/* Dynamic scanning sub-text */}
        <div
          ref={textRef}
          className="text-[9px] uppercase tracking-[0.45em] text-white/45 font-mono text-center h-4 flex items-center justify-center"
        >
          {statusText}
        </div>
      </div>
    </div>
  );
};
