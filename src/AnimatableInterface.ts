import * as THREE from 'three';

export interface AnimatableInterface {
    beingAnimated: boolean;
    getObject(): THREE.Object3D;
}
