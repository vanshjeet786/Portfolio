"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function MorphingCubes() {
  const groupRef = useRef<THREE.Group>(null);

  const size = 0.2;
  const [cubes] = useState<{ position: [number, number, number], initialPosition: [number, number, number], scatteredPosition: [number, number, number] }[]>(() => {
    const spacing = 0.22;
    const gridSize = 4;
    const items: { position: [number, number, number], initialPosition: [number, number, number], scatteredPosition: [number, number, number] }[] = [];

    for (let x = -gridSize/2; x < gridSize/2; x++) {
      for (let y = -gridSize/2; y < gridSize/2; y++) {
        for (let z = -gridSize/2; z < gridSize/2; z++) {
          items.push({
            position: [x * spacing, y * spacing, z * spacing],
            initialPosition: [x * spacing, y * spacing, z * spacing],
            scatteredPosition: [
               (Math.random() - 0.5) * 15,
               (Math.random() - 0.5) * 15,
               (Math.random() - 0.5) * 15
            ],
          });
        }
      }
    }
    return items;
  });

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  useEffect(() => {
    if (!groupRef.current) return;

    const children = groupRef.current.children;

    ScrollTrigger.create({
      trigger: "#landing-section",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        children.forEach((child, i) => {
           const initial = cubes[i].initialPosition;
           const scatter = cubes[i].scatteredPosition;

           let mix = 0;
           if (progress > 0.2) {
             mix = Math.min(1, (progress - 0.2) * 2.5);
           }

           const easeMix = mix < 0.5 ? 4 * mix * mix * mix : 1 - Math.pow(-2 * mix + 2, 3) / 2;

           child.position.set(
             initial[0] + (scatter[0] - initial[0]) * easeMix,
             initial[1] + (scatter[1] - initial[1]) * easeMix,
             initial[2] + (scatter[2] - initial[2]) * easeMix
           );

           child.rotation.x = easeMix * Math.PI * 2 * Math.random();
           child.rotation.y = easeMix * Math.PI * 2 * Math.random();
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }, [cubes]);

  return (
    <group ref={groupRef}>
      {cubes.map((c, i) => (
        <mesh key={i} position={new THREE.Vector3(...c.position)}>
          <boxGeometry args={[size, size, size]} />
          <meshBasicMaterial color="#111111" />
          <lineSegments>
            <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(size, size, size)]} />
            <lineBasicMaterial attach="material" color="#8B864E" transparent opacity={0.5} />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
}

export default function Landing() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );

      gsap.to(textRef.current, {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: "#landing-section",
          start: "top top",
          end: "+=500",
          scrub: true,
        }
      });
    }
  }, []);

  return (
    <section id="landing-section" className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        <div className="absolute inset-0 z-0">
           <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <MorphingCubes />
          </Canvas>
        </div>

        <div ref={textRef} className="z-10 flex flex-col items-center justify-center text-center max-w-4xl px-4 mix-blend-difference pointer-events-none">
          <h1 className="text-white text-5xl md:text-8xl font-bold leading-tight mb-4">
            Vanshjeet Singh
          </h1>
          <h2 className="text-[#8B864E] text-3xl md:text-5xl font-semibold leading-tight mb-12">
            Product Engineer
          </h2>

          <p className="text-white/80 text-xl md:text-2xl font-normal leading-relaxed max-w-2xl">
            Building AI products,<br/>
            interactive experiences,<br/>
            and scalable systems.
          </p>
        </div>
      </div>
    </section>
  );
}
