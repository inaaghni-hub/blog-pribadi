# Cara mengedit blog

Semua tulisan disimpan di satu file: `content/posts.json`.
Situs ini membacanya langsung di peramban, jadi tidak ada proses build.

## Mengedit lewat halaman admin (disarankan)

1. Buka https://app.pagescms.org
2. Masuk dengan akun GitHub `inaaghni-hub`, izinkan akses ke repo `blog-pribadi`.
3. Pilih "Tulisan" → tambah, ubah, atau hapus tulisan → Save.
4. Perubahan masuk ke GitHub sebagai commit, dan situs terbit otomatis dalam 1–2 menit.

Berkas konfigurasi admin ada di `.pages.yml`.

## Mengedit manual

Ubah `content/posts.json`. Satu tulisan berbentuk:

```json
{
  "id": "nama-pendek",
  "title": "Judul tulisan",
  "category": "Catatan",
  "date": "2025-10-12",
  "readingTime": 4,
  "cover": "https://... atau kosongkan",
  "excerpt": "Ringkasan satu-dua kalimat.",
  "body": ["Paragraf pertama.", "Paragraf kedua."]
}
```

- `id` harus unik, huruf kecil, tanpa spasi.
- `category` pilihan: Perjalanan, Keseharian, Catatan.
- `date` format YYYY-MM-DD; urutan terbaru muncul paling atas.
- `cover` boleh dikosongkan (""), kartu akan memakai latar warna.

## Struktur berkas

- `index.html` — kerangka halaman
- `script.js` — memuat `content/posts.json` lalu menyusun kartu, arsip, pencarian, dan dialog artikel
- `styles.css` — tampilan
- `content/posts.json` — isi tulisan
- `.pages.yml` — pengaturan halaman admin
