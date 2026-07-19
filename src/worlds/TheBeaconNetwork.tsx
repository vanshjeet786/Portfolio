import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * TheBeaconNetwork
 * Hero Object for Exiles — "The Signal City"
 *
 * Physical First Concept:
 * This is not a chat UI. This is a signal relay installation — the kind
 * you might find inside a 1930s telegraph exchange building.
 * Tall vertical steel rods (beacon antennas), connected by thin copper
 * signal wires. Warm amber light pulses travel along the wires —
 * slowly, with weight, like real electrical signals.
 *
 * The object communicates: connection, transmission, presence.
 * Not messaging. Not software.
 *
 * Silhouette: Unmistakably vertical. Tall. Asymmetric. Handcrafted.
 */
export const TheBeaconNetwork: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // --- Materials ---
  const steelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3a3d48'),
        roughness: 0.35,
        metalness: 0.9,
      }),
    []
  );

  const walnutMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#4a3020'),
        roughness: 0.88,
        metalness: 0.04,
      }),
    []
  );

  const signalMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#c05820'),
        roughness: 0.0,
        metalness: 0.0,
        emissive: new THREE.Color('#c05820'),
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.75,
      }),
    []
  );

  // Handcrafted beacon rod positions — intentionally asymmetric and vertical
  const beacons = useMemo(
    () => [
      { x: 0, z: 0, height: 3.2, baseRadius: 0.14 },      // Central beacon — tallest
      { x: -0.9, z: 0.7, height: 2.2, baseRadius: 0.10 },
      { x: 0.8, z: -0.9, height: 2.6, baseRadius: 0.12 },
      { x: -1.5, z: -0.4, height: 1.8, baseRadius: 0.09 },
      { x: 1.4, z: 0.6, height: 2.0, baseRadius: 0.10 },
      { x: 0.2, z: 1.8, height: 1.5, baseRadius: 0.08 },
      { x: -0.5, z: -1.8, height: 1.6, baseRadius: 0.09 },
      { x: 2.0, z: -1.2, height: 1.3, baseRadius: 0.08 },
      { x: -2.0, z: 1.2, height: 1.4, baseRadius: 0.08 },
    ],
    []
  );

  // Handcrafted signal wire connections
  const connections = useMemo(
    () => [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 5], [2, 7], [3, 6], [4, 5],
      [6, 8], [7, 4],
    ],
    []
  );

  // Build signal wire geometry
  const wireGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const points: number[] = [];

    connections.forEach(([ai, bi]) => {
      const a = beacons[ai];
      const b = beacons[bi];
      // Wires connect from tip of one beacon to tip of other
      const aTop = a.height / 2;
      const bTop = b.height / 2;
      points.push(a.x, aTop, a.z, b.x, bTop, b.z);
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [beacons, connections]);

  // Signal particles — tiny amber spheres traveling along wires
  const signalParticles = useRef<Array<{
    progress: number;
    speed: number;
    connectionIndex: number;
    mesh: THREE.Mesh;
  }>>([]);

  const signalParticleMeshes = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!signalParticleMeshes.current) return;

    // Create a small pool of particles
    const geo = new THREE.SphereGeometry(0.04, 8, 8);
    const particleData: typeof signalParticles.current = [];

    connections.forEach((_, ci) => {
      // Each connection gets one traveling particle
      const mesh = new THREE.Mesh(geo, signalMat.clone());
      signalParticleMeshes.current!.add(mesh);
      particleData.push({
        progress: Math.random(), // staggered starts
        speed: 0.003 + Math.random() * 0.003, // slow and deliberate
        connectionIndex: ci,
        mesh,
      });
    });

    signalParticles.current = particleData;

    return () => {
      geo.dispose();
      signalParticles.current.forEach(p => {
        (p.mesh.material as THREE.Material).dispose();
      });
      signalParticles.current = [];
    };
  }, [connections, signalMat]);

  useEffect(() => {
    return () => {
      steelMat.dispose();
      walnutMat.dispose();
      signalMat.dispose();
      wireGeometry.dispose();
    };
  }, [steelMat, walnutMat, signalMat, wireGeometry]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Extremely slow, almost imperceptible breathing rotation
    groupRef.current.rotation.y += delta * 0.015;

    // Animate signal particles along wires
    signalParticles.current.forEach((particle) => {
      particle.progress += particle.speed;
      if (particle.progress > 1) particle.progress = 0;

      const [ai, bi] = connections[particle.connectionIndex];
      const a = beacons[ai];
      const b = beacons[bi];

      const t = particle.progress;
      particle.mesh.position.set(
        a.x + (b.x - a.x) * t,
        a.height / 2 + (b.height / 2 - a.height / 2) * t,
        a.z + (b.z - a.z) * t
      );
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* ─── Base Plinth — walnut timber platform ─── */}
      <mesh position={[0, -1.1, 0]} material={walnutMat}>
        <cylinderGeometry args={[2.5, 2.8, 0.3, 32]} />
      </mesh>
      <mesh position={[0, -0.9, 0]} material={steelMat}>
        <cylinderGeometry args={[2.3, 2.5, 0.08, 32]} />
      </mesh>

      {/* ─── Beacon Rods ─── */}
      {beacons.map((beacon, i) => (
        <group key={i} position={[beacon.x, 0, beacon.z]}>
          {/* Main antenna rod — steel */}
          <mesh position={[0, 0, 0]} material={steelMat} castShadow>
            <cylinderGeometry args={[beacon.baseRadius * 0.4, beacon.baseRadius, beacon.height, 10]} />
          </mesh>

          {/* Signal tip glow — tiny amber sphere at top */}
          <mesh position={[0, beacon.height / 2, 0]} material={signalMat}>
            <sphereGeometry args={[beacon.baseRadius * 1.2, 12, 12]} />
          </mesh>
        </group>
      ))}

      {/* ─── Signal Wires ─── */}
      <lineSegments geometry={wireGeometry}>
        <lineBasicMaterial
          color="#7a3c10"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </lineSegments>

      {/* ─── Traveling Signal Particles ─── */}
      <group ref={signalParticleMeshes} />
    </group>
  );
};
export default TheBeaconNetwork;
