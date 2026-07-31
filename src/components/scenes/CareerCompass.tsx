import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLoadStore } from '@/stores/useLoadStore';

export const CareerCompass = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Register loaded state
    useLoadStore.getState().setCompassLoaded(true);
  }, []);
  const needleRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Very heavy, subtle floating
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.15;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = Math.sin(time * 0.2) * 0.3;
      outerRingRef.current.rotation.y = time * 0.1;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = Math.cos(time * 0.3) * 0.4;
      innerRingRef.current.rotation.y = -time * 0.15;
    }

    if (coreRef.current) {
      // Pulse the core
      const pulse = Math.sin(time * 2) * 0.2 + 0.8;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    if (needleRef.current) {
      // Magnetic snapping effect
      const targetRotation = Math.sin(time * 1.2) * 0.5;
      needleRef.current.rotation.z += (targetRotation - needleRef.current.rotation.z) * 0.08;
      // Also spin the prism on its local axis
      needleRef.current.rotation.y = time * 0.5;
    }
  });

  return (
    <group position={position} ref={groupRef} scale={[1.8, 1.8, 1.8]}>
      {/* High-contrast lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={4} color="#00f0ff" distance={10} />

      {/* Outer Monolithic Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.5, 0.15, 32, 100]} />
        <meshPhysicalMaterial 
          color="#111111"
          metalness={1}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Inner Monolithic Ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[2.0, 0.08, 32, 100]} />
        <meshPhysicalMaterial 
          color="#222222"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Glowing Quantum Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Floating Glass Prism Needle */}
      <mesh ref={needleRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          metalness={0.1}
          roughness={0.05}
          transmission={1}
          thickness={1.5}
          ior={1.5}
        />
      </mesh>
    </group>
  );
};
