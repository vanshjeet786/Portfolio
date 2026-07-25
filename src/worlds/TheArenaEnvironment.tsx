import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

/**
 * TheArenaEnvironment
 * The 3D architectural volume for the Leaderboard World.
 *
 * Physical First Concept:
 * Olympic training hall / brutalist monument.
 * Very high ceilings. Large negative space.
 * Stone, blackened steel, brushed aluminium, concrete.
 * Long shafts of natural light. Architectural shadows.
 * Minimal, massive, focused, quiet.
 */
export const TheArenaEnvironment: React.FC = () => {
  // --- Material Definitions ---
  const agedConcreteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#161618'), // Dark, aged concrete
        roughness: 0.98,
        metalness: 0.05,
      }),
    []
  );

  const polishedStoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0a0a0c'), // Extremely dark, slightly reflective stone
        roughness: 0.4,
        metalness: 0.1,
      }),
    []
  );

  const brushedAluminiumMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#55555c'),
        roughness: 0.6,
        metalness: 0.7,
      }),
    []
  );

  // --- Geometry Definitions ---
  // A monumental scale room
  const floorGeo = useMemo(() => new THREE.PlaneGeometry(150, 150), []);
  const wallGeo = useMemo(() => new THREE.BoxGeometry(150, 80, 4), []);
  const pillarGeo = useMemo(() => new THREE.BoxGeometry(4, 80, 8), []);

  useEffect(() => {
    return () => {
      agedConcreteMat.dispose();
      polishedStoneMat.dispose();
      brushedAluminiumMat.dispose();
      floorGeo.dispose();
      wallGeo.dispose();
      pillarGeo.dispose();
    };
  }, [agedConcreteMat, polishedStoneMat, brushedAluminiumMat, floorGeo, wallGeo, pillarGeo]);

  return (
    <group>
      {/* ─── Lighting ─── */}
      {/* Very low ambient light to keep architecture dark */}
      <ambientLight intensity={0.02} color="#ffffff" />

      {/* Long shafts of natural light coming from high up, cutting through the darkness */}
      <spotLight
        position={[20, 70, -20]}
        angle={0.25}
        penumbra={0.8}
        intensity={2.5}
        color="#e8eaf6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <spotLight
        position={[-30, 60, -10]}
        angle={0.15}
        penumbra={1}
        intensity={1.0}
        color="#c8cce0"
        castShadow
      />

      {/* Bounce light from the polished floor */}
      <directionalLight
        position={[0, -10, 0]}
        intensity={0.05}
        color="#ffffff"
      />

      {/* ─── Architectural Elements ─── */}
      {/* Massive polished stone floor */}
      <mesh
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={polishedStoneMat}
        geometry={floorGeo}
        receiveShadow
      />

      {/* Distant back wall - aged concrete */}
      <mesh
        position={[0, 38, -60]}
        material={agedConcreteMat}
        geometry={wallGeo}
        receiveShadow
      />

      {/* Side walls for monumental framing */}
      <mesh
        position={[-60, 38, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={agedConcreteMat}
        geometry={wallGeo}
        receiveShadow
      />
      <mesh
        position={[60, 38, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        material={agedConcreteMat}
        geometry={wallGeo}
        receiveShadow
      />

      {/* Brutalist pillars creating depth and framing */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i}>
          <mesh
            position={[-30, 38, -40 + i * 15]}
            material={agedConcreteMat}
            geometry={pillarGeo}
            castShadow
            receiveShadow
          />
          <mesh
            position={[30, 38, -40 + i * 15]}
            material={agedConcreteMat}
            geometry={pillarGeo}
            castShadow
            receiveShadow
          />
        </group>
      ))}

      {/* Aluminium architectural details on the floor */}
      <mesh position={[0, -1.95, -10]} material={brushedAluminiumMat} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#55555c" roughness={0.6} metalness={0.7} />
      </mesh>
    </group>
  );
};
export default TheArenaEnvironment;
