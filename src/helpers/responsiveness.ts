import { PerspectiveCamera, WebGLRenderer } from "three";

export function resizeRendererToDisplaySize(renderer: WebGLRenderer, camera: PerspectiveCamera) {
  return function () {
    console.log("resize observer called")
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
};


export function observeResize(renderer: WebGLRenderer, camera: PerspectiveCamera) {
  const resizeObserver = new ResizeObserver(resizeRendererToDisplaySize(renderer, camera));
  resizeObserver.observe(renderer.domElement, { box: 'border-box' });
}