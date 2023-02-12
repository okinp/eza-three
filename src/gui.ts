import GUI from 'lil-gui'
import { MeshPhysicalMaterial, PointLight, SpotLight } from 'three';
import type { IStore } from "./interfaces"; 
// import { Color } from "three";

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


function createPhysicalMaterialParams(material: MeshPhysicalMaterial){
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

type ColorProperty = 'attenuationColor' | 'color' | 'emissive' | 'specularColor';

type NumberProperty = 'clearcoatRoughness' | 'metalness' | 'opacity' | 'roughness' | 'specularIntensity' | 'thickness' | 'reflectivity';

type BooleanProperty = 'fog' | 'wireframe';

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








function createPhysicalMaterialGui(folderName: string, material: MeshPhysicalMaterial, gui: GUI){
    const materialFolder = gui.addFolder(folderName);
    const params = createPhysicalMaterialParams(material);

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

export function setupGui(store: IStore ){
    return;

    const gui = new GUI({ title: '🐞 Debug GUI', width: 400 });
    
    
    const lightsFolder = gui.addFolder('Lights');

    const pointLight1 = store.pointLight1 as PointLight;

    lightsFolder.add(pointLight1, 'visible').name('point light 1');
    lightsFolder.add(pointLight1, 'distance', 0, 100, 0.01)
    lightsFolder.add(pointLight1, 'decay', 0, 4, 0.1)
    lightsFolder.add(pointLight1.position, 'x', -50, 50, 0.01)
    lightsFolder.add(pointLight1.position, 'y', -50, 50, 0.01)
    lightsFolder.add(pointLight1.position, 'z', -50, 50, 0.01)
    lightsFolder.add(pointLight1, 'color', -50, 50, 0.01);


    const spotLight = store.spotLight as SpotLight;

    const spotLightParams = {
      color: spotLight.color.getHex(),
      intensity: spotLight.intensity,
      distance: spotLight.distance,
      angle: spotLight.angle,
      penumbra: spotLight.penumbra,
      decay: spotLight.decay,
      focus: spotLight.shadow.focus,
      shadows: true
    }


    // gui.addColor( spotLightParams, 'color' ).onChange( function ( val: number ) {

    //   spotLight.color.setHex( val );

    // } );

    // gui.add( spotLightParams, 'intensity', 0, 10 ).onChange( function ( val: number ) {

    //   spotLight.intensity = val;

    // } );


    // gui.add( spotLightParams, 'distance', 50, 200 ).onChange( function ( val: number ) {

    //   spotLight.distance = val;

    // } );

    // gui.add( spotLightParams, 'angle', 0, Math.PI / 3 ).onChange( function ( val: number ) {

    //   spotLight.angle = val;

    // } );

    // gui.add( spotLightParams, 'penumbra', 0, 1 ).onChange( function ( val: number ) {

    //   spotLight.penumbra = val;

    // } );

    // gui.add( spotLightParams, 'decay', 1, 2 ).onChange( function ( val: number ) {

    //   spotLight.decay = val;

    // } );

    // gui.add( spotLightParams, 'focus', 0, 1 ).onChange( function ( val: number ) {

    //   spotLight.shadow.focus = val;

    // } );



    const bottleMaterial = store.bottleMaterial as MeshPhysicalMaterial;

    createPhysicalMaterialGui('Bottle Material', bottleMaterial, gui);

    const liquidMaterial = store.liquidMaterial as MeshPhysicalMaterial;

    createPhysicalMaterialGui('Liquid Material', liquidMaterial, gui);

    // const bottleMaterialParams =  createPhysicalMaterialParams(bottleMaterial);


    // lightsFolder.add((store.pointLight1 as PointLight), 'color', 1,1,1).onChange((col: any) => {
    //   //console.log(col);
    // })

    // lightsFolder.add((store.ambientLight as AmbientLight), 'visible').name('ambient light')


    // // persist GUI state in local storage on changes
    // store.gui.onFinishChange(() => {
    //   const guiState = (store.gui as GUI).save()
    //   localStorage.setItem('guiState', JSON.stringify(guiState))
    // })

    // // load GUI state if available in local storage
    // const guiState = localStorage.getItem('guiState')
    // if (guiState) store.gui.load(JSON.parse(guiState))

    // // reset GUI state button
    // const resetGui = () => {
    //   localStorage.removeItem('guiState')
    //   store.gui?.reset()
    // }
    // store.gui.add({ resetGui }, 'resetGui').name('RESET')

    // store.gui.close()
    return gui;
}