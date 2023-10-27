import * as THREE from 'three';
import { CameraLerp } from './CameraLerp';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Scene } from "./Scene";
import { Utils } from "./Utils";

export class Player extends THREE.Group<THREE.Object3DEventMap> implements ObjectLookedInterface {
    private static readonly addCameraHeight = 10;

    private playerSpeed: THREE.Vector3;
    private playerLight: THREE.PointLight;

    private playerLocked: boolean;

    private realY: number;

    constructor(playerModel: THREE.Group<THREE.Object3DEventMap>, scale: number) {
        super();

        this.add(playerModel);
        this.position.set(0, 0, 0);
        this.scale.set(scale, scale, scale);

        Utils.setEmissiveGLTF(this, 200);
        Scene.addEntity(this);

        this.playerSpeed = new THREE.Vector3(1.0, 1.0, 1.0);

        this.playerLight = new THREE.PointLight(0xFFFFFF,
            6000, 0, 1.6);
        Scene.addEntity(this.playerLight);

        this.playerLocked = false;

        this.realY = 0;

        Scene.setCameraLerp(this.getCameraPosition(), this);
    }

    getObjectPosition(): THREE.Vector3 {
        return this.position;
    }

    onLookStart(cameraLerp: CameraLerp): void {
        this.playerLocked = false;

        Scene.setCameraRotation(new THREE.Vector3(0, 0, 0));

        cameraLerp.setEpsilons(0, 0);
        cameraLerp.setLookAtObject(false);
        cameraLerp.setSpeeds(0.08, 0);
    }

    onLookProgress(cameraLerp: CameraLerp): void {
        cameraLerp.setFinalPosition(this.getCameraPosition());
    }

    onLookEnd(): void {

    }

    onLookInterruption(): void {
        
    }

    getCameraPosition(): THREE.Vector3 {
        let resPosition = Utils.getPositionObjectBehind(this, -30, true);
        resPosition.x += 30;
        resPosition.y = this.realY + Player.addCameraHeight;
        return resPosition;
    }

    addPositionX(x: number): void {
        if (!this.playerLocked) {
            this.position.x += x;
        }
    }

    addPositionY(y: number): void {
        if (!this.playerLocked) {
            this.position.y += y;
            this.realY += y;
        }
    }

    addPositionZ(z: number): void {
        if (!this.playerLocked) {
            this.position.z += z;
        }
    }

    updateFrame(): void {
        this.rotation.y += 0.01;

        if (!this.playerLocked) {
            if (Utils.isKeyPressed('z') || Utils.isKeyPressed('Z')) {
                this.addPositionZ(-this.playerSpeed.z);
            }
            if (Utils.isKeyPressed('s') || Utils.isKeyPressed('S')) {
                this.addPositionZ(this.playerSpeed.z);
            }
            if (Utils.isKeyPressed('d') || Utils.isKeyPressed('D')) {
                this.addPositionX(this.playerSpeed.x);
            }
            if (Utils.isKeyPressed('q') || Utils.isKeyPressed('Q')) {
                this.addPositionX(-this.playerSpeed.x);
            }
            if (Utils.isKeyPressed(" ")) {
                this.addPositionY(this.playerSpeed.y);
            }
            if (Utils.isKeyPressed("Shift")) {
                this.addPositionY(-this.playerSpeed.y);
            }
        }
        
        this.playerLight.position.copy(this.position);
    }

    setPlayerLocked(playerLocked: boolean): void {
        this.playerLocked = playerLocked;
    }

}