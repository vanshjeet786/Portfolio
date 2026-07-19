import { CanvasContainer } from '@/components/v2/CanvasContainer';
import { UIOverlay } from '@/components/v2/UIOverlay';
import { ScrollManager } from '@/components/v2/ScrollManager';
import { CustomCursor } from '@/components/v2/ui/CustomCursor';

export function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative" style={{ cursor: 'none' }}>
      <CustomCursor />
      <ScrollManager />
      <CanvasContainer />
      <UIOverlay />
    </div>
  );
}

export default App;
