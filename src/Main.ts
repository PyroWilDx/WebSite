// @ts-ignore
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Flag } from './Flag.ts';
import { Galaxy } from './Galaxy.ts';
import { MainInit } from './MainInit.ts';
import { Planet } from './Planet.ts';
import { Player } from './Player.ts';
import { Scene } from './Scene.ts';
import { Utils } from './Utils.ts';
import './style.css';

// Inits
Scene.initScene();

// World Building
let galaxy: Galaxy = Scene.galaxy;
galaxy.addStars(600, "res/3d/MarioStar/scene.gltf");

let sun = new Planet("res/imgs/Sun.jpg", 40,
	new THREE.Vector3(0, 0, -200), 10, "red");
sun.addRing(2, 10, null, 0x00BFFF);
sun.addRing(2, 10, null, 0xDC143C);
let flag = new Flag(106.6670, 60, 
	"res/imgs/SkyDev0.png", null,
	1, 120, 0xFFFFFF, "ProjectTest1", 0, -3.16,
	"res/imgs/Icon_C++.png",
	"res/imgs/Icon_SDL2.png");
sun.setFlag(flag);
galaxy.addPlanet(sun);

let sun2 = new Planet("res/imgs/Sun.jpg", 20,
	new THREE.Vector3(-300, 0, -400), 10, "red");
sun2.addRing(1, 6, null, 0xFFFFFF);
let flag2 = new Flag(90, 60, 
	"res/imgs/Flag.png", null,
	1, 120, 0xFFFFFF, "ProjectTest2", 1, 2,
	"res/imgs/Icon_C++.png",
	"res/imgs/Icon_SDL2.png");
sun2.setFlag(flag2);
galaxy.addPlanet(sun2);

let sun3 = new Planet("res/imgs/Sun.jpg", 20,
	new THREE.Vector3(-100, 0, -400), 10, "red");
sun3.addRing(1, 6, null, 0xFFFFFF);
let flag3 = new Flag(60, 133.30, 
	null, "res/imgs/Oregairu.mp4",
	1, 200, 0xFFFFFF, "ProjectTest3", 1, 34,
	"res/imgs/Icon_C++.png",
	"res/imgs/Icon_SDL2.png");
sun3.setFlag(flag3);
galaxy.addPlanet(sun3);

Utils.gltfLoader.load("res/3d/RobotUFO/scene.gltf", ( gltf ) => {
	galaxy.setPlayer(new Player(gltf.scene, 0.01));
});

MainInit.initRoad();

// Event Listeners
window.addEventListener('resize', () => {
	Scene.updateRenderSize();
});

window.addEventListener('mousedown', (event) => {
	if (event.button === 0) {
		// console.log("Mouse Position :", Utils.getMouseScreenPosition());
		// console.log("Window :", window.innerWidth, window.innerHeight);

		if (Utils.mousePosition.x > 1 - Utils.getScrollbarWidth()) return;

		Utils.isMouseDown = true;

		galaxy.updateCurrentHoldObj();
		
		if (event.target instanceof HTMLElement) {
			let id = event.target.id;
			if (!galaxy.rayCastObjects(true, true, true) && 
					id === Scene.projBgContainerId) {
				Scene.rmDisplayHold = true;
			}
		}
	}
});
  
window.addEventListener('mouseup', (event) => {
	if (event.button === 0 ) {
		if (Utils.mousePosition.x > 1 - ((Utils.getScrollbarWidth() / window.innerWidth) * 2)) return;

		galaxy.checkObjOnMouseUp();

		Utils.isMouseDown = false;

		if (event.target instanceof HTMLElement) {
			let id = event.target.id;
			if (Scene.rmDisplayHold && 
					!galaxy.rayCastObjects(true, true, true) &&
					id === Scene.projBgContainerId) {
				Scene.removeProjectDisplayer();
			}
		}
		Scene.rmDisplayHold = false;
	}
});

window.addEventListener('mousemove', (event) => {
	Utils.updateMousePosition(event);
});

window.addEventListener("wheel", (event) => {
	if (Scene.cameraFollowingObj) {
		MainInit.moveForward(MainInit.scrollLengthAdv, event.deltaY >= 0);
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

	Utils.updateDt();

	TWEEN.update();

	galaxy.updateFrame();

	Scene.updateFrame();
}

MainInit.moveForward(1, true);
while (!MainInit.doneOneRound) {
	MainInit.moveForward(MainInit.scrollLengthAdv, true);
}

animate();
