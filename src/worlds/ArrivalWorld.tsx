import React from 'react';
import { Environment } from '@/rendering/Environment';
import { HeroCube } from '@/rendering/HeroCube';

export const ArrivalWorld: React.FC = () => {
  return (
    <group name="arrival-world">
      <Environment />
      <HeroCube />
    </group>
  );
};
export default ArrivalWorld;
