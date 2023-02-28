
export interface MaterialParams {
  color: number,
  opacity: number,
  wireframe: boolean
}

type CombineType = 0 | 1 | 2;

export interface BasicMaterialParams extends MaterialParams {
  combine: CombineType,
  reflectivity: number
}


export interface StandardMaterialParams extends MaterialParams {
  emissive: number,
  emissiveIntensity: number,
  flatShading: boolean,
  metalness: number,
  roughness: number,
}

export interface PhysicalMaterialParams extends StandardMaterialParams {
  ior: number,
  clearcoat: number,
  clearcoatRoughness: number,
  attenuationColor: number,
  attenuationDistance: number | null,
  reflectivity: number,
  transmission: number,
  specularColor: number,
  specularIntensity: number,
  thickness: number,
}

