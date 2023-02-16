import type { ILights } from "./lights";

import {
  Clock,
  Mesh,
  MeshPhysicalMaterial,
  WebGLRenderer,
  Scene,
  Object3D,
  PerspectiveCamera,
  PointLightHelper,
  SpotLightHelper,
  DirectionalLightHelper,
  MeshBasicMaterial,
} from "three";

export interface IStore {
  rootObject: Object3D,
  materials: {
    word: MeshBasicMaterial,
    circle: MeshBasicMaterial,
    bottle: MeshPhysicalMaterial,
    liquid: MeshPhysicalMaterial,
    frontLabel: MeshPhysicalMaterial,
    backLabel: MeshPhysicalMaterial,
    topLabel: MeshPhysicalMaterial,
    cap: MeshPhysicalMaterial
  },
  domNodes: {
    canvas: HTMLElement,
    container: HTMLElement,
  };
  scene: Scene,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  lights: ILights,
  lightHelpers: {
    spot: SpotLightHelper[],
    point: PointLightHelper[],
    directional: DirectionalLightHelper[]
  },
  meshes: {
    cap: Mesh,
    circle: Mesh,
    bottle: Mesh,
    liquid: Mesh,
    topLabel: Mesh,
    frontLabel: Mesh,
    backLabel: Mesh,
    wordA: Mesh,
    wordB: Mesh

  },
  isReady: boolean,
  clock: Clock
}

interface State {
  store: IStore | undefined;
}

const state: State = {
  store: undefined,
};

export default state;
