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

  const addDroplet = (position: Vector3, normal: Vector3) => {
    if (dropletMesh.count < maxCount ){
      const idx = dropletMesh.count;
      const dummy = new Object3D();
      normal.add(position);
      dummy.position.copy(position);
      dummy.lookAt(normal);
      dummy.updateMatrix();
      dropletMesh.setMatrixAt(idx, dummy.matrix);
      dropletMesh.count = idx + 1;
    }
  }

  return {
    addDroplet,
    dropletMesh
  }  
}
