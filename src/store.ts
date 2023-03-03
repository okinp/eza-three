import {
  BufferGeometry,
  InstancedMesh,
  Line,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

interface iDropletMesh<T extends Material | Material[]> {
  addDroplet: (position: Vector3, normal: Vector3) => void;
  dropletMesh: InstancedMesh<BufferGeometry, T>;
}


export interface iDropletMeshes<T extends Material | Material[]> {
  xs: iDropletMesh<T>;
  sm: iDropletMesh<T>;
  md: iDropletMesh<T>;
  xl: iDropletMesh<T>;
  xxl: iDropletMesh<T>;
  xxxl: iDropletMesh<T>;
}

export interface Store {
  rootObject: Object3D;
  bottleObject: Object3D;
  line: Line;
  mouseHelper: Mesh;
  materials: {
    bottle: MeshPhysicalMaterial;
    cap: MeshPhysicalMaterial;
    topLabel: MeshPhysicalMaterial;
    backLabel: MeshPhysicalMaterial;
    frontLabel: MeshPhysicalMaterial;
    liquid: MeshPhysicalMaterial;
    water?: MeshPhysicalMaterial;
    dropletMaterial: MeshBasicMaterial;
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
  selectedDropSize: keyof iDropletMeshes<MeshBasicMaterial>,
  dropletMeshes: {
    xs: iDropletMesh<MeshBasicMaterial>;
    sm: iDropletMesh<MeshBasicMaterial>;
    md: iDropletMesh<MeshBasicMaterial>;
    xl: iDropletMesh<MeshBasicMaterial>;
    xxl: iDropletMesh<MeshBasicMaterial>;
    xxxl: iDropletMesh<MeshBasicMaterial>;
  };
  isReady: boolean;
}

interface State {
  store: Store | undefined;
}

const state: State = {
  store: undefined,
};

export default state;
