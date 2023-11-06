import * as THREE from 'three';
import { CameraLerp } from './CameraLerp';
import { MainInit } from './MainInit';
import { ObjectLookedInterface } from "./ObjectLookedInterface";
import { Scene } from './Scene';
import { Utils } from './Utils';

export class CameraFollowObject extends THREE.Mesh implements ObjectLookedInterface {

    getObjectPosition(): THREE.Vector3 {
        return this.position;
    }

    setCameraLerpParams(cameraLerp: CameraLerp): void {
        let finalPosition = Utils.getObjectBehindPosition(this, -MainInit.scrollLengthAdv);
        cameraLerp.setFinalPosition(finalPosition);
        let i = Math.floor(MainInit.i / MainInit.scrollLengthAdv);
        cameraLerp.setLookQuaternion(MainInit.quaternionList[i]);
    }

    onLookStart(cameraLerp: CameraLerp): void {
        Scene.cameraFollowingObj = true;
        cameraLerp.multiplySpeeds(1.2);
        cameraLerp.setEpsilons(0, 0);
        cameraLerp.setMaxDist(0.02);

        this.setCameraLerpParams(cameraLerp);
    }

    onLookProgress(cameraLerp: CameraLerp): void {
        this.setCameraLerpParams(cameraLerp);
    }

    onLookEnd(): void {
        Scene.cameraFollowingObj = false;
    }

    onLookInterruption(): void {
        Scene.cameraFollowingObj = false;
    }

}
