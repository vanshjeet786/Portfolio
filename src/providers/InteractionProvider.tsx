/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { useInteractionStore } from '@/stores/useInteractionStore';

interface InteractionContextType {
  registerHover: (elementId: string) => void;
  unregisterHover: () => void;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export const InteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    setCursorPosition,
    setHoverTarget,
    setScrollProgress,
    setKeyboardFocus,
    setMouseDown,
  } = useInteractionStore();

  const prevScrollY = useRef(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Normalize to viewport coordinates [-1, 1]
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setCursorPosition(x, y);
    },
    [setCursorPosition]
  );

  const handleMouseDown = useCallback(() => {
    setMouseDown(true);
  }, [setMouseDown]);

  const handleMouseUp = useCallback(() => {
    setMouseDown(false);
  }, [setMouseDown]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const delta = e.deltaY;
      const currentScroll = prevScrollY.current + delta;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.max(0, Math.min(1, currentScroll / maxScroll)) : 0;
      prevScrollY.current = Math.max(0, Math.min(maxScroll, currentScroll));
      setScrollProgress(progress);
    },
    [setScrollProgress]
  );

  const handleFocusChange = useCallback(
    (e: FocusEvent) => {
      const activeEl = e.target as HTMLElement;
      if (activeEl && activeEl.dataset && activeEl.dataset.interactionId) {
        setKeyboardFocus(activeEl.dataset.interactionId);
      } else {
        setKeyboardFocus(null);
      }
    },
    [setKeyboardFocus]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: true });
    document.addEventListener('focusin', handleFocusChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('focusin', handleFocusChange);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleWheel, handleFocusChange]);

  const registerHover = useCallback(
    (elementId: string) => {
      setHoverTarget(elementId);
    },
    [setHoverTarget]
  );

  const unregisterHover = useCallback(() => {
    setHoverTarget(null);
  }, [setHoverTarget]);

  return (
    <InteractionContext.Provider value={{ registerHover, unregisterHover }}>
      {children}
    </InteractionContext.Provider>
  );
};

export const useInteraction = () => {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
};
