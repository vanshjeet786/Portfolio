import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Environment
 * Global architectural lighting. Soft, natural, museum-like.
 * Spec: "Lighting defines mood. Not visibility. Natural. Indirect. Architectural.
 * No dramatic bloom. No obvious rim lights. Light should reveal architecture. Not effects."
 */
export const Environment: React.FC = () => {
  const floorRef = useRef<THREE.Mesh>(null);

  // Shared materials — spec demands: Stone, Glass, Brass, Graphite
  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#050505'), // Darker, heavier stone
        roughness: 0.95,
        metalness: 0.08,
      }),
    []
  );

  const floorGeo = useMemo(() => new THREE.PlaneGeometry(80, 80), []);

  useEffect(() => {
    return () => {
      floorMaterial.dispose();
      floorGeo.dispose();
    };
  }, [floorMaterial, floorGeo]);

  return (
    <group>
      {/* --- Fog for Immense Scale --- */}
      <fog attach="fog" args={['#030303', 15, 60]} />

      {/* --- Architectural Lighting --- */}
      {/* Key light — warm directional, heavily diffused */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={0.4}
        color="#e0d0b8"
        castShadow={false}
      />

      {/* Origin Spotlight - creates a high contrast zone around the Arrival Cube */}
      <spotLight
        position={[0, 15, 5]}
        angle={0.4}
        penumbra={1}
        intensity={1.2}
        color="#ffffff"
        castShadow
        target-position={[0, 0, 0]}
      />

      {/* Fill light — cool, extremely subtle */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={0.1}
        color="#b0c0d0"
      />

      {/* Hemisphere — ground/sky ambient fill. No rim lights. */}
      <hemisphereLight
        args={['#101218', '#000000', 0.2]}
      />

      {/* Ground plane — massive endless monolithic floor */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.5, 0]}
        receiveShadow
        material={floorMaterial}
        geometry={floorGeo}
      />
    </group>
  );
};
