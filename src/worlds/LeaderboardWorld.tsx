import React from 'react';
import { TheArenaEnvironment } from './TheArenaEnvironment';
import { TheKineticMonolith } from './TheKineticMonolith';

/**
 * LeaderboardWorld — "The Arena"
 * Act VI of the exhibition.
 * Mounted permanently at Z = -160 in the continuous corridor.
 */
export const LeaderboardWorld: React.FC = () => {
  return (
    <group name="leaderboard-world">
      <TheArenaEnvironment />
      <TheKineticMonolith />
    </group>
  );
};
export default LeaderboardWorld;
