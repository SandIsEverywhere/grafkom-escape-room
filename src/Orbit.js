import * as THREE from 'three';

class SolarSystem {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();

        // Diposisikan mundur sedikit dari tembok (x = -8.5, z = 4.0) agar rotasinya tidak tembus tembok
        this.group.position.set(-8.5, 2.0, 4.0);
        this.group.scale.set(0.32, 0.32, 0.32); // Sedikit disesuaikan ukurannya agar proporsional

        this.isPaused = false; // Status pause orbit

        this.init();
        this.scene.add(this.group);
    }

    init() {
        // 1. Matahari (Sun)
        const sunGeo = new THREE.SphereGeometry(1, 32, 32);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        this.sun = new THREE.Mesh(sunGeo, sunMat);
        this.group.add(this.sun);

        const sunLight = new THREE.PointLight(0xffaa00, 1, 10);
        this.sun.add(sunLight);

        // 2. Orbit & Bumi (Earth)
        this.earthOrbitPivot = new THREE.Group();
        this.group.add(this.earthOrbitPivot);

        const earthGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const earthMat = new THREE.MeshStandardMaterial({ color: 0x2233ff, roughness: 0.5 });
        this.earth = new THREE.Mesh(earthGeo, earthMat);
        this.earth.position.set(3.5, 0, 0);
        this.earthOrbitPivot.add(this.earth);

        // 3. Orbit & Bulan (Moon)
        this.moonOrbitPivot = new THREE.Group();
        this.earth.add(this.moonOrbitPivot);

        const moonGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.8 });
        this.moon = new THREE.Mesh(moonGeo, moonMat);
        this.moon.position.set(0.8, 0, 0);
        this.moonOrbitPivot.add(this.moon);
    }

    // Toggle pause status
    togglePause() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }

    // Cek apakah posisi Matahari, Bumi, dan Bulan berada dalam satu garis lurus (gerhana)
    // Toleransi sudut / posisi alignment
    checkEclipseAlignment() {
        // Posisi dunia (world position) dari masing-masing benda langit
        const sunPos = new THREE.Vector3();
        const earthPos = new THREE.Vector3();
        const moonPos = new THREE.Vector3();

        this.sun.getWorldPosition(sunPos);
        this.earth.getWorldPosition(earthPos);
        this.moon.getWorldPosition(moonPos);

        // Vektor dari Matahari ke Bumi
        const sunToEarth = new THREE.Vector3().subVectors(earthPos, sunPos).normalize();
        // Vektor dari Bumi ke Bulan
        const earthToMoon = new THREE.Vector3().subVectors(moonPos, earthPos).normalize();

        // Dot product mendekati 1 atau -1 berarti segaris (searah atau berlawanan arah)
        const dot = Math.abs(sunToEarth.dot(earthToMoon));

        // Jika dot > 0.95, artinya mereka berada dalam satu garis lurus (gerhana)
        return dot > 0.95;
    }

    update(delta) {
        if (this.isPaused) return; // Jika di-pause, hentikan pergerakan orbit

        // Rotasi Matahari pada porosnya
        this.sun.rotation.y += delta * 0.5;

        // Bumi mengelilingi Matahari (Revolusi)
        this.earthOrbitPivot.rotation.y += delta * 0.8;

        // Bumi berotasi pada porosnya sendiri
        this.earth.rotation.y += delta * 2.0;

        // Bulan mengelilingi Bumi (Revolusi)
        this.moonOrbitPivot.rotation.y += delta * 2.5;
    }
}

export default SolarSystem;
