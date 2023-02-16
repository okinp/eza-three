import GUI from 'lil-gui'
import { createPhysicalMaterialGui, createBasicMaterialGui } from './helpers';
import state from "./store";


export function setupGui( ){

    if (!state.store){
      return;
    }

    const gui = new GUI({ title: '🐞 Debug GUI', width: 400 });
    
    
    createPhysicalMaterialGui('Bottle Material', state.store.materials.bottle, gui)
    createPhysicalMaterialGui('Liquid Material', state.store.materials.liquid, gui);
    createPhysicalMaterialGui('Kapaki Material', state.store.materials.cap, gui);
    createPhysicalMaterialGui('Top Label', state.store.materials.topLabel, gui);
    createPhysicalMaterialGui('Front Label', state.store.materials.frontLabel, gui);
    createPhysicalMaterialGui('Back Label', state.store.materials.backLabel, gui);
    createBasicMaterialGui('Words', state.store.materials.word, gui);
    createBasicMaterialGui('Circle', state.store.materials.circle, gui);
    return gui;
}