"use client"
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'


interface PelvicModelProps {
  isVisible?: boolean
  isDark?: boolean
  scrollProgress?: number
}

export function PelvicModel({ isVisible = true, isDark = true, scrollProgress = 0 }: PelvicModelProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const leftIliumRef = useRef<THREE.Mesh>(null!)
  const rightIliumRef = useRef<THREE.Mesh>(null!)
  const pubicRingRef = useRef<THREE.Mesh>(null!)
  const muscleHammockRef = useRef<THREE.Mesh>(null!)
  const sacrumRef = useRef<THREE.Mesh>(null!)


  const [hoveredPart, setHoveredPart] = useState<{ name: string; desc: string; pos: [number, number, number]; key: string } | null>(null)

  // Drag and rotate tracking refs
  const isDragging = useRef(false)
  const previousPointerPosition = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e: any) => {
    e.stopPropagation()
    if (e.target) {
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId)
      } catch (err) {}
    }
    isDragging.current = true
    previousPointerPosition.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return
    e.stopPropagation()
    const deltaX = e.clientX - previousPointerPosition.current.x
    const deltaY = e.clientY - previousPointerPosition.current.y
    previousPointerPosition.current = { x: e.clientX, y: e.clientY }

    // Update target rotation
    targetRotation.current.y += deltaX * 0.015
    targetRotation.current.x += deltaY * 0.015
  }

  const handlePointerUp = (e: any) => {
    e.stopPropagation()
    isDragging.current = false
    if (e.target) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId)
      } catch (err) {}
    }
  }

  useEffect(() => {
    if (!isVisible) return

    // Force a ScrollTrigger calculation update on mount
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      const mainEl = document.getElementById("concept-layout-main") || document.querySelector("main") || document.body;
      const progressTracker = { val: 0 };

      gsap.to(progressTracker, {
        val: 1,
        ease: "none",
        scrollTrigger: {
          trigger: mainEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const p = progressTracker.val;
          scrollProgress = p;
        }
      })
    })

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    }
  }, [isVisible])

  // Continuous micro floating effect & Pulse animation for restored state
  useFrame((state) => {
    if (groupRef.current) {
      const p = scrollProgress;

      // Interpolate drag rotations smoothly
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08

      // Absolute positioning prevents cumulative drift zoom issue
      const targetZ = THREE.MathUtils.lerp(0, 2.3, p);
      const targetX = THREE.MathUtils.lerp(1.5, -0.3, p);
      const targetY = THREE.MathUtils.lerp(0, 0.4, p) + Math.cos(state.clock.elapsedTime * 1.3) * 0.05;
      groupRef.current.position.set(targetX, targetY, targetZ);

      // Rotate with scroll + continuous rotation + manual drag rotations
      groupRef.current.rotation.y = p * Math.PI * 3.5 + (state.clock.elapsedTime * 0.12 % (Math.PI * 2)) + currentRotation.current.y;
      groupRef.current.rotation.x = p * Math.PI * 0.15 + 0.1 + currentRotation.current.x;

      const healedFactor = Math.max(0, (p - 0.5) * 2); // 0 at p=0.5, 1 at p=1.0

      // Muscular hammock color morphing (represents pelvic tone balancing)
      const hammock = muscleHammockRef.current;
      if (hammock && hammock.material) {
        const mat = (Array.isArray(hammock.material) ? hammock.material[0] : hammock.material) as any;
        if (mat && mat.color) {
          // Dysfunctional spasm tone (Active Coral) -> Calibrated Strength (Volt Lime)
          // #fe7833 -> #ddfe71
          const r = THREE.MathUtils.lerp(0.996, 0.866, Math.min(p * 2, 1));
          const g = THREE.MathUtils.lerp(0.470, 0.996, Math.min(p * 2, 1));
          const b = THREE.MathUtils.lerp(0.200, 0.443, Math.min(p * 2, 1));
          mat.color.setRGB(r, g, b);
        }
      }

      // 'Pulse' animation effect for the restored/healed pelvic floor muscle hammock
      if (muscleHammockRef.current) {
        // High fidelity rhythmic contraction pulse representing correct neural pacing/EMG feedback
        const pulseVal = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.05 * healedFactor;
        muscleHammockRef.current.scale.set(1.05 * pulseVal, 0.8 * pulseVal, 1.05 * pulseVal);
      }
    }
  });

  if (!isVisible) return null

  return (
    <group
      ref={groupRef}
      scale={[1.1, 1.1, 1.1]}
      position={[1.5, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* 1. Pelvic Girdle - Symmetric skeletal structures */}
      {/* Left Ilium Bone Wing */}
      <mesh
        ref={leftIliumRef}
        position={[-0.45, 0.1, 0]}
        rotation={[0, 0.4, -0.2]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart({
            key: 'left_ilium',
            name: "Left Ilium",
            desc: "The wide flared upper bone of the pelvis providing broad stability and muscle attachment fields.",
            pos: [-0.45, 0.1, 0.2]
          });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
        scale={hoveredPart?.key === 'left_ilium' ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      >
        <torusGeometry args={[0.38, 0.07, 16, 32, Math.PI * 1.3]} />
        <meshStandardMaterial
          color="#addcec"
          roughness={0.2}
          metalness={0.7}
          transparent={true}
          opacity={0.85}
          wireframe={true}
        />
      </mesh>

      {/* Right Ilium Bone Wing */}
      <mesh
        ref={rightIliumRef}
        position={[0.45, 0.1, 0]}
        rotation={[0, -0.4, 0.2]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart({
            key: 'right_ilium',
            name: "Right Ilium",
            desc: "The right side pelvis wing. Essential for transfer of physical strength from torso to limbs.",
            pos: [0.45, 0.1, 0.2]
          });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
        scale={hoveredPart?.key === 'right_ilium' ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      >
        <torusGeometry args={[0.38, 0.07, 16, 32, Math.PI * 1.3]} />
        <meshStandardMaterial
          color="#addcec"
          roughness={0.2}
          metalness={0.7}
          transparent={true}
          opacity={0.85}
          wireframe={true}
        />
      </mesh>

      {/* Pubic Ring (lower pelvic convergence) */}
      <mesh
        ref={pubicRingRef}
        position={[0, -0.32, 0.15]}
        rotation={[0.4, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart({
            key: 'pubic_ring',
            name: "Pubic Symphysis",
            desc: "The lower joint convergence protecting delicate visceral organs and guiding alignment.",
            pos: [0, -0.32, 0.3]
          });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
        scale={hoveredPart?.key === 'pubic_ring' ? [1.15, 1.15, 1.15] : [1, 1, 1]}
      >
        <torusGeometry args={[0.22, 0.04, 12, 24]} />
        <meshStandardMaterial color="#addcec" roughness={0.2} metalness={0.7} transparent={true} opacity={0.85} wireframe={true} />
      </mesh>

      {/* 2. Sacrum Bone & Lower Spine Column */}
      <group
        ref={sacrumRef}
        position={[0, 0.2, -0.2]}
      >
        <mesh
          position={[0, 0.15, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredPart({
              key: 'sacrum',
              name: "Sacrum Core",
              desc: "The triangular skeletal shield locking the spine into the surrounding pelvic bowl.",
              pos: [0, 0.2, -0.1]
            });
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredPart(null);
            document.body.style.cursor = 'auto';
          }}
        >
          <boxGeometry args={[0.22, 0.12, 0.15]} />
          <meshStandardMaterial color="#addcec" roughness={0.2} metalness={0.7} transparent={true} opacity={0.85} wireframe={true} />
        </mesh>
        <mesh position={[0, 0.0, -0.02]} scale={[0.85, 0.85, 0.85]}>
          <boxGeometry args={[0.22, 0.12, 0.15]} />
          <meshStandardMaterial color="#addcec" roughness={0.2} metalness={0.7} transparent={true} opacity={0.85} wireframe={true} />
        </mesh>
        <mesh position={[0, -0.15, -0.04]} scale={[0.7, 0.7, 0.7]}>
          <boxGeometry args={[0.22, 0.12, 0.15]} />
          <meshStandardMaterial color="#addcec" roughness={0.2} metalness={0.7} transparent={true} opacity={0.85} wireframe={true} />
        </mesh>
        {/* Coccyx tail bone tip */}
        <mesh position={[0, -0.28, -0.06]} scale={[0.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#addcec" wireframe={true} />
        </mesh>
      </group>

      {/* 3. Pelvic Floor Muscle hammock - glows active coral of dysfunction, transitions to lime */}
      <mesh
        ref={muscleHammockRef}
        position={[0, -0.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1.05, 0.8, 1.05]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart({
            key: 'muscle_hammock',
            name: "Pelvic Muscle Hammock",
            desc: "Crucial muscular layer supporting posture. Displays high-pacing contraction pulses in healed lime mode.",
            pos: [0, -0.2, 0.25]
          });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.34, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
        <meshStandardMaterial
          color="#fe7833"
          roughness={0.2}
          metalness={0.7}
          transparent={true}
          opacity={0.85}
          wireframe={true}
        />
      </mesh>

      {/* 4. Nerve loops (luminous lines representing neurological muscle feedback) */}
      <group position={[0, 0.1, -0.05]}>
        <mesh position={[-0.15, -0.3, 0.05]} rotation={[0.5, 0.1, -0.5]}>
          <cylinderGeometry args={[0.015, 0.005, 0.6, 8]} />
          <meshBasicMaterial color="#ddfe71" transparent opacity={0.7} wireframe={true} />
        </mesh>
        <mesh position={[0.15, -0.3, 0.05]} rotation={[0.5, -0.1, 0.5]}>
          <cylinderGeometry args={[0.015, 0.005, 0.6, 8]} />
          <meshBasicMaterial color="#ddfe71" transparent opacity={0.7} wireframe={true} />
        </mesh>
      </group>

      {/* Tooltip HTML Overlay Render */}
      {hoveredPart && (
        <Html
          position={hoveredPart.pos}
          center
          distanceFactor={5}
          pointerEvents="none"
        >
          <div className={`whitespace-nowrap px-4 py-3 rounded-none border font-mono backdrop-blur-md transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
            isDark
              ? 'bg-neutral-950/95 border-lime/35 text-white'
              : 'bg-white/95 border-[#132644]/40 text-[#132644]'
          }`} style={{ minWidth: '220px', transform: 'translateY(-60px)' }}>
            <div className={`text-xs font-black font-unbounded uppercase tracking-tight ${isDark ? 'text-lime' : 'text-[#fe7833]'}`}>
              {hoveredPart.name}
            </div>
            <div className="text-[10px] mt-1.5 whitespace-normal leading-relaxed opacity-85 select-none">
              {hoveredPart.desc}
            </div>
            <div className={`text-[8.5px] mt-2 border-t pt-1.5 flex justify-between uppercase tracking-widest font-bold opacity-60 ${isDark ? 'border-lime/10' : 'border-[#132644]/10'}`}>
              <span>Pelvic Region</span>
              <span className={hoveredPart.key === 'muscle_hammock' && scrollProgress > 0.5 ? 'text-lime animate-pulse font-bold' : ''}>
                {hoveredPart.key === 'muscle_hammock' && scrollProgress > 0.5 ? 'Neuromuscular Active' : 'Spasm State'}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}