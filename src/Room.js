import * as THREE from 'three';

class Room {
    constructor(scene, size = 20, height = 5.5, options = {}) {
        this.scene = scene;
        this.size = size;
        this.height = height;
        this.options = options;

        // Dimensi jendela (dipakai buildRoom & buildWindowFrame)
        this.window = {
            width: 6,
            height: 2.2,
            bottom: 0.8 // tinggi ambang dari lantai
        };

        this.buildRoom();
        this.buildWindowFrame();
        this.buildLighting();
    }

    buildRoom() {
        const halfSize = this.size / 2;

        // ── Lantai ──
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(this.size, this.size),
            new THREE.MeshStandardMaterial({
                color: 0x555555,
                map: this.loadTexture(this.options.floorTexture, 4),
                roughness: 0.9,
                side: THREE.DoubleSide
            })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // ── Plafon ──
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(this.size, this.size),
            new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.9, side: THREE.DoubleSide })
        );
        ceiling.position.y = this.height;
        ceiling.rotation.x = Math.PI / 2;
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);

        // Texture paths are optional; null keeps the room's flat-color materials.
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x667788,
            map: this.loadTexture(this.options.wallTexture, 4),
            roughness: 0.9,
            side: THREE.DoubleSide
        });

        const wallsGroup = new THREE.Group();

        // North wall (-Z) — utuh
        const wallNorth = new THREE.Mesh(
            new THREE.PlaneGeometry(this.size, this.height),
            wallMaterial
        );
        wallNorth.position.set(0, this.height / 2, -halfSize);
        wallNorth.receiveShadow = true;
        wallsGroup.add(wallNorth);

        // West wall (-X) — utuh
        const wallWest = new THREE.Mesh(
            new THREE.PlaneGeometry(this.size, this.height),
            wallMaterial
        );
        wallWest.position.set(-halfSize, this.height / 2, 0);
        wallWest.rotation.y = Math.PI / 2;
        wallWest.receiveShadow = true;
        wallsGroup.add(wallWest);

        // South wall (+Z) — DENGAN LUBANG JENDELA
        const wallSouth = this.buildWallWithWindow(wallMaterial);
        wallSouth.position.set(0, 0, halfSize);
        wallSouth.rotation.y = Math.PI;
        wallSouth.receiveShadow = true;
        wallsGroup.add(wallSouth);

        // East wall (+X) — utuh
        const wallEast = new THREE.Mesh(
            new THREE.PlaneGeometry(this.size, this.height),
            wallMaterial
        );
        wallEast.position.set(halfSize, this.height / 2, 0);
        wallEast.rotation.y = -Math.PI / 2;
        wallEast.receiveShadow = true;
        wallsGroup.add(wallEast);

        this.scene.add(wallsGroup);
    }

    loadTexture(path, repeat) {
        if (!path) return null;

        const texture = new THREE.TextureLoader().load(
            path,
            (loadedTexture) => {
                loadedTexture.colorSpace = THREE.SRGBColorSpace;
                loadedTexture.wrapS = THREE.RepeatWrapping;
                loadedTexture.wrapT = THREE.RepeatWrapping;
                loadedTexture.repeat.set(repeat, repeat);
            },
            undefined,
            (error) => console.warn(`Room texture could not be loaded: ${path}`, error)
        );
        return texture;
    }

    // Bangun dinding dengan lubang persegi memakai THREE.Shape + Path (hole)
    buildWallWithWindow(material) {
        const w = this.size;
        const h = this.height;

        const shape = new THREE.Shape();
        shape.moveTo(-w / 2, 0);
        shape.lineTo( w / 2, 0);
        shape.lineTo( w / 2, h);
        shape.lineTo(-w / 2, h);
        shape.lineTo(-w / 2, 0);

        // Lubang jendela (koordinat lokal dinding: X ∈ [-w/2, w/2], Y ∈ [0, h])
        const winW = this.window.width;
        const winH = this.window.height;
        const winB = this.window.bottom;
        const winL = -winW / 2;
        const winR =  winW / 2;
        const winT =  winB + winH;

        const hole = new THREE.Path();
        hole.moveTo(winL, winB);
        hole.lineTo(winR, winB);
        hole.lineTo(winR, winT);
        hole.lineTo(winL, winT);
        hole.lineTo(winL, winB);

        shape.holes.push(hole);

        const geo = new THREE.ShapeGeometry(shape);
        return new THREE.Mesh(geo, material);
    }

    // Frame kayu + mullion + kaca tipis di sisi dalam dinding
    buildWindowFrame() {
        const halfSize = this.size / 2;
        const winW = this.window.width;
        const winH = this.window.height;
        const winB = this.window.bottom;

        const frameMat = new THREE.MeshStandardMaterial({
            color: 0x3d2a1a,
            roughness: 0.7,
            metalness: 0.1
        });

        const thick = 0.12;      // tebal batang frame
        const depth = 0.22;      // kedalaman keluar dari dinding

        const group = new THREE.Group();
        // Geser sedikit ke dalam ruangan supaya frame tidak z-fight dengan dinding
        group.position.set(0, 0, halfSize - 0.02);

        const addBar = (bw, bh, bd, x, y, z = 0) => {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), frameMat);
            bar.position.set(x, y, z);
            bar.castShadow = true;
            bar.receiveShadow = true;
            group.add(bar);
        };

        // Sisi atas
        addBar(winW + thick * 2, thick, depth,
               0, winB + winH + thick / 2);
        // Sisi bawah (ambang / sill lebih tebal & menonjol)
        addBar(winW + thick * 4, thick * 1.6, depth * 2,
               0, winB - thick * 0.8, -0.08);
        // Sisi kiri
        addBar(thick, winH, depth,
               -winW / 2 - thick / 2, winB + winH / 2);
        // Sisi kanan
        addBar(thick, winH, depth,
                winW / 2 + thick / 2, winB + winH / 2);

        // Mullion tengah (vertikal & horizontal)
        addBar(thick * 0.7, winH, depth * 0.8, 0, winB + winH / 2);
        addBar(winW, thick * 0.7, depth * 0.8, 0, winB + winH / 2);

        // Kaca tipis transparan (opsional, untuk kesan "ada kaca")
        const glass = new THREE.Mesh(
            new THREE.PlaneGeometry(winW, winH),
            new THREE.MeshBasicMaterial({
                color: 0xbcd8ff,
                transparent: true,
                opacity: 0.08,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
        glass.position.set(0, winB + winH / 2, 0.02);
        group.add(glass);

        this.scene.add(group);
    }

    buildLighting() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.set(1024, 1024);
        this.scene.add(dirLight);

        const fixture = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.12, 0.5),
            new THREE.MeshStandardMaterial({
                color: 0xfff4d6,
                emissive: 0xffd48a,
                emissiveIntensity: 1.2,
                roughness: 0.4
            })
        );
        fixture.position.set(0, this.height - 0.08, 0);
        this.scene.add(fixture);

        this.ceilingLight = new THREE.PointLight(0xffedc2, 22, this.size * 1.8);
        this.ceilingLight.position.set(0, this.height - 0.25, 0);
        this.ceilingLight.castShadow = true;
        this.ceilingLight.shadow.mapSize.set(1024, 1024);
        this.scene.add(this.ceilingLight);

        this.pointLight = new THREE.PointLight(0xffaa50, 1.8, 24);
        this.pointLight.position.set(0, 2.5, 0);
        this.scene.add(this.pointLight);

        // NEW: cahaya hangat "dari luar" jendela
        const windowLight = new THREE.DirectionalLight(0xfff0c8, 0.8);
        windowLight.position.set(0, 2.5, this.size / 2 + 1);
        windowLight.target.position.set(0, 1.2, 0);
        this.scene.add(windowLight);
        this.scene.add(windowLight.target);
    }
}

export default Room;