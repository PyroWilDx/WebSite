import * as THREE from 'three';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Scene } from './Scene';

export class CameraLerp {
    public static readonly maxLerpSpeed: number = 0.026;

    private camera: THREE.PerspectiveCamera;
    private finalPosition: THREE.Vector3;
    private lookObject: ObjectLookedInterface;
    
    private distEpsilon: number;
    private rotEpsilon: number;

    // private currLerpSpeed: number;

    constructor(camera: THREE.PerspectiveCamera,
            finalPosition: THREE.Vector3, lookObject: ObjectLookedInterface) {
        this.camera = camera;
        this.finalPosition = finalPosition;
        this.lookObject = lookObject;

        this.distEpsilon = 1;
        this.rotEpsilon = 0.00002

        // this.currLerpSpeed = 0;
    }

    updateFrame() {
        this.camera.position.lerp(this.finalPosition, CameraLerp.maxLerpSpeed);
        // this.currLerpSpeed = Math.min(this.currLerpSpeed + 0.0001, CameraLerp.maxLerpSpeed)

        let tmpCam = this.camera.clone();
        tmpCam.lookAt(this.lookObject.getObjectPosition());
        this.camera.quaternion.slerp(tmpCam.quaternion, 0.08);

        this.lookObject.onLookProgress(this);

        if (this.camera.position.distanceTo(this.finalPosition) < this.distEpsilon &&
                Math.abs(this.camera.quaternion.dot(tmpCam.quaternion)) > 1 - this.rotEpsilon) {
            this.lookObject.onLookEnd();
            Scene.removeCameraLerp();
        }
    }

    setEpsilons(distEpsilon: number, rotEpsilon: number) {
        this.distEpsilon = distEpsilon;
        this.rotEpsilon = rotEpsilon;
    }

    setFinalPosition(finalPosition: THREE.Vector3) {
        this.finalPosition = finalPosition;
    }

    getLookObject(): ObjectLookedInterface {
        return this.lookObject;
    }

}
