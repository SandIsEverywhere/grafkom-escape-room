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
Pemain dinyatakan menang setelah kode benar, animasi pintu selesai, dan pemain berjalan melewati pintu.
*Tidak terdapat lose state karena game berfokus pada eksplorasi dan pemecahan teka-teki (Interactive Puzzle Game).*

---

## 🚀 Cara Menjalankan

### Prasyarat
- Browser modern: Chrome 90+, Firefox 88+, Edge 90+, atau Safari 15+.
- Koneksi internet untuk memuat Three.js melalui CDN dan import map.
- Python 3 atau Node.js untuk menjalankan server lokal. Karena proyek menggunakan ES modules, server lokal diperlukan; membuka `index.html` langsung melalui `file://` tidak didukung secara konsisten.

### Menjalankan server lokal
Jalankan salah satu perintah berikut dari direktori proyek:

Menggunakan Python 3:
```bash
python -m http.server 8000
```
Alternatif jika paket `serve` tersedia melalui `npx`:
```bash
npx serve .
```
Setelah server berjalan, buka alamat yang ditampilkan oleh server (untuk Python):
```text
http://localhost:8000
```

---

## 🎮 Kontrol

| Input | Aksi |
| :--- | :--- |
| Klik pada area game | Mengaktifkan Pointer Lock untuk memulai atau melanjutkan permainan |
| `W`, `A`, `S`, `D` | Bergerak maju, kiri, mundur, dan kanan |
| Gerakkan mouse saat Pointer Lock aktif | Memutar kamera untuk melihat sekeliling |
| Klik kiri saat Pointer Lock aktif | Berinteraksi dengan objek di tengah crosshair |
| `Esc` | Melepaskan Pointer Lock dan menjeda permainan; klik area game untuk melanjutkan |
| `Enter` atau tombol **Buka** | Mengirim kode saat modal kode terbuka |
| Tombol **Batal** | Menutup modal kode |

> 💡 **Tips:** Arahkan crosshair ke objek interaktif hingga berubah menjadi kuning dan petunjuk muncul. Ketiga puzzle harus diselesaikan untuk membuka angka pada lukisan; kunci dari peti diperlukan untuk mencoba membuka pintu.

---

## 🗺️ Alur Permainan

```text
START
  │
  ▼
Klik area game untuk mengunci pointer, lalu jelajahi ruangan menggunakan WASD dan mouse
  │
  ▼
Selesaikan puzzle planet, Simon, dan gerhana di dekat lukisan
  │
  ▼
Angka pada ketiga lukisan terbuka dan petunjuk kode diperbarui di HUD
  │
  ▼
Klik peti untuk membukanya
  │
  ├── Animasi peti terbuka
  └── Efek sparkles muncul
  │
  ▼
Kunci muncul dan dikumpulkan otomatis setelah jeda singkat
  │
  ▼
Klik pintu untuk membuka modal kode (setelah kunci didapat)
  │
  ▼
Masukkan kode 471
  │
  ▼
Pintu terbuka dengan animasi; berjalan melewati pintu untuk menang
  │
  ▼
WIN SCREEN ✨
```

### Detail Puzzle
| Elemen | Nilai |
| :--- | :--- |
| Puzzle planet | Tukar posisi 8 planet hingga urut dari Merkurius sampai Neptunus; membuka angka `4` |
| Puzzle Simon | Ulangi urutan 4 tombol berwarna hingga 4 ronde selesai; urutan setiap permainan dibuat acak dan membuka angka `7` |
| Puzzle gerhana | Klik sistem orbit saat Bulan berada di antara Matahari dan Bumi; membuka angka `1` |
| Kode pintu | `471` |
| Syarat membuka modal kode | Kunci didapat dari peti; puzzle tidak diwajibkan oleh logika pintu |
| Syarat membuka pintu | Masukkan kode `471` dengan benar |
| Kondisi menang | Pintu terbuka dan pemain berjalan melewati pintu |

---

## ✨ Fitur Grafika

### 1. Implementasi Requirement UTS
| No. | Requirement | Status | Implementasi |
| :---: | :--- | :---: | :--- |
| 1 | Scene 3D, camera, dan renderer | ✅ | Room, PerspectiveCamera, WebGLRenderer |
| 2 | Ground, arena, dan environment | ✅ | Floor, walls, ceiling, fog, environment map |
| 3 | Minimal 3 jenis objek | ✅ | Lukisan, peti, pintu, kunci, dan 3 puzzle |
| 4 | Scene graph hierarchy | ✅ | Door hinge, chest lid, painting group, puzzle |
| 5 | Minimal 1 aset GLTF/GLB | ✅ | `models/model.glb` dengan fallback prosedural |
| 6 | Material PBR | ✅ | Material berbasis `MeshStandardMaterial` |
| 7 | Lighting | ✅ | Ambient, Point, dan Directional Light |
| 8 | Shadow casting dan receiving | ✅ | Peti/pintu melakukan cast shadow; floor/walls menerima shadow |
| 9 | Environment | ✅ | Equirectangular environment map dan FogExp2 |
| 10 | Minimal 2 jenis animasi | ✅ | Tutup peti, pintu, kunci, sistem orbit gerhana, lukisan, partikel, dan perubahan cahaya |
| 11 | Minimal 3 interaksi | ✅ | Klik lukisan, klik peti, klik pintu, dan pergerakan pemain |
| 12 | `THREE.Raycaster` | ✅ | Hover detection dan click interaction |
| 13 | Minimal 2 VFX | ✅ | Dust particles dan key sparkles |
| 14 | UI/HUD | ✅ | Objectives, code hint, crosshair, modal, dan win screen |
| 15 | Completion state | ✅ | Win screen setelah pintu terbuka |

### 2. Animasi
| No. | Animasi | Tipe |
| :---: | :--- | :--- |
| 1 | Sistem Matahari, Bumi, dan Bulan berorbit | Object animation |
| 2 | Dust particles bergerak naik | VFX animation |
| 3 | Tutup peti terbuka pada pivot engsel | Transform animation |
| 4 | Kunci melayang dan berotasi sebelum dikumpulkan | Object animation |
| 5 | Pintu terbuka melalui rotasi hinge | Transform animation |
| 6 | Lukisan bergoyang dan mengalami emissive pulse | Procedural animation |
| 7 | Point light berkedip; warnanya berubah saat pintu terbuka | Lighting animation |

### 3. Visual Effects (VFX)
| No. | Efek | Teknik |
| :---: | :--- | :--- |
| 1 | Dust particles (180 titik) | `THREE.Points` + AdditiveBlending |
| 2 | Key sparkles (50 titik) | `THREE.Points` dengan rotasi dan gerakan naik |
| 3 | Emissive pulse | Perubahan dinamis `material.emissiveIntensity` |
| 4 | Point light flicker dan perubahan warna saat pintu terbuka | Perubahan dinamis intensitas dan warna cahaya |
| 5 | Hover indicator | Perubahan tampilan crosshair melalui class CSS |

### 4. Interaction & Raycasting
| Interaksi | Trigger | Respons |
| :--- | :--- | :--- |
| **Hover objek** | Raycast setiap frame | Crosshair berubah kuning dan hint teks muncul |
| **Puzzle planet** | Klik dua planet secara berurutan | Posisi kedua planet ditukar; urutan benar membuka petunjuk |
| **Puzzle Simon** | Klik tombol untuk memulai, lalu masukkan urutan | Urutan cahaya bertambah per ronde; empat ronde benar membuka petunjuk |
| **Puzzle gerhana** | Klik sistem orbit saat posisi Bulan tepat | Jika sejajar, petunjuk terbuka; jika tidak, orbit berlanjut |
| **Klik peti** | Klik kiri pada objek | Animasi peti terbuka dan kunci muncul |
| **Klik pintu** | Klik kiri pada objek | Jika kunci sudah didapat, modal kode dibuka |
| **Submit kode** | Enter atau tombol submit | Kode divalidasi; pintu terbuka atau pesan error muncul |

---

## 🗂️ Struktur Proyek

```text
grafkom-escape-room/
│
├── index.html                 # Entry point dan import map CDN
├── README.md                  # Dokumentasi proyek
│
├── src/
│   ├── main.js
│   ├── FirstPersonController.js
│   ├── GameStateManager.js
│   ├── Room.js
│   ├── RoomObjects.js
│   ├── RoomVFX.js
│   ├── WorldState.js
│   ├── style.css
│   ├── puzzles/
│   │   ├── EclipsePuzzle.js
│   │   ├── Orbit.js
│   │   ├── Planet.js
│   │   ├── PlanetaryOrderPuzzle.js
│   │   ├── SimonButton.js
│   │   └── SimonPuzzle.js
│
├── environment/
│   └── environment.jpg
├── models/
│   └── model.glb
│
├── textures/
│   ├── mercury.jpg
│   ├── venus.jpg
│   ├── earth.jpg
│   ├── mars.jpg
│   ├── jupiter.jpg
│   ├── saturn.jpg
│   ├── saturn_ring.png
│   ├── uranus.jpg
│   ├── neptune.jpg
│   └── venus_atmosphere.jpg
```

### Penjelasan File
| File | Fungsi |
| :--- | :--- |
| `index.html` | Struktur HTML, HUD, dan import map Three.js |
| `src/main.js` | Game coordinator, state machine, raycasting, dan loop animasi |
| `src/Room.js` | Kelas OOP untuk membangun ruangan, lantai, langit-langit, dan pencahayaan |
| `src/RoomObjects.js` | Membuat pintu, peti, kunci, artefak GLB/fallback, dan lukisan petunjuk |
| `src/RoomVFX.js` | Kelas OOP untuk efek partikel debu dan sparkles |
| `src/puzzles/Planet.js` | Komponen planet untuk puzzle urutan |
| `src/puzzles/PlanetaryOrderPuzzle.js` | Menyusun planet dengan menukar posisinya |
| `src/puzzles/SimonButton.js` | Komponen tombol bercahaya untuk puzzle Simon |
| `src/puzzles/SimonPuzzle.js` | Mengulang urutan tombol dalam empat ronde |
| `src/puzzles/EclipsePuzzle.js` | Puzzle keselarasan Matahari, Bumi, dan Bulan |
| `src/puzzles/Orbit.js` | Komponen orbit untuk puzzle gerhana |
| `src/FirstPersonController.js` | Kelas OOP untuk kontrol kamera FPS, PointerLock, dan pergerakan WASD |
| `src/GameStateManager.js` | Mengelola status permainan dan perubahan status |
| `src/WorldState.js` | Menyimpan status puzzle, kunci, pintu, dan kemenangan |
| `src/style.css` | Styling HUD, crosshair, modal, toast, dan win screen |
| `textures/` | Tekstur permukaan planet yang digunakan puzzle urutan |
| `models/model.glb` | Aset GLTF/GLB; fallback prosedural digunakan jika pemuatan gagal |
| `environment/environment.jpg` | Environment map; fallback warna dan fog digunakan jika pemuatan gagal |

> 💡 **Fallback visual:** Jika `models/model.glb` gagal dimuat, proyek membuat pedestal dan artefak prosedural. Jika `environment/environment.jpg` gagal dimuat, proyek menggunakan warna latar dan fog. Tekstur planet di `textures/` digunakan langsung oleh puzzle planet.

---

## 🔧 Detail Teknis

### 1. Teknologi
| Kategori | Teknologi |
| :--- | :--- |
| Bahasa pemrograman | JavaScript (ES Modules) |
| Library 3D | Three.js v0.186.1 |
| Loader | GLTFLoader, TextureLoader |
| Modul dan dependency | Import map melalui CDN, tanpa proses build |
| Styling | CSS3, Flexbox, transisi, dan animasi CSS |

Tekstur dinding dan lantai saat ini dinonaktifkan (`null`) ketika `Room` dibuat, sehingga material menggunakan warna datar. `Room` mendukung opsi `wallTexture` dan `floorTexture` jika ingin mengaktifkannya.

### 2. Scene Graph
Struktur scene graph berikut menggambarkan hubungan parent-child pada objek utama.

```text
Scene
├── Lights
│   ├── AmbientLight
│   ├── DirectionalLight — cast shadow
│   ├── Ceiling PointLight — cast shadow
│   ├── Torch PointLight — flicker dan berubah warna
│   └── Window DirectionalLight
│
├── Room
│   ├── Floor — receive shadow
│   ├── Ceiling — receive shadow
│   ├── Four walls — dinding selatan memiliki bukaan jendela
│   └── Window frame and glass
│
├── DoorGroup — interactable
│   ├── DoorPivot
│   │   ├── DoorPanel — cast and receive shadow
│   │   ├── Handle
│   │   └── DoorLock
│   └── Alcove side walls
│
├── ChestGroup — interactable
│   ├── ChestBase
│   ├── ChestTrim
│   ├── LidHinge
│   │   ├── Lid
│   │   └── LidTrim
│   └── ChestLock
│
├── KeyGroup — hidden until chest opens
│   ├── KeyRing
│   ├── KeyShaft
│   └── KeyTeeth
│
├── Paintings — CanvasTexture clue numbers
│
├── Three interactable puzzles
│   ├── Planet order
│   ├── Simon sequence
│   └── Eclipse alignment
│
├── GLB artifact or procedural fallback
│
└── VFX
    ├── Dust — 180 particles
    └── Sparkles — 50 particles
```

### 3. Raycasting Flow
Raycaster diarahkan dari tengah kamera untuk mendeteksi objek interaktif dan menampilkan hover hint. Klik hanya diproses saat permainan aktif, Pointer Lock terkunci, dan gerakan mouse antara `mousedown` dan `mouseup` kurang dari 6 px. Klik pada objek puzzle diteruskan ke handler puzzle yang sesuai.

**Syarat interaksi klik:**
- Jarak drag mouse kurang dari 6px, sehingga gerakan kamera tidak dianggap sebagai klik.
- State game sedang `playing` dan pointer terkunci (`gameState.getState() === 'playing'`).
- Crosshair menunjuk objek yang dapat diinteraksikan.

### 4. State Machine
Status permainan yang dikelola `GameStateManager`:
```javascript
playing
paused
code-entry
won
```

Status dunia meliputi `chestOpen`, `hasKey`, `doorOpen`, `gameWon`, jumlah lukisan yang ditemukan, dan status tiap puzzle.

**Alur permainan:**
```text
START
  │
  ├── Selesaikan puzzle planet, Simon, dan gerhana
  │     └── Angka petunjuk masing-masing lukisan ditampilkan
  │
  ├── Klik peti
  │     └── Peti terbuka; setelah 1,6 detik kunci dikumpulkan otomatis
  │
  └── Klik pintu
        ├── Belum punya kunci → toast; tidak membuka modal
        └── Punya kunci → masukkan kode 471
              ├── Kode salah → toast dan coba lagi
              └── Kode benar → pintu terbuka
                    └── Berjalan melewati pintu → win screen
```

Puzzle membuka petunjuk kode, tetapi jumlah puzzle yang selesai tidak diperiksa oleh pintu. Kunci merupakan prasyarat untuk membuka modal kode; kode `471` yang benar tetap diperlukan untuk membuka pintu.

### 5. Parameter yang dikonfigurasi
| Parameter | Nilai |
| :--- | :--- |
| Shadow map size | 1024 × 1024 |
| Partikel debu | 180 |
| Partikel sparkles | 50 |
| Ukuran ruangan | 20 × 20 unit, tinggi 5.5 unit |
| Fog fallback | `FogExp2` dengan density `0.02` (hanya jika environment map gagal dimuat) |

---

## 📦 Asset Credits
Proyek ini dikembangkan dari awal dan tidak menggunakan template atau fork proyek lain.

| Aset | Pembuat | Sumber | Lisensi |
| :--- | :--- | :--- | :--- |
| Three.js | Three.js Contributors | [threejs.org](https://threejs.org/) | MIT |
| Environment map JPEG | Octavian Tudose | [Poly Haven](https://polyhaven.com/a/kloppenheim_02_puresky) | CC0 |
| Model GLB | Innerscene — original model | [Inner Scene](https://www.innerscene.com/tools/library/3d-parts/voyage-campaign-chest-1d609eb1) | CC0 |
| Planet Texture | solarsystemscope | [solarsystemscope](https://www.solarsystemscope.com/textures/) | CC BY |

> *Catatan: Tabel ini mempertahankan atribusi aset yang dicantumkan untuk proyek. Periksa lisensi dan ketentuan atribusi dari sumber masing-masing sebelum mendistribusikan aset.*

---

## 🧩 Kendala & Solusi

| No. | Kendala | Solusi |
| :---: | :--- | :--- |
| 1 | `environment/environment.jpg` gagal dimuat | Latar beralih ke warna solid dan fog. |
| 2 | `models/model.glb` gagal dimuat | Pedestal dan icosahedron prosedural ditampilkan sebagai fallback. |
| 3 | Gerakan mouse tidak sengaja memicu interaksi | Interaksi klik hanya diterima jika jarak drag kurang dari 6 px. |
| 4 | Kamera pemain melewati batas ruangan | Posisi X dan Z kamera dibatasi berdasarkan ukuran ruangan; tidak ada collision detection terhadap objek. |
| 5 | ES modules atau asset tidak dapat dimuat melalui `file://` | Jalankan proyek menggunakan server lokal. |

---