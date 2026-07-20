import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRender } from '@/providers/RenderProvider';
import { useInteractionStore } from '@/stores/useInteractionStore';
import * as THREE from 'three';
import { ArrivalWorld } from '@/worlds/ArrivalWorld';
import { CareerCompassWorld } from '@/worlds/CareerCompassWorld';
import { SkillometerWorld } from '@/worlds/SkillometerWorld';
import { ExilesWorld } from '@/worlds/ExilesWorld';
import { LeaderboardWorld } from '@/worlds/LeaderboardWorld';
import { StanceWorld } from '@/worlds/StanceWorld';

/**
 * CameraController
 * Single source of truth for all camera movement.
 * Pointer parallax + scroll-driven physical journey.
 * No competing animation systems.
 *
 * World Z positions:
 *   Arrival       → Z=0    (camera starts at Z=8)
 *   CareerCompass → Z=-40
 *   Skillometer   → Z=-80
 *   Exiles        → Z=-120
 *   Leaderboard   → Z=-160
 *   Stance        → Z=-200
 *
 * Scroll segments:
 *   0.00 - 0.25 : Arrival observation
 *   0.25 - 0.35 : Corridor travel → Career Compass
 *   0.35 - 0.52 : Career Compass observation
 *   0.52 - 0.62 : Corridor travel → Skillometer
 *   0.62 - 0.72 : Skillometer observation
 *   0.72 - 0.78 : Corridor travel → Exiles
 *   0.78 - 0.84 : Exiles observation
 *   0.84 - 0.88 : Corridor travel → Leaderboard
 *   0.88 - 0.92 : Leaderboard observation
 *   0.92 - 0.96 : Corridor travel → Stance
 *   0.96 - 1.00 : Stance observation
 */
function CameraController() {
  const { camera } = useThree();
  const cursorPosition = useInteractionStore((s) => s.cursorPosition);
  const scrollProgress = useInteractionStore((s) => s.scrollProgress);
  const targetRef = useRef(new THREE.Vector3(0, 0, 8));

  useFrame((_, delta) => {
    const parallaxX = cursorPosition.x * 0.35;
    const parallaxY = cursorPosition.y * 0.18;

    // --- PHYSICAL ARCHITECTURAL JOURNEY — single computation ---
    let targetZ: number;
    let lookAtZ: number;
    let orbitX = 0;

    if (scrollProgress < 0.25) {
      // Arrival: pull slightly back as visitor settles
      targetZ = 8 - scrollProgress * 4;
      lookAtZ = 0;
    } else if (scrollProgress < 0.35) {
      // Transition: travel from Arrival to Career Compass
      const p = (scrollProgress - 0.25) / 0.10;
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      targetZ = 7 + ease * (-40 - 7);
      lookAtZ = ease < 0.5 ? 0 : -40;
    } else if (scrollProgress < 0.52) {
      // Career Compass: subtle orbit — visitor observes from different angles
      const p = (scrollProgress - 0.35) / 0.17;
      const angle = p * Math.PI * 0.3;
      const orbitRadius = 3 * Math.min(1, p * 3);
      targetZ = -40 + Math.cos(angle) * orbitRadius - orbitRadius;
      orbitX = Math.sin(angle) * orbitRadius;
      lookAtZ = -40;
    } else if (scrollProgress < 0.62) {
      // Transition: travel from Career Compass to Skillometer
      const p = (scrollProgress - 0.52) / 0.10;
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      targetZ = -37 + ease * (-80 - (-37));
      lookAtZ = ease < 0.5 ? -40 : -80;
    } else if (scrollProgress < 0.72) {
      // Skillometer: minimal observational drift
      const p = (scrollProgress - 0.62) / 0.10;
      const angle = p * Math.PI * 0.15;
      targetZ = -80 + p * 3;
      orbitX = Math.sin(angle) * 1.2;
      lookAtZ = -80;
    } else if (scrollProgress < 0.78) {
      // Transition: travel from Skillometer to Exiles (Signal City)
      const p = (scrollProgress - 0.72) / 0.06;
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      targetZ = -77 + ease * (-120 - (-77));
      lookAtZ = ease < 0.5 ? -80 : -120;
    } else if (scrollProgress < 0.84) {
      // Exiles: the camera stands still — almost imperceptible drift
      const p = (scrollProgress - 0.78) / 0.06;
      targetZ = -120 + p * 3;
      orbitX = Math.sin(p * Math.PI * 0.5) * 1.0;
      lookAtZ = -120;
    } else if (scrollProgress < 0.88) {
      // Transition: travel from Exiles to Leaderboard (The Arena)
      const p = (scrollProgress - 0.84) / 0.04;
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      targetZ = -117 + ease * (-160 - (-117));
      lookAtZ = ease < 0.5 ? -120 : -160;
    } else if (scrollProgress < 0.92) {
      // Leaderboard observation: slow approach
      const p = (scrollProgress - 0.88) / 0.04;
      targetZ = -160 + 15 - p * 8; // move from 15 units away to 7 units away
      lookAtZ = -160;
    } else if (scrollProgress < 0.96) {
      // Transition: travel from Leaderboard to Stance (The Sanctuary)
      const p = (scrollProgress - 0.92) / 0.04;
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      targetZ = -153 + ease * (-200 - (-153));
      lookAtZ = ease < 0.5 ? -160 : -200;
    } else {
      // Stance: The Sanctuary. The camera is very slow, barely moving.
      const p = (scrollProgress - 0.96) / 0.04;
      targetZ = -200 + 20 - p * 5; // Move very slowly from 20 units to 15 units away
      orbitX = Math.sin(p * Math.PI * 0.2) * 2.0; // Gentle lateral drift
      lookAtZ = -200;
    }

    const scrollY = scrollProgress * -1.2;

    targetRef.current.set(
      parallaxX + orbitX,
      parallaxY + scrollY,
      targetZ
    );

    // Frame-rate independent lerp — heavy and patient
    const lerpFactor = 1 - Math.pow(0.0001, delta);
    camera.position.lerp(targetRef.current, lerpFactor);
    camera.lookAt(parallaxX * 0.08, scrollY * 0.35, lookAtZ);
  });

  return null;
}

/**
 * RenderCanvas
 * Permanent mounting of all worlds in physical Z-space.
 * No conditional mounting — no pop-in, no pop-out.
 */
export const RenderCanvas: React.FC = () => {
  const { glConfig } = useRender();

  return (
    <div
      id="canvas-container"
      className="fixed inset-0 w-full h-full z-0"
      style={{ pointerEvents: 'auto' }}
    >
      <Canvas
        gl={{
          antialias: glConfig.antialias,
          alpha: glConfig.alpha,
          powerPreference: glConfig.powerPreference,
          toneMapping: glConfig.toneMapping,
          toneMappingExposure: glConfig.toneMappingExposure,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 250,
          position: [0, 0, 8],
        }}
        dpr={[1, 2]}
        shadows
      >
        <Suspense fallback={null}>
          <CameraController />

          {/* All worlds permanently mounted at their Z position */}
          <group position={[0, 0, 0]}>
            <ArrivalWorld />
          </group>

          <group position={[0, 0, -40]}>
            <CareerCompassWorld />
          </group>

          <group position={[0, 0, -80]}>
            <SkillometerWorld />
          </group>

          <group position={[0, 0, -120]}>
            <ExilesWorld />
          </group>

          <group position={[0, 0, -160]}>
            <LeaderboardWorld />
          </group>

          <group position={[0, 0, -200]}>
            <StanceWorld />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};
