class SoundEngineClass {
  private ctx: AudioContext | null = null;
  private ambientOscillator: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Procedural Audio Synthesis Engine --- //

  // Start the continuous ambient drone
  public startAmbientDrone = () => {
    try {
      this.init();
      if (!this.ctx || this.isAmbientPlaying) return;

      this.ambientOscillator = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      // Deep, low-frequency sine wave for a physical, monolithic presence
      this.ambientOscillator.type = 'sine';
      this.ambientOscillator.frequency.value = 55; // 55Hz (A1)

      // Start completely silent, fade in
      this.ambientGain.gain.value = 0;
      this.ambientGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 2);

      this.ambientOscillator.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOscillator.start();
      this.isAmbientPlaying = true;
    } catch {
      // Ignore
    }
  };

  // Update the ambient drone based on scroll progress (0 to 1)
  public updateAmbientDrone = (progress: number) => {
    if (!this.ctx || !this.ambientOscillator || !this.ambientGain) return;

    // Change the frequency dynamically. 
    // It drops into lower bass during transitions and rises slightly during scenes.
    // Progress goes 0 -> 1. We can map this to subtle frequency shifts.
    const baseFreq = 55;
    // Map progress to a repeating wave (e.g., 10 scenes, so it pulses 10 times)
    const sceneCount = 10;
    const pulse = Math.sin(progress * Math.PI * 2 * (sceneCount - 1));
    
    // Pitch drops when halfway between scenes (pulse ~ -1)
    const targetFreq = baseFreq + (pulse * 10); 
    
    // Modulate volume subtly based on speed (simulated by rate of change of progress)
    // For simplicity, we just pulse the volume
    const baseVolume = 0.05;
    const targetVolume = baseVolume + (Math.abs(pulse) * 0.02);

    // Smoothly interpolate to the new values
    this.ambientOscillator.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.5);
    this.ambientGain.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.5);
  };

  public stopAmbientDrone = () => {
    if (this.ambientOscillator && this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => {
        if (this.ambientOscillator) {
          this.ambientOscillator.stop();
          this.ambientOscillator.disconnect();
          this.ambientOscillator = null;
        }
        if (this.ambientGain) {
          this.ambientGain.disconnect();
          this.ambientGain = null;
        }
        this.isAmbientPlaying = false;
      }, 1000);
    }
  };

  // --- UI Sound Effects --- //

  // A very short, high-frequency tick simulating tapping on thick glass
  public playHover = () => {
    try {
      this.init();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime); // High pitch
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio context might be blocked by browser policy, ignore silently
    }
  };

  // A hollow, resonant block sound (triangle wave with fast decay)
  public playClick = () => {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
      
      // Attempt to start ambient drone on first user interaction if not already playing
      this.startAmbientDrone();
    } catch {
      // Ignore
    }
  };

  // A deep, 40Hz sub-bass sweep for massive scene transitions
  public playTransition = () => {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 1.5); // Sub-bass sweep
      
      gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 1.5);
    } catch {
      // Ignore
    }
  };
}

export const SoundEngine = new SoundEngineClass();
