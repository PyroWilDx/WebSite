import * as THREE from 'three';
import { AnimatableInterface } from './AnimatableInterface';
import { CustomAnimation } from './CustomAnimation';
import { RayCastableInterface } from './RayCastableInterface';
import { RotatingObject } from "./RotatingObject";
import { Scene } from './Scene';
import { Utils } from "./Utils";

export class ToolCube extends RotatingObject implements RayCastableInterface, AnimatableInterface {
    public static readonly cubeSize: number = 10;

    public beingAnimated: boolean;

    private light: THREE.PointLight;

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

        this.beingAnimated = false;

        this.light = new THREE.PointLight(0xFFFFFF, 400);
        Scene.addEntity(this.light);
    }

    getObject(): THREE.Object3D {
        return this;
    }

    onRayCast(): boolean {
        return CustomAnimation.focusBigAnimation(this, 200, true);
    }

    onRayCastLeave(): void {
        CustomAnimation.focusBigAnimation(this, 200, false);
    }

    addSelf(): void {
        Scene.addEntity(this);
        Scene.addEntity(this.light);
    }

    removeSelf(): void {
        Scene.removeEntity(this);
        Scene.removeEntity(this.light);
    }

    setPosition(position: THREE.Vector3, left: boolean): void {
        this.position.copy(position);
        this.light.position.copy(this.position);
        if (left) this.light.position.x += ToolCube.cubeSize;
        else this.light.position.x -= ToolCube.cubeSize;
        this.light.position.z += ToolCube.cubeSize * 1.2;
    }

}
