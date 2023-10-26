import * as THREE from 'three';
import { Flag } from './Flag.ts';
import { Planet } from './Planet.ts';
import { Player } from './Player.ts';
import { RayCastableInterface } from './RayCastableInterface.ts';
import { Scene } from './Scene.ts';
import { Star } from './Star.ts';
import { Utils } from './Utils.ts';

export class Galaxy {
    private radius: number;
    private allStars: Star[];
    private allPlanets: Planet[];
    private player: Player | null;

    private currHoldFlag: Flag | null;
    private currFlag: Flag | null;

    private rayCastedObjects: RayCastableInterface[];

    constructor(radius: number) {
        this.radius = radius;
        this.allStars = [];
        this.allPlanets = [];
        this.player = null;

        this.currHoldFlag = null;
        this.currFlag = null;
    
        this.rayCastedObjects = [];
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
            Utils.setEmissiveGLTF(baseStarModel, 50);
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

    setPlayer(player: Player) {
        this.player = player;
    }

    getPlayer(): Player | null {
        return this.player;
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

    updateCurrentHoldFlag(): void {
        this.rayCastFlags();
        this.currHoldFlag = this.currFlag;
    }

    rayCastFlags(): void {
        Utils.rayCaster.setFromCamera(Utils.mousePosition, Scene.camera);
        const intersected = Utils.rayCaster.intersectObjects(
            this.getAllFlagsMesh());
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

    rayCastAll() {
        Utils.rayCaster.setFromCamera(Utils.mousePosition, Scene.camera);
        const intersected = Utils.rayCaster.intersectObjects(Scene.getChildren());
        const currCastedObjects: RayCastableInterface[] = []
        for (let i = 0; i < intersected.length; i++) {
            const obj = intersected[0].object;
            if (Utils.implementsRayCastable(obj)) {
                const castedObj = (obj as unknown) as RayCastableInterface;
                currCastedObjects.push(castedObj);
                if (!this.rayCastedObjects.includes(castedObj)) {
                    castedObj.onRayCast();
                }
            }
        }

        for (const lastCastedObj of this.rayCastedObjects) {
            if (!currCastedObjects.includes(lastCastedObj)) {
                lastCastedObj.onRayCastLeave();
            }
        }

        this.rayCastedObjects = currCastedObjects;
    }

    checkFlagOnMouseUp(): void {
        if (this.currHoldFlag != null) {
            this.rayCastFlags();
            if (this.currHoldFlag == this.currFlag) this.currHoldFlag.onClick();
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
