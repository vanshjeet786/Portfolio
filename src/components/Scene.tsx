"use client";

import React, { Suspense, useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import HeroCube from "./HeroCube";
import { SpineModel } from "./SpineModel";
import * as THREE from 'three';

// Camera transition controller
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (!cameraRef.current) return;

    // Smooth GSAP-like camera transitions moving through Z space based on scroll
    // We travel through the "worlds" by moving the camera deeper
    const targetZ = 8 - (scrollProgress * 20);
    const targetY = -(scrollProgress * 5);

    cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.05);
    cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, targetY, 0.05);
    cameraRef.current.lookAt(0, targetY, targetZ - 10);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 8]} fov={45} />;
}


export default function Scene() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);

  const particlesArray = useMemo(() => {
    return new Float32Array(1500).fill(0).map(() => (Math.random() - 0.5) * 40);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setMaxScroll(document.documentElement.scrollHeight - window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isClient = typeof window !== 'undefined';
  const viewportHeight = isClient ? window.innerHeight : 800;

  const scrollProgress = maxScroll > 0 ? scrollPosition / maxScroll : 0;

  // Render logic based on scroll depth
  const isHeroVisible = scrollProgress < 0.3;
  // Stance health is approx 60% down the page
  const isSpineVisible = scrollProgress > 0.4 && scrollProgress < 0.8;

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <Canvas>
        <CameraController scrollProgress={scrollProgress} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          {isClient && <HeroCube isVisible={isHeroVisible} scrollProgress={scrollProgress} />}
          {isClient && <SpineModel isVisible={isSpineVisible} />}

          {/* Ambient particles for the journey through worlds */}
          <group position={[0, -10, -20]}>
             <points>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={500}
                    array={particlesArray}
                    itemSize={3}
                    args={[particlesArray, 3]}
                  />
                </bufferGeometry>
                <pointsMaterial size={0.05} color="#8B864E" transparent opacity={0.4} />
             </points>
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
