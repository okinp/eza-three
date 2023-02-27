import {
  Euler,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  Quaternion,
  Scene,
} from "three";

import {
  createCamera,
  createInstancedDropletMesh,
  dropletMaterial,
  createRenderer,
  enableDragToRotate,
  getScrollCallback,
  intersectionHelper,
  loadEnvMapToScene,
  loadGLTFModel,
  observeResize,
  toRadians,
} from "./helpers";

const containerId = "CanvasFrame";
const canvasId = "scene";

import { bottleParams } from "./materials";
import { setupGui } from "./gui";

import state from "./store";

const container = document.getElementById(containerId);
const canvas = document.getElementById(canvasId);

const word1 = document.getElementById("js-word1");
const word2 = document.getElementById("js-word2");

const filePath = "/wp-content/themes/eza_theme/3d";
const envmapFilename = "studio_country_hall_1k";

const bottleName = container?.dataset.file ?? "finelager";

const windowScroll = getScrollCallback((currentScroll, previousScroll) => {
  if (state.store) {
    state.store.domNodes.word1.setAttribute(
      "style",
      `transform: translate(${-0.1 * currentScroll - 20}%, -100%)`
    );
    state.store.domNodes.word2.setAttribute(
      "style",
      `transform: translate(${0.1 * currentScroll + 20}%, 0)`
    );

    const deltaRot = new Quaternion().setFromEuler(
      new Euler(0, toRadians((currentScroll - previousScroll) * 0.5), 0, "XYZ")
    );

    const bottle = state.store.bottleObject;
    bottle.quaternion.multiplyQuaternions(deltaRot, bottle.quaternion);
  }
});


const { onPointerMove, raycast } = intersectionHelper();




export async function init(): Promise<boolean> {

  if (!container || !canvas || !word1 || !word2) {
    return false;
  }

  const rootObject = new Object3D();
  const bottleObject = new Object3D();
  const domNodes = { canvas, container, word1, word2 };
  const renderer = createRenderer(canvas);
  const camera = createCamera(canvas);

  observeResize(renderer, camera);

  const scene = new Scene();

  scene.add(rootObject);

  try {
    await Promise.all([
      loadGLTFModel(`${filePath}/glb/${bottleName}.glb`, true),
      loadGLTFModel(`${filePath}/glb/drops.glb`, true),
      loadEnvMapToScene(
        `${filePath}/envmap/${envmapFilename}.hdr`,
        scene,
        renderer
      ),
    ]).then(([gltf, drops]) => {


      container.classList.remove("loading");

      const capMesh = gltf.scene.children[1] as Mesh;
      const kapakiMaterial = capMesh.material as MeshPhysicalMaterial;

      const bottleMesh = gltf.scene.children[0] as Mesh;
      const bottleMaterial = bottleMesh.material as MeshPhysicalMaterial;
      bottleMaterial.map = null;
      bottleMaterial.alphaMap = null;

      const liquidMesh = gltf.scene.children[3] as Mesh;
      const liquidMaterial = liquidMesh.material as MeshPhysicalMaterial;
      liquidMaterial.map = null;
      liquidMaterial.alphaMap = null;

      const topLabelMesh = gltf.scene.children[2] as Mesh;
      const topLabelMaterial = topLabelMesh.material as MeshPhysicalMaterial;

      const frontLabelMesh = gltf.scene.children[4] as Mesh;
      const frontLabelMaterial =
        frontLabelMesh.material as MeshPhysicalMaterial;

      const backLabelMesh = gltf.scene.children[5] as Mesh;
      const backLabelMaterial = backLabelMesh.material as MeshPhysicalMaterial;

      if (bottleName in bottleParams) {
        const params = bottleParams[bottleName as keyof bottleParams];
        bottleMaterial.setValues(params.bottle);
        liquidMaterial.setValues(params.liquid);
        kapakiMaterial.setValues(params.kapaki);
        topLabelMaterial.setValues(params.topLabel);
        frontLabelMaterial.setValues(params.frontLabel);
        backLabelMaterial.setValues(params.backLabel);
      }

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

      rootObject.add(bottleObject);
      rootObject.position.y = 1;

      const xs = drops.scene.children[3] as Mesh;
      const sm = drops.scene.children[4] as Mesh;
      const md = drops.scene.children[5] as Mesh;
      const lg = drops.scene.children[6] as Mesh;
      const xl = drops.scene.children[1] as Mesh;
      const xxl = drops.scene.children[2] as Mesh;
      const xxxl = drops.scene.children[0] as Mesh;

      const xsMesh = createInstancedDropletMesh(xs, 200);
      const smMesh = createInstancedDropletMesh(sm, 400);
      const mdMesh = createInstancedDropletMesh(md, 400);
      const lgMesh = createInstancedDropletMesh(lg, 100);
      const xlMesh = createInstancedDropletMesh(xl, 100);
      const xxlMesh = createInstancedDropletMesh(xxl, 100);
      const xxxlMesh = createInstancedDropletMesh(xxxl, 50);

      bottleObject.add(
        xsMesh.dropletMesh,
        smMesh.dropletMesh,
        mdMesh.dropletMesh,
        lgMesh.dropletMesh,
        xlMesh.dropletMesh,
        xxlMesh.dropletMesh,
        xxxlMesh.dropletMesh
      )

      state.store = {
        rootObject,
        bottleObject,
        materials: {
          bottle: bottleMaterial,
          liquid: liquidMaterial,
          frontLabel: frontLabelMaterial,
          backLabel: backLabelMaterial,
          topLabel: topLabelMaterial,
          cap: kapakiMaterial,
          dropletMaterial
        },
        domNodes,
        scene,
        renderer,
        camera,
        meshes: {
          cap: capMesh,
          bottle: bottleMesh,
          liquid: liquidMesh,
          topLabel: topLabelMesh,
          frontLabel: frontLabelMesh,
          backLabel: backLabelMesh,
        },
        dropletMeshes: {
          xs: xsMesh,
          sm: smMesh,
          md: mdMesh,
          lg: lgMesh,
          xl: xlMesh,
          xxl: xxlMesh,
          xxxl: xxxlMesh
        },
        isReady: true,
      };
      enableDragToRotate(state.store.domNodes.canvas, state.store.bottleObject);
      setupGui();
      console.log(state.store.materials);
    });
  } catch {
    return false;
  }

  return true;
}

export function animate() {
  requestAnimationFrame(animate);
  if (state.store) {
    state.store.renderer.render(state.store.scene, state.store.camera);
    windowScroll();
  }
}
