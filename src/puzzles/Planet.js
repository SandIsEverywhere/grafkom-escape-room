import * as THREE from 'three';

class Planet {
    constructor(name, color, radius = 0.3) {
        this.name = name;

        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 16),
            new THREE.MeshStandardMaterial({
                color,
                emissive: color,
                emissiveIntensity: 0,
            })
        );

        this.mesh.userData.planetName = name;
    }

    setPosition(position) {
        this.mesh.position.copy(position);
    }

    highlight() {
        this.mesh.material.emissiveIntensity = 0.5;
    }

    unhighlight() {
        this.mesh.material.emissiveIntensity = 0;
    }
}

export default Planet;