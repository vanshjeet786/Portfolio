import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
      // Gentle floating and spinning animation matching the original monolith's vibe
      spineGroupRef.current.rotation.y = time * 0.1;
      spineGroupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }

    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 2 + Math.sin(time * 3) * 1.5;
    }

    // Dynamic animation for individual vertebrae
    vertebraeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;

      // Add a slight breathing expansion
      const breathe = Math.sin(time * 2 + i * 0.2) * 0.02;
      mesh.scale.set(1 + breathe, 1 + breathe, 1 + breathe);
      
      // Injured index pulses more aggressively
      if (i === injuredIndex) {
        const pulse = Math.sin(time * 8) * 0.1;
        mesh.scale.set(1.1 + pulse, 1.1 + pulse, 1.1 + pulse);
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
            color="#e11d48"
            emissive="#e11d48"
            emissiveIntensity={2}
            toneMapped={false}
            transparent
            opacity={0.8}
          />
          <pointLight color="#e11d48" intensity={5} distance={10} />
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
              color={i === injuredIndex ? "#e11d48" : "#050505"}
              metalness={0.9}
              roughness={0.1}
              transmission={0.95}
              thickness={1.5}
              ior={1.5}
              clearcoat={1}
              clearcoatRoughness={0.1}
              wireframe={false}
            />

            {/* Glowing anomaly node inside the focal injured vertebra */}
            {i === injuredIndex && (
              <mesh position={[0.16, -0.12, 0.16]} scale={[1.5, 1.2, 1.5]}>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial 
                  color="#e11d48"
                  emissive="#e11d48"
                  emissiveIntensity={3}
                  roughness={0.15}
                  metalness={0.8}
                  transparent 
                  opacity={0.9} 
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
        intensity={2}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.2}
        penumbra={1}
        intensity={1}
        color="#e11d48"
      />
    </group>
  );
};
