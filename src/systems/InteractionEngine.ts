export interface InteractionState {
  x: number;
  y: number;
  isDown: boolean;
  isHovering: boolean;
}

export interface InteractionEngineInterface {
  init: () => void;
  updateCoordinates: (clientX: number, clientY: number) => void;
  setHoverState: (isHovering: boolean) => void;
  setDownState: (isDown: boolean) => void;
  getState: () => InteractionState;
  destroy: () => void;
}

/**
 * InteractionEngine
 * Normalizes all pointer inputs (Mouse, Touch, Wheel) into unified coordinates.
 * Exposes interaction state only without manipulating the DOM or rendering cursors.
 */
export class InteractionEngine implements InteractionEngineInterface {
  private state: InteractionState = {
    x: 0,
    y: 0,
    isDown: false,
    isHovering: false,
  };

  constructor() {
    // Interaction Engine bootstrap
  }

  public init(): void {
    // Attach global listeners if needed in future, currently driven by React Context
  }

  public updateCoordinates(clientX: number, clientY: number): void {
    this.state.x = clientX;
    this.state.y = clientY;
  }

  public setHoverState(isHovering: boolean): void {
    this.state.isHovering = isHovering;
  }

  public setDownState(isDown: boolean): void {
    this.state.isDown = isDown;
  }

  public getState(): InteractionState {
    return { ...this.state };
  }

  public destroy(): void {
    // Clean up any listeners
  }
}
