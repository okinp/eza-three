import { ShapeGeometry, MeshBasicMaterial, DoubleSide, Box3, Mesh, CircleGeometry  } from "three";
import { Font } from "three/examples/jsm/loaders/FontLoader";

export function createWordMeshes(font: Font, bottleName = "finelager"){

  const text : { word1: string, word2: string } = {
    word1: "FINE",
    word2: "LAGER"
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
    opacity: 0.4,
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

  const word1Mesh = new Mesh(geometryWord1, wordMaterial);
  const word2Mesh = new Mesh(geometryWord2, wordMaterial);

  const mql = window.matchMedia('(min-width: 1024px)');

  word1Mesh.position.x = 0;
  word1Mesh.position.z = -5;
  word2Mesh.position.x = 0;
  word2Mesh.position.z = -5;

  if (mql.matches){
    word1Mesh.position.x = - xMid1 -2;
    word2Mesh.position.x = -2 ;    
  } else {
    word1Mesh.position.x = - xMid1;
    word2Mesh.position.x = -xMid2;    
  }

  function screenTest(e: MediaQueryListEvent){
    if (e.matches){
      word1Mesh.position.x = - xMid1 -2;
      word2Mesh.position.x = -2 ;
    } else {
      word1Mesh.position.x = - xMid1;
      word2Mesh.position.x = -xMid2;
    }
  }

  mql.addEventListener('change', screenTest);

  return { word1Mesh, word2Mesh, wordMaterial }

}

export function createCircleMesh() {
  const circleGeometry = new CircleGeometry(8.5, 512);
  const circleMaterial = new MeshBasicMaterial({
    color: 0xffff00,
    opacity: 0.2,
    transparent: true,
    side: DoubleSide,
    depthWrite: false,
    envMap: null
  })
  const circleMesh = new Mesh(circleGeometry, circleMaterial);
  circleMesh.position.set(0, 0, -22);
  return { circleMesh, circleMaterial }
}