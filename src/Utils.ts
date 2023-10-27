import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './style.css';

export class Utils {

    private constructor() {}

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

    static areVector3AlmostEqual(v1: THREE.Vector3, v2: THREE.Vector3,
            epsilon: number = 0.1): boolean {
        return (Math.abs(v1.x - v2.x) < epsilon &&
                Math.abs(v1.y - v2.y) < epsilon &&
                Math.abs(v1.z - v2.z) < epsilon);
    }

    static getElapsedTime(): number {
        return this.clock.getElapsedTime();
    }

    static getTime(): number {
        return new Date().getTime();
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

    static setEmissiveMesh(mesh: THREE.Mesh,
            emissiveColor: THREE.ColorRepresentation) {
        // @ts-ignore
        mesh.material.emissive.set(emissiveColor);
    }

    static removeEmissiveMesh(mesh: THREE.Mesh): void {
        // @ts-ignore
        mesh.material.emissive.set("black");
    }

    static setEmissiveGLTF(gltfModel: THREE.Group<THREE.Object3DEventMap>,
            intensityValue: number): void {
        gltfModel.traverse((object: THREE.Object3D<THREE.Object3DEventMap>) => {
            // @ts-ignore
            if (object.isMesh) {
                // @ts-ignore
                let material = object.material;
                if (material.emissive) {
                    material.emissiveIntensity = intensityValue;
                }
            }
        })
    }

    static appendSectionHTML(srcId: string, dstId: string): void {
        let srcContent = document.getElementById(srcId);
        if (srcContent != null) {
            let dstContent = document.getElementById(dstId);
            if (dstContent) {
                while (srcContent.firstChild) {
                    dstContent.appendChild(srcContent.firstChild);
                }
            }
        }
    }

    static getElementRect(elId: string): DOMRect {
        const el = document.getElementById(elId);
        if (el != null) {
            return el.getBoundingClientRect();
        }
        return new DOMRect(0, 0, 0, 0);
    }

    static implementsRayCastable(obj: THREE.Object3D): boolean {
        return (
            'onRayCast' in obj && typeof obj.onRayCast === 'function' &&
            'onRayCastLeave' in obj && typeof obj.onRayCastLeave === 'function'
        );
    }

    static getPositionObjectBehind(frontObj: THREE.Object3D, 
            distance: number, ignoreRotation: boolean = false): THREE.Vector3 {
        let rot = frontObj.rotation.clone();
        if (ignoreRotation) frontObj.rotation.set(0, 0, 0);

        let resPosition = new THREE.Vector3();
        frontObj.getWorldPosition(resPosition);
        
        const offset = new THREE.Vector3(0, 0, -distance);
        offset.applyQuaternion(frontObj.getWorldQuaternion(new THREE.Quaternion()));
    
        resPosition.add(offset);

        if (ignoreRotation) frontObj.rotation.copy(rot);

        return resPosition;
    }

    static positionObjectBehind(frontObj: THREE.Object3D, behindObj: THREE.Object3D,
            distance: number, ignoreRotation: boolean = false) {
        if (!ignoreRotation) behindObj.rotation.copy(frontObj.rotation);

        behindObj.position.copy(Utils.getPositionObjectBehind(frontObj, distance, ignoreRotation));
    }

}
