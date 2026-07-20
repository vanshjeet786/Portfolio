import React from 'react';
import { TheSanctuaryEnvironment } from './TheSanctuaryEnvironment';
import { TheLivingFigure } from './TheLivingFigure';

/**
 * StanceWorld — "The Sanctuary"
 * Act VII of the exhibition.
 * Mounted permanently at Z = -200 in the continuous corridor.
 */
export const StanceWorld: React.FC = () => {
  return (
    <group name="stance-world">
      <TheSanctuaryEnvironment />
      <TheLivingFigure />
    </group>
  );
};
export default StanceWorld;
