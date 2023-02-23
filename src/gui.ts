import GUI from 'lil-gui'
import { createPhysicalMaterialGui } from './helpers';
import state from "./store";


export function setupGui( ){

    if (!state.store){
      return;
    }

    const gui = new GUI({ title: '🐞 Debug GUI', width: 400 });
    
    console.log(state.store.materials);

    const bottleParams = createPhysicalMaterialGui('BottleMaterial', state.store.materials.bottle, gui)
    const liquidParams = createPhysicalMaterialGui('LiquidMaterial', state.store.materials.liquid, gui);
    const kapakiParams = createPhysicalMaterialGui('KapakiMaterial', state.store.materials.cap, gui);
    const topLabelParams = createPhysicalMaterialGui('TopLabel', state.store.materials.topLabel, gui);
    const frontLabelParams = createPhysicalMaterialGui('FrontLabel', state.store.materials.frontLabel, gui);
    const backLabelParams = createPhysicalMaterialGui('BackLabel', state.store.materials.backLabel, gui);
    
    let preset = {}
    
    const params = {
      bottle: bottleParams,
      liquid: liquidParams,
      kapaki: kapakiParams,
      topLabel: topLabelParams,
      frontLabel: frontLabelParams,
      backLabel: backLabelParams,
      savePreset(){
        preset = gui.save();
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(preset));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download",  "materials.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    }
    gui.add(params, 'savePreset');

    return {gui, params};
}