import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

/**
 * LivingSystemEnvironment
 * The 3D architectural volume for the Skillometer World.
 * Spec: "Large architectural volume. Dark graphite stone. Copper pathways.
 * Organic structures. Curved architecture. Dense depth. Huge negative space."
 */
export const LivingSystemEnvironment: React.FC = () => {
  // Shared materials
  const graphiteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#101011'), // Deep dark graphite
        roughness: 0.9,
        metalness: 0.2,
      }),
    []
  );

  const copperMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#b87333'), // Rich copper
        roughness: 0.35,
        metalness: 0.9,
      }),
    []
  );

  const clayMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8b5a2b'), // Earthy clay
        roughness: 0.95,
        metalness: 0.05,
      }),
    []
  );

  // Geometries for the environment
  const floorGeo = useMemo(() => new THREE.CylinderGeometry(50, 50, 1, 64), []);
  const pathwayGeo = useMemo(() => new THREE.TorusGeometry(12, 0.05, 8, 100), []);
  const columnGeo = useMemo(() => new THREE.CylinderGeometry(1.5, 2, 40, 32), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      graphiteMaterial.dispose();
      copperMaterial.dispose();
      clayMaterial.dispose();
      floorGeo.dispose();
      pathwayGeo.dispose();
      columnGeo.dispose();
    };
  }, [graphiteMaterial, copperMaterial, clayMaterial, floorGeo, pathwayGeo, columnGeo]);

  return (
    <group>
      {/* Soft indirect lighting - warm copper and graphite reflection */}
      <ambientLight intensity={0.05} color="#2b1d11" />
      
      {/* Main architectural key light from top-left, warm copper hue */}
      <directionalLight
        position={[-10, 20, -5]}
        intensity={0.6}
        color="#d48a55"
        castShadow
      />

      {/* Subtle bottom bounce light from clay floor */}
      <directionalLight
        position={[0, -10, 0]}
        intensity={0.15}
        color="#8b5a2b"
      />

      {/* --- Architectural Elements --- */}
      {/* Massive graphite floor */}
      <mesh position={[0, -2.5, 0]} material={graphiteMaterial} geometry={floorGeo} receiveShadow />

      {/* Embedded copper pathways (curved rings on the floor) */}
      <group position={[0, -1.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={copperMaterial} geometry={pathwayGeo} />
        <mesh material={copperMaterial} scale={[0.7, 0.7, 1]} geometry={pathwayGeo} />
        <mesh material={copperMaterial} scale={[1.3, 1.3, 1]} geometry={pathwayGeo} />
      </group>

      {/* Organic Curved Structures (Graphite columns rising into the dark) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 18;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[x, 15, z]}>
            {/* Massive arching column */}
            <mesh
              rotation={[0.2 * Math.sin(angle), 0, 0.2 * Math.cos(angle)]}
              material={graphiteMaterial}
              geometry={columnGeo}
              receiveShadow
              castShadow
            />
            {/* Clay base collar */}
            <mesh position={[0, -17.2, 0]} material={clayMaterial}>
              <cylinderGeometry args={[2.2, 2.4, 1.2, 16]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
export default LivingSystemEnvironment;
