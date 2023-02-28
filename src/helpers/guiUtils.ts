import { MeshPhysicalMaterial, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import type { BasicMaterialParams,  StandardMaterialParams, PhysicalMaterialParams } from "../types/materials";

import GUI from 'lil-gui'



type ColorPropertyBasic = 'color';

type ColorPropertyStandard = ColorPropertyBasic | 'emissive';

type ColorPropertyPhysical = ColorPropertyStandard | 'attenuationColor' | 'specularColor' ;

type BasicNumberProperty = 'opacity';

type StandardNumberProperty = BasicNumberProperty | 'emissiveIntensity' | 'metalness' | 'roughness';

type PhysicalNumberProperty = StandardNumberProperty | 'clearcoat' | 'clearcoatRoughness' | 'attenuationDistance' | 'reflectivity' | 'transmission' | 'specularIntensity' | 'thickness' | 'ior';



type BasicBooleanProperty = 'wireframe';
type StandardBooleanProperty = BasicBooleanProperty | 'flatShading';

function createPhysicalMaterialParams(material: MeshPhysicalMaterial) : PhysicalMaterialParams {
  return {
      attenuationColor: material.attenuationColor.getHex(),
      attenuationDistance: material.attenuationDistance,
      clearcoat: material.clearcoat,
      clearcoatRoughness: material.clearcoatRoughness,
      color: material.color.getHex(),
      emissive: material.emissive.getHex(),
      emissiveIntensity: material.emissiveIntensity,
      flatShading: material.flatShading,
      ior: material.ior,
      metalness: material.metalness,
      reflectivity: material.reflectivity,
      transmission: material.transmission,
      opacity: material.opacity,
      roughness: material.roughness,
      specularColor: material.specularColor.getHex(),
      specularIntensity: material.specularIntensity,
      thickness: material.thickness,
      wireframe: material.wireframe
    }
}

function createStandardMaterialParams(material: MeshStandardMaterial) : StandardMaterialParams {
  return {
      color: material.color.getHex(),
      emissive: material.emissive.getHex(),
      emissiveIntensity: material.emissiveIntensity,
      flatShading: material.flatShading,
      metalness: material.metalness,
      opacity: material.opacity,
      roughness: material.roughness,
      wireframe: material.wireframe
    }
}


function addStandardMaterialColorToGui(params: StandardMaterialParams, property: ColorPropertyStandard, gui: GUI, material: MeshStandardMaterial){
  gui.addColor(params, property).onChange((color: number) => {
      material[property].setHex(color)
  })
}


function addPhysicalMaterialColorToGui(params: PhysicalMaterialParams, property: ColorPropertyPhysical, gui: GUI, material: MeshPhysicalMaterial){
  gui.addColor(params, property).onChange((color: number) => {
      material[property].setHex(color)
  })
}


function addStandardMaterialNumberToGui(params: StandardMaterialParams, property: StandardNumberProperty, gui: GUI, material: MeshStandardMaterial, min: number, max: number){
  gui.add( params, property, min, max ).onChange( function ( val: number ) {
      material[property] = val;
  } );
}


function addPhysicalMaterialNumberToGui(params: PhysicalMaterialParams, property: PhysicalNumberProperty, gui: GUI, material: MeshPhysicalMaterial, min: number, max: number){
  gui.add( params, property, min, max ).onChange( function ( val: number ) {
      material[property] = val;
  } );
}

function addStandardMaterialBooleanToGui(params: StandardMaterialParams, property: StandardBooleanProperty, gui: GUI, material: MeshStandardMaterial){
  gui.add( params, property).onChange( function ( val: boolean ) {
      material[property] = val;
  } );
}

function addBasicMaterialBooleanToGui(params: BasicMaterialParams | PhysicalMaterialParams, property: BasicBooleanProperty, gui: GUI, material: MeshBasicMaterial | MeshPhysicalMaterial){
  gui.add( params, property).onChange( function ( val: boolean ) {
      material[property] = val;
  } );
}





export function createStandardMaterialGui(folderName: string, material: MeshStandardMaterial, gui: GUI){
  const materialFolder = gui.addFolder(folderName);
  const params = createStandardMaterialParams(material);
  
  //Material params;
  
  addStandardMaterialColorToGui(params, 'color', materialFolder, material);
  addStandardMaterialNumberToGui(params, 'opacity', materialFolder, material, 0, 1);
  addStandardMaterialBooleanToGui(params, 'wireframe', materialFolder, material);
  
  //StandardMaterial params  
  
  addStandardMaterialColorToGui(params, 'emissive', materialFolder, material);
  addStandardMaterialNumberToGui(params, 'emissiveIntensity', materialFolder, material, 0, 1);
  addStandardMaterialBooleanToGui(params, 'flatShading', materialFolder, material);
  addStandardMaterialNumberToGui(params, 'metalness', materialFolder, material, 0, 1);
  addStandardMaterialNumberToGui(params, 'roughness', materialFolder, material, 0, 1);

  return params;
}


export function createPhysicalMaterialGui(folderName: string, material: MeshPhysicalMaterial, gui: GUI){
  const materialFolder = gui.addFolder(folderName);
  const params = createPhysicalMaterialParams(material);

  //Material params;
  addStandardMaterialBooleanToGui(params, 'flatShading', materialFolder, material);
  
  addPhysicalMaterialColorToGui(params, 'color', materialFolder, material);
  addPhysicalMaterialNumberToGui(params, 'opacity', materialFolder, material, 0, 1);
  addBasicMaterialBooleanToGui(params, 'wireframe', materialFolder, material);
  
  //StandardMaterial params  
  addPhysicalMaterialNumberToGui(params, 'ior', materialFolder, material, 1.0, 2.333);
  addPhysicalMaterialColorToGui(params, 'emissive', materialFolder, material);
  addPhysicalMaterialNumberToGui(params, 'emissiveIntensity', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'metalness', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'roughness', materialFolder, material, 0, 1);

  //PhysicalMaterial params
  
  addPhysicalMaterialNumberToGui(params, 'clearcoat', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'clearcoatRoughness', materialFolder, material, 0, 1);
  
  addPhysicalMaterialColorToGui(params, 'attenuationColor', materialFolder, material);
  addPhysicalMaterialNumberToGui(params, 'attenuationDistance', materialFolder, material, 0, 1);
  
  addPhysicalMaterialColorToGui(params, 'specularColor', materialFolder, material);
  addPhysicalMaterialNumberToGui(params, 'specularIntensity', materialFolder, material, 0, 1);
  
  addPhysicalMaterialNumberToGui(params, 'transmission', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'reflectivity', materialFolder, material, 0, 1);
  addPhysicalMaterialNumberToGui(params, 'thickness', materialFolder, material, 0, 400);
  return params;
}
