"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

function MedicalCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.rotation.y += delta * 0.2;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x += delta * 0.5;
      ringRef1.current.rotation.y += delta * 0.1;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z += delta * 0.3;
      ringRef2.current.rotation.y -= delta * 0.2;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1, 32, 32]}>
        <meshBasicMaterial color="#8B864E" wireframe transparent opacity={0.3} />
      </Sphere>

      <mesh ref={ringRef1}>
        <torusGeometry args={[1.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[1.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function StanceHealth() {
  return (
    <section className="relative min-h-screen w-full border-t border-white/10 overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0 opacity-30 technical-grid pointer-events-none"></div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 4] }}>
           <MedicalCore />
        </Canvas>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center pointer-events-none">

        <div className="glass-panel p-8 w-full md:w-80 mb-8 md:mb-0 pointer-events-auto rounded-md shadow-2xl">
           <h3 className="font-mono text-xs text-[#8B864E] mb-6 tracking-widest border-b border-[#8B864E]/30 pb-3 font-semibold">BIOMETRIC DATA</h3>
           <div className="space-y-6 font-mono text-base">
              <div className="flex justify-between items-end">
                <span className="text-white/60 text-sm tracking-wide">HR_BPM</span>
                <span className="text-white font-bold text-xl">72 <span className="text-sm font-normal text-white/40 ml-1">bpm</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-white/60 text-sm tracking-wide">SpO2</span>
                <span className="text-white font-bold text-xl">98 <span className="text-sm font-normal text-white/40 ml-1">%</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-white/60 text-sm tracking-wide">HRV</span>
                <span className="text-white font-bold text-xl">54 <span className="text-sm font-normal text-white/40 ml-1">ms</span></span>
              </div>
           </div>
        </div>

        <div className="glass-panel p-8 w-full md:w-80 pointer-events-auto rounded-md shadow-2xl">
           <h3 className="font-mono text-xs text-[#8B864E] mb-6 tracking-widest border-b border-[#8B864E]/30 pb-3 font-semibold">SYSTEM DIAGNOSTICS</h3>
           <div className="space-y-4 font-mono text-sm text-white/70">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#8B864E]"></div>
                NEURAL_SYNC: <span className="text-white font-medium tracking-wide">STABLE</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#8B864E]"></div>
                CORE_TEMP: <span className="text-white font-medium tracking-wide">NOMINAL</span>
              </div>
           </div>
        </div>

      </div>

      <div className="absolute top-1/2 left-8 -translate-y-1/2 font-mono text-xs text-white/40 rotate-90 origin-left tracking-widest">
        AXIS_Y
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40 tracking-widest">
        AXIS_X
      </div>

    </section>
  );
}
