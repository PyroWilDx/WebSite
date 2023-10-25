import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Flag } from './Flag.ts';
import { Galaxy } from './Galaxy.ts';
import { Planet } from './Planet.ts';
import { Player } from './Player.ts';
import { Scene } from './Scene.ts';
import { Utils } from './Utils.ts';
import './style.css';

// Inits
Scene.initScene();

const controls = new OrbitControls(Scene.camera, Scene.renderer.domElement);

// World Building
let galaxy: Galaxy = new Galaxy(Utils.worldRadius);
// galaxy.addBackgroundImg("res/imgs/Background.png");
galaxy.addStars(600, "res/3d/MarioStar/scene.gltf");

let sun = new Planet("res/imgs/Sun.jpg", 40,
	new THREE.Vector3(0, 0, -200), 10, "red");
sun.addRing(2, 10, null, 0x00BFFF);
sun.addRing(2, 10, null, 0xDC143C);
let flag = new Flag(60, 36, "res/imgs/SkyDev0.png",
			1, 80, 0xFFFFFF, "ProjectTest1",
			"res/imgs/Icon_C++.png",
			"res/imgs/Icon_SDL2.png");
sun.setFlag(flag);
galaxy.addPlanet(sun);

let sun2 = new Planet("res/imgs/Sun.jpg", 20,
	new THREE.Vector3(-300, 0, -400), 10, "red");
sun2.addRing(1, 6, null, 0xFFFFFF);
let flag2 = new Flag(40, 24, "res/imgs/Flag.png",
	1, 56, 0xFFFFFF, "ProjectTest2");
sun2.setFlag(flag2);
galaxy.addPlanet(sun2);

galaxy.addPlanet(new Planet("res/imgs/Sun.jpg", 1,
	new THREE.Vector3(0, 0, 0)));

let player = new Player(new THREE.Vector3(0, 0, 0),
	0.01, "res/3d/RobotUFO/scene.gltf");
galaxy.setRocket(player);

// Event Listeners
window.addEventListener('mousedown', (event) => {
	if (event.button === 0) {
		Utils.isMouseDown = true;

		galaxy.updateCurrentHoldFlag();
	}
});
  
window.addEventListener('mouseup', (event) => {
	if (event.button === 0 ) {
		galaxy.checkFlagOnMouseUp();

		Utils.isMouseDown = false;
	}
});

window.addEventListener('mousemove', (event) => {
	Utils.updateMousePosition(event);
});

window.addEventListener('mousemove', () => {
	galaxy.rayCastFlags();
});
  
window.addEventListener('mousemove', () => {
	if (Utils.isMouseDown) {
		let dX = Utils.mousePosition.x - Utils.lastMousePosition.x;
		let dY = Utils.mousePosition.y - Utils.lastMousePosition.y;
	
		const rotationSpeedX = 0.6;
		const rotationSpeedY = 0.6;
	
		Scene.addCameraRotation(new THREE.Vector3(
			dY * rotationSpeedY, dX * rotationSpeedX, 0));
	}
});

window.addEventListener("keydown", function(event) {
	let key = event.key;
	Utils.updateKeyMap(key, true);

	if (key == "Escape") {
		Scene.removeProjectDisplayer();
	}
});

window.addEventListener("keyup", function(event) {
	let key = event.key;
	Utils.updateKeyMap(key, false);
});

// Main Loop
function animate() {
	requestAnimationFrame(animate);

	galaxy.updateFrame();

	// controls.update();

	Scene.updateFrame();
}

animate();
