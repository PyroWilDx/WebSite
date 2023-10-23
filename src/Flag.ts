import * as THREE from 'three';
import flagGlowFragmentShader from './../res/shaders/flagGlowFragment.glsl';
import flagGlowVertexShader from './../res/shaders/flagGlowVertex.glsl';
import { GetLookedInterface } from './ObjectLookedInterface';
import { Scene } from './Scene';
import { Utils } from './Utils';

export class Flag implements GetLookedInterface {
    public static readonly projSectionId: string = "ProjSection";

    private flagW: number;
    private flagH: number;
    private flagMesh: THREE.Mesh;

    private flagStickRadius: number;
    private flagStickH: number;
    private flagStickColor: number;
    private flagStickMesh: THREE.Mesh;

    private flagGlowLight: THREE.PointLight;
    private flagGlowMesh: THREE.Mesh;

    private flagProjectSectionId: string;

    private halfFlagW: number;
    private AX1: number;
    private DX1: number;
    private AX2: number;
    private DX2: number;
    private AY1: number;
    private DY1: number;
    private AY2: number;
    private DY2: number; 

    constructor(flagW: number, flagH: number, flagImgPath: string,
        flagStickRadius: number, flagStickH: number, flagStickColor: number,
        projSectionId: string) {
        this.flagW = flagW;
        this.flagH = flagH;
        
        let flagTexture = Utils.textureLoader.load(flagImgPath);
        this.flagMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(flagW, flagH, flagW, flagH),
            new THREE.MeshStandardMaterial({
                map: flagTexture,
                side: THREE.DoubleSide,
                emissiveMap: flagTexture,
                emissiveIntensity: 0.46
            })
        );
        Scene.scene.add(this.flagMesh);

        this.flagStickRadius = flagStickRadius;
        this.flagStickH = flagStickH;
        this.flagStickColor = flagStickColor;
        this.flagStickMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(flagStickRadius, flagStickRadius,
                flagStickH, 32, 32),
            new THREE.MeshStandardMaterial({
                color: flagStickColor,
                side: THREE.FrontSide
            })
        )
        Scene.scene.add(this.flagStickMesh);

        this.flagGlowLight = new THREE.PointLight(0xFFFFFF, 1000);

        this.flagGlowMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(this.flagW, this.flagH, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: flagGlowVertexShader,
                fragmentShader: flagGlowFragmentShader,
                side: THREE.DoubleSide
            })
        );
        const glowScale = 1.12;
        this.flagGlowMesh.scale.set(glowScale, glowScale, glowScale);

        this.flagProjectSectionId = projSectionId;

        this.halfFlagW = this.flagW / 2;

        let ratio = (this.flagW / 10 + this.flagH / 6) / 2;
        this.AX1 = 0.52 * ratio;
        this.DX1 = 2 / ratio;
        this.AX2 = 0.26 * ratio;
        this.DX2 = 3.02 / ratio;
        this.AY1 = 0.1 * ratio;
        this.DY1 = 2 / ratio;
        this.AY2 = 0.042 * ratio;
        this.DY2 = 3.02 / ratio;
    }

    getObjectPosition(): THREE.Vector3 {
        return this.flagMesh.position;
    }

    onLookEnd(): void {
        Utils.appendSectionHTML(this.flagProjectSectionId, Flag.projSectionId);
        let projSection = document.getElementById(Flag.projSectionId);
        if (projSection != null) {
            projSection.style.visibility = "visible";
        }
    }

    glowEffect(start: boolean): void {
        if (start) {
            Utils.setEmissiveMesh(this.flagStickMesh, this.flagStickColor);
            Utils.setEmissiveMesh(this.flagMesh, "white");
            Scene.addEntity(this.flagGlowLight);
            Scene.addEntity(this.flagGlowMesh);
        } else {
            Utils.removeEmissiveMesh(this.flagStickMesh);
            Utils.removeEmissiveMesh(this.flagMesh);
            Scene.removeEntity(this.flagGlowLight);
            Scene.removeEntity(this.flagGlowMesh);
        }
    }

    setPositionFromDown(position: THREE.Vector3): void {
        let flagPosition = position.clone();
        let flagStickPosition = position.clone();
        flagPosition.y += this.flagStickH - this.flagH / 2;
        flagPosition.x += this.flagW / 2 + this.flagStickRadius;
        flagStickPosition.y += this.flagStickH / 2;
        this.flagMesh.position.copy(flagPosition);
        this.flagStickMesh.position.copy(flagStickPosition);
        this.flagGlowLight.position.copy(flagPosition);
        this.flagGlowMesh.position.copy(flagPosition);
    }

    onClick(): void {
        let flagPosition = this.flagMesh.position;
        let finalPosition = flagPosition.clone();
        finalPosition.z += 30;
        Scene.addCameraLerp(finalPosition, this);
    }

    updateFrame(): void {
        let position = this.flagMesh.geometry.attributes.position;

        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);
            const t = Utils.clock.getElapsedTime();

            const waveX1 = this.AX1 * Math.sin(x * this.DX1 + t * 3.02);
            const waveX2 = this.AX2 * Math.sin(x * this.DX2 + t * 2);
            const waveY1 = this.AY1 * Math.sin(y * this.DY1 + t * 0.52);
            const waveY2 = this.AY2 * Math.sin(y * this.DY2 + t * 0.36);
            const ig = (x + this.halfFlagW) / this.flagW;
            
            position.setZ(i, (waveX1 + waveX2 + waveY1 + waveY2) * ig);
        }

        this.flagMesh.geometry.attributes.position.needsUpdate = true;
    }

    getMesh(): THREE.Mesh {
        return this.flagMesh;
    } 

}
