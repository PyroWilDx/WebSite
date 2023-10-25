import * as THREE from 'three';
import { Utils } from './Utils';

export class RotatingObject extends THREE.Mesh {

    private rSpeed: THREE.Vector3;

    constructor(geometry: THREE.BufferGeometry, 
            material: THREE.Material | THREE.Material[],
            rSpeed: THREE.Vector3) {
        super(geometry, material);
        this.rSpeed = rSpeed;
        
        let rRot = Utils.getRandomVector3(0, 2 * Math.PI);
        this.rotation.set(rRot.x, rRot.y, rRot.z);
    }

    rotate(): void {
        this.rotation.x += this.rSpeed.x;
        this.rotation.y += this.rSpeed.y;
        this.rotation.z += this.rSpeed.z;
    }

}