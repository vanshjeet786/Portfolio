import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * NavigationShell
 * Top-right navigation. Inspired by AllGood Studio.
 * Glass material, minimal, shows progress framework.
 * Spec: "Only layout, behaviour, progress framework."
 * "Do NOT implement project chapters."
 */
export const NavigationShell: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 3200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <nav
      ref={navRef}
      id="navigation-shell"
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: '32px',
        right: '32px',
        zIndex: 50,
        opacity: 0,
      }}
    >
      <div
        className="glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '10px 20px',
          borderRadius: '40px',
        }}
      >
        {/* Progress indicator — just the framework */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          {['Arrival', 'Identity', 'Purpose'].map((section, i) => (
            <button
              key={section}
              aria-label={section}
              title={section}
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: i === 0 ? '#c5a880' : 'rgba(245, 240, 232, 0.2)',
                cursor: 'pointer',
                padding: 0,
                transition: 'background-color 0.3s ease, transform 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'scale(1.6)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'scale(1)';
              }}
            />
          ))}
        </div>

        {/* Separator */}
        <div
          style={{
            width: '1px',
            height: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          }}
        />

        {/* Menu label */}
        <span
          className="text-label"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            color: 'rgba(245, 240, 232, 0.5)',
          }}
        >
          MENU
        </span>
      </div>
    </nav>
  );
};
