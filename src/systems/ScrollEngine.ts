import Lenis from 'lenis';

export interface ScrollEngineInterface {
  init: () => void;
  pause: () => void;
  resume: () => void;
  scrollTo: (target: number | string | HTMLElement, options?: Record<string, unknown>) => void;
  getProgress: () => number;
  update: (time: number) => void;
  destroy: () => void;
}

/**
 * ScrollEngine
 * Integrates Lenis for smooth scrolling infrastructure.
 * Exposes scrolling APIs but implements no animations or UI updates itself.
 */
export class ScrollEngine implements ScrollEngineInterface {
  private lenis: Lenis | null = null;
  private currentProgress: number = 0;
  
  constructor() {
    // Scroll Engine bootstrap
  }

  public init(): void {
    if (typeof window === 'undefined') return;

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    this.lenis.on('scroll', (e: unknown) => {
      // Cast the unknown event to an object with a progress number property
      const lenisEvent = e as { progress: number };
      this.currentProgress = lenisEvent.progress;
    });
  }

  public pause(): void {
    this.lenis?.stop();
  }

  public resume(): void {
    this.lenis?.start();
  }

  public scrollTo(target: number | string | HTMLElement, options?: Record<string, unknown>): void {
    this.lenis?.scrollTo(target, options);
  }

  public getProgress(): number {
    return this.currentProgress;
  }

  public update(time: number): void {
    this.lenis?.raf(time);
  }

  public destroy(): void {
    this.lenis?.destroy();
    this.lenis = null;
  }
}
