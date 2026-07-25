import React from 'react';
import { SignalCityEnvironment } from './SignalCityEnvironment';
import { TheBeaconNetwork } from './TheBeaconNetwork';

/**
 * ExilesWorld — "The Signal City"
 * Act V of the exhibition.
 * Mounted permanently at Z = -120 in the continuous corridor.
 */
export const ExilesWorld: React.FC = () => {
  return (
    <group name="exiles-world">
      <SignalCityEnvironment />
      <TheBeaconNetwork />
    </group>
  );
};
export default ExilesWorld;
