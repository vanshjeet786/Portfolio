import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import gsap from 'gsap';

const scenesData = [
  {
    title: "YOUR NAME",
    subtitle: "PORTFOLIO EXHIBITION",
  },
  {
    title: "CAREER COMPASS",
    subtitle: "AI CONSTELLATION",
  },
  {
    title: "LEADERBOARD",
    subtitle: "FUTURISTIC ARENA",
  },
  {
    title: "STANCE HEALTH",
    subtitle: "ANATOMICAL INSTALLATION",
  },
  {
    title: "EXILES CHAT",
    subtitle: "COMMUNICATION HUB",
  },
];

export const UIOverlay = () => {
  const activeScene = useStore((state) => state.activeScene);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScene = useRef(activeScene);
  const [displayData, setDisplayData] = useState(scenesData[0]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Only animate if scene changed
    if (prevScene.current === activeScene) return;

    const elements = containerRef.current.children;

    // Animate Out
    gsap.to(elements, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        // Update content after fade out
        setDisplayData(scenesData[activeScene] || scenesData[0]);
        prevScene.current = activeScene;

        // Animate In
        gsap.fromTo(elements,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'expo.out' }
        );
      }
    });

  }, [activeScene]);

  // Initial animation
  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.children;
    gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 2, stagger: 0.3, delay: 1, ease: 'expo.out' }
    );
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none flex flex-col justify-center items-center text-white">
      <div ref={containerRef} className="text-center mix-blend-difference">
        <h1 className="text-6xl md:text-8xl font-light tracking-[0.2em] mb-4 opacity-0">
          {displayData.title}
        </h1>
        <h2 className="text-sm md:text-lg tracking-[0.5em] uppercase text-gray-300 opacity-0">
          {displayData.subtitle}
        </h2>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-50">
        <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>
  );
};
