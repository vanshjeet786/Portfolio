import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const StanceHealth = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;

      // Gentle floating
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group position={position}>
      <ambientLight intensity={0.5} color="#e0f7fa" />
      <directionalLight position={[-5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[5, -5, -5]} intensity={0.8} color="#00bcd4" />

      <mesh ref={meshRef} scale={1.5}>
        <torusKnotGeometry args={[1, 0.4, 256, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.1}
          transmission={0.9} // Glass-like effect
          thickness={1.5}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#b2ebf2"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Background soft particles/orbs */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.5 + 0.1, 16, 16]} />
          <meshBasicMaterial color="#b2ebf2" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
};
