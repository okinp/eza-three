import { Euler, Object3D, Quaternion, Scene } from "three";

import {
  createCamera,
  createRenderer,
  enableDragToRotate,
  getScrollCallback,
  loadGLTFModel,
  loadEnvMapToScene,
  observeResize,
  toRadians,
} from "./helpers";

const containerId = "CanvasFrame";
const canvasId = "scene";

import state from "./store";

const container = document.getElementById(containerId);
const canvas = document.getElementById(canvasId);

const word1 = document.getElementById("js-word1");
const word2 = document.getElementById("js-word2");

const filePath = "/wp-content/themes/eza_theme/3d";

let bottleName = container?.dataset.file ?? "finelager";
bottleName = "eza_alcoholfree";

const envmapName = 'studio_country_hall_1k.hdr';

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

const rootObject = new Object3D();
const bottleObject = new Object3D();

export async function init(): Promise<boolean> {
  if (!container || !canvas || !word1 || !word2) {
    return false;
  }

  const domNodes = { canvas, container, word1, word2 };
  const renderer = createRenderer(canvas);
  const camera = createCamera(canvas);

  const scene = new Scene();

  scene.add(rootObject);

  try {
    await Promise.all([
      loadGLTFModel(`${filePath}/glb/${bottleName}.glb`, true),
      loadEnvMapToScene(`${filePath}/envmap/${envmapName}`, scene, renderer)
    ]).then(([gltf]) => {
      console.log(gltf);

      container.classList.remove("loading");

      bottleObject.add(...gltf.scene.children);

      bottleObject.position.set(0, 0.5, 0);
      bottleObject.scale.set(2, 2, 2);
      bottleObject.rotation.set(0, 0, Math.PI / 9);

      rootObject.add(bottleObject);
      rootObject.position.y = 1;

      state.store = {
        rootObject,
        bottleObject,
        domNodes,
        scene,
        renderer,
        camera,
        isReady: true,
      };

      observeResize(renderer, camera);

      console.log(state.store);

      enableDragToRotate(state.store.domNodes.canvas, state.store.bottleObject);
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
}

export function animate() {
  requestAnimationFrame(animate);
  if (state.store) {
    const { camera, renderer, scene } = state.store;

    renderer.clear();

    renderer.render(scene, camera);
    windowScroll();
  }
}
