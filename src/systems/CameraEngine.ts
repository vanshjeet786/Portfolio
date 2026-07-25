import * as THREE from 'three';

export interface CameraState {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

export interface CameraEngineInterface {
  init: (camera: THREE.PerspectiveCamera) => void;
  updateState: (newState: Partial<CameraState>) => void;
  getState: () => CameraState;
  update: (delta: number) => void;
  destroy: () => void;
}

/**
 * CameraEngine
 * Owns camera state, transitions, and constraints.
 * No actual camera choreography or project-specific movements yet.
 */
export class CameraEngine implements CameraEngineInterface {
  private camera: THREE.PerspectiveCamera | null = null;
  private state: CameraState = {
    position: new THREE.Vector3(0, 0, 5),
    target: new THREE.Vector3(0, 0, 0),
    fov: 45,
  };
  private currentLookAt: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

  constructor() {
    // Camera Engine bootstrap
  }

  public init(camera: THREE.PerspectiveCamera): void {
    this.camera = camera;
    this.state.position.copy(camera.position);
    this.state.fov = camera.fov;
    
    // In three.js, target is not a property of camera, it's typically managed separately
    // We start looking at origin
    this.currentLookAt.copy(this.state.target);
    this.camera.lookAt(this.currentLookAt);
  }

  public updateState(newState: Partial<CameraState>): void {
    if (newState.position) {
      this.state.position.copy(newState.position);
    }
    if (newState.target) {
      this.state.target.copy(newState.target);
    }
    if (newState.fov !== undefined) {
      this.state.fov = newState.fov;
    }
  }

  public getState(): CameraState {
    return {
      position: this.state.position.clone(),
      target: this.state.target.clone(),
      fov: this.state.fov,
    };
  }

  public update(delta: number): void {
    if (!this.camera) return;

    // Infrastructure for smooth interpolation between current and target state
    // Currently uses basic lerp. No complex choreography.
    const lerpFactor = Math.min(delta * 5.0, 1.0); // Simple dampening based on time

    this.camera.position.lerp(this.state.position, lerpFactor);
    this.currentLookAt.lerp(this.state.target, lerpFactor);
    
    if (this.camera.fov !== this.state.fov) {
      this.camera.fov += (this.state.fov - this.camera.fov) * lerpFactor;
      this.camera.updateProjectionMatrix();
    }
    
    this.camera.lookAt(this.currentLookAt);
  }

  public destroy(): void {
    this.camera = null;
  }
}
