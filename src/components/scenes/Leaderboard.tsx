import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Leaderboard = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const count = 200;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const initialData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 40,
      scaleY: Math.random() * 5 + 1,
      speed: Math.random() * 2 + 0.5,
      offset: Math.random() * Math.PI * 2
    }));
  }, [count]);

  useFrame((state) => {
    if (instancedMeshRef.current) {
      initialData.forEach((data, i) => {
        const time = state.clock.elapsedTime;
        // Oscillate height
        const heightMultiplier = Math.sin(time * data.speed + data.offset) * 0.5 + 0.5;
        const currentScaleY = data.scaleY * (0.2 + 0.8 * heightMultiplier);

        dummy.position.set(data.x, currentScaleY / 2 - 10, data.z);
        dummy.scale.set(1, currentScaleY, 1);
        dummy.updateMatrix();
        instancedMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      <ambientLight intensity={0.2} color="#4a148c" />
      <directionalLight position={[10, 20, 10]} intensity={1} color="#e1bee7" />
      <pointLight position={[0, -5, 0]} intensity={2} color="#aa00ff" distance={30} />

      <instancedMesh ref={instancedMeshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#311b92"
          roughness={0.2}
          metalness={0.8}
          emissive="#651fff"
          emissiveIntensity={0.2}
        />
      </instancedMesh>
    </group>
  );
};
