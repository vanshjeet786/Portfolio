import React, { useEffect, useRef, useCallback } from 'react';
import { useInteractionStore } from '@/stores/useInteractionStore';
import { useSpring, animated } from '@react-spring/web';

/**
 * CursorExperience
 * Spec: "The cursor is an explorer. It quietly searches.
 * When curiosity is rewarded, it becomes alive."
 * 
 * React Spring is used ONLY for cursor micro-interactions.
 * "Subtle magnetic behaviour. Gentle scaling. Elastic transitions."
 */
const AnimDiv = animated.div as unknown as React.ForwardRefExoticComponent<
  Omit<React.ComponentPropsWithRef<'div'>, 'style'> & {
    style?: React.CSSProperties | Record<string, unknown>;
  }
>;

export const CursorExperience: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const setCursorPosition = useInteractionStore((s) => s.setCursorPosition);
  const setMouseDown = useInteractionStore((s) => s.setMouseDown);
  const isHovering = useInteractionStore((s) => s.isHovering);

  // React Spring for hover scale
  const springStyles = useSpring({
    scale: isHovering ? 1.8 : 1,
    opacity: isHovering ? 0.6 : 0.35,
    config: { mass: 1, tension: 280, friction: 20 },
  });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Normalise to [-1, 1] for WebGL
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      setCursorPosition(nx, ny);
    },
    [setCursorPosition]
  );

  const handleMouseDown = useCallback(() => setMouseDown(true), [setMouseDown]);
  const handleMouseUp = useCallback(() => setMouseDown(false), [setMouseDown]);

  useEffect(() => {
    // Check if touch device — hide custom cursor on touch
    const isTouchDevice = 'ontouchstart' in window;
    if (isTouchDevice) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth follow loop
    const animate = () => {
      // Inner dot — fast follow
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.25;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.25;

      // Outer ring — slow, elastic follow
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.08;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = '';
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <>
      {/* Inner dot — precise position */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          backgroundColor: '#c5a880',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />

      {/* Outer ring — elastic, responsive */}
      <AnimDiv
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid rgba(197, 168, 128, 0.35)',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          scale: springStyles.scale,
          opacity: springStyles.opacity,
        }}
      />
    </>
  );
};
