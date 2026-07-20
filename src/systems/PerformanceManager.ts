export interface PerformanceMetrics {
  fps: number;
  memory?: number;
}

export interface PerformanceManagerInterface {
  init: () => void;
  recordFrame: (time: number) => void;
  getMetrics: () => PerformanceMetrics;
  destroy: () => void;
}

/**
 * PerformanceManager
 * Monitors FPS, system latency, and memory allocations.
 * Exposes metrics only. It does not automatically change rendering quality.
 */
export class PerformanceManager implements PerformanceManagerInterface {
  private lastFrameTime: number = 0;
  private frameHistory: number[] = [];
  private maxHistorySize: number = 60;
  private currentFps: number = 60;

  constructor() {
    // Performance Manager bootstrap
  }

  public init(): void {
    this.lastFrameTime = performance.now();
  }

  public recordFrame(time: number): void {
    const delta = time - this.lastFrameTime;
    this.lastFrameTime = time;

    // Avoid divide by zero if time hasn't changed
    if (delta > 0) {
      const fps = 1000 / delta;
      this.frameHistory.push(fps);
      if (this.frameHistory.length > this.maxHistorySize) {
        this.frameHistory.shift();
      }
    }

    const sum = this.frameHistory.reduce((acc, val) => acc + val, 0);
    this.currentFps = this.frameHistory.length > 0 ? sum / this.frameHistory.length : 60;
  }

  public getMetrics(): PerformanceMetrics {
    const metrics: PerformanceMetrics = { fps: this.currentFps };
    // Only available in some browsers
    const perf = performance as unknown as { memory?: { usedJSHeapSize: number } };
    if (perf.memory) {
      metrics.memory = perf.memory.usedJSHeapSize;
    }
    return metrics;
  }

  public destroy(): void {
    this.frameHistory = [];
  }
}

