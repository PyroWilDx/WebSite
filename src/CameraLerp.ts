import * as THREE from 'three';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Scene } from './Scene';
import { Utils } from './Utils';

export class CameraLerp {
    private lerpSpeed: number;
    private rotateSpeed: number;

    private lookAtObject: boolean;

    private camera: THREE.PerspectiveCamera;
    private finalPosition: THREE.Vector3;
    private lookPosition: THREE.Vector3 | null;
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
        this.lookPosition = null;
        this.lookObject = lookObject;
        
        this.distEpsilon = 1;
        this.rotEpsilon = 0.002

        this.lookObject.onLookStart(this);
    }

    updateFrame() {
        this.camera.position.lerp(this.finalPosition, this.lerpSpeed * Utils.dt);

        let tmpCam = this.camera.clone();
        
        if (this.lookAtObject) {
            let lookAtPos: THREE.Vector3;
            if (this.lookPosition != null) lookAtPos = this.lookPosition;
            else lookAtPos = this.lookObject.getObjectPosition();
            tmpCam.lookAt(lookAtPos);
        }
        
        this.camera.quaternion.slerp(tmpCam.quaternion, this.rotateSpeed * Utils.dt);

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

    setLookPosition(lookPosition: THREE.Vector3): void {
        this.lookPosition = lookPosition;
    }

    getLookObject(): ObjectLookedInterface {
        return this.lookObject;
    }

}
