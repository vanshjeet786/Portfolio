/* eslint-disable react-hooks/immutability */
import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useInteractionStore } from '@/stores/useInteractionStore';
import * as THREE from 'three';
import anime from 'animejs';

/**
 * HeroCube
 * The centrepiece. Represents possibility, potential, unformed thinking.
 * Spec: "The cube should feel heavy, physical, beautifully crafted."
 * "It should wait, respond, transform, pause."
 * 
 * Anime.js is used ONLY for the cube transformation.
 * The cube must not constantly animate.
 */

// Brass-like material for the cube edges/wireframe
function useBrassMaterial() {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#c5a880'),
        roughness: 0.35,
        metalness: 0.85,
        emissive: new THREE.Color('#c5a880'),
        emissiveIntensity: 0.03,
      }),
    []
  );
  useEffect(() => {
    return () => mat.dispose();
  }, [mat]);
  return mat;
}

// Stone-like material for cube faces
function useStoneMaterial() {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1a1816'),
        roughness: 0.88,
        metalness: 0.08,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );
  useEffect(() => {
    return () => mat.dispose();
  }, [mat]);
  return mat;
}

export const HeroCube: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const rotationState = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const hoverState = useRef({ scale: 1, emissive: 0.03 });
  const isHovering = useInteractionStore((s) => s.isHovering);
  const cursorPosition = useInteractionStore((s) => s.cursorPosition);

  const stoneMaterial = useStoneMaterial();
  const brassMaterial = useBrassMaterial();

  // Cube geometry — spec says heavy, physical
  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(1.6, 1.6, 1.6, 1, 1, 1), []);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(cubeGeometry), [cubeGeometry]);

  useEffect(() => {
    return () => {
      cubeGeometry.dispose();
      edgesGeometry.dispose();
    };
  }, [cubeGeometry, edgesGeometry]);

  // Anime.js hover transformation
  const triggerHoverIn = useCallback(() => {
    anime({
      targets: hoverState.current,
      scale: 1.04,
      emissive: 0.08,
      duration: 600,
      easing: 'easeOutCubic',
    });
  }, []);

  const triggerHoverOut = useCallback(() => {
    anime({
      targets: hoverState.current,
      scale: 1.0,
      emissive: 0.03,
      duration: 800,
      easing: 'easeOutCubic',
    });
  }, []);

  useEffect(() => {
    if (isHovering) {
      triggerHoverIn();
    } else {
      triggerHoverOut();
    }
  }, [isHovering, triggerHoverIn, triggerHoverOut]);

  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const scrollProgress = useInteractionStore((s) => s.scrollProgress);

  // Idle rotation — extremely slow, deliberate
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Very slow idle rotation — the cube waits
    rotationState.current.targetX += delta * 0.015;
    rotationState.current.targetY += delta * 0.02;

    // Pointer influence — subtle tilt response
    const pointerInfluenceX = cursorPosition.y * 0.08;
    const pointerInfluenceY = cursorPosition.x * 0.1;

    // Smooth interpolation
    const lerpFactor = 1 - Math.pow(0.001, delta);
    rotationState.current.x += 
      (rotationState.current.targetX + pointerInfluenceX - rotationState.current.x) * lerpFactor;
    rotationState.current.y += 
      (rotationState.current.targetY + pointerInfluenceY - rotationState.current.y) * lerpFactor;

    groupRef.current.rotation.x = rotationState.current.x;
    groupRef.current.rotation.y = rotationState.current.y;

    // Transition scaling and opacity based on scrollProgress (0.20 to 0.28)
    let transitionScale = 1;
    let transitionOpacity = 1;
    if (scrollProgress >= 0.20) {
      const progress = Math.min(1, (scrollProgress - 0.20) / 0.08);
      transitionScale = 1 - progress;
      transitionOpacity = 1 - progress;
    }

    // Apply anime.js-driven scale modulated by scroll transition
    const s = hoverState.current.scale * transitionScale;
    groupRef.current.scale.set(s, s, s);

    // Fade materials
    stoneMaterial.opacity = 0.85 * transitionOpacity;
    if (lineMaterialRef.current) {
      lineMaterialRef.current.opacity = 0.5 * transitionOpacity;
    }

    // Update emissive intensity
    if (brassMaterial.emissiveIntensity !== hoverState.current.emissive) {
      brassMaterial.emissiveIntensity = hoverState.current.emissive;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* Solid cube face — dark stone */}
      <mesh ref={cubeRef} geometry={cubeGeometry} material={stoneMaterial} />

      {/* Brass edge wireframe — gives the cube its crafted, architectural feel */}
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color="#c5a880"
          transparent
          opacity={0.5}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
};
