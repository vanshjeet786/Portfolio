export const preloadRemainingChunks = () => {
  // Programmatically trigger dynamic imports in the background
  const chunks = [
    () => import('@/components/scenes/Skillometer'),
    () => import('@/components/scenes/StanceScene'),
    () => import('@/components/scenes/OutroScene'),
    () => import('@/worlds/SkillometerWorld'),
    () => import('@/worlds/ChatWorld'),
    () => import('@/worlds/LeaderboardWorld'),
    () => import('@/worlds/StanceWorld'),
    () => import('@/components/ui/EtherealNetwork'),
    () => import('@/components/ui/ConnectModal/ConnectModal'),
  ];

  // Trigger them all concurrently
  return Promise.all(chunks.map(load => load().catch(() => {
    // Gracefully handle preload failures (they will just load normally when mounted if offline/slow)
  })));
};
