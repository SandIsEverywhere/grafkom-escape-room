import * as THREE from 'three';

class Orbit {
    constructor(parent, body, radius, speed) {
        this.pivot = new THREE.Group();
        this.body = body;
        this.speed = speed;

        const points = Array.from({ length: 64 }, (_, index) => {
            const angle = (index / 64) * Math.PI * 2;
            return new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            );
        });
        const path = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({ color: 0x8899bb, transparent: true, opacity: 0.55 })
        );
        parent.add(path);

        this.body.position.set(radius, 0, 0);
        this.pivot.add(this.body);
        parent.add(this.pivot);
    }

    update(delta) {
        this.pivot.rotation.y += delta * this.speed;
    }
}

export default Orbit;