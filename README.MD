# Beyond Numbers

Website biografi yang mengangkat tokoh-tokoh ilmu pengetahuan dan kontribusi
mereka bagi dunia. Proyek ini dibuat sebagai situs statis menggunakan HTML,
CSS, dan JavaScript.

**Repository GitHub:** [kimithora/biografiweb](https://github.com/kimithora/biografiweb)

## Tentang Proyek

Beyond Numbers menyajikan perjalanan hidup dan gagasan para tokoh sains dalam
bentuk halaman yang mudah dibaca. Selain biografi, halaman-halamannya juga
menghubungkan kontribusi tokoh dengan matematika, statistika, kesehatan,
eksplorasi antariksa, dan sains data.

## Teknologi

- **HTML** menyusun konten dan struktur halaman, seperti navigasi, judul,
  bagian biografi, kartu tokoh, dan footer.
- **CSS** mengatur warna, tipografi, tata letak, grid, kartu, serta tampilan
  responsif untuk desktop, tablet, dan ponsel.
- **JavaScript** menyediakan interaksi situs, termasuk menu navigasi ponsel,
  animasi saat konten muncul, indikator progres membaca, tombol kembali ke
  atas, dan penyesuaian navigasi halaman.
- **Google Fonts** menyediakan font DM Sans dan Playfair Display. Koneksi
  internet diperlukan agar font tersebut dapat dimuat; font cadangan tetap
  digunakan jika Google Fonts tidak tersedia.

Situs ini tidak memerlukan framework maupun proses build.

## Struktur Folder

```text
webbiografis/
├── assets/
│   ├── carl-friedrich-gauss.jpg
│   ├── florence-nightingale.jpg
│   └── katherine-johnson.jpg
├── script/
│   ├── main.js
│   └── theme.js
├── style/
│   ├── biography.css
│   ├── responsive.css
│   └── style.css
├── template/
│   ├── carl-friedrich-gauss.html
│   ├── florence-nightingale.html
│   ├── index.html
│   ├── katherine-johnson.html
│   └── kimi-thora-refolino.html
└── README.MD
```

### Fungsi berkas utama

- `template/index.html` adalah halaman utama dan daftar tokoh.
- Halaman HTML lain di `template/` memuat biografi setiap tokoh serta halaman
  penulis.
- `style/style.css` berisi gaya dasar dan tampilan halaman utama.
- `style/biography.css` berisi komponen dan tata letak bersama untuk halaman
  biografi.
- `style/responsive.css` menyesuaikan tata letak dan navigasi untuk ukuran
  layar tablet dan ponsel.
- `script/main.js` menangani interaksi umum dan efek saat halaman digulir.
- `script/theme.js` menangani pergantian tema terang/gelap dan menyimpan
  pilihan tema di browser.
- `assets/` menyimpan gambar yang digunakan pada halaman tokoh.

## Menjalankan Secara Lokal

1. Clone repository:

   ```bash
   git clone https://github.com/kimithora/biografiweb.git
   ```

2. Buka folder proyek di editor kode.
3. Buka `template/index.html` di browser, atau jalankan dengan ekstensi
   **Live Server** untuk pengalaman pengembangan yang lebih praktis.

Karena berkas HTML berada di folder `template/`, jalankan halaman utama dari
`template/index.html` agar tautan relatif ke CSS, JavaScript, dan gambar tetap
sesuai.

## Halaman

- Beranda dan koleksi tokoh
- Florence Nightingale
- Katherine Johnson
- Carl Friedrich Gauss
- Tentang penulis

## Kontribusi

Perubahan atau saran dapat diajukan melalui
[Issues](https://github.com/kimithora/biografiweb/issues) atau Pull Request di
repository GitHub.