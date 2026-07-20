import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * TheSanctuaryEnvironment
 * The 3D architectural volume for the Stance Health World.
 *
 * Physical First Concept:
 * An open architectural pavilion. Soft natural light.
 * Limestone, Oak, Brushed Brass, Clear Water.
 * The architecture should breathe and feel safe, calm, grounded.
 */
export const TheSanctuaryEnvironment: React.FC = () => {
  // --- Material Definitions ---
  const limestoneMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#dcd4c6'), // Warm limestone
        roughness: 0.8,
        metalness: 0.1,
      }),
    []
  );

  const oakMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8b5e3c'), // Natural oak timber
        roughness: 0.6,
        metalness: 0.0,
      }),
    []
  );

  const brassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#b5a642'), // Brushed brass
        roughness: 0.3,
        metalness: 0.8,
      }),
    []
  );
  
  const waterMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#a0b8b0'),
        transmission: 0.9,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.1,
        ior: 1.33,
        thickness: 0.5,
      }),
    []
  );

  // --- Geometry Definitions ---
  const pavilionFloorGeo = useMemo(() => new THREE.PlaneGeometry(120, 120), []);
  const waterPoolGeo = useMemo(() => new THREE.PlaneGeometry(40, 40), []);
  const timberColumnGeo = useMemo(() => new THREE.BoxGeometry(1.5, 40, 1.5), []);
  const timberBeamGeo = useMemo(() => new THREE.BoxGeometry(60, 1.5, 1.5), []);

  useEffect(() => {
    return () => {
      limestoneMat.dispose();
      oakMat.dispose();
      brassMat.dispose();
      waterMat.dispose();
      pavilionFloorGeo.dispose();
      waterPoolGeo.dispose();
      timberColumnGeo.dispose();
      timberBeamGeo.dispose();
    };
  }, [
    limestoneMat,
    oakMat,
    brassMat,
    waterMat,
    pavilionFloorGeo,
    waterPoolGeo,
    timberColumnGeo,
    timberBeamGeo,
  ]);

  const waterRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (waterRef.current) {
      // Very gentle water movement
      waterRef.current.position.y = -1.9 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <group>
      {/* ─── Lighting ─── */}
      <ambientLight intensity={0.4} color="#f8eedc" />

      {/* Soft warm daylight entering the pavilion */}
      <directionalLight
        position={[40, 50, -20]}
        intensity={1.2}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      
      {/* Indirect bounce light */}
      <spotLight
        position={[-30, 20, 10]}
        angle={0.8}
        penumbra={1}
        intensity={0.5}
        color="#d0e0e3"
      />

      {/* ─── Architectural Elements ─── */}
      {/* Limestone pavilion floor */}
      <mesh
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={limestoneMat}
        geometry={pavilionFloorGeo}
        receiveShadow
      />

      {/* Reflection pool */}
      <mesh
        ref={waterRef}
        position={[0, -1.9, -15]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={waterMat}
        geometry={waterPoolGeo}
        receiveShadow
      />

      {/* Oak columns and beams forming an open pergola/pavilion */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i}>
          <mesh
            position={[-25, 18, -40 + i * 12]}
            material={oakMat}
            geometry={timberColumnGeo}
            castShadow
            receiveShadow
          />
          <mesh
            position={[25, 18, -40 + i * 12]}
            material={oakMat}
            geometry={timberColumnGeo}
            castShadow
            receiveShadow
          />
          {/* Cross beams */}
          <mesh
            position={[0, 38, -40 + i * 12]}
            material={oakMat}
            geometry={timberBeamGeo}
            castShadow
            receiveShadow
          />
        </group>
      ))}

      {/* Brass accents at the base of the columns */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={`brass-${i}`}>
          <mesh position={[-25, -1, -40 + i * 12]} material={brassMat} receiveShadow>
             <boxGeometry args={[2, 2, 2]} />
          </mesh>
          <mesh position={[25, -1, -40 + i * 12]} material={brassMat} receiveShadow>
             <boxGeometry args={[2, 2, 2]} />
          </mesh>
        </group>
      ))}
      
      {/* Distant suggestive wall to ground the space without closing it */}
      <mesh
        position={[0, 10, -60]}
        material={limestoneMat}
        receiveShadow
      >
        <boxGeometry args={[100, 24, 2]} />
      </mesh>
    </group>
  );
};
export default TheSanctuaryEnvironment;
