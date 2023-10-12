import * as THREE from 'three';
import './style.css';

export class Utils {

    private constructor() {}

    public static readonly worldRadius: number = 1000;

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

}
