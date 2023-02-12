function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
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


export function observeResize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  console.log("resize observer setup")
  const resizeObserver = new ResizeObserver(resizeRendererToDisplaySize(renderer, camera));
  resizeObserver.observe(renderer.domElement, { box: 'border-box' });
}