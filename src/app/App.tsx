import { useEffect } from 'react';
import { CanvasContainer } from '@/components/CanvasContainer';
import { UIOverlay } from '@/components/UIOverlay';
import { ScrollManager } from '@/components/ScrollManager';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { TopographicLoader } from '@/components/ui/TopographicLoader';
import { useLoadStore } from '@/stores/useLoadStore';
import { preloadRemainingChunks } from '@/utils/preloadHelper';

export function App() {
  const { setProgress, setStatusText, isFirstTwoScenesLoaded, setPreloadingStarted } = useLoadStore();

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const isLoaded = useLoadStore.getState().isFirstTwoScenesLoaded;

      if (isLoaded) {
        current += Math.floor(Math.random() * 7) + 5;
        if (current >= 100) {
          current = 100;
          clearInterval(interval);
          setStatusText('System synchronized.');
        } else {
          setStatusText('Synchronizing anatomical matrix...');
        }
      } else {
        if (current < 45) {
          current += Math.floor(Math.random() * 8) + 4;
          if (current >= 45) current = 45;
          setStatusText('Compiling anatomical matrix...');
        } else {
          setStatusText('Awaiting canvas renderer...');
        }
      }

      setProgress(current);
    }, 50);

    return () => clearInterval(interval);
  }, [setProgress, setStatusText]);

  useEffect(() => {
    if (isFirstTwoScenesLoaded) {
      setPreloadingStarted(true);
      preloadRemainingChunks();
    }
  }, [isFirstTwoScenesLoaded, setPreloadingStarted]);

  return (
    <div id="app-root" className="w-full h-dvh bg-black overflow-hidden relative" style={{ cursor: 'none' }}>
      <TopographicLoader />
      <CustomCursor />
      <ScrollManager />
      <CanvasContainer />
      <UIOverlay />
    </div>
  );
}

export default App;
