import {
  Euler,
  Quaternion,
  Object3D,
  Scene,
  MeshPhysicalMaterial,
  Mesh,
  Clock
} from "three";

// import { LayerMaterial, Color, Depth, Fresnel, Noise } from 'lamina/vanilla'

import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";


import {
  createCamera,
  createRenderer,
  loadFont,
  loadEnvMapToScene,
  loadGLTFModel,
  observeResize,
  enableDragToRotate,
  getScrollCallback,
  toRadians,
} from "./helpers";

// import { createCircleMesh, createWordMeshes } from "./helpers/meshes";


import { setupGui } from "./gui";

import state from "./store";

const containerId = "CanvasFrame";
const canvasId = "scene";

let bottleName = "fine_lager";

// let initWordAx = 0;
// let initWordBx = 0;

const windowScroll = getScrollCallback((currentScroll, previousScroll) => {
  if (state.store) {
    // state.store.meshes.wordA.position.x = initWordAx - (currentScroll / 50);
    // state.store.meshes.wordB.position.x = initWordBx + (currentScroll / 50);

    const deltaRot = new Quaternion().setFromEuler(
      new Euler(0, toRadians((currentScroll - previousScroll) * 0.5), 0, "XYZ")
    );

    const bottle = state.store.bottleObject;
    bottle.quaternion.multiplyQuaternions(deltaRot, bottle.quaternion);
  }
});

export async function init() : Promise<boolean> {
  const container = document.getElementById(containerId);
  const canvas = document.getElementById(canvasId);

  if (!container || !canvas) {
    return false;
  }

  bottleName = container.dataset.file ??  "finelager";
  bottleName = "Lager_GLB_opt";
  bottleName = "premiumpilsener";


  const rootObject = new Object3D();
  const bottleObject = new Object3D();
  const domNodes = { canvas, container };
  const renderer = createRenderer(canvas);
  const camera = createCamera(canvas);
  observeResize(renderer, camera);

  const clock = new Clock();

  const scene = new Scene();

  scene.add(rootObject);

  const filePath = '/wp-content/themes/eza_theme/3d'

  try {
    await Promise.all([
      loadGLTFModel(`${filePath}/glb/${bottleName}.glb`, true),
      loadFont(`${filePath}/fonts/Silvania_Regular.json`),
            loadEnvMapToScene(`${filePath}/envmap/studio_small_08_1k.hdr`, scene, renderer),
    ]).then(([gltf]) => {


      container.classList.remove("loading");

      const capMesh = gltf.scene.children[1] as Mesh;
      const capMaterial = capMesh.material as MeshPhysicalMaterial;
      
      const bottleMesh = gltf.scene.children[0] as Mesh;
      const bottleMaterial = bottleMesh.material as MeshPhysicalMaterial;
      bottleMaterial.map = null;
      bottleMaterial.alphaMap = null;
      bottleMaterial.transmission = 0.164;
      bottleMaterial.opacity = 1;
      bottleMaterial.thickness = 0.12;
      
      const liquidMesh = gltf.scene.children[3] as Mesh;
      const liquidMaterial = liquidMesh.material as MeshPhysicalMaterial;
      liquidMaterial.map = null;
      liquidMaterial.alphaMap = null;
      liquidMaterial.opacity = 1;
      liquidMaterial.thickness = 0.2;
      liquidMaterial.transmission = 0.144;

      const topLabelMesh = gltf.scene.children[2] as Mesh;
      const topLabelMaterial = topLabelMesh.material as MeshPhysicalMaterial;
  
      const frontLabelMesh = gltf.scene.children[4] as Mesh;
      const frontLabelMaterial = frontLabelMesh.material as MeshPhysicalMaterial;
  
      const backLabelMesh = gltf.scene.children[5] as Mesh;
      const backLabelMaterial = backLabelMesh.material as MeshPhysicalMaterial;


      //const { dropletMesh, sample } = createInstancedDroplets(waterDropletMesh, bottleMesh);
      //sample();
      //const bottleAndDrops = new Object3D();
      //bottleAndDrops.add(bottleMesh, dropletMesh);
      //console.log(dropletMesh.material);
      //const dropletMaterial = dropletMesh.material as MeshPhysicalMaterial;

      // bottleMesh.scale.set(0.5,0.5,0.5);
      bottleObject.add(
        liquidMesh,
        bottleMesh,
        //waterMesh,
        capMesh,
        topLabelMesh,
        frontLabelMesh,
        backLabelMesh,
        // waterDropletMesh
      );
      bottleObject.position.set(0, 0.5, 0);
      bottleObject.scale.set(2,2,2);
      bottleObject.rotation.set(0, 0, Math.PI / 9);
  
      // rootObject.add(backgroundObject);
      rootObject.add(bottleObject);
      rootObject.position.y = 1;
  
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new EffectPass(camera, new BloomEffect()));

      state.store = {
        rootObject,
        bottleObject,
        materials: {
          bottle: bottleMaterial,
          liquid: liquidMaterial,
          frontLabel: frontLabelMaterial,
          backLabel: backLabelMaterial,
          topLabel: topLabelMaterial,
          cap: capMaterial
        },
        domNodes,
        scene,
        renderer,
        camera,
        composer,
        lights: {
          ambient: undefined,
          point: [],
          spot: [],
          directional: [],
        },
        lightHelpers: {
          spot: [],
          point: [],
          directional: [],
        },
        meshes: {
          cap: capMesh,
          bottle: bottleMesh,
          liquid: liquidMesh,
          topLabel: topLabelMesh,
          frontLabel: frontLabelMesh,
          backLabel: backLabelMesh,
        },
        isReady: true,
        clock,
      };
      enableDragToRotate(state.store.domNodes.canvas, state.store.bottleObject);
      setupGui();
      console.log(state.store.materials)
    })
  } catch {
    return false;
  }

  return true;
}



export function animate() {
  requestAnimationFrame(animate);
  if (state.store) {
    // state.store.renderer.render(state.store.scene, state.store.camera);
    state.store.composer.render();
    windowScroll();
  }
}
