import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const OutroScene = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Slow, ominous rotation and levitation
    meshRef.current.rotation.y = time * 0.15;
    meshRef.current.rotation.x = time * 0.1;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    
    // Slight pulsating scale
    const scale = 1 + Math.sin(time * 2) * 0.02;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group position={position}>
      {/* Intense dramatic lighting from above */}
      <spotLight
        position={[0, 10, 0]}
        intensity={8}
        angle={0.6}
        penumbra={1}
        color="#ffffff"
      />
      
      {/* Subtle underglow matching the accent color */}
      <pointLight 
        position={[0, -5, 0]} 
        intensity={2} 
        color="#00f0ff" 
        distance={10} 
      />

      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 4]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={2.5}
          chromaticAberration={0.5}
          anisotropy={0.2}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          ior={1.8}
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};
