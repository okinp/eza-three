import {
  AmbientLight,
  AxesHelper,
  CircleGeometry,
  Clock,
  DirectionalLight,
  DoubleSide,
  Euler,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLightHelper,
  PMREMGenerator,
  PointLight,
  Quaternion,
  Scene,
  WebGLRenderer,
  SpotLight,
  SpotLightHelper,
  MeshPhysicalMaterial,
} from 'three';

import { setupGui } from './gui';

import type { IStore } from "./interfaces";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

// import {
//   EffectComposer, RenderPass, EffectPass,
//   BlendFunction,
//   ToneMappingEffect, ToneMappingMode,
//   NoiseEffect,
//   DepthOfFieldEffect,
//   BloomEffect, KernelSize,
//   // SMAAImageLoader, SMAAEffect, SMAAPreset, EdgeDetectionMode,
// } from "postprocessing"

import { createTexturesAndMaterials } from "./materials"


// import { DragControls } from 'three/examples/jsm/controls/DragControls'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import { observeResize } from './helpers/responsiveness';

const CANVAS_ID = 'scene'

const CONTAINER_ID = "CanvasFrame";


const store: IStore = {
  bottleMaterial: undefined,
  liquidMaterial: undefined,
  container: undefined,
  canvas: undefined,
  renderer: undefined,
  scene: undefined,
  ambientLight: undefined,
  spotLight: undefined,
  spotLightHelper: undefined,
  pointLight1: undefined,
  pointLight2: undefined,
  pointLight3: undefined,
  pointLightHelper1: undefined,
  directionalLight: undefined,
  camera: undefined,
  cameraControls: undefined,
  dragControls: undefined,
  axesHelper: undefined,
  clock: undefined,
  stats: undefined,
  gui: undefined,
  animation: { enabled: false, play: false },
  circleMesh: undefined,
  isDragging: false,
  isScrolling: true,
  previousMousePosition: { x: 0, y: 0 },
  deltaMove: { x: 0, y: 0 },
  model: undefined,
  startTouch: { x: 0, y: 0 },
  moveTouch: { x: 0, y: 0 },
  prevHeight: 0
}

function toRadians(angle: number) {
  return angle * (Math.PI / 180);
}

function performTouchScroll() {
  const currentScroll = window.scrollY;
  const numPixelsToScroll = 2 * (store.startTouch.y - store.moveTouch.y);

  window.scroll({
    top: currentScroll + numPixelsToScroll,
    behavior: "smooth"
  })
}

function windowScroll() {
  // @ts-ignore
  const currentHeight = (luxy.wapperOffset || 0 as number);


  if (store.isScrolling && (Math.abs(currentHeight - store.prevHeight) > 0.5)) {

    const deltaRot = new Quaternion().setFromEuler(
      new Euler(
        0,
        toRadians((currentHeight - store.prevHeight) * 0.5),
        0,
        "XYZ"
      )
    );

    const bottle = store.model as Object3D;
    bottle.quaternion.multiplyQuaternions(deltaRot, bottle.quaternion);
  }

  store.prevHeight = currentHeight;
}

function releaseTouch() {
  const container = store.container as HTMLElement;
  container.style.pointerEvents = "none";
  performTouchScroll();
  container.style.pointerEvents = "initial";
}


function setupEventListeners() {
  const canvas = store.canvas;
  if (!canvas) return;

  canvas.addEventListener("mousedown", () => {
    store.isDragging = true;
    store.isScrolling = false;
  })

  canvas.addEventListener("mousemove", (evt: MouseEvent) => {
    store.deltaMove = {
      x: evt.offsetX - store.previousMousePosition.x,
      y: evt.offsetY - store.previousMousePosition.y
    };

    if (store.isDragging) {
      const deltaRotation = new Quaternion().setFromEuler(
        new Euler(0, toRadians(store.deltaMove.x * 0.5), 0, "XYZ")
      );

      const bottle = store.model as Object3D;

      bottle.quaternion.multiplyQuaternions(deltaRotation, bottle.quaternion);
    }
    store.previousMousePosition = { x: evt.offsetX, y: evt.offsetY }
  });

  canvas.addEventListener("touchstart", (evt: TouchEvent) => {
    store.previousMousePosition = {
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY
    }
    store.isDragging = true;
    store.startTouch = {
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY
    }
  })

  canvas.addEventListener("touchmove", (evt: TouchEvent) => {
    store.deltaMove = {
      x: evt.touches[0].clientX - store.previousMousePosition.x,
      y: evt.touches[0].clientY - store.previousMousePosition.y
    }

    store.moveTouch = {
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY
    }

    if (Math.abs(store.moveTouch.x - store.moveTouch.y) > 50) {
      releaseTouch()
    }

    store.previousMousePosition = {
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY
    }
  })

  window.addEventListener('mouseup', () => {
    store.isDragging = false;
    store.isScrolling = true;
  });

  window.addEventListener("touchend", () => {
    store.previousMousePosition = { ...store.deltaMove };
    store.isDragging = false;

  })
}


function setupRenderer() {
  const canvas = (document.querySelector(`canvas#${CANVAS_ID}`) as HTMLElement);
  if (!canvas) return false;
  store.canvas = canvas;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.toneMapping = ACESFilmicToneMapping;
  // renderer.physicallyCorrectLights = true;
  // renderer.toneMappingExposure = 0.2;

  // renderer.shadowMap.enabled = true

  store.renderer = renderer;
  //console.log(renderer);
  return true;
}

function setupCamera() {
  if (!store.canvas) return;
  const camera = new PerspectiveCamera(45, store.canvas.clientWidth / store.canvas.clientHeight, 1, 2000)
  camera.position.z = 15;
  camera.position.y = 1;

  store.camera = camera;
}

function createCircleMesh() {
  const circleGeometry = new CircleGeometry(8.5, 512);
  const circleMaterial = new MeshBasicMaterial({
    color: 0xffff00,
    opacity: 0.2,
    transparent: true,
    side: DoubleSide,
    depthWrite: false,
  })
  const circleMesh = new Mesh(circleGeometry, circleMaterial);
  circleMesh.position.set(0, 0, -25);
  return circleMesh
}

function setupLights(scene: Scene) {
  const ambientLight = new AmbientLight(0xffffff, 10);
  store.ambientLight = ambientLight;

  const pointLight1 = new PointLight("#ffffff", 1.2, 100);
  pointLight1.position.set(-2, 3, 3);
  pointLight1.castShadow = true
  pointLight1.shadow.radius = 4
  pointLight1.shadow.camera.near = 0.5
  pointLight1.shadow.camera.far = 4000
  pointLight1.shadow.mapSize.width = 2048
  pointLight1.shadow.mapSize.height = 2048
  store.pointLight1 = pointLight1;


  const pointLight2 = new PointLight(0xffffff, 25, 50);
  pointLight2.position.set(-5, -2, -10);
  store.pointLight2 = pointLight2;

  const pointLight3 = new PointLight(0xffffff, 25, 50);
  pointLight3.position.set(0, -5, -5);
  store.pointLight3 = pointLight3;

  const directionalLight = new DirectionalLight(0xffffff, 12);
  directionalLight.position.set(0, 0, 5);
  directionalLight.target.position.set(0, 0, 0);
  store.directionalLight = directionalLight;

  const spotLight = new SpotLight(0xffffff, 5);
  spotLight.position.set(25, 50, 25);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 1;
  spotLight.decay = 2;
  spotLight.distance = 100;
  // spotLight.map = textures[ 'disturb.jpg' ];

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.focus = 1;
  scene.add(spotLight);

  const spotLightHelper = new SpotLightHelper(spotLight);
  spotLightHelper.color = 0x000000;
  scene.add(spotLightHelper);
  store.spotLight = spotLight;
  store.spotLightHelper = spotLightHelper;

  scene.add(pointLight1);
  scene.add(pointLight2);
  scene.add(pointLight3);
  scene.add(directionalLight);
  scene.add(ambientLight);

}


async function loadEnvMap() {
  const envLoader = new RGBELoader();
  envLoader.setDataType(HalfFloatType);
  const pmremGenerator = new PMREMGenerator((store.renderer as WebGLRenderer));
  pmremGenerator.compileEquirectangularShader();

  const env = await envLoader.loadAsync(`/envmap/studio_country_hall_1k.hdr`);
  const HDRImap = pmremGenerator.fromEquirectangular(env).texture;

  return {
    HDRImap, pmremGenerator
  }

  // if (store.scene) {
  //   store.scene.environment = HDRImap;
  //   (store.bottleMaterial as MeshPhysicalMaterial).envMap = HDRImap;
  //   HDRImap.dispose()
  //   pmremGenerator.dispose()
  // }
}

// envLoader
//   .setDataType(HalfFloatType)
//   .load(`/envmap/studio_country_hall_1k.hdr`,
//     (env) => {
//       //console.log(env)
//       pmremGenerator.compileEquirectangularShader()
//       const HDRImap = pmremGenerator.fromEquirectangular(env).texture

//       if (store.scene) {
//         store.scene.environment = HDRImap;
//         (store.bottleMaterial as MeshPhysicalMaterial).envMap = HDRImap;
//         HDRImap.dispose()
//         pmremGenerator.dispose()
//       }
//     },
//     (xhr) => {
//       loadedElements.env = { loaded: xhr.loaded, total: xhr.total }
//     },
//   )
// }

function handleOnLoaded(){
  console.log("loaded")
}

export function init() {

  store.container = document.getElementById(CONTAINER_ID) || undefined;

  const bottleName = store.container?.dataset.type || 'lagernew';
  
  store.scene = new Scene();
  
  const success = setupRenderer();
  
  if (!success) return;
  
  setupLights(store.scene);
  setupCamera();

  const scene = new Scene();
  store.scene = scene;

  store.circleMesh = createCircleMesh();
  store.scene.add(store.circleMesh);

  setupEventListeners();

  if (store.renderer && store.camera) {
    observeResize(store.renderer, store.camera);
  }



  const modelLoader = new GLTFLoader();

  Promise.all([createTexturesAndMaterials(), modelLoader.loadAsync(`/glb/${bottleName}.glb`), loadEnvMap()])
    .then(([{ }, gltf, { pmremGenerator, HDRImap }]) => {
      const container = new Object3D();
      // const model = gltf.scene.children;
      const bottleMesh = gltf.scene.children[0];
      store.bottleMaterial = ((bottleMesh as Mesh).material as MeshPhysicalMaterial);
      console.log(store.bottleMaterial);
      const capMesh = gltf.scene.children[1];
      const labelTopMesh = gltf.scene.children[2];
      const bottleInnerMesh = gltf.scene.children[3];
      store.liquidMaterial = ((bottleInnerMesh as Mesh).material as MeshPhysicalMaterial);
      //console.log(bottleInnerMesh);
      const labelFrontMesh = gltf.scene.children[4];
      const labelBackMesh = gltf.scene.children[5];

      console.log(bottleMesh);
      console.log(bottleInnerMesh);


      // model.traverse(object => {
      //   if (object.type !== 'Mesh') return;
      //   switch (object.name) {
      //     case 'bottle':
      //       (object as Mesh).material = materials.bottleMaterial;
      //       object.renderOrder = 0
      //       break;
      //     case 'bottle-inner':
      //       (object as Mesh).material = materials.bottleInnerMaterial;
      //       object.renderOrder = 1
      //       break;
      //     case 'label-front':
      //       (object as Mesh).material = materials.labelFrontMaterial
      //       object.renderOrder = 3
      //       break;
      //     case 'label-back':
      //       (object as Mesh).material = materials.labelBackMaterial
      //       object.renderOrder = 2
      //       break;
      //     // case 'cap':
      //     //   (object as Mesh).material = materials.capMaterial
      //     //   object.renderOrder = 2
      //     //   break;
      //   }
      // })
      container.add(bottleMesh);
      container.add(capMesh);
      container.add(labelTopMesh);
      container.add(bottleInnerMesh);
      container.add(labelFrontMesh);
      container.add(labelBackMesh);
      container.position.set(0, 0.5, 0);
      container.scale.set(2, 2, 2);
      container.rotation.set(0, 0, Math.PI / 9);
      store.model = container;

      scene.add(container);


      scene.environment = HDRImap;
      (store.bottleMaterial as MeshPhysicalMaterial).envMap = HDRImap;
      HDRImap.dispose()
      pmremGenerator.dispose()
    }).then(handleOnLoaded)
    .then(() => setupGui(store));










  // ===== 🕹️ CONTROLS =====

  // store.cameraControls = new OrbitControls((store.camera as PerspectiveCamera), (store.canvas as HTMLElement));
  // // cameraControls.target = cube.position.clone()
  // store.cameraControls.enableZoom = false;
  // store.cameraControls.enablePan = false;
  // // cameraControls.enableRotate = true;
  // store.cameraControls.enableDamping = true
  // store.cameraControls.autoRotate = false;
  // store.cameraControls.minPolarAngle = Math.PI / 2 ;
  // store.cameraControls.maxPolarAngle = Math.PI / 2 ;
  // store.cameraControls.update();






  // ===== 🪄 HELPERS =====
  {
    store.axesHelper = new AxesHelper(4)
    store.axesHelper.visible = false
    store.scene.add(store.axesHelper)

    const pointLightHelper1 = new PointLightHelper((store.pointLight1 as PointLight), 1);
    pointLightHelper1.visible = true;
    pointLightHelper1.color = 0xff0000;
    store.pointLightHelper1 = pointLightHelper1;
    store.scene.add(store.pointLightHelper1)

  }

  // ===== 📈 STATS & CLOCK =====
  {
    store.clock = new Clock()
    store.stats = Stats()
    document.body.appendChild(store.stats.dom)
  }

  // ==== 🐞 DEBUG GUI ====

  // setupGui(store);

}

export function animate() {
  requestAnimationFrame(animate)

  store?.stats && store.stats.update()

  store?.pointLightHelper1 && store.pointLightHelper1.update();

  // store.cameraControls && store.cameraControls.update()

  if (store.scene && store.camera && store.renderer) {
    store.renderer.render(store.scene, store.camera)
  }

  windowScroll();

}
