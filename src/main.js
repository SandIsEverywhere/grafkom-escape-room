import * as THREE from 'three';
import FirstPersonController from './FirstPersonController.js';
import GameStateManager from './GameStateManager.js';
import Room from './Room.js';
import RoomObjects from './RoomObjects.js';
import SolarSystem from './Orbit.js';
import RoomVFX from './RoomVFX.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x0b1020 );

const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

// ── State permainan (FIX: sebelumnya tidak dideklarasikan) ──────────
// Working on: WorldStateManager
const state = {
    foundCount: 0,      // jumlah lukisan yang sudah dibuka
    hasKey: false,      // kunci sudah diambil
    doorOpen: false,    // pintu sudah terbuka
    chestOpened: false  // peti sudah dibuka
};

// Kode sandi = urutan angka lukisan idx 0,1,2 → '4','7','1'
const PUZZLE_CODE = '471';

// 10A — Environment Texture Loader with Fallback
const texLoader = new THREE.TextureLoader();
texLoader.load(
    'environment/environment.jpg',
    (tex) => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        scene.environment = tex;
        scene.background = tex;
        console.log('✔ Environment map loaded successfully');
    },
    undefined,
    (error) => {
        console.warn('⚠ environment/environment.jpg tidak ditemukan, memakai background solid + fog:', error);
        scene.background = new THREE.Color(0x223344); // Ubah dari gelap gulita ke warna biru keabuan terang
        scene.fog = new THREE.FogExp2(0x223344, 0.02);
    }
);

// Build Room (Phase 2 - OOP)
const room = new Room(scene, 20, 4);

// Build Static Objects (Phase 4)
const roomObjects = new RoomObjects(scene, room.size);

// Build VFX (Phase 8)
const roomVFX = new RoomVFX(scene, room.size, 4);

// Build Solar System (Orbit Bumi, Bulan, Matahari)
const solarSystem = new SolarSystem(scene);

// Using FirstPersonController
const fpsController = new FirstPersonController( camera, scene, renderer.domElement );
fpsController.roomSize = room.size;

// Raycaster & Interaction setup (Phase 5 & 6)
const raycaster = new THREE.Raycaster();
const screenCenter = new THREE.Vector2(0, 0);
let hovered = null;

const crosshairEl = document.getElementById('crosshair');
const hintEl = document.getElementById('hint');

// UI Elements & Modals (Phase 9)
const toastEl = document.getElementById('toast');
const codeModal = document.getElementById('code-modal');
const codeInput = document.getElementById('code-input');
const codeHintDisplay = document.getElementById('code-hint-display');
const winScreen = document.getElementById('win-screen');

// Toast helper function
let toastTimer = null;
function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastEl.classList.add('hidden');
    }, 2500);
}

function isPaused() {
    return !codeModal.classList.contains('hidden') || !winScreen.classList.contains('hidden');
}

// HUD update helper (Phase 9C)
function updateHUD() {
    // 1. Paintings objective
    const paintingsLi = document.getElementById('obj-paintings');
    paintingsLi.textContent = `Cari Petunjuk Lukisan (${state.foundCount}/3)`;
    if (state.foundCount >= 3) {
        paintingsLi.classList.add('done');
    } else {
        paintingsLi.classList.remove('done');
    }

    // 2. Key objective
    const keyLi = document.getElementById('obj-key');
    if (state.hasKey) {
        keyLi.classList.add('done');
    } else {
        keyLi.classList.remove('done');
    }

    // 3. Door objective
    const doorLi = document.getElementById('obj-door');
    if (state.doorOpen) {
        doorLi.classList.add('done');
    } else {
        doorLi.classList.remove('done');
    }

    // 4. Code Hint Display (Show discovered digits in order: index 0 -> 4, index 1 -> 7, index 2 -> 1)
    let clueStr = '';
    roomObjects.paintings.forEach((p) => {
        clueStr += p.userData.found ? p.userData.number + ' ' : '_ ';
    });
    codeHintDisplay.textContent = `Petunjuk Kode: ${clueStr.trim()}`;
    codeHintDisplay.classList.remove('hidden');
}

// 6B — Handler Functions
function revealPainting(painting) {
    if (painting.userData.index === 2) {
        const isPausedNow = solarSystem.togglePause();
        
        if (isPausedNow) {
            const isAligned = solarSystem.checkEclipseAlignment();
            if (isAligned) {
                showToast('✨ Gerhana Sempurna! Petunjuk terbuka.');
            } else {
                showToast('⏸️ Orbit dipause. Posisi belum sejajar (gerhana)!');
                return;
            }
        } else {
            showToast('▶️ Orbit dilanjutkan.');
            return;
        }
    }

    if (!painting.userData.found) {
        painting.userData.found = true;
        state.foundCount++;
        const newTex = roomObjects.makeClueTexture(painting.userData.number, true);
        painting.userData.canvasMesh.material.map = newTex;
        painting.userData.canvasMesh.material.needsUpdate = true;
        showToast(`🔍 Petunjuk #${state.foundCount} ditemukan: Angka '${painting.userData.number}'`);
    } else {
        showToast('✓ Petunjuk sudah ditemukan');
    }
    updateHUD();
}

function openChest() {
    if (!state.chestOpened) {
        state.chestOpened = true;
        roomObjects.keyGroup.visible = true;
        if (roomVFX.sparkles) roomVFX.sparkles.visible = true;
        showToast('📦 Peti dibuka! Kunci terlihat.');
    } else {
        showToast('📦 Peti sudah terbuka.');
    }
}

function tryOpenDoor() {
    if (!state.hasKey) {
        showToast('❌ Pintu terkunci! Butuh kunci.');
        return;
    }
    if (state.doorOpen) {
        showToast('🚪 Pintu sudah terbuka!');
        return;
    }
    // Show password modal (Phase 9C)
    codeModal.classList.remove('hidden');
    codeInput.value = '';
    codeInput.focus();
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
}

function attemptDoorCode() {
    const val = codeInput.value;
    if (val === PUZZLE_CODE) {
        state.doorOpen = true;
        codeModal.classList.add('hidden');
        showToast('🎉 Kode benar! Pintu terbuka. Silakan jalan keluar!');
    } else {
        showToast('❌ Kode salah!');
        codeInput.value = '';
        codeInput.focus();
    }
    updateHUD();
}

function handleInteract(obj) {
    if (!obj) return;
    if (obj.userData.isPainting) {
        revealPainting(obj);
    } else if (obj.userData.isChest) {
        openChest();
    } else if (obj.userData.isDoor) {
        tryOpenDoor();
    }
}

// 6C — Click Wiring
let downX = 0, downY = 0;
window.addEventListener('mousedown', (e) => {
    downX = e.clientX;
    downY = e.clientY;
});

window.addEventListener('mouseup', (e) => {
    const dragDist = Math.hypot(e.clientX - downX, e.clientY - downY);
    if (dragDist < 6 && !isPaused() && fpsController.controls.isLocked) {
        handleInteract(hovered);
    }
});

// Modal wiring (Phase 9C)
document.getElementById('submit-code').addEventListener('click', attemptDoorCode);
document.getElementById('cancel-code').addEventListener('click', () => {
    codeModal.classList.add('hidden');
});
codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        attemptDoorCode();
    }
});

// Restart button wiring
document.getElementById('restart-btn').addEventListener('click', () => {
    window.location.reload();
});

function getInteractableRoot(hitObject) {
    let o = hitObject;
    while (o && o !== scene) {
        if (o.userData && (o.userData.isDoor || o.userData.isChest || o.userData.isPainting)) {
            return o;
        }
        o = o.parent;
    }
    return null;
}

function detectHover() {
    raycaster.setFromCamera(screenCenter, camera);
    const hits = raycaster.intersectObjects(roomObjects.interactables, true);
    if (hits.length > 0) {
        const root = getInteractableRoot(hits[0].object);
        if (root) return root;
    }
    return null;
}

camera.position.set(0, 1.6, 5);

// Animation & Progress variables (Phase 7)
let chestProgress = 0;
let doorProgress = 0;
let elapsed = 0;
let keyCollectTimer = 0;
let keyFading = false;

const timer = new THREE.Timer();
function animate(timestamp) {
    requestAnimationFrame( animate );

    timer.update(timestamp);
    // 10C — Delta time clamp agar tidak lag/spike
    const delta = Math.min(timer.getDelta(), 0.05);
    elapsed = timer.getElapsed();
    
    fpsController.update(delta);

    // Phase 5: Raycasting & Hover detection
    if (!isPaused()) {
        hovered = detectHover();
        if (hovered) {
            crosshairEl.classList.add('active');
            hintEl.textContent = hovered.userData.hint || '';
        } else {
            crosshairEl.classList.remove('active');
            hintEl.textContent = '';
        }
    } else {
        crosshairEl.classList.remove('active');
        hintEl.textContent = '';
    }

    // ─── PHASE 7: ANIMATIONS ───────────────────────────────────────────────

    // 1. Chest lid open animation
    if (state.chestOpened && chestProgress < 1) {
        chestProgress = Math.min(1, chestProgress + delta * 2.2);
        const eased = 1 - Math.pow(1 - chestProgress, 3);
        if (roomObjects.lidHinge) {
            roomObjects.lidHinge.rotation.x = -eased * Math.PI * 0.72;
        }
    }

    // 2. Door open animation & torch color transition (VFX #4)
    if (state.doorOpen && doorProgress < 1) {
        doorProgress = Math.min(1, doorProgress + delta * 1.1);
        const eased = 1 - Math.pow(1 - doorProgress, 3);
        if (roomObjects.doorPivot) {
            roomObjects.doorPivot.rotation.y = -eased * Math.PI * 0.75;
        }

        if (room.pointLight) {
            const startColor = new THREE.Color(0xffaa50);
            const targetColor = new THREE.Color(0x66ff88);
            room.pointLight.color.copy(startColor).lerp(targetColor, doorProgress);
        }
    }

    // Cek posisi pemain (kamera) melewati pintu atau belum (jika pintu sudah terbuka)
    if (state.doorOpen && doorProgress >= 1) {
        if (camera.position.z < -8.0 && camera.position.x > -2.2 && camera.position.x < 0.2) {
            if (winScreen.classList.contains('hidden')) {
                winScreen.classList.remove('hidden');
                showToast('🏆 Anda berhasil keluar ruangan!');
            }
        }
    }

    // 3. Key float animation
    if (roomObjects.keyGroup.visible && !keyFading) {
        roomObjects.keyGroup.rotation.y += delta * 1.8;
        roomObjects.keyGroup.position.y = 0.5 + Math.sin(elapsed * 2) * 0.08;
    }

    // 4. Key fade-out animation
    if (keyFading) {
        roomObjects.keyGroup.position.y += delta * 2.5;
        roomObjects.keyGroup.scale.multiplyScalar(1 - delta * 4);
    }

    // 5. Torch / Point Light flicker
    if (room.pointLight) {
        room.pointLight.intensity = 1.8 + Math.sin(elapsed * 8.2) * 0.18 + Math.sin(elapsed * 13.7) * 0.12;
    }

    // 6. Painting sway animation & Emissive pulse (VFX #3)
    roomObjects.paintings.forEach((painting, idx) => {
        const canvasMesh = painting.userData.canvasMesh;
        if (canvasMesh && canvasMesh.material) {
            if (painting.userData.found) {
                canvasMesh.material.emissive = new THREE.Color(0xffaa00);
                canvasMesh.material.emissiveIntensity = 0.7 + Math.sin(elapsed * 2.2) * 0.15;
            } else {
                canvasMesh.material.emissive = new THREE.Color(0x552200);
                canvasMesh.material.emissiveIntensity = 0.18 + Math.sin(elapsed * 1.4 + idx) * 0.1;
            }
        }

        if (!painting.userData.found) {
            painting.rotation.z = Math.sin(elapsed * 0.7 + idx) * 0.015;
        } else {
            painting.rotation.z = 0;
        }
    });

    // Update Room VFX (Dust & Sparkles)
    roomVFX.update(delta, elapsed, state.chestOpened, state.hasKey);

    // ───────────────────────────────────────────────────────────────────────

    // 6D — Auto-collect Key
    if (state.chestOpened && !state.hasKey) {
        keyCollectTracker(delta);
    }

    // Update Solar System animation
    solarSystem.update(delta);

    // 10B — Fallback Artifact animation (jika model.glb gagal dimuat dan memakai fallback)
    if (roomObjects.fallbackArtifact) {
        roomObjects.fallbackArtifact.rotation.x += delta * 0.8;
        roomObjects.fallbackArtifact.rotation.y += delta * 1.2;
        roomObjects.fallbackArtifact.position.y = 1.3 + Math.sin(elapsed * 2.5) * 0.08;
    }

    renderer.render( scene, camera );
}

function keyCollectTracker(delta) {
    keyCollectTimer += delta;
    if (keyCollectTimer > 1.6) {
        state.hasKey = true;
        keyFading = true;
        showToast('🔑 Kunci didapat!');
        updateHUD();
    }
}

updateHUD(); // Initialize HUD
animate();