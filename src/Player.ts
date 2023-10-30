import * as THREE from 'three';
import { CameraLerp } from './CameraLerp';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Scene } from "./Scene";
import { Utils } from "./Utils";

export class Player extends THREE.Group<THREE.Object3DEventMap> implements ObjectLookedInterface {
    private static readonly cameraFollowFactor: number = 0.8;
    private static readonly addCameraHeight: number = 12;

    private playerSpeed: THREE.Vector3;
    private playerLight: THREE.PointLight;

    private playerLocked: boolean;

    private movingElapsedTime: number;
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

        this.movingElapsedTime = 0;
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
        let resPosition = Utils.getObjectBehindPosition(this, -30, true);
        // resPosition.x += 20;
        resPosition.y = this.realY + Player.addCameraHeight;
        return resPosition;
    }

    addPositionX(x: number): void {
        if (!this.playerLocked) {
            this.position.x += x;
            Scene.addCameraPosition(x * Player.cameraFollowFactor, 0, 0);
        }
    }

    addPositionY(y: number): void {
        if (!this.playerLocked) {
            this.position.y += y;
            this.realY += y;
            Scene.addCameraPosition(0, y * Player.cameraFollowFactor, 0);
        }
    }

    addPositionZ(z: number): void {
        if (!this.playerLocked) {
            this.position.z += z;
            Scene.addCameraPosition(0, 0, z * Player.cameraFollowFactor);
        }
    }

    updateFrame(): void {
        this.rotation.y += 0.01;

        if (!this.playerLocked) {
            let forward = Utils.isKeyPressed('z') || Utils.isKeyPressed('Z');
            let backward = Utils.isKeyPressed('s') || Utils.isKeyPressed('S');
            let right = Utils.isKeyPressed('d') || Utils.isKeyPressed('D');
            let left = Utils.isKeyPressed('q') || Utils.isKeyPressed('Q');
            let up = Utils.isKeyPressed(" ");
            let down = Utils.isKeyPressed("Shift");
            let moved = forward || backward || right || left;

            if (forward) this.addPositionZ(-this.playerSpeed.z * Utils.dt);
            if (backward) this.addPositionZ(this.playerSpeed.z * Utils.dt);
            if (right) this.addPositionX(this.playerSpeed.x * Utils.dt);
            if (left) this.addPositionX(-this.playerSpeed.x * Utils.dt);
            if (up) this.addPositionY(this.playerSpeed.y * Utils.dt);
            if (down) this.addPositionY(-this.playerSpeed.y * Utils.dt);

            if (moved) this.movingElapsedTime += Utils.dt;
        }

        this.position.y = this.realY + 4 * Math.sin(Utils.getElapsedTime());
        
        this.playerLight.position.copy(this.position);
    }

    setPlayerLocked(playerLocked: boolean): void {
        this.playerLocked = playerLocked;
    }

}