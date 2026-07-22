import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VERTEBRAE_COUNT = 14;
const FOCAL_INDEX = 8;
const BONE_COLOR = '#f4dfc6';
const CARE_AMBER = '#f59e0b';
const HEALING_TEAL = '#14f1d9';
const ANOMALY_ROSE = '#fb3f7f';

export const StanceScene = ({ position }: { position: [number, number, number] }) => {
  const rigRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const vertebraeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ligamentRefs = useRef<(THREE.Mesh | null)[]>([]);

  const vertebrae = useMemo(() => {
    return Array.from({ length: VERTEBRAE_COUNT }).map((_, i) => {
      const normalized = (i - (VERTEBRAE_COUNT - 1) / 2) / ((VERTEBRAE_COUNT - 1) / 2);
      const y = normalized * 2.8;
      const curve = Math.sin((normalized + 0.15) * Math.PI) * 0.2;
      const twist = i * 0.46;

      return {
        position: new THREE.Vector3(curve, y, Math.cos(twist) * 0.1),
        rotation: [0.08 * Math.sin(twist), 0.2 * Math.sin(twist * 0.7), 0.08 * normalized] as [number, number, number],
        scale: 0.84 + Math.cos(normalized * Math.PI) * 0.18,
      };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (rigRef.current) {
      rigRef.current.position.y = Math.sin(time * 0.35) * 0.08;
      rigRef.current.rotation.y = Math.sin(time * 0.22) * 0.2;
      rigRef.current.rotation.x = -0.1 + Math.sin(time * 0.16) * 0.04;
    }

    if (spineRef.current) {
      spineRef.current.rotation.y = time * 0.08;
    }

    if (coreRef.current) {
      const material = coreRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.5 + Math.sin(time * 2.2) * 0.45;
      coreRef.current.scale.y = 1 + Math.sin(time * 1.3) * 0.03;
    }

    if (haloRef.current) {
      haloRef.current.rotation.z = -time * 0.18;
      haloRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.3) * 0.1;
    }

    if (scanRef.current) {
      const scanY = THREE.MathUtils.mapLinear((Math.sin(time * 0.75) + 1) / 2, 0, 1, -2.7, 2.7);
      scanRef.current.position.y = scanY;
      const material = scanRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.18 + Math.sin(time * 4) * 0.07;
    }

    vertebraeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const isFocal = i === FOCAL_INDEX;
      const breathe = Math.sin(time * 1.5 + i * 0.28) * 0.025;
      const pulse = isFocal ? Math.sin(time * 4.8) * 0.08 : 0;
      const base = vertebrae[i].scale;
      mesh.scale.set(base + breathe + pulse, (base * 0.52) + breathe * 0.4 + pulse * 0.35, base * 0.72 + breathe + pulse);
      mesh.rotation.y = vertebrae[i].rotation[1] + Math.sin(time * 0.5 + i) * 0.04;
    });

    ligamentRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.45 + Math.sin(time * 1.8 + i * 0.35) * 0.18;
    });
  });

  return (
    <group position={position}>
      <ambientLight intensity={0.18} color="#fff4e6" />
      <spotLight position={[0, 6, 6]} angle={0.5} penumbra={0.8} intensity={6} color="#fff0da" castShadow />
      <pointLight position={[-3.5, 0.4, 2.5]} intensity={7} color={CARE_AMBER} distance={8} />
      <pointLight position={[3, -0.8, 2.2]} intensity={3.5} color={HEALING_TEAL} distance={7} />
      <pointLight position={[0.8, -0.4, 0.5]} intensity={4} color={ANOMALY_ROSE} distance={4} />

      <group ref={rigRef} scale={[1.75, 1.75, 1.75]}>
        <mesh ref={haloRef} position={[0, 0, -0.1]}>
          <torusGeometry args={[1.72, 0.012, 12, 160]} />
          <meshStandardMaterial color={CARE_AMBER} emissive={CARE_AMBER} emissiveIntensity={0.7} transparent opacity={0.38} toneMapped={false} />
        </mesh>

        <mesh ref={scanRef} position={[0, -2.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.18, 0.01, 8, 96]} />
          <meshStandardMaterial color={HEALING_TEAL} emissive={HEALING_TEAL} emissiveIntensity={1.8} transparent opacity={0.18} toneMapped={false} />
        </mesh>

        <group ref={spineRef}>
          <mesh ref={coreRef} position={[0.02, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 5.9, 24]} />
            <meshStandardMaterial color={HEALING_TEAL} emissive={HEALING_TEAL} emissiveIntensity={1.6} transparent opacity={0.72} toneMapped={false} />
          </mesh>

          {vertebrae.slice(0, -1).map((item, i) => {
            const next = vertebrae[i + 1];
            const midpoint = item.position.clone().lerp(next.position, 0.5);

            return (
              <mesh
                key={`ligament-${i}`}
                ref={(el) => {
                  ligamentRefs.current[i] = el;
                }}
                position={[midpoint.x, midpoint.y, midpoint.z - 0.04]}
                rotation={[0.08, 0, item.rotation[2]]}
              >
                <cylinderGeometry args={[0.018, 0.018, 0.42, 10]} />
                <meshStandardMaterial color={CARE_AMBER} emissive={CARE_AMBER} emissiveIntensity={0.45} transparent opacity={0.34} toneMapped={false} />
              </mesh>
            );
          })}

          {vertebrae.map((item, i) => {
            const isFocal = i === FOCAL_INDEX;

            return (
              <mesh
                key={i}
                ref={(el) => {
                  vertebraeRefs.current[i] = el;
                }}
                position={[item.position.x, item.position.y, item.position.z]}
                rotation={item.rotation}
              >
                <boxGeometry args={[0.58, 0.3, 0.42]} />
                <meshPhysicalMaterial
                  color={isFocal ? ANOMALY_ROSE : BONE_COLOR}
                  emissive={isFocal ? ANOMALY_ROSE : '#2c1a0f'}
                  emissiveIntensity={isFocal ? 1.1 : 0.12}
                  metalness={0.25}
                  roughness={0.2}
                  transmission={isFocal ? 0.2 : 0.55}
                  thickness={1.2}
                  ior={1.35}
                  clearcoat={1}
                  clearcoatRoughness={0.08}
                />

                {isFocal && (
                  <mesh position={[0.25, -0.08, 0.24]} scale={[1.1, 1.1, 1.1]}>
                    <sphereGeometry args={[0.13, 24, 24]} />
                    <meshStandardMaterial color={ANOMALY_ROSE} emissive={ANOMALY_ROSE} emissiveIntensity={3.2} roughness={0.18} metalness={0.2} transparent opacity={0.92} wireframe />
                  </mesh>
                )}
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
};
