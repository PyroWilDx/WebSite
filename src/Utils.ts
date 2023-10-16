import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Flag } from './Flag';
import { Galaxy } from './Galaxy';
import { Scene } from './Scene';
import './style.css';

export class Utils {

    private constructor() {}

    public static readonly worldRadius: number = 1000;

    public static readonly clock: THREE.Clock = new THREE.Clock();
    public static readonly rayCaster: THREE.Raycaster = new THREE.Raycaster();
    
    public static readonly textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    public static readonly gltfLoader: GLTFLoader = new GLTFLoader();

    public static isMouseDown: boolean = false;
    public static lastMousePosition: THREE.Vector2 = new THREE.Vector2(0, 0);
    public static mousePosition: THREE.Vector2 = new THREE.Vector2(0, 0);
    public static keyMap: { [key: string]: boolean } = {};

    static getRandomVector3Spread(value: number): THREE.Vector3 {
        let randomVec: THREE.Vector3 = new THREE.Vector3();
        randomVec.x = THREE.MathUtils.randFloatSpread(value);
        randomVec.y = THREE.MathUtils.randFloatSpread(value);
        randomVec.z = THREE.MathUtils.randFloatSpread(value);
        return randomVec;
    }

    static getRandomVector3(start: number, end: number): THREE.Vector3 {
        let randomVec: THREE.Vector3 = new THREE.Vector3();
        randomVec.x = THREE.MathUtils.randFloat(start, end);
        randomVec.y = THREE.MathUtils.randFloat(start, end);
        randomVec.z = THREE.MathUtils.randFloat(start, end);
        return randomVec;
    }

    static updateMousePosition(event: MouseEvent): void {
        Utils.lastMousePosition.copy(Utils.mousePosition);
        Utils.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        Utils.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    static updateKeyMap(key: string, value: boolean): void {
        this.keyMap[key] = value;
        if (key >= 'a' && key <= 'z') {
            this.keyMap[key.toUpperCase()] = value;
        } else if (key >= 'A' && key <= 'Z') {
            this.keyMap[key.toLowerCase()] = value;
        }
    }

    static isKeyPressed(key: string): boolean {
        return this.keyMap[key];
    }

    static rayCastFlags(galaxy: Galaxy): Flag | null {
        Utils.rayCaster.setFromCamera(Utils.mousePosition, Scene.camera);
        const intersected = Utils.rayCaster.intersectObjects(galaxy.getAllFlagsMesh());
        if (intersected.length > 0) {
            const obj = intersected[0].object;
            if (obj instanceof THREE.Mesh) {
                let flagMesh = obj as THREE.Mesh;
                return galaxy.getFlagFromMesh(flagMesh);
            }
        }
        return null;
    }

}
