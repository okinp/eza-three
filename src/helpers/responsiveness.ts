import { PerspectiveCamera, WebGLRenderer } from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import state from "../store";

export function resizeRendererToDisplaySize(renderer: WebGLRenderer, camera: PerspectiveCamera, bloomPass: UnrealBloomPass) {
  return function () {
    // console.log("resize observer called")
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (state.store && width < 1024){
      console.log("less")
      state.store.bottleObject.scale.set(1.6,1.6,1.6);
    } else if (state.store && width >= 1024) {
      console.log("more");
      state.store.bottleObject.scale.set(2,2, 2);
    }
    renderer.setSize(width, height, false);
    bloomPass.setSize(width,height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
};


export function observeResize(renderer: WebGLRenderer, camera: PerspectiveCamera, bloomPass: UnrealBloomPass) {
  const resizeObserver = new ResizeObserver(resizeRendererToDisplaySize(renderer, camera, bloomPass));
  resizeObserver.observe(renderer.domElement, { box: 'border-box' });
}