import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from 'lenis';
import Scene from './components/Scene';
import Overlay from './components/Overlay';

function App() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full relative text-black bg-white">
      {/* 3D Canvas fixed in background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Canvas shadows dpr={[1, 2]} eventSource={document.getElementById('root') || undefined}>
          <Scene />
        </Canvas>
      </div>

      {/* Scrollable Overlay containing the sections */}
      <div ref={overlayRef} className="relative z-10 w-full pointer-events-none">
        <Overlay />
      </div>
    </div>
  );
}

export default App;
