import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Planet } from './Planet.ts';
import { Scene } from './Scene.ts';
import { Star } from './Star.ts';
import { Utils } from './Utils.ts';

export class Galaxy {
    private radius: number;
    private allStars: Star[];
    private allPlanets: Planet[];

    constructor() {
        this.radius = 0;
        this.allStars = [];
        this.allPlanets = [];
    }

    addBackground(radius: number, backgroundPath: string) {
        this.radius = radius;

        const backgroundGeometry = new THREE.SphereGeometry(this.radius, 100, 100);
        const backgroundTexture = new THREE.TextureLoader().load(backgroundPath);
        const backgroundMaterial = new THREE.MeshBasicMaterial({ 
          map: backgroundTexture,
          side: THREE.BackSide
        });
        const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        Scene.addEntity(backgroundMesh);
    }

    addStars(nStars: number, modelPath: string): void {
        new GLTFLoader().load(modelPath, ( gltf ) => {
            let baseStarModel = gltf.scene;
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

    updateFrame(): void {
        for (const currStar of this.allStars) {
            currStar.updateFrame();
        }
        for (const currPlanet of this.allPlanets) {
            currPlanet.updateFrame();
        }
    }
}