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
        url: '/textures/lager_label-front.png',
        encoding: sRGBEncoding
    },
    {
        url: '/textures/lager_label-front_alpha.png',
        encoding: LinearEncoding
    },
    {
        url: '/textures/lager_label-back.png',
        encoding: sRGBEncoding
    },
    {
        url: '/textures/lager_label-back_alpha.png',
        encoding: LinearEncoding
    }
]

export const createTexturesAndMaterials = async () => {


    const textureMap = await loadTextures(textures);

    const bottleMaterial = new MeshPhysicalMaterial({
        color: 0x13630e,
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

    const bottleInnerMaterial = new MeshPhysicalMaterial({
        color: 0x7cb02a,
        metalness: 0.2,
        roughness: 0.12,
        envMapIntensity: 0,
        opacity: 1,
        transparent: false,
        transmission: 1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        specularColor: new Color(0x2e4633),
        thickness: 500,
    })



    const capMaterial = new MeshStandardMaterial({
        roughness: 0.3,
        metalness: 0.95,
        envMapIntensity: 1,
        // map: textureMap.get("/textures/Clasica_tapa.png")
    })

    const sceneMaterial = new MeshStandardMaterial({
        roughness: 0.4,
        metalness: 0.85,
        envMapIntensity: 1,
        // map: textureMap.get("/textures/Scene_clasica.jpg")
    })

    const labelMaterial = new MeshStandardMaterial({
        roughness: 0.25,
        metalness: 0.9,
        envMapIntensity: 1,
        alphaTest: 0.98,
        side: DoubleSide
    })


    const labelFrontMaterial = labelMaterial.clone();
    labelFrontMaterial.map = textureMap.get("/textures/lager_label-front.png") || null;
    labelFrontMaterial.alphaMap = textureMap.get("/textures/lager_label-front_alpha.png") || null;

    const labelBackMaterial = labelMaterial.clone();
    labelFrontMaterial.map = textureMap.get("/textures/lager_label-back.png") || null;
    labelFrontMaterial.alphaMap = textureMap.get("/textures/lager_label-back.png") || null;


    return {
        materials: {
            bottleMaterial,
            bottleInnerMaterial,
            capMaterial,
            sceneMaterial,
            labelFrontMaterial,
            labelBackMaterial
        },
        textureMap
    }

}




