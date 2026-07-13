import { useRef, useEffect } from 'react';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import KnowledgeObject from './KnowledgeObject';
import Particles from './Particles';

gsap.registerPlugin(ScrollTrigger);

const Scene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    if (!cameraRef.current) return;

    // Set initial camera position
    cameraRef.current.position.set(0, 0, 5);

    // Scroll-driven camera movement along Z-axis
    // The camera will push deeper into the scene as the user scrolls
    const scrollAnimation = gsap.to(cameraRef.current.position, {
      z: -20, // Move forward into the scene
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      },
    });

    return () => {
      scrollAnimation.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={50} position={[0, 0, 5]} />

      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Environment for nice reflections */}
      <Environment preset="studio" />

      {/* The Central Living Object */}
      <KnowledgeObject />

      {/* Subtle background particles */}
      <Particles />
    </>
  );
};

export default Scene;
