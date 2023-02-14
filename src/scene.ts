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
  ShapeGeometry,
  Box3,
  Vector3,
} from 'three';

import { setupGui } from './gui';





import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

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

let initMesh1Position  = 0;
let initMesh2Position = 0;

function windowScroll() {
  // @ts-ignore
  const currentHeight = (luxy.wapperOffset || 0 as number);

  (word1Mesh as Mesh).position.x = initMesh1Position - ( currentHeight / 50 );
  (word2Mesh as Mesh).position.x = initMesh2Position + ( currentHeight / 50 );


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

let bottleName ='';
let word1Mesh: Mesh | undefined = undefined;
let word2Mesh: Mesh | undefined = undefined;

function handleOnLoaded() {
  console.log("loaded");
  store.isReady = true;
  setupEventListeners();
  
  setupGui();

}

async function setupScrollingText(scene: Scene){


  const fontLoader = new FontLoader();

  const font = await fontLoader.loadAsync("/fonts/Silvania_Regular.json")

  const text : { word1: string, word2: string } = {
    word1: "",
    word2: ""
  }

  switch(bottleName){
    case("finelager"):
      text.word1 = "FINE";
      text.word2 ="LAGER";
      break;
    case("alcoholfree"):
      text.word1 = "ALCOHOL";
      text.word2 = "FREE";
      break;
    case("premiumpilsener"):
      text.word1 = "PREMIUM";
      text.word2 = "PILSENER";
      break;
    default:
      text.word1 = "FINE";
      text.word2 ="LAGER";
  };

  const wordMaterial = new MeshBasicMaterial( {
    color: 0xf2f2f2,
    transparent: true,
    opacity: 0.2,
    side: DoubleSide
  } );


  const shapeWord1 = font.generateShapes(text.word1, 2.5);
  const shapeWord2 = font.generateShapes(text.word2, 2.5);
  const geometryWord1 = new ShapeGeometry(shapeWord1);
  geometryWord1.computeBoundingBox();
  const geometryWord2 = new ShapeGeometry(shapeWord2);
  geometryWord2.computeBoundingBox();

  const xMid1 = Math.abs ( (geometryWord1.boundingBox as Box3).max.x - (geometryWord1.boundingBox as Box3).min.x ) / 2;
  const xMid2 = Math.abs ( (geometryWord2.boundingBox as Box3).max.x - (geometryWord2.boundingBox as Box3).min.x ) / 2;
  

  geometryWord1.translate(0,1,0);
  geometryWord2.translate(0,-2.5, 0);
  word1Mesh = new Mesh(geometryWord1, wordMaterial);
  word2Mesh = new Mesh(geometryWord2, wordMaterial);

  const mql = window.matchMedia('(min-width: 1024px)');

  initMesh1Position = word1Mesh.position.x ;
  initMesh2Position = word2Mesh.position.x;

  function screenTest(e: MediaQueryListEvent){
    const mesh1 = word1Mesh as Mesh;
    const mesh2 = word2Mesh as Mesh;
    mesh1.position.z = -5;
    mesh2.position.z = -5;
    if (e.matches){
      mesh1.position.x = - xMid1 -2;
      mesh2.position.x = -2 ;
    } else {
      mesh1.position.x = - xMid1;
      mesh2.position.x = -xMid2;
    }
  }

  mql.addEventListener('change', screenTest)

  scene.add( word1Mesh );
  scene.add( word2Mesh);

}

export function init() {

  store.container = document.getElementById(CONTAINER_ID) || undefined;

  bottleName = store.container?.dataset.type || 'finelager';

  store.scene = new Scene();

  const success = setupRenderer();

  if (!success) return;

  // setupLights(store.scene);
  setupCamera();

  // const scene = new Scene();
  // store.scene = scene;

  
  

  // setupEventListeners();

  if (store.renderer && store.camera) {
    observeResize(store.renderer, store.camera);
  }



  const modelLoader = new GLTFLoader();

  Promise.all([createTexturesAndMaterials(), modelLoader.loadAsync(`/glb/${bottleName}.glb`), loadEnvMap()])
    .then(([{ }, gltf, { pmremGenerator, HDRImap }]) => {
      store.container?.classList.remove("loading");
      store.circleMesh = createCircleMesh();
      const scene = store.scene as Scene;

      scene.add(store.circleMesh);
      const parentObject = new Object3D();
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


      parentObject.add(bottleMesh);
      parentObject.add(capMesh);
      parentObject.add(labelTopMesh);
      parentObject.add(bottleInnerMesh);
      parentObject.add(labelFrontMesh);
      parentObject.add(labelBackMesh);
      parentObject.position.set(0, 0.5, 0);
      parentObject.scale.set(2, 2, 2);
      parentObject.rotation.set(0, 0, Math.PI / 9);
      store.model = parentObject;

      scene.add(parentObject);


      scene.environment = HDRImap;
      (store.bottleMaterial as MeshPhysicalMaterial).envMap = HDRImap;
      HDRImap.dispose()
      pmremGenerator.dispose();
      return scene;
      setupScrollingText
    }).then(setupScrollingText).
    then(handleOnLoaded)
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
