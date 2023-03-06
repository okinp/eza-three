import {
  BoxGeometry,
  BufferGeometry,
  Euler,
  Event as ThreeEvent,
  Face,
  Intersection,
  Line,
  LineBasicMaterial,
  Material,
  Mesh,
  MeshNormalMaterial,
  MeshPhysicalMaterial,
  Object3D,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderTarget
} from "three";

import {
  createCamera,
  createInstancedDropletMesh,
  createRenderer,
  enableDragToRotate,
  getScrollCallback,
  intersectionHelper,
  loadEnvMapToScene,
  loadGLTFModel,
  observeResize,
  toRadians,
} from "./helpers";

import BackfaceMaterial from "./materials/backface-material";
import RefractionMaterial from "./materials/refraction-material";

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

let bottleName = container?.dataset.file ?? "finelager";
bottleName = "finelager";

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

if (canvas) {
  canvas.addEventListener("mousemove", onPointerMove);
}

const rootObject = new Object3D();
const bottleObject = new Object3D();

const intersection = {
  point: new Vector3(),
  normal: new Vector3(),
  intersects: false,
};

const intersectCb = (
  intersects: Intersection<Object3D<ThreeEvent>>[] | null
) => {
  if (!state.store) return;

  if (intersects && intersects.length > 0) {
    const n = (intersects[0].face as Face).normal.clone();

    const p = intersects[0].point;
    state.store.mouseHelper.position.copy(p);
    intersection.point.copy(p.add(n.multiplyScalar(0.02)));

    n.transformDirection(state.store.bottleObject.matrixWorld);
    n.multiplyScalar(4);
    n.add(intersects[0].point);

    intersects[0].face && intersection.normal.copy(intersects[0].face.normal);
    state.store.mouseHelper.lookAt(n);

    const positions = state.store.line.geometry.attributes.position;
    positions.setXYZ(0, p.x, p.y, p.z);
    positions.setXYZ(1, n.x, n.y, n.z);
    positions.needsUpdate = true;

    intersection.intersects = true;

    intersects.length = 0;
  } else {
    intersection.intersects = false;
  }
};

function shootDroplet() {
  if (!state.store) return;
  if (intersection.intersects && state.store?.selectedDropSize) {
    const position = new Vector3();
    const orientation = new Euler();

    position.copy(intersection.point);
    orientation.copy(state.store.mouseHelper.rotation);
    state.store.dropletMeshes[state.store.selectedDropSize].addDroplet(
      state.store.bottleObject.worldToLocal(position),
      intersection.normal
    );
  }
}

export async function init(): Promise<boolean> {
  if (!container || !canvas || !word1 || !word2) {
    return false;
  }

  const domNodes = { canvas, container, word1, word2 };
  const renderer = createRenderer(canvas);
  const camera = createCamera(canvas);
  camera.layers.enable(0);
  camera.layers.enable(1);

  const fboCamera = createCamera(canvas);
  fboCamera.layers.set(0);

  const dpr = Math.min(devicePixelRatio, 2);
  const envFbo = new WebGLRenderTarget(dpr*canvas.clientWidth, dpr*canvas.clientHeight);
  const backfaceFbo = new WebGLRenderTarget(dpr*canvas.clientWidth, dpr*canvas.clientHeight);



  


  const scene = new Scene();

  scene.add(rootObject);

  try {
    await Promise.all([
      loadGLTFModel(`${filePath}/glb/${bottleName}.glb`, true),
      loadGLTFModel(`${filePath}/glb/drops2.glb`, true),
      loadEnvMapToScene(
        `${filePath}/envmap/${envmapFilename}.hdr`,
        scene,
        renderer
      ),
    ]).then(([gltf, drops]) => {
      console.log(gltf);

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

      const xs = drops.scene.children[3] as Mesh;

      const sm = drops.scene.children[4] as Mesh;

      const md = drops.scene.children[5] as Mesh;

      const xl = drops.scene.children[1] as Mesh;

      const xxl = drops.scene.children[2] as Mesh;

      const xxxl = drops.scene.children[0] as Mesh;

      const xsMesh = createInstancedDropletMesh(xs, 1, 500);
      const smMesh = createInstancedDropletMesh(sm, 1, 500);
      const mdMesh = createInstancedDropletMesh(md, 1, 500);
      const xlMesh = createInstancedDropletMesh(xl, 1, 500);
      const xxlMesh = createInstancedDropletMesh(xxl, 1, 500);
      const xxxlMesh = createInstancedDropletMesh(xxxl, 1, 1000);

      console.log(xsMesh);

      bottleObject.add(
        liquidMesh,
        bottleMesh,
        capMesh,
        topLabelMesh,
        frontLabelMesh,
        backLabelMesh,
        xsMesh.dropletMesh,
        smMesh.dropletMesh,
        mdMesh.dropletMesh,
        xlMesh.dropletMesh,
        xxlMesh.dropletMesh,
        xxxlMesh.dropletMesh
      );

      bottleObject.position.set(0, 0.5, 0);
      bottleObject.scale.set(2, 2, 2);
      bottleObject.rotation.set(0, 0, Math.PI / 9);

      rootObject.add(bottleObject);
      rootObject.position.y = 1;

      const mouseHelper = new Mesh(
        new BoxGeometry(1, 1, 10),
        new MeshNormalMaterial()
      );
      mouseHelper.visible = false;

      const geometry = new BufferGeometry();
      geometry.setFromPoints([new Vector3(), new Vector3()]);
      const line = new Line(geometry, new LineBasicMaterial());
      line.layers.set(1);
      scene.add(line);

      const refractionMaterial = new RefractionMaterial({
        envMap: envFbo.texture,
        backfaceMap: backfaceFbo.texture,
        resolution: [canvas.clientWidth, canvas.clientHeight]
      })

      const backfaceMaterial = new BackfaceMaterial();

      state.store = {
        rootObject,
        bottleObject,
        mouseHelper,
        line,
        materials: {
          bottle: bottleMaterial,
          liquid: liquidMaterial,
          frontLabel: frontLabelMaterial,
          backLabel: backLabelMaterial,
          topLabel: topLabelMaterial,
          cap: kapakiMaterial,
          backface: backfaceMaterial,
          refraction: refractionMaterial
        },
        domNodes,
        fbo: {
          env: envFbo,
          backface: backfaceFbo
        },
        scene,
        renderer,
        camera,
        fboCamera,
        meshes: {
          cap: capMesh,
          bottle: bottleMesh,
          liquid: liquidMesh,
          topLabel: topLabelMesh,
          frontLabel: frontLabelMesh,
          backLabel: backLabelMesh,
        },
        selectedDropSize: "xs",
        dropletMeshes: {
          xs: xsMesh,
          sm: smMesh,
          md: mdMesh,
          xl: xlMesh,
          xxl: xxlMesh,
          xxxl: xxxlMesh,
        },
        isReady: true,
      };

      observeResize(renderer, [camera, fboCamera], [envFbo, backfaceFbo], Object.values(state.store.dropletMeshes));

      console.log(state.store);


      enableDragToRotate(state.store.domNodes.canvas, state.store.bottleObject);
      setupGui();
      canvas.addEventListener("mousedown", shootDroplet);
    
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
    const { camera, fboCamera, renderer, scene, meshes, materials, fbo, dropletMeshes
  } = state.store;

    renderer.clear();

    raycast(
      Object.values(meshes).filter((m) => m.name === "bottle") as Mesh<
        BufferGeometry,
        Material
      >[],
      camera,
      intersectCb
    );
    
    //Render env to fbo
    renderer.setRenderTarget(fbo.env);
    renderer.render(scene, fboCamera);

    //Render drops backfaces to fbo
    Object.values(dropletMeshes).forEach(mesh => {
      mesh.dropletMesh.material = materials.backface;
    })
    renderer.setRenderTarget(fbo.backface);
    renderer.clearDepth();
    renderer.render(scene, camera);
    renderer.clearDepth();

    //render env to screen
    renderer.setRenderTarget(null);
    // renderer.clearDepth();
    Object.values(dropletMeshes).forEach(mesh => {
      mesh.dropletMesh.material = materials.refraction;
    })

    renderer.render(scene, camera);
    windowScroll();
  }
}
