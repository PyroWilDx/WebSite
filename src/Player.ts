import * as THREE from 'three';
import { Scene } from "./Scene";
import { Utils } from "./Utils";

export class Player {
    public static readonly cameraXDist: number = 0;
    public static readonly cameraYDist: number = 6;
    public static readonly cameraZDist: number = 20;

    private playerModel: THREE.Group<THREE.Object3DEventMap> | null;
    private playerSpeed: THREE.Vector3;
    private playerLight: THREE.PointLight;

    constructor(position: THREE.Vector3, scale: number, modelPath: string) {
        this.playerModel = null;
        this.playerSpeed = new THREE.Vector3(1, 1, 1);

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

    getPosition(): THREE.Vector3 {
        if (this.playerModel != null) return this.playerModel.position;
        return new THREE.Vector3(0, 0, 0);
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

            let playerPosition = this.playerModel.position;
            
            this.playerLight.position.copy(playerPosition);

            // Scene.setCameraPosition(
            //     new THREE.Vector3(
            //         playerPosition.x + Player.cameraXDist, 
            //         playerPosition.y + Player.cameraYDist,
            //         playerPosition.z + Player.cameraZDist));
        }
    }

}