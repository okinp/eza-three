import {
  CircleGeometry,
  DoubleSide,
  Euler,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  Scene,
  MeshPhysicalMaterial,
} from 'three';

import { setupGui } from './gui';







import store from "./store";

import { toRadians, getScrollCallback  } from './helpers/callbacks';

import { createTexturesAndMaterials } from "./materials"

// import Stats from 'three/examples/jsm/libs/stats.module'

import { observeResize } from './helpers/responsiveness';

const CANVAS_ID = 'scene'

const CONTAINER_ID = "CanvasFrame";





function setup(){


}


const rotateOnScroll = getScrollCallback((prev: number, cur: number) => {
  const deltaRot = new Quaternion().setFromEuler(
    new Euler(
      0,
      toRadians((cur - prev) * 0.5),
      0,
      "XYZ"
    )
  );

  const bottle = store.model as Object3D;
  bottle.quaternion.multiplyQuaternions(deltaRot, bottle.quaternion);
})







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






function handleOnLoaded() {
  console.log("loaded");
  store.isReady = true;
  setupEventListeners();
  
  setupGui();

}

export function init() {

  store.container = document.getElementById(CONTAINER_ID) || undefined;

  const bottleName = store.container?.dataset.file || 'lagernew';
  console.log(store.container?.dataset);
  // debugger;
  alert(bottleName);

  store.scene = new Scene();

  const success = setupRenderer();

  if (!success) return;

  setupLights(store.scene);
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
      pmremGenerator.dispose()
    }).then(handleOnLoaded)
    // .then(() => setupGui());


  // ===== 📈 STATS & CLOCK =====
  // store.clock = new Clock()
  // store.stats = Stats()
  document.body.appendChild(store.stats.dom)


}

export function animate() {
  requestAnimationFrame(animate)

  // store?.stats && store.stats.update()

  store?.pointLightHelper1 && store.pointLightHelper1.update();

  if (store.scene && store.camera && store.renderer) {
    store.renderer.render(store.scene, store.camera)
  }

  if (store.isReady){
    rotateOnScroll()
    // windowScroll();
  }

}
