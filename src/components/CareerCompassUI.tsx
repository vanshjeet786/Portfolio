import React, { useState } from 'react';
import { useInteractionStore } from '@/stores/useInteractionStore';
import { ProjectDetailsPanel } from './ProjectDetailsPanel';

/**
 * CareerCompassUI
 * DOM narrative overlay for the Career Compass World.
 * Spec: "Delay information. Reward exploration. The observatory itself should explain the project.
 * Text should only confirm what the visitor already suspects. Less copy. More environment."
 */
export const CareerCompassUI: React.FC = () => {
  const scrollProgress = useInteractionStore((s) => s.scrollProgress);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Map scroll progress to active visibility ranges
  // 0.28 to 0.88 is the main compass zone.
  const isVisible = scrollProgress >= 0.28 && scrollProgress < 0.52;

  return (
    <div
      id="career-compass-ui"
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
        justifyContent: 'flex-end',
        padding: 'clamp(32px, 5vw, 64px)',
      }}
    >
      {/* Title Card - Elegantly positioned, minimal */}
      <div
        style={{
          opacity: isVisible && !isDetailsOpen ? 1 : 0,
          transform: `translateY(${isVisible && !isDetailsOpen ? '0' : '20px'})`,
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isVisible && !isDetailsOpen ? 'auto' : 'none',
          maxWidth: '480px',
        }}
      >
        <span className="text-label" style={{ color: 'var(--color-brass)', letterSpacing: '0.1em' }}>
          Project One
        </span>
        <h2 className="text-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginTop: '8px', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
          Career Compass
        </h2>
        <h3 className="text-label" style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', letterSpacing: '0.2em' }}>
          Decision Support System
        </h3>
        
        <p style={{ marginTop: '24px', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
          Conventional guidance relies on static questionnaires. Career Compass normalizes cognitive traits to establish true direction.
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

      {/* --- Project Details Overlay --- */}
      <ProjectDetailsPanel isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} project="career-compass" />
    </div>
  );
};
export default CareerCompassUI;
