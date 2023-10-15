import * as THREE from 'three';

export class Scene {
    public static scene: THREE.Scene;
    public static camera: THREE.PerspectiveCamera;
    public static renderer: THREE.WebGLRenderer;
    public static globalLight: THREE.AmbientLight;

    static initScene(): void {
        Scene.scene = new THREE.Scene();

        Scene.camera  = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 2000);
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
        Scene.scene.add(Scene.globalLight);
    }

    static renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    static addEntity(entity: any) {
        this.scene.add(entity);
    };

}