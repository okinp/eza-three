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
import { EffectComposer } from "postprocessing";

export interface Store {
  rootObject: Object3D;
  bottleObject: Object3D;
  materials: {
    bottle: MeshPhysicalMaterial;
    cap: MeshPhysicalMaterial;
    topLabel: MeshPhysicalMaterial;
    backLabel: MeshPhysicalMaterial;
    frontLabel: MeshPhysicalMaterial;
    liquid: MeshPhysicalMaterial;
    water?: MeshPhysicalMaterial;
  };
  domNodes: {
    canvas: HTMLElement;
    container: HTMLElement;
  };
  composer?: EffectComposer;
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
    bottle: Mesh;
    cap: Mesh;
    topLabel: Mesh;
    backLabel: Mesh;
    frontLabel: Mesh;
    liquid: Mesh;
    water?: Mesh;
  };
  isReady: boolean;

  clock: Clock;
}

interface State {
  store: Store | undefined;
}

const state: State = {
  store: undefined,
};

export default state;
