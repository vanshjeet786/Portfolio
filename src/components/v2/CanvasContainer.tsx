import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { IntroScene } from './scenes/IntroScene';
import { CareerCompass } from './scenes/CareerCompass';
import { Skillometer } from './scenes/Skillometer';
import { StanceScene } from './scenes/StanceScene';
import { OutroScene } from './scenes/OutroScene';
import { CinematicCamera } from './CinematicCamera';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export const SCENE_SPACING = 30; // Distance between scenes on Z axis

export const CanvasContainer = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
      <Canvas>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 25]} />
        
        <Suspense fallback={null}>
          <CinematicCamera />
          
          <IntroScene position={[0, 0, 0]} />
          <CareerCompass position={[0, 0, -SCENE_SPACING]} />
          <Skillometer position={[0, 0, -SCENE_SPACING * 3]} />
          <StanceScene position={[0, 0, -SCENE_SPACING * 7]} />
          <OutroScene position={[0, 0, -SCENE_SPACING * 9]} />
          
          {/* Scene 5 (Exiles/Leaderboard) is entirely DOM-based, so no 3D mesh here */}
          
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
