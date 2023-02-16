//@ts-nocheck
import GUI from 'lil-gui'
import { MeshPhysicalMaterial } from 'three';
import store from "./store";




export function setupGui( ){

    const gui = new GUI({ title: '🐞 Debug GUI', width: 400 });
    
    


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