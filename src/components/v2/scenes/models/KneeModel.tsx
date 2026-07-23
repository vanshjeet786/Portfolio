"use client"
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'


interface KneeModelProps {
  isVisible?: boolean
  isDark?: boolean
  scrollProgress?: number
}

export function KneeModel({ isVisible = true, isDark = true, scrollProgress = 0 }: KneeModelProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const femurRef = useRef<THREE.Mesh>(null!)
  const tibiaRef = useRef<THREE.Mesh>(null!)
  const patellaRef = useRef<THREE.Mesh>(null!)
  const meniscusRef = useRef<THREE.Mesh>(null!)
  const lateralLigamentRef = useRef<THREE.Mesh>(null!)
  const medialLigamentRef = useRef<THREE.Mesh>(null!)
  const cruciateLigamentRef = useRef<THREE.Mesh>(null!)


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

  // Continuous subtle micro-rotation/floating & Pulse Effect
  useFrame((state) => {
    if (groupRef.current) {
      const p = scrollProgress;

      // Interpolate drag rotations smoothly
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08

      // Absolute positioning prevents cumulative drift zoom issue
      const targetZ = THREE.MathUtils.lerp(0, 2.5, p);
      const targetX = THREE.MathUtils.lerp(1.5, -0.4, p);
      const targetY = THREE.MathUtils.lerp(-0.2, 0.3, p) + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      groupRef.current.position.set(targetX, targetY, targetZ);

      // Rotate with scroll + continuous micro rotation + drag offsets
      groupRef.current.rotation.y = p * Math.PI * 3 + (state.clock.elapsedTime * 0.15 % (Math.PI * 2)) + currentRotation.current.y;
      groupRef.current.rotation.x = p * Math.PI * 0.25 + currentRotation.current.x;

      const healedFactor = Math.max(0, (p - 0.5) * 2); // 0 at p=0.5, 1 at p=1.0

      // Pain indicator mesh color morph
      const meniscus = meniscusRef.current;
      if (meniscus && meniscus.material) {
        const mat = (Array.isArray(meniscus.material) ? meniscus.material[0] : meniscus.material) as any;
        if (mat && mat.color) {
          // #fe7833 (Active Coral) -> #ddfe71 (Volt Lime)
          const r = THREE.MathUtils.lerp(0.996, 0.866, Math.min(p * 2, 1));
          const g = THREE.MathUtils.lerp(0.470, 0.996, Math.min(p * 2, 1));
          const b = THREE.MathUtils.lerp(0.200, 0.443, Math.min(p * 2, 1));
          mat.color.setRGB(r, g, b);
        }
      }

      // 'Pulse' animation effect for the restored/healed meniscus (injury zone) & ligaments
      if (meniscusRef.current) {
        // High frequency active pulse when healed to signify neural recruitment and calibration
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.05 * healedFactor;
        meniscusRef.current.scale.set(1.15 * pulse, 1.15 * pulse, 0.55 * pulse);
      }

      if (cruciateLigamentRef.current) {

        const colorVal = new THREE.Color().setHSL(0.22, 0.9, 0.5 + Math.sin(state.clock.elapsedTime * 8) * 0.1 * healedFactor);
        const mat = cruciateLigamentRef.current.material as any;
        if (mat) {
          mat.color = colorVal;
        }
      }
    }
  });

  if (!isVisible) return null

  return (
    <group
      ref={groupRef}
      scale={[1.1, 1.1, 1.1]}
      position={[1.5, -0.2, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* 1. Femur (Upper Bone) with flared condyles */}
      <group position={[0, 1.1, 0]}>
        {/* Main Bone cylinder */}
        <mesh
          ref={femurRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredPart({
              key: 'femur',
              name: "Femur Bone",
              desc: "Highest-load skeletal structure transmitting kinetic ground forces into the central knee capsule.",
              pos: [0, 1.1, 0]
            });
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredPart(null);
            document.body.style.cursor = 'auto';
          }}
          scale={hoveredPart?.key === 'femur' ? [1.1, 1.0, 1.1] : [1.0, 1.0, 1.0]}
        >
          <cylinderGeometry args={[0.26, 0.24, 1.5, 16]} />
          <meshStandardMaterial
            color="#addcec"
            roughness={0.2}
            metalness={0.7}
            transparent={true}
            opacity={0.85}
            wireframe={true}
          />
        </mesh>
        {/* Medial and Lateral Condyles (flared bottom joint knobs) */}
        <mesh position={[-0.18, -0.75, 0]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color="#addcec" roughness={0.2} metalness={0.7} transparent={true} opacity={0.85} wireframe={true} />
        </mesh>
        <mesh position={[0.18, -0.75, 0]}>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color="#addcec" roughness={0.2} metalness={0.7} transparent={true} opacity={0.85} wireframe={true} />
        </mesh>
      </group>

      {/* 2. Tibia (Lower Main Bone) with flared top */}
      <group position={[0, -1.1, 0]}>
        <mesh
          ref={tibiaRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredPart({
              key: 'tibia',
              name: "Tibia Platform",
              desc: "The shinbone base serving as the load plate for articular stress distribution.",
              pos: [0, -1.1, 0]
            });
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredPart(null);
            document.body.style.cursor = 'auto';
          }}
          scale={hoveredPart?.key === 'tibia' ? [1.12, 1.0, 1.12] : [1.0, 1.0, 1.0]}
        >
          <cylinderGeometry args={[0.22, 0.18, 1.4, 16]} />
          <meshStandardMaterial
            color="#addcec"
            roughness={0.2}
            metalness={0.7}
            transparent={true}
            opacity={0.85}
            wireframe={true}
          />
        </mesh>
        {/* Tibia platform flare */}
        <mesh position={[0, 0.7, 0]} scale={[1.3, 0.3, 1]}>
          <cylinderGeometry args={[0.24, 0.24, 0.8, 16]} />
          <meshStandardMaterial color="#addcec" roughness={0.2} metalness={0.7} transparent={true} opacity={0.85} wireframe={true} />
        </mesh>
      </group>

      {/* 3. Patella (Kneecap Float) - highlights pain or loading status */}
      <mesh
        ref={patellaRef}
        position={[0, 0.15, 0.42]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart({
            key: 'patella',
            name: "Patella",
            desc: "The kneecap, acting as a leverage amplifier for quad activation during deep flexion.",
            pos: [0, 0.15, 0.42]
          });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
        scale={hoveredPart?.key === 'patella' ? [1.15, 1.15, 1.15] : [1, 1, 1]}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#dbeafe"
          roughness={0.3}
          metalness={0.6}
          transparent={true}
          opacity={0.85}
          wireframe={true}
        />
      </mesh>

      {/* 4. Meniscus (Pain Area & Diagnosed Center) - Red indicator */}
      <mesh
        ref={meniscusRef}
        position={[0, -0.3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1.15, 1.15, 0.55]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart({
            key: 'meniscus',
            name: "Medial Meniscus",
            desc: "Shock-absorbing buffer. Active coral state signifies shear tear; restored lime state indicates alignment calibration.",
            pos: [0, -0.3, 0.15]
          });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredPart(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <torusGeometry args={[0.26, 0.08, 12, 32, Math.PI * 1.5]} />
        <meshStandardMaterial
          color="#fe7833"
          roughness={0.2}
          metalness={0.7}
          transparent={true}
          opacity={0.85}
          wireframe={true}
        />
      </mesh>

      {/* 5. Ligaments (Patellar tendon, Collateral and Cruciate Ligaments) */}
      <group position={[0, 0, 0]}>
        {/* Lateral Ligament */}
        <mesh
          ref={lateralLigamentRef}
          position={[0.3, 0, 0]}
          rotation={[0, 0, 0.1]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredPart({
              key: 'lateral',
              name: "Lateral Collateral",
              desc: "Provides critical lateral joint stability under dynamic angular loads.",
              pos: [0.3, 0, 0]
            });
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredPart(null);
            document.body.style.cursor = 'auto';
          }}
          scale={hoveredPart?.key === 'lateral' ? [1.3, 1, 1.3] : [1, 1, 1]}
        >
          <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} wireframe={true} />
        </mesh>

        {/* Medial Ligament */}
        <mesh
          ref={medialLigamentRef}
          position={[-0.3, 0, 0]}
          rotation={[0, 0, -0.1]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredPart({
              key: 'medial',
              name: "Medial Collateral",
              desc: "Fibular stability bridge preventing inward knee collapse.",
              pos: [-0.3, 0, 0]
            });
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredPart(null);
            document.body.style.cursor = 'auto';
          }}
          scale={hoveredPart?.key === 'medial' ? [1.3, 1, 1.3] : [1, 1, 1]}
        >
          <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} wireframe={true} />
        </mesh>

        {/* Cruciate Ligament (Inner Cross) */}
        <mesh
          ref={cruciateLigamentRef}
          position={[0, 0, -0.05]}
          rotation={[0.4, 0.3, 0.2]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredPart({
              key: 'cruciate',
              name: "Cruciate Ligament",
              desc: "Interior ligament regulating front-to-back sliding motion and rotational stability.",
              pos: [0, 0, -0.05]
            });
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHoveredPart(null);
            document.body.style.cursor = 'auto';
          }}
          scale={hoveredPart?.key === 'cruciate' ? [1.5, 1, 1.5] : [1, 1, 1]}
        >
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshBasicMaterial color="#ddfe71" transparent opacity={0.8} wireframe={true} />
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
              <span>Knee Structure</span>
              <span className={hoveredPart.key === 'meniscus' && scrollProgress > 0.5 ? 'text-lime animate-pulse font-bold' : ''}>
                {hoveredPart.key === 'meniscus' && scrollProgress > 0.5 ? 'Fully Calibrated' : 'Nominal'}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}