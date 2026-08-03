class SoundEngineClass {
  private ctx: AudioContext | null = null;
  private ambientOscillator: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private hoverSound: HTMLAudioElement | null = null;
  private openSound: HTMLAudioElement | null = null;
  private readonly hoverVolume = 0.225;
  private readonly openVolume = 0.14;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (typeof Audio !== 'undefined') {
      if (!this.hoverSound) {
        this.hoverSound = new Audio('/ui-hover.mp3');
        this.hoverSound.preload = 'auto';
        this.hoverSound.volume = this.hoverVolume;
      }
      if (!this.openSound) {
        this.openSound = new Audio('/ui-open.mp3');
        this.openSound.preload = 'auto';
        this.openSound.volume = this.openVolume;
      }
    }
  }

  private playExternalSound(sound: HTMLAudioElement | null, volume: number) {
    if (!sound) return;

    try {
      const instance = sound.cloneNode(true) as HTMLAudioElement;
      instance.volume = volume;
      void instance.play().catch(() => {
        // Ignore autoplay or decode failures
      });
    } catch {
      // Ignore
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

  public playHover = () => {
    try {
      this.init();
      this.playExternalSound(this.hoverSound, this.hoverVolume);
    } catch {
      // Audio context might be blocked by browser policy, ignore silently
    }
  };

  public playClick = () => {
    try {
      this.init();
      this.playExternalSound(this.openSound, this.openVolume);
      
      // Attempt to start ambient drone on first user interaction if not already playing
      this.startAmbientDrone();
    } catch {
      // Ignore
    }
  };

  public playClose = () => {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const airDuration = 0.22;
      const airBufferSize = Math.floor(this.ctx.sampleRate * airDuration);
      const airBuffer = this.ctx.createBuffer(1, airBufferSize, this.ctx.sampleRate);
      const channelData = airBuffer.getChannelData(0);

      for (let i = 0; i < airBufferSize; i++) {
        const t = i / airBufferSize;
        const envelope = Math.pow(1 - t, 3.2);
        channelData[i] = (Math.random() * 2 - 1) * envelope * 0.1;
      }

      const airSource = this.ctx.createBufferSource();
      airSource.buffer = airBuffer;

      const airFilter = this.ctx.createBiquadFilter();
      airFilter.type = 'bandpass';
      airFilter.frequency.setValueAtTime(1600, now);
      airFilter.frequency.exponentialRampToValueAtTime(700, now + airDuration);
      airFilter.Q.value = 0.9;

      const airGain = this.ctx.createGain();
      airGain.gain.setValueAtTime(0.0001, now);
      airGain.gain.exponentialRampToValueAtTime(0.028, now + 0.018);
      airGain.gain.exponentialRampToValueAtTime(0.0001, now + airDuration);

      airSource.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(this.ctx.destination);

      const knockOsc = this.ctx.createOscillator();
      knockOsc.type = 'triangle';
      knockOsc.frequency.setValueAtTime(260, now);
      knockOsc.frequency.exponentialRampToValueAtTime(120, now + 0.1);

      const knockFilter = this.ctx.createBiquadFilter();
      knockFilter.type = 'lowpass';
      knockFilter.frequency.setValueAtTime(1050, now);
      knockFilter.Q.value = 0.7;

      const knockGain = this.ctx.createGain();
      knockGain.gain.setValueAtTime(0.0001, now);
      knockGain.gain.exponentialRampToValueAtTime(0.05, now + 0.008);
      knockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.125);

      knockOsc.connect(knockFilter);
      knockFilter.connect(knockGain);
      knockGain.connect(this.ctx.destination);

      airSource.start(now);
      airSource.stop(now + airDuration);
      knockOsc.start(now);
      knockOsc.stop(now + 0.125);
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
