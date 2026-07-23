import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../../stores/useStore';
import { SpineModel } from './models/SpineModel';
import { PelvicModel } from './models/PelvicModel';
import { KneeModel } from './models/KneeModel';

export const StanceScene = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const progress = useStore((state) => state.progress);

  // Stance is scene 7 out of 10.
  // The progress interval for Stance is roughly 0.7 to 0.8
  const localProgress = Math.max(0, Math.min(1, (progress - 0.7) * 10));
  const isExploded = localProgress > 0.5;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      // Very heavy, subtle floating, similar to Career Compass
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.15;
      groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.05;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.02;
    }
  });

  return (
    <group position={position} ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* High-contrast, warm lighting matching Career Compass / Skillometer vibes,
          but adapted to flatter the imported models. */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" castShadow />
      <directionalLight position={[-5, 5, 2]} intensity={1.5} color="#f59e0b" />
      <pointLight position={[0, 0, 0]} intensity={3} color="#f59e0b" distance={10} />

      {/* Spine Model - Left */}
      <group position={[-4, -0.5, 0]}>
        <SpineModel
          isVisible={true}
          isExploded={isExploded}
          isDark={true}
          scrollProgress={localProgress}
        />
      </group>

      {/* Pelvic Model - Center */}
      <group position={[0, -0.5, 0]}>
        <PelvicModel
          isVisible={true}
          isDark={true}
          scrollProgress={localProgress}
        />
      </group>

      {/* Knee Model - Right */}
      <group position={[4, -0.5, 0]}>
        <KneeModel
          isVisible={true}
          isDark={true}
          scrollProgress={localProgress}
        />
      </group>
    </group>
  );
};
