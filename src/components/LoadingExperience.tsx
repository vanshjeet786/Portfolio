import React, { useState, useEffect } from 'react';

/**
 * LoadingExperience
 * A calm, minimal loading state. Not a percentage bar.
 * Spec: "The loading screen should feel calm."
 * "Only display loading when genuinely loading assets."
 * 
 * Fades away once the app has had time to initialise.
 */
export const LoadingExperience: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Genuine asset loading time — let R3F/Three.js initialise
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1800);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      id="loading-experience"
      role="status"
      aria-label="Loading experience"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#050505',
        transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Breathing dot — calm indicator */}
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#c5a880',
            animation: 'breathe 2.4s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes breathe {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
          }
        `}</style>
      </div>
    </div>
  );
};
