import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

class FirstPersonController {
    constructor(camera, scene, domElement) {
        this.camera = camera;
        this.scene = scene;
        this.domElement = domElement;
        // this.model = null;
        // this.mixer = null;
        // this.animations = {};
        // this.currentAnimation = null;
        this.enabled = true;

        // movement
        this.keys = { w: false, a: false, s: false, d: false };
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.speed = 5;

        // offset eye level & room boundaries
        this.eyeLevel = 1.6;
        this.roomSize = 20;

        this.initControls();
        // this.loadModel();
        this.addEventListeners();
    }

    initControls() {
        this.controls = new PointerLockControls(this.camera, this.domElement);

        // lock on click
        // this.domElement.addEventListener('click', () => {
        //     this.controls.lock();
        // });
    }

    enable() {
        this.controls.lock();
        this.enabled = true;
    }

    disable() {
        this.controls.unlock();
        this.resetKeys();
        this.enabled = false;
    }

    // loadModel() {}

    addEventListeners() {
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
        window.addEventListener('keyup', (event) => this.onKeyUp(event));
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

    resetKeys() {
        this.keys = { w: false, a: false, s: false, d: false };
    }

    update(delta) {
        if (!this.enabled) return;

        const speed = this.speed * delta;

        if (this.keys['w']) this.controls.moveForward(speed);
        if (this.keys['s']) this.controls.moveForward(-speed);
        if (this.keys['a']) this.controls.moveRight(-speed);
        if (this.keys['d']) this.controls.moveRight(speed);

        // Clamp inside room boundaries
        const b = this.roomSize / 2 - 0.5;
        this.camera.position.x = Math.max(-b, Math.min(b, this.camera.position.x));
        this.camera.position.z = Math.max(-b, Math.min(b, this.camera.position.z));
        this.camera.position.y = this.eyeLevel;
    }
}

export default FirstPersonController;