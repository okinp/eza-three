import { WebGLRenderer,sRGBEncoding, ACESFilmicToneMapping, PerspectiveCamera, Scene, HalfFloatType, PMREMGenerator } from "three";

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export function createRenderer(canvas: HTMLElement) {
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = sRGBEncoding;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    // renderer.shadowMap.type = PCFSoftShadowMap
    // renderer.toneMapping = ACESFilmicToneMapping;
    renderer.physicallyCorrectLights = true;
    // renderer.toneMappingExposure = 0.2;
  
    // renderer.shadowMap.enabled = true
    return renderer;
  }
  
export  function createCamera(canvas: HTMLElement) {
    const camera = new PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 2000)
    camera.position.z = 15;
    camera.position.y = 1;
    return camera;
}


export async function loadEnvMapToScene(url: string, scene: Scene, renderer: WebGLRenderer ) {
    const envLoader = new RGBELoader();
    envLoader.setDataType(HalfFloatType);
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
  
    const env = await envLoader.loadAsync(url);
    const HDRImap = pmremGenerator.fromEquirectangular(env).texture;

    scene.environment = HDRImap;
    HDRImap.dispose();
    pmremGenerator.dispose();
}