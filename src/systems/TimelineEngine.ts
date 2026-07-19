import { gsap } from 'gsap';

export interface TimelineEngineInterface {
  init: () => void;
  registerTimeline: (id: string, config?: gsap.TimelineVars) => gsap.core.Timeline;
  disposeTimeline: (id: string) => void;
  getTimeline: (id: string) => gsap.core.Timeline | undefined;
  destroy: () => void;
}

/**
 * TimelineEngine
 * Coordinates and registers timelines.
 * Contains no project-specific animations or semantics.
 */
export class TimelineEngine implements TimelineEngineInterface {
  private timelines: Map<string, gsap.core.Timeline> = new Map();

  constructor() {
    // Timeline Engine bootstrap
  }

  public init(): void {
    // Configure GSAP global defaults
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });
  }

  public registerTimeline(id: string, config?: gsap.TimelineVars): gsap.core.Timeline {
    if (this.timelines.has(id)) {
      this.disposeTimeline(id);
    }
    
    const timeline = gsap.timeline(config);
    this.timelines.set(id, timeline);
    return timeline;
  }

  public getTimeline(id: string): gsap.core.Timeline | undefined {
    return this.timelines.get(id);
  }

  public disposeTimeline(id: string): void {
    const tl = this.timelines.get(id);
    if (tl) {
      tl.kill();
      this.timelines.delete(id);
    }
  }

  public destroy(): void {
    this.timelines.forEach((tl) => tl.kill());
    this.timelines.clear();
  }
}
