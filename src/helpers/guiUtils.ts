import { MeshPhysicalMaterial } from 'three';
import GUI from 'lil-gui'

interface PhysicalMaterialParams {
  attenuationColor: number,
  clearcoatRoughness: number,
  color: number,
  emissive: number,
  fog: boolean;
  metalness: number,
  reflectivity: number,
  opacity: number,
  roughness: number,
  specularColor: number,
  specularIntensity: number,
  thickness: number,
  wireframe: boolean
}


// interface LightParams {
//   color?: number,
//   intensity?: number
// }

// interface PointLightParams extends LightParams {
//   decay?: number,
//   distance?: number,
//   intensity?: number,
//   power?: number
// }

// interface DirectionalLightParams extends LightParams {

// }


type ColorProperty = 'attenuationColor' | 'color' | 'emissive' | 'specularColor';

type NumberProperty = 'clearcoatRoughness' | 'metalness' | 'opacity' | 'roughness' | 'specularIntensity' | 'thickness' | 'reflectivity';

type BooleanProperty = 'fog' | 'wireframe';

function createPhysicalMaterialParams(material: MeshPhysicalMaterial) : PhysicalMaterialParams {
  return {
      attenuationColor: material.attenuationColor.getHex(),
      clearcoatRoughness: material.clearcoatRoughness,
      color: material.color.getHex(),
      emissive: material.emissive.getHex(),
      fog: material.fog,
      metalness: material.metalness,
      reflectivity: material.reflectivity,
      opacity: material.opacity,
      roughness: material.roughness,
      specularColor: material.specularColor.getHex(),
      specularIntensity: material.specularIntensity,
      thickness: material.thickness,
      wireframe: material.wireframe
    }
}

function addMaterialColorToGui(params: PhysicalMaterialParams, property: ColorProperty, gui: GUI, material: MeshPhysicalMaterial){
  gui.addColor(params, property).onChange((color: number) => {
      material[property].setHex(color)
  })
}


function addMaterialNumberToGui(params: PhysicalMaterialParams, property: NumberProperty, gui: GUI, material: MeshPhysicalMaterial, min: number, max: number){
  gui.add( params, property, min, max ).onChange( function ( val: number ) {
      material[property] = val;
  } );
}

function addMaterialBooleanToGui(params: PhysicalMaterialParams, property: BooleanProperty, gui: GUI, material: MeshPhysicalMaterial){
  gui.add( params, property).onChange( function ( val: boolean ) {
      material[property] = val;
  } );
}

export function createPhysicalMaterialGui(folderName: string, material: MeshPhysicalMaterial, gui: GUI){
  const materialFolder = gui.addFolder(folderName);
  const params = createPhysicalMaterialParams(material);

  console.log(material)
  material.depthWrite = true;

  addMaterialColorToGui(params, 'color', materialFolder, material);
  addMaterialColorToGui(params, 'attenuationColor', materialFolder, material);
  addMaterialColorToGui(params, 'emissive', materialFolder, material);
  addMaterialNumberToGui(params, 'clearcoatRoughness', materialFolder, material, 0, 1);
  addMaterialColorToGui(params, 'specularColor', materialFolder, material);
  addMaterialNumberToGui(params, 'specularIntensity', materialFolder, material, 0, 1);
  addMaterialNumberToGui(params, 'specularIntensity', materialFolder, material, 0, 1);
  addMaterialNumberToGui(params, 'opacity', materialFolder, material, 0, 1);
  addMaterialNumberToGui(params, 'metalness', materialFolder, material, 0, 1);
  addMaterialNumberToGui(params, 'reflectivity', materialFolder, material, 0, 1);
  addMaterialBooleanToGui(params, 'fog', materialFolder, material);
  addMaterialNumberToGui(params, 'roughness', materialFolder, material, 0, 1);
  addMaterialNumberToGui(params, 'thickness', materialFolder, material, 0, 400);
  addMaterialBooleanToGui(params, 'wireframe', materialFolder, material);
}