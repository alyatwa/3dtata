import * as THREE from 'three'

export default class TextureLoaderManager {
    paths: string[];
    textures: THREE.Texture[];
    loader: THREE.TextureLoader;
    loadedCount: number;
    totalCount: number;
    constructor(paths: string[]) {
      this.paths = paths;
      this.textures = [];
      this.loader = new THREE.TextureLoader();
      this.loadedCount = 0;
      this.totalCount = paths.length;
    }
  
    loadTextures(paths: string[], callback:()=>void): Promise<THREE.Texture[]> {
        const loader = new THREE.TextureLoader();
        const promises = paths.map(path => {
          return new Promise((resolve, reject) => {
            loader.load(
              path,
              texture => resolve(texture),
              undefined,
              error => reject(error)
            );
          });
        });
       const promiseAll = Promise.all(promises) as Promise<THREE.Texture[]>;
       promiseAll.then(()=>callback())
        return promiseAll
      }
  
    onTextureLoaded(texture: THREE.Texture) {
      this.textures.push(texture);
      this.loadedCount++;
      this.onProgress(this.loadedCount / this.totalCount);
    }
  
    onProgress(progress: number) {
      console.log(`Loading progress: ${(progress * 100).toFixed(2)}%`);
    }
  
    isLoadComplete() {
      return this.loadedCount === this.totalCount;
    }
  
    getTexture(index: number) {
      return this.textures[index];
    }
  }