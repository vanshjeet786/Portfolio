import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useInteractionStore } from '@/stores/useInteractionStore';

/**
 * ArrivalTypography
 * The landing identity layer.
 * Spec Story Act I: "Silence. Minimal interface. The cube. Slow movement. Whitespace."
 * Act II: "Name. Role. One sentence. Nothing more."
 * Act III: "'I love solving problems.' The visitor now understands motivation."
 *
 * Typography is editorial, not futuristic.
 * Whitespace is critical.
 */
export const ArrivalTypography: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const focusRef = useRef<HTMLParagraphElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Wait for loading screen to clear
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Staggered entrance — calm, sequential reveals
  useEffect(() => {
    if (!isReady) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    if (nameRef.current) {
      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4 },
        0.2
      );
    }

    if (roleRef.current) {
      tl.fromTo(
        roleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2 },
        0.9
      );
    }

    if (focusRef.current) {
      tl.fromTo(
        focusRef.current,
        { opacity: 0, y: 16 },
        { opacity: 0.5, y: 0, duration: 1.4 },
        1.8
      );
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  const scrollProgress = useInteractionStore((s) => s.scrollProgress);
  const opacity = Math.max(0, 1 - scrollProgress / 0.15);

  if (!isReady) return null;

  return (
    <div
      ref={containerRef}
      id="arrival-typography"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 48px 72px 48px',
        pointerEvents: 'none',
        zIndex: 10,
        opacity: opacity,
        transform: `translateY(${scrollProgress * -50}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {/* Name — large, quiet confidence */}
      <h1
        ref={nameRef}
        className="text-display"
        style={{
          fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
          color: 'var(--color-text-primary)',
          margin: 0,
          opacity: 0,
          lineHeight: 1.05,
        }}
      >
        Vanshjeet Singh
      </h1>

      {/* Role — understated label */}
      <p
        ref={roleRef}
        className="text-label"
        style={{
          marginTop: '16px',
          marginBottom: 0,
          opacity: 0,
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
        }}
      >
        PRODUCT ENGINEER
      </p>

      {/* True Focus — the emotional centre */}
      <p
        ref={focusRef}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
          color: 'var(--color-text-secondary)',
          marginTop: '32px',
          marginBottom: 0,
          opacity: 0,
          letterSpacing: '-0.01em',
          fontStyle: 'italic',
        }}
      >
        I love solving problems.
      </p>
    </div>
  );
};
