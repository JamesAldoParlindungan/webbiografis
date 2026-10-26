# 📋 DOKUMENTASI PORTFOLIO — KIMI THORA REFOLINO

> Dark Brutalism Portfolio — Interaksi & Styling Lengkap

---

## 📁 STRUKTUR FILE

| File | Path | Deskripsi |
|------|------|-----------|
| JavaScript | `script/mainkimi.js` | Seluruh logika interaksi (666 baris) |
| CSS | `style/kimi.css` | Seluruh styling visual (1574 baris) |

---

# 🔷 BAGIAN 1: JAVASCRIPT (`script/mainkimi.js`)

## 1.1 — Daftar Interaksi per Bagian (dengan Line Number)

### 🔹 00. PALET WARNA AKSEN (Line 35–55)

| Interaksi | Fungsi | Line | Deskripsi |
|-----------|--------|------|-----------|
| Inisialisasi palet | `var PALETTES` | 38 | 5 palet warna: ACID, ORANGE, CYAN, PINK, MINT |
| Load pale tersimpan | `paletteIndex` dari `localStorage` | 44 | Membaca `kt-palette` dari localStorage |
| Terapkan palet | `applyPalette(i)` | 49 | Set CSS variable `--accent` dan `--accent-2` |

**Cara kerja:** Setiap palet punya 2 warna (`a` = aksen utama, `b` = aksen kedua). Palet tersimpan di `localStorage` dengan key `kt-palette`, jadi warna tetap konsisten antar halaman/refresh.

---

### 🔹 01. LOADER & TRANSISI HALAMAN (Line 57–157)

| Interaksi | Fungsi | Line | Deskripsi |
|-----------|--------|------|-----------|
| Build loader DOM | IIFE `buildLoader()` | 60 | Membuat elemen `#page-loader` dengan 5 panel tirai + counter + progress bar |
| Animasi counter | `runIntro()` | 87 | Counter 0→100 dengan easing cubic, durasi 650ms |
| Selesai intro | `finishIntro()` | 105 | Panel tirai naik ke atas (`data-state="leave"`), lalu `afterIntro()` |
| Transisi keluar halaman | `leaveTo(url)` | 117 | Panel tirai turun dari atas (`data-state="enter"`), counter 0→100, lalu redirect |
| Intercept link internal | `initPageTransitions()` | 134 | Tangkap klik link internal → `leaveTo()` |
| Handle back/forward cache | `pageshow` event | 151 | Reset loader state jika halaman dari bfcache |

**Cara kerja:**
- Saat halaman dibuka, loader muncul dengan 5 panel vertikal (panel 2 kuning, panel 4 pink) + counter besar di tengah.
- Counter naik 0→100 dengan easing, menunggu `window.load` (max timeout 1800ms).
- Setelah 100%, panel naik (`translateY(-101%)`) dengan stagger 60ms per panel.
- Saat klik link internal, panel turun dari atas dengan stagger 50ms, counter naik, lalu redirect setelah 620ms.
- Link eksternal, link `#hash`, link dengan `download`, atau link dengan modifier key (Ctrl/Cmd/Shift/Alt) **tidak** di-intercept.

**States loader:**
| State | Efek |
|-------|------|
| `cover` | Panel menutupi layar penuh |
| `leave` | Panel naik ke atas (pergi) |
| `enter` | Panel turun dari atas (masuk) |
| `idle` | Loader hidden |

---

### 🔹 02. KURSOR BULAT (Line 159–300)

| Interaksi | Fungsi | Line | Deskripsi |
|-----------|--------|------|-----------|
| Definisi elemen interaktif | `var INTERACTIVE` | 162 | Selector untuk elemen yang membesarkan kursor |
| Definisi kartu | `var CARDS` | 163 | Selector kartu yang membesarkan kursor |
| Definisi magnet | `var MAGNETS` | 164 | Selector elemen yang tertarik ke kursor |
| Label kontekstual | `var CURSOR_LABELS` | 166 | 14 pasangan selector → label teks |
| Assign label ke DOM | `assignCursorLabels()` | 183 | Set `data-cursor` attribute ke elemen |
| Inisialisasi kursor | `initCursor()` | 189 | Buat dot + ring, animasi frame loop |

**Cara kerja:**
- **Dot** (lingkaran kecil 10px putih): mengikuti posisi mouse secara langsung.
- **Ring** (lingkaran outline 42px): mengikuti dengan lerp (interpolasi) 0.2, memberikan efek "delay" halus.
- **Magnetic pull**: elemen dalam `MAGNETS` tertarik ke arah kursor dalam radius 140px. Elemen bergeser via CSS variable `--mx` dan `--my`.
- **Proximity scaling**: ring membesar hingga 1.9x saat mendekati elemen magnet.
- **Label kontekstual**: saat hover elemen dengan `data-cursor`, ring membesar jadi 124px dan menampilkan teks label.

**Label kursor per elemen:**
| Elemen | Label |
|--------|-------|
| `.project-card` | BACA |
| `.project-link` | BUKA |
| `.publication-card` | JURNAL |
| `.publication-link` | TAUTAN |
| `.skill-card` | STACK |
| `.interest-card` | MINAT |
| `.education-card` | KISAH |
| `.profile-image-frame` | HALO! |
| `.contact-item` | KONTAK |
| `.button-primary` | KLIK |
| `.back-home` | BALIK |
| `.about-aside` | INFO |
| `.hud-swatch` | WARNA |
| `.footer-brand` | ATAS |

**State kursor:**
| State | Efek Visual |
|-------|-------------|
| Default | Dot 10px + ring 42px outline |
| `is-card` | Ring membesar jadi 70px |
| `is-hover` | Ring 88px, background putih (invert) |
| `is-label` | Ring 124px, background putih + teks label |
| `is-down` | Ring mengecil jadi 30px saat klik |

> ⚠️ Kursor hanya aktif di perangkat dengan `hover: hover` dan `pointer: fine` (desktop dengan mouse).

---

### 🔹 03. TILT 3D + SPOTLIGHT KARTU (Line 302–330)

| Interaksi | Fungsi | Line | Deskripsi |
|-----------|--------|------|-----------|
| Inisialisasi tilt | `initCards()` | 305 | Set `data-tilt` dan event listener pointer |

**Cara kerja:**
- **Kartu strong** (`.project-card`, `.skill-card`, `.interest-card`): tilt maksimal 6°.
- **Kartu soft** (`.education-card`, `.publication-card`): tilt maksimal 1.6°.
- Saat pointer bergerak di atas kartu, CSS variable `--rx` dan `--ry` dihitung berdasarkan posisi relatif pointer.
- CSS variable `--sx` dan `--sy` juga di-set untuk posisi spotlight (radial gradient mengikuti kursor).
- Saat pointer keluar, tilt reset ke 0°.

**Rumus tilt:**
```
--rx = (0.5 - py) * amount        → rotasi X (atas-bawah)
--ry = (px - 0.5) * amount * 1.4  → rotasi Y (kiri-kanan)
```

---

### 🔹 04. TEXT SCRAMBLE (Line 332–391)

| Interaksi | Fungsi | Line | Deskripsi |
|-----------|--------|------|-----------|
| Karakter acak | `var GLYPHS` | 335 | A-Z, 0-9, dan simbol # % & @ $ * + = < > / |
| Cari text node | `textNodeOf(el)` | 339 | TreeWalker mencari text node pertama yang valid |
| Animasi scramble | `scramble(node, duration)` | 349 | Karakter acak → karakter asli secara bertahap |
| Inisialisasi | `initScramble()` | 371 | Pasang event hover + IntersectionObserver |

**Cara kerja:**
- Saat hover link/navigasi/tombol, teks "teracau" — karakter asli diganti karakter acak dari `GLYPHS`, lalu perlahan kembali ke teks asli dari kiri ke kanan.
- Durasi scramble: 380ms (hover), 450ms (masuk viewport), 650ms (heading h2).
- Node teks yang sudah di-scramble menyimpan teks asli di `node._final` agar tidak berubah permanen.
- Text node di dalam `[aria-hidden]`, `.nav-number`, `.contact-label` **dilewati**.
- IntersectionObserver memantau `.section-heading h2`, `.section-number`, `.interest-block > h3` — scramble otomatis saat elemen masuk viewport (threshold 0.6).

---

### 🔹 05. SCROLLSPY, PROGRESS BAR, HUD (Line 393–464)

| Interaksi | Fungsi | Line | Deskripsi |
|-----------|--------|------|-----------|
| State scrollspy | `var spy` | 396 | Objek berisi sections, links, map, current index, hud |
| Inisialisasi | `initSpy()` | 398 | Bangun progress bar + HUD, pasang observer |
| Navigasi section | `goToSection(i)` | 461 | Scroll smooth ke section index i |

**Cara kerja:**
- **Scrollspy**: IntersectionObserver dengan `rootMargin: '-40% 0px -55% 0px'` mendeteksi section yang aktif di viewport.
- **Link aktif**: link navigasi sidebar yang sesuai dapat class `.is-active` (background kuning, padding kiri bertambah, panah ▶ muncul).
- **Progress bar**: div fixed di atas, lebar dihitung dari `scrollY / (scrollHeight - innerHeight)`, di-set via CSS variable `--p`.
- **HUD** (Heads-Up Display): panel fixed di kanan bawah yang menampilkan:
  - Index section aktif (contoh: `02/07`)
  - Nama section aktif (contoh: `KEAHLIAN`)
  - Persentase scroll (contoh: `43%`)
  - Tombol swatch untuk ganti warna (klik = `cyclePalette()`)
  - Hint keyboard (`J / K pindah bagian · C ganti warna`)

---

### 🔹 06. TOAST, PALET, KEYBOARD (Line 466–518)

| Interaksi | Fungsi | Line | Deskripsi |
|-----------|--------|------|-----------|
| Notifikasi toast | `toast(msg)` | 470 | Munculkan pesan singkat di kiri bawah, auto-hide 1.5s |
| Ganti warna aksen | `cyclePalette()` | 482 | Rotasi palet berikutnya + toast nama palet |
| Shortcut keyboard | `initKeyboard()` | 491 | J/K navigasi, C ganti warna, Esc tutup menu, Konami code |

**Shortcut keyboard:**
| Tombol | Aksi |
|--------|------|
| `J` | Pindah ke section berikutnya |
| `K` | Pindah ke section sebelumnya |
| `C` | Ganti warna aksen (siklus 5 palet) |
| `Esc` | Tutup menu mobile |
| `↑ ↑ ↓ ↓ ← → ← → B A` | Easter egg: glitch mode 2.2 detik |

> ⚠️ Shortcut tidak aktif saat fokus di input, textarea, select, atau contentEditable.

---

### 🔹 07. MENU MOBILE (Line 520–553)

| Interaksi | Fungsi | Line | Deskripsi |
|-----------|--------|------|-----------|
| Elemen sidebar | `var sidebar` | 523 | Referensi `#sidebar` |
| Tutup menu | `closeMenu()` | 526 | Hapus class `is-open`, hapus `menu-open` dari body |
| Inisialisasi menu | `initMenu()` | 533 | Buat tombol hamburger + backdrop |

**Cara kerja:**
- Tombol hamburger (3 garis) dibuat via JS, muncul hanya di viewport ≤ 1024px.
- Klik tombol → sidebar slide in dari kiri (`translate: 0`), backdrop gelap muncul.
- Klik backdrop, klik link navigasi, atau tekan `Esc` → sidebar slide out.
- Resize ke desktop (>1024px) → menu otomatis tertutup.

---

### 🔹 08. EXTRAS (Line 555–635)

| Interaksi | Fungsi | Line | Deskripsi |
|-----------|--------|------|-----------|
| Ticker marquee | `initTicker()` | 558 | Baris teks berjalan di atas main content |
| Jam WIB real-time | `initClock()` | 569 | Jam live dengan timezone Asia/Jakarta |
| Parallax foto hero | `initParallax()` | 591 | Foto bergeser mengikuti gerakan mouse |
| Burst kotak saat klik | `initBurst()` | 604 | 9 kotak kecil meledak dari titik klik |
| Tab title dinamis | `initTabTitle()` | 630 | Title berubah saat user pindah tab |

**Detail setiap fitur:**

**Ticker (Line 558):**
- Teks: `DATA SCIENCE ✶ MACHINE LEARNING ✶ DEEP LEARNING ✶ NLP ✶ SCIENTIFIC RESEARCH ✶ OPEN TO COLLABORATION`
- Dibuat dengan mengulang sequence 4x, animasi CSS `marquee` 32s linear infinite.
- Pause saat hover.

**Jam WIB (Line 569):**
- Format: `WIB HH:MM:SS` (24 jam).
- Menggunakan `Intl.DateTimeFormat` dengan timezone `Asia/Jakarta`.
- Update setiap 1 detik via `setInterval`.
- Ditempatkan di `.sidebar-footer`, sebelum elemen `<p>`.

**Parallax (Line 591):**
- Hanya aktif di desktop (`finePointer`) dan tidak `reduceMotion`.
- Menggerakkan `.profile-visual` berdasarkan posisi mouse relatif terhadap tengah viewport.
- CSS variable `--px` dan `--py` di-set (range -1 sampai 1), digunakan oleh `.image-label`, `.image-index`, dan `.profile-stamp` untuk translate.

**Burst (Line 604):**
- Setiap klik kiri mouse, 9 span kotak 12px muncul di titik klik.
- Setiap kotak punya warna dari palet aktif (accent, accent-2, ink).
- Kotak menyebar ke segala arah dengan rotasi acak dan mengecil, lalu dihapus dari DOM.
- Animasi via Web Animations API, durasi 520ms.

**Tab Title (Line 630):**
- Saat tab tidak aktif (`visibilitychange` → hidden): title berubah jadi `← Balik lagi dong ✶`
- Saat kembali: title kembali ke semula.

---

### 🔹 INIT & AFTER INTRO (Line 637–665)

| Fungsi | Line | Deskripsi |
|--------|------|-----------|
| `init()` | 640 | Memanggil semua fungsi inisialisasi secara berurutan |
| `afterIntro()` | 657 | Setelah loader selesai, scroll ke hash URL jika ada |

**Urutan inisialisasi di `init()`:**
```
1. initPageTransitions()   → Intercept link internal
2. initTicker()            → Teks berjalan
3. initMenu()              → Menu mobile
4. assignCursorLabels()    → Label kursor
5. initSpy()               → Scrollspy + HUD
6. initCards()             → Tilt kartu
7. initScramble()          → Efek teks
8. initCursor()            → Kursor custom
9. initKeyboard()          → Shortcut keyboard
10. initClock()            → Jam WIB
11. initParallax()         → Parallax hero
12. initBurst()            → Burst klik
13. initTabTitle()         → Title tab
14. runIntro()             → Loader mulai
```

---

## 1.2 — Ringkasan Semua Interaksi per Bagian HTML

| Bagian HTML | Interaksi yang Berlaku |
|-------------|----------------------|
| **Loader** | Counter 0→100, panel tirai naik/turun, transisi antar halaman |
| **Sidebar** | Navigasi scrollspy (highlight aktif), jam WIB live, link hover scramble, back-home hover, brand hover (rotasi), menu mobile (hamburger) |
| **Hero / Profil** | Parallax foto, glitch effect saat hover nama, scramble heading, magnetic buttons, burst klik, cursor label "HALO!" |
| **Tentang** | Scramble heading, aside card tilt, cursor label "INFO", interest card tilt + hover invert |
| **Keahlian** | Skill card tilt + spotlight, skill index hover (scale + rotate), skill list item hover, disclaimer card, scramble heading |
| **Pendidikan/Organisasi** | Timeline card tilt (soft), period hover (bg kuning), tags hover, cursor label "KISAH", scramble heading |
| **Penelitian & Proyek** | Project card tilt + spotlight, featured card (kuning), wide card (putih), tags hover, project link hover, cursor label "BACA"/"BUKA", scramble heading |
| **Publikasi** | Publication card tilt (soft), number stroke hover, year stroke hover, link hover, cursor label "JURNAL"/"TAUTAN", scramble heading |
| **Kontak** | Section background kuning, contact item magnetic + hover invert, button hover, cursor label "KONTAK", scramble heading |
| **Footer** | Footer brand hover (warna), footer home hover, cursor label "ATAS", scramble heading |
| **Global** | Kursor custom, magnetic elements, burst klik, keyboard shortcuts, palette switch, HUD, progress bar, toast, tab title, page transition, grain overlay |

---

## 1.3 — Fitur-Fitur Lainnya

### 🎨 Sistem Palet Warna (5 Palet)

| Nama | Warna Aksen Utama | Warna Aksen Kedua |
|------|-------------------|-------------------|
| ACID | `#d4ff1a` (kuning lime) | `#ff3d71` (pink) |
| ORANGE | `#ff6a1f` (oranye) | `#00e5ff` (cyan) |
| CYAN | `#00e5ff` (cyan) | `#ff3d71` (pink) |
| PINK | `#ff4fa3` (pink) | `#d4ff1a` (kuning lime) |
| MINT | `#6dffb0` (mint) | `#ff5a36` (oranye merah) |

- Palet tersimpan di `localStorage` (key: `kt-palette`)
- Bisa diganti via tombol `C` atau klik `.hud-swatch`
- Toast muncul menampilkan nama palet aktif

### 🖱️ Sistem Kursor Custom

- **Dot**: 10px, putih, mengikuti mouse langsung
- **Ring**: 42px outline, mengikuti dengan delay halus (lerp 0.2)
- **Mix-blend-mode: difference** — otomatis invert di atas elemen berwarna
- **4 state**: default, hover (88px), label (124px + teks), card (70px)
- **Magnetic**: elemen tertarik ke kursor dalam radius 140px
- Hanya aktif di desktop dengan mouse (bukan touch)

### ⌨️ Keyboard Shortcuts

| Key | Fungsi |
|-----|--------|
| `J` | Section berikutnya |
| `K` | Section sebelumnya |
| `C` | Ganti palet warna |
| `Esc` | Tutup menu mobile |
| `↑↑↓↓←→←→BA` | Glitch mode easter egg |

### 🥚 Easter Egg: Glitch Mode

- Trigger: Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`)
- Efek: Seluruh `#main-content` di-shake + `filter: invert(1) hue-rotate(180deg)`
- Durasi: 2.2 detik
- Toast: `GLITCH MODE // ON`

### 📊 HUD (Heads-Up Display)

Panel fixed kanan bawah yang menampilkan:
- Nomor section aktif (`01/07` format)
- Nama section aktif (uppercase)
- Persentase scroll real-time
- Tombol swatch warna (klik = ganti palet)
- Hint keyboard

### 🔔 Toast Notification

- Muncul di kiri bawah
- Background warna aksen aktif
- Auto-hide setelah 1.5 detik
- Dipakai untuk: notifikasi ganti palet, glitch mode

### 🌐 Page Transition

- Intercept semua link internal
- Panel tirai turun dari atas (stagger 50ms)
- Counter naik 0→100
- Redirect setelah 620ms
- Tidak berlaku untuk: link eksternal, hash link, download link, link dengan modifier key

### 🖼️ Tab Title Dinamis

- Saat user pindah tab: `← Balik lagi dong ✶`
- Saat kembali: title asli

---

# 🔷 BAGIAN 2: CSS (`style/kimi.css`)

## 2.1 — Daftar Bagian & Styling

### 📌 00. TOKENS (`:root`)

| Token | Nilai | Keterangan |
|-------|-------|------------|
| `--bg` | `#0b0b0b` | Warna latar utama (hitam pekat) |
| `--bg-2` | `#131313` | Warna latar sekunder |
| `--bg-3` | `#1c1c1c` | Warna latar kartu/komponen |
| `--ink` | `#f4f1e8` | Warna teks utama (putih tulang) |
| `--muted` | `#9d9a8f` | Warna teks sekunder (abu kecoklatan) |
| `--dim` | `#3a3a3a` | Warna garis/border tipis |
| `--accent` | `#d4ff1a` | Warna aksen utama (default: kuning lime) |
| `--accent-2` | `#ff3d71` | Warna aksen kedua (default: pink) |
| `--on-accent` | `#0b0b0b` | Warna teks di atas aksen |
| `--display` | `'Archivo Black'` | Font display (heading besar) |
| `--sans` | `'Space Grotesk'` | Font body/teks |
| `--mono` | `'Space Mono'` | Font monospace (label, kode) |
| `--sidebar-w` | `300px` | Lebar sidebar desktop |
| `--bw` | `3px` | Border width standar |
| `--ease` | `cubic-bezier(.77,0,.18,1)` | Easing curve khas |
| `--p` | `0` | Progress scroll (0-1) |

---

### 📌 01. RESET & BASE

- **Box-sizing**: `border-box` untuk semua elemen
- **Scroll behavior**: smooth
- **Body**: background hitam, teks putih tulang, font Space Grotesk, anti-aliasing
- **Selection**: background kuning aksen, teks hitam
- **Focus visible**: outline 4px pink aksen
- **Scrollbar**: custom — track hitam dengan border kiri putih, thumb kuning dengan border hitam, hover jadi pink
- **Body::before**: cover instan mencegah flash konten sebelum loader (fallback 2.8s)
- **Body::after**: grain overlay — SVG noise fractal dengan `mix-blend-mode: overlay`, opacity 0.09, fixed di seluruh layar

---

### 📌 02. LOADER / PAGE TRANSITION

**Struktur:**
- `#page-loader`: fixed full-screen, z-index 10000
- `.loader-panels`: grid 5 kolom, setiap panel `i` adalah blok warna
  - Panel 1, 3, 5: background hitam
  - Panel 2: background warna aksen (kuning)
  - Panel 4: background warna aksen-2 (pink)
- `.loader-content`: box di tengah dengan border 4px putih, shadow 12px kuning
  - Label kecil: `KT—PORTFOLIO / LOADING`
  - Counter besar: font Archivo Black, clamp 4rem-7rem, warna kuning, text-shadow 5px pink
  - Progress bar: 14px, border 3px putih, fill kuning

**States:**
| State | Efek |
|-------|------|
| `cover` | Panel translateY(0) — menutupi layar |
| `leave` | Panel translateY(-101%) — naik pergi, stagger 60ms |
| `enter` | Panel translateY(0) — turun masuk, stagger 50ms |
| `idle` | Semua elemen di luar layar, visibility hidden |

---

### 📌 03. CUSTOM CURSOR

**Dot (`.cursor-dot`):**
- 10px, bulat, putih, position fixed
- Mix-blend-mode: difference (invert otomatis)
- Transition width/height 0.2s

**Ring (`.cursor-ring`):**
- 42px, outline 2px putih, position fixed
- Mix-blend-mode: difference
- Scale via CSS variable `--near` (dari JS proximity)
- Transition width/height 0.3s dengan easing khas

**State kursor:**
| Class | Ukuran | Background |
|-------|--------|------------|
| Default | 42px | Transparan |
| `.is-card` | 70px | Transparan |
| `.is-hover` | 88px | Putih |
| `.is-label` | 124px | Putih + teks label |
| `.is-down` | 30px | Putih |

**Label (`.cursor-label`):**
- Font Space Mono, 0.7rem, bold, letter-spacing 0.12em
- Warna hitam (terlihat di atas ring putih)
- Text-transform: uppercase

> ⚠️ Semua kursor hanya tampil di `@media (hover: hover) and (pointer: fine)`

---

### 📌 04. HUD, PROGRESS, TOAST, MENU

**Scroll Progress (`.scroll-progress`):**
- Fixed di atas, tinggi 8px, dari kiri sidebar sampai kanan
- Background hitam, border bawah 2px putih
- Fill: repeating gradient kuning-pink, scaleX dari CSS var `--p`

**HUD (`.hud`):**
- Fixed kanan bawah, grid layout
- Border 3px putih, shadow 6px kuning
- Font Space Mono, uppercase
- `.hud-index`: background kuning, teks hitam, bold
- `.hud-name`: min-width 130px, border kanan 3px putih
- `.hud-pct`: min-width 56px, tabular-nums
- `.hud-swatch`: 40px, background pink, klik = ganti palet
- `.hud-hint`: baris bawah, background abu, font lebih kecil, hint keyboard

**Toast (`.toast`):**
- Fixed kiri bawah (offset dari sidebar)
- Background kuning, teks hitam, border 3px putih
- Shadow 6px pink
- Transform translateY(220%) → 0 saat `.is-show`
- Transition 0.35s easing khas

**Menu Toggle (`.menu-toggle`):**
- Fixed kiri atas, 52px, background kuning
- Border 3px putih, shadow 5px pink
- 3 garis putih (span), animasi jadi X saat expanded
- Hanya tampil di ≤ 1024px

**Sidebar Backdrop (`.sidebar-backdrop`):**
- Fixed full-screen, background rgba(0,0,0,0.75)
- Visibility hidden → visible saat `body.menu-open`

**Burst (`.burst`):**
- Span 12px, position fixed, pointer-events none
- Warna di-set via JS dari palet aktif
- Animasi via Web Animations API

---

### 📌 05. SIDEBAR

**`#sidebar`:**
- Fixed kiri, lebar 300px, full height
- Background hitam, border kanan 4px putih
- Flex column: header → navigasi → footer

**`.sidebar-header`:**
- Padding 22px, border bawah 4px putih
- Background: repeating diagonal stripe transparan + hitam

**`.back-home`:**
- Inline-flex, gap 8px, border 2px putih
- Font mono 0.68rem, uppercase, bold
- Hover: background putih, teks hitam, shadow 4px pink
- Magnetic translate via `--mx`, `--my`

**`.brand`:**
- Flex, gap 14px
- `.brand-mark`: 60px, background kuning, border 3px putih, shadow 5px pink, font Archivo Black 1.5rem, rotate -5deg
- Hover: rotate 4deg + scale 1.06, shadow jadi 8px putih
- `.brand-name`: font mono 0.72rem, strong = Archivo Black 1.28rem warna kuning

**`.sidebar-description`:**
- Margin top 18px, border top 2px dashed abu
- Font mono 0.72rem, uppercase, warna muted

**`.sidebar-navigation`:**
- Flex 1 (mengisi sisa ruang)
- `.nav-label`: font mono 0.68rem, letter-spacing 0.3em, warna muted
- Link: flex, gap 14px, padding 12px 22px, border top 1px dashed abu
- Font mono 0.8rem, bold, uppercase
- `.nav-number`: inline-grid 30px, border 2px currentColor
- Hover: background putih, teks hitam, padding-left 32px
- `.is-active`: background kuning, teks hitam, padding-left 32px, inset shadow 8px pink, panah ▶ di kanan

**`.sidebar-footer`:**
- Border top 4px putih, background abu gelap
- Font mono 0.68rem, uppercase
- `.status-indicator`: 12px, background kuning, border 2px putih, animasi blink (kuning ↔ pink)
- `.sidebar-clock`: border 2px putih, background hitam, teks kuning, tabular-nums

---

### 📌 06. MAIN & TICKER

**`#main-content`:**
- Margin-left 300px (offset sidebar)
- Min-height 100vh, padding top 8px

**`.ticker`:**
- Overflow hidden, background kuning, teks hitam
- Border bawah 4px putih
- Font Archivo Black 1.05rem, uppercase
- `.ticker-track`: inline-flex, animasi marquee 32s linear infinite
- Pause saat hover
- Separator: `✶` dengan warna pink, text-stroke hitam

---

### 📌 07. SECTION BASE

**`.section`:**
- Padding 110px 56px 100px
- Border bawah 4px putih
- Background: grid pattern halus (linear-gradient 1px, 56px)
- Section genap: background `--bg-2`

**`.eyebrow`:**
- Inline-block, border 2px kuning, teks kuning
- Font mono 0.74rem, bold, uppercase, letter-spacing 0.16em

**`.section-heading`:**
- Margin bawah 64px, max-width 980px
- `.section-number`: background putih, teks hitam, border 3px putih, shadow 5px pink, rotate -1.5deg
- `h2`: font Archivo Black, clamp 2.6rem-6rem, uppercase, text-shadow 5px pink
- `h2 span`: warna kuning, text-shadow 5px hitam
- `> p`: border kiri 8px kuning, warna muted, max-width 640px

---

### 📌 08. BUTTONS

**`.button` (base):**
- Inline-flex, gap 12px, padding 16px 28px
- Border 3px putih, font mono 0.85rem, bold, uppercase
- Magnetic translate via `--mx`, `--my`
- Transition: transform, shadow, background, color

**`.button-primary`:**
- Background kuning, teks hitam, shadow 6px putih
- Hover: shadow 10px pink, translate -3px

**`.button-secondary`:**
- Background transparan, teks putih, shadow 6px pink
- Hover: background putih, teks hitam, shadow 10px kuning

**Active state:** translate 5px, shadow 0

---

### 📌 09. HERO (PROFILE SECTION)

**`.profile-section`:**
- Min-height 100vh, flex column, justify space-between
- `.section-topline` & `.profile-bottomline`: flex space-between, border top/bottom 3px putih, font mono 0.72rem, uppercase

**`.profile-layout`:**
- Grid: 1.3fr / 0.7fr, gap 64px, align center

**`.profile-content h1`:**
- Font Archivo Black, clamp 2.8rem-7rem, uppercase
- `span`: background kuning, teks hitam, shadow 10px pink, rotate -1.4deg
- Hover span: rotate 1deg + skewX(-4deg), shadow -10px pink, animasi glitch 0.45s

**`.profile-description`:**
- Font 1.1rem, warna #d8d5cb
- `:first-of-type`: border kiri 8px pink

**`.profile-actions`:**
- Flex wrap, gap 22px

**`.profile-tags span`:**
- Border 2px putih, font mono 0.72rem, uppercase
- Hover: background kuning, teks hitam, shadow 4px putih

**`.profile-visual`:**
- Position relative, padding kanan-bawah

**`.profile-image-frame`:**
- Border 4px putih, background abu gelap, shadow 14px pink, rotate 2deg
- Hover: rotate 0deg + scale 1.02, shadow 20px kuning
- `img`: grayscale(1) contrast(1.2), hover → grayscale(0) contrast(1.05)

**`.image-label` & `.image-index`:**
- Position absolute, background hitam, border 2px putih, font mono 0.66rem
- Translate mengikuti `--px`, `--py` (parallax)
- `.image-index`: background kuning, teks hitam

**`.profile-stamp`:**
- Position absolute, background putih, teks hitam, border 3px hitam, shadow 6px kuning
- Font mono 0.76rem, uppercase, rotate -7deg
- `strong`: font Archivo Black 1.5rem, warna pink
- Hover visual: rotate 3deg

---

### 📌 10. TENTANG

**`.about-layout`:**
- Grid: 1.6fr / 1fr, gap 56px

**`.about-main h3`:**
- Font Archivo Black, clamp 1.8rem-3rem, uppercase, warna kuning

**`.about-main p`:**
- Font 1.06rem, warna #d8d5cb
- `:first-of-type::first-letter`: float left, background pink, font Archivo Black 3.4rem (drop cap)

**`.about-aside`:**
- Background abu gelap, border 3px putih, shadow 10px kuning, rotate 1deg
- `.eyebrow`: background kuning, teks hitam

**`.info-item`:**
- Flex column, border top 2px dashed abu
- `span`: font mono 0.68rem, uppercase, warna muted
- `strong`: font Archivo Black 1.25rem, uppercase

**`.interest-block`:**
- Margin top 90px
- `> h3`: background putih, teks hitam, font Archivo Black 1.4rem, rotate -0.8deg

**`.interest-grid`:**
- Grid 3 kolom, gap 26px

---

### 📌 11. CARD UMUM (Spotlight + Tilt)

**Base card (`.interest-card`, `.skill-card`, `.education-card`, `.project-card`, `.publication-card`):**
- `--spot`: radial gradient kuning 24% transparan
- Background abu gelap, border 3px putih
- Transform: perspective(900px) rotateX/rotateY dari CSS var `--rx`, `--ry`
- Transition: transform, shadow, background, color

**Spotlight (`::before`):**
- Radial gradient 260px di posisi `--sx`, `--sy`
- Visibility hidden → visible saat hover

**Hover umum:**
- Translate -4px, -4px
- Shadow 10px kuning

**`.interest-card`:**
- Padding 26px 24px 28px
- `span` (nomor): font Archivo Black 3rem, text-stroke 2px kuning (outline)
- `h4`: font Archivo Black 1.2rem, uppercase
- `p`: warna muted
- Hover: background kuning, teks hitam, shadow 10px pink, nomor stroke jadi hitam

---

### 📌 12. KEAHLIAN / PRESTASI

**`.skills-disclaimer`:**
- Border 3px dashed pink, background abu gelap
- `::before`: strip diagonal kuning-hitam di atas (seperti police line)
- `strong`: background pink, teks hitam, font mono 0.74rem

**`.skills-grid`:**
- Grid auto-fill minmax(290px, 1fr), gap 28px

**`.skill-card`:**
- Padding 28px 24px 26px
- `.skill-index`: font Archivo Black 3.6rem, text-stroke 2px abu, position absolute top-right
- Hover index: stroke pink, scale 1.15, rotate -6deg
- `h3`: font Archivo Black 1.3rem, uppercase, warna kuning, padding kanan 70px
- `> p`: font mono 0.86rem

**`.skill-list li`:**
- Border 2px putih, font mono 0.74rem, uppercase
- Background hitam
- Hover: background kuning, teks hitam, shadow 4px pink

---

### 📌 13. TIMELINE (PENDIDIKAN, ORGANISASI, KEPANITIAAN)

**`.education-timeline`:**
- Grid, gap 34px, padding kiri 34px
- `::before`: garis vertikal putus-putus (repeating gradient 180deg)

**`.education-card`:**
- Grid 250px / 1fr, background abu gelap
- `::after`: counter nomor urut (01, 02, ...) — background kuning, border 3px putih
- `.education-period::before`: kotak 18px pink dengan border 3px putih (titik di timeline)

**`.education-period`:**
- Background putih, teks hitam, border kanan 3px putih
- `span`: font mono 0.7rem, uppercase
- `strong`: font Archivo Black 1.15rem
- Hover: background kuning

**`.education-content`:**
- Padding 26px 28px 28px
- `h3`: font Archivo Black, clamp 1.25rem-1.8rem, uppercase
- `.education-location`: font mono 0.82rem, warna pink
- `> p`: warna #d8d5cb

**`.education-tags span`:**
- Border 2px putih, font mono 0.72rem, uppercase, background hitam
- Hover: background pink, teks hitam, shadow 3px putih

---

### 📌 14. PENELITIAN & PROYEK

**`.project-grid`:**
- Grid 12 kolom, gap 34px

**`.project-card` (default):**
- Grid column span 6 (2 kolom)
- Flex column, gap 18px, padding 30px 28px 32px

**`.project-featured` (span 12):**
- Background kuning, teks hitam, shadow 12px pink
- `> p`: warna #1d1d1d
- Hover: shadow 18px putih

**`.project-wide` (span 12):**
- Background putih, teks hitam
- `--spot`: radial gradient pink 18%
- Hover: shadow 12px pink

**`.project-meta`:**
- Flex space-between, font mono 0.7rem, uppercase
- `span`: border 2px currentColor
- `span:first-child`: background putih, teks hitam (label kategori)

**`.project-card h3`:**
- Font Archivo Black, clamp 1.25rem-1.75rem, uppercase

**`.project-card > p`:**
- Warna #d8d5cb

**`.project-tags span`:**
- Border 2px currentColor, font mono 0.72rem, uppercase
- Hover: background pink, teks hitam

**`.project-link`:**
- Inline-flex, gap 10px, border 3px currentColor
- Font mono 0.8rem, bold, uppercase
- Magnetic translate via `--mx`, `--my`
- Hover: background putih, teks hitam, shadow 5px pink

---

### 📌 15. PUBLIKASI

**`.publication-list`:**
- Grid, gap 34px

**`.publication-card`:**
- Grid: 110px / 1fr / auto, gap 28px, padding 30px 28px

**`.publication-number`:**
- Font Archivo Black 5.5rem, text-stroke 3px kuning (outline besar)

**`.publication-type`:**
- Background kuning, teks hitam, font mono 0.7rem, bold, uppercase

**`.publication-content h3`:**
- Font Archivo Black, clamp 1.2rem-1.7rem, uppercase

**`.publication-authors`:**
- Font mono 0.86rem, warna pink

**`.publication-content p`:**
- Warna #d8d5cb, font 0.98rem
- `strong`: font mono 0.78rem, uppercase

**`.publication-link`:**
- Border bawah 3px kuning, font mono 0.8rem, bold, uppercase
- Magnetic translate
- Hover: warna pink, border pink

**`.publication-year`:**
- Writing-mode vertical-rl, rotate 180deg
- Font Archivo Black 3.4rem, text-stroke 2px putih
- Hover card: stroke jadi pink

**`.publication-note`:**
- Border kiri 8px pink, background abu gelap, font mono 0.78rem

---

### 📌 16. KONTAK

**`.contact-section`:**
- Background kuning (full), teks hitam
- Grid pattern halus (rgba hitam 0.08)
- `.section-number`: background hitam, teks kuning
- `h2`: text-shadow 6px hitam
- `h2 span`: warna pink
- `> p`: warna #1f1f1f, border kiri hitam

**`.contact-layout`:**
- Grid 1.1fr / 0.9fr, gap 56px

**`.contact-message h3`:**
- Font Archivo Black, clamp 1.6rem-2.6rem, uppercase

**`.contact-message p`:**
- Warna #1d1d1d

**`.contact-message .button-primary`:**
- Background hitam, teks kuning, shadow 7px pink
- Hover: shadow 11px putih

**`.contact-item`:**
- Flex, gap 16px, padding 18px 20px
- Background hitam, teks putih, border 3px hitam, shadow 6px pink
- Magnetic translate
- Hover: background putih, teks hitam, shadow 11px hitam

**`.contact-label`:**
- Background kuning, teks hitam, font mono 0.66rem, bold
- Min-width 92px, text-align center

**`.contact-item strong`:**
- Font mono 0.9rem, word-break break-all

---

### 📌 17. FOOTER

**`#footer`:**
- Background hitam, border top 4px putih

**`.footer-main`:**
- Flex column, gap 22px, padding 80px 56px 60px
- Background: repeating diagonal stripe halus

**`.footer-brand`:**
- Font Archivo Black, clamp 2.2rem-7.4rem, uppercase
- Text-shadow 6px pink
- `span`: warna kuning
- Hover: warna kuning

**`.footer-main p`:**
- Font mono 0.85rem, uppercase, warna muted

**`.footer-home`:**
- Border 3px putih, font mono 0.8rem, bold, uppercase
- Magnetic translate
- Hover: background kuning, teks hitam, shadow 6px pink

**`.footer-bottom`:**
- Flex space-between, padding 16px 56px
- Background putih, teks hitam
- Font mono 0.74rem, bold, uppercase
- `a:hover`: warna pink

---

### 📌 18. EASTER EGG (GLITCH MODE)

**`body.is-glitch #main-content`:**
- Animasi shake 0.12s steps(2) infinite
- Filter: invert(1) hue-rotate(180deg)
- Efek: seluruh konten ter-invert warna + bergetar

---

### 📌 19. RESPONSIVE

**Breakpoint 1180px:**
- `.interest-grid`: 3 → 2 kolom
- `.project-card`: semua jadi span 12 (full width)

**Breakpoint 1024px:**
- `--sidebar-w: 0px` (sidebar jadi overlay)
- `.menu-toggle`: tampil (flex)
- `#sidebar`: width min(86vw, 330px), translate -105% (hidden), slide in saat `.is-open`
- `#main-content`: margin-left 0
- `.scroll-progress`: left 0
- `.toast`: left 20px
- `.section`: padding 84px 24px 76px
- `.profile-layout`: 1 kolom, gap 48px
- `.about-layout`, `.contact-layout`: 1 kolom
- `.footer-main`: padding 60px 24px 44px

**Breakpoint 720px:**
- `.education-card`: 1 kolom (period di atas)
- `.education-timeline`: padding kiri 22px
- `.publication-card`: 1 kolom
- `.publication-year`: horizontal (bukan vertical)
- `.interest-grid`: 1 kolom
- `.section-topline`, `.profile-bottomline`: flex column
- `.hud`: right 12px, bottom 12px
- `.contact-item`: flex wrap

---

### 📌 20. REDUCED MOTION

**`@media (prefers-reduced-motion: reduce)`:**
- Scroll behavior: auto (bukan smooth)
- Semua animasi: duration 0.001ms, iteration 1
- Semua transition: duration 0.001ms
- `.ticker-track`: animation none

---

## 2.2 — Font yang Digunakan

| Font | Peran | Fallback |
|------|-------|----------|
| **Archivo Black** | Display/heading besar, angka besar, brand | Arial Black, Impact, sans-serif |
| **Space Grotesk** | Body text, paragraf, deskripsi | system-ui, -apple-system, Segoe UI |
| **Space Mono** | Label, tag, navigasi, kode, HUD, toast | ui-monospace, SFMono-Regular, Menlo |

---

## 2.3 — Warna Dasar (Independen dari Palet)

| Warna | Hex | Penggunaan |
|-------|-----|-----------|
| Background utama | `#0b0b0b` | Body, loader, sidebar |
| Background sekunder | `#131313` | Section genap, footer sidebar |
| Background kartu | `#1c1c1c` | Semua card, aside, disclaimer |
| Teks utama | `#f4f1e8` | Heading, body, border |
| Teks sekunder | `#9d9a8f` | Deskripsi, muted text |
| Garis tipis | `#3a3a3a` | Border dashed, divider |
| Teks di atas aksen | `#0b0b0b` | Teks di background kuning |

---

## 2.4 — Easing Curve

```css
--ease: cubic-bezier(.77, 0, .18, 1);
```

Easing ini dipakai di hampir semua transition — memberikan feel "brutalist" yang tajam: mulai cepat, melambat di tengah, akhir cepat.

---

## 2.5 — Shadow Pattern Khas

Shadow selalu menggunakan warna solid (bukan blur), pattern:
- `box-shadow: Xpx Xpx 0 warna` — offset tanpa blur
- Warna shadow: kuning, pink, atau putih (bergantian)
- Hover biasanya menambah offset shadow + translate negatif

---

## 2.6 — Border Pattern Khas

| Pattern | Penggunaan |
|---------|-----------|
| `border: 3px solid var(--ink)` | Card, button, HUD, toast |
| `border: 4px solid var(--ink)` | Section divider, loader, image frame |
| `border: 2px solid var(--ink)` | Tag, label, link kecil |
| `border: 2px dashed var(--dim)` | Divider tipis di sidebar, info item |
| `border: 3px dashed var(--accent-2)` | Disclaimer box |

---

*Dokumentasi dibuat secara sistematis dari pembacaan penuh kedua file sumber.*

# DOKUMENTASI PORTOFOLIO — JAMES ALDO PARLINDUNGAN

## Struktur File yang Didokumentasikan

| File | Peran |
|------|-------|
| `template/james.html` | Struktur dan konten halaman portofolio James |
| `style/james.css` | Tampilan visual, layout, warna, tipografi, efek hover, animasi, dan responsive layout |
| `script/james.js` | Interaksi halaman, preloader, cursor khusus, navigasi aktif, reveal, marquee, dan efek lainnya |
| `assets/james.jpeg` | Foto profil yang ditampilkan pada halaman James |

---

# 🔷 BAGIAN 1: JAVASCRIPT (`script/james.js`)

## 1.1 — Daftar Interaksi per Bagian (dengan Line Number)

### 🔹 00. SETUP & DETEKSI PREFERENSI (Line 1–9)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Pembungkus script | IIFE | 5 | Menjalankan kode dalam fungsi langsung agar variabel lokal tidak bocor ke global scope |
| Strict mode | `"use strict"` | 6 | Mengaktifkan mode JavaScript yang lebih ketat |
| Deteksi reduced motion | `prefersReduced` | 8 | Membaca preferensi `prefers-reduced-motion: reduce` dari sistem pengguna |
| Deteksi pointer desktop | `isFinePointer` | 9 | Memeriksa media query hover dan pointer presisi untuk efek cursor |

**Cara kerja:**
- Semua logika dibungkus dalam IIFE (`(function () { ... })()`), sehingga variabel dan fungsi tetap berada dalam scope script.
- `prefersReduced` dipakai untuk mengurangi atau melewati animasi tertentu jika pengguna memilih mengurangi gerakan.
- `isFinePointer` membatasi custom cursor dan efek magnetik agar tidak dijalankan pada perangkat yang tidak cocok, misalnya layar sentuh.

---

### 🔹 01. TRANSISI KE HALAMAN UTAMA (Line 11–51)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Fungsi transisi | `triggerPageTransition(url)` | 11 | Membuat overlay loading sebelum berpindah URL |
| Cek loader lama | `existing` | 12–13 | Menghapus elemen `#preloader` yang sudah ada agar tidak ada duplikasi |
| Membuat loader | `loader` | 15–22 | Membuat markup loader dengan logo, progress bar, persentase, dan label |
| Referensi progress | `preFill`, `prePct` | 24–25 | Mengambil elemen fill dan counter dari loader yang baru dibuat |
| Timer progress | `run` | 28–38 | Menaikkan counter secara bertahap dan menghentikan interval saat mencapai 100% |
| Target link kembali | `backHomeLink` | 41 | Memilih link header yang mengarah ke `../index.html` |
| Event klik link | `addEventListener("click")` | 43–50 | Menghentikan navigasi langsung dan menjalankan transisi |

**Cara kerja `triggerPageTransition(url)`:**
- Jika ada elemen `#preloader` yang tersisa, elemen tersebut dihapus lebih dulu.
- JavaScript membuat loader berisi logo `JAMES.ALDO`, progress bar, counter persentase, dan teks `LOADING_PORTFOLIO.EXE`.
- Nilai `pct` bertambah 12 setiap 60 ms sampai maksimum 100.
- Lebar `#pre-fill` dan teks `#pre-pct` diperbarui bersamaan.
- Saat persentase mencapai 100%, interval dihentikan. Navigasi ke URL tujuan dilakukan setelah 250 ms, atau tanpa jeda tambahan jika `prefersReduced` aktif.

**Cara kerja link “Kembali ke Beranda”:**
- Selector yang dipakai adalah `header nav > a[href="../index.html"]`.
- `event.preventDefault()` mencegah browser langsung berpindah halaman.
- Jika reduced motion aktif, browser langsung menuju `../index.html`.
- Jika tidak, `triggerPageTransition("../index.html")` dipanggil.

---

### 🔹 02. PRELOADER HALAMAN PROFIL (Line 53–98)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Membuat elemen | `preloader` | 56–63 | Membuat overlay loading ketika halaman profil diinisialisasi |
| Progress bar | `preFill` | 65 | Referensi ke elemen `#pre-fill` |
| Counter | `prePct` | 66 | Referensi ke elemen `#pre-pct` |
| Nilai progress | `pct` | 67 | Menyimpan angka progress saat ini |
| Waktu mulai | `startTime` | 68 | Merekam waktu awal menggunakan `performance.now()` |
| Durasi minimum | `MIN_TIME` | 69 | Nilai 850 ms agar loader tidak terlalu cepat menghilang |
| Batas maksimum | `MAX_TIME` | 70 | Nilai 2200 ms sebagai batas keselamatan |
| Update counter | `setPct(v)` | 72–76 | Membatasi nilai sampai 100 dan memperbarui tampilan |
| Interval loading | `tick` | 78–82 | Menaikkan progress setiap 60 ms dengan laju bertahap |
| Penyelesaian loading | `finish()` | 84–95 | Menghentikan interval, mengatur 100%, dan menutup loader |
| Fallback maksimum | `setTimeout(finish, MAX_TIME)` | 97 | Memanggil penyelesaian jika proses loading terlalu lama |
| Event `load` | `window.addEventListener("load")` | 98 | Mengatur progress menjadi 95 jika seluruh window selesai dimuat sebelum counter penuh |

**Cara kerja:**
- Loader dibuat secara dinamis dan ditempatkan di awal `body` menggunakan `prepend()`.
- `setPct(v)` membulatkan nilai ke bilangan bulat, membatasi maksimum 100, lalu memperbarui lebar progress bar dan angka persen.
- Interval menaikkan progress lebih cepat saat nilainya di bawah 70, lebih lambat antara 70–90, dan perlahan setelah 90.
- Ketika progress mencapai 100%, `finish()` menghentikan interval dan menghitung waktu yang sudah berlalu.
- `wait = Math.max(0, MIN_TIME - elapsed)` menjaga durasi minimum loader. Setelah jeda tambahan 120 ms, class `done` ditambahkan ke loader dan class `loaded` ke `body`.
- Setelah transisi selesai, elemen preloader dihapus melalui event `transitionend` dengan opsi `{ once: true }`.
- `startHeroWords()` dipanggil setelah loader mulai ditutup agar animasi kata hero dimulai pada waktu yang sesuai.
- `setTimeout(finish, MAX_TIME)` berfungsi sebagai fallback; pemanggilan `finish()` menghentikan interval yang sama.

**Nilai penting:**
| Konstanta | Nilai | Keterangan |
|-----------|-------|------------|
| `MIN_TIME` | `850` ms | Durasi minimum loader |
| `MAX_TIME` | `2200` ms | Batas maksimum fallback |
| Interval `tick` | `60` ms | Frekuensi update progress |
| Jeda penutup | `120` ms | Jeda tambahan setelah waktu minimum dihitung |

---

### 🔹 03. CUSTOM CURSOR + MAGNETIC CTA (Line 100–153)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Kondisi aktivasi | `if (isFinePointer && !prefersReduced)` | 103 | Custom cursor hanya aktif pada pointer presisi dan jika reduced motion tidak aktif |
| Membuat dot | `dot` | 104–105 | Titik kursor kecil dengan class `.cursor-dot` |
| Membuat ring | `ring` | 106–109 | Lingkaran luar dengan label `LIHAT` |
| Posisi pointer | `mx`, `my` | 111 | Menyimpan posisi mouse terakhir |
| Posisi ring | `rx`, `ry` | 112 | Menyimpan posisi ring yang bergerak mengejar pointer |
| Gerak dot | Event `mousemove` | 114–117 | Memindahkan dot ke koordinat pointer |
| Loop ring | `loop()` | 119–124 | Memperbarui posisi ring menggunakan interpolasi setiap frame |
| Selector hover | `HOVER_SEL` | 127 | Menentukan elemen yang memperbesar ring |
| State hover | `is-hover` | 128–141 | Menambahkan atau menghapus class ring saat pointer masuk/keluar target |
| State lihat | `is-view` | 132–135 | Membesarkan ring lebih jauh pada foto profil dan kartu prestasi |
| Target magnet | `#profil a, header nav > a` | 144 | Memilih CTA hero dan link kembali ke beranda |
| Hitung jarak | `dx`, `dy` | 146–148 | Menghitung posisi pointer relatif terhadap pusat elemen |
| Efek magnet | `style.transform` | 149 | Menggeser elemen mengikuti pointer dengan faktor 0.18 |
| Reset magnet | `mouseleave` | 151 | Menghapus transform ketika pointer meninggalkan elemen |

**Cara kerja cursor:**
- JavaScript membuat dua elemen: dot dan ring, lalu memasukkannya ke `body`.
- Dot mengikuti pointer secara langsung lewat koordinat `clientX` dan `clientY`.
- Ring menggunakan rumus interpolasi: posisi ring ditambah 16% dari selisih antara pointer dan ring pada setiap frame.
- `requestAnimationFrame()` menjaga gerakan ring tetap diperbarui mengikuti frame browser.
- Saat pointer berada di atas elemen yang cocok dengan `HOVER_SEL`, ring mendapat class `is-hover`.
- Jika target berada di dalam `#profil figure` atau `#prestasi article`, class `is-view` ditambahkan agar ring masuk ke state tampilan khusus.
- Ketika pointer keluar dari seluruh elemen target, kedua class dihapus.

**Selector hover (`HOVER_SEL`):**
```js
"a, button, li, article, figure, h2, h3, #profil figcaption"
```

**Cara kerja magnetic CTA:**
- Efek hanya diterapkan pada link di dalam `#profil` dan link langsung di dalam navigasi header.
- Pusat elemen dihitung melalui `getBoundingClientRect()`.
- Selisih koordinat pointer terhadap pusat elemen dikalikan `0.18`, lalu dipakai untuk `translate(x, y)`.
- Saat `mouseleave`, inline transform dikosongkan sehingga elemen kembali ke posisi stylesheet.

**State visual cursor dari CSS:**
| State | Ukuran ring | Efek |
|-------|-------------|------|
| Default | `38 × 38px` | Outline warna lime |
| `.is-hover` | `76 × 76px` | Latar lime transparan dan border pink |
| `.is-view` | `96 × 96px` | Latar lime, border hitam, label `LIHAT` terlihat |

> ⚠️ CSS menyembunyikan cursor asli pada perangkat `hover:hover` dan `pointer:fine`. JavaScript juga mengecek reduced motion sebelum menjalankan cursor khusus.

---

### 🔹 04. ANIMASI KATA HERO (Line 155–174)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Ambil heading | `heroTitle` | 158 | Memilih `#profil h1` |
| Status persiapan | `wordsArmed` | 159 | Mencegah teks hero diproses lebih dari sekali |
| Persiapan kata | `armHeroWords()` | 161–168 | Memecah heading menjadi kata dan membungkus tiap kata dengan span |
| Mulai animasi | `startHeroWords()` | 170–173 | Memastikan animasi berjalan setelah preloader selesai |
| Reduced motion | `if (prefersReduced) armHeroWords()` | 174 | Menyiapkan struktur kata tanpa memanggil animasi awal dari loader |

**Cara kerja:**
- Script memilih heading utama dengan selector `#profil h1`.
- Jika heading tidak ditemukan atau kata sudah disiapkan, fungsi langsung berhenti.
- Isi heading dibersihkan dengan `trim()`, lalu dipecah berdasarkan satu atau lebih whitespace menggunakan `/\s+/`.
- Setiap kata dibungkus dengan `.word` dan span bagian dalam yang memiliki `animation-delay` bertahap.
- Delay tiap kata dihitung dari `0.08 * i + 0.1` detik.
- CSS memulai setiap kata dari `translateY(110%)` lalu menggerakkannya ke posisi normal dengan animasi `wordUp`.
- Jika reduced motion aktif, `startHeroWords()` berhenti tanpa menjalankan langkah animasi; `armHeroWords()` tetap dipanggil saat inisialisasi untuk menyiapkan struktur HTML.

---

### 🔹 05. SCROLL PROGRESS BAR & HEADER STATE (Line 176–197)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Membuat progress | `progress` | 179–181 | Membuat indikator scroll `#scroll-progress` |
| Referensi header | `header` | 182 | Mengambil elemen `header` |
| Pengunci frame | `ticking` | 184 | Mencegah update scroll dijalankan berkali-kali dalam satu frame |
| Handler scroll | `onScroll()` | 185–196 | Menjadwalkan pembaruan progress dan header |
| Ukuran halaman | `h` | 189 | Mengambil `document.documentElement` |
| Jarak scroll maksimum | `max` | 190 | Menghitung `scrollHeight - clientHeight` |
| Lebar progress | `progress.style.width` | 191 | Mengubah posisi scroll menjadi persentase lebar |
| State header | `header.classList.toggle()` | 192 | Menambah class `scrolled` saat scroll lebih dari 10px |
| Update active nav | `updateActiveNav()` | 193 | Memanggil placeholder update nav; active nav aktual dikendalikan observer |
| Event scroll | `window.addEventListener()` | 197 | Memanggil handler saat pengguna menggulir halaman |

**Cara kerja:**
- `onScroll()` segera berhenti jika `ticking` masih `true`.
- Jika belum ada update yang menunggu, `ticking` diubah menjadi `true` dan pembaruan dijadwalkan dengan `requestAnimationFrame()`.
- Persentase progress dihitung dari `scrollTop / (scrollHeight - clientHeight) × 100`.
- Jika halaman tidak memiliki area scroll tambahan (`max <= 0`), progress ditetapkan ke 0.
- Header mendapatkan class `scrolled` saat `scrollTop > 10`, sehingga CSS dapat mengganti warna border bawahnya.
- Setelah update selesai, `ticking` direset menjadi `false`.
- Listener scroll memakai `{ passive: true }`.

---

### 🔹 06. ACTIVE NAVIGATION / SCROLLSPY (Line 199–221)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Kumpulkan link nav | `navLinks` | 202 | Mengambil link navigasi section dari header |
| Peta section ke link | `sectionMap` | 203–205 | Membuat pemetaan ID section ke elemen link |
| Daftar section | `observed` | 206–208 | Mengubah ID pada link menjadi elemen section yang tersedia |
| Observer | `sectionObserver` | 210–219 | Memantau section yang memasuki area pengamatan viewport |
| Hapus active lama | `classList.remove("active")` | 213 | Menghapus state aktif dari semua link nav |
| Tandai active baru | `link.classList.add("active")` | 214–216 | Menambahkan class aktif ke link yang cocok dengan section terlihat |
| Observer start | `sectionObserver.observe(s)` | 219 | Mulai mengamati setiap section yang ditemukan |
| Placeholder update | `updateActiveNav()` | 221 | Fungsi kosong; observer menangani state aktif |

**Cara kerja:**
- Semua link pada `header nav ul li a` dikumpulkan menjadi array.
- `sectionMap` menggunakan fragmen `href` tanpa karakter `#` sebagai key, misalnya `profil` atau `tentang`.
- ID yang tidak punya elemen section valid akan dibuang dari daftar `observed`.
- `IntersectionObserver` memakai `rootMargin: "-40% 0px -55% 0px"`, sehingga area pengamatan dipersempit ke bagian tengah viewport.
- Saat observer mendeteksi section yang intersect, semua link kehilangan class `active`, lalu link yang sesuai dengan ID target diberi class tersebut.
- Fungsi `updateActiveNav()` sengaja kosong karena komentar kode menyebut observer sebagai pemegang logika navigasi aktif.

---

### 🔹 07. REVEAL SAAT SCROLL (Line 223–240)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Kondisi animasi | `if (!prefersReduced)` | 226 | Reveal hanya diinisialisasi jika reduced motion tidak aktif |
| Target reveal | `targets` | 227–229 | Memilih paragraf, heading, article, figure profil, dan div langsung di profil |
| Class awal | `classList.add("reveal")` | 230 | Menambahkan class awal untuk efek slide |
| Observer reveal | `io` | 231–239 | Memantau elemen saat memasuki viewport |
| State terlihat | `classList.add("in")` | 234 | Mengembalikan elemen ke posisi normal |
| Berhenti mengamati | `io.unobserve()` | 235 | Mencegah target yang sudah muncul diproses berulang kali |
| Ambang observer | `threshold: 0.12` | 238 | Sekitar 12% area elemen harus terlihat untuk memicu callback |

**Selector target reveal:**
```css
section > p, section > h2, section > article, #profil figure, #profil > div
```

**Cara kerja:**
- Target dipilih dari struktur HTML yang spesifik, bukan semua elemen halaman.
- Setiap target diberi class `.reveal`, yang pada CSS memindahkan elemen 34px ke bawah.
- Saat 12% elemen terlihat, class `.in` ditambahkan untuk mengembalikannya ke posisi `translateY(0)`.
- Setelah muncul, elemen berhenti diamati dengan `unobserve()`.
- Tidak ada pengaturan opacity pada efek ini; sesuai komentar kode, reveal memakai gerakan slide saja.

---

### 🔹 08. MARQUEE / STRIP TEKS BERJALAN (Line 242–255)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Daftar frasa | `phrases` | 245–248 | Menyimpan kata kunci yang ditampilkan pada strip berjalan |
| Membuat container | `marquee` | 249–251 | Membuat elemen `.marquee` dan menandainya `aria-hidden="true"` |
| Membentuk sequence | `seq` | 252 | Mengubah setiap frasa menjadi elemen `<span>` |
| Menggandakan sequence | `marquee.innerHTML` | 253 | Memasukkan dua salinan sequence ke `.marquee-track` |
| Menentukan posisi | `hero` | 254 | Mengambil section `#profil` |
| Menyisipkan marquee | `insertAdjacentElement()` | 255 | Menempatkan marquee tepat setelah hero |

**Isi marquee:**
`DATA SCIENCE` · `PYTHON` · `SQL` · `MACHINE LEARNING` · `PCA` · `GPR` · `DJANGO` · `PANDAS` · `NUMPY` · `ANALISIS DATA` · `★`

**Cara kerja:**
- Frasa disimpan sebagai array JavaScript.
- Setiap item diubah menjadi span, kemudian seluruh item digabung menjadi string HTML.
- Sequence digandakan dua kali untuk membentuk strip yang dapat bergerak secara berulang.
- Container diberi `aria-hidden="true"` karena strip ini berfungsi sebagai elemen dekoratif.
- Marquee disisipkan setelah `#profil`, bukan ditulis langsung di file HTML.
- CSS menjalankan animasi horizontal selama 18 detik dan menghentikannya sementara saat pointer hover di atas marquee.

---

### 🔹 09. NOMOR SECTION OTOMATIS (Line 257–264)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Ambil section | `sections` | 260 | Mengambil semua `main section` |
| Loop urutan | `forEach((s, i) => ...)` | 261 | Memproses section berdasarkan urutan DOM |
| Cari heading | `h2` | 262 | Mencari heading `h2` di tiap section |
| Set nomor | `data-index` | 263 | Menetapkan teks seperti `01 /`, `02 /`, dan seterusnya |

**Cara kerja:**
- JavaScript mengambil seluruh section di dalam `main`.
- Nomor berasal dari indeks urutan section, ditambah satu, dengan awalan `0`.
- Jika section tidak memiliki `h2`, penomoran untuk section tersebut dilewati.
- CSS pseudo-element `section > h2::before` membaca atribut `data-index` menggunakan `content: attr(data-index)`.

---

### 🔹 10. EASTER EGG — KETIK `DATA` (Line 266–281)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Buffer input | `buffer` | 269 | Menyimpan empat karakter terakhir yang diketik |
| Event keyboard | `keydown` | 270 | Mendengarkan input keyboard di window |
| Filter karakter | `e.key.length !== 1` | 271 | Mengabaikan tombol yang bukan karakter tunggal |
| Simpan karakter | `buffer = ...slice(-4)` | 272 | Mengubah input menjadi huruf kapital dan menyimpan maksimal empat karakter |
| Cek pemicu | `buffer === "DATA"` | 273 | Menjalankan easter egg ketika urutan karakter tepat `DATA` |
| Ubah warna | `setProperty()` | 274–275 | Menukar nilai warna `--acid` dan `--pink` |
| Reset warna | `setTimeout()` | 276–279 | Mengembalikan warna setelah 2500 ms |

**Cara kerja:**
- Script hanya menerima `e.key` yang panjangnya satu karakter.
- Input diubah ke huruf kapital sehingga `data`, `Data`, dan `DATA` sama-sama bisa memicu easter egg.
- Buffer hanya menyimpan empat karakter terakhir.
- Ketika buffer sama dengan `DATA`, `--acid` berubah menjadi cyan (`#00e5ff`) dan `--pink` berubah menjadi lime (`#c8ff00`).
- Setelah 2,5 detik, nilai `--acid` dikembalikan ke `#c8ff00` dan `--pink` ke `#ff2e88`.
- Listener tidak memfilter fokus input/textarea; pemicu mengikuti rangkaian tombol karakter yang diterima oleh `window`.

---

### 🔹 11. SMOOTH ANCHOR NAVIGATION (Line 283–296)

| Interaksi | Fungsi/Variabel | Line | Deskripsi |
|-----------|-----------------|------|-----------|
| Pilih anchor | `querySelectorAll('a[href^="#"]')` | 286 | Memilih semua link yang `href`-nya dimulai dengan `#` |
| Event klik | `addEventListener("click")` | 287 | Menangani klik anchor |
| Ambil ID | `getAttribute("href")` | 288 | Membaca tujuan navigasi dari atribut `href` |
| Validasi ID | `id.length < 2` | 289 | Melewati link dengan `href="#"` |
| Cari target | `document.querySelector(id)` | 290–291 | Mencari elemen tujuan; berhenti jika tidak ditemukan |
| Cegah default | `event.preventDefault()` | 292 | Menghentikan lompatan anchor standar browser |
| Hitung posisi | `top` | 293 | Menghitung posisi target dan mengurangi offset 84px |
| Scroll | `window.scrollTo()` | 294 | Menggulir ke target dengan behavior sesuai reduced motion |

**Cara kerja:**
- Semua anchor internal di halaman ditangani oleh satu listener per link.
- Link dengan `href="#"` dilewati karena panjang ID kurang dari dua karakter.
- Jika target tidak ditemukan, script membiarkan event berjalan tanpa intervensi tambahan.
- Posisi scroll dihitung dari posisi elemen relatif terhadap viewport ditambah `window.scrollY`, lalu dikurangi 84px.
- Perilaku scroll menggunakan `smooth` kecuali jika reduced motion aktif, saat itu behavior menjadi `auto`.

---

### 🔹 12. INISIALISASI SCROLL PERTAMA (Line 298)

| Fungsi | Line | Deskripsi |
|--------|------|-----------|
| `onScroll()` | 298 | Menjalankan perhitungan awal untuk progress bar dan state header |

**Cara kerja:**
- Setelah semua deklarasi dan listener dibuat, `onScroll()` dipanggil satu kali.
- Ini membuat progress bar dan class header dapat langsung mencerminkan posisi halaman tanpa menunggu pengguna melakukan scroll pertama.

---

## 1.2 — Ringkasan Interaksi per Bagian HTML

| Bagian HTML | Interaksi yang Berlaku |
|-------------|------------------------|
| **Header / Navigasi** | Link kembali ke beranda memakai transisi halaman; nav section mendapat class `active` melalui `IntersectionObserver`; header berubah border saat scroll melewati 10px |
| **Profil / Hero** | Preloader, animasi kata pada `h1`, custom cursor, efek magnet pada link CTA, reveal saat scroll, dan marquee setelah hero |
| **Tentang Saya** | Heading/paragraf masuk melalui reveal; link anchor mengarah ke section dengan smooth scroll |
| **Mengapa Memilih Sains Data** | Latar sekunder dan paragraf dengan aksen border pink; konten ikut reveal saat scroll |
| **Fokus Pengembangan** | Kartu fokus dengan hover transform dan shadow; reveal saat section masuk viewport |
| **Keahlian dan Teknologi** | Kartu kategori dan list teknologi memiliki state hover; reveal berjalan untuk article |
| **Riwayat Pendidikan** | Artikel pendidikan memiliki hover geser horizontal; elemen article ikut reveal |
| **Prestasi** | Kartu prestasi memiliki ornamen bintang CSS; artikel dapat memicu state `is-view` pada cursor |
| **Media Sosial dan Kontak** | Kartu kontak punya hover border/shadow; link menggunakan underline animasi |
| **Footer** | Link kembali ke atas memakai smooth anchor; hover pada link berubah warna dan shadow |
| **Global** | Preloader, progress bar, scrollspy, custom cursor desktop, reveal, marquee, nomor section, easter egg `DATA`, smooth anchor |

---

## 1.3 — Fitur-Fitur Lainnya

### ⏳ Preloader & Transisi Halaman

- Preloader halaman dibuat dari JavaScript dan memakai ID `preloader`.
- Logo yang ditampilkan adalah `JAMES.ALDO` dengan label `LOADING_PORTFOLIO.EXE`.
- Progress bar memiliki elemen fill `#pre-fill` dan counter `#pre-pct`.
- Progress naik dengan interval 60 ms; kecepatannya melambat setelah 70% dan 90%.
- Preloader ditutup dengan class `.done`, lalu `body` mendapat class `.loaded`.
- Transisi link ke halaman utama menggunakan fungsi terpisah `triggerPageTransition(url)`.
- Durasi CSS penutupan preloader adalah 0,45 detik dengan easing `cubic-bezier(.85,0,.15,1)`.

### 🖱️ Custom Cursor

- **Dot:** 8 × 8px, warna lime, `mix-blend-mode: difference`.
- **Ring default:** 38 × 38px dengan border 2px lime.
- **Hover:** ring menjadi 76 × 76px, latar lime transparan, border pink.
- **View:** ring menjadi 96 × 96px, latar lime dan border hitam; label `LIHAT` ditampilkan.
- **Interpolasi ring:** faktor 0.16 pada tiap frame.
- **Target pembesaran:** link, button, list item, article, figure, h2, h3, dan figcaption profil.
- **Magnet:** link CTA di hero dan link kembali beranda bergerak berdasarkan pointer dengan faktor 0.18.
- Efek hanya dijalankan saat pointer presisi tersedia dan reduced motion tidak aktif.

### 📈 Scroll Progress & Header State

- Bar `#scroll-progress` berada di bagian atas layar dengan tinggi 4px.
- Lebarnya mengikuti rasio jarak scroll saat ini terhadap jarak scroll maksimum.
- Header mendapat class `.scrolled` ketika posisi scroll lebih dari 10px.
- Update diproses melalui `requestAnimationFrame()` dan flag `ticking`.

### 🧭 Active Navigation / Scrollspy

- Pemetaan section dan link dibangun dari `href` pada daftar navigasi header.
- `IntersectionObserver` memakai `rootMargin: -40% 0px -55% 0px`.
- Link yang cocok mendapat class `.active`.
- CSS menampilkan bracket `[` dan `]` saat link hover atau aktif.

### 🪄 Reveal Saat Scroll

- Target: `section > p`, `section > h2`, `section > article`, `#profil figure`, dan `#profil > div`.
- Elemen mulai dari `translateY(34px)`.
- Setelah masuk viewport, class `.in` mengubah transform ke `translateY(0)`.
- Threshold observer adalah `0.12` dan target yang sudah muncul tidak diamati lagi.
- Efek tidak menggunakan fade opacity.

### ➡️ Marquee Bidang Minat

- Menampilkan kata kunci bidang dan teknologi: Data Science, Python, SQL, Machine Learning, PCA, GPR, Django, pandas, NumPy, Analisis Data, serta simbol bintang.
- Sequence frasa dibuat dua kali untuk membentuk loop visual.
- Animasi CSS berlangsung 18 detik, linear, infinite.
- Animasi berhenti sementara ketika pointer berada di atas marquee.

### 🔢 Nomor Section Otomatis

- Setiap `main section` dihitung berdasarkan urutan DOM.
- Heading `h2` menerima atribut `data-index` berformat `01 /`, `02 /`, dan seterusnya.
- CSS menampilkan nilai itu melalui pseudo-element `::before`.

### 🌈 Easter Egg `DATA`

- Ketik huruf `D`, `A`, `T`, `A` secara berurutan di keyboard.
- Warna `--acid` berubah menjadi cyan dan `--pink` berubah menjadi lime.
- Setelah 2,5 detik, nilai awal dikembalikan.

### ♿ Reduced Motion

- JavaScript mendeteksi `prefers-reduced-motion: reduce`.
- Custom cursor dan reveal tidak diinisialisasi ketika reduced motion aktif.
- Animasi kata hero tidak dimulai melalui `startHeroWords()` pada mode ini.
- Smooth anchor menggunakan `behavior: "auto"`.
- CSS mempersingkat durasi animasi dan transisi menjadi `0.01ms`, serta menonaktifkan smooth scrolling.

---

# 🔷 BAGIAN 2: CSS (`style/james.css`)

## 2.1 — Daftar Bagian & Styling

### 📌 00. FONT IMPORT & TOKENS (`:root`) (Line 1–31)

**Import font — Line 6:**
- `Archivo Black`: font display untuk heading yang tebal.
- `Space Grotesk`: font teks utama.
- `JetBrains Mono`: font monospace untuk label dan navigasi.
- Semua font dimuat melalui Google Fonts dengan `@import`.

**Daftar token:**

| Token | Nilai | Keterangan |
|-------|-------|------------|
| `--bg` | `#0b0b0b` | Latar utama hitam gelap |
| `--bg-2` | `#111111` | Latar sekunder untuk beberapa section dan card |
| `--ink` | `#f4f4f0` | Warna teks utama / putih tulang |
| `--ink-dim` | `#8a8a84` | Warna teks sekunder |
| `--acid` | `#c8ff00` | Aksen lime utama |
| `--pink` | `#ff2e88` | Aksen pink |
| `--cyan` | `#00e5ff` | Aksen cyan |
| `--violet` | `#8b5cff` | Aksen violet |
| `--border` | `#2a2a2a` | Warna border standar |
| `--border-hi` | `#f4f4f0` | Border dengan kontras tinggi |
| `--font-display` | `'Archivo Black', sans-serif` | Font heading/display |
| `--font-body` | `'Space Grotesk', sans-serif` | Font body |
| `--font-mono` | `'JetBrains Mono', monospace` | Font monospace |
| `--shadow-hard` | `8px 8px 0 var(--acid)` | Hard shadow lime tanpa blur |
| `--shadow-pink` | `8px 8px 0 var(--pink)` | Hard shadow pink tanpa blur |
| `--shadow-none` | `0 0 0 transparent` | Nilai shadow tanpa efek |
| `--nav-h` | `72px` | Tinggi default header |
| `--gutter` | `clamp(1.25rem, 4vw, 4rem)` | Jarak sisi yang responsif |

**Cara kerja:**
- Token berada di `:root`, sehingga dapat dipakai di seluruh stylesheet.
- Warna aksen juga diubah sementara oleh easter egg JavaScript melalui `document.documentElement.style.setProperty()`.
- `--nav-h` digunakan untuk tinggi header dan jarak scroll anchor.
- `--gutter` menyesuaikan padding horizontal mengikuti ukuran viewport.

---

### 📌 01. RESET & BASE (Line 33–86)

**Reset universal — Line 34–38:**
- Semua elemen dan pseudo-element mendapat `margin: 0`, `padding: 0`, dan `box-sizing: border-box`.
- `border-box` memastikan ukuran elemen memperhitungkan padding dan border.

**HTML dan body — Line 39–55:**
- `html` menggunakan `scroll-behavior: smooth` dan `scroll-padding-top: calc(var(--nav-h) + 16px)`.
- `body` menggunakan latar `--bg`, teks `--ink`, font `--font-body`, ukuran `1.0625rem`, dan line-height `1.65`.
- `overflow-x: hidden` mencegah konten meluber horizontal.
- Background terdiri dari dua linear-gradient untuk grid blueprint 56px × 56px.

**Noise overlay — Line 56–65:**
- `body::after` menutupi viewport dengan `position: fixed` dan `inset: 0`.
- Overlay memakai SVG data URI berisi filter `feTurbulence` untuk tekstur noise.
- `opacity: .05` menjaga tekstur tetap tipis.
- `pointer-events: none` membuat overlay tidak menghalangi klik.
- `z-index: 9990` menempatkannya di lapisan atas, di bawah beberapa elemen UI yang memakai z-index lebih tinggi.

**Seleksi teks dan scrollbar — Line 66–76:**
- Teks terpilih mendapat background lime dan teks hitam.
- Scrollbar WebKit memiliki lebar 12px dan background hitam.
- Thumb scrollbar berwarna lime dengan border hitam 3px.

**Elemen dasar — Line 78–80:**
- Gambar dibatasi `max-width: 100%` dan ditampilkan sebagai block.
- Link mewarisi warna teks (`color: inherit`).
- List menggunakan `list-style: none`.

**Kursor desktop — Line 82–85:**
- Pada `@media (hover:hover) and (pointer:fine)`, cursor asli disembunyikan untuk body, link, button, article, dan figure.
- Elemen cursor custom disediakan di bagian CSS berikutnya.

---

### 📌 02. PRELOADER (Line 87–136)

**Container `#preloader` — Line 88–100:**
- `position: fixed` dan `inset: 0` menutupi seluruh viewport.
- `z-index: 10000` menempatkan loader di lapisan tertinggi.
- Background hitam; konten disusun vertikal di tengah dengan flexbox.
- Jarak antar elemen `18px`.
- Transisi transform berlangsung `0.45s` menggunakan `cubic-bezier(.85,0,.15,1)`.
- State `.done` menggeser loader ke atas dengan `translateY(-101%)`.

**Logo — Line 101–108:**
- Menggunakan font display, ukuran responsif `clamp(1.6rem, 5vw, 3rem)`, dan letter-spacing `.04em`.
- Logo memakai uppercase.
- Span di dalam logo berwarna lime.

**Progress bar — Line 109–121:**
- Lebar `min(320px, 60vw)` dan tinggi 14px.
- Border putih 2px, padding 2px.
- Elemen `i` mengisi tinggi penuh dan memulai dari lebar 0%.
- Fill berwarna lime dan lebar berubah dengan transisi linear 0.12s.

**Counter — Line 122–127:**
- Menggunakan font monospace, ukuran `.8rem`, warna teks sekunder, dan letter-spacing `.2em`.

**Tag loading — Line 128–136:**
- Ditempatkan absolut di bawah 24px.
- Menggunakan font monospace kecil, warna sekunder, letter-spacing `.3em`, dan uppercase.

---

### 📌 03. CUSTOM CURSOR (Line 138–184)

**Base `.cursor-dot, .cursor-ring` — Line 139–150:**
- Kedua elemen memakai `position: fixed`, `top: 0`, `left: 0`, `z-index: 9999`, `pointer-events: none`, dan bentuk lingkaran.
- Default display `none`; di perangkat hover/pointer presisi diubah menjadi `block`.
- Transform dasar memusatkan elemen terhadap koordinat yang diberikan JavaScript.

**Dot — Line 151–155:**
- Ukuran 8 × 8px.
- Background lime.
- `mix-blend-mode: difference` membuat warna tampil kontras terhadap latar di bawahnya.

**Ring — Line 156–171:**
- Ukuran default 38 × 38px dengan border lime 2px.
- Transisi width, height, background, dan border-color berlangsung 0.25s.
- `.is-hover`: 76 × 76px, background lime transparan 12%, border pink.
- `.is-view`: 96 × 96px, background lime solid, border hitam.

**Label — Line 172–184:**
- Diposisikan memenuhi ring menggunakan `inset: 0`.
- Flexbox menempatkan teks di tengah.
- Font monospace tebal, ukuran `.65rem`, letter-spacing `.15em`, warna hitam.
- Opacity awal 0 dan berubah menjadi 1 saat ring memiliki class `.is-view`.

---

### 📌 04. SCROLL PROGRESS (Line 186–194)

**`#scroll-progress`:**
- Posisi fixed di sisi atas kiri layar.
- Tinggi 4px, lebar awal 0%.
- Background lime dan `z-index: 9995`.
- Lebar diubah oleh JavaScript sesuai persentase scroll.

---

### 📌 05. MARQUEE (Line 196–221)

**Container `.marquee` — Line 197–205:**
- `overflow: hidden` memotong teks yang keluar dari area.
- Border atas dan bawah 2px menggunakan warna `--border`.
- Background lime, teks hitam, padding vertikal `.55rem`, dan `white-space: nowrap`.

**Track — Line 206–217:**
- `inline-flex` dengan gap 2.5rem.
- Font monospace tebal, ukuran `.95rem`, letter-spacing `.12em`, uppercase.
- Animasi `marquee` berlangsung 18 detik, linear, infinite.
- `will-change: transform` memberi petunjuk bahwa transform akan berubah.
- Saat marquee di-hover, animasi berhenti sementara melalui `animation-play-state: paused`.

**Keyframes — Line 218–221:**
- Mulai dari `translateX(0)`.
- Berakhir di `translateX(-50%)`, sesuai dua sequence frasa yang dibuat oleh JavaScript.

---

### 📌 06. HEADER & NAVIGASI (Line 223–310)

**Header — Line 224–234:**
- `position: sticky`, `top: 0`, dan `z-index: 100` menjaga header tetap terlihat saat scroll.
- Tinggi mengikuti `--nav-h`.
- Background hitam transparan 88% dengan `backdrop-filter: blur(10px)`.
- Border bawah 2px warna border.
- Saat class `.scrolled` aktif, warna border bawah berubah menjadi lime.

**Navigasi — Line 235–242:**
- Mengisi tinggi header.
- Menggunakan flexbox untuk menyusun link beranda dan daftar navigasi di kedua sisi.
- Jarak antarkomponen 1rem.
- Padding horizontal memakai `--gutter`.

**Link kembali ke beranda — Line 243–266:**
- Font monospace `.78rem`, tebal, uppercase, letter-spacing `.12em`.
- Border 2px putih, padding `.5rem .9rem`, background `--bg`.
- Hard shadow default `4px 4px 0 var(--acid)`.
- Hover: background lime, teks hitam, geser `(-2px, -2px)`, shadow menjadi `6px 6px` pink.
- Active: bergeser `(2px, 2px)` dan shadow hilang.

**Daftar navigasi — Line 267–310:**
- `ul` memakai flexbox, jarak `.25rem`, dan horizontal overflow untuk menampung item.
- Scrollbar daftar disembunyikan.
- Link menggunakan font monospace `.72rem`, tebal, uppercase, dan warna awal `--ink-dim`.
- Pseudo-element `::before` menambahkan bracket `[` dan `::after` menambahkan `]`.
- Bracket awalnya transparan, berwarna lime, dan muncul saat hover atau class `.active` aktif.
- Link hover/aktif menggunakan warna `--ink`.

---

### 📌 07. LAYOUT & HEADING SECTION (Line 312–361)

**Main dan section — Line 313–320:**
- `main` memakai `position: relative` dan `z-index: 1`.
- Setiap section memiliki padding vertikal responsif `clamp(4rem, 9vw, 7.5rem)` dan padding horizontal `--gutter`.
- Lebar maksimum section 1240px dan margin horizontal otomatis.
- Section yang bersebelahan dipisahkan border atas 2px.

**Heading section — Line 323–355:**
- Font display, ukuran `clamp(2rem, 6vw, 4rem)`, uppercase, line-height 1.05.
- Heading ditampilkan sebagai inline-block agar underline dapat mengikuti lebar heading.
- `::before` menampilkan nomor section dari `data-index`.
- Nomor menggunakan font monospace, ukuran `.8rem`, warna lime, dan posisi di atas heading.
- `::after` adalah garis lime setinggi 6px yang dimulai dari scaleX(0).
- Saat heading di-hover, garis melebar menjadi scaleX(1).

**Paragraf langsung di section — Line 357–361:**
- Lebar maksimum 68 karakter (`68ch`).
- Warna `--ink-dim` dan margin bawah 1.1rem.

---

### 📌 08. HERO / PROFIL (Line 363–520)

**Layout `#profil` — Line 364–372:**
- Grid dua kolom: foto dengan lebar minimum 260px dan maksimum 380px, lalu kolom konten yang mengisi ruang tersisa.
- Konten vertikal disejajarkan ke tengah.
- Gap responsif `clamp(2rem, 5vw, 4.5rem)`.
- Tinggi minimum `calc(100vh - var(--nav-h))`.
- Padding atas responsif.

**Frame foto — Line 373–408:**
- Figure memakai border putih 3px, background sekunder, dan hard shadow lime.
- Hover menggeser frame `(-6px, -6px)`, memutar `-1.5deg`, lalu mengganti shadow menjadi `14px 14px` pink.
- `::before` menampilkan label `IMG_001.JPG` dengan background lime.
- `::after` menampilkan label `DATA/SCIENCE` pada kanan bawah foto dengan background pink.

**Foto dan caption — Line 409–434:**
- Gambar memenuhi lebar frame, menggunakan rasio 1:1 dan `object-fit: cover`.
- Filter awal `grayscale(1) contrast(1.15)`.
- Saat figure di-hover, foto menjadi berwarna dengan `grayscale(0) contrast(1.05)`.
- Caption memiliki border atas putih 3px, padding, font monospace, uppercase, dan flexbox.
- Pseudo-element `●` berwarna lime dan berkedip melalui keyframes `blink` selama 1.4 detik.

**Label status hero — Line 436–449:**
- Paragraf pertama dalam div hero dibuat inline-block.
- Font monospace tebal, uppercase, background lime, teks hitam.
- Diputar `-1.5deg` dan diberi shadow pink 5px.

**Heading utama — Line 450–469:**
- Font display dengan ukuran `clamp(2.6rem, 7.5vw, 5.6rem)`.
- Uppercase dan line-height `.98`.
- Memiliki dua lapisan text-shadow: lime dan pink transparan.
- Kata yang dibungkus `.word` menggunakan `overflow: hidden`.
- Span bagian dalam dimulai dari `translateY(110%)` dan memakai animasi `wordUp` selama `.7s` dengan delay dari JavaScript.

**Deskripsi — Line 470–484:**
- Paragraf setelah label status memakai warna sekunder, maksimum 52ch, ukuran 1.1rem, dan border kiri lime 4px.
- Paragraf terakhir (CTA) menjadi flex container dengan wrapping dan gap 1rem; border dan padding kiri deskripsi direset.

**CTA hero — Line 485–520:**
- Link menggunakan font monospace tebal, uppercase, border putih 3px, dan transisi transform/shadow/background/color.
- CTA pertama: background lime, teks hitam, shadow putih.
- Hover CTA pertama: background pink, geser `(-3px, -3px)`, shadow lime lebih besar.
- CTA terakhir: transparan dengan teks putih dan shadow pink.
- Hover CTA terakhir: background putih, teks hitam, shadow pink lebih besar.
- Active state menggeser tombol `(3px, 3px)` dan menghilangkan shadow.

---

### 📌 09. TENTANG & ALASAN MEMILIH SAINS DATA (Line 522–537)

**Paragraf tentang/alasan — Line 523–526:**
- `#tentang p` dan `#alasan p` memakai ukuran font 1.15rem dan lebar maksimum 75ch.

**Section alasan — Line 527–537:**
- `#alasan` menggunakan background `--bg-2` dan lebar penuh (`max-width: none`).
- Border atas dan bawah 2px warna `--border`.
- Anak langsung diberi lebar maksimum 1240px dan margin horizontal otomatis.
- Paragraf memiliki border kiri pink 4px dan padding kiri 1.2rem.

---

### 📌 10. FOKUS PENGEMBANGAN (Line 539–575)

**Grid fokus — Line 540–545:**
- Tiga kolom dengan `repeat(3, minmax(0, 1fr))`.
- Gap antar kartu 1rem dan margin atas 2rem.

**Kartu fokus — Line 546–557:**
- Tinggi minimum 220px, padding 1.5rem, border 2px, background sekunder.
- Hover menggeser kartu `(-4px, -4px)`, border menjadi warna teks utama, dan shadow 7px pink.
- Transisi mencakup transform, border-color, dan box-shadow.

**Nomor, heading, paragraf — Line 558–575:**
- `.focus-number` tampil sebagai block dengan margin bawah 1.4rem, warna lime, font monospace, ukuran `.7rem`.
- Heading kartu memakai font display, ukuran 1.15rem, uppercase.
- Deskripsi menggunakan warna `--ink-dim` dan ukuran `.95rem`.

---

### 📌 11. KEAHLIAN & TEKNOLOGI (Line 577–656)

**Kartu kategori — Line 578–590:**
- Article memiliki border 2px, background sekunder, padding 1.6rem 1.8rem, dan margin bawah 1.4rem.
- `position: relative` menjadi konteks bagi konten yang mungkin diposisikan relatif.
- Hover menggeser kartu `(-4px, -4px)`, border menjadi `--ink`, dan shadow menjadi 8px lime.

**Heading kategori — Line 591–606:**
- Font monospace, ukuran 1rem, tebal, uppercase, letter-spacing `.08em`.
- Menggunakan flexbox dengan gap `.7rem`.
- Pseudo-element `::before` menampilkan karakter `>` berwarna lime.

**Deskripsi kategori — Line 607–611:**
- Paragraf langsung memakai font monospace `.85rem` dan warna sekunder.

**List teknologi — Line 612–630:**
- List memakai flexbox, wrapping, dan gap `.7rem`.
- Item memiliki border 2px, padding `.5rem 1rem`, font monospace `.85rem`, dan background utama.
- Hover mengubah background menjadi lime, teks menjadi hitam, border menjadi lime, dan memutar item `-1.5deg`.

**Item khusus yang mengandung paragraf — Line 631–643:**
- Selector `li:has(p)` memperlebar item agar dapat mengakomodasi penjelasan PCA dan GPR.
- Item tersebut memakai `flex: 1 1 260px`, padding lebih besar, dan background utama.
- Hover khusus tidak mengubah background, mempertahankan warna teks, mengubah border menjadi pink, dan menonaktifkan transform.

**Strong dan paragraf pada item khusus — Line 644–656:**
- `strong` ditampilkan sebagai block dengan font monospace, warna lime, ukuran `.9rem`, dan margin bawah `.4rem`.
- Paragraf memakai font body, warna sekunder, dan ukuran `.92rem`.

---

### 📌 12. PENDIDIKAN (Line 658–729)

**Kartu pendidikan — Line 659–674:**
- Border 2px, border kiri lime 6px, background sekunder, padding 1.8rem 2rem.
- Margin bawah 1.5rem.
- Grid dua kolom: `1fr auto`, dengan gap `.4rem 2rem`.
- Hover menggeser kartu ke kanan 8px, border menjadi warna teks utama, dan shadow negatif ke kiri dengan warna pink.

**Nama institusi — Line 675–680:**
- Font display dengan ukuran responsif `clamp(1.1rem, 2.5vw, 1.5rem)`.
- Uppercase dan ditempatkan di kolom pertama.

**Periode pendidikan — Line 681–689:**
- Paragraf pertama mendapat kolom kedua dan baris pertama.
- Font monospace `.8rem`, warna lime, letter-spacing `.1em`, dan `white-space: nowrap`.

**Jenjang/program — Line 690–698:**
- Paragraf kedua melebar ke seluruh kolom.
- Font monospace tebal, uppercase, warna pink, dan letter-spacing `.15em`.

**Deskripsi dan label mata pelajaran — Line 699–711:**
- Paragraf ketiga menggunakan warna sekunder dan membentang di semua kolom.
- `h4` menggunakan font monospace `.75rem`, uppercase, warna sekunder, dan margin atas `.6rem`.

**Tag mata pelajaran — Line 712–729:**
- List memakai flexbox dan wrapping.
- Tag memiliki font monospace `.8rem`, border 2px, padding `.35rem .8rem`, dan warna teks sekunder.
- Hover mengubah border dan teks menjadi lime.

---

### 📌 13. PRESTASI (Line 731–770)

**Kartu prestasi — Line 732–739:**
- Border 2px warna border, background sekunder, padding 1.8rem 2rem, dan margin bawah 1.4rem.
- `position: relative` dan `overflow: hidden` membatasi ornamen bintang.

**Ornamen bintang — Line 740–753:**
- `::before` menampilkan simbol `★` di kanan atas.
- Ukuran font 5.5rem, warna lime, opacity awal `.08`, dan rotasi 15 derajat.
- Saat kartu di-hover, opacity menjadi `.22` dan bintang berubah ke rotasi 0 derajat dengan scale 1.15.

**Heading prestasi — Line 754–762:**
- Font display dengan ukuran responsif `clamp(1.05rem, 2.4vw, 1.4rem)`.
- Warna lime, uppercase, margin bawah `.7rem`.
- Saat article di-hover, heading bergeser ke kanan 6px.

**Deskripsi dan label penyelenggara — Line 763–770:**
- Paragraf memakai warna sekunder dan lebar maksimum 70ch.
- `strong` memakai font monospace kecil, uppercase, letter-spacing `.15em`, dan warna pink.

---

### 📌 14. KONTAK & MEDIA SOSIAL (Line 772–828)

**Kartu kontak — Line 773–789:**
- Border 2px, background sekunder, padding 1.5rem 1.8rem, dan margin bawah 1.2rem.
- Flexbox menyelaraskan label dan tautan, dengan wrapping agar konten dapat turun baris.
- Hover menggeser kartu `(-4px, -4px)`, memberi hard shadow 8px cyan, dan mengubah border ke warna teks utama.

**Heading kontak — Line 790–804:**
- Font monospace tebal, uppercase, letter-spacing `.2em`, dan warna sekunder.
- Flexbox menempatkan simbol sebelum judul.
- Pseudo-element `::before` menambahkan `//` berwarna lime.

**Tautan kontak — Line 805–828:**
- Font monospace tebal dengan ukuran responsif `clamp(.9rem, 2.5vw, 1.15rem)`.
- `word-break: break-all` membantu alamat panjang tetap muat.
- Pseudo-element `::after` menjadi underline lime setinggi 3px.
- Garis dimulai dari `scaleX(0)` dengan origin kanan.
- Saat hover, warna tautan menjadi lime dan garis melebar ke `scaleX(1)` dari kiri.

---

### 📌 15. FOOTER (Line 830–870)

**Container footer — Line 831–837:**
- Border atas 3px lime, background hitam, padding responsif melalui `--gutter`, teks rata tengah, dan `position: relative`.

**Paragraf footer — Line 838–850:**
- Font monospace `.8rem`, letter-spacing `.12em`, warna sekunder, margin bawah `.8rem`.
- Elemen `time` berwarna lime.
- Paragraf kedua memakai uppercase, letter-spacing `.3em`, dan ukuran `.7rem`.

**Link footer — Line 851–870:**
- Ditampilkan sebagai inline-block dengan margin atas 1rem.
- Font monospace tebal, uppercase, border 2px warna teks utama.
- Hover: background lime, teks hitam, border lime, transform `(-2px, -2px)`, dan shadow 4px pink.

---

### 📌 16. REVEAL SLIDE (Line 872–877)

**`.reveal`:**
- State awal memakai `transform: translateY(34px)`.
- Transisi transform berlangsung `.6s` dengan easing `cubic-bezier(.2,.8,.2,1)`.
- Class `.in` mengubah transform menjadi `translateY(0)`.
- Tidak ada opacity fade pada aturan reveal ini.

---

### 📌 17. RESPONSIVE (Line 879–892)

**Breakpoint 900px — Line 880–883:**
- `#profil` berubah menjadi satu kolom (`grid-template-columns: 1fr`).
- Teks tetap rata kiri.
- Foto profil dibatasi `max-width: 340px`.

**Breakpoint 640px — Line 884–892:**
- `--nav-h` diturunkan menjadi 64px.
- Link kembali ke beranda memakai font lebih kecil, padding lebih rapat, dan shadow 3px lime.
- Grid fokus menjadi satu kolom.
- Kartu fokus tidak lagi memakai tinggi minimum.
- Kartu pendidikan menjadi satu kolom.
- Paragraf periode pendidikan kembali ke kolom pertama dan alur baris normal.
- Kartu kontak berubah menjadi flex column dengan gap `.4rem`.

---

### 📌 18. REDUCED MOTION (Line 894–901)

**`@media (prefers-reduced-motion: reduce)`:**
- Semua elemen dan pseudo-element memiliki `animation-duration: .01ms !important`.
- Semua transition dipersingkat menjadi `.01ms !important`.
- `html` menggunakan `scroll-behavior: auto`.
- Aturan ini membantu pengguna yang memilih pengurangan gerakan menghindari animasi panjang.

---

## 2.2 — Font yang Digunakan

| Font | Peran | Fallback |
|------|-------|----------|
| **Archivo Black** | Heading besar, judul section, nama institusi, dan heading prestasi | `sans-serif` |
| **Space Grotesk** | Paragraf dan teks utama | `sans-serif` |
| **JetBrains Mono** | Navigasi, label, metadata, tombol, dan teks teknis | `monospace` |

Font diimpor melalui Google Fonts pada baris 6 `style/james.css`.

---

## 2.3 — Warna Dasar

| Nama | Hex | Penggunaan |
|------|-----|-----------|
| Background utama | `#0b0b0b` | Body dan latar dasar |
| Background sekunder | `#111111` | Kartu fokus, pendidikan, prestasi, dan kontak |
| Teks utama | `#f4f4f0` | Heading, teks utama, dan border kontras |
| Teks sekunder | `#8a8a84` | Paragraf dan label pendukung |
| Lime / acid | `#c8ff00` | Aksen utama, progress, CTA, dan detail visual |
| Pink | `#ff2e88` | Shadow dan aksen kontras |
| Cyan | `#00e5ff` | Aksen shadow pada kartu kontak dan easter egg |
| Violet | `#8b5cff` | Token aksen tambahan yang tersedia di root |
| Border | `#2a2a2a` | Garis pembatas standar |
| Border kontras | `#f4f4f0` | Garis yang perlu terlihat jelas |

> Catatan: easter egg mengubah `--acid` dan `--pink` sementara. Token `--cyan` dan `--violet` tetap tersedia sebagai token warna, meskipun tidak semua token dipakai pada setiap section.

---

## 2.4 — Hard Shadow Pattern

Portofolio menggunakan shadow tanpa blur untuk menghasilkan aksen visual yang tegas dan kontras.

| Token / Contoh | Nilai | Penggunaan |
|----------------|-------|-----------|
| `--shadow-hard` | `8px 8px 0 var(--acid)` | Shadow utama berwarna lime |
| `--shadow-pink` | `8px 8px 0 var(--pink)` | Shadow aksen pink |
| Header link | `4px 4px 0 var(--acid)` | Tombol kembali ke beranda |
| Card fokus | `7px 7px 0 var(--pink)` saat hover | Efek hover kartu fokus |
| Card keahlian | `8px 8px 0 var(--acid)` saat hover | Efek hover kartu keahlian |
| Card kontak | `8px 8px 0 var(--cyan)` saat hover | Efek hover kartu kontak |

**Karakteristik:**
- Offset shadow terlihat jelas karena blur bernilai `0`.
- Warna shadow berasal dari token CSS, sehingga selaras dengan palet.
- Beberapa komponen bergerak sedikit saat hover bersamaan dengan perubahan shadow.

---

## 2.5 — Border & Aksen Visual

| Pattern | Penggunaan |
|---------|-----------|
| `2px solid var(--border)` | Kartu fokus, keahlian, prestasi, dan kontak |
| `3px solid var(--ink)` | Frame foto profil |
| `6px solid var(--acid)` pada sisi kiri | Penanda kartu pendidikan |
| `2px solid var(--ink)` | Tombol kembali ke beranda dan link footer |
| Pseudo-element `[` dan `]` | Penanda hover/active navigasi |
| Pseudo-element `//` | Prefix heading kartu kontak |
| Pseudo-element `★` | Ornamen kartu prestasi |
| Pseudo-element `>` | Prefix heading kartu keahlian |

---

## 2.6 — Animasi CSS

| Animasi | Baris | Efek |
|---------|-------|------|
| `marquee` | 218–221 | Track bergerak horizontal dari 0 ke -50% |
| `blink` | 434 | Titik caption foto berkedip dengan `steps(1)` setiap 1.4 detik |
| `wordUp` | 469 | Kata hero bergerak dari bawah ke posisi normal |
| Reveal | 872–877 | Elemen slide vertikal 34px ke posisi normal |
| Transisi preloader | 98–100 | Loader bergeser ke atas saat class `.done` aktif |

---

# 🔷 BAGIAN 3: HTML (`template/james.html`)

## 3.1 — Metadata & Koneksi File (Line 1–17)

| Elemen | Line | Deskripsi |
|--------|------|-----------|
| `<!DOCTYPE html>` | 1 | Mendeklarasikan dokumen HTML5 |
| `<html lang="id">` | 2 | Menandai bahasa utama halaman sebagai Bahasa Indonesia |
| `meta charset` | 5 | Menetapkan encoding UTF-8 |
| `meta viewport` | 6 | Menyesuaikan viewport dengan lebar perangkat |
| `meta author` | 8 | Mencantumkan James Aldo Parlindungan sebagai penulis |
| `meta description` | 9–10 | Menjelaskan isi dan fokus portofolio |
| `<title>` | 12 | Menetapkan judul tab browser |
| Link CSS | 14 | Memuat `../style/james.css` |

JavaScript dimuat pada line 479, menjelang akhir body, melalui `../script/james.js`.

---

## 3.2 — HEADER & NAVIGASI (Line 19–36)

| Elemen | Line | Deskripsi |
|--------|------|-----------|
| `<header id="beranda">` | 20 | Header halaman dan target anchor untuk kembali ke atas |
| `<nav aria-label="Navigasi utama">` | 22 | Menandai area navigasi utama untuk aksesibilitas |
| Link beranda | 23 | Mengarah ke `../index.html` |
| Navigasi Profil | 26 | Anchor ke `#profil` |
| Navigasi Tentang Saya | 27 | Anchor ke `#tentang` |
| Navigasi Fokus | 28 | Anchor ke `#fokus` |
| Navigasi Keahlian | 29 | Anchor ke `#keahlian` |
| Navigasi Pendidikan | 30 | Anchor ke `#pendidikan` |
| Navigasi Prestasi | 31 | Anchor ke `#prestasi` |
| Navigasi Media Sosial | 32 | Anchor ke `#kontak` |

**Catatan:** `#alasan` tersedia sebagai section HTML, tetapi tidak mempunyai link tersendiri di daftar navigasi header.

---

## 3.3 — DAFTAR SECTION HTML

| Bagian | ID | Baris | Isi utama |
|--------|----|-------|-----------|
| Profil utama | `#profil` | 42–72 | Foto, label Data Science Student, nama, deskripsi, dan CTA |
| Tentang Saya | `#tentang` | 76–95 | Pengenalan dan minat di bidang sains data |
| Mengapa Memilih Sains Data? | `#alasan` | 99–114 | Alasan memilih Data Science |
| Fokus Pengembangan | `#fokus` | 118–159 | Tiga kartu: Analisis Data, Machine Learning, Solusi Berbasis Data |
| Keahlian dan Teknologi | `#keahlian` | 163–280 | Bahasa pemrograman, framework, library, metode, database, dan tools |
| Riwayat Pendidikan | `#pendidikan` | 284–340 | SMA Negeri 2 Sampit dan Universitas Logistik dan Bisnis Internasional |
| Prestasi | `#prestasi` | 344–390 | Prestasi turnamen basket dan Mobile Legends |
| Media Sosial dan Kontak | `#kontak` | 394–456 | Email, Instagram, dan LinkedIn |
| Footer | — | 462–477 | Hak cipta, tagline, dan link kembali ke atas |

---

## 3.4 — PROFIL UTAMA (Line 39–72)

- `<main>` dimulai pada line 40.
- Section profil memakai ID `profil`.
- `<figure>` menampung foto `../assets/james.jpeg` dengan teks alternatif `Foto profil James Aldo Parlindungan`.
- Atribut `width` dan `height` pada gambar masing-masing bernilai 300.
- `<figcaption>` menampilkan nama pemilik portofolio.
- Label `DATA SCIENCE STUDENT` ditempatkan sebelum heading `h1`.
- Deskripsi memperkenalkan status mahasiswa Sains Data dan minat pada teknologi, pemrograman, analisis data, serta solusi berbasis data.
- CTA `Kenali Saya` mengarah ke `#tentang`; CTA `Hubungi Saya` mengarah ke `#kontak`.

---

## 3.5 — TENTANG SAYA (Line 75–95)

- Heading section adalah `Tentang Saya`.
- Dua paragraf menjelaskan identitas sebagai mahasiswa Sains Data di Universitas Logistik dan Bisnis Internasional.
- Isi juga menyoroti minat pada pemrograman, analisis data, metode komputasi, Python, visualisasi, analisis statistik, dan machine learning.

---

## 3.6 — ALASAN MEMILIH SAINS DATA (Line 98–114)

- Heading section adalah `Mengapa Memilih Sains Data?`.
- Paragraf membahas ketertarikan pada teknologi dan analisis data, pemecahan masalah, pengambilan keputusan, berpikir kritis, pemrograman, serta peluang karier.
- Section ini memiliki ID `alasan` dan styling latar sekunder tersendiri di CSS.

---

## 3.7 — FOKUS PENGEMBANGAN (Line 117–159)

Terdapat tiga kartu di `.focus-grid`:

| Nomor | Judul | Isi |
|-------|-------|-----|
| `01 / ANALISIS` | Analisis Data | Python, pandas, NumPy, dan dasar analisis statistik |
| `02 / PEMODELAN` | Machine Learning | PCA dan Gaussian Process Regression untuk memahami pola dan prediksi |
| `03 / PENGEMBANGAN` | Solusi Berbasis Data | Pemrograman dan teknologi web untuk membangun solusi pendukung pemanfaatan data |

Setiap kartu menggunakan `<article>`, `<span class="focus-number">`, `<h3>`, dan `<p>`.

---

## 3.8 — KEAHLIAN DAN TEKNOLOGI (Line 162–280)

| Kelompok | Baris | Isi |
|----------|-------|-----|
| Pengantar | 165–170 | Penjelasan bahwa daftar berisi teknologi dan perangkat yang sedang dipelajari |
| Bahasa pemrograman dan web technologies | 173–183 | Python dan SQL |
| Framework | 186–195 | Django |
| Library Python | 198–209 | pandas, NumPy, Matplotlib |
| Algoritma, Machine Learning, dan Deep Learning | 212–237 | Principal Component Analysis (PCA) dan Gaussian Process Regression (GPR) beserta deskripsi singkat |
| Deep Learning Framework | 240–250 | Menjelaskan bahwa belum ada framework deep learning yang dicantumkan |
| Database dan teknologi backend | 253–263 | MySQL dan PostgreSQL |
| Tools dan development environment | 266–278 | Visual Studio Code, Jupyter Notebook, Google Colab, GitHub |

---

## 3.9 — RIWAYAT PENDIDIKAN (Line 283–340)

**SMA Negeri 2 Sampit — Line 289–316:**
- Periode 2022–2025.
- Jenjang ditulis sebagai Sekolah Menengah Atas.
- Deskripsi mencantumkan lokasi Sampit, Kalimantan Tengah.
- Mata pelajaran yang dicantumkan: Matematika, Geografi, Ekonomi, dan Informatika.

**Universitas Logistik dan Bisnis Internasional — Line 319–338:**
- Periode 2025–Sekarang.
- Program Studi S1 Sains Data.
- Deskripsi menyebut pengolahan data, pemrograman, analisis statistik, dan metode komputasi untuk mendukung pengambilan keputusan.

---

## 3.10 — PRESTASI (Line 343–390)

| Prestasi | Baris | Keterangan |
|----------|-------|------------|
| Juara 2 Tournament Basketball 5x5 | 355–370 | Turnamen bola basket yang diselenggarakan GIBS School Banjarmasin |
| Juara 2 Tournament Mobile Legends Antar SMA | 373–388 | Turnamen antarsekolah menengah atas yang diselenggarakan UNDA University |

Setiap prestasi memakai heading `h3`, paragraf penjelasan, dan label penyelenggara di dalam elemen `strong`.

---

## 3.11 — MEDIA SOSIAL DAN KONTAK (Line 393–456)

| Jenis | Baris | Implementasi |
|-------|-------|--------------|
| Email | 405–416 | Link `mailto:jamesaldoparl24@gmail.com` |
| Instagram | 419–435 | Link ke profil `justnn616`, dibuka pada tab baru dengan `rel="noopener noreferrer"` dan `aria-label` |
| LinkedIn | 438–454 | Link ke profil James, dibuka pada tab baru dengan `rel="noopener noreferrer"` dan `aria-label` |

---

## 3.12 — FOOTER & SCRIPT (Line 458–482)

- Elemen `main` ditutup pada line 458.
- Footer dimulai pada line 462.
- Copyright memakai elemen `<time datetime="2026">2026</time>`.
- Tagline footer: `Data Science Student | Research & Technology`.
- Link `Kembali ke Atas` mengarah ke `#beranda`.
- Script `../script/james.js` dimuat pada line 479 sebelum `body` ditutup.

---

# BAGIAN 4: HUBUNGAN ANTARFILE & CARA MENJALANKAN

## 4.1 — Peran File

| File | Peran |
|------|-------|
| `template/james.html` | Struktur konten dan elemen halaman portofolio James |
| `style/james.css` | Visual, layout, animasi CSS, dan responsive halaman James |
| `script/james.js` | Interaksi dan perilaku dinamis halaman James |
| `assets/james.jpeg` | Foto profil yang digunakan di halaman James |
| `index.html` | Halaman luar yang dapat menjadi jalur menuju profil; bukan fokus dokumentasi desain ini |

## 4.2 — Alur Kerja Halaman James

1. Browser membaca struktur dari `template/james.html`.
2. HTML memuat `../style/james.css` untuk styling.
3. HTML menampilkan foto dari `../assets/james.jpeg`.
4. Menjelang akhir dokumen, `../script/james.js` dijalankan.
5. JavaScript membuat preloader, progress bar, marquee, cursor khusus (jika didukung), serta listener interaksi.
6. Saat pengguna scroll, progress bar dan state header diperbarui; observer mengelola navigasi aktif dan reveal.
7. Klik anchor internal menjalankan smooth scroll dengan offset 84px, kecuali reduced motion aktif.

## 4.3 — Cara Menjalankan

1. Pertahankan struktur direktori agar path relatif tidak berubah.
2. Buka `index.html` melalui browser atau server lokal.
3. Pilih profil James dari menu Profil atau kartu portofolio.
4. Uji navigasi section, CTA, progress bar, reveal, marquee, hover card, dan easter egg `DATA`.
5. Untuk memeriksa custom cursor dan efek magnet, gunakan desktop dengan mouse dan pastikan preferensi reduced motion tidak aktif.


