export interface NavigationStateData {
  currentChapter: number;
  currentSection: number;
  journeyProgress: number;
}

export interface NavigationStateInterface {
  getState: () => NavigationStateData;
  setChapter: (chapter: number) => void;
  setSection: (section: number) => void;
  setJourneyProgress: (progress: number) => void;
  reset: () => void;
}

/**
 * NavigationState
 * Stores and exposes the current progression state.
 * Contains no visual UI, scroll manipulation, or keyboard logic.
 */
export class NavigationState implements NavigationStateInterface {
  private state: NavigationStateData = {
    currentChapter: 0,
    currentSection: 0,
    journeyProgress: 0,
  };

  constructor() {
    // Navigation State bootstrap
  }

  public getState(): NavigationStateData {
    return { ...this.state };
  }

  public setChapter(chapter: number): void {
    this.state.currentChapter = chapter;
  }

  public setSection(section: number): void {
    this.state.currentSection = section;
  }

  public setJourneyProgress(progress: number): void {
    this.state.journeyProgress = progress;
  }

  public reset(): void {
    this.state.currentChapter = 0;
    this.state.currentSection = 0;
    this.state.journeyProgress = 0;
  }
}
