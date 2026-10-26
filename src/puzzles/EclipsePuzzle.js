import * as THREE from 'three';
import Orbit from './Orbit.js';

class EclipsePuzzle {
    constructor() {
        this.group = new THREE.Group();
        this.group.userData = {
            isPuzzle: true,
            puzzleKind: 'eclipse',
            hint: '🌘 Klik sistem orbit saat Bulan sejajar di antara Matahari dan Bumi'
        };
        this.isPaused = false;
        this.solved = false;
        this.onSolved = null;

        this.sun = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 24),
            new THREE.MeshBasicMaterial({ color: 0xffaa00 })
        );
        this.sun.userData.puzzleTarget = true;
        this.group.add(this.sun);

        const sunLight = new THREE.PointLight(0xffaa00, 1.5, 10);
        this.sun.add(sunLight);

        this.earth = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 32, 20),
            new THREE.MeshStandardMaterial({ color: 0x2233ff, roughness: 0.5 })
        );
        this.earth.userData.puzzleTarget = true;
        this.earthOrbit = new Orbit(this.group, this.earth, 3.5, 0.8);

        this.moon = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 20, 12),
            new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.8 })
        );
        this.moon.userData.puzzleTarget = true;
        this.moonOrbit = new Orbit(this.earth, this.moon, 0.8, 2.5);
    }

    checkAlignment() {
        this.group.updateMatrixWorld(true);
        const sunPosition = this.sun.getWorldPosition(new THREE.Vector3());
        const earthPosition = this.earth.getWorldPosition(new THREE.Vector3());
        const moonPosition = this.moon.getWorldPosition(new THREE.Vector3());
        const sunToEarth = new THREE.Vector3().subVectors(earthPosition, sunPosition).normalize();
        const earthToMoon = new THREE.Vector3().subVectors(moonPosition, earthPosition).normalize();

        return sunToEarth.dot(earthToMoon) < -0.96;
    }

    handleInput() {
        if (this.solved) return 'solved';

        this.isPaused = true;
        if (this.checkAlignment()) {
            this.complete();
            return 'solved';
        }

        this.isPaused = false;
        return 'miss';
    }

    complete() {
        this.solved = true;
        this.onSolved?.();
    }

    update(delta) {
        if (this.isPaused) return;

        this.sun.rotation.y += delta * 0.5;
        this.earth.rotation.y += delta * 2;
        this.earthOrbit.update(delta);
        this.moonOrbit.update(delta);
    }
}

export default EclipsePuzzle;