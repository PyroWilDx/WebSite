// @ts-ignore
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { Flag } from './Flag.ts';
import { Galaxy } from './Galaxy.ts';
import { LoadingScreen } from './LoadingScreen.ts';
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
galaxy.addStars(400, "res/3d/MarioStar/scene.gltf");

let kqPlanet = new Planet("res/imgs/Sun.jpg", 40,
	new THREE.Vector3(0, -100, -200), 10, "red");
kqPlanet.addRing(2, 10, null, 0x00BFFF);
kqPlanet.addRing(2, 10, null, 0xDC143C);
let kqFlag = new Flag(106.6670, 60, 
	null, "res/vids/Keqing.mp4",
	1, 120, 0xFFFFFF, "ProjectKeqing", 0, 0,
	"res/imgs/Icon_C++.png",
	"res/imgs/Icon_SDL2.png",
	"res/imgs/Icon_CLion.png",
	"res/imgs/Icon_Boost.png");
kqPlanet.setFlag(kqFlag);
galaxy.addPlanet(kqPlanet);
LoadingScreen.updateCount();

let oregairuPlanet = new Planet("res/imgs/Sun.jpg", 20,
	new THREE.Vector3(-120, -100, -400), 10, "red");
oregairuPlanet.addRing(1, 6, null, 0xFFFFFF);
let oregairuFlag = new Flag(90, 60,
	null, "res/vids/Oregairu.mp4",
	1, 120, 0xFFFFFF, "ProjectOregairu", 0, 0,
	"res/imgs/Icon_Java.png",
	"res/imgs/Icon_AndroidStudio.png");
oregairuPlanet.setFlag(oregairuFlag);
galaxy.addPlanet(oregairuPlanet);
LoadingScreen.updateCount();

Utils.gltfLoader.load("res/3d/RobotUFO/scene.gltf", ( gltf ) => {
	galaxy.setPlayer(new Player(gltf.scene, 0.01));
	LoadingScreen.updateCount();
});

MainInit.initRoad();
LoadingScreen.updateCount();

// Event Listeners
window.addEventListener('resize', () => {
	Scene.updateRenderSize();
});

window.addEventListener('mousedown', (event) => {
	if (event.button === 0) {
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
LoadingScreen.updateCount();

while (LoadingScreen.currCount < LoadingScreen.maxCount) {
	LoadingScreen.updateLoadingScreen();

	await Utils.sleep(100);
}

let loadingScreen = document.getElementById("loadingScreen");
let bg = document.getElementById("bg");
if (loadingScreen != null && bg != null) {
	loadingScreen.style.display = "none";
	bg.style.display = "";
}

animate();
