import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const CursorRefraction = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (!meshRef.current) return;

    // Calculate mouse position in 3D space at a fixed distance from the camera
    const distance = 8; // Distance from camera
    targetPosition.current.set(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      camera.position.z - distance
    );

    // Smoothly interpolate the mesh position towards the target
    meshRef.current.position.lerp(targetPosition.current, 0.1);
    
    // Add subtle rotation
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={2}
        chromaticAberration={0.15}
        anisotropy={0.2}
        distortion={0.5}
        distortionScale={0.5}
        temporalDistortion={0.1}
        ior={1.2}
        color="#ffffff"
        metalness={0.1}
        roughness={0.1}
        transmission={1.0}
      />
    </mesh>
  );
};
