import {
  Euler,
  Quaternion,
  Object3D,
  Scene,
  MeshPhysicalMaterial,
  Mesh,
  Clock,
} from "three";

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

import { createCircleMesh, createWordMeshes } from "./helpers/meshes";

import { setupGui } from "./gui";

import state from "./store";

const CONTAINER_ID = "CanvasFrame";
const CANVAS_ID = "scene";

let bottleName = "premiumpilsener";

let initWordAx = 0;
let initWordBx = 0;

const windowScroll = getScrollCallback((currentScroll, previousScroll) => {
  if (state.store) {
    state.store.meshes.wordA.position.x = initWordAx - currentScroll / 50;
    state.store.meshes.wordB.position.x = initWordBx + currentScroll / 50;
    const deltaRot = new Quaternion().setFromEuler(
      new Euler(0, toRadians((currentScroll - previousScroll) * 0.5), 0, "XYZ")
    );

    const bottle = state.store.bottleObject;
    bottle.quaternion.multiplyQuaternions(deltaRot, bottle.quaternion);
  }
});

export function init() {
  const container = document.getElementById(CONTAINER_ID);
  const canvas = document.getElementById(CANVAS_ID);

  if (!container || !canvas) {
    return;
  }

  bottleName = container.dataset.file || "finelager";

  const rootObject = new Object3D();
  const bottleObject = new Object3D();
  const domNodes = { canvas, container };
  const renderer = createRenderer(canvas);
  const camera = createCamera(canvas);
  observeResize(renderer, camera);

  const clock = new Clock();

  const scene = new Scene();

  scene.add(rootObject);

  Promise.all([
    loadGLTFModel(`/glb/${bottleName}.glb`),
    loadFont("/fonts/Silvania_Regular.json"),
    loadEnvMapToScene(`/envmap/studio_country_hall_1k.hdr`, scene, renderer),
  ]).then(([gltf, font]) => {
    container.classList.remove("loading");
    const { circleMesh, circleMaterial } = createCircleMesh();

    const { word1Mesh, word2Mesh, wordMaterial } = createWordMeshes(
      font,
      bottleName
    );

    initWordAx = word1Mesh.position.x;
    initWordBx = word2Mesh.position.x;

    const backgroundObject = new Object3D();
    backgroundObject.add(circleMesh, word1Mesh, word2Mesh);
    backgroundObject.position.y = 0;

    const bottleMesh = gltf.scene.children[0] as Mesh;
    const bottleMaterial = bottleMesh.material as MeshPhysicalMaterial;

    const capMesh = gltf.scene.children[1] as Mesh;
    const capMaterial = capMesh.material as MeshPhysicalMaterial;

    const topLabelMesh = gltf.scene.children[2] as Mesh;
    const topLabelMaterial = topLabelMesh.material as MeshPhysicalMaterial;

    const liquidMesh = gltf.scene.children[3] as Mesh;
    const liquidMaterial = liquidMesh.material as MeshPhysicalMaterial;

    const frontLabelMesh = gltf.scene.children[4] as Mesh;
    const frontLabelMaterial = frontLabelMesh.material as MeshPhysicalMaterial;

    const backLabelMesh = gltf.scene.children[5] as Mesh;
    const backLabelMaterial = backLabelMesh.material as MeshPhysicalMaterial;

    bottleObject.add(
      liquidMesh,
      bottleMesh,
      capMesh,
      topLabelMesh,
      frontLabelMesh,
      backLabelMesh
    );
    bottleObject.position.set(0, 0.5, 0);
    bottleObject.scale.set(2, 2, 2);
    bottleObject.rotation.set(0, 0, Math.PI / 9);

    rootObject.add(backgroundObject);
    rootObject.add(bottleObject);
    rootObject.position.y = 1;

    state.store = {
      rootObject,
      bottleObject,
      materials: {
        word: wordMaterial,
        circle: circleMaterial,
        bottle: bottleMaterial,
        liquid: liquidMaterial,
        frontLabel: frontLabelMaterial,
        backLabel: backLabelMaterial,
        topLabel: topLabelMaterial,
        cap: capMaterial,
      },
      domNodes,
      scene,
      renderer,
      camera,
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
        circle: circleMesh,
        bottle: bottleMesh,
        liquid: liquidMesh,
        topLabel: topLabelMesh,
        frontLabel: frontLabelMesh,
        backLabel: backLabelMesh,
        wordA: word1Mesh,
        wordB: word2Mesh,
      },
      isReady: true,
      clock,
    };
    enableDragToRotate(state.store.domNodes.canvas, state.store.bottleObject);
    setupGui();
  });
}

export function animate() {
  requestAnimationFrame(animate);
  if (state.store) {
    state.store.renderer.render(state.store.scene, state.store.camera);
    windowScroll();
  }
}
