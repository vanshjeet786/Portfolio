import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = () => {
  const count = 150;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { pointer, viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -10 + Math.random() * 20;
      const yFactor = -10 + Math.random() * 20;
      const zFactor = -10 + Math.random() * 20;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;

    // Smooth cursor movement (inertia)
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

      // Calculate normalized mouse coordinates mapping to 3D space loosely
      const mouseX = (pointer.x * viewport.width) / 2;
      const mouseY = (pointer.y * viewport.height) / 2;

      // Add slight influence from mouse, with lag (inertia)
      particle.mx += (mouseX - particle.mx) * 0.02;
      particle.my += (mouseY - particle.my) * 0.02;

      t = particle.t += speed / 2;
      const s = Math.cos(t);

      // Mix base floating movement with mouse influence
      const x = (xFactor + Math.cos((t / 10) * factor) + Math.sin(t * 1) * factor) / 10 + particle.mx * 0.1;
      const y = (yFactor + Math.sin((t / 10) * factor) + Math.cos(t * 2) * factor) / 10 + particle.my * 0.1;
      const z = (zFactor + Math.cos((t / 10) * factor) + Math.sin(t * 3) * factor) / 10;

      dummy.position.set(x, y, z);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} position={[0, 0, -5]}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color="#999999" transparent opacity={0.3} />
    </instancedMesh>
  );
};

export default Particles;
