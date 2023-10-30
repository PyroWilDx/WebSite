import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { CameraLerp } from './CameraLerp';
import { Galaxy } from './Galaxy';
import { ObjectLookedInterface } from './ObjectLookedInterface';
import { ProjectDisplayer, ProjectDisplayerInterface } from './ProjectDisplayerInterface';
import { Utils } from './Utils';

export class Scene {
    public static readonly worldRadius: number = 2000;
    public static readonly quitProjectDisplayerLeftX: number = -0.628;
    public static readonly quitProjectDisplayerRightX: number = 0.612;

    public static readonly baseWidth: number = 1448;
    public static readonly baseHeight: number = 674;
    public static readonly baseScreenRatio: number = Scene.baseWidth / Scene.baseHeight;
    public static screenRatio: number = Scene.getScreenRatio();

    public static galaxy: Galaxy;

    public static scene: THREE.Scene;
    public static camera: THREE.PerspectiveCamera;
    public static renderer: THREE.WebGLRenderer;
    public static globalLight: THREE.AmbientLight;

    public static effectComposer: EffectComposer;

    public static cameraLerp: CameraLerp | null;

    public static readonly fadeInDuration: number = 600;
    public static projectDisplayer: ProjectDisplayer | null;
    public static projBgContainerId: string = "main";
    public static rmDisplayHold: boolean = false;

    static initScene(): void {
        Scene.scene = new THREE.Scene();

        Scene.camera  = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight,
            0.1, Scene.worldRadius * 2);
        Scene.camera.position.setZ(30);

        Scene.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg')!,
            antialias: true,
            logarithmicDepthBuffer: true
        });
        Scene.renderer.setPixelRatio(window.devicePixelRatio);
        Scene.renderer.setSize(window.innerWidth, window.innerHeight);
        Scene.renderer.render(Scene.scene, Scene.camera);

        Scene.globalLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
        Scene.addEntity(Scene.globalLight);

        let renderPass = new RenderPass(Scene.scene, Scene.camera);
        Scene.effectComposer = new EffectComposer(Scene.renderer);
        Scene.effectComposer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.16,
            1,
            1
        );
        Scene.composerAddPass(bloomPass);

        Scene.cameraLerp = null;

        Scene.projectDisplayer = null;

        Scene.galaxy = new Galaxy(Scene.worldRadius);
    }

    static addEntity(entity: THREE.Object3D): void {
        Scene.scene.add(entity);
    };

    static removeEntity(entity: THREE.Object3D): void {
        Scene.scene.remove(entity);
    }

    static getChildren(): THREE.Object3D[] {
        return Scene.scene.children;
    }

    static composerAddPass(pass: UnrealBloomPass): void {
        Scene.effectComposer.addPass(pass);
    }

    static getScreenRatio(): number {
        return window.innerWidth / window.innerHeight;
    }

    static updateRenderSize(): void {
        let ratio = Scene.getScreenRatio();

        Scene.camera.aspect = window.innerWidth / window.innerHeight;
        Scene.camera.updateProjectionMatrix();
        
        Scene.renderer.setSize(window.innerWidth, window.innerHeight);

        Scene.screenRatio = ratio;
    }

    static getScreenWidthRatio(): number {
        return Scene.baseWidth / window.innerWidth;
    }

    static getScreenHeightRatio(): number {
        return Scene.baseHeight / window.innerHeight;
    }

    static getScreenSizeRatio(): number {
        return Scene.screenRatio / Scene.baseScreenRatio;
    }

    static renderScene(): void {
        Scene.effectComposer.render();
    }

    static setCameraPosition(position: THREE.Vector3): void {
        Scene.camera.position.copy(position);
    }

    static addCameraPosition(addX: number, addY: number, addZ: number) {
        Scene.camera.position.x += addX;
        Scene.camera.position.y += addY;
        Scene.camera.position.z += addZ;
    }

    static addCameraHeight(value: number) {
        Scene.camera.position.y += value;
    }

    static setCameraRotation(rotation: THREE.Vector3): void {
        Scene.camera.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    static addCameraRotation(addRotation: THREE.Vector3): void {
        let cameraRotation = Scene.camera.rotation;
        let finalRotation = addRotation.clone();
        finalRotation.x += cameraRotation.x;
        finalRotation.y += cameraRotation.y;
        finalRotation.z += cameraRotation.z;

        Scene.setCameraRotation(finalRotation);
    }

    static getCamera(): THREE.Camera {
        return Scene.camera;
    }

    static setCameraLerp(finalPosition: THREE.Vector3, lookObject: ObjectLookedInterface): CameraLerp {
        let lastLookObject = Scene.getCameraLerpObject();
        
        Scene.cameraLerp = new CameraLerp(Scene.camera, finalPosition, lookObject);

        if (lastLookObject != null) {
            lastLookObject.onLookInterruption();
        }

        return Scene.cameraLerp;
    }

    static removeCameraLerp(): void {
        Scene.cameraLerp = null;
    }

    static isCameraLerping(): boolean {
        return (Scene.cameraLerp != null);
    }

    static getCameraLerpObject(): ObjectLookedInterface | null {
        if (Scene.cameraLerp != null) {
            return Scene.cameraLerp.getLookObject();
        }
        return null;
    }

    static setProjectDisplayer(displayer: ProjectDisplayerInterface,
            displayed: HTMLElement): void {
        displayed.style.display = "";
        displayed.style.opacity = "0";

        if (Scene.isDisplayingProject()) {
            Scene.removeProjectDisplayer();
        }
        let startTime = Utils.getTime();
        Scene.projectDisplayer = {displayer, displayed, startTime};
    }

    static isDisplayingProject(): boolean {
        return (Scene.projectDisplayer != null);
    }

    static getProjectDisplayer(): ProjectDisplayerInterface | null {
        if (Scene.projectDisplayer != null) {
            return Scene.projectDisplayer.displayer;
        }
        return null;
    }

    static removeProjectDisplayer(): void {
        if (Scene.isDisplayingProject()) {
            // @ts-ignore
            Scene.projectDisplayer.displayed.style.display = "none";

            // @ts-ignore
            let displayer = Scene.projectDisplayer.displayer;

            Scene.projectDisplayer = null;
            
            displayer.onProjectHideDisplay();

            let player = Scene.galaxy.getPlayer();
            if (player != null) {
                Scene.setCameraLerp(player.getCameraPosition(), player);
            }
        }
    }

    static updateFrame(): void {
        if (Scene.cameraLerp != null) {
            Scene.cameraLerp.updateFrame();
        }
        if (Scene.isDisplayingProject()) {
            // @ts-ignore
            let elapsed = (Utils.getTime() - Scene.projectDisplayer.startTime)
            // @ts-ignore
            Scene.projectDisplayer.displayed.style.opacity = (elapsed / Scene.fadeInDuration).toString();
            // @ts-ignore
            Scene.projectDisplayer.displayer.updateFrameDisplayer();
        }
        Scene.renderScene();
    }

}