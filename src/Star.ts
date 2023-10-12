import * as THREE from 'three';
import { Scene } from './Scene.ts';

export class Star {
    private starModel: THREE.Group<THREE.Object3DEventMap>;
    private rotationSpeed: number;
    private moveSpeed: number;
    private basePosition: THREE.Vector3;
    private baseDistToOrigin: number;
    private currAngle: number;
    private rotDirection: number;

    constructor(starModel: THREE.Group<THREE.Object3DEventMap>, 
            rotationSpeed: number, moveSpeed: number, 
            basePosition: THREE.Vector3) {
        this.starModel = starModel;
        this.rotationSpeed = rotationSpeed;
        this.moveSpeed = moveSpeed;
        this.basePosition = basePosition;
        starModel.position.set(basePosition.x,
            basePosition.y, basePosition.z);
        this.baseDistToOrigin = starModel.position.length();
        this.currAngle = THREE.MathUtils.randFloat(0, 2 * Math.PI);
        this.rotDirection = (Math.random() < 0.5) ? 1 : -1;

        Scene.addEntity(starModel);
    }

    updateFrame(): void {
        this.starModel.rotation.x += this.rotationSpeed;

        let baseX = this.basePosition.x;
        let baseY = this.basePosition.y;
        let baseZ = this.basePosition.z;
        this.starModel.position.set(baseX + Math.cos(this.currAngle) * this.baseDistToOrigin,
            baseY + Math.sin(this.currAngle) * this.baseDistToOrigin,
            baseZ + Math.cos(this.currAngle) * Math.sin(this.currAngle) * this.baseDistToOrigin);
    
        this.currAngle += this.moveSpeed * this.rotDirection;
    }

}
