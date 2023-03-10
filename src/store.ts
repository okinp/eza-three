import {
  BufferGeometry,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
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
  materials: {
    bottle: MeshStandardMaterial;
    cap: MeshStandardMaterial;
    topLabel: MeshStandardMaterial;
    backLabel: MeshStandardMaterial;
    frontLabel: MeshStandardMaterial;
    liquid: MeshPhysicalMaterial;
    water?: MeshPhysicalMaterial;
    dropletMaterial?: MeshBasicMaterial;
  };
  domNodes: {
    canvas: HTMLElement;
    container: HTMLElement;
    word1: HTMLElement;
    word2: HTMLElement;
  };
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  meshes: {
    bottle: Mesh;
    cap: Mesh;
    topLabel: Mesh;
    backLabel: Mesh;
    frontLabel: Mesh;
    liquid: Mesh;
    water?: Mesh;
  };
  // selectedDropSize: keyof iDropletMeshes,
  // dropletMeshes: {
  //   xs: iDropletMesh;
  //   sm: iDropletMesh;
  //   md: iDropletMesh;
  //   xl: iDropletMesh;
  //   xxl: iDropletMesh;
  //   xxxl: iDropletMesh;
  // };
  isReady: boolean;
}

interface State {
  store: Store | undefined;
}

const state: State = {
  store: undefined,
};

export default state;
