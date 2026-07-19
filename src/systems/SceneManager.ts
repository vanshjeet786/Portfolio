import * as THREE from 'three';

export interface SceneManagerInterface {
  init: (scene: THREE.Scene) => void;
  add: (object: THREE.Object3D) => void;
  remove: (object: THREE.Object3D) => void;
  update: (delta: number) => void;
  destroy: () => void;
}

/**
 * SceneManager
 * Owns scene lifecycle only.
 * No project or world knowledge.
 */
export class SceneManager implements SceneManagerInterface {
  private activeScene: THREE.Scene | null = null;
  private sceneObjects: Set<THREE.Object3D> = new Set();

  constructor() {
    // Scene Manager bootstrap
  }

  public init(scene: THREE.Scene): void {
    this.activeScene = scene;
  }

  public add(object: THREE.Object3D): void {
    if (this.activeScene && !this.sceneObjects.has(object)) {
      this.activeScene.add(object);
      this.sceneObjects.add(object);
    }
  }

  public remove(object: THREE.Object3D): void {
    if (this.activeScene && this.sceneObjects.has(object)) {
      this.activeScene.remove(object);
      this.sceneObjects.delete(object);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_delta: number): void {
    // Global scene animations or updates (e.g., fog, global lighting) if required
  }

  public destroy(): void {
    if (this.activeScene) {
      this.sceneObjects.forEach((obj) => {
        this.activeScene!.remove(obj);
      });
    }
    this.sceneObjects.clear();
    this.activeScene = null;
  }
}

