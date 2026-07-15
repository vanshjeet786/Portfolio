"use client"
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function SpineModel({ isVisible = true }: { isVisible?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const materialRefs = useRef<THREE.MeshPhysicalMaterial[]>([])

  // Create 12 procedural vertebrae
  const numVertebrae = 12

  // Initial positions
  const initialPositions = useMemo(() => {
    return Array.from({ length: numVertebrae }).map((_, i) => {
      // Curve of the spine
      const y = (i - numVertebrae / 2) * 0.4
      const x = Math.sin(i * 0.4) * 0.2
      const z = Math.cos(i * 0.4) * 0.2
      return new THREE.Vector3(x, y, z)
    })
  }, [])

  // "Injured" vertebra index (e.g. lower back, index 8)
  const injuredIndex = 8

  useGSAP(() => {
    if (!isVisible || !groupRef.current) return

    // Create a dummy object to track scroll progress
    const progressTracker = { val: 0 };

    // We use ScrollTrigger to animate the dummy object
    gsap.to(progressTracker, {
      val: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#stance-health", // Ensure section has this ID
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      onUpdate: () => {
        if (!groupRef.current) return;
        const p = progressTracker.val;

        // Rotate spine based on scroll progress
        groupRef.current.rotation.y = p * Math.PI * 4;
        groupRef.current.rotation.z = p * Math.PI * 0.5;
        groupRef.current.position.y = p * 2; // move up slightly to center the injured point

        groupRef.current.children.forEach((mesh, i) => {
          const factor = 1 + (p * 2); // expand 3x at bottom

          mesh.position.x = initialPositions[i].x * factor * (1 + (p*2));
          mesh.position.y = initialPositions[i].y * factor;
          mesh.position.z = initialPositions[i].z * factor * (1 + (p*2));

          // Healing color effect for injured point
          if (i === injuredIndex && materialRefs.current[i]) {
             // #ff3333 -> #ddfe71
             const r = THREE.MathUtils.lerp(1, 0.86, Math.min(p * 2, 1));
             const g = THREE.MathUtils.lerp(0.2, 0.99, Math.min(p * 2, 1));
             const b = THREE.MathUtils.lerp(0.2, 0.44, Math.min(p * 2, 1));
             materialRefs.current[i].color.setRGB(r, g, b);
          }
        })
      }
    })
  }, { dependencies: [isVisible, initialPositions] });

  // Continuous subtle idle animation
  useFrame((state) => {
      if (groupRef.current) {
         groupRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002;
      }
  });

  if (!isVisible) return null

  return (
    <group ref={groupRef} scale={[1.5, 1.5, 1.5]} position={[1.5, 0, 0]}>
      {initialPositions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <cylinderGeometry args={[0.25, 0.28, 0.3, 16]} />

          <MeshTransmissionMaterial
            ref={(el) => {
               if(el) materialRefs.current[i] = el as any;
            }}
            color={i === injuredIndex ? "#ff3333" : "#addcec"}
            backside={true}
            samples={4}
            thickness={0.8}
            chromaticAberration={0.1}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.1}
            transparent={true}
            opacity={0.9}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}
