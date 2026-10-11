# Beyond Numbers — Website Biografi Tokoh

**Beyond Numbers** adalah website biografi yang menampilkan perjalanan hidup, kontribusi, dan pencapaian tokoh-tokoh yang memiliki peran penting dalam perkembangan matematika, statistik, dan sains. Website ini dibuat sebagai proyek pembelajaran mata kuliah Pemrograman I dengan menerapkan HTML, CSS, dan JavaScript.

Repository: [https://github.com/kimithora/webbiografis](https://github.com/kimithora/webbiografis)

---

## 1. Tujuan Proyek

Proyek ini bertujuan untuk:

- Menerapkan HTML dalam membangun struktur halaman website.
- Menggunakan CSS untuk mengatur desain, tata letak, warna, dan tipografi.
- Menggunakan JavaScript untuk menambahkan interaksi pada website.
- Menerapkan desain responsif agar website dapat diakses melalui berbagai ukuran layar.
- Mengimplementasikan fitur pergantian tema *light mode* dan *dark mode*.
- Menyajikan informasi biografi tokoh dalam tampilan yang terstruktur dan mudah dibaca.

## 2. Teknologi yang Digunakan

| Teknologi | Fungsi |
|---|---|
| HTML5 | Membentuk struktur dan konten halaman website. |
| CSS3 | Mengatur desain visual, tata letak, warna, dan animasi. |
| JavaScript | Mengatur interaksi dan perilaku dinamis website. |
| Local Storage | Menyimpan preferensi tema pengguna pada browser. |
| Git dan GitHub | Mengelola versi kode dan menyimpan repository proyek. |

Proyek ini menggunakan teknologi frontend tanpa memerlukan framework JavaScript khusus atau backend untuk menjalankan halaman statisnya.

## 3. Struktur Folder

```text
webbiografis/
├── assets/
│   ├── carl-friedrich-gauss.jpg
│   ├── florence-nightingale.jpg
│   └── katherine-johnson.jpg
│
├── script/
│   ├── main.js
│   └── theme.js
│
├── style/
│   ├── biography.css
│   ├── responsive.css
│   └── style.css
│
└── template/
    ├── index.html
    ├── kimi-thora-refolino.html
    ├── carl-friedrich-gauss.html
    ├── florence-nightingale.html
    └── katherine-johnson.html
```

### Fungsi setiap folder

- **`assets/`**: menyimpan gambar tokoh yang digunakan pada halaman biografi.
- **`script/`**: menyimpan file JavaScript untuk mengatur interaksi dan pergantian tema.
- **`style/`**: menyimpan file CSS yang mengatur tampilan utama, halaman biografi, dan responsivitas.
- **`template/`**: menyimpan halaman HTML, termasuk halaman utama dan halaman biografi masing-masing tokoh.

## 4. Penjelasan Kode HTML

HTML merupakan fondasi utama website. Setiap halaman HTML menyusun elemen yang akan ditampilkan kepada pengguna, seperti navigasi, judul, teks, gambar, kartu informasi, dan bagian footer.

### 4.1 `index.html`

File `index.html` merupakan halaman utama website. Halaman ini berfungsi sebagai pintu masuk untuk mengenalkan konsep Beyond Numbers dan mengarahkan pengunjung ke halaman biografi.

Bagian utama yang umumnya terdapat pada halaman ini meliputi:

- **Header dan navigasi** untuk menampilkan identitas website serta tautan menuju bagian atau halaman lain.
- **Hero section** untuk menampilkan judul utama dan pengenalan singkat website.
- **Daftar tokoh** untuk memperkenalkan tokoh-tokoh yang tersedia dalam website.
- **Kartu biografi** untuk menyajikan ringkasan informasi dan tautan menuju halaman tokoh.
- **Footer** untuk menampilkan informasi penutup website.

### 4.2 Halaman biografi tokoh

File `carl-friedrich-gauss.html`, `florence-nightingale.html`, dan `katherine-johnson.html` digunakan untuk menyajikan informasi biografi secara individual.

Halaman tersebut dapat memuat identitas tokoh, riwayat hidup, perjalanan pendidikan atau karier, kontribusi ilmiah, serta pencapaian penting.

Pemisahan halaman membuat informasi setiap tokoh lebih terorganisasi dan memudahkan pengguna membaca biografi secara mendalam.

### 4.3 `kimi-thora-refolino.html`

File ini merupakan halaman biografi personal yang berfungsi untuk memperkenalkan profil pembuat website. Kontennya dapat mencakup informasi diri, latar belakang pendidikan, minat, pengalaman, dan bidang yang sedang dipelajari.

### 4.4 Penghubung HTML dengan CSS dan JavaScript

HTML menghubungkan struktur halaman dengan file CSS dan JavaScript eksternal. Contoh pemanggilan file pada halaman yang berada di dalam folder `template/`:

```html
<link rel="stylesheet" href="../style/style.css">
<link rel="stylesheet" href="../style/biography.css">
<link rel="stylesheet" href="../style/responsive.css">

<script src="../script/main.js" defer></script>
<script src="../script/theme.js" defer></script>
```

Atribut `href` dan `src` menentukan lokasi file yang digunakan. Sementara itu, atribut `defer` membuat JavaScript dijalankan setelah dokumen HTML selesai diparsing.

Path `../` digunakan untuk berpindah dari folder `template/` ke folder induk proyek sebelum mengakses folder `style/` atau `script/`.

## 5. Penjelasan Kode CSS

CSS digunakan untuk membentuk identitas visual website. Pembagian CSS menjadi beberapa file membantu memisahkan aturan desain umum, desain khusus biografi, dan aturan responsivitas.

### 5.1 `style.css`

File ini berfungsi sebagai dasar desain website. Bagian utama yang diatur meliputi:

- Variabel CSS untuk warna, tipografi, jarak, dan elemen desain lainnya.
- Pengaturan dasar elemen HTML.
- Tipografi, termasuk jenis huruf, ukuran, dan ketebalan teks.
- Tata letak header, navigasi, bagian utama, kartu, dan footer.
- Desain tombol, tautan, serta elemen antarmuka lainnya.
- Efek visual seperti transisi dan bayangan.

Variabel CSS memungkinkan nilai desain digunakan kembali secara konsisten.

Contoh konsep variabel CSS:

```css
:root {
    --color-bg: #ffffff;
    --color-surface: #f5f5f5;
    --color-text: #222222;
    --color-muted: #666666;
    --color-border: #dddddd;
}
```

Variabel tersebut dapat dipanggil melalui `var()`, misalnya:

```css
body {
    background-color: var(--color-bg);
    color: var(--color-text);
}
```

Contoh di atas hanya ilustrasi konsep. Nilai warna sebenarnya mengikuti implementasi dalam file CSS proyek.

### 5.2 `biography.css`

File ini berfokus pada desain halaman biografi. Pengaturannya dapat mencakup:

- Tata letak identitas dan foto tokoh.
- Bagian riwayat hidup dan kontribusi.
- Kartu informasi serta elemen pendukung biografi.
- Penataan paragraf dan judul bagian.
- Komponen khusus seperti rumus atau informasi ilmiah, apabila digunakan pada halaman terkait.

Pemisahan ini menjaga agar aturan desain biografi tidak bercampur seluruhnya dengan aturan halaman utama.

### 5.3 `responsive.css`

File ini mengatur penyesuaian tampilan website terhadap ukuran layar yang berbeda.

CSS responsif umumnya menggunakan *media query* untuk mengubah tata letak berdasarkan lebar viewport. Sebagai contoh, susunan beberapa kolom pada layar desktop dapat diubah menjadi satu kolom pada perangkat seluler.

```css
@media (max-width: 768px) {
    /* Aturan penyesuaian tampilan layar kecil */
}
```

Contoh tersebut menunjukkan konsep penggunaan *media query*. Aturan aktual harus mengikuti isi file `responsive.css`.

## 6. Penjelasan JavaScript

JavaScript membuat website tidak hanya menampilkan konten statis, tetapi juga merespons tindakan pengguna dan kondisi halaman.

### 6.1 `main.js`

File `main.js` menangani interaksi umum website. Berdasarkan fungsi yang diterapkan pada proyek, tanggung jawab utamanya mencakup:

| Fitur | Fungsi |
|---|---|
| Reading progress | Menampilkan kemajuan membaca berdasarkan posisi pengguna pada halaman. |
| Reveal animation | Menampilkan elemen dengan animasi ketika elemen masuk ke area pandang. |
| Hero entrance | Mengatur animasi kemunculan bagian pembuka halaman. |
| Card hover | Memberikan respons visual ketika pengguna mengarahkan kursor ke kartu. |
| Sticky header | Mendukung perilaku header ketika halaman digulir. |
| Back-to-top | Menyediakan navigasi untuk kembali ke bagian atas halaman. |
| Mobile menu | Mengatur interaksi menu navigasi pada layar kecil. |
| Smooth scroll | Membuat perpindahan ke bagian tertentu halaman terasa lebih halus. |
| Footer year | Memperbarui tahun pada footer secara otomatis. |
| Active navigation | Menandai navigasi yang relevan dengan posisi atau bagian halaman. |
| Image handling | Menangani status pemuatan gambar dan kondisi gambar yang gagal dimuat. |
| Reduced motion | Mempertimbangkan preferensi pengguna yang mengurangi animasi. |

Dengan memusatkan interaksi umum di dalam `main.js`, perilaku yang serupa dapat digunakan pada beberapa halaman tanpa harus menulis ulang kode JavaScript yang sama di setiap file HTML.

### 6.2 `theme.js`

File `theme.js` bertanggung jawab atas sistem tema website, khususnya pergantian antara *light mode* dan *dark mode*.

Fungsi utamanya meliputi:

1. **Menentukan tema awal.** Sistem menentukan tema yang digunakan berdasarkan preferensi yang tersedia, termasuk pilihan yang pernah disimpan dan preferensi tema sistem operasi ketika tidak ada pilihan tersimpan.
2. **Mengatur atribut tema.** JavaScript menggunakan atribut `data-theme` pada elemen HTML untuk menandai tema aktif.
3. **Menyimpan preferensi pengguna.** Pilihan tema disimpan di `localStorage` dengan kunci `beyond-numbers-theme`.
4. **Menyediakan tombol pergantian tema.** Script menambahkan kontrol tema ke bagian navigasi.
5. **Menyesuaikan tampilan.** Perubahan tema memengaruhi warna latar, teks, permukaan kartu, batas elemen, dan komponen lain yang memiliki aturan untuk tema gelap.

Penyimpanan preferensi menggunakan `localStorage` memungkinkan pilihan tema tetap tersedia ketika pengguna membuka kembali website melalui browser yang sama, selama data situs tidak dihapus.

## 7. Cara Kerja Light Mode dan Dark Mode

Sistem tema menggunakan kombinasi JavaScript, atribut HTML, variabel CSS, dan `localStorage`.

### Alur pergantian tema

1. Ketika website dibuka, `theme.js` memeriksa preferensi tema yang tersimpan.
2. Jika belum ada pilihan tersimpan, sistem mempertimbangkan preferensi tema perangkat.
3. Tema diterapkan melalui atribut `data-theme` pada elemen `<html>`.
4. Pengguna menekan tombol tema pada navigasi untuk mengganti tampilan.
5. JavaScript memperbarui atribut tema dan menyimpan pilihan pengguna.
6. CSS menyesuaikan warna dan tampilan komponen berdasarkan tema yang aktif.

Secara konseptual, atribut tema dapat digunakan dalam CSS seperti berikut:

```css
:root {
    --color-bg: #ffffff;
    --color-text: #222222;
}

[data-theme="dark"] {
    --color-bg: #171717;
    --color-text: #f1f1f1;
}

body {
    background-color: var(--color-bg);
    color: var(--color-text);
}
```

Kode di atas merupakan ilustrasi sederhana konsep tema berbasis variabel CSS, bukan salinan keseluruhan implementasi `theme.js`.

### Mengapa menggunakan variabel CSS?

Variabel CSS memungkinkan warna yang digunakan oleh banyak komponen dikelola secara terpusat. Ketika tema berubah, nilai warna yang digunakan komponen dapat disesuaikan tanpa perlu menulis ulang seluruh aturan desain.

Pendekatan ini membuat pengelolaan tema lebih konsisten dan mempermudah pemeliharaan kode.

### Mengapa menggunakan `localStorage`?

`localStorage` merupakan penyimpanan lokal pada browser. Dalam proyek ini, penyimpanan tersebut digunakan untuk mengingat pilihan tema pengguna.

Berbeda dengan variabel JavaScript biasa yang hilang ketika halaman dimuat ulang, data `localStorage` dapat bertahan setelah halaman ditutup dan dibuka kembali.

## 8. Hubungan antara HTML, CSS, dan JavaScript

Ketiga teknologi memiliki peran yang saling melengkapi.

| Teknologi | Peran dalam proyek |
|---|---|
| HTML | Menentukan elemen dan struktur konten. |
| CSS | Menentukan bagaimana elemen ditampilkan. |
| JavaScript | Mengatur perilaku dan perubahan berdasarkan interaksi pengguna. |

Sebagai contoh, tombol pergantian tema dibuat atau disediakan pada antarmuka, JavaScript menangani tindakan pengguna dan memperbarui status tema, sedangkan CSS mengubah tampilan halaman berdasarkan tema tersebut.

Dengan demikian, struktur, tampilan, dan interaksi dipisahkan ke dalam bagian yang memiliki tanggung jawab masing-masing.

## 9. Cara Menjalankan Website

Website dapat dijalankan secara lokal menggunakan browser.

1. Unduh repository melalui GitHub atau kloning repository:

   ```bash
   git clone https://github.com/kimithora/webbiografis.git
   ```

2. Masuk ke folder proyek:

   ```bash
   cd webbiografis
   ```

3. Buka folder proyek menggunakan Visual Studio Code.

4. Buka file `template/index.html` menggunakan browser. Untuk pengalaman pengembangan yang lebih nyaman, gunakan ekstensi seperti Live Server pada Visual Studio Code.

5. Pastikan file HTML, CSS, JavaScript, dan gambar berada pada struktur folder yang sesuai agar semua aset dapat dimuat.

Karena proyek ini merupakan website frontend statis, server backend dan database tidak diperlukan untuk menjalankan fungsi dasarnya.

## 10. Kesimpulan

Beyond Numbers merupakan penerapan dasar pengembangan website frontend dengan HTML, CSS, dan JavaScript. HTML digunakan untuk membangun struktur halaman biografi, CSS mengatur tampilan dan responsivitas, sedangkan JavaScript menangani interaksi dan sistem tema.

Pembagian kode ke dalam beberapa file membuat proyek lebih terorganisasi, mudah dikembangkan, dan lebih mudah dipelihara. Fitur seperti animasi, navigasi responsif, indikator kemajuan membaca, dan pergantian tema memberikan pengalaman penggunaan yang lebih interaktif.

Melalui proyek ini, konsep dasar pengembangan website dapat diterapkan secara langsung dalam bentuk website biografi yang terstruktur dan responsif.

---

**Repository GitHub:** [kimithora/webbiografis](https://github.com/kimithora/webbiografis)

**Teknologi:** HTML5 · CSS3 · JavaScript

