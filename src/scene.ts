import {
  AmbientLight,
  PointLight,
  DirectionalLight,
  Euler,
  Mesh,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Object3D,
  Quaternion,
  Scene,
  MeshBasicMaterial,
} from "three";

import {
  createCamera,
  dropletMaterial,
  createRenderer,
  enableDragToRotate,
  getScrollCallback,
  loadEnvMapToScene,
  loadTextureCube,
  loadGLTFModel,
  observeResize,
  toRadians,
} from "./helpers";

const containerId = "CanvasFrame";
const canvasId = "scene";

// import { bottleParams } from "./materials";
// import { setupGui } from "./gui";

// const arrowHelper = new ArrowHelper(
//   new Vector3(),
//   new Vector3(),
//   0.25,
//   0xffff00
// )

import state from "./store";

const container = document.getElementById(containerId);
const canvas = document.getElementById(canvasId);

const word1 = document.getElementById("js-word1");
const word2 = document.getElementById("js-word2");

const filePath = "/wp-content/themes/eza_theme/3d";
// const envmapFilename = "studio_country_hall_1k";

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

// const { onPointerMove, raycast } = intersectionHelper();

// if (canvas){
//   canvas.addEventListener("mousemove", onPointerMove);
// }

const rootObject = new Object3D();
const bottleObject = new Object3D();

// const intersectionData = {
//   position: new Vector3(),
//   normal: new Vector3(),
//   isIntersecting: false
// };

// const intersectCb = (intersection: Intersection<Object3D<ThreeEvent>> | null) => {
//   if (intersection){
//     const n = new Vector3();
//     const objectNorm = (intersection.face as Face).normal;
//     n.copy(objectNorm);
//     intersectionData.normal.copy(objectNorm);
//     n.transformDirection(intersection.object.matrixWorld)

//     arrowHelper.setDirection(n);
//     arrowHelper.setColor(0x0000ff);
//     arrowHelper.setLength(1.3)
//     const objectPos = bottleObject.worldToLocal(intersection.point);
//     arrowHelper.position.copy(objectPos);
//     intersectionData.position.copy(objectPos);
//     arrowHelper.visible = true;
//     intersectionData.isIntersecting = true;
//   } else {
//     arrowHelper.visible = false;
//     intersectionData.isIntersecting = false;
//   }
// }

function addLights(scene: Scene) {
  const ambientLight = new AmbientLight("#aabbdd", 0.35);
  scene.add(ambientLight);
  const backLight = new PointLight(0x99ff66, 10, 40);
  backLight.position.set(65, 0, 20);
  scene.add(backLight);
  const pointLight = new PointLight(0xffff99, 8, 40);
  pointLight.position.set(45, 30, 5);
  scene.add(pointLight);
  var directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024; // default
  directionalLight.shadow.mapSize.height = 1024; // default
  directionalLight.shadow.camera.near = 0.5; // default
  directionalLight.shadow.camera.far = 500; // default
  scene.add(directionalLight);

  const lightTargetObject = new Object3D();
  scene.add(lightTargetObject);
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

  observeResize(renderer, camera);

  const scene = new Scene();

  scene.add(rootObject);

  addLights(scene);

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
        const mesh = child as Mesh;
        if (mesh.isMesh) {
          mesh.frustumCulled = false;
          (mesh.material as MeshBasicMaterial).envMap = textureCube;
          // bottleObject.add(mesh);
        }
      });

      bottleObject.add(...gltf.scene.children)

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
    state.store.renderer.render(state.store.scene, state.store.camera);
    windowScroll();
  }
}
