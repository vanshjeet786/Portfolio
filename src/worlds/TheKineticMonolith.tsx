import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * TheKineticMonolith
 * Hero Object for Leaderboard — "The Arena"
 *
 * Physical First Concept:
 * A monumental vertical structure composed of hundreds of precision-machined blocks.
 * It is not a UI. It is an architectural representation of progress, competition, and mastery.
 * When rankings change, the monument slowly reorganizes itself.
 * Movement is mechanical, inevitable, physical, and heavy.
 *
 * Materials: Blackened Steel, Brushed Aluminium.
 * Silhouette: Unmistakably a towering, shifting monolith.
 */
export const TheKineticMonolith: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const blocksRef = useRef<THREE.InstancedMesh>(null);

  const blockCount = 120; // Hundreds of blocks
  
  // Materials
  const blackenedSteelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1a1a1c'),
        roughness: 0.6,
        metalness: 0.8,
      }),
    []
  );

  const brushedAluminiumMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#787880'),
        roughness: 0.5,
        metalness: 0.7,
      }),
    []
  );

  // Geometry
  const blockGeo = useMemo(() => new THREE.BoxGeometry(1.8, 0.4, 1.8), []);

  // Block data for animation
  const blockData = useRef<{
    targetY: number; currentY: number;
    targetX: number; currentX: number;
    targetZ: number; currentZ: number;
    speed: number; phase: number; isCore: boolean;
  }[]>([]);

  useEffect(() => {
    blockData.current = Array.from({ length: blockCount }).map((_, i) => {
      // Form a towering core
      const yLevel = Math.floor(i / 4);
      const isCore = i % 4 === 0;
      
      return {
        targetY: yLevel * 0.42,
        currentY: yLevel * 0.42,
        targetX: (Math.random() - 0.5) * (isCore ? 0.2 : 2.0),
        currentX: (Math.random() - 0.5) * (isCore ? 0.2 : 2.0),
        targetZ: (Math.random() - 0.5) * (isCore ? 0.2 : 2.0),
        currentZ: (Math.random() - 0.5) * (isCore ? 0.2 : 2.0),
        speed: 0.005 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
        isCore
      };
    });
  }, []);

  useEffect(() => {
    return () => {
      blackenedSteelMat.dispose();
      brushedAluminiumMat.dispose();
      blockGeo.dispose();
    };
  }, [blackenedSteelMat, brushedAluminiumMat, blockGeo]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!blocksRef.current || !groupRef.current || blockData.current.length === 0) return;

    // The entire monolith rotates extremely slowly, giving it monumental weight
    groupRef.current.rotation.y = time * 0.02;

    const dummy = new THREE.Object3D();
    
    blockData.current.forEach((data, i) => {
      // Every few seconds, blocks shift to a new "ranking" state
      // We simulate this by modulating their target positions based on a slow sine wave
      // The movement is slow and deliberate
      
      const shiftTrigger = Math.sin(time * 0.5 + data.phase);
      
      if (!data.isCore) {
         if (shiftTrigger > 0.9) {
           data.targetX = (Math.random() - 0.5) * 3.0;
           data.targetZ = (Math.random() - 0.5) * 3.0;
         }
      }

      // Mechanically lerp towards target
      data.currentX += (data.targetX - data.currentX) * data.speed;
      data.currentZ += (data.targetZ - data.currentZ) * data.speed;

      dummy.position.set(data.currentX, data.currentY, data.currentZ);
      
      // Slight mechanical rotations
      dummy.rotation.y = data.currentX * 0.2;
      
      // Core blocks are taller, outer blocks are flatter
      const scaleY = data.isCore ? 2.0 : 1.0;
      dummy.scale.set(1, scaleY, 1);
      
      dummy.updateMatrix();
      blocksRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Assign materials: Core is dark steel, outer blocks are lighter aluminium to catch light
      blocksRef.current!.setColorAt(i, data.isCore ? new THREE.Color('#1a1a1c') : new THREE.Color('#787880'));
    });
    
    blocksRef.current.instanceMatrix.needsUpdate = true;
    if (blocksRef.current.instanceColor) blocksRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0, -2, -10]}>
      {/* Central spine shaft - gives the structure a grounded feeling */}
      <mesh position={[0, 15, 0]} material={blackenedSteelMat} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 30, 8]} />
      </mesh>

      <instancedMesh
        ref={blocksRef}
        args={[blockGeo, brushedAluminiumMat, blockCount]}
        castShadow
        receiveShadow
      />
    </group>
  );
};
export default TheKineticMonolith;
