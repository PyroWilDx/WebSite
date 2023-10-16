import * as THREE from 'three';
import { Flag } from './Flag.ts';
import { Scene } from './Scene.ts';
import { Utils } from './Utils.ts';

export class Planet {

    private radius: number;
    private planetMesh: THREE.Mesh;
    private ringMeshes: THREE.Mesh[];
    private flag: Flag | null;

    constructor(imgPath: string, radius: number,
            position: THREE.Vector3) {
        this.radius = radius;

        let nVerticles = Math.max(64, radius / 4);
        nVerticles = Math.min(160, nVerticles);
        this.planetMesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, nVerticles, nVerticles),
            new THREE.MeshBasicMaterial({
                map: Utils.textureLoader.load(imgPath),
                side: THREE.FrontSide
            })
        );
        this.planetMesh.position.copy(position);
        Scene.addEntity(this.planetMesh);
        
        this.ringMeshes = [];
        this.flag = null;
    }

    addRing(start: number, length: number, texturePath: string | null,
                colorV: number | null): void {
        let tStart = start + this.radius;

        let nVerticles = Math.max(64, (tStart + length) / 4);
        nVerticles = Math.min(160, nVerticles);
        let ringMesh: THREE.Mesh | null = null;
        if (colorV != null) {
            ringMesh = new THREE.Mesh(
                new THREE.RingGeometry(tStart, tStart + length, nVerticles),
                new THREE.MeshBasicMaterial({
                    color: colorV,
                    side: THREE.DoubleSide
                })
            ); 
        }
        if (texturePath != null) {
            ringMesh = new THREE.Mesh(
                new THREE.RingGeometry(tStart, tStart + length, nVerticles),
                new THREE.MeshBasicMaterial({
                    map: Utils.textureLoader.load(texturePath),
                    side: THREE.DoubleSide
                })
            );
        }

        if (ringMesh != null) {
            this.planetMesh.getWorldPosition(ringMesh.position);
            ringMesh.rotation.set(THREE.MathUtils.randFloat(0, 2 * Math.PI),
                THREE.MathUtils.randFloat(0, 2 * Math.PI),
                THREE.MathUtils.randFloat(0, 2 * Math.PI));
            Scene.addEntity(ringMesh);
            this.ringMeshes.push(ringMesh);
        }
    }
    
    updateFrame(): void {
        this.planetMesh.rotation.x += 0.001;
        this.planetMesh.rotation.y += 0.0016;
        this.planetMesh.rotation.z += 0.001;
    
        for (const currRingMesh of this.ringMeshes) {
            currRingMesh.rotation.x += THREE.MathUtils.randFloat(0.002, 0.012);
            currRingMesh.rotation.y += THREE.MathUtils.randFloat(0.002, 0.012);
            currRingMesh.rotation.z += THREE.MathUtils.randFloat(0.002, 0.012);
        }

        if (this.flag != null) {
            this.flag.updateFrame();
        }
    }

    setFlag(flag: Flag): void {
        this.flag = flag;
        let flagPosition = this.planetMesh.position.clone();
        flagPosition.y += this.radius - 10;
        this.flag.setPositionFromDown(flagPosition);
    }

    getFlag(): Flag | null {
        return this.flag;
    }

}
