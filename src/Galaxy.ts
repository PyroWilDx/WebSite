import * as THREE from 'three';
import { Flag } from './Flag.ts';
import { Planet } from './Planet.ts';
import { Player } from './Player.ts';
import { Scene } from './Scene.ts';
import { Star } from './Star.ts';
import { Utils } from './Utils.ts';

export class Galaxy {
    private radius: number;
    private allStars: Star[];
    private allPlanets: Planet[];
    private player: Player | null;
    private currFlag: Flag | null = null;

    constructor(radius: number, ) {
        this.radius = radius;
        this.allStars = [];
        this.allPlanets = [];
        this.player = null;
    }

    addBackgroundImg(backgroundPath: string) {
        let backgroundMesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, 160, 160),
            new THREE.MeshStandardMaterial({ 
                map: Utils.textureLoader.load(backgroundPath),
                side: THREE.BackSide
              })
        );
        Scene.addEntity(backgroundMesh);
    }

    addStars(nStars: number, modelPath: string): void {
        Utils.gltfLoader.load(modelPath, ( gltf ) => {
            let baseStarModel = gltf.scene;
            Utils.setEmissiveIntensityToGLTF(baseStarModel, 50);
            for (let i = 0; i < nStars; i++) {
                let currStar: Star = new Star(baseStarModel.clone(),
                    THREE.MathUtils.randFloat(0.004, 0.02),
                    THREE.MathUtils.randFloat(0.0001, 0.001),
                    Utils.getRandomVector3Spread(this.radius / 1.2));

                    this.allStars.push(currStar);
            }
        });
    }

    addPlanet(planet: Planet) {
        this.allPlanets.push(planet);
    }

    setRocket(rocket: Player) {
        this.player = rocket;
    }

    getAllFlagsMesh(): THREE.Object3D[] {
        let flags: THREE.Object3D[] = [];
        for (const currPlanet of this.allPlanets) {
            let flag = currPlanet.getFlag();
            if (flag != null) flags.push(flag.getMesh());
        }
        return flags;
    }

    getFlagFromMesh(flagMesh: THREE.Mesh): Flag | null {
        for (const currPlanet of this.allPlanets) {
            let flag = currPlanet.getFlag();
            if (flag != null) {
                if (flag.getMesh() === flagMesh) {
                    return flag;
                }
            }
        }
        return null;
    }

    rayCastFlags(): void {
        Utils.rayCaster.setFromCamera(Utils.mousePosition, Scene.camera);
        const intersected = Utils.rayCaster.intersectObjects(this.getAllFlagsMesh());
        if (intersected.length > 0) {
            const obj = intersected[0].object;
            if (obj instanceof THREE.Mesh) {
                if (this.currFlag != null) this.currFlag.glowEffect(false);

                let flagMesh = obj as THREE.Mesh;                
                this.currFlag = this.getFlagFromMesh(flagMesh);
                if (this.currFlag != null) this.currFlag.glowEffect(true);
                return;
            }
        }
        if (this.currFlag != null) {
            this.currFlag.glowEffect(false);
            this.currFlag = null;
        }
    }

    updateFrame(): void {
        for (const currStar of this.allStars) {
            currStar.updateFrame();
        }
        for (const currPlanet of this.allPlanets) {
            currPlanet.updateFrame();
        }
        if (this.player != null) this.player.updateFrame();
    }
}
