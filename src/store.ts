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
} from "three";

export interface IStore {
  rootObject: Object3D;
  materials: {
    bottle: MeshPhysicalMaterial;
    liquid: MeshPhysicalMaterial;
  };
  domNodes: {
    canvas: HTMLElement;
    container: HTMLElement;
  };
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  lights: ILights;
  lightHelpers: {
    spot: SpotLightHelper[];
    point: PointLightHelper[];
    directional: DirectionalLightHelper[];
  };
  meshes: {
    circle: Mesh;
  };
  isReady: boolean;
  clock: Clock;
}

interface State {
  store: IStore | undefined;
}

const state: State = {
  store: undefined,
};

export default state;
