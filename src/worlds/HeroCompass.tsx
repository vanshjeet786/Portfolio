/* eslint-disable react-hooks/immutability */
import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useInteractionStore } from '@/stores/useInteractionStore';
import * as THREE from 'three';
import anime from 'animejs';

/**
 * HeroCompass
 * The centerpiece for Career Compass.
 * Spec: "Mechanical, elegant, heavy. Built from brass, stone, and glass."
 * "Reduce movement. Increase presence. Stillness is beautiful.
 * The compass should appear handcrafted. Precise. Important."
 */
export const HeroCompass: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Group>(null);
  const cursorPosition = useInteractionStore((s) => s.cursorPosition);
  const scrollProgress = useInteractionStore((s) => s.scrollProgress);

  // Animation states to drive via Anime.js (Only used for needle rotation now)
  const animationState = useRef({
    needleRotation: 0,
  });

  // Materials following spec: Brass, Stone, Glass
  const brassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#d4af37'), // richer gold/brass
        roughness: 0.15,
        metalness: 0.95,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  const stoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#151515'),
        roughness: 0.9,
        metalness: 0.1,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#ffffff'),
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95, // glass effect
        ior: 1.5,
        thickness: 0.8,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  const needleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#8b0000'), // Deep oxblood red
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  useEffect(() => {
    return () => {
      brassMaterial.dispose();
      stoneMaterial.dispose();
      glassMaterial.dispose();
      needleMaterial.dispose();
    };
  }, [brassMaterial, stoneMaterial, glassMaterial, needleMaterial]);

  // Trigger smooth compass alignment
  const triggerAlignment = useCallback((targetAngle: number) => {
    anime({
      targets: animationState.current,
      needleRotation: targetAngle,
      duration: 2500, // slower, more deliberate
      easing: 'easeOutElastic(1, 0.9)', // less bouncy, heavier feel
    });
  }, []);

  // Sync scroll progression steps to specific needle orientations
  const angleIndex = Math.floor(scrollProgress * 6);
  useEffect(() => {
    const targetAngle = (angleIndex * Math.PI) / 3;
    triggerAlignment(targetAngle);
  }, [angleIndex, triggerAlignment]);

  // Frame tick updates
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Apply the Anime.js-driven needle rotation (perfectly still, no wobble)
    if (needleRef.current) {
      needleRef.current.rotation.y = animationState.current.needleRotation;
    }

    // Calculate transition scaling and opacity based on scrollProgress (0.20 to 0.28)
    let transitionScale = 0;
    let transitionOpacity = 0;
    if (scrollProgress >= 0.20) {
      const progress = Math.min(1, (scrollProgress - 0.20) / 0.08);
      transitionScale = progress;
      transitionOpacity = progress;
    }

    // Apply scroll transition scale
    groupRef.current.scale.set(transitionScale, transitionScale, transitionScale);
    
    // Update material opacities dynamically
    stoneMaterial.opacity = 1.0 * transitionOpacity;
    brassMaterial.opacity = 1.0 * transitionOpacity;
    glassMaterial.opacity = 1.0 * transitionOpacity; // physical transmission handles see-through
    needleMaterial.opacity = 1.0 * transitionOpacity;

    // Parallax response to cursor (extremely subtle, high mass feel)
    const targetX = cursorPosition.x * 0.1;
    const targetY = cursorPosition.y * 0.05;
    
    const lerpFactor = 1 - Math.pow(0.0005, delta);
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * lerpFactor;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * lerpFactor;
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} rotation={[0.5, 0, 0]}>
      {/* Heavy stone housing */}
      <mesh material={stoneMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.5, 64]} />
      </mesh>

      {/* Brass outer rim / measurement indicators */}
      <mesh position={[0, 0.27, 0]} material={brassMaterial} castShadow>
        <torusGeometry args={[1.52, 0.06, 16, 64]} />
      </mesh>

      {/* Brass dial face inner ring */}
      <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} material={brassMaterial}>
        <ringGeometry args={[1.4, 1.48, 64]} />
      </mesh>

      {/* Glass protection cover (thick, real) */}
      <mesh position={[0, 0.35, 0]} material={glassMaterial}>
        <cylinderGeometry args={[1.45, 1.45, 0.06, 64]} />
      </mesh>

      {/* The mechanical compass needle */}
      <group ref={needleRef} position={[0, 0.28, 0]}>
        {/* Central brass pivot pin */}
        <mesh material={brassMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 0.15, 32]} />
        </mesh>
        
        {/* Main pointed pointer - Red end */}
        <mesh position={[0, 0.02, -0.7]} material={needleMaterial} castShadow>
          <coneGeometry args={[0.06, 0.9, 4]} />
        </mesh>

        {/* Counterweight pointer - Brass end */}
        <mesh position={[0, 0.02, 0.5]} rotation={[Math.PI, 0, 0]} material={brassMaterial} castShadow>
          <coneGeometry args={[0.04, 0.7, 4]} />
        </mesh>
      </group>
    </group>
  );
};
export default HeroCompass;
