import {
    Color,
    DoubleSide,
    LinearEncoding,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    sRGBEncoding,
} from "three";

import { loadTextures } from "./loader";


const textures = [
    {
        url: '/textures/water-normals.jpg',
        encoding: LinearEncoding
    },
    {
        url: '/textures/Normal-Botella.png',
        encoding: LinearEncoding
    },
    {
        url: '/textures/Clasica_front.jpg',
        encoding: sRGBEncoding
    },
    {
        url: '/textures/Clasica_front_alpha.png',
        encoding: LinearEncoding
    },
    {
        url: '/textures/Clasica_back.jpg',
        encoding: sRGBEncoding
    },
    {
        url: '/textures/Clasica_back_alpha.png',
        encoding: LinearEncoding
    },
    {
        url: '/textures/Clasica_tapa.png',
        encoding: sRGBEncoding
    },
    {
        url: '/textures/Scene_clasica.jpg',
        encoding: sRGBEncoding
    },
    {
        url: '/textures/Scene_base.jpg',
        encoding: sRGBEncoding
    },
    {
        url: '/textures/disp.jpg',
        encoding: sRGBEncoding
    }
]

export const createTexturesAndMaterials = async () => {


    const textureMap = await loadTextures(textures);

    const bottleMaterial = new MeshPhysicalMaterial({
        color: 0x13630e,
        normalMap: textureMap.get('/textures/Normal-Botella.png'),
        // normalMap: textureMap.get('/textures/water-normals.jpg'),
        metalness: 0,
        roughness: 0.12,
        envMapIntensity: 1.25,
        // opacity: 1,
        // transparent: true,
        transmission: 1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        specularColor: new Color(0x2e4633),
        thickness: 5,
    })



    const capMaterial = new MeshStandardMaterial({
        roughness: 0.3,
        metalness: 0.95,
        envMapIntensity: 1,
        map: textureMap.get("/textures/Clasica_tapa.png")
    })

    const sceneMaterial = new MeshStandardMaterial({
        roughness: 0.4,
        metalness: 0.85,
        envMapIntensity: 1,
        map: textureMap.get("/textures/Scene_clasica.jpg")
    })

    const labelMaterial = new MeshStandardMaterial({
        roughness: 0.25,
        metalness: 0.9,
        envMapIntensity: 1,
        alphaTest: 0.98,
        side: DoubleSide
    })


    const labelFrontMaterial = labelMaterial.clone();
    labelFrontMaterial.map = textureMap.get("/textures/Clasica_front.jpg") || null;
    labelFrontMaterial.alphaMap = textureMap.get("/textures/Clasica_front_alpha.png") || null;

    const labelBackMaterial = labelMaterial.clone();
    labelBackMaterial.map = textureMap.get("/textures/Clasica_back.jpg") || null;
    labelBackMaterial.alphaMap = textureMap.get("/textures/Clasica_back_alpha.png") || null;


    return {
        materials: {
            bottleMaterial,
            capMaterial,
            sceneMaterial,
            labelFrontMaterial,
            labelBackMaterial
        },
        textureMap
    }

}




