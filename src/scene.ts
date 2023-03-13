import {
  AmbientLight,
  PointLight,
  DirectionalLight,
  Euler,
  Mesh,
  Object3D,
  Quaternion,
  Scene,
  MeshBasicMaterial,
  Vector2,
} from "three";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
// import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

import {
  createCamera,
  createRenderer,
  enableDragToRotate,
  getScrollCallback,
  loadTextureCube,
  loadGLTFModel,
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
bottleName = 'eza_alcoholfree';

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

let composer: EffectComposer;
let renderPass, bloomPass



function addLights(object: Object3D) {
  const ambientLight = new AmbientLight("#aabbdd", 0.35);
  object.add(ambientLight);
  const backLight = new PointLight(0x99ff66, 10, 40);
  backLight.position.set(65, 0, 20);
  object.add(backLight);
  const pointLight = new PointLight(0xffff99, 8, 40);
  pointLight.position.set(45, 30, 5);
  object.add(pointLight);
  var directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024; // default
  directionalLight.shadow.mapSize.height = 1024; // default
  directionalLight.shadow.camera.near = 0.5; // default
  directionalLight.shadow.camera.far = 500; // default
  object.add(directionalLight);

  const lightTargetObject = new Object3D();
  object.add(lightTargetObject);
  directionalLight.target = lightTargetObject;
  directionalLight.position.set(-2000, 1000, -100);
  lightTargetObject.position.set(0, -0, 100);
}

export async function init(): Promise<boolean> {
  if (!container || !canvas || !word1 || !word2) {
    return false;
  }

  const domNodes = { canvas, container, word1, word2 };
  const renderer = createRenderer(canvas);
  const camera = createCamera(canvas);
  const scene = new Scene();

  composer = new EffectComposer(renderer);
  renderPass = new RenderPass(scene, camera);
  bloomPass = new UnrealBloomPass(new Vector2(canvas.clientWidth, canvas.clientHeight), 0.5, 0.7, 0.8);
  bloomPass.renderToScreen = true;
// 
  // filmPass = new FilmPass(0.1,0.008, 648);
  // filmPass.renderToScreen = true;


  composer.addPass(renderPass);
  // composer.addPass(bloomPass);
  // composer.addPass(filmPass);

  observeResize(renderer, camera, bloomPass);



  scene.add(rootObject);

  addLights(rootObject);

  try {
    await Promise.all([
      loadGLTFModel(`${filePath}/glb/${bottleName}.glb`, true),
      loadTextureCube("/wp-content/themes/eza_theme/3d/cubemap/", [
        "px.jpg",
        "nx.jpg",
        "py.jpg",
        "ny.jpg",
        "pz.jpg",
        "nz.jpg",
      ]),
    ]).then(([gltf, textureCube]) => {
      // console.log(drops);

      scene.environment = textureCube;
      container.classList.remove("loading");

      // console.log(gltf);
      // return;

      // const meshes = 

      gltf.scene.traverse((child) => {
        console.log(child.name)
        const mesh = child as Mesh;
        if (mesh.isMesh) {
          // mesh.frustumCulled = false;
          (mesh.material as MeshBasicMaterial).envMap = textureCube;

          // bottleObject.add(mesh);
        }
      });



      bottleObject.add(...gltf.scene.children)

      console.log(bottleObject)

      // scene.add(gltf.scene);

      bottleObject.position.set(0, 0.5, 0);

      bottleObject.castShadow = true;
      bottleObject.receiveShadow = true;

      const scaleFactor = canvas.clientWidth < 1024 ? 1.6 : 2;
      bottleObject.scale.set(scaleFactor, scaleFactor, scaleFactor);

      bottleObject.rotation.set(0, 0, Math.PI / 9);

      // bottleObject.add(gltf.scene);

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
    composer.render();
    // state.store.renderer.render(state.store.scene, state.store.camera);
    windowScroll();
  }
}
