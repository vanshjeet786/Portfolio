"use client"
import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'


interface SpineModelProps {
  isVisible?: boolean
  isExploded?: boolean
  isDark?: boolean
  severity?: number // Range from 0 to 1
  scrollProgress?: number
}

const vertebraeInfo = [
  { name: "C1 Atlas Vertebra", desc: "Topmost cervical vertebra. Supports the skull and acts as pivot." },
  { name: "C2 Axis Vertebra", desc: "Provides the skeletal pivot mechanism for lateral head rotation." },
  { name: "C4 Cervical Vertebra", desc: "Regulates mobility pathways of the neck musculature." },
  { name: "T1 Thoracic Vertebra", desc: "Upper transition node distributing forces into the shoulder girdle." },
  { name: "T3 Thoracic Vertebra", desc: "Midpoint stabilizing muscle attachments of the posterior thorax." },
  { name: "T5 Thoracic Vertebra", desc: "Core thoracic link supporting the ribcage structure." },
  { name: "T8 Thoracic Vertebra", desc: "Middle vertebral block bearing torsional compressive stress." },
  { name: "T12 Thoracic Segment", desc: "Lower thoracic boundary facilitating high torque-rotation." },
  { name: "L4 Lumbar Vertebra", desc: "Primary lumbar decompression and herniation treatment focus zone." }, // injuredIndex = 8
  { name: "L5 Lumbar Vertebra", desc: "Critical base vertebra absorbing high structural shear forces." },
  { name: "Sacrum Facet S1", desc: "Fused sacral plate distributing kinetic weight into the pelvic ring." },
  { name: "Coccygeal Terminal", desc: "Tailbone acting as the insertion anchor for pelvic floor muscles." },
]

export function SpineModel({ isVisible = true, isExploded = false, isDark = true, severity = 0.55, scrollProgress = 0 }: SpineModelProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const meshRefs = useRef<any[]>([])
  const materialRefs = useRef<any[]>([])
  
  const explosionProgress = useRef({ val: 0 })
  
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

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

    // Update target rotations smoothly (horizontal drag -> Y rotation, vertical drag -> X rotation)
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

  // Animate the explosion progress using GSAP on change
  useEffect(() => {
    gsap.to(explosionProgress.current, {
      val: isExploded ? 1 : 0,
      duration: 1.2,
      ease: "power3.out",
      overwrite: "auto"
    })
  }, [isExploded])

  // Create 12 procedural vertebrae
  const numVertebrae = 12

  // Initial positions
  const initialPositions = useMemo(() => {
    return Array.from({ length: numVertebrae }).map((_, i) => {
      // Curve of the spine
      const y = (i - numVertebrae / 2) * 0.4
      const x = Math.sin(i * 0.4) * 0.2
      const z = Math.cos(i * 0.4) * 0.2
      return new THREE.Vector3(x, y, z)
    })
  }, [])

  // "Injured" vertebra index (e.g. lower back, index 8)
  const injuredIndex = 8

  useEffect(() => {
    if (!isVisible) return

    // Force a ScrollTrigger calculation update on mount
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const ctx = gsap.context(() => {
      const mainEl = document.getElementById("concept-layout-main") || document.querySelector("main") || document.body;
      const progressTracker = { val: 0 };

      // We use ScrollTrigger to animate the dummy object
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
          scrollProgress = progressTracker.val;
        }
      })
    })

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    }
  }, [isVisible])

  // Continuous subtle idle animation and dynamic positioning
  useFrame((state) => {
    const p = scrollProgress
    const exp = explosionProgress.current.val

    // Smoothly interpolate custom dragging rotation values
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08

    if (groupRef.current) {
      // Rotation and positioning based on scroll progress + drag rotation overrides
      groupRef.current.rotation.y = p * Math.PI * 4 + currentRotation.current.y;
      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.z = p * Math.PI * 0.5;
      // Absolute positioning prevents cumulative drift zoom issue
      groupRef.current.position.set(1.5, p * 2 + Math.sin(state.clock.elapsedTime) * 0.05, 0);
    }

    const healedFactor = Math.max(0, (p - 0.5) * 2); // 0 to 1

    for (let i = 0; i < numVertebrae; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;

      const factor = 1 + (p * 2); // expand at bottom

      // Add horizontal outwards factor and vertical gap expansion during explosion
      const explodeYOffset = (i - numVertebrae / 2) * exp * 0.65;
      const explodeXZFactor = 1 + (exp * 1.6);

      mesh.position.x = initialPositions[i].x * factor * (1 + (p * 2)) * explodeXZFactor;
      mesh.position.y = initialPositions[i].y * factor + explodeYOffset;
      mesh.position.z = initialPositions[i].z * factor * (1 + (p * 2)) * explodeXZFactor;

      // Pulse scaling & Hover scaling:
      let targetScale = 1;
      if (i === injuredIndex) {
        // Pulse size of herniation vertebra if healed with volt lime color, pulsing faster/slower with severity
        const pulseFreq = 4 + severity * 8;
        const pulseAmp = 0.05 * (severity + 0.2);
        const pulse = 1 + Math.sin(state.clock.elapsedTime * pulseFreq) * pulseAmp * (healedFactor + 0.3);
        targetScale = pulse;
      }
      if (hoveredIdx === i) {
        targetScale *= 1.18;
      }
      mesh.scale.set(targetScale, targetScale, targetScale);

      // Healing color effect for injured point
      if (mesh.material) {
        const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as any;
        if (mat && mat.color) {
          if (i === injuredIndex) {
            // Under normal circumstances, #fe7833 (Active Coral) -> #ddfe71 (Volt Lime) on healing
            // But if severity is extreme, we tint it deeper red
            const baseColor = new THREE.Color();
            const r = THREE.MathUtils.lerp(0.996, 0.866, Math.min(p * 2, 1));
            const g = THREE.MathUtils.lerp(0.470, 0.996, Math.min(p * 2, 1));
            const b = THREE.MathUtils.lerp(0.200, 0.443, Math.min(p * 2, 1));
            baseColor.setRGB(r, g, b);

            // Shift towards deep red as severity goes up
            const redColor = new THREE.Color("#ef4444");
            baseColor.lerp(redColor, severity * 0.5);
            mat.color.copy(baseColor);
          }
        }
      }
    }
  });

  if (!isVisible) return null

  // Calculate coordinates for tooltip rendering
  const activeTooltipPosition = hoveredIdx !== null && meshRefs.current[hoveredIdx] 
    ? meshRefs.current[hoveredIdx].position
    : null;

  return (
    <group 
      ref={groupRef} 
      scale={[1.5, 1.5, 1.5]} 
      position={[1.5, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Luminous Inner Spinal Bio-Cord Column - Revealed upon vertebra explosion */}
      {/* Opacity/width pulses with breath cycle when healed */}
      <mesh scale={[1 + Math.sin(Date.now() * 0.005) * 0.15 * Math.min(scrollProgress * 2, 1), 1, 1 + Math.sin(Date.now() * 0.005) * 0.15 * Math.min(scrollProgress * 2, 1)]}>
        <cylinderGeometry args={[0.05, 0.05, 5.0, 16]} />
        <meshBasicMaterial 
          color="#ddfe71" 
          transparent 
          opacity={0.4 + Math.sin(Date.now() * 0.005) * 0.2 * Math.min(scrollProgress * 2, 1)} 
          wireframe={true}
        />
      </mesh>

      {initialPositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
             if (el) meshRefs.current[i] = el;
          }}
          position={[pos.x, pos.y, pos.z]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredIdx(i);
            document.body.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            setHoveredIdx(null);
            document.body.style.cursor = 'auto';
          }}
        >
          <cylinderGeometry args={[0.25, 0.28, 0.3, 16]} />

          <meshStandardMaterial
            ref={(el) => {
               if(el) materialRefs.current[i] = el;
            }}
            color={i === injuredIndex ? "#fe7833" : "#addcec"}
            roughness={0.2}
            metalness={0.7}
            transparent={true}
            opacity={0.85}
            wireframe={true}
          />

          {/* Dedicated glowing bulging disc herniation mesh inside the injured index! */}
          {i === injuredIndex && (
            <mesh 
              position={[0.16, -0.12, 0.16]} 
              scale={[1 + severity * 1.6, 0.8 + severity * 0.3, 1 + severity * 1.6]}
            >
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial 
                color={severity > 0.7 ? "#ef4444" : severity > 0.35 ? "#fe7833" : "#eab308"} 
                roughness={0.15}
                metalness={0.8}
                transparent 
                opacity={0.8 + severity * 0.2} 
                wireframe={true}
              />
            </mesh>
          )}
        </mesh>
      ))}

      {/* Spinal Interactive HTML Tooltip */}
      {hoveredIdx !== null && activeTooltipPosition && (
        <Html
          position={[activeTooltipPosition.x, activeTooltipPosition.y, activeTooltipPosition.z]}
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
              {vertebraeInfo[hoveredIdx]?.name || `Spinal Vertebra`}
            </div>
            
            {hoveredIdx === 8 && (
              <div className="text-[9px] mt-1 font-sans font-extrabold text-red-500 uppercase tracking-widest animate-pulse">
                Herniation Level: {Math.round(severity * 100)}%
              </div>
            )}

            <div className="text-[10px] mt-1.5 whitespace-normal leading-relaxed opacity-85 select-none font-sans">
              {hoveredIdx === 8 
                ? `L4 Lumbar Vertebra containing a focal disc protrusion with a biomechanical severity of ${Math.round(severity * 100)}%. Drag model to rotate.` 
                : vertebraeInfo[hoveredIdx]?.desc}
            </div>

            <div className={`text-[8.5px] mt-2 border-t pt-1.5 flex justify-between uppercase tracking-widest font-bold opacity-60 ${isDark ? 'border-lime/10' : 'border-[#132644]/10'}`}>
              <span>Anatomy Node [0{hoveredIdx + 1}]</span>
              <span className={hoveredIdx === 8 && scrollProgress > 0.5 ? 'text-lime font-bold' : ''}>
                {hoveredIdx === 8 && scrollProgress > 0.5 ? 'Decompressed' : 'Compressive'}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}