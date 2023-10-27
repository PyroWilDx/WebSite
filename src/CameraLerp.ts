import * as THREE from 'three';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Scene } from './Scene';

export class CameraLerp {
    private lerpSpeed: number;
    private rotateSpeed: number;

    private lookAtObject: boolean;

    private camera: THREE.PerspectiveCamera;
    private finalPosition: THREE.Vector3;
    private lookObject: ObjectLookedInterface;
    
    private distEpsilon: number;
    private rotEpsilon: number;

    constructor(camera: THREE.PerspectiveCamera,
            finalPosition: THREE.Vector3, lookObject: ObjectLookedInterface) {
        this.lerpSpeed = 0.026;
        this.rotateSpeed = 0.08;

        this.lookAtObject = true;
        
        this.camera = camera;
        this.finalPosition = finalPosition;
        this.lookObject = lookObject;
        

        this.distEpsilon = 1;
        this.rotEpsilon = 0.002

        this.lookObject.onLookStart(this);
    }

    updateFrame() {
        this.camera.position.lerp(this.finalPosition, this.lerpSpeed);

        let tmpCam = this.camera.clone();
        
        if (this.lookAtObject) tmpCam.lookAt(this.lookObject.getObjectPosition());
        
        this.camera.quaternion.slerp(tmpCam.quaternion, this.rotateSpeed);

        this.lookObject.onLookProgress(this);

        if (this.camera.position.distanceTo(this.finalPosition) < this.distEpsilon &&
                Math.abs(this.camera.quaternion.dot(tmpCam.quaternion)) > 1 - this.rotEpsilon) {
            this.lookObject.onLookEnd();
            Scene.removeCameraLerp();
        }
    }

    setSpeeds(lerpSpeed: number, rotateSpeed: number): void {
        this.lerpSpeed = lerpSpeed;
        this.rotateSpeed = rotateSpeed;
    }

    setLookAtObject(lookAtObject: boolean): void {
        this.lookAtObject = lookAtObject;
    }

    setEpsilons(distEpsilon: number, rotEpsilon: number): void {
        this.distEpsilon = distEpsilon;
        this.rotEpsilon = rotEpsilon;
    }

    setFinalPosition(finalPosition: THREE.Vector3): void {
        this.finalPosition = finalPosition;
    }

    getLookObject(): ObjectLookedInterface {
        return this.lookObject;
    }

}
