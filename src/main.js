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
const groundGeometry = new THREE.PlaneGeometry( 20, 20 );
const groundMaterial = new THREE.MeshBasicMaterial( { color: 0x808080, side: THREE.DoubleSide } );
const ground = new THREE.Mesh( groundGeometry, groundMaterial );
ground.rotation.x = Math.PI / 2;
scene.add( ground );

// walls
const wallGeometry = new THREE.PlaneGeometry( 20, 20 );
const wallMaterial = new THREE.MeshBasicMaterial( { color: 0xA0A0A0, side: THREE.DoubleSide } );
const walls = new THREE.Group();
const wall1 = new THREE.Mesh( wallGeometry, wallMaterial );
wall1.position.z = -10;
const wall2 = new THREE.Mesh( wallGeometry, wallMaterial );
wall2.position.x = -10;
wall2.rotation.y = Math.PI / 2;
const wall3 = new THREE.Mesh( wallGeometry, wallMaterial );
wall3.position.z = 10;
const wall4 = new THREE.Mesh( wallGeometry, wallMaterial );
wall4.position.x = 10;
wall4.rotation.y = Math.PI / 2;
walls.add(wall1, wall2, wall3, wall4);
scene.add(walls);

// Default Box
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
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

    // console player position
    // console.log(`Player position: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`);

    renderer.render( scene, camera );
}

animate();