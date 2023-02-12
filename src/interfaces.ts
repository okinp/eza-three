import GUI from 'lil-gui'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import {
    AmbientLight,
    AxesHelper,
    Clock,
    DirectionalLight,
    Mesh,
    Object3D,
    PerspectiveCamera,
    PointLightHelper,
    PointLight,
    Scene,
    WebGLRenderer,
    SpotLight,
    SpotLightHelper,
    MeshPhysicalMaterial,
  } from 'three'

  interface IScreenCoordinate {
    x: number,
    y: number
  }

export interface IStore {
    bottleMaterial: MeshPhysicalMaterial | undefined,
    liquidMaterial: MeshPhysicalMaterial | undefined,
    container: HTMLElement | undefined,
    canvas: HTMLElement | undefined,
    renderer: WebGLRenderer | undefined,
    scene: Scene | undefined,
    ambientLight: AmbientLight | undefined,
    spotLight: SpotLight |undefined,
    spotLightHelper: SpotLightHelper | undefined,
    pointLight1: PointLight | undefined,
    pointLight2: PointLight | undefined,
    pointLight3: PointLight | undefined,
    pointLightHelper1: PointLightHelper | undefined,
    directionalLight: DirectionalLight | undefined,
    camera: PerspectiveCamera | undefined,
    cameraControls: OrbitControls | undefined,
    dragControls: DragControls | undefined,
    axesHelper: AxesHelper | undefined,
    clock: Clock | undefined,
    stats: Stats | undefined,
    gui: GUI | undefined,
    animation: { enabled: boolean, play: boolean },
    circleMesh: Mesh | undefined,
    isDragging: boolean,
    isScrolling: boolean,
    previousMousePosition: IScreenCoordinate,
    deltaMove: IScreenCoordinate,
    model: Object3D | undefined,
    startTouch: IScreenCoordinate,
    moveTouch: IScreenCoordinate,
    prevHeight: number
  }