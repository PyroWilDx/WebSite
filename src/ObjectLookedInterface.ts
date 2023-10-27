import * as THREE from 'three';
import { CameraLerp } from './CameraLerp';

export interface ObjectLookedInterface {
    getObjectPosition(): THREE.Vector3;
    onLookStart(cameraLerp: CameraLerp): void;
    onLookProgress(cameraLerp: CameraLerp): void;
    onLookEnd(): void;
    onLookInterruption(): void;
}
