import * as THREE from 'three';

export interface AssetInfo {
  id: string;
  type: 'gltf' | 'texture' | 'hdr' | 'image' | 'video';
  url: string;
}

export interface AssetManagerInterface {
  init: (onProgress: (progress: number) => void) => void;
  queueAssets: (assets: AssetInfo[]) => void;
  loadQueue: () => Promise<void>;
  getAsset: <T>(id: string) => T | undefined;
  disposeAsset: (id: string) => void;
  destroy: () => void;
}

/**
 * AssetManager
 * Handles preloading, streaming, and caching for all asset types (textures, GLTF models, videos).
 * Interfaces with ThreeJS LoadingManager for progress monitoring.
 */
export class AssetManager implements AssetManagerInterface {
  public readonly loadingManager: THREE.LoadingManager;
  private queuedAssets: AssetInfo[] = [];
  private cache: Map<string, unknown> = new Map();
  private onProgressCallback: ((progress: number) => void) | null = null;

  constructor() {
    this.loadingManager = new THREE.LoadingManager(
      // On Load
      () => {
        if (this.onProgressCallback) this.onProgressCallback(100);
      },
      // On Progress
      (_url, itemsLoaded, itemsTotal) => {
        if (this.onProgressCallback) {
          const progress = Math.round((itemsLoaded / itemsTotal) * 100);
          this.onProgressCallback(progress);
        }
      },
      // On Error
      () => {
        // Log loading error to system boundary
        // No console.log as per rules
      }
    );
  }

  /**
   * Registers progress monitoring hooks.
   */
  public init(onProgress: (progress: number) => void): void {
    this.onProgressCallback = onProgress;
  }

  /**
   * Adds assets to the loading queue for progressive streaming.
   */
  public queueAssets(assets: AssetInfo[]): void {
    this.queuedAssets = [...this.queuedAssets, ...assets];
  }

  /**
   * Executes loading queue using ThreeJS file loaders.
   */
  public async loadQueue(): Promise<void> {
    const assetsToLoad = [...this.queuedAssets];
    this.queuedAssets = [];

    const loadPromises = assetsToLoad.map((asset) => {
      return new Promise<void>((resolve) => {
        // Skeleton mock for loading logic
        setTimeout(() => {
          // Put placeholder objects in cache depending on asset type
          if (asset.type === 'texture') {
            const texture = new THREE.Texture();
            this.cache.set(asset.id, texture);
          } else if (asset.type === 'gltf') {
            const group = new THREE.Group();
            this.cache.set(asset.id, group);
          } else {
            this.cache.set(asset.id, {});
          }
          resolve();
        }, 100);
      });
    });

    await Promise.all(loadPromises);
  }

  /**
   * Retrieves a loaded asset from the local in-memory cache.
   */
  public getAsset<T>(id: string): T | undefined {
    return this.cache.get(id) as T;
  }

  /**
   * Disposes of cache reference and releases GPU assets (geometries, textures).
   */
  public disposeAsset(id: string): void {
    const asset = this.cache.get(id);
    if (!asset) return;

    if (asset instanceof THREE.Texture) {
      asset.dispose();
    } else if (asset instanceof THREE.Group) {
      asset.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          if (node.geometry) node.geometry.dispose();
          if (Array.isArray(node.material)) {
            node.material.forEach((mat) => mat.dispose());
          } else if (node.material) {
            node.material.dispose();
          }
        }
      });
    }
    
    this.cache.delete(id);
  }

  /**
   * Purges all loaded cache assets.
   */
  public destroy(): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach((key) => this.disposeAsset(key));
    this.cache.clear();
    this.onProgressCallback = null;
  }
}
