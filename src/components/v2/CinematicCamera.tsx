import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useStore, SCENE_COUNT } from '@/stores/useStore';
import { SCENE_SPACING } from './CanvasContainer';
import * as THREE from 'three';

export const CinematicCamera = () => {
  const { camera } = useThree();
  const progress = useStore((state) => state.progress);
  const setActiveScene = useStore((state) => state.setActiveScene);
  
  const targetCamera = useRef({
    position: new THREE.Vector3(0, 0, 10),
    lookAt: new THREE.Vector3(0, 0, 0)
  });

  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // We import SCENE_COUNT from useStore to dynamically scale the camera track
  const totalScenes = SCENE_COUNT; 

  useEffect(() => {
    const sceneIndexFloat = progress * (totalScenes - 1);
    const sceneIndex = Math.round(sceneIndexFloat);
    
    // Determine the z offset based on progress
    const totalZDistance = -SCENE_SPACING * (totalScenes - 1);
    const currentZ = 10 + progress * totalZDistance;
    
    // Add cinematic movement
    const driftX = Math.sin(progress * Math.PI * 4) * 1.5;
    const driftY = Math.cos(progress * Math.PI * 4) * 0.5;
    
    targetCamera.current.position.set(driftX, driftY, currentZ);
    targetCamera.current.lookAt.set(
        Math.sin(progress * Math.PI * 4 + Math.PI/2) * 0.5, 
        Math.cos(progress * Math.PI * 4 + Math.PI/2) * 0.5, 
        currentZ - 10
    );

    setActiveScene(sceneIndex);
  }, [progress, setActiveScene, totalScenes]);

  useFrame(() => {
    // Smoothly interpolate current camera position to target position
    camera.position.lerp(targetCamera.current.position, 0.05);
    
    // Smoothly interpolate lookAt
    currentLookAt.current.lerp(targetCamera.current.lookAt, 0.05);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
