import React, { useState } from 'react';
import { useInteractionStore } from '@/stores/useInteractionStore';
import { ProjectDetailsPanel } from './ProjectDetailsPanel';

/**
 * StanceUI
 * DOM narrative overlay for the Stance Health World — "The Sanctuary"
 */
export const StanceUI: React.FC = () => {
  const scrollProgress = useInteractionStore((s) => s.scrollProgress);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Active zone is 0.93 to 1.00
  const isWorldActive = scrollProgress >= 0.93;

  // Narrative sequence text mapping
  let narrativeText = '';

  if (scrollProgress >= 0.93 && scrollProgress < 0.94) {
    narrativeText = 'Care.';
  } else if (scrollProgress >= 0.94 && scrollProgress < 0.95) {
    narrativeText = 'Movement.';
  } else if (scrollProgress >= 0.95 && scrollProgress < 0.96) {
    narrativeText = 'Health.';
  } else if (scrollProgress >= 0.96 && scrollProgress < 0.97) {
    narrativeText = 'Accessibility.';
  } else if (scrollProgress >= 0.97 && scrollProgress < 0.98) {
    narrativeText = 'Human Design.';
  } else if (scrollProgress >= 0.98 && scrollProgress < 0.99) {
    narrativeText = ''; // Clear for final reveal
  }

  const isFinalReveal = scrollProgress >= 0.985;

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
            transition: 'opacity 1.5s ease, transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            letterSpacing: '0.02em',
            color: 'var(--color-text)', // Will be warm natural tone
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
          transition: 'opacity 2s ease 0.5s, transform 2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
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
              // Soft warm tone for Stance
              color: '#e8dcca',
            }}
          >
            Stance
          </h2>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <p
              style={{
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                color: 'rgba(232, 220, 202, 0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: 0,
              }}
            >
              2024 / Human Wellbeing
            </p>

            <button
              onClick={() => setIsDetailsOpen(true)}
              className="group"
              style={{
                background: 'none',
                border: '1px solid rgba(232, 220, 202, 0.3)',
                padding: '8px 24px',
                color: '#e8dcca',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                pointerEvents: 'auto',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#e8dcca';
                e.currentTarget.style.backgroundColor = 'rgba(232, 220, 202, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(232, 220, 202, 0.3)';
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
        project="stance"
      />
    </div>
  );
};
export default StanceUI;
