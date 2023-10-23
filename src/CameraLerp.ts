import * as THREE from 'three';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Scene } from './Scene';
import { Utils } from './Utils';

export class CameraLerp {
    public static readonly lerpSpeed: number = 0.04;

    private camera: THREE.PerspectiveCamera;
    private finalPosition: THREE.Vector3;
    private lookObject: ObjectLookedInterface;

    constructor(camera: THREE.PerspectiveCamera,
            finalPosition: THREE.Vector3, lookObject: ObjectLookedInterface) {
        this.camera = camera;
        this.finalPosition = finalPosition;
        this.lookObject = lookObject;
    }

    updateFrame() {
        this.camera.position.lerp(this.finalPosition, CameraLerp.lerpSpeed);
        this.camera.lookAt(this.lookObject.getObjectPosition());

        if (Utils.areVector3AlmostEqual(this.camera.position, 
                this.finalPosition, 2)) {
            this.lookObject.onLookEnd();
            Scene.removeCameraLerp();
        }
    }

}
