import { Canvas } from '@react-three/fiber';
import { Suspense, lazy } from 'react';
import { IntroScene } from './scenes/IntroScene';
import { CareerCompass } from './scenes/CareerCompass';

const Skillometer = lazy(() => import('./scenes/Skillometer').then(m => ({ default: m.Skillometer })));
const StanceScene = lazy(() => import('./scenes/StanceScene').then(m => ({ default: m.StanceScene })));
const OutroScene = lazy(() => import('./scenes/OutroScene').then(m => ({ default: m.OutroScene })));
import { CinematicCamera } from './CinematicCamera';
import { CursorRefraction } from './CursorRefraction';
import { ScrollEffects } from './ScrollEffects';
import { CullableScene } from './CullableScene';

export const SCENE_SPACING = 30; // Distance between scenes on Z axis

export const CanvasContainer = () => {
  return (
    <div id="canvas-container" className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
      <Canvas>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 25]} />
        
        <Suspense fallback={null}>
          <CinematicCamera />
          <CursorRefraction />
          
          <CullableScene position={[0, 0, 0]}>
            <IntroScene position={[0, 0, 0]} />
          </CullableScene>
          
          <CullableScene position={[0, 0, -SCENE_SPACING]}>
            <CareerCompass position={[0, 0, 0]} />
          </CullableScene>
          
          <CullableScene position={[0, 0, -SCENE_SPACING * 3]}>
            <Skillometer position={[0, 0, 0]} />
          </CullableScene>
          
          <CullableScene position={[0, 0, -SCENE_SPACING * 5]}>
            <StanceScene position={[0, 0, 0]} />
          </CullableScene>
          
          <CullableScene position={[0, 0, -SCENE_SPACING * 9]}>
            <OutroScene position={[0, 0, 0]} />
          </CullableScene>
          
          {/* Scene 7 (Exiles/Leaderboard) is entirely DOM-based, so no 3D mesh here */}
          
          <ScrollEffects />
        </Suspense>
      </Canvas>
    </div>
  );
};
