import * as THREE from 'three';

export interface ObjectLookedInterface {
    getObjectPosition(): THREE.Vector3;
    getObjectWorldQuaternion(): THREE.Quaternion;
    onLookProgress(): void;
    onLookEnd(): void;
}
