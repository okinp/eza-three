import { Vector2, Raycaster, Mesh, PerspectiveCamera, Object3D, Intersection, Event as ThreeEvent } from "three";


const store = {
  pointer: new Vector2(),
  raycaster: new Raycaster(),
}

function onPointerMove(evt: MouseEvent){
  if (!evt.currentTarget){
    return;
  }
  const rect = (evt.currentTarget as HTMLElement).getBoundingClientRect();
  store.pointer.x  = 2*(evt.clientX - rect.left)/rect.width - 1;
  store.pointer.y = -2*(evt.clientY - rect.top)/rect.height + 1;
}


function raycast(meshes: Mesh[], camera: PerspectiveCamera, cb: (intersection: Intersection<Object3D<ThreeEvent>> | null) => void){
    store.raycaster.setFromCamera(store.pointer, camera);
    const intersects = store.raycaster.intersectObjects(meshes, false);
    if (intersects.length){
      cb(intersects[0]);
    } else {
      cb(null);
    }
}

export default function intersectionHelper(){
  return {
    onPointerMove,
    raycast
  }
}