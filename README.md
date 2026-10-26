<div align="left">

# 🚪 Escape Room 3D

## 👥 Anggota Kelompok

| Name           | NRP        | Kelas     | Kontribusi Utama |
| ---            | ---        | ----------| ---              |
| Joaquin Fairuz Nawfal Ismono | 5025241106 | B | Lighting, Shadow, Raycasting, VFX, UI/HUD, Integration, Animation |
| Hasan Abdurrahman | 5025241114 | B | Scene, Camera, Game State, Puzzle, PBR, Interaction |

---

## 📋 Daftar Isi

- [Anggota Kelompok](#-anggota-kelompok)
- [Deskripsi Game](#-deskripsi-game)
- [Objective](#-objective)
- [Completion State](#-completion-state)
- [Cara Menjalankan](#-cara-menjalankan)
- [Kontrol](#-kontrol)
- [Alur Permainan](#️-alur-permainan)
- [Fitur Grafika](#-fitur-grafika)
- [Struktur Proyek](#️-struktur-proyek)
- [Detail Teknis](#-detail-teknis)
- [Asset Credits](#-asset-credits)
- [Kendala & Solusi](#-kendala--solusi)

---

## 🎮 Deskripsi Game

**Escape Room 3D** adalah mini game puzzle berbasis browser yang dikembangkan menggunakan Three.js. Pemain terjebak di dalam ruangan gelap yang misterius dan harus menemukan petunjuk tersembunyi, membuka peti, mengambil kunci, lalu keluar melalui pintu menggunakan kode yang benar.

Game ini mengintegrasikan materi Pertemuan 1–7, meliputi:
- Computer Graphics Fundamentals
- WebGL
- Transformation & Coordinate System
- Camera & Projection
- Shader, Lighting & Texture
- Three.js
- Interactive 3D Application

### 🎯 Objective
Keluar dari ruangan dengan membuka pintu menggunakan kode tiga digit yang diperoleh dari petunjuk pada lukisan dan kunci dari peti.

### 🏁 Completion State
Pemain dinyatakan menang ketika pintu berhasil dibuka dan animasi pembukaan pintu selesai.
*Tidak terdapat lose state karena game berfokus pada eksplorasi dan pemecahan teka-teki (Interactive Puzzle Game).*

---

## 🚀 Cara Menjalankan

### Prasyarat
- Browser modern: Chrome 90+, Firefox 88+, Edge 90+, atau Safari 15+.
- Koneksi internet untuk memuat Three.js melalui CDN dan import map.
- Python 3 atau Node.js untuk menjalankan local server (opsional, tetapi direkomendasikan).

### Cara 1 — Menggunakan Live Server (Direkomendasikan)
Jalankan perintah berikut di direktori proyek.

Menggunakan Python 3:
```bash
python -m http.server 8000
```
Alternatif menggunakan Node.js:
```bash
npx serve .
```
Setelah server berjalan, buka alamat berikut di browser:
```text
http://localhost:8000
```

### Cara 2 — Membuka Langsung
Buka file `index.html` menggunakan browser.
> ⚠️ **Peringatan:** Beberapa browser, termasuk Chrome, dapat memblokir ES modules ketika halaman dibuka melalui protokol `file://`. Gunakan local server jika game tidak berjalan dengan benar.

### Cara 3 — Menggunakan Vite
Untuk menjalankan proyek melalui development server Vite:
```bash
npm create vite@latest escape-room -- --template vanilla
cd escape-room
npm install
npm install three
```
Salin file proyek ke direktori yang sesuai, lalu jalankan:
```bash
npm run dev
```
> *Catatan: Konfigurasi Vite mungkin memerlukan penyesuaian struktur file dan import apabila proyek awal menggunakan import map CDN.*

---

## 🎮 Kontrol

| Input | Aksi |
| :--- | :--- |
| `W`, `A`, `S`, `D` | Bergerak maju, kiri, mundur, dan kanan |
| `↑`, `↓`, `←`, `→` | Alternatif kontrol pergerakan |
| *Drag mouse* | Memutar kamera untuk melihat sekeliling |
| *Klik kiri* | Berinteraksi dengan objek yang ditunjuk crosshair |
| `Enter` | Mengirim kode ketika modal kode terbuka |
| *Klik tombol Batal* | Menutup modal kode |

> 💡 **Tips:** Arahkan crosshair ke objek interaktif hingga berubah menjadi kuning. Perubahan warna tersebut menandakan bahwa objek dapat diinteraksikan.

---

## 🗺️ Alur Permainan

```text
START
  │
  ▼
Jelajahi ruangan menggunakan WASD dan drag mouse
  │
  ▼
Temukan dan klik 3 lukisan petunjuk
  │
  ▼
Angka petunjuk muncul di HUD: _ _ _
  │
  ▼
Buka peti
  │
  ├── Animasi peti terbuka
  └── Efek sparkles muncul
  │
  ▼
Kunci diambil secara otomatis
  │
  ▼
Klik pintu untuk membuka modal kode
  │
  ▼
Masukkan kode 471
  │
  ▼
Pintu terbuka dengan animasi
  │
  ▼
WIN SCREEN ✨
```

### Detail Puzzle
| Elemen | Nilai |
| :--- | :--- |
| Jumlah lukisan | 3 |
| Angka petunjuk | 4, 7, 1 |
| Kode pintu | 471 |
| Syarat membuka pintu | Ketiga lukisan ditemukan dan kunci diperoleh |

---

## ✨ Fitur Grafika

### 1. Implementasi Requirement UTS
| No. | Requirement | Status | Implementasi |
| :---: | :--- | :---: | :--- |
| 1 | Scene 3D, camera, dan renderer | ✅ | Room, PerspectiveCamera, WebGLRenderer |
| 2 | Ground, arena, dan environment | ✅ | Floor, walls, ceiling, fog, environment map |
| 3 | Minimal 3 jenis objek | ✅ | Lukisan, peti, pintu, kunci, dan artefak |
| 4 | Scene graph hierarchy | ✅ | Door hinge, chest lid, painting group |
| 5 | Minimal 1 aset GLTF/GLB | ✅ | `models/model.glb` dengan fallback prosedural |
| 6 | Material PBR | ✅ | Material berbasis `MeshStandardMaterial` |
| 7 | Lighting | ✅ | Ambient, Hemisphere, Point, dan Directional Light |
| 8 | Shadow casting dan receiving | ✅ | Peti/pintu melakukan cast shadow; floor/walls menerima shadow |
| 9 | Environment | ✅ | Equirectangular environment map dan FogExp2 |
| 10 | Minimal 2 jenis animasi | ✅ | Enam animasi |
| 11 | Minimal 3 interaksi | ✅ | Klik lukisan, klik peti, klik pintu, dan pergerakan pemain |
| 12 | `THREE.Raycaster` | ✅ | Hover detection dan click interaction |
| 13 | Minimal 2 VFX | ✅ | Dust particles dan key sparkles |
| 14 | UI/HUD | ✅ | Objectives, code hint, crosshair, modal, dan win screen |
| 15 | Completion state | ✅ | Win screen setelah pintu terbuka |

### 2. Animasi
| No. | Animasi | Tipe |
| :---: | :--- | :--- |
| 1 | Torch flicker melalui perubahan intensitas cahaya | Procedural animation |
| 2 | Dust particles bergerak naik | VFX animation |
| 3 | Chest lid terbuka | Transform animation |
| 4 | Key melayang dan berotasi | Object animation |
| 5 | Door terbuka melalui rotasi hinge | Transform animation |
| 6 | Painting sway dan emissive pulse | Procedural animation |

### 3. Visual Effects (VFX)
| No. | Efek | Teknik |
| :---: | :--- | :--- |
| 1 | Dust particles (180 titik) | `THREE.Points` + AdditiveBlending |
| 2 | Key sparkles (50 titik) | `THREE.Points` dengan rotasi dan gerakan naik |
| 3 | Emissive pulse | Perubahan dinamis `material.emissiveIntensity` |
| 4 | Hover glow | Transisi CSS pada crosshair |

### 4. Interaction & Raycasting
| Interaksi | Trigger | Respons |
| :--- | :--- | :--- |
| **Hover objek** | Raycast setiap frame | Crosshair berubah kuning dan hint teks muncul |
| **Klik lukisan** | Klik kiri pada objek | Angka muncul, toast ditampilkan, HUD diperbarui |
| **Klik peti** | Klik kiri pada objek | Animasi peti terbuka dan kunci muncul |
| **Klik pintu** | Klik kiri pada objek | Validasi persyaratan dan modal kode |
| **Submit kode** | Enter atau tombol submit | Kode divalidasi; pintu terbuka atau pesan error muncul |

---

## 🗂️ Struktur Proyek

```text
praktikum-uts/
│
├── index.html                 # Entry point dan import map CDN
├── README.md                  # Dokumentasi proyek
│
├── src/
│   ├── main.js                # Game coordinator & loop
│   ├── Room.js                # Kelas ruangan, lantai, atap, dinding, & lighting
│   ├── RoomObjects.js         # Kelas objek statis (Pintu, Peti, Lukisan, Kunci)
│   ├── RoomVFX.js             # Kelas partikel debu & sparkles
│   ├── puzzles/
│   │   ├── PlanetaryOrderPuzzle.js
│   │   ├── SimonPuzzle.js
│   │   ├── EclipsePuzzle.js
│   │   └── Orbit.js           # Komponen orbit untuk puzzle gerhana
│   ├── FirstPersonController.js # Kontrol kamera FPS & WASD
│   └── style.css              # Styling HUD, modal, toast, dan win screen
│
├── models/
│   └── model.glb              # (Opsional) model dekorasi
│
└── environment/
    └── environment.jpg        # (Opsional) environment map
```

### Penjelasan File
| File | Fungsi |
| :--- | :--- |
| `index.html` | Struktur HTML, HUD, dan import map Three.js |
| `src/main.js` | Game coordinator, state machine, raycasting, dan loop animasi |
| `src/Room.js` | Kelas OOP untuk membangun ruangan, lantai, langit-langit, dan pencahayaan |
| `src/RoomObjects.js` | Kelas OOP untuk objek ruangan; lukisan menampilkan petunjuk setelah puzzle terkait selesai |
| `src/RoomVFX.js` | Kelas OOP untuk efek partikel debu dan sparkles |
| `src/puzzles/PlanetaryOrderPuzzle.js` | Menyusun planet dengan menukar posisinya |
| `src/puzzles/SimonPuzzle.js` | Mengulang urutan tombol bercahaya |
| `src/puzzles/EclipsePuzzle.js` | Menghentikan orbit saat Bulan berada di antara Matahari dan Bumi |
| `src/puzzles/Orbit.js` | Komponen orbit yang dipakai puzzle gerhana |
| `src/FirstPersonController.js` | Kelas OOP untuk kontrol kamera FPS, PointerLock, dan pergerakan WASD |
| `src/style.css` | Styling HUD, crosshair, modal, toast, dan win screen |
| `models/model.glb` | Aset GLTF/GLB opsional; fallback tersedia |
| `environment/environment.jpg`| Environment map opsional; fallback warna dan fog tersedia |

> 💡 **Fallback visual:** Proyek dirancang agar tetap berjalan tanpa `models/model.glb` dan `environment/environment.jpg`, selama mekanisme fallback yang dijelaskan telah diimplementasikan dengan benar. Kedua file tersebut dapat dihilangkan jika tidak digunakan.

---

## 🔧 Detail Teknis

### 1. Teknologi
| Kategori | Teknologi |
| :--- | :--- |
| Bahasa pemrograman | JavaScript (ES Modules) |
| Library 3D | Three.js v0.160 |
| Loader | GLTFLoader, TextureLoader |
| Modul dan dependency | Import map melalui CDN, tanpa proses build |
| Styling | CSS3, custom properties, Flexbox, dan CSS animation |

Ruangan menggunakan material yang merespons pencahayaan dan menyediakan tekstur opsional untuk dinding serta lantai. Secara default tekstur dinonaktifkan (`null`), sehingga warna datar tetap digunakan. Untuk mengaktifkan tekstur, berikan path pada opsi `wallTexture` atau `floorTexture` saat membuat `Room`.

### 2. Scene Graph
Struktur scene graph berikut menggambarkan hubungan parent-child pada objek utama.

```text
Scene
├── Lights
│   ├── AmbientLight
│   ├── HemisphereLight
│   ├── PointLight (torch) — cast shadow
│   └── DirectionalLight — cast shadow
│
├── Room
│   ├── Floor — receive shadow
│   ├── Ceiling
│   └── Walls — 5 meshes dengan celah pintu
│
├── DoorGroup — interactable
│   ├── DoorPanel — cast shadow
│   ├── Handle
│   └── DoorLock
│
├── ChestGroup — interactable
│   ├── ChestBase — cast shadow
│   ├── ChestTrim
│   ├── LidHinge — pivot di belakang peti
│   │   ├── Lid — cast shadow
│   │   └── LidTrim
│   └── ChestLock
│
├── KeyGroup — tersembunyi hingga peti dibuka
│   ├── KeyRing
│   ├── KeyShaft
│   ├── KeyTooth1
│   └── KeyTooth2
│
├── Paintings[3] — interactable
│   ├── Frame — cast shadow
│   └── CanvasMesh — CanvasTexture angka
│
└── VFX
    ├── Dust — 180 particles
    └── Sparkles — 50 particles
```

### 3. Raycasting Flow
Raycasting digunakan untuk mendeteksi objek yang berada di tengah pandangan pemain.
Contoh alur implementasi:

```javascript
// Setiap frame, arahkan raycaster dari tengah layar.
raycaster.setFromCamera(screenCenter, camera);

const hits = raycaster.intersectObjects(interactables, true);

// Cari root object melalui parent hierarchy.
for (const hit of hits) {
  const root = getInteractableRoot(hit.object);

  if (root) {
    return root; // door, chest, atau puzzle
  }
}
```

**Syarat interaksi klik:**
- Jarak drag mouse kurang dari 6px, sehingga gerakan kamera tidak dianggap sebagai klik.
- State game sedang `playing` dan pointer terkunci (`gameState.getState() === 'playing'`).
- Crosshair menunjuk objek yang dapat diinteraksikan.

### 4. State Machine
State utama permainan:
```javascript
hasKey = false;
chestOpened = false;
doorOpen = false;
foundCount = 0;
```

**Alur perubahan state:**
```text
START
  │
  ├── Klik lukisan yang belum ditemukan
  │     └── foundCount bertambah
  │
  ├── Klik peti
  │     └── chestOpened = true
  │           └── Kunci diambil otomatis
  │                 └── hasKey = true
  │
  └── Klik pintu
        │
        ├── foundCount < 3
        │     └── Toast error
        │
        ├── !hasKey
        │     └── Toast error
        │
        └── Semua persyaratan terpenuhi
              │
              └── Modal kode ditampilkan
                    │
                    ├── Kode salah
                    │     └── Toast error dan coba lagi
                    │
                    └── Kode benar
                          └── doorOpen = true
                                └── Animasi pintu
                                      └── WIN SCREEN
```

### 5. Catatan Performa
| Parameter | Nilai | Tujuan |
| :--- | :--- | :--- |
| Shadow map size | 1024 × 1024 | Menyeimbangkan kualitas dan performa |
| Dust particles | 180 | Memberikan efek atmosfer tanpa beban berlebihan |
| Sparkle particles | 50 | Efek visual lokal di sekitar kunci |
| Total draw calls | Target < 40 | Mengurangi overhead rendering |
| Pixel ratio cap | 2 | Membatasi over-render pada layar beresolusi tinggi |
| Fog density | 0.055 | Mengurangi visibilitas objek jauh dan memperkuat atmosfer |

> *Catatan: Nilai performa di atas merupakan konfigurasi atau target yang didokumentasikan. Hasil aktual bergantung pada implementasi, perangkat, browser, dan pengaturan renderer.*

---

## 📦 Asset Credits
Proyek ini dikembangkan dari awal dan tidak menggunakan template atau fork proyek lain.

| Aset | Pembuat | Sumber | Lisensi |
| :--- | :--- | :--- | :--- |
| Three.js | Three.js Contributors | [threejs.org](https://threejs.org/) | MIT |
| Environment HDR | Octavian Tudose | [Poly Haven](https://polyhaven.com/a/kloppenheim_02_puresky) | CC0 |
| Model GLB | Innerscene — original model | [Inner Scene](https://www.innerscene.com/tools/library/3d-parts/voyage-campaign-chest-1d609eb1) | CC0 |
| Planet Texture | solarsystemscope | [solarsystemscope](https://www.solarsystemscope.com/textures/) | CC BY |

> ⚠️ **Perhatian:** Jika menggunakan `environment/environment.jpg` atau `models/model.glb`, cantumkan kredit lengkap berupa nama aset, pembuat, sumber, dan lisensi pada tabel di atas.

**Rekomendasi Sumber Aset Gratis:**
| Jenis Aset | Sumber | Lisensi Umum |
| :--- | :--- | :--- |
| HDR Environment | [Poly Haven](https://polyhaven.com/) | CC0 |
| Model 3D | [Sketchfab](https://sketchfab.com/) *(gunakan filter lisensi)* | Bervariasi (CC0, CC BY) |
| Texture | [ambientCG](https://ambientcg.com/) | CC0, CC BY |

> *Penting: Periksa lisensi setiap aset secara individual sebelum digunakan dan cantumkan atribusi sesuai ketentuannya.*

---

## 🧩 Kendala & Solusi

| No. | Kendala | Solusi |
| :---: | :--- | :--- |
| 1 | Shadow berkedip (*shadow acne*) | Mengatur `shadow.bias = -0.0005`. |
| 2 | Hover tidak stabil saat pemain bergerak | Melakukan raycast dari tengah crosshair, bukan dari posisi mouse. |
| 3 | Chest lid tidak dapat dibuka dengan benar | Memisahkan hinge group dan menempatkan pivot di belakang peti. |
| 4 | `environment.jpg` tidak tersedia | Menggunakan fallback warna solid dan fog. |
| 5 | `model.glb` tidak tersedia | Menggunakan fallback pedestal dan icosahedron prosedural. |
| 6 | Rotasi kamera terlalu sensitif | Mengalikan input mouse dengan 0.004 dan membatasi pitch. |
| 7 | Pemain dapat menembus dinding | Membatasi posisi X/Z setiap frame. |
| 8 | Asset atau texture diblokir melalui `file://` | Menjalankan proyek menggunakan local server. |

---