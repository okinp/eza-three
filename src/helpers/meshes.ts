import {
  Matrix4,
  Mesh,
  InstancedMesh,
  DynamicDrawUsage,
  Vector3,
  Object3D,
  MeshBasicMaterial,
  ShaderMaterial,
} from "three";



const defaultTransform = new Matrix4()
  .makeRotationX(Math.PI)
  .multiply(new Matrix4().makeScale(7, 7, 7));


export const dropletMaterial = new MeshBasicMaterial({ color: 0xffffff, refractionRatio: 0.95 });
// dropletMaterial.opacity = 0.05;
// dropletMaterial.ior = 1.042406;
// dropletMaterial.emissiveIntensity = 0.442;
// dropletMaterial.clearcoat = 0.686;
// dropletMaterial.reflectivity = 0.131;
// dropletMaterial.transmission = 1;
// dropletMaterial.thickness = 2.4;

export function createInstancedDropletMesh(droplet: Mesh, layer = 0, maxCount = 2000) {

  const dropletGeometry = droplet.geometry.clone();
  dropletGeometry.applyMatrix4(defaultTransform);

  const dropletMesh = new InstancedMesh(dropletGeometry, new ShaderMaterial, maxCount);
  dropletMesh.layers.set(layer);
  dropletMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  dropletMesh.count = 0;

  const dummy = new Object3D();

  const addDroplet = (position: Vector3, normal: Vector3) => {
    if (dropletMesh.count < maxCount ){
      const _n = normal.copy(normal);
      const _p = position.copy(position);
      console.log(_p);
      console.log(_n);
      
      _n.add(_p);
      const idx = dropletMesh.count;
      // const scale = 0.0008 * Math.random() + 0.004
      // dummy.scale.set(scale, scale, scale)
      dummy.position.copy(_p);
      dummy.lookAt(_n);
      dummy.updateMatrix();
      dropletMesh.setMatrixAt(idx, dummy.matrix);
      dropletMesh.scale.set(0.02,0.02, 0.02)
      dropletMesh.instanceMatrix.needsUpdate = true;
      dropletMesh.count +=1;
    }
  }

  return {
    addDroplet,
    dropletMesh
  }  
}
