import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ExilesChat = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * -0.05;

      ringsRef.current.forEach((ring, i) => {
        if (ring) {
          ring.rotation.x = state.clock.elapsedTime * (0.1 + i * 0.05);
          ring.rotation.y = state.clock.elapsedTime * (0.1 + i * 0.02);
        }
      });
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <ambientLight intensity={0.1} color="#000000" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00e5ff" distance={20} />

      {/* Central Core */}
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#000000"
          roughness={0.2}
          metalness={0.9}
          wireframe
        />
      </mesh>

      {/* Cyberpunk Rings */}
      {[2, 3, 4].map((radius, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) ringsRef.current[i] = el; }}
        >
          <torusGeometry args={[radius, 0.05, 16, 100]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#00e5ff" : "#ff0055"} />
        </mesh>
      ))}

      {/* Floating datablocks */}
      {Array.from({ length: 30 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 30);
        const theta = Math.sqrt(30 * Math.PI) * phi;
        const r = 6;

        return (
          <mesh
            key={i}
            position={[
              r * Math.cos(theta) * Math.sin(phi),
              r * Math.sin(theta) * Math.sin(phi),
              r * Math.cos(phi)
            ]}
          >
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color="#000000" />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.2, 0.2, 0.2)]} />
              <lineBasicMaterial color="#00e5ff" />
            </lineSegments>
          </mesh>
        );
      })}
    </group>
  );
};
