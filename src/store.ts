import { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";

export interface Store {
  rootObject: Object3D;
  bottleObject: Object3D;
  domNodes: {
    canvas: HTMLElement;
    container: HTMLElement;
    word1: HTMLElement;
    word2: HTMLElement;
  };
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  isReady: boolean;
}

interface State {
  store: Store | undefined;
}

const state: State = {
  store: undefined,
};

export default state;
