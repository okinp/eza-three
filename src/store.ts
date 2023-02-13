import type { IStore } from "./interfaces";

const store: IStore = {
    bottleMaterial: undefined,
    liquidMaterial: undefined,
    container: undefined,
    canvas: undefined,
    renderer: undefined,
    scene: undefined,
    ambientLight: undefined,
    spotLight: undefined,
    spotLightHelper: undefined,
    pointLight1: undefined,
    pointLight2: undefined,
    pointLight3: undefined,
    pointLightHelper1: undefined,
    directionalLight: undefined,
    camera: undefined,
    cameraControls: undefined,
    dragControls: undefined,
    axesHelper: undefined,
    clock: undefined,
    stats: undefined,
    gui: undefined,
    animation: { enabled: false, play: false },
    circleMesh: undefined,
    model: undefined,
    moveTouch: { x: 0, y: 0 },
    prevHeight: 0,
    isReady: false
  };

export default store;