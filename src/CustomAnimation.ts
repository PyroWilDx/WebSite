import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';

export class CustomAnimation {

    static popAnimation(object: THREE.Object3D): void {
        object.scale.set(0.1, 0.1, 0.1);

        const duration = 1000;
        const targetScale = new THREE.Vector3(1, 1, 1);

        new TWEEN.Tween(object.scale)
            .to(targetScale, duration)
            .easing(TWEEN.Easing.Elastic.Out)
            .start();
    }

}