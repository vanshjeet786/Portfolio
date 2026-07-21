import re

with open('src/components/v2/ScrollManager.tsx', 'r') as f:
    content = f.read()

# Add isModalOpen logic and modify delta logic
new_handle_wheel = """const handleWheel = (e: WheelEvent) => {
      if (useStore.getState().isModalOpen) return;

      // Normalize wheel delta and adjust sensitivity (reduced by 30% from 0.00015 to 0.000105)
      let baseDelta = e.deltaY * 0.000105;

      // Calculate dynamic friction based on proximity to nearest scene center
      const totalScenes = SCENE_COUNT;
      const segmentSize = 1 / (totalScenes - 1);
      const nearestIndex = Math.round(targetProgress / segmentSize);
      const nearestProgress = nearestIndex * segmentSize;

      const distanceToNearest = Math.abs(targetProgress - nearestProgress);

      // If we are within 20% of a segment to the center, apply friction
      const frictionThreshold = segmentSize * 0.2;
      let frictionMultiplier = 1;

      if (distanceToNearest < frictionThreshold) {
        // Friction increases as distance decreases. Max friction is 70% reduction (multiplier = 0.3)
        // distanceToNearest / frictionThreshold is 0 at center, 1 at edge
        frictionMultiplier = 0.3 + 0.7 * (distanceToNearest / frictionThreshold);
      }

      const adjustedDelta = baseDelta * frictionMultiplier;

      targetProgress = Math.max(0, Math.min(1, targetProgress + adjustedDelta));
      lastWheelTime = Date.now();
      isScrolling = true;

      // Start ambient audio on first scroll interaction
      if (!hasStartedAudio) {
        SoundEngine.startAmbientDrone();
        hasStartedAudio = true;
      }
    };"""

content = re.sub(r'const handleWheel = \(e: WheelEvent\) => \{.*?\n    \};', new_handle_wheel, content, flags=re.DOTALL)

with open('src/components/v2/ScrollManager.tsx', 'w') as f:
    f.write(content)
