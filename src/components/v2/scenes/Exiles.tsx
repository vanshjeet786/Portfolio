import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generate shards outside the component to keep the component pure
const shardCount = 20;
const shardsData = Array.from({ length: shardCount }).map(() => ({
  position: [
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 8
  ] as [number, number, number],
  rotation: [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ] as [number, number, number],
  scale: 0.1 + Math.random() * 0.4,
  speed: 0.2 + Math.random() * 0.5
}));

export const Exiles = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const shardRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (groupRef.current) {
      // Very slow, ominous rotation for the entire group
      groupRef.current.rotation.y = time * 0.05;
    }

    // Orbiting shards
    shardsData.forEach((shard, i) => {
      const mesh = shardRefs.current[i];
      if (mesh) {
        // Orbit around the center
        mesh.position.x = Math.sin(time * shard.speed + i) * (3 + Math.sin(i) * 2);
        mesh.position.z = Math.cos(time * shard.speed + i) * (3 + Math.cos(i) * 2);
        // Spin on their own axes
        mesh.rotation.x += 0.01 * shard.speed;
        mesh.rotation.y += 0.01 * shard.speed;
      }
    });
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Intense Crimson/Copper core light */}
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 0]} intensity={4} color="#e11d48" distance={15} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#ffffff" />
      
      {/* The Central Quantum Obelisk */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 12, 1.5]} />
        <meshPhysicalMaterial 
          color="#050505"
          emissive="#220000"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.15}
          transmission={0.95}
          thickness={1.5}
          ior={1.6}
          clearcoat={1}
        />
      </mesh>

      {/* The Signal Beam inside the Obelisk */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 12, 16]} />
        <meshStandardMaterial 
          color="#e11d48"
          emissive="#e11d48"
          emissiveIntensity={5}
        />
      </mesh>

      {/* The Exiles (Glass Shards) */}
      {shardsData.map((shard, i) => (
        <mesh
          key={i}
          ref={(el) => { shardRefs.current[i] = el; }}
          position={shard.position}
          rotation={shard.rotation}
          scale={[shard.scale, shard.scale * 2, shard.scale * 0.5]}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial 
            color="#111111"
            emissive="#e11d48"
            emissiveIntensity={0.1}
            metalness={0.8}
            roughness={0.2}
            transmission={1}
            thickness={0.5}
            ior={1.3}
          />
        </mesh>
      ))}
    </group>
  );
};
