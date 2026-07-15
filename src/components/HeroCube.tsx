"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function HeroCube({ isVisible = true, scrollProgress = 0 }: { isVisible?: boolean, scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  // Create 125 small cubes to form a 5x5x5 grid (representing the large cube)
  const cubeSize = 2;
  const gridSize = 5;
  const pieceSize = cubeSize / gridSize;
  const offset = (cubeSize - pieceSize) / 2;

  const pieces = useMemo(() => {
    const arr = [];
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          arr.push({
            id: `${x}-${y}-${z}`,
            initPos: new THREE.Vector3(
              x * pieceSize - offset,
              y * pieceSize - offset,
              z * pieceSize - offset
            ),
            // Random scatter direction
            scatterDir: new THREE.Vector3(
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10
            ),
            // Random rotation speed
            rotSpeed: new THREE.Vector3(
              Math.random() * 2,
              Math.random() * 2,
              Math.random() * 2
            )
          });
        }
      }
    }
    return arr;
  }, [pieceSize, offset]);

  // Use anime.js for the initial subtle floating when not scrolled
  useEffect(() => {
    let animeInstance: any;
    import('animejs').then((module) => {
      const anime = (module as any).default || module;
      if (groupRef.current && scrollProgress < 0.1) {
        animeInstance = anime({
          targets: groupRef.current.position,
          y: [0, 0.2, 0],
          duration: 4000,
          easing: 'easeInOutSine',
          loop: true,
        });
      }
    }).catch(e => console.error("Failed to load animejs", e));

    return () => {
      if (animeInstance) animeInstance.pause();
    }
  }, [scrollProgress]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Subtly react to cursor movement
    targetRotation.current.x = (mouse.y * Math.PI) / 8;
    targetRotation.current.y = (mouse.x * Math.PI) / 8;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      0.02
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      0.02
    );

    // Fracture effect based on scroll
    // Start fracturing after a slight scroll
    const fractureAmount = Math.max(0, (scrollProgress * 3));

    groupRef.current.children.forEach((child, i) => {
      const piece = pieces[i];
      // Move outwards
      child.position.lerpVectors(
        piece.initPos,
        piece.initPos.clone().add(piece.scatterDir.clone().multiplyScalar(fractureAmount)),
        0.1
      );
      // Rotate individually when fracturing
      child.rotation.x += piece.rotSpeed.x * fractureAmount * delta;
      child.rotation.y += piece.rotSpeed.y * fractureAmount * delta;
      child.rotation.z += piece.rotSpeed.z * fractureAmount * delta;

      // Fade out as it scatters far
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = 1 - Math.min(1, fractureAmount / 2);
        mat.transparent = mat.opacity < 1;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {pieces.map((p) => (
        <mesh key={p.id} position={p.initPos}>
          <boxGeometry args={[pieceSize * 0.95, pieceSize * 0.95, pieceSize * 0.95]} />
          <meshStandardMaterial
            color="#8B864E"
            roughness={0.1}
            metalness={0.8}
            transparent={true}
          />
        </mesh>
      ))}
    </group>
  );
}
