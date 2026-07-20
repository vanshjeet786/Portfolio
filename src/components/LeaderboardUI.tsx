import React, { useState } from 'react';
import { useInteractionStore } from '@/stores/useInteractionStore';
import { ProjectDetailsPanel } from './ProjectDetailsPanel';

/**
 * LeaderboardUI
 * DOM narrative overlay for the Leaderboard World — "The Arena"
 */
export const LeaderboardUI: React.FC = () => {
  const scrollProgress = useInteractionStore((s) => s.scrollProgress);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Active zone is 0.865 to 0.94
  const isWorldActive = scrollProgress >= 0.865;

  // Narrative sequence text mapping
  let narrativeText = '';

  if (scrollProgress >= 0.865 && scrollProgress < 0.875) {
    narrativeText = 'Practice.';
  } else if (scrollProgress >= 0.875 && scrollProgress < 0.885) {
    narrativeText = 'Iteration.';
  } else if (scrollProgress >= 0.885 && scrollProgress < 0.895) {
    narrativeText = 'Improvement.';
  } else if (scrollProgress >= 0.895 && scrollProgress < 0.905) {
    narrativeText = 'Competition.';
  } else if (scrollProgress >= 0.905 && scrollProgress < 0.915) {
    narrativeText = 'Recognition.';
  } else if (scrollProgress >= 0.915) {
    narrativeText = ''; // Clear for final reveal
  }

  const isFinalReveal = scrollProgress >= 0.915;

  return (
    <div
      className="absolute inset-0 pointer-events-none flex flex-col"
      style={{
        zIndex: isWorldActive ? 30 : -1,
        padding: 'clamp(32px, 5vw, 64px)',
      }}
    >
      {/* Narrative Overlay (Center-Left) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <p
          style={{
            opacity: isWorldActive && narrativeText && !isDetailsOpen ? 1 : 0,
            transform: `translateY(${isWorldActive && narrativeText ? '0' : '15px'})`,
            transition: 'opacity 0.8s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            letterSpacing: '0.02em',
            color: 'var(--color-text)',
            maxWidth: '24ch',
            lineHeight: 1.2,
          }}
        >
          {narrativeText}
        </p>
      </div>

      {/* Project Reveal Overlay (Bottom Left) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          opacity: isFinalReveal && !isDetailsOpen ? 1 : 0,
          transform: `translateY(${isFinalReveal ? '0' : '20px'})`,
          transition: 'opacity 1.2s ease 0.3s, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
        }}
      >
        <div style={{ pointerEvents: isFinalReveal ? 'auto' : 'none' }}>
          <h2
            style={{
              fontSize: 'clamp(3rem, 6vw, 6rem)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              margin: '0 0 16px 0',
              lineHeight: 1,
              // Cold, monumental accent color for Leaderboard
              color: '#c8cce0',
            }}
          >
            Leaderboard
          </h2>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <p
              style={{
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-surface-300)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0,
              }}
            >
              2024 / Realtime Competition
            </p>

            <button
              onClick={() => setIsDetailsOpen(true)}
              className="group"
              style={{
                background: 'none',
                border: '1px solid var(--color-surface-400)',
                padding: '8px 24px',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'auto',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#c8cce0';
                e.currentTarget.style.backgroundColor = 'rgba(200, 204, 224, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-surface-400)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span>Examine Specifications</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>

      <ProjectDetailsPanel
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        project="leaderboard"
      />
    </div>
  );
};
export default LeaderboardUI;
