import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENE_SPACING } from './CanvasContainer';

interface CullableSceneProps {
  children: ReactNode;
  position: [number, number, number];
}

export const CullableScene = ({ children, position }: CullableSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // We cull scenes that are more than 1.5 scene-lengths away from the camera
  const cullDistance = SCENE_SPACING * 1.5;

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Calculate distance on the Z axis between camera and this scene
    const distanceZ = Math.abs(state.camera.position.z - position[2]);
    
    // Toggle visibility to cull WebGL rendering for off-screen scenes
    if (distanceZ > cullDistance) {
      if (groupRef.current.visible) groupRef.current.visible = false;
    } else {
      if (!groupRef.current.visible) groupRef.current.visible = true;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {children}
    </group>
  );
};
