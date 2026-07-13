import { CanvasContainer } from './components/CanvasContainer';
import { UIOverlay } from './components/UIOverlay';
import { ScrollManager } from './components/ScrollManager';
import './index.css';

function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <ScrollManager />
      <CanvasContainer />
      <UIOverlay />
    </div>
  );
}

export default App;
