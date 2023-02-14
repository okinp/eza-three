import { Texture, TextureEncoding, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

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

export async function loadGLTFModel(url: string) {
  const gltfLoader = new GLTFLoader();
  return await gltfLoader.loadAsync(url);
}

export async function loadFont(url: string) {
  const fontLoader = new FontLoader();
  return await fontLoader.loadAsync(url);
}
