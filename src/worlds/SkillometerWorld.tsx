import React from 'react';
import { LivingSystemEnvironment } from './LivingSystemEnvironment';
import { TheNetwork } from './TheNetwork';

export const SkillometerWorld: React.FC = () => {
  return (
    <group name="skillometer-world">
      <LivingSystemEnvironment />
      <TheNetwork />
    </group>
  );
};
export default SkillometerWorld;
