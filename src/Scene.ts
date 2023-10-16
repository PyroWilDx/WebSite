import * as THREE from 'three';
import { Utils } from './Utils';

export class Scene {
    public static scene: THREE.Scene;
    public static camera: THREE.PerspectiveCamera;
    public static renderer: THREE.WebGLRenderer;
    public static globalLight: THREE.AmbientLight;

    static initScene(): void {
        Scene.scene = new THREE.Scene();

        Scene.camera  = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight,
            0.1, Utils.worldRadius * 2);
        Scene.camera.position.setZ(30);

        Scene.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg')!,
            antialias: true,
            logarithmicDepthBuffer: true
        });
        Scene.renderer.setPixelRatio(window.devicePixelRatio);
        Scene.renderer.setSize(window.innerWidth, window.innerHeight);
        Scene.renderer.render(Scene.scene, Scene.camera);

        Scene.globalLight = new THREE.AmbientLight(0xFFFFFF);
        Scene.addEntity(Scene.globalLight);
    }

    static addEntity(entity: THREE.Object3D): void {
        this.scene.add(entity);
    };

    static renderScene(): void {
        this.renderer.render(this.scene, this.camera);
    }

    static setCameraPosition(position: THREE.Vector3): void {
        this.camera.position.copy(position);
    }

    static setCameraRotation(rotation: THREE.Vector3): void {
        this.camera.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    static addCameraRotation(addRotation: THREE.Vector3): void {
        let cameraRotation = this.camera.rotation;
        let finalRotation = addRotation.clone();
        finalRotation.x += cameraRotation.x;
        finalRotation.y += cameraRotation.y;
        finalRotation.z += cameraRotation.z;

        Scene.setCameraRotation(finalRotation);
    }

}