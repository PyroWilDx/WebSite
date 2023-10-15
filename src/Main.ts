import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Flag } from './Flag.ts';
import { Galaxy } from './Galaxy.ts';
import { Planet } from './Planet.ts';
import { Scene } from './Scene.ts';
import './style.css';

Scene.initScene();

const controls = new OrbitControls(Scene.camera, Scene.renderer.domElement);

let galaxy: Galaxy = new Galaxy();
galaxy.addBackground(1000, "res/imgs/background.png");
galaxy.addStars(200, "res/3d/MarioStar/scene.gltf");

let sun = new Planet("res/imgs/sun.jpg", 40,
	new THREE.Vector3(0, 0, -100));
sun.addRing(2, 10, null, 0x00BFFF);
sun.addRing(2, 10, null, 0xDC143C);
galaxy.addPlanet(sun);

galaxy.addPlanet(new Planet("res/imgs/sun.jpg", 20,
						new THREE.Vector3(-300, 0, -400)));

let flag: Flag = new Flag(60, 36, "res/imgs/flag.png",
			1, 80, 0xFFFFFF);
sun.setFlag(flag);

function animate() {
	requestAnimationFrame(animate);

	galaxy.updateFrame();

	controls.update();

	Scene.renderScene();
}

animate();
