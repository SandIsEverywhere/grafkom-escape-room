import * as THREE from 'three';

class RoomVFX {
    constructor(scene, roomSize = 20, roomHeight = 4) {
        this.scene = scene;
        this.roomSize = roomSize;
        this.roomHeight = roomHeight;

        this.dust = null;
        this.sparkles = null;

        this.initDust();
        this.initSparkles();
    }

    // 8.1 — Dust Particles
    initDust() {
        const dustCount = 180;
        const positions = new Float32Array(dustCount * 3);
        const half = this.roomSize / 2 - 0.5;

        for (let i = 0; i < dustCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * (this.roomSize - 1);
            positions[i + 1] = Math.random() * this.roomHeight;
            positions[i + 2] = (Math.random() - 0.5) * (this.roomSize - 1);
        }

        const dustGeo = new THREE.BufferGeometry();
        dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const dustMat = new THREE.PointsMaterial({
            color: 0xffffee,
            size: 0.045,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.dust = new THREE.Points(dustGeo, dustMat);
        this.scene.add(this.dust);
    }

    // 8.2 — Key Sparkles
    initSparkles() {
        const sparkleCount = 50;
        const positions = new Float32Array(sparkleCount * 3);

        for (let i = 0; i < sparkleCount * 3; i += 3) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.35;
            positions[i] = Math.cos(angle) * radius;
            positions[i + 1] = (Math.random() - 0.5) * 0.4;
            positions[i + 2] = Math.sin(angle) * radius;
        }

        const sparkleGeo = new THREE.BufferGeometry();
        sparkleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const sparkleMat = new THREE.PointsMaterial({
            color: 0xffaa00,
            size: 0.035,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.sparkles = new THREE.Points(sparkleGeo, sparkleMat);
        this.sparkles.position.set(3, 0.6, 1.5); // Posisi sama dengan kunci
        this.sparkles.visible = false; // Hidden sampai peti dibuka
        this.scene.add(this.sparkles);
    }

    update(delta, elapsed, chestOpened, hasKey) {
        // Update Dust positions (floating upwards)
        if (this.dust) {
            const positions = this.dust.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += delta * 0.2; // kecepatan naik
                if (positions[i] > this.roomHeight) {
                    positions[i] = 0; // wrap ke bawah
                }
            }
            this.dust.geometry.attributes.position.needsUpdate = true;
        }

        // Update Sparkles around key
        if (this.sparkles && this.sparkles.visible && !hasKey) {
            this.sparkles.rotation.y += delta * 1.5;
            this.sparkles.position.y = 0.6 + Math.sin(elapsed * 3) * 0.08;
        } else if (hasKey && this.sparkles) {
            this.sparkles.visible = false;
        }
    }
}

export default RoomVFX;
