import {
  AmbientLight,
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
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Quaternion,
  Scene,
  WebGLRenderer,
  SpotLight,
  SpotLightHelper,
  MeshPhysicalMaterial,
  sRGBEncoding,
  Vector2,
} from 'three';

// import { setupGui } from './gui';





import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import store from "./store";

import { toRadians } from './helpers/utils';

import { createTexturesAndMaterials } from "./materials"

import Stats from 'three/examples/jsm/libs/stats.module'

import { observeResize } from './helpers/responsiveness';

const CANVAS_ID = 'scene'

const CONTAINER_ID = "CanvasFrame";


type DragStatus = 'NONE' | 'DRAG';

// let dragState: DragState = 'NONE';

interface DragState {
  status: DragStatus;
  initial: Vector2;
  current: Vector2;
  originalRotation: Quaternion;
}


const dragState: DragState = {
  status: 'NONE',
  initial: new Vector2(0,0),
  current: new Vector2(0,0),
  originalRotation: new Quaternion()
}

function windowScroll() {
  // @ts-ignore
  const currentHeight = (luxy.wapperOffset || 0 as number);


  if ((Math.abs(currentHeight - store.prevHeight) > 0.5)) {

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



function setupEventListeners() {

  const canvas = store.canvas;
  if (!canvas) return;



  canvas.addEventListener("mousedown", (evt: MouseEvent) => {
    dragState.status = 'DRAG';
    dragState.initial = new Vector2(evt.offsetX, evt.offsetY);
    dragState.originalRotation = store.model?.quaternion || new Quaternion();

  })

  canvas.addEventListener("mousemove", (evt: MouseEvent) => {
    if (dragState.status !== 'DRAG') return;    
    dragState.current = new Vector2(evt.offsetX, evt.offsetY);

    const diff = new Vector2();
    diff.subVectors(dragState.current, dragState.initial);

    diff.multiplyScalar(0.3);

    const deltaRotation = new Quaternion().setFromEuler(
      new Euler(0, toRadians(diff.x), 0, "XYZ")
    );

    const bottle = store.model as Object3D;

    const newRotation = new Quaternion();
    newRotation.multiplyQuaternions(deltaRotation, dragState.originalRotation);

    bottle.setRotationFromQuaternion(newRotation);
    dragState.initial = new Vector2(evt.offsetX, evt.offsetY)

  });


  window.addEventListener('mouseup', () => {
    dragState.status = 'NONE'
  });

}


function setupRenderer() {
  const canvas = (document.querySelector(`canvas#${CANVAS_ID}`) as HTMLElement);
  if (!canvas) return false;
  store.canvas = canvas;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  // renderer.shadowMap.type = PCFSoftShadowMap
  // renderer.toneMapping = ACESFilmicToneMapping;
  renderer.physicallyCorrectLights = true;
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


function handleOnLoaded() {
  console.log("loaded");
  store.isReady = true;
  setupEventListeners();
  // setupGui();

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
      const bottleMesh = gltf.scene.children[0];
      const capMesh = gltf.scene.children[1];
      const labelTopMesh = gltf.scene.children[2];
      const labelFrontMesh = gltf.scene.children[4];
      const bottleInnerMesh = gltf.scene.children[3];
      const labelBackMesh = gltf.scene.children[5];

      const bottleMaterial = ((bottleMesh as Mesh).material as MeshPhysicalMaterial);
      bottleMaterial.depthTest = true;
      bottleMaterial.depthWrite = true;
      const liquidMaterial = ((bottleInnerMesh as Mesh).material as MeshPhysicalMaterial);
      liquidMaterial.depthTest = true;
      liquidMaterial.depthWrite = true;

      store.bottleMaterial = bottleMaterial;
      store.liquidMaterial = liquidMaterial;


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
    // .then(() => setupGui());


  // ===== 📈 STATS & CLOCK =====
  store.clock = new Clock()
  store.stats = Stats()
  document.body.appendChild(store.stats.dom)


}

export function animate() {
  requestAnimationFrame(animate)

  store?.stats && store.stats.update()

  store?.pointLightHelper1 && store.pointLightHelper1.update();

  if (store.scene && store.camera && store.renderer) {
    store.renderer.render(store.scene, store.camera)
  }

  if (store.isReady){
    windowScroll();
  }

}
