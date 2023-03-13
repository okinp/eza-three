import {
  ACESFilmicToneMapping,
  ColorManagement,
  PCFSoftShadowMap,
  PerspectiveCamera,
  sRGBEncoding,
  WebGLRenderer,
} from "three";


export function createRenderer(canvas: HTMLElement) {
  ColorManagement.enabled = true;
  ColorManagement.legacyMode = false;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.6;
  return renderer;
}

export function createCamera(canvas: HTMLElement) {
  const camera = new PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    1,
    2000
  );
  camera.position.z = 15;
  camera.position.y = 1;
  return camera;
}


