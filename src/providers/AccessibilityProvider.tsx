/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect } from 'react';
import { useAccessibilityStore } from '@/stores/useAccessibilityStore';

interface AccessibilityContextType {
  prefersReducedMotion: boolean;
  highContrastEnabled: boolean;
  setReducedMotion: (reduced: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    prefersReducedMotion,
    highContrastEnabled,
    setReducedMotion,
    setHighContrast,
  } = useAccessibilityStore();

  useEffect(() => {
    // Media query listener for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);

    // Focus outline management for keyboard users
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };
    window.addEventListener('keydown', handleFirstTab);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('keydown', handleFirstTab);
    };
  }, [setReducedMotion]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (highContrastEnabled) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrastEnabled]);

  return (
    <AccessibilityContext.Provider
      value={{
        prefersReducedMotion,
        highContrastEnabled,
        setReducedMotion,
        setHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
