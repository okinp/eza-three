import { Euler, Quaternion, Object3D, Vector2 } from "three";

type DragStatus = 'NONE' | 'DRAG';



interface DragState {
    status: DragStatus;
    initial: Vector2;
    current: Vector2;
    originalRotation: Quaternion;
}


export function toRadians(angle: number) {
    return angle * (Math.PI / 180);
}

export function getScrollCallback(cb: (current: number, previous: number) => void) {
    let previousHeight = 0;
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) as boolean;
    if (!isMobile){
      //@ts-ignore
      if (window.luxy){
        //@ts-ignore
        window.luxy.init({
          wrapper: '#smooth',
          wrapperSpeed: 0.065,
        });
      }

    }
    return function () {
        //@ts-ignore
        const currentHeight = (window.luxy?.wapperOffset ?? 0 );
        if ((Math.abs(currentHeight - previousHeight) > 0.5)) {
            cb(currentHeight, previousHeight);
        }
        previousHeight = currentHeight
    }
}


export function enableDragToRotate(canvas: HTMLElement, target: Object3D) {

    const dragState: DragState = {
        status: 'NONE',
        initial: new Vector2(0, 0),
        current: new Vector2(0, 0),
        originalRotation: new Quaternion()
    }

    canvas.addEventListener("mousedown", function (evt: MouseEvent) {
        dragState.status = 'DRAG';
        dragState.initial = new Vector2(evt.offsetX, evt.offsetY);
        dragState.originalRotation = target.quaternion;
    })

    canvas.addEventListener("mousemove", function (evt: MouseEvent) {
        if (dragState.status !== 'DRAG') return;
        dragState.current = new Vector2(evt.offsetX, evt.offsetY);

        const diff = new Vector2();
        diff.subVectors(dragState.current, dragState.initial);

        diff.multiplyScalar(0.3);

        const deltaRotation = new Quaternion().setFromEuler(
            new Euler(0, toRadians(diff.x), 0, "XYZ")
        );

        const newRotation = new Quaternion();
        newRotation.multiplyQuaternions(deltaRotation, dragState.originalRotation);

        target.setRotationFromQuaternion(newRotation);
        dragState.initial = new Vector2(evt.offsetX, evt.offsetY)

    });


    window.addEventListener('mouseup', () => {
        dragState.status = 'NONE'
    });

}