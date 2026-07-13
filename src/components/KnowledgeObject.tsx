import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import gsap from 'gsap';

const KnowledgeObject = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const currentSection = useStore((state) => state.currentSection);
  const visitedSections = useStore((state) => state.visitedSections);

  // Slowly breathe
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Subtle rotation
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;

      // Breathing scale
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  // Mutate based on section
  useEffect(() => {
    if (!meshRef.current || !materialRef.current) return;

    const ctx = gsap.context(() => {
      let targetWireframe = false;
      let targetColor = '#000000';
      let targetRoughness = 0.5;
      let targetMetalness = 0.5;
      let targetTransmission = 0;
      let targetIor = 1.5;

      switch (currentSection) {
        case 'home':
          targetColor = '#333333';
          targetRoughness = 0.9;
          targetMetalness = 0.1;
          break;
        case 'career-compass': // Neural Pathways
          targetColor = '#550000';
          targetWireframe = true;
          targetRoughness = 0.2;
          break;
        case 'leaderboard': // Mathematical Structures
          targetColor = '#003300';
          targetRoughness = 0.1;
          targetMetalness = 0.9;
          break;
        case 'stance': // Organic Geometry
          targetColor = '#000044';
          targetRoughness = 0.6;
          targetTransmission = 0.9;
          targetIor = 1.2;
          break;
        case 'exiles-chat': // Communication Networks
          targetColor = '#333333';
          targetWireframe = true;
          targetMetalness = 1;
          break;
        default:
          break;
      }

      gsap.to(materialRef.current, {
        roughness: targetRoughness,
        metalness: targetMetalness,
        transmission: targetTransmission,
        ior: targetIor,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (materialRef.current) {
            materialRef.current.color.set(targetColor);
          }
        }
      });

      // We can't animate wireframe boolean, so we just set it
      setTimeout(() => {
         if (materialRef.current) {
             materialRef.current.wireframe = targetWireframe;
         }
      }, 1000);

    });

    return () => ctx.revert();
  }, [currentSection, visitedSections]);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 4]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#333333"
        roughness={0.9}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
};

export default KnowledgeObject;
