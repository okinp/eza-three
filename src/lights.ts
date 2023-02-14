import { AmbientLight, PointLight, SpotLight, DirectionalLight, Scene, SpotLightHelper, PointLightHelper, DirectionalLightHelper } from "three";


export interface ILights {
    ambient: AmbientLight,
    point: PointLight[]
    spot: SpotLight[],
    directional: DirectionalLight[]
}



export interface ILightHelpers {
    spot: SpotLightHelper[],
    point: PointLightHelper[],
    directional: DirectionalLightHelper[]
}

export function createLights(): ILights {

    const ambient = new AmbientLight(0xffffff, 10);

    const pl1 = new PointLight("#ffffff", 1.2, 100);
    pl1.position.set(-2, 3, 3);
    pl1.castShadow = true
    pl1.shadow.radius = 4
    pl1.shadow.camera.near = 0.5
    pl1.shadow.camera.far = 4000
    pl1.shadow.mapSize.width = 2048
    pl1.shadow.mapSize.height = 2048

    const pl2 = new PointLight(0xffffff, 25, 50);
    pl2.position.set(-5, -2, -10);

    const pl3 = new PointLight(0xffffff, 25, 50);
    pl3.position.set(0, -5, -5);

    const dl = new DirectionalLight(0xffffff, 12);
    dl.position.set(0, 0, 5);
    dl.target.position.set(0, 0, 0);

    const sl = new SpotLight(0xffffff, 5);
    sl.position.set(25, 50, 25);
    sl.angle = Math.PI / 6;
    sl.penumbra = 1;
    sl.decay = 2;
    sl.distance = 100;


    sl.castShadow = true;
    sl.shadow.mapSize.width = 1024;
    sl.shadow.mapSize.height = 1024;
    sl.shadow.camera.near = 10;
    sl.shadow.camera.far = 200;
    sl.shadow.focus = 1;

    return {
        ambient,
        point: [pl1, pl2, pl3],
        spot: [sl],
        directional: []
    }
}

const HelperColors: {
    point: number,
    spot: number,
    directional: number
} = {
    point: 0x00ff00,
    spot: 0xff0000,
    directional: 0x0000ff
}

export function createLightHelpers(lights: ILights): ILightHelpers {
    const point = lights.point.map(pl => new PointLightHelper(pl, undefined, HelperColors.point));
    const spot = lights.spot.map(sl => new SpotLightHelper(sl, HelperColors.spot));
    const directional = lights.directional.map(dl => new DirectionalLightHelper(dl, undefined, HelperColors.directional));
    return {
        point,
        spot,
        directional
    }
}

export function addLightsAndHelpersToScene(scene: Scene, lights: ILights, helpers: ILightHelpers = { point: [], spot: [], directional: [] }) {
    scene.add(...lights.point, ...lights.spot, ...lights.directional, ...helpers.point, ...helpers.spot, ...helpers.directional);
}