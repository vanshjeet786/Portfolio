import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CLINICAL_CLAY = '#c8a68a';
const DEEP_BRONZE = '#7a4f3a';
const MUTED_PLUM = '#8f5162';

export const StanceScene = ({ position }: { position: [number, number, number] }) => {
  const spineGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const vertebraeRefs = useRef<(THREE.Mesh | null)[]>([]);

  const numVertebrae = 12;
  const injuredIndex = 8; // L4 Lumbar Vertebra

  const initialPositions = useMemo(() => {
    return Array.from({ length: numVertebrae }).map((_, i) => {
      const y = (i - numVertebrae / 2) * 0.4;
      const x = Math.sin(i * 0.4) * 0.2;
      const z = Math.cos(i * 0.4) * 0.2;
      return new THREE.Vector3(x, y, z);
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (spineGroupRef.current) {
      // Slow observational drift: less "alarm", more clinical showcase.
      spineGroupRef.current.rotation.y = Math.sin(time * 0.18) * 0.24;
      spineGroupRef.current.rotation.x = Math.sin(time * 0.12) * 0.06;
      spineGroupRef.current.position.y = Math.sin(time * 0.28) * 0.08;
    }

    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.05 + Math.sin(time * 1.1) * 0.22;
    }

    // Dynamic animation for individual vertebrae
    vertebraeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;

      // Barely perceptible breathing keeps the model alive without feeling frantic.
      const breathe = Math.sin(time * 0.9 + i * 0.22) * 0.012;
      mesh.scale.set(1 + breathe, 1 + breathe, 1 + breathe);
      
      // The focal vertebra signals softly instead of flashing.
      if (i === injuredIndex) {
        const pulse = Math.sin(time * 1.8) * 0.035;
        mesh.scale.set(1.06 + pulse, 1.06 + pulse, 1.06 + pulse);
      }
    });
  });

  return (
    <group position={position}>
      <ambientLight intensity={0.1} />
      
      <group ref={spineGroupRef} scale={[2.5, 2.5, 2.5]}>
        
        {/* Central Luminous Core (replaces the Monolith's core, but runs through the spine) */}
        <mesh ref={coreRef} position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 5.0, 16]} />
          <meshStandardMaterial
            color={DEEP_BRONZE}
            emissive={DEEP_BRONZE}
            emissiveIntensity={1.05}
            toneMapped={false}
            transparent
            opacity={0.64}
          />
          <pointLight color={DEEP_BRONZE} intensity={2.2} distance={8} />
        </mesh>

        {/* Procedural Vertebrae Nodes */}
        {initialPositions.map((pos, i) => (
          <mesh
            key={i}
            ref={(el) => {
              vertebraeRefs.current[i] = el;
            }}
            position={[pos.x, pos.y, pos.z]}
          >
            <cylinderGeometry args={[0.25, 0.28, 0.3, 16]} />
            
            <meshPhysicalMaterial
              color={i === injuredIndex ? MUTED_PLUM : "#0b0908"}
              metalness={0.72}
              roughness={0.22}
              transmission={0.78}
              thickness={1.5}
              ior={1.5}
              clearcoat={1}
              clearcoatRoughness={0.16}
              wireframe={false}
            />

            {/* Glowing anomaly node inside the focal injured vertebra */}
            {i === injuredIndex && (
              <mesh position={[0.16, -0.12, 0.16]} scale={[1.5, 1.2, 1.5]}>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial 
                  color={MUTED_PLUM}
                  emissive={MUTED_PLUM}
                  emissiveIntensity={1.6}
                  roughness={0.28}
                  metalness={0.45}
                  transparent 
                  opacity={0.72} 
                  wireframe={true}
                />
              </mesh>
            )}
          </mesh>
        ))}
      </group>
      
      {/* Dramatic Lighting matching the Stance Vibe */}
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={2.8}
        color={CLINICAL_CLAY}
        castShadow
      />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.2}
        penumbra={1}
        intensity={0.8}
        color={MUTED_PLUM}
      />
    </group>
  );
};
