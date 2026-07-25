export interface ExperienceManagerInterface {
  init: () => void;
  advanceChapter: () => void;
  setChapterProgress: (progress: number) => void;
  update: (delta: number) => void;
  destroy: () => void;
}

/**
 * ExperienceManager
 * Governs the narrative pacing, chapter milestones, and synchronization
 * between UI overlays and WebGL world states.
 */
export class ExperienceManager implements ExperienceManagerInterface {
  private activeChapter: number = 0;
  private timelineProgress: number = 0;
  private isInitialized: boolean = false;

  constructor() {
    // Experience Manager bootstrap
  }

  /**
   * Initializes state listeners and sets initial milestones.
   */
  public init(): void {
    this.isInitialized = true;
  }

  /**
   * Transitions the application state into the next story chapter.
   */
  public advanceChapter(): void {
    if (!this.isInitialized) return;
    this.activeChapter += 1;
  }

  /**
   * Syncs custom scrolling timelines with experience progress percentage.
   */
  public setChapterProgress(progress: number): void {
    if (!this.isInitialized) return;
    this.timelineProgress = Math.max(0, Math.min(1, progress));
  }

  /**
   * Narrative engine update loop.
   */
  public update(): void {
    if (!this.isInitialized) return;
    // Performs narrative timeline evaluation if using live scroll triggers
  }

  /**
   * Gets the current timeline progress of the experience.
   */
  public getProgress(): number {
    return this.timelineProgress;
  }

  /**
   * Disposes of listeners and timers.
   */
  public destroy(): void {
    this.isInitialized = false;
    this.activeChapter = 0;
    this.timelineProgress = 0;
  }
}
