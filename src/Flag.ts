import * as THREE from 'three';
import { Scene } from './Scene';
import { Utils } from './Utils';

export class Flag {

    private flagW: number;
    private flagH: number;
    private flagMesh: THREE.Mesh;
    private flagStickRadius: number;
    private flagStickH: number;
    private flagStickMesh: THREE.Mesh;
    private halfFlagW: number;
    private AX1: number;
    private DX1: number;
    private AX2: number;
    private DX2: number;
    private AY1: number;
    private DY1: number;
    private AY2: number;
    private DY2: number; 

    constructor(flagW: number, flagH: number, flagImgPath: string,
        flagStickRadius: number, flagStickH: number, flagStickColor: number,) {
        this.flagW = flagW;
        this.flagH = flagH;
        this.flagMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(flagW, flagH, flagW, flagH),
            new THREE.MeshBasicMaterial({
                map: Utils.textureLoader.load(flagImgPath),
                side: THREE.DoubleSide
            })
        );
        Scene.scene.add(this.flagMesh);

        this.flagStickRadius = flagStickRadius;
        this.flagStickH = flagStickH;
        this.flagStickMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(flagStickRadius, flagStickRadius,
                flagStickH, 32, 32),
            new THREE.MeshBasicMaterial({
                color: flagStickColor,
                side: THREE.FrontSide
            })
        )
        Scene.scene.add(this.flagStickMesh);

        this.halfFlagW = this.flagW / 2;

        let ratio = (this.flagW / 10 + this.flagH / 6) / 2;
        this.AX1 = 0.52 * ratio;
        this.DX1 = 2 / ratio;
        this.AX2 = 0.26 * ratio;
        this.DX2 = 3.02 / ratio;
        this.AY1 = 0.1 * ratio;
        this.DY1 = 2 / ratio;
        this.AY2 = 0.042 * ratio;
        this.DY2 = 3.02 / ratio;
    }

    setPositionFromDown(position: THREE.Vector3) {
        let flagPosition = position.clone();
        let flagStickPosition = position.clone();
        flagPosition.y += this.flagStickH - this.flagH / 2;
        flagPosition.x += this.flagW / 2 + this.flagStickRadius;
        flagStickPosition.y += this.flagStickH / 2;
        this.flagMesh.position.copy(flagPosition);
        this.flagStickMesh.position.copy(flagStickPosition);
    }

    updateFrame(): void {
        let position = this.flagMesh.geometry.attributes.position;

        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);
            const t = Utils.clock.getElapsedTime();

            const waveX1 = this.AX1 * Math.sin(x * this.DX1 + t * 3.02);
            const waveX2 = this.AX2 * Math.sin(x * this.DX2 + t * 2);
            const waveY1 = this.AY1 * Math.sin(y * this.DY1 + t * 0.52);
            const waveY2 = this.AY2 * Math.sin(y * this.DY2 + t * 0.36);
            const ig = (x + this.halfFlagW) / this.flagW;
            
            position.setZ(i, (waveX1 + waveX2 + waveY1 + waveY2) * ig);
        }

        this.flagMesh.geometry.attributes.position.needsUpdate = true;
    }

}
