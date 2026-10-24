import * as THREE from 'three';

class Room {
    constructor(scene, size = 20, height = 4) {
        this.scene = scene;
        this.size = size;
        this.height = height;

        this.buildRoom();
        this.buildLighting();
    }

    buildRoom() {
        const halfSize = this.size / 2;

        // Ground (Floor)
        const groundGeometry = new THREE.PlaneGeometry(this.size, this.size);
        const groundMaterial = new THREE.MeshBasicMaterial({
            color: 0x555555,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // Ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(this.size, this.size);
        const ceilingMaterial = new THREE.MeshBasicMaterial({
            color: 0x222222,
            side: THREE.DoubleSide
        });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.position.y = this.height;
        ceiling.rotation.x = Math.PI / 2;
        this.scene.add(ceiling);

        // Walls
        const wallMaterial = new THREE.MeshBasicMaterial({
            color: 0x667788,
            side: THREE.DoubleSide
        });
        const wallsGroup = new THREE.Group();

        // North Wall (-Z)
        const wallNorth = new THREE.Mesh(new THREE.PlaneGeometry(this.size, this.height), wallMaterial);
        wallNorth.position.set(0, this.height / 2, -halfSize);
        wallNorth.receiveShadow = true;

        // West Wall (-X)
        const wallWest = new THREE.Mesh(new THREE.PlaneGeometry(this.size, this.height), wallMaterial);
        wallWest.position.set(-halfSize, this.height / 2, 0);
        wallWest.rotation.y = Math.PI / 2;
        wallWest.receiveShadow = true;

        // South Wall (+Z)
        const wallSouth = new THREE.Mesh(new THREE.PlaneGeometry(this.size, this.height), wallMaterial);
        wallSouth.position.set(0, this.height / 2, halfSize);
        wallSouth.rotation.y = Math.PI;
        wallSouth.receiveShadow = true;

        // East Wall (+X)
        const wallEast = new THREE.Mesh(new THREE.PlaneGeometry(this.size, this.height), wallMaterial);
        wallEast.position.set(halfSize, this.height / 2, 0);
        wallEast.rotation.y = -Math.PI / 2;
        wallEast.receiveShadow = true;

        wallsGroup.add(wallNorth, wallWest, wallSouth, wallEast);
        this.scene.add(wallsGroup);
    }

    buildLighting() {
        // Ambient light for general soft illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
        this.scene.add(ambientLight);

        // Directional light tambahan untuk memastikan seluruh ruangan terang
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 5);
        this.scene.add(dirLight);

        // Point light in the center of the room (stored as property for animation flicker)
        this.pointLight = new THREE.PointLight(0xffaa50, 15, 30);
        this.pointLight.position.set(0, this.height - 0.5, 0);
        this.scene.add(this.pointLight);
    }
}

export default Room;
