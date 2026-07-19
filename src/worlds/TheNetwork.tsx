import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NetworkNode {
  position: [number, number, number];
  materialType: 'clay' | 'glass' | 'stone';
  scale: number;
}

/**
 * TheNetwork
 * The Hero Object for Skillometer.
 * Spec: "A living structure. Organic. Elegant. Slow. Nodes. Connections. Relationships.
 * Handcrafted, never procedural. Communicating understanding, not technology."
 */
export const TheNetwork: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const connectionsRef = useRef<THREE.LineSegments>(null);

  // Materials
  const clayMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#9c6e4e'),
        roughness: 0.9,
        metalness: 0.05,
      }),
    []
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#e5d5c0'),
        roughness: 0.2,
        metalness: 0.1,
        transmission: 0.9,
        ior: 1.45,
        thickness: 0.6,
        clearcoat: 0.8,
        transparent: true,
        opacity: 0.8,
      }),
    []
  );

  const stoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2e2d2c'),
        roughness: 0.95,
        metalness: 0.1,
      }),
    []
  );

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#b87333'), // Copper connection lines
        transparent: true,
        opacity: 0.25,
        linewidth: 1.5,
      }),
    []
  );

  // Handcrafted asymmetrical coordinates (never procedural)
  const nodes: NetworkNode[] = useMemo(
    () => [
      { position: [0, 1.2, 0], materialType: 'clay', scale: 0.35 },
      { position: [-1.2, 0.4, 0.8], materialType: 'glass', scale: 0.28 },
      { position: [1.4, 0.8, -0.6], materialType: 'stone', scale: 0.3 },
      { position: [0.3, -0.6, 1.2], materialType: 'glass', scale: 0.24 },
      { position: [-0.9, -1.0, -1.0], materialType: 'clay', scale: 0.26 },
      { position: [-2.2, 0.1, -0.3], materialType: 'stone', scale: 0.32 },
      { position: [2.1, -0.2, 0.5], materialType: 'clay', scale: 0.25 },
      { position: [-0.5, 2.2, -0.8], materialType: 'glass', scale: 0.27 },
      { position: [0.8, 2.4, 0.9], materialType: 'stone', scale: 0.23 },
      { position: [-1.8, 1.8, 1.1], materialType: 'clay', scale: 0.22 },
      { position: [1.9, 1.9, -1.2], materialType: 'glass', scale: 0.26 },
      { position: [-0.1, -2.1, -0.2], materialType: 'stone', scale: 0.34 },
    ],
    []
  );

  // Handcrafted pairs forming meaningful connection pathways
  const connectionPairs: number[][] = useMemo(
    () => [
      [0, 1], [0, 2], [0, 7], [0, 8],
      [1, 3], [1, 5], [1, 9],
      [2, 6], [2, 10],
      [3, 11], [4, 5], [4, 11],
      [5, 9], [6, 10], [7, 10], [8, 10]
    ],
    []
  );

  // Build the connection line geometry
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points: number[] = [];

    connectionPairs.forEach(([i, j]) => {
      const p1 = nodes[i].position;
      const p2 = nodes[j].position;
      points.push(...p1, ...p2);
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [nodes, connectionPairs]);

  // Clean up
  useEffect(() => {
    return () => {
      clayMaterial.dispose();
      glassMaterial.dispose();
      stoneMaterial.dispose();
      lineMaterial.dispose();
      lineGeometry.dispose();
    };
  }, [clayMaterial, glassMaterial, stoneMaterial, lineMaterial, lineGeometry]);

  // Slow, breathing/pulsing animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Extremely slow rotation
      groupRef.current.rotation.y = t * 0.03;
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.4, 0]}>
      {/* Handcrafted connection lines */}
      <lineSegments ref={connectionsRef} geometry={lineGeometry} material={lineMaterial} />

      {/* Handcrafted nodes */}
      {nodes.map((node, index) => {
        const mat =
          node.materialType === 'clay'
            ? clayMaterial
            : node.materialType === 'glass'
            ? glassMaterial
            : stoneMaterial;

        return (
          <mesh
            key={index}
            position={node.position}
            material={mat}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[node.scale, 32, 32]} />
          </mesh>
        );
      })}
    </group>
  );
};
export default TheNetwork;
