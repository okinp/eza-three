import { PerspectiveCamera, WebGLRenderer, WebGLRenderTarget, ShaderMaterial } from "three";
import type { iDropletMesh } from "../store";

export function resizeRendererToDisplaySize(renderer: WebGLRenderer, cameras: PerspectiveCamera[], fbos: WebGLRenderTarget[] = [], meshes: iDropletMesh<ShaderMaterial>[]) {
  return function () {
    console.log("resize observer called")
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    cameras.forEach(camera => {
      camera.aspect = width/height;
      camera.updateProjectionMatrix();
    });
    // const dpr = Math.min(devicePixelRatio, 2);
    fbos.forEach(fbo => fbo.setSize(
      width,
      height
    ))

    meshes.forEach(mesh => {
      mesh.dropletMesh.material.uniforms.resolution.value = [
        width,
        height
      ];
    })
  }
};


export function observeResize(renderer: WebGLRenderer, cameras: PerspectiveCamera[], fbos: WebGLRenderTarget[] = [], meshes: iDropletMesh<ShaderMaterial>[] = []) {
  const resizeObserver = new ResizeObserver(resizeRendererToDisplaySize(renderer, cameras, fbos, meshes));
  resizeObserver.observe(renderer.domElement, { box: 'border-box' });
}