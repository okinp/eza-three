import { PhysicalMaterialParams } from "./types/materials";

export interface bottleParams {
  finelager: {
    bottle: PhysicalMaterialParams,
    liquid: PhysicalMaterialParams,
    kapaki: PhysicalMaterialParams,
    topLabel: PhysicalMaterialParams,
    frontLabel: PhysicalMaterialParams,
    backLabel: PhysicalMaterialParams,
  },
  alcoholfree: {
    bottle: PhysicalMaterialParams,
    liquid: PhysicalMaterialParams,
    kapaki: PhysicalMaterialParams,
    topLabel: PhysicalMaterialParams,
    frontLabel: PhysicalMaterialParams,
    backLabel: PhysicalMaterialParams,
  },
  premiumpilsener: {
    bottle: PhysicalMaterialParams,
    liquid: PhysicalMaterialParams,
    kapaki: PhysicalMaterialParams,
    topLabel: PhysicalMaterialParams,
    frontLabel: PhysicalMaterialParams,
    backLabel: PhysicalMaterialParams,
  }
}

export const bottleParams: bottleParams = {
  finelager: {
    bottle: {
        "flatShading": false,
        "color": 0x2f5f07,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.45,
        "emissive": 0x000000,
        "emissiveIntensity": 1,
        "metalness": 1,
        "roughness": 0.45,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0.01,
        "reflectivity": 0.263,
        "thickness": 0.12
    },
    liquid: {
        "flatShading": false,
        "color": 0x5f9d01,
        "opacity": 1,
        "wireframe": false,
        "ior": 2.333,
        "emissive": 0x000000,
        "emissiveIntensity": 1,
        "metalness": 0.362,
        "roughness": 0.574,
        "clearcoat": 0,
        "clearcoatRoughness": 1,
        "attenuationColor": 0x000000,
        "attenuationDistance": 1,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0.316,
        "reflectivity": 0,
        "thickness": 22.4
    },
    kapaki: {
        "flatShading": false,
        "color": 0x031054,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.45,
        "emissive": 0x27283a,
        "emissiveIntensity": 1,
        "metalness": 0.699999988079071,
        "roughness": 0.24090899527072906,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0xfefefe,
        "attenuationDistance": 0,
        "specularColor": 0xffffff,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.4591837131892669,
        "thickness": 0
    },
    topLabel: {
        "flatShading": false,
        "color": 0xd4d4d4,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.4500000476837158,
        "emissive": 0x27283a,
        "emissiveIntensity": 1,
        "metalness": 0.46,
        "roughness": 0.4,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.435,
        "thickness": 0
    },
    frontLabel: {
        "flatShading": false,
        "color": 0xd4d4d4,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.4500000476837158,
        "emissive": 0x27283a,
        "emissiveIntensity": 1,
        "metalness": 0.461,
        "roughness": 0.409,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.435,
        "thickness": 0
    },
    backLabel: {
        "flatShading": false,
        "color": 0xd4d4d4,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.4500000476837158,
        "emissive": 0x27283a,
        "emissiveIntensity": 1,
        "metalness": 0.461,
        "roughness": 0.409,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.435,
        "thickness": 0
    }
  },
  alcoholfree: {
    bottle: {
        "flatShading": false,
        "color": 0x2f5f07,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.45,
        "emissive": 0x000000,
        "emissiveIntensity": 1,
        "metalness": 1,
        "roughness": 0.45,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0.01,
        "reflectivity": 0.263,
        "thickness": 0.12
    },
    liquid: {
        "flatShading": false,
        "color": 0x81c21e,
        "opacity": 1,
        "wireframe": false,
        "ior": 2.33,
        "emissive": 0x000000,
        "emissiveIntensity": 1,
        "metalness": 0.362,
        "roughness": 0.574,
        "clearcoat": 0,
        "clearcoatRoughness": 1,
        "attenuationColor": 0x000000,
        "attenuationDistance": 1,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0.316,
        "reflectivity": 0,
        "thickness": 22.4
    },
    kapaki: {
        "flatShading": false,
        "color": 0x158999,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.45,
        "emissive": 0x025064,
        "emissiveIntensity": 1,
        "metalness": 0.699999988079071,
        "roughness": 0.24090899527072906,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0xfefefe,
        "attenuationDistance": 0,
        "specularColor": 0xffffff,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.4591837131892669,
        "thickness": 0
    },
    topLabel: {
        "flatShading": false,
        "color": 0xd4d4d4,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.4500000476837158,
        "emissive": 0x3c3c3c,
        "emissiveIntensity": 1,
        "metalness": 0.46,
        "roughness": 0.4,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.435,
        "thickness": 0
    },
    frontLabel: {
        "flatShading": false,
        "color": 0xd4d4d4,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.4500000476837158,
        "emissive": 0x3c3c3c,
        "emissiveIntensity": 1,
        "metalness": 0.46,
        "roughness": 0.4,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.435,
        "thickness": 0
    },
    backLabel: {
        "flatShading": false,
        "color": 0xd4d4d4,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.4500000476837158,
        "emissive": 0x3c3c3c,
        "emissiveIntensity": 1,
        "metalness": 0.46,
        "roughness": 0.4,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.435,
        "thickness": 0
    }
  },
  premiumpilsener: {
    bottle: {
        "flatShading": false,
        "color": 0x492903,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.4500000476837158,
        "emissive": 0x000000,
        "emissiveIntensity": 1,
        "metalness": 1,
        "roughness": 0.45,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0.01,
        "reflectivity": 0.263,
        "thickness": 0.12
    },
    liquid: {
        "flatShading": false,
        "color": 0xb16802,
        "opacity": 1,
        "wireframe": false,
        "ior": 2.33,
        "emissive": 0x000000,
        "emissiveIntensity": 1,
        "metalness": 0.362,
        "roughness": 0.574,
        "clearcoat": 0,
        "clearcoatRoughness": 1,
        "attenuationColor": 0x000000,
        "attenuationDistance": 1,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0.316,
        "reflectivity": 0,
        "thickness": 22.4
    },
    kapaki: {
        "flatShading": false,
        "color": 0xb87f05,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.4500000476837158,
        "emissive": 0x444444,
        "emissiveIntensity": 1,
        "metalness": 0.699999988079071,
        "roughness": 0.24090899527072906,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0xfefefe,
        "attenuationDistance": 0,
        "specularColor": 0xffffff,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.4591837131892669,
        "thickness": 0
    },
    topLabel: {
        "flatShading": false,
        "color": 0xd4d4d4,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.45,
        "emissive": 0x201b0e,
        "emissiveIntensity": 1,
        "metalness": 0.461,
        "roughness": 0.409,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.435,
        "thickness": 0
    },
    frontLabel: {
        "flatShading": false,
        "color": 0xd4d4d4,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.45,
        "emissive": 0x201b0e,
        "emissiveIntensity": 1,
        "metalness": 0.461,
        "roughness": 0.409,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.435,
        "thickness": 0
    },
    backLabel: {
        "flatShading": false,
        "color": 0xd4d4d4,
        "opacity": 1,
        "wireframe": false,
        "ior": 1.45,
        "emissive": 0x201b0e,
        "emissiveIntensity": 1,
        "metalness": 0.461,
        "roughness": 0.409,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "attenuationColor": 0x000000,
        "attenuationDistance": 0,
        "specularColor": 0x000000,
        "specularIntensity": 1,
        "transmission": 0,
        "reflectivity": 0.435,
        "thickness": 0
    }
  }
}
