import {
  Matrix4,
  Mesh,
  InstancedMesh,
  DynamicDrawUsage,
  Vector3,
  Object3D,
  MeshBasicMaterial,
} from "three";



const defaultTransform = new Matrix4()
  .makeRotationX(Math.PI)
  .multiply(new Matrix4().makeScale(7, 7, 7));


export const dropletMaterial = new MeshBasicMaterial();


export function createInstancedDropletMesh(droplet: Mesh, maxCount = 2000) {

  const dropletGeometry = droplet.geometry.clone();
  dropletGeometry.applyMatrix4(defaultTransform);

  const dropletMesh = new InstancedMesh(dropletGeometry, dropletMaterial, maxCount);
  dropletMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  dropletMesh.count = 0;

  const dummy = new Object3D();

  const addDroplet = (position: Vector3, normal: Vector3) => {
    if (dropletMesh.count < maxCount ){
      const _n = normal.copy(normal);
      const _p = position.copy(position);
      _n.add(_p);
      const idx = dropletMesh.count;
      dummy.scale.set(0.01,0.01,0.01)
      dummy.position.copy(_p);
      dummy.lookAt(_n);
      dummy.updateMatrix();
      dropletMesh.setMatrixAt(idx, dummy.matrix);
      dropletMesh.instanceMatrix.needsUpdate = true;
      dropletMesh.count +=1;
    }
  }

  return {
    addDroplet,
    dropletMesh
  }  
}
