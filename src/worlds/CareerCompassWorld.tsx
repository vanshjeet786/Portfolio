import React from 'react';
import { ObservatoryEnvironment } from './ObservatoryEnvironment';
import { HeroCompass } from './HeroCompass';

export const CareerCompassWorld: React.FC = () => {
  return (
    <group name="career-compass-world">
      <ObservatoryEnvironment />
      <HeroCompass />
    </group>
  );
};
export default CareerCompassWorld;
