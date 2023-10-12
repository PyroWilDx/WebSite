import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Galaxy } from './Galaxy.ts';
import { Planet } from './Planet.ts';
import { Scene } from './Scene.ts';
import './style.css';

Scene.initScene();

const controls = new OrbitControls(Scene.camera, Scene.renderer.domElement);

let galaxy: Galaxy = new Galaxy();
galaxy.addBackground(1000, "res/imgs/background.png");
galaxy.addStars(400, "res/3d/MarioStar/scene.gltf");

let mars = new Planet("res/3d/MarsPlanet/scene.gltf",
	new THREE.Vector3(10, 10, 10),
	new THREE.Vector3(300, 0, -400));
mars.addRing(3.2, 8, null, 0x00BFFF);
mars.addRing(3.2, 8, null, 0xDC143C);
galaxy.addPlanet(mars);

galaxy.addPlanet(new Planet("res/3d/PurplePlanet/scene.gltf",
						new THREE.Vector3(10, 10, 10),
						new THREE.Vector3(-300, 0, -400)));

galaxy.addPlanet(new Planet("res/3d/StylizedEarthPlanet/scene.gltf",
						new THREE.Vector3(10, 10, 10),
						new THREE.Vector3(0, 0, -400)));
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(0, 0, -400);

function animate() {
	requestAnimationFrame(animate);

	galaxy.updateFrame();

	controls.update();

	Scene.renderScene();
}

animate();
