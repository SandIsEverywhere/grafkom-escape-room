import * as THREE from 'three';
import FirstPersonController from './FirstPersonController.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x0b1020 );
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Trying Controls
const fpsController = new FirstPersonController( camera, scene, renderer.domElement );

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

camera.position.z = 5;
camera.position.y = 1.6;

const timer = new THREE.Timer();
function animate(timestamp) {
    requestAnimationFrame( animate );

    timer.update(timestamp);

    const delta = timer.getDelta();
    
    fpsController.update(delta);

    cube.rotation.x += delta;
    cube.rotation.y += delta;

    renderer.render( scene, camera );
}

animate();