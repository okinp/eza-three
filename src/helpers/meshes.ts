import {
  ShapeGeometry,
  Matrix4,
  MeshBasicMaterial,
  DoubleSide,
  Box3,
  Mesh,
  CircleGeometry,
  InstancedMesh,
  DynamicDrawUsage,
  Vector3,
  Object3D,
  MeshPhysicalMaterial,
} from "three";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";

export function createWordMeshes(font: Font, wordA = "FINE", wordB = "LAGER") {
  const text: { word1: string; word2: string } = {
    word1: wordA,
    word2: wordB,
  };

  const wordMaterial = new MeshBasicMaterial({
    color: 0xf2f2f2,
    transparent: true,
    opacity: 0.4,
    side: DoubleSide,
  });

  const shapeWord1 = font.generateShapes(text.word1, 2.5);
  const shapeWord2 = font.generateShapes(text.word2, 2.5);

  const geometryWord1 = new ShapeGeometry(shapeWord1);
  geometryWord1.computeBoundingBox();
  const geometryWord2 = new ShapeGeometry(shapeWord2);
  geometryWord2.computeBoundingBox();

  const xMid1 =
    Math.abs(
      (geometryWord1.boundingBox as Box3).max.x -
        (geometryWord1.boundingBox as Box3).min.x
    ) / 2;
  const xMid2 =
    Math.abs(
      (geometryWord2.boundingBox as Box3).max.x -
        (geometryWord2.boundingBox as Box3).min.x
    ) / 2;

  geometryWord1.translate(0, 1, 0);
  geometryWord2.translate(0, -2.5, 0);

  const word1Mesh = new Mesh(geometryWord1, wordMaterial);
  const word2Mesh = new Mesh(geometryWord2, wordMaterial);

  const mql = window.matchMedia("(min-width: 1024px)");

  word1Mesh.position.x = 0;
  word1Mesh.position.z = -5;
  word2Mesh.position.x = 0;
  word2Mesh.position.z = -5;

  if (mql.matches) {
    word1Mesh.position.x = -xMid1 - 2;
    word2Mesh.position.x = -2;
  } else {
    word1Mesh.position.x = -xMid1;
    word2Mesh.position.x = -xMid2;
  }

  function screenTest(e: MediaQueryListEvent) {
    if (e.matches) {
      word1Mesh.position.x = -xMid1 - 2;
      word2Mesh.position.x = -2;
    } else {
      word1Mesh.position.x = -xMid1;
      word2Mesh.position.x = -xMid2;
    }
  }

  mql.addEventListener("change", screenTest);

  return { word1Mesh, word2Mesh, wordMaterial };
}

export function createCircleMesh() {
  const circleGeometry = new CircleGeometry(8.5, 512);
  const circleMaterial = new MeshBasicMaterial({
    color: 0xffff00,
    opacity: 0.2,
    transparent: true,
    side: DoubleSide,
    depthWrite: false,
    envMap: null,
  });
  const circleMesh = new Mesh(circleGeometry, circleMaterial);
  circleMesh.position.set(0, 0, -22);
  return { circleMesh, circleMaterial };
}

const defaultTransform = new Matrix4()
  .makeRotationX(Math.PI)
  .multiply(new Matrix4().makeScale(7, 7, 7));

export function createInstancedDroplets(droplet: Mesh, target: Mesh, count = 2000) {


  const dropletGeometry = droplet.geometry.clone();
  dropletGeometry.applyMatrix4(defaultTransform);

  const dropletMaterial = new MeshPhysicalMaterial();

  const dropletMesh = new InstancedMesh(dropletGeometry, dropletMaterial, count);
  dropletMesh.instanceMatrix.setUsage(DynamicDrawUsage);

  const sampler = new MeshSurfaceSampler(target)
    .setWeightAttribute(null)
    .build();

    const _position = new Vector3();
    const _normal = new Vector3();

    const dummy = new Object3D();

    function sample(){

      for ( let i = 0; i < count; i ++ ) {
        sampleParticle( i );
      }
      dropletMesh.instanceMatrix.needsUpdate = true;
    }

    function sampleParticle(i: number){
      sampler.sample(_position, _normal);
      _normal.add(_position.multiplyScalar(1.01));

      const maxScale = 0.2;
      const scaleMuliplier = Math.random();
      const particleScale = scaleMuliplier*maxScale;
      dummy.position.copy(_position);

      dummy.scale.set(particleScale, particleScale, particleScale);
      dummy.lookAt(_normal);
      dummy.updateMatrix();

      dropletMesh.setMatrixAt(i, dummy.matrix)
    }
    return {
      dropletMesh,
      sample
    }
}
