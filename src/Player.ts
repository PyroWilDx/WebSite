import * as THREE from 'three';
import { CameraLerp } from './CameraLerp';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { Scene } from "./Scene";
import { Utils } from "./Utils";

export class Player implements ObjectLookedInterface {
    private static readonly addCameraHeight = 10;

    private playerModel: THREE.Group<THREE.Object3DEventMap> | null;
    private playerSpeed: THREE.Vector3;
    private playerLight: THREE.PointLight;

    constructor(position: THREE.Vector3, scale: number, modelPath: string) {
        this.playerModel = null;
        this.playerSpeed = new THREE.Vector3(1.0, 1.0, 1.0);

        Utils.gltfLoader.load(modelPath, ( gltf ) => {
            this.playerModel = gltf.scene;
            this.playerModel.position.copy(position);
            this.playerModel.scale.set(scale, scale, scale);
            Utils.setEmissiveGLTF(this.playerModel, 200);
            Scene.addEntity(this.playerModel);
        });

        this.playerLight = new THREE.PointLight(0xFFFFFF,
            6000, 0, 1.6);
        this.playerLight.position.copy(position);
        Scene.addEntity(this.playerLight);
    }

    getObjectPosition(): THREE.Vector3 {
        if (this.playerModel != null) return this.playerModel.position;
        return new THREE.Vector3(0, 0, 0);
    }

    onLookProgress(cameraLerp: CameraLerp): void {
        if (this.playerModel != null) {
            let finalPosition = Utils.getPositionObjectBehind(this.playerModel, -20);
            finalPosition.y += Player.addCameraHeight;
            cameraLerp.setFinalPosition(finalPosition);
        }
    }

    onLookEnd(): void {

    }

    onLookInterruption(): void {
        
    }

    addPositionX(x: number): void {
        if (this.playerModel != null) {
            this.playerModel.position.x += x;
            // this.playerLight.position.x += x;
            // this.playerLight.target.position.x += x;
        }
    }

    addPositionY(y: number): void {
        if (this.playerModel != null) {
            this.playerModel.position.y += y;
            // this.playerLight.position.y += y;
            // this.playerLight.target.position.y += y;
        }
    }

    addPositionZ(z: number): void {
        if (this.playerModel != null) {
            this.playerModel.position.z += z;
            // this.playerLight.position.z += z;
            // this.playerLight.target.position.z += z;
        }
    }

    updateFrame(): void {
        if (this.playerModel != null) {
            // this.playerModel.rotation.y += 0.01;

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
            
            if (!Scene.isDisplayingProject() && !Scene.isCameraLerping()) {
                this.playerLight.position.copy(this.playerModel.position);
                
                Utils.positionObjectBehind(this.playerModel, Scene.getCamera(), -20);
                Scene.addCameraHeight(Player.addCameraHeight);
                Scene.camera.lookAt(this.playerModel.position);
            }
        }
    }

}