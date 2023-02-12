import {
    Texture,
    TextureEncoding,
    TextureLoader
} from "three"

interface ITextureParams {
    url: string,
    encoding: TextureEncoding;
}


export async function loadTextures(textureParams: ITextureParams[]) {

    const textureLoader = new TextureLoader();
    const textureStore = new Map<string, Texture>();
    const textures = await Promise.all(textureParams.map(({ url }) => textureLoader.loadAsync(url)));

    textures.forEach((tex, idx) => {
        tex.encoding = textureParams[idx].encoding;
        tex.flipY = false;
        tex.premultiplyAlpha = false;
        tex.needsUpdate = true;
        textureStore.set(textureParams[idx].url, tex);
    })

    return textureStore;
}