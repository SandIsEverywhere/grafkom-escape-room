import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class RoomObjects {
    constructor(scene, roomSize = 20) {
        this.scene = scene;
        this.roomSize = roomSize;

        this.doorGroup = null;
        this.doorPivot = null;
        this.chestGroup = null;
        this.lidHinge = null;
        this.keyGroup = null;
        this.fallbackArtifact = null; // Untuk animasi fallback glb
        this.paintings = [];
        this.interactables = [];

        this.init();
    }

    init() {
        this.buildDoor();
        this.buildChest();
        this.buildKey();
        this.loadModelOrFallback();
        this.buildPaintings();
    }

    // 4A — Door Group
    buildDoor() {
        const DOOR_W = 2.0;
        const DOOR_H = 3.2;
        const halfRoom = this.roomSize / 2;

        const ALCOVE_DEPTH = 1.8;
        const WALL_THICKNESS = 0.2;
        const WALL_HEIGHT = 3.5;
        const doorZ = -halfRoom + ALCOVE_DEPTH;

        this.doorGroup = new THREE.Group();
        this.doorGroup.position.set(-DOOR_W / 2, 0, doorZ);
        this.doorGroup.userData = { isDoor: true, hint: '🚪 Klik untuk membuka pintu' };

        const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.6 });
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x75685a, roughness: 0.9 });
        const metalMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });

        // Door Pivot (Engsel)
        this.doorPivot = new THREE.Group();
        this.doorPivot.position.set(0, 0, 0);
        this.doorGroup.add(this.doorPivot);

        // Panel pintu
        const panelGeo = new THREE.BoxGeometry(DOOR_W - 0.1, DOOR_H - 0.1, 0.1);
        const doorPanel = new THREE.Mesh(panelGeo, woodMat);
        doorPanel.position.set((DOOR_W - 0.1) / 2, DOOR_H / 2, 0);
        doorPanel.castShadow = true;
        doorPanel.receiveShadow = true;
        this.doorPivot.add(doorPanel);

        // Handle pintu
        const handleGeo = new THREE.SphereGeometry(0.09, 16, 16);
        const handle = new THREE.Mesh(handleGeo, metalMat);
        handle.position.set(DOOR_W - 0.35, DOOR_H / 2, 0.08);
        handle.castShadow = true;
        this.doorPivot.add(handle);

        // Kunci pintu
        const lockGeo = new THREE.BoxGeometry(0.22, 0.28, 0.08);
        const lockMat = new THREE.MeshStandardMaterial({ 
            color: 0x222222, 
            emissive: 0xaa3300, 
            emissiveIntensity: 0.25,
            metalness: 0.5,
            roughness: 0.3
        });
        const doorLock = new THREE.Mesh(lockGeo, lockMat);
        doorLock.position.set(DOOR_W - 0.65, DOOR_H / 2, 0.06);
        doorLock.castShadow = true;
        this.doorPivot.add(doorLock);

        // Tembok kanan dan kiri bilik
        const sideWallGeo = new THREE.BoxGeometry(WALL_THICKNESS, WALL_HEIGHT, ALCOVE_DEPTH);
        
        const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
        leftWall.position.set(-WALL_THICKNESS / 2, WALL_HEIGHT / 2, -ALCOVE_DEPTH / 2);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        this.doorGroup.add(leftWall);

        const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
        rightWall.position.set(DOOR_W - 0.1 + WALL_THICKNESS / 2, WALL_HEIGHT / 2, -ALCOVE_DEPTH / 2);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        this.doorGroup.add(rightWall);

        this.scene.add(this.doorGroup);
        this.interactables.push(this.doorGroup);
    }

    // 4B — Chest Group
    buildChest() {
        this.chestGroup = new THREE.Group();
        this.chestGroup.position.set(3, 0, 1.5);
        this.chestGroup.userData = { isChest: true, hint: '📦 Klik untuk membuka peti' };

        const woodMat = new THREE.MeshStandardMaterial({ color: 0x533519, roughness: 0.7 });
        const metalMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.8, roughness: 0.4 });

        // Child 1: chestBase
        const baseGeo = new THREE.BoxGeometry(1.1, 0.6, 0.75);
        const chestBase = new THREE.Mesh(baseGeo, woodMat);
        chestBase.position.y = 0.3;
        chestBase.castShadow = true;
        chestBase.receiveShadow = true;
        this.chestGroup.add(chestBase);

        // Child 2: trim
        const trimGeo = new THREE.BoxGeometry(1.12, 0.08, 0.77);
        const trim = new THREE.Mesh(trimGeo, metalMat);
        trim.position.y = 0.6;
        this.chestGroup.add(trim);

        // Child 3: lidHinge group
        this.lidHinge = new THREE.Group();
        this.lidHinge.position.set(0, 0.6, -0.375);

        // Grandchild: lid
        const lidGeo = new THREE.BoxGeometry(1.1, 0.15, 0.75);
        const lid = new THREE.Mesh(lidGeo, woodMat);
        lid.position.set(0, 0.075, 0.375);
        lid.castShadow = true;
        this.lidHinge.add(lid);

        // Grandchild: lidTrim
        const lidTrimGeo = new THREE.BoxGeometry(1.12, 0.04, 0.77);
        const lidTrim = new THREE.Mesh(lidTrimGeo, metalMat);
        lidTrim.position.set(0, 0.13, 0.375);
        this.lidHinge.add(lidTrim);

        this.chestGroup.add(this.lidHinge);

        // Child 4: chestLock
        const lockGeo = new THREE.BoxGeometry(0.18, 0.22, 0.08);
        const chestLock = new THREE.Mesh(lockGeo, metalMat);
        chestLock.position.set(0, 0.45, 0.38);
        this.chestGroup.add(chestLock);

        this.scene.add(this.chestGroup);
        this.interactables.push(this.chestGroup);
    }

    // 4C — Key (Hidden)
    buildKey() {
        this.keyGroup = new THREE.Group();
        this.keyGroup.position.set(3, 0.5, 1.5);
        this.keyGroup.visible = false; // Hidden initially

        const keyMat = new THREE.MeshStandardMaterial({ 
            color: 0xffd700, 
            metalness: 0.9, 
            roughness: 0.2,
            emissive: 0xffaa00,
            emissiveIntensity: 0.3
        });

        // keyRing (Torus)
        const ringGeo = new THREE.TorusGeometry(0.09, 0.028, 12, 22);
        const keyRing = new THREE.Mesh(ringGeo, keyMat);
        keyRing.rotation.x = Math.PI / 2;
        this.keyGroup.add(keyRing);

        // keyShaft
        const shaftGeo = new THREE.BoxGeometry(0.025, 0.025, 0.28);
        const keyShaft = new THREE.Mesh(shaftGeo, keyMat);
        keyShaft.position.z = -0.16;
        this.keyGroup.add(keyShaft);

        // keyTooth1 & 2
        const tooth1Geo = new THREE.BoxGeometry(0.025, 0.06, 0.04);
        const keyTooth1 = new THREE.Mesh(tooth1Geo, keyMat);
        keyTooth1.position.set(0, -0.015, -0.24);
        this.keyGroup.add(keyTooth1);

        const tooth2Geo = new THREE.BoxGeometry(0.025, 0.04, 0.03);
        const keyTooth2 = new THREE.Mesh(tooth2Geo, keyMat);
        keyTooth2.position.set(0, -0.01, -0.29);
        this.keyGroup.add(keyTooth2);

        this.scene.add(this.keyGroup);
    }

    // 10B — GLB Loader with Fallback
    loadModelOrFallback() {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            'models/model.glb',
            (gltf) => {
                const model = gltf.scene;
                model.position.set(-3.5, 0, 2.5);
                model.scale.set(0.6, 0.6, 0.6);
                model.rotation.y = Math.PI * 0.3;
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                this.scene.add(model);
                console.log('✔ model.glb loaded successfully');
            },
            undefined,
            (error) => {
                console.warn('⚠ models/model.glb tidak ditemukan atau gagal dimuat, memakai fallback prosedural:', error);
                
                // Fallback: Pedestal + Icosahedron artifact
                const pedestal = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.5, 0.6, 1.0, 16),
                    new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 })
                );
                pedestal.position.set(-3.5, 0.5, 2.5);
                pedestal.castShadow = true;
                pedestal.receiveShadow = true;
                this.scene.add(pedestal);

                const artifact = new THREE.Mesh(
                    new THREE.IcosahedronGeometry(0.35, 0),
                    new THREE.MeshStandardMaterial({
                        color: 0x00aaff,
                        roughness: 0.2,
                        metalness: 0.5,
                        emissive: 0x0044ff,
                        emissiveIntensity: 0.5
                    })
                );
                artifact.position.set(-3.5, 1.3, 2.5);
                artifact.castShadow = true;
                this.scene.add(artifact);
                this.fallbackArtifact = artifact; // Simpan untuk animasi float/rotate di animate
            }
        );
    }

    // 4D — Paintings
    makeClueTexture(num, revealed) {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#1a0e04';
        ctx.fillRect(0, 0, 160, 200);

        // Inner border
        ctx.strokeStyle = '#4a2e12';
        ctx.lineWidth = 6;
        ctx.strokeRect(8, 8, 144, 184);

        // Text / Clue number
        ctx.fillStyle = '#e6c687';
        ctx.font = 'bold 90px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(revealed ? num : '?', 80, 105);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    buildPaintings() {
        const half = this.roomSize / 2 - 0.05;
        const paintingDefs = [
            { pos: new THREE.Vector3(-6, 2, -half), rotY: 0, num: '4', idx: 0 },         // North wall left
            { pos: new THREE.Vector3(half, 2, -2), rotY: -Math.PI / 2, num: '7', idx: 1 }, // East wall
            { pos: new THREE.Vector3(-half, 2, 4), rotY: Math.PI / 2, num: '1', idx: 2 }   // West wall
        ];

        const frameMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.6 });

        paintingDefs.forEach((def) => {
            const paintingGroup = new THREE.Group();
            paintingGroup.position.copy(def.pos);
            paintingGroup.rotation.y = def.rotY;

            // Frame
            const frameGeo = new THREE.BoxGeometry(1.3, 1.6, 0.1);
            const frame = new THREE.Mesh(frameGeo, frameMat);
            frame.castShadow = true;
            paintingGroup.add(frame);

            // Canvas Mesh with Texture
            const texture = this.makeClueTexture(def.num, false);
            const canvasGeo = new THREE.PlaneGeometry(1.1, 1.4);
            const canvasMat = new THREE.MeshStandardMaterial({ 
                map: texture,
                emissive: 0x552200,
                emissiveIntensity: 0.18,
                roughness: 0.5
            });
            const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
            canvasMesh.position.z = 0.06;
            paintingGroup.add(canvasMesh);

            paintingGroup.userData = {
                isPainting: true,
                index: def.idx,
                number: def.num,
                canvasMesh: canvasMesh,
                texture: texture,
                found: false
            };

            this.paintings.push(paintingGroup);
            this.scene.add(paintingGroup);
        });
    }
}

export default RoomObjects;
