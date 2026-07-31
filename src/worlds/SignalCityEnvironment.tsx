import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';

/**
 * SignalCityEnvironment
 * The 3D architectural volume for the Chat World.
 *
 * Physical First Concept:
 * Imagine a vast, abandoned signal relay city — massive graphite towers
 * connected by suspended walkways of dark walnut and steel cable.
 * Warm amber windows glow from within. Nobody is visible.
 * But you feel — with certainty — that people exist here.
 *
 * Materials: Steel, Graphite, Dark Walnut, Amber Glass, Concrete
 * No sci-fi. No holograms. No blue neon.
 * Architecture communicates presence.
 */
export const SignalCityEnvironment: React.FC = () => {
  // --- Material Definitions ---
  const graphiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0e0e10'),
        roughness: 0.92,
        metalness: 0.15,
      }),
    []
  );

  const steelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2a2d35'),
        roughness: 0.4,
        metalness: 0.85,
      }),
    []
  );

  const walnutMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#3d2b1f'),
        roughness: 0.85,
        metalness: 0.05,
      }),
    []
  );

  const amberGlassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#c07830'),
        roughness: 0.1,
        metalness: 0.0,
        transmission: 0.6,
        ior: 1.35,
        thickness: 0.4,
        transparent: true,
        opacity: 0.75,
        emissive: new THREE.Color('#7a3c0a'),
        emissiveIntensity: 0.4,
      }),
    []
  );

  const concreteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1a1a1c'),
        roughness: 0.95,
        metalness: 0.02,
      }),
    []
  );

  // --- Geometry Definitions ---
  const floorGeo = useMemo(() => new THREE.BoxGeometry(120, 0.8, 120), []);
  const towerGeo = useMemo(() => new THREE.BoxGeometry(3, 60, 3), []);
  const towerCapGeo = useMemo(() => new THREE.CylinderGeometry(2.2, 2, 2, 8), []);
  const bridgeGeo = useMemo(() => new THREE.BoxGeometry(0.3, 0.1, 1), []); // scaled per-use
  const cableGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 1, 6), []);
  const windowGeo = useMemo(() => new THREE.BoxGeometry(0.8, 0.8, 0.1), []);
  const plazaGeo = useMemo(() => new THREE.CylinderGeometry(6, 6, 0.3, 24), []);

  useEffect(() => {
    return () => {
      graphiteMat.dispose();
      steelMat.dispose();
      walnutMat.dispose();
      amberGlassMat.dispose();
      concreteMat.dispose();
      floorGeo.dispose();
      towerGeo.dispose();
      towerCapGeo.dispose();
      bridgeGeo.dispose();
      cableGeo.dispose();
      windowGeo.dispose();
      plazaGeo.dispose();
    };
  }, [graphiteMat, steelMat, walnutMat, amberGlassMat, concreteMat, floorGeo, towerGeo, towerCapGeo, bridgeGeo, cableGeo, windowGeo, plazaGeo]);

  // Handcrafted tower positions — asymmetric, feels like a real city block
  const towers = useMemo(
    () => [
      { x: 0, z: 0, height: 1.4, windows: 8 },      // Central beacon tower (tallest)
      { x: -9, z: -6, height: 0.9, windows: 5 },
      { x: 8, z: -8, height: 1.0, windows: 6 },
      { x: -13, z: 4, height: 0.75, windows: 4 },
      { x: 12, z: 5, height: 0.85, windows: 5 },
      { x: -5, z: 14, height: 0.7, windows: 4 },
      { x: 7, z: 14, height: 0.8, windows: 5 },
      { x: -17, z: -3, height: 0.6, windows: 3 },
      { x: 18, z: -2, height: 0.65, windows: 3 },
    ],
    []
  );

  // Cable bridges connecting towers — handcrafted pairs
  const bridges = useMemo(
    () => [
      [0, 1], [0, 2], [1, 3], [2, 4],
      [3, 5], [4, 6], [5, 6], [1, 5],
    ],
    []
  );

  return (
    <group>
      {/* ─── Lighting ─── */}
      {/* Deep ambient — barely there, establishes graphite atmosphere */}
      <ambientLight intensity={0.03} color="#1a1510" />

      {/* Primary warm amber key light — from a distant "sun" angle */}
      <directionalLight
        position={[15, 30, 10]}
        intensity={0.5}
        color="#e8a050"
        castShadow
      />

      {/* Cool deep fill from opposite — graphite city shadow */}
      <directionalLight
        position={[-20, 10, -15]}
        intensity={0.08}
        color="#3a4060"
      />

      {/* Central beacon point light — warm, localized, feels like an active signal tower */}
      <pointLight
        position={[0, 35, 0]}
        intensity={2.0}
        color="#d06020"
        distance={45}
        decay={2}
      />

      {/* ─── Concrete Plaza Floor ─── */}
      <mesh position={[0, -1.4, 0]} material={concreteMat} geometry={floorGeo} receiveShadow />

      {/* Central circular plaza — the gathering point */}
      <mesh position={[0, -1.05, 0]} material={graphiteMat} geometry={plazaGeo} receiveShadow />

      {/* ─── Signal Towers ─── */}
      {towers.map((tower, i) => {
        const h = 60 * tower.height;
        const top = h / 2 - 1.4;

        // Place amber windows at regular intervals up the tower face
        const windowPositions = Array.from({ length: tower.windows }, (_, wi) => ({
          y: -h / 2 + 8 + wi * (h * 0.7 / tower.windows),
          face: wi % 4, // cycles through 4 faces
        }));

        return (
          <group key={i} position={[tower.x, top - h / 2, tower.z]}>
            {/* Main tower shaft — graphite concrete */}
            <mesh
              position={[0, 0, 0]}
              material={graphiteMat}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[3, h, 3]} />
            </mesh>

            {/* Steel cap — slightly different material for detail */}
            <mesh
              position={[0, h / 2 + 0.5, 0]}
              material={steelMat}
              geometry={towerCapGeo}
              castShadow
            />

            {/* Amber glass windows — the glow of presence */}
            {windowPositions.map((wp, wi) => {
              const offsets: [number, number, number][] = [
                [0, wp.y, 1.55],
                [1.55, wp.y, 0],
                [0, wp.y, -1.55],
                [-1.55, wp.y, 0],
              ];
              const [ox, oy, oz] = offsets[wp.face % 4];
              return (
                <mesh
                  key={wi}
                  position={[ox, oy, oz]}
                  rotation={wp.face % 2 === 0 ? [0, 0, 0] : [0, Math.PI / 2, 0]}
                  material={amberGlassMat}
                  geometry={windowGeo}
                />
              );
            })}

            {/* Walnut floor band at mid-tower — human-scale detail */}
            <mesh position={[0, 0, 0]} material={walnutMat}>
              <boxGeometry args={[3.2, 0.4, 3.2]} />
            </mesh>
          </group>
        );
      })}

      {/* ─── Cable Bridges ─── */}
      {bridges.map(([ai, bi], idx) => {
        const a = towers[ai];
        const b = towers[bi];
        if (!a || !b) return null;

        const aHeight = 60 * a.height;
        const bHeight = 60 * b.height;
        const bridgeY = Math.min(aHeight, bHeight) * 0.5 - 1.4 + 10;

        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);
        const midX = (a.x + b.x) / 2;
        const midZ = (a.z + b.z) / 2;

        return (
          <group key={idx}>
            {/* Walking surface — dark walnut planks */}
            <mesh
              position={[midX, bridgeY, midZ]}
              rotation={[0, angle, 0]}
              material={walnutMat}
            >
              <boxGeometry args={[1.2, 0.15, length]} />
            </mesh>

            {/* Steel cable left */}
            <mesh
              position={[midX, bridgeY + 1.8, midZ]}
              rotation={[0, angle, 0]}
              material={steelMat}
            >
              <cylinderGeometry args={[0.04, 0.04, length, 6]} />
            </mesh>

            {/* Steel cable right */}
            <mesh
              position={[midX, bridgeY + 1.8, midZ]}
              rotation={[0, angle, 0]}
              material={steelMat}
            >
              <cylinderGeometry args={[0.04, 0.04, length, 6]} />
            </mesh>

            {/* Handrail left */}
            <mesh
              position={[midX, bridgeY + 1.0, midZ]}
              rotation={[0, angle, 0]}
              material={steelMat}
            >
              <boxGeometry args={[0.06, 0.06, length]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
export default SignalCityEnvironment;
