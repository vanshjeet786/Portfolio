/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from 'react';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import type { PerformanceTier } from '@/stores/usePerformanceStore';
import * as THREE from 'three';

interface RenderContextType {
  performanceTier: PerformanceTier;
  glConfig: {
    antialias: boolean;
    alpha: boolean;
    powerPreference: 'high-performance' | 'default' | 'low-power';
    toneMapping: THREE.ToneMapping;
    toneMappingExposure: number;
    colorSpace: THREE.ColorSpace;
  };
  setPerformanceTier: (tier: PerformanceTier) => void;
}

const RenderContext = createContext<RenderContextType | undefined>(undefined);

export const RenderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { performanceTier, setPerformanceTier } = usePerformanceStore();

  const glConfig = useMemo(() => {
    // Map performance tiers to rendering parameters for optimization
    const configs = {
      low: {
        antialias: false,
        alpha: false,
        powerPreference: 'low-power' as const,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        colorSpace: THREE.SRGBColorSpace,
      },
      medium: {
        antialias: true,
        alpha: false,
        powerPreference: 'default' as const,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        colorSpace: THREE.SRGBColorSpace,
      },
      high: {
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance' as const,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        colorSpace: THREE.SRGBColorSpace,
      },
    };
    return configs[performanceTier];
  }, [performanceTier]);

  return (
    <RenderContext.Provider value={{ performanceTier, glConfig, setPerformanceTier }}>
      {children}
    </RenderContext.Provider>
  );
};

export const useRender = () => {
  const context = useContext(RenderContext);
  if (!context) {
    throw new Error('useRender must be used within a RenderProvider');
  }
  return context;
};
