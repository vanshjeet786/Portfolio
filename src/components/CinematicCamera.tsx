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
  const currentPosition = useRef(new THREE.Vector3(0, 0, 10));

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

  useFrame((state) => {
    // Calculate gaze-driven parallax offset based on pointer position
    // state.pointer gives normalized device coordinates (-1 to +1)
    const parallaxIntensity = 0.5; // Adjust the intensity of the parallax
    const lookAtParallaxIntensity = 1.0;
    
    const targetX = targetCamera.current.position.x + state.pointer.x * parallaxIntensity;
    const targetY = targetCamera.current.position.y + state.pointer.y * parallaxIntensity;
    
    const finalTargetPosition = new THREE.Vector3(
      targetX,
      targetY,
      targetCamera.current.position.z
    );

    const lookAtTargetX = targetCamera.current.lookAt.x + state.pointer.x * lookAtParallaxIntensity;
    const lookAtTargetY = targetCamera.current.lookAt.y + state.pointer.y * lookAtParallaxIntensity;

    const finalLookAtPosition = new THREE.Vector3(
      lookAtTargetX,
      lookAtTargetY,
      targetCamera.current.lookAt.z
    );

    // Smoothly interpolate current camera position to final target position
    currentPosition.current.lerp(finalTargetPosition, 0.05);
    camera.position.copy(currentPosition.current);
    
    // Smoothly interpolate lookAt
    currentLookAt.current.lerp(finalLookAtPosition, 0.05);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
