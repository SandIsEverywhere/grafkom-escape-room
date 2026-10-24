import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

class FirstPersonController {
    constructor(camera, scene, domElement) {
        this.camera = camera;
        this.scene = scene;
        this.model = null;
        this.mixer = null;
        this.animations = {};
        this.currentAnimation = null;

        // movement
        this.keys = { w: false, a: false, s: false, d: false };
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.speed = 5;

        // offset eye level
        this.eyeLevel = 1.6;

        this.initControls(domElement);
        this.loadModel();
        this.addEventListeners();
    }

    initControls(domElement) {
        this.controls = new PointerLockControls(this.camera, domElement);

        // lock on click
        domElement.addEventListener('click', () => {
            this.controls.lock();
        });
    }

    loadModel() {

    }

    addEventListeners() {
        this.domElement.addEventListener('keydown', (event) => this.onKeyDown(event));
        this.domElement.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW': this.keys.w = true; break;
            case 'KeyA': this.keys.a = true; break;
            case 'KeyS': this.keys.s = true; break;
            case 'KeyD': this.keys.d = true; break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.keys.w = false; break;
            case 'KeyA': this.keys.a = false; break;
            case 'KeyS': this.keys.s = false; break;
            case 'KeyD': this.keys.d = false; break;
        }
    }

    update(delta) {
        if (!this.controls.isLocked) return;

        // move logic
        this.direction.z = Number(this.keys.w) - Number(this.keys.s);
        this.direction.x = Number(this.keys.d) - Number(this.keys.a);
        this.direction.normalize();

        // update velocity
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        if (this.keys.w || this.keys.s) this.velocity.z -= this.direction.z * this.speed * delta;
        if (this.keys.a || this.keys.d) this.velocity.x -= this.direction.x * this.speed * delta;

        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);
    }
}

export default FirstPersonController;