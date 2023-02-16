import { MeshPhysicalMaterial, MeshBasicMaterial } from 'three';
import GUI from 'lil-gui'

interface PhysicalMaterialParams {
  attenuationColor: number,
  clearcoatRoughness: number,
  color: number,
  emissive: number,
  metalness: number,
  reflectivity: number,
  opacity: number,
  roughness: number,
  specularColor: number,
  specularIntensity: number,
  thickness: number,
  wireframe: boolean
}

type CombineType = 0 | 1 | 2;

interface BasicMaterialParams {
  color: number,
  combine: CombineType,
  reflectivity: number,
  opacity: number,
  wireframe: boolean
}




type ColorPropertyBasic = 'color';

type ColorPropertyPhysical = 'attenuationColor' | ColorPropertyBasic | 'emissive' | 'specularColor' ;

type BasicNumberProperty = 'reflectivity' | 'opacity'

type PhysicalNumberProperty = BasicNumberProperty | 'clearcoatRoughness' | 'metalness' | 'roughness' | 'specularIntensity' | 'thickness';



type BooleanProperty = 'wireframe';

function createPhysicalMaterialParams(material: MeshPhysicalMaterial) : PhysicalMaterialParams {
  return {
      attenuationColor: material.attenuationColor.getHex(),
      clearcoatRoughness: material.clearcoatRoughness,
      color: material.color.getHex(),
      emissive: material.emissive.getHex(),
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

function createBasicMaterialParams(material: MeshBasicMaterial) : BasicMaterialParams {
  return {
    color: material.color.getHex(),
    combine: material.combine as CombineType,
    reflectivity: material.reflectivity,
    opacity: material.opacity,
    wireframe: material.wireframe
  }
}

function addPhysicalMaterialColorToGui(params: PhysicalMaterialParams, property: ColorPropertyPhysical, gui: GUI, material: MeshPhysicalMaterial){
  gui.addColor(params, property).onChange((color: number) => {
      material[property].setHex(color)
  })
}

function addBasicMaterialColorToGui(params: BasicMaterialParams, property: ColorPropertyBasic, gui: GUI, material: MeshBasicMaterial){
  gui.addColor(params, property).onChange((color: number) => {
      material[property].setHex(color)
  })
}


function addPhysicalMaterialNumberToGui(params: PhysicalMaterialParams, property: PhysicalNumberProperty, gui: GUI, material: MeshPhysicalMaterial, min: number, max: number){
  gui.add( params, property, min, max ).onChange( function ( val: number ) {
      material[property] = val;
  } );
}

function addBasicMaterialNumberToGui(params: BasicMaterialParams, property: BasicNumberProperty, gui: GUI, material: MeshBasicMaterial, min: number, max: number){
  gui.add( params, property, min, max ).onChange( function ( val: number ) {
      material[property] = val;
  } );
}



function addMaterialBooleanToGui(params: PhysicalMaterialParams | BasicMaterialParams, property: BooleanProperty, gui: GUI, material: MeshBasicMaterial | MeshPhysicalMaterial){
  gui.add( params, property).onChange( function ( val: boolean ) {
      material[property] = val;
  } );
}

function addBasicMaterialSelectToGui(params:BasicMaterialParams, property: 'combine', gui: GUI, material: MeshBasicMaterial){
  gui.add( params, property, { Multiply: 0, Mix: 1, Add: 2 } ).onChange( function (val: number){
    material[property] = val;
  })
}




export function createPhysicalMaterialGui(folderName: string, material: MeshPhysicalMaterial, gui: GUI){
  const materialFolder = gui.addFolder(folderName);
  const params = createPhysicalMaterialParams(material);
  addPhysicalMaterialColorToGui(params, 'color', materialFolder, material);
  addPhysicalMaterialColorToGui(params, 'attenuationColor', materialFolder, material);
  addPhysicalMaterialColorToGui(params, 'emissive', materialFolder, material);
  addPhysicalMaterialNumberToGui(params, 'clearcoatRoughness', materialFolder, material, 0, 1);
  addPhysicalMaterialColorToGui(params, 'specularColor', materialFolder, material);
  addPhysicalMaterialNumberToGui(params, 'specularIntensity', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'specularIntensity', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'opacity', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'metalness', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'reflectivity', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'roughness', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'thickness', materialFolder, material, 0, 400);
  addMaterialBooleanToGui(params, 'wireframe', materialFolder, material);
  return params;
}

export function createBasicMaterialGui(folderName: string, material: MeshBasicMaterial, gui: GUI){
  const materialFolder = gui.addFolder(folderName);
  const params = createBasicMaterialParams(material);
  addBasicMaterialColorToGui(params, 'color', materialFolder, material);
  addBasicMaterialSelectToGui(params, 'combine', materialFolder, material);
  addBasicMaterialNumberToGui(params, 'opacity', materialFolder, material, 0, 1);
  addBasicMaterialNumberToGui(params, 'reflectivity', materialFolder, material, 0, 1);
  addMaterialBooleanToGui(params, 'wireframe', materialFolder, material);
  return params;
}