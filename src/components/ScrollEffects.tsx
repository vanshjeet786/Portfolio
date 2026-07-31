import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { useStore } from '@/stores/useStore';
import * as THREE from 'three';

export const ScrollEffects = () => {
  const aberrationRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const previousProgress = useRef(useStore.getState().progress);
  const currentVelocity = useRef(0);
  const offset = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame(() => {
    // Get state non-reactively to prevent re-rendering the EffectComposer
    const progress = useStore.getState().progress;
    
    // Calculate scroll velocity
    const velocity = Math.abs(progress - previousProgress.current);
    previousProgress.current = progress;

    // Smooth the velocity
    currentVelocity.current = THREE.MathUtils.lerp(currentVelocity.current, velocity, 0.1);

    // Apply distortion based on velocity
    if (aberrationRef.current && aberrationRef.current.offset) {
      // Map velocity to an offset multiplier
      const offsetMagnitude = currentVelocity.current * 1000;
      
      // Update offset
      aberrationRef.current.offset.x = THREE.MathUtils.lerp(aberrationRef.current.offset.x, offsetMagnitude * 0.01, 0.1);
      aberrationRef.current.offset.y = THREE.MathUtils.lerp(aberrationRef.current.offset.y, offsetMagnitude * 0.01, 0.1);
    }
  });

  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
      <ChromaticAberration
        ref={(instance: any) => {
          aberrationRef.current = instance;
        }}
        offset={offset as any} // eslint-disable-line @typescript-eslint/no-explicit-any
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
};
