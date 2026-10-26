import * as THREE from 'three';

class SimonButton {
    constructor(color, position) {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 0.2),
            new THREE.MeshStandardMaterial({
                color,
                emissive: color,
                emissiveIntensity: 0,
            })
        );

        this.mesh.position.copy(position);
    }

    lightUp() {
        this.mesh.material.emissiveIntensity = 1;
    }

    dim() {
        this.mesh.material.emissiveIntensity = 0;
    }
}

export default SimonButton;