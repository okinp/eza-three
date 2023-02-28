import {
  // ArrowHelper,
  // BufferGeometry,
  Euler,
  // Face,
  // Intersection,
  // Material,
  Mesh,
  MeshPhysicalMaterial,
  Object3D,
  Quaternion,
  Scene,
  // Event as ThreeEvent,
  // Vector3,
} from "three";

import {
  createCamera,
  // createInstancedDropletMesh,
  dropletMaterial,
  createRenderer,
  enableDragToRotate,
  getScrollCallback,
  // intersectionHelper,
  loadEnvMapToScene,
  loadGLTFModel,
  observeResize,
  toRadians,
} from "./helpers";

const containerId = "CanvasFrame";
const canvasId = "scene";

import { bottleParams } from "./materials";
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

  try {
    await Promise.all([
      loadGLTFModel(`${filePath}/glb/${bottleName}.glb`, true),
      loadEnvMapToScene(
        `${filePath}/envmap/${envmapFilename}.hdr`,
        scene,
        renderer
      ),
    ]).then(([gltf]) => {

      // console.log(drops);

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

      // const xs = drops.scene.children[3] as Mesh;

      // const sm = drops.scene.children[4] as Mesh;

      // const md = drops.scene.children[5] as Mesh;

      // const xl = drops.scene.children[1] as Mesh;
      
      // const xxl = drops.scene.children[2] as Mesh;
      
      // const xxxl = drops.scene.children[0] as Mesh;


      // const xsMesh = createInstancedDropletMesh(xs, 300);
      // const smMesh = createInstancedDropletMesh(sm, 30);
      // const mdMesh = createInstancedDropletMesh(md, 30);
      // const xlMesh = createInstancedDropletMesh(xl, 30);
      // const xxlMesh = createInstancedDropletMesh(xxl, 30);
      // const xxxlMesh = createInstancedDropletMesh(xxxl, 50);

      // console.log(xsMesh);

      bottleObject.add(
        liquidMesh,
        bottleMesh,
        capMesh,
        topLabelMesh,
        frontLabelMesh,
        backLabelMesh,
        // arrowHelper,
        // xsMesh.dropletMesh,
        // smMesh.dropletMesh,
        // mdMesh.dropletMesh,
        // xlMesh.dropletMesh,
        // xxlMesh.dropletMesh,
        // xxxlMesh.dropletMesh
      );

      bottleObject.position.set(0, 0.5, 0);
      
      const scaleFactor = canvas.clientWidth < 1024 ? 1.6 : 2;
      bottleObject.scale.set(scaleFactor, scaleFactor, scaleFactor);

      bottleObject.rotation.set(0, 0, Math.PI / 9);

      rootObject.add(bottleObject);
      rootObject.position.y = 1;



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
        // selectedDropSize: 'xs',
        // dropletMeshes: {
        //   xs: xsMesh,
        //   sm: smMesh,
        //   md: mdMesh,
        //   xl: xlMesh,
        //   xxl: xxlMesh,
        //   xxxl: xxxlMesh
        // },
        isReady: true,      // canvas.addEventListener('mousedown', () => {
      //   if (intersectionData.isIntersecting && state.store?.selectedDropSize){
      //     state.store.dropletMeshes[state.store.selectedDropSize].addDroplet(intersectionData.position, intersectionData.normal);
      //   }
      // })
      };
      enableDragToRotate(state.store.domNodes.canvas, state.store.bottleObject);
      // canvas.addEventListener('mousedown', () => {
      //   if (intersectionData.isIntersecting && state.store?.selectedDropSize){
      //     state.store.dropletMeshes[state.store.selectedDropSize].addDroplet(intersectionData.position, intersectionData.normal);
      //   }
      // })
    });
  } catch(err) {
    console.log(err);
    return false;
  }

  return true;
}

export function animate() {
  requestAnimationFrame(animate);
  if (state.store) {
    // raycast(Object.values(state.store.meshes).filter( m => m.name !== 'liquid') as Mesh<BufferGeometry, Material>[], state.store.camera, intersectCb );
    state.store.renderer.render(state.store.scene, state.store.camera);
    windowScroll();
  }
}
