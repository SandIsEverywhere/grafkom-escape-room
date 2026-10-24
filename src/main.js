import * as THREE from 'three';
// import "./style.css";
// import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
// import FirstPersonController from './FirstPersonController.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x0b1020 );
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Trying Controls
const fpsController = new PointerLockControls( camera, renderer.domElement );
// const fpsController = new FirstPersonController(camera, scene, renderer.domElement);

// ground
const groundGeometry = new THREE.PlaneGeometry( 100, 100 );
const groundMaterial = new THREE.MeshBasicMaterial( { color: 0x808080, side: THREE.DoubleSide } );
const ground = new THREE.Mesh( groundGeometry, groundMaterial );
ground.rotation.x = Math.PI / 2;
scene.add( ground );

// Default Box
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.y = 1; // Raise the cube above the ground
scene.add( cube );

renderer.domElement.addEventListener('click', () => {
    fpsController.lock();
});

// trying movement (not working yet)
renderer.domElement.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW': fpsController.moveForward(0.1); break;
        case 'KeyA': fpsController.moveRight(-0.1); break;
        case 'KeyS': fpsController.moveForward(-0.1); break;
        case 'KeyD': fpsController.moveRight(0.1); break;
    }
});

camera.position.z = 5;
camera.position.y = 1.6;

const timer = new THREE.Timer();
function animate(timestamp) {
    requestAnimationFrame( animate );

    timer.update(timestamp);

    const delta = timer.getDelta();
    // const elapsed = timer.getElapsed();
    
    // fpsController.update(delta);
    // fpsController.lock();
    // controls.update(delta);

    cube.rotation.x += delta;
    cube.rotation.y += delta;

    renderer.render( scene, camera );
}

animate();