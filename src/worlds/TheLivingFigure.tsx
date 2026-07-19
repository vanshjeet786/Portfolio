import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * TheLivingFigure
 * Hero Object for Stance Health — "The Sanctuary"
 *
 * Physical First Concept:
 * An elegant abstract human form built from layered translucent surfaces.
 * It is not anatomical. It represents health, presence, and movement.
 * The form slowly breathes — almost imperceptibly expanding and contracting.
 *
 * Materials: Frosted Glass / Translucent resin.
 */
export const TheLivingFigure: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const layerCount = 40;
  
  // Frosted, layered translucent material
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f0f4f8'),
        transmission: 0.8,
        opacity: 1,
        transparent: true,
        roughness: 0.3,
        metalness: 0.1,
        ior: 1.5,
        thickness: 0.2,
      }),
    []
  );

  // Each layer of the figure is a thin, smooth organic slice
  const layerGeo = useMemo(() => new THREE.CylinderGeometry(1, 1, 0.15, 32), []);

  const layersData = useRef<{ scaleX: number, scaleZ: number, offsetY: number, phase: number }[]>([]);

  useEffect(() => {
    layersData.current = Array.from({ length: layerCount }).map((_, i) => {
      // Create an abstract silhouette of a human standing peacefully
      // Base (legs), Middle (torso), Top (shoulders/head)
      const t = i / (layerCount - 1);
      
      let radius: number;
      if (t < 0.3) {
        radius = 0.8 + Math.sin(t * Math.PI) * 0.2; // Legs
      } else if (t < 0.7) {
        radius = 1.2 + Math.sin((t - 0.3) * Math.PI * 1.5) * 0.4; // Torso
      } else {
        radius = 0.9 + Math.cos((t - 0.7) * Math.PI * 1.5) * 0.3; // Head/Shoulders
      }

      return {
        scaleX: radius * 1.8,
        scaleZ: radius * 1.2,
        offsetY: i * 0.2,
        phase: t * Math.PI * 2, // Phase offset for breathing ripple
      };
    });

    return () => {
      glassMat.dispose();
      layerGeo.dispose();
    };
  }, [glassMat, layerGeo]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current || layersData.current.length === 0) return;

    // The whole figure rotates extremely slowly
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;

    // Apply the imperceptible "breathing" animation
    groupRef.current.children.forEach((child, i) => {
      const data = layersData.current[i];
      if (data) {
        // Breath rate is slow and calming (~12 breaths per minute, so a 5-second cycle)
        const breath = Math.sin(time * 1.2 + data.phase * 0.2) * 0.05;
        
        child.position.y = data.offsetY + breath * (i * 0.02); // Taller layers expand more
        child.scale.set(data.scaleX * (1 + breath), 1, data.scaleZ * (1 + breath));
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      {Array.from({ length: layerCount }).map((_, i) => (
        <mesh
          key={i}
          material={glassMat}
          geometry={layerGeo}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
};
export default TheLivingFigure;
