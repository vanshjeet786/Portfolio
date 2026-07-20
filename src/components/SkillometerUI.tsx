import React, { useState } from 'react';
import { useInteractionStore } from '@/stores/useInteractionStore';
import { ProjectDetailsPanel } from './ProjectDetailsPanel';

/**
 * SkillometerUI
 * DOM narrative overlay for the Skillometer World.
 * Spec: "Sequence: Uncertainty -> Potential -> Patterns -> Understanding -> Assessment -> Insights -> Skillometer."
 * "Engineering Reveal: Traits -> Signals -> Relationships -> Role Mapping -> Evaluation -> Recommendations -> Reports."
 * "Typography: Minimal. One sentence. Pause. Another sentence. Visitors should never read paragraphs."
 */
export const SkillometerUI: React.FC = () => {
  const scrollProgress = useInteractionStore((s) => s.scrollProgress);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Active zone is 0.62 to 0.78
  const isWorldActive = scrollProgress >= 0.62 && scrollProgress < 0.78;

  // Narrative sequence text mapping
  let narrativeText = '';

  if (scrollProgress >= 0.62 && scrollProgress < 0.65) {
    narrativeText = 'Conventional metrics fail to capture the complexity of human potential.';
  } else if (scrollProgress >= 0.65 && scrollProgress < 0.68) {
    narrativeText = 'Latent capabilities remain hidden behind standard resumes.';
  } else if (scrollProgress >= 0.68 && scrollProgress < 0.71) {
    narrativeText = 'Ecosystem signals reveal organic patterns of capability.';
  } else if (scrollProgress >= 0.71 && scrollProgress < 0.74) {
    narrativeText = 'True alignment emerges not from scores, but from relationships.';
  } else if (scrollProgress >= 0.74 && scrollProgress < 0.78) {
    narrativeText = '';
  }

  const isFinalReveal = scrollProgress >= 0.74 && scrollProgress < 0.80;

  return (
    <div
      id="skillometer-ui"
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
      {/* No engineering state overlay — environment tells the story */}

      {/* Narrative Overlay (Center-Left) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <p
          style={{
            opacity: isWorldActive && narrativeText && !isDetailsOpen ? 1 : 0,
            transform: `translateY(${isWorldActive && narrativeText ? '0' : '15px'})`,
            transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            maxWidth: '540px',
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            lineHeight: '1.6',
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
          }}
        >
          {narrativeText}
        </p>
      </div>

      {/* Bottom Left: Final Project Reveal card */}
      <div
        style={{
          opacity: isFinalReveal && !isDetailsOpen ? 1 : 0,
          transform: `translateY(${isFinalReveal && !isDetailsOpen ? '0' : '20px'})`,
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isFinalReveal && !isDetailsOpen ? 'auto' : 'none',
          maxWidth: '480px',
        }}
      >
        <span className="text-label" style={{ color: 'var(--color-brass)', letterSpacing: '0.1em' }}>
          Project Two
        </span>
        <h2 className="text-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginTop: '8px', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
          Skillometer
        </h2>
        <h3 className="text-label" style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', letterSpacing: '0.2em' }}>
          The Living System
        </h3>
        
        <p style={{ marginTop: '24px', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
          An architectural graph modeling candidate signals, capability matrices, and alignment scores dynamically.
        </p>

        <button
          onClick={() => setIsDetailsOpen(true)}
          style={{
            marginTop: '32px',
            padding: '12px 24px',
            borderRadius: '30px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            transition: 'background 0.3s ease, border-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          View System Architecture
        </button>
      </div>

      {/* Project Details Panel Overlay */}
      <ProjectDetailsPanel isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} project="skillometer" />
    </div>
  );
};
export default SkillometerUI;
