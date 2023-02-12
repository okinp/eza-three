import GUI from 'lil-gui'
import {
  AmbientLight,
  AxesHelper,
  CircleGeometry,
  Clock,
  DoubleSide,
  Euler,
  HalfFloatType,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  PointLightHelper,
  Quaternion,
  Scene,
  WebGLRenderer
} from 'three'



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


import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import { observeResize } from './helpers/responsiveness';

const CANVAS_ID = 'scene'

const CONTAINER_ID = "CanvasFrame";

interface IScreenCoordinate {
  x: number,
  y: number
}

interface IStore {
  container: HTMLElement | undefined,
  canvas: HTMLElement | undefined,
  renderer: WebGLRenderer | undefined,
  scene: Scene | undefined,
  ambientLight: AmbientLight | undefined,
  pointLight: PointLight | undefined,
  camera: PerspectiveCamera | undefined,
  cameraControls: OrbitControls | undefined,
  dragControls: DragControls | undefined,
  axesHelper: AxesHelper | undefined,
  pointLightHelper: PointLightHelper | undefined,
  clock: Clock | undefined,
  stats: Stats | undefined,
  gui: GUI | undefined,
  animation: { enabled: boolean, play: boolean },
  circleMesh: Mesh | undefined,
  isDragging: boolean,
  isScrolling: boolean,
  previousMousePosition: IScreenCoordinate,
  deltaMove: IScreenCoordinate,
  model: Object3D | undefined,
  startTouch: IScreenCoordinate,
  moveTouch: IScreenCoordinate,
  prevHeight: number
}

const store: IStore = {
  container: undefined,
  canvas: undefined,
  renderer: undefined,
  scene: undefined,
  ambientLight: undefined,
  pointLight: undefined,
  camera: undefined,
  cameraControls: undefined,
  dragControls: undefined,
  axesHelper: undefined,
  pointLightHelper: undefined,
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
  moveTouch: { x: 0, y: 0},
  prevHeight: 0
}

function toRadians(angle: number) {
  return angle * (Math.PI / 180);
}

function performTouchScroll(){
  const currentScroll = window.scrollY;
  const numPixelsToScroll = 2*(store.startTouch.y - store.moveTouch.y);

  window.scroll({
    top: currentScroll + numPixelsToScroll,
    behavior: "smooth"
  })
}

function windowScroll(){
  // @ts-ignore
  const currentHeight = (luxy.wapperOffset || 0 as number);

  //Text things go here
  
  
  //


  if (store.isScrolling && (currentHeight !== store.prevHeight) ){
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

    if (Math.abs(store.moveTouch.x - store.moveTouch.y) > 50){
      releaseTouch()
    }

    store.previousMousePosition = {
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY
    }
  })

  document.addEventListener('mouseup', () => {
    store.isDragging = false;
    store.isScrolling = true;
  });

  document.addEventListener("touchend", () => {
    store.previousMousePosition = { ...store.deltaMove };
    store.isDragging = false;

  })
}






function setupRenderer() {
  const canvas = (document.querySelector(`canvas#${CANVAS_ID}`) as HTMLElement);
  if (!canvas) return false;
  store.canvas = canvas;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap;
  store.renderer = renderer;
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
  const ambientLight = new AmbientLight('white', 0.4);
  const pointLight = new PointLight('#ffdca8', 1.2, 100);
  pointLight.position.set(-2, 3, 3);
  pointLight.castShadow = true;
  pointLight.shadow.radius = 4;
  pointLight.shadow.camera.near = 0.5;
  pointLight.shadow.camera.far = 4000;
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;;
  scene.add(ambientLight);
  scene.add(pointLight);
  store.ambientLight = ambientLight;
  store.pointLight = pointLight
}

export function init() {
  store.container = document.getElementById(CONTAINER_ID) || undefined;
  store.scene = new Scene();
  const success = setupRenderer();
  if (!success) return;
  setupLights(store.scene);
  setupCamera();


  store.scene = new Scene();

  store.circleMesh = createCircleMesh();
  store.scene.add(store.circleMesh);

  setupEventListeners();

  if (store.renderer && store.camera) {
    observeResize(store.renderer, store.camera);
  }







  const InitialLoadData = {
    loaded: 0,
    total: 0
  }


  const loadedElements = {
    env: InitialLoadData,
    glb_botella: InitialLoadData
  }



  const modelLoader = new GLTFLoader();


  Promise.all([createTexturesAndMaterials(), modelLoader.loadAsync('/glb/lagernew.glb')])
    .then(([{ }, gltf]) => {
      console.log(gltf);
      const container = new Object3D();
      // const model = gltf.scene.children;
      const bottleMesh = gltf.scene.children[0];
      const capMesh = gltf.scene.children[1];
      const labelTopMesh = gltf.scene.children[2];
      const bottleInnerMesh = gltf.scene.children[3];
      console.log(bottleInnerMesh);
      const labelFrontMesh = gltf.scene.children[4];
      const labelBackMesh = gltf.scene.children[5];


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

      store.scene && store.scene.add(container)
    })




  const envLoader = new RGBELoader();
  const pmremGenerator = new PMREMGenerator((store.renderer as WebGLRenderer));



  envLoader
    .setDataType(HalfFloatType)
    .load(`/envmap/studio_country_hall_1k.hdr`,
      (env) => {
        console.log(env)
        pmremGenerator.compileEquirectangularShader()
        const HDRImap = pmremGenerator.fromEquirectangular(env).texture

        if (store.scene) {
          store.scene.environment = HDRImap
          HDRImap.dispose()
          pmremGenerator.dispose()
        }
      },
      (xhr) => {
        loadedElements.env = { loaded: xhr.loaded, total: xhr.total }
      },
    )





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

    store.pointLightHelper = new PointLightHelper((store.pointLight as PointLight), undefined, 'orange')
    store.pointLightHelper.visible = false
    store.scene.add(store.pointLightHelper)

  }

  // ===== 📈 STATS & CLOCK =====
  {
    store.clock = new Clock()
    store.stats = Stats()
    document.body.appendChild(store.stats.dom)
  }

  // ==== 🐞 DEBUG GUI ====
  {
    store.gui = new GUI({ title: '🐞 Debug GUI', width: 300 })

    const lightsFolder = store.gui.addFolder('Lights')
    lightsFolder.add((store.pointLight as PointLight), 'visible').name('point light')
    lightsFolder.add((store.ambientLight as AmbientLight), 'visible').name('ambient light')


    // persist GUI state in local storage on changes
    store.gui.onFinishChange(() => {
      const guiState = (store.gui as GUI).save()
      localStorage.setItem('guiState', JSON.stringify(guiState))
    })

    // load GUI state if available in local storage
    const guiState = localStorage.getItem('guiState')
    if (guiState) store.gui.load(JSON.parse(guiState))

    // reset GUI state button
    const resetGui = () => {
      localStorage.removeItem('guiState')
      store.gui?.reset()
    }
    store.gui.add({ resetGui }, 'resetGui').name('RESET')

    store.gui.close()
  }
}

export function animate() {
  requestAnimationFrame(animate)

  store?.stats && store.stats.update()

  // store.cameraControls && store.cameraControls.update()

  if (store.scene && store.camera && store.renderer) {
    store.renderer.render(store.scene, store.camera)
  }

  windowScroll();

}
