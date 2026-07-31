import { CanvasContainer } from '@/components/CanvasContainer';
import { UIOverlay } from '@/components/UIOverlay';
import { ScrollManager } from '@/components/ScrollManager';
import { CustomCursor } from '@/components/ui/CustomCursor';

export function App() {
  return (
    <div id="app-root" className="w-full h-screen bg-black overflow-hidden relative" style={{ cursor: 'none' }}>
      <CustomCursor />
      <ScrollManager />
      <CanvasContainer />
      <UIOverlay />
    </div>
  );
}

export default App;
