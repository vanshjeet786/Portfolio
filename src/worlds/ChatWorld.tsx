import React from 'react';
import { SignalCityEnvironment } from './SignalCityEnvironment';
import { TheBeaconNetwork } from './TheBeaconNetwork';

/**
 * ChatWorld — "The Signal City"
 * Act V of the exhibition.
 * Mounted permanently at Z = -120 in the continuous corridor.
 */
export const ChatWorld: React.FC = () => {
  return (
    <group name="chat-world">
      <SignalCityEnvironment />
      <TheBeaconNetwork />
    </group>
  );
};
export default ChatWorld;
