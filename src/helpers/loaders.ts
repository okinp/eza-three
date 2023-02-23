import { HalfFloatType, PMREMGenerator, Scene, Texture, TextureEncoding, TextureLoader, WebGLRenderer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

interface TextureParamsType {
  url: string;
  encoding: TextureEncoding;
}

export async function loadTexture(url: string) {
  const textureLoader = new TextureLoader();
  return await textureLoader.loadAsync(url);
}

export async function loadTextures(textureParams: TextureParamsType[]) {
    
  const textureLoader = new TextureLoader();

  const textureObjects = await Promise.all(
    textureParams.map(async ({ url, encoding }) => {
      const texture = await textureLoader.loadAsync(url);
      texture.encoding = encoding;
      texture.flipY = false;
      texture.premultiplyAlpha = false;
      texture.needsUpdate = true;
      return { url, texture };
    })
  );

  return textureObjects.reduce((acc, { url, texture }) => {
    acc.set(url, texture);
    return acc;
  }, new Map<string, Texture>());
}

export async function loadGLTFModel(url: string, useDraco: boolean = false) {
  
  const gltfLoader = new GLTFLoader();
  if (useDraco){
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    gltfLoader.setDRACOLoader(dracoLoader);
  }
  return await gltfLoader.loadAsync(url);
}

export async function loadFont(url: string) {
  const fontLoader = new FontLoader();
  return await fontLoader.loadAsync(url);
}

export async function loadEnvMapToScene(
  url: string,
  scene: Scene,
  renderer: WebGLRenderer
) {
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