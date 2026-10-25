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
