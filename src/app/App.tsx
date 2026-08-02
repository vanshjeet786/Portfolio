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
    // Initial system startup simulation
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 45) {
        current = 45;
        clearInterval(interval);
        setStatusText('Awaiting canvas renderer...');
      }
      setProgress(current);
    }, 60);

    return () => clearInterval(interval);
  }, [setProgress, setStatusText]);

  useEffect(() => {
    if (isFirstTwoScenesLoaded) {
      setPreloadingStarted(true);
      preloadRemainingChunks();
    }
  }, [isFirstTwoScenesLoaded, setPreloadingStarted]);

  return (
    <div id="app-root" className="w-full h-screen bg-black overflow-hidden relative" style={{ cursor: 'none' }}>
      <TopographicLoader />
      <CustomCursor />
      <ScrollManager />
      <CanvasContainer />
      <UIOverlay />
    </div>
  );
}

export default App;
