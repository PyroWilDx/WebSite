import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { RayCastableInterface } from './RayCastableInterface';
import { RotatingObject } from "./RotatingObject";
import { Utils } from "./Utils";

export class ToolCube extends RotatingObject implements RayCastableInterface {
    private static readonly cubeSize: number = 20;

    constructor(imgPath: string) {
        let cubeTexture = Utils.textureLoader.load(imgPath);

        super(new THREE.BoxGeometry(ToolCube.cubeSize, 
                    ToolCube.cubeSize, ToolCube.cubeSize), 
            new THREE.MeshStandardMaterial({
                map: cubeTexture,
                side: THREE.FrontSide,
                emissiveIntensity: 2,
                emissiveMap: cubeTexture
            }),
            Utils.getRandomVector3Spread(0.004)
        );
    }

    onRayCast(): void {
        new TWEEN.Tween(this.scale)
            .to(new THREE.Vector3(1.16, 1.16, 1.1), 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    onRayCastLeave(): void {
        new TWEEN.Tween(this.scale)
            .to(new THREE.Vector3(1.0, 1.0, 1.0), 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

}
