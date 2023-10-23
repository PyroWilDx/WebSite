import * as THREE from 'three';

export interface ObjectLookedInterface {
    getObjectPosition(): THREE.Vector3;
    onLookEnd(): void;
}