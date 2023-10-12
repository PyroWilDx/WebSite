import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Scene } from './Scene.ts';

export class Planet {

    private planetModel: THREE.Group<THREE.Object3DEventMap>;
    private ringMeshes: THREE.Mesh[];

    constructor(modelPath: string, scale: THREE.Vector3,
            position: THREE.Vector3) {
        this.planetModel = new THREE.Group<THREE.Object3DEventMap>();

        new GLTFLoader().load(modelPath, ( gltf ) => {
            this.planetModel = gltf.scene;
            this.planetModel.scale.copy(scale);
            this.planetModel.position.copy(position);

            Scene.addEntity(this.planetModel);
        });

        this.planetModel.scale.copy(scale);
        this.planetModel.position.copy(position);
        this.ringMeshes = [];
    }

    addRing(size: number, length: number, texturePath: string | null,
                colorV: number | null): void {
        let ringMesh;
        if (colorV != null) {
            ringMesh = new THREE.Mesh(
                new THREE.RingGeometry(size,
                    size + length / this.planetModel.scale.x, 64),
                new THREE.MeshStandardMaterial({
                    color: colorV,
                    side: THREE.DoubleSide
                })
            ); 
        } else {
            ringMesh = new THREE.Mesh(
                new THREE.RingGeometry(size,
                size + length / this.planetModel.scale.x, 64),
                new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(texturePath!),
                side: THREE.DoubleSide
                })
            );
        }
        this.planetModel.getWorldPosition(ringMesh.position);
        this.planetModel.getWorldScale(ringMesh.scale);
        ringMesh.rotation.set(THREE.MathUtils.randFloat(0, 2 * Math.PI),
            THREE.MathUtils.randFloat(0, 2 * Math.PI),
            THREE.MathUtils.randFloat(0, 2 * Math.PI));
        
        Scene.addEntity(ringMesh);
        this.ringMeshes.push(ringMesh);
    }
    
    updateFrame(): void {
        this.planetModel.rotation.x += 0.001;
        this.planetModel.rotation.y += 0.0016;
        this.planetModel.rotation.z += 0.001;
    
        for (const currRingMesh of this.ringMeshes) {
            currRingMesh.rotation.x += THREE.MathUtils.randFloat(0.002, 0.012);
            currRingMesh.rotation.y += THREE.MathUtils.randFloat(0.002, 0.012);
            currRingMesh.rotation.z += THREE.MathUtils.randFloat(0.002, 0.012);
        }
    }

}
