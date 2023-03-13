import {
  BufferGeometry,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

interface iDropletMesh {
  addDroplet: (position: Vector3, normal: Vector3) => void;
  dropletMesh: InstancedMesh<BufferGeometry, MeshBasicMaterial>;
}


export interface iDropletMeshes {
  xs: iDropletMesh;
  sm: iDropletMesh;
  md: iDropletMesh;
  xl: iDropletMesh;
  xxl: iDropletMesh;
  xxxl: iDropletMesh;
}

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
