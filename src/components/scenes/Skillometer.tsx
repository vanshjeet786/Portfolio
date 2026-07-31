import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Skillometer = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create 15 concentric rings
  const ringCount = 15;
  const rings = useMemo(() => Array.from({ length: ringCount }), []);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Gentle tilt
      groupRef.current.rotation.x = Math.PI / 4 + Math.sin(time * 0.2) * 0.1;
      groupRef.current.rotation.y = Math.cos(time * 0.15) * 0.1;
    }

    // Ripple effect on the rings
    rings.forEach((_, i) => {
      const mesh = ringRefs.current[i];
      if (mesh) {
        // Offset each ring's phase based on its radius index
        const phaseOffset = i * 0.4;
        const targetY = Math.sin(time * 1.5 - phaseOffset) * 0.3;
        // Add a slight spin
        mesh.rotation.z = time * (0.05 + i * 0.005);
        mesh.position.z = targetY;
      }
    });
  });

  return (
    <group position={position} ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* Warm, golden lighting for the "Living System" vibe */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#f59e0b" distance={8} />
      <directionalLight position={[-5, 5, 2]} intensity={1} color="#ffffff" />
      
      {rings.map((_, i) => {
        const radius = 0.5 + i * 0.3;
        const thickness = 0.05;
        
        return (
          <mesh
            key={i}
            ref={(el) => { ringRefs.current[i] = el; }}
          >
            {/* TubeGeometry for a smooth, thick ring */}
            <tubeGeometry args={[new THREE.CatmullRomCurve3([
              new THREE.Vector3(radius, 0, 0),
              new THREE.Vector3(0, radius, 0),
              new THREE.Vector3(-radius, 0, 0),
              new THREE.Vector3(0, -radius, 0)
            ], true), 64, thickness, 16, true]} />
            
            {/* Premium Refractive Glass Material */}
            <meshPhysicalMaterial 
              color="#222222"
              emissive="#f59e0b"
              emissiveIntensity={i % 3 === 0 ? 0.2 : 0} // highlight every 3rd ring
              metalness={0.9}
              roughness={0.1}
              transmission={0.9}
              thickness={0.5}
              ior={1.4}
              clearcoat={1}
            />
          </mesh>
        );
      })}

      {/* Central "Seed" or Node */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#f59e0b" 
          emissiveIntensity={2} 
          wireframe={true}
        />
      </mesh>
    </group>
  );
};
