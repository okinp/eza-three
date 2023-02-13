import { Euler, Quaternion, Object3D } from "three";

export function toRadians(angle: number) {
    return angle * (Math.PI / 180);
}

export function getScrollCallback(model: Object3D) {
    let prevHeight = 0;

    return function () {
        // @ts-ignore
        const currentHeight = (luxy.wapperOffset || 0 as number);
        if ((Math.abs(currentHeight - prevHeight) > 0.5)) {

            const deltaRot = new Quaternion().setFromEuler(
                new Euler(
                    0,
                    toRadians((currentHeight - prevHeight) * 0.5),
                    0,
                    "XYZ"
                )
            );
            model.quaternion.multiplyQuaternions(deltaRot, model.quaternion);
        }

    }
}