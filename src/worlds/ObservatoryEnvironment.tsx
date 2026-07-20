/* eslint-disable react-hooks/purity */
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ObservatoryEnvironment
 * The 3D environment for the Career Compass World.
 * Spec: "The observatory currently feels like a room. Make it feel like a building. 
 * Introduce depth, layers, distance, framing, negative space, large architectural gestures."
 */
export const ObservatoryEnvironment: React.FC = () => {
  const roomRef = useRef<THREE.Group>(null);
  const constellationRef = useRef<THREE.LineSegments>(null);

  // Deep, monumental stone material
  const stoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0c0c0d'),
        roughness: 0.85,
        metalness: 0.1,
      }),
    []
  );

  // Plinth material (slightly lighter/more reflective to draw focus to center)
  const plinthMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#151518'),
        roughness: 0.6,
        metalness: 0.3,
      }),
    []
  );

  // Architectural geometries (memoized for performance)
  const floorGeo = useMemo(() => new THREE.CylinderGeometry(40, 40, 1, 64), []);
  const plinthGeo = useMemo(() => new THREE.CylinderGeometry(3.5, 4.5, 4, 32), []);
  const pillarGeo = useMemo(() => new THREE.BoxGeometry(1.5, 30, 2), []);

  // Create constellation nodes and lines (distant and subtle)
  const constellationData = useMemo(() => {
    const count = 30;
    const positions = new Float32Array(count * 3);
    const linePairs: number[] = [];

    // Generate distant circular constellation layout
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const radius = 18 + Math.random() * 8; // pushed far back
      const height = 10 + Math.random() * 15; // high up in the "skylight"

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      if (i > 0 && Math.random() > 0.5) {
        linePairs.push(i - 1, i);
      }
      if (i > 5 && Math.random() > 0.8) {
        linePairs.push(i - 6, i);
      }
    }

    const linePositions = new Float32Array(linePairs.length * 3);
    for (let j = 0; j < linePairs.length; j++) {
      const idx = linePairs[j];
      linePositions[j * 3] = positions[idx * 3];
      linePositions[j * 3 + 1] = positions[idx * 3 + 1];
      linePositions[j * 3 + 2] = positions[idx * 3 + 2];
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    return { pointsGeo, linesGeo };
  }, []);

  // Cleanup manual geometries and materials on unmount
  useEffect(() => {
    return () => {
      constellationData.pointsGeo.dispose();
      constellationData.linesGeo.dispose();
      stoneMaterial.dispose();
      plinthMaterial.dispose();
      floorGeo.dispose();
      plinthGeo.dispose();
      pillarGeo.dispose();
    };
  }, [constellationData, stoneMaterial, plinthMaterial, floorGeo, plinthGeo, pillarGeo]);

  // Almost imperceptible rotation of the sky
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (roomRef.current) {
      roomRef.current.rotation.y = elapsed * 0.003; // Extremely slow
    }
  });

  return (
    <group>
      {/* Fog for immense depth and scale */}
      <fog attach="fog" args={['#050505', 10, 45]} />

      {/* --- Architectural Lighting --- */}
      {/* Indirect, soft, no bloom */}
      <hemisphereLight args={['#1a202c', '#000000', 0.2]} position={[0, 50, 0]} />
      
      {/* A single cold, precise beam dropping from the "oculus" onto the compass */}
      <spotLight
        position={[0, 30, 0]}
        angle={0.2}
        penumbra={1}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />

      {/* Subtle bounce light from the floor */}
      <directionalLight position={[0, -10, 0]} intensity={0.05} color="#c8b090" />

      {/* --- Architectural Elements --- */}
      {/* Massive endless floor */}
      <mesh position={[0, -2.5, 0]} material={stoneMaterial} geometry={floorGeo} receiveShadow />

      {/* The Central Plinth (elevates the compass) */}
      <mesh position={[0, -0.5, 0]} material={plinthMaterial} geometry={plinthGeo} receiveShadow castShadow />

      {/* The Distant Colonnade (gives scale and framing) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 22;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 12, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
            material={stoneMaterial}
            geometry={pillarGeo}
            receiveShadow
            castShadow
          />
        );
      })}

      {/* --- Constellations Layer --- */}
      {/* Pushed far back into the 'sky' */}
      <group ref={roomRef}>
        <points geometry={constellationData.pointsGeo}>
          <pointsMaterial
            size={0.04}
            color="#a89a80"
            transparent
            opacity={0.4}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
        <lineSegments ref={constellationRef} geometry={constellationData.linesGeo}>
          <lineBasicMaterial
            color="#a89a80"
            transparent
            opacity={0.08}
            linewidth={1}
            depthWrite={false}
          />
        </lineSegments>
      </group>
    </group>
  );
};
