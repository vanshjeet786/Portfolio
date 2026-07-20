import React, { useState } from 'react';
import { useInteractionStore } from '@/stores/useInteractionStore';
import { ProjectDetailsPanel } from './ProjectDetailsPanel';

/**
 * ExilesUI
 * DOM narrative overlay for the Exiles World — "The Signal City"
 *
 * Spec:
 * "Typography: One sentence. Pause. One sentence. Silence. Repeat."
 * "Sequence: Isolation → Presence → Signals → Relationships → Conversations → Communities → Exiles"
 * "Engineering Reveal: Authentication → Presence → Realtime → Subscriptions →
 *  Persistence → Attachments → Synchronization → Delivery"
 * "The project name appears late. Visitors first understand the philosophy."
 * "Remove the System State overlay entirely." (Per technical_stability_readability rule)
 */
export const ExilesUI: React.FC = () => {
  const scrollProgress = useInteractionStore((s) => s.scrollProgress);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Exiles occupies scroll range 0.775 → 0.855
  const isWorldActive = scrollProgress >= 0.775;

  // Narrative — one sentence, then silence
  let narrativeText = '';
  if (scrollProgress >= 0.775 && scrollProgress < 0.795) {
    narrativeText = 'Distance is a feeling, not a distance.';
  } else if (scrollProgress >= 0.795 && scrollProgress < 0.815) {
    narrativeText = 'Before words — there is only the signal.';
  } else if (scrollProgress >= 0.815 && scrollProgress < 0.835) {
    narrativeText = 'The wire remembers every message.';
  } else if (scrollProgress >= 0.835 && scrollProgress < 0.855) {
    narrativeText = 'Presence is established before conversation begins.';
  }

  const isFinalReveal = scrollProgress >= 0.845;

  return (
    <div
      id="exiles-ui"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 20,
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(32px, 5vw, 64px)',
      }}
    >
      {/* Architectural breathing space at top — no engineering state overlay */}
      <div style={{ height: '1rem' }} />

      {/* Narrative — center vertical, left-aligned, maximum restraint */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <p
          style={{
            opacity: isWorldActive && narrativeText && !isDetailsOpen ? 1 : 0,
            transform: `translateY(${isWorldActive && narrativeText ? '0' : '12px'})`,
            transition: 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
            maxWidth: '500px',
            fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
            lineHeight: '1.7',
            color: 'rgba(245, 240, 232, 0.55)',
            fontStyle: 'italic',
            letterSpacing: '0.01em',
          }}
        >
          {narrativeText}
        </p>
      </div>

      {/* Final Project Reveal — bottom left, delayed and restrained */}
      <div
        style={{
          opacity: isFinalReveal && !isDetailsOpen ? 1 : 0,
          transform: `translateY(${isFinalReveal && !isDetailsOpen ? '0' : '20px'})`,
          transition: 'opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isFinalReveal && !isDetailsOpen ? 'auto' : 'none',
          maxWidth: '480px',
        }}
      >
        <span
          className="text-label"
          style={{ color: 'rgba(192, 96, 32, 0.8)', letterSpacing: '0.12em', fontSize: '0.7rem' }}
        >
          Project Three
        </span>

        <h2
          className="text-display"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            marginTop: '8px',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Exiles
        </h2>

        <h3
          className="text-label"
          style={{
            color: 'rgba(255, 255, 255, 0.45)',
            marginTop: '4px',
            letterSpacing: '0.2em',
            fontSize: '0.75rem',
          }}
        >
          The Signal City
        </h3>

        <p
          style={{
            marginTop: '20px',
            fontSize: '0.9rem',
            lineHeight: '1.65',
            color: 'var(--color-text-secondary)',
            maxWidth: '380px',
          }}
        >
          A real-time communication infrastructure where presence precedes conversation.
        </p>

        <button
          onClick={() => setIsDetailsOpen(true)}
          style={{
            marginTop: '28px',
            padding: '10px 22px',
            borderRadius: '30px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            color: 'rgba(245, 240, 232, 0.8)',
            background: 'rgba(192, 88, 32, 0.08)',
            border: '1px solid rgba(192, 88, 32, 0.2)',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(192, 88, 32, 0.18)';
            e.currentTarget.style.borderColor = 'rgba(192, 88, 32, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(192, 88, 32, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(192, 88, 32, 0.2)';
          }}
        >
          View System Architecture
        </button>
      </div>

      {/* Project Details Panel */}
      <ProjectDetailsPanel
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        project="exiles"
      />
    </div>
  );
};
export default ExilesUI;
