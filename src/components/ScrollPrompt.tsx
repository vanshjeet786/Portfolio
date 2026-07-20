import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * ScrollPrompt
 * Subtle indicator that encourages the visitor to scroll.
 * Appears after the arrival typography has fully revealed.
 * Quiet, not aggressive. Disappears after first scroll.
 */
export const ScrollPrompt: React.FC = () => {
  const promptRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after arrival sequence completes
    const showTimer = setTimeout(() => setIsVisible(true), 5500);
    return () => clearTimeout(showTimer);
  }, []);

  // Fade in with GSAP
  useEffect(() => {
    if (isVisible && promptRef.current) {
      gsap.fromTo(
        promptRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out' }
      );
    }
  }, [isVisible]);

  // Hide on first scroll
  useEffect(() => {
    const handleScroll = () => {
      if (promptRef.current) {
        gsap.to(promptRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => setIsVisible(false),
        });
      }
      window.removeEventListener('wheel', handleScroll);
    };

    if (isVisible) {
      window.addEventListener('wheel', handleScroll, { once: true });
    }

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={promptRef}
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: 0,
      }}
    >
      {/* Animated line */}
      <div
        style={{
          width: '1px',
          height: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '1px',
            height: '100%',
            backgroundColor: 'rgba(197, 168, 128, 0.4)',
            animation: 'scrollLine 2s ease-in-out infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
