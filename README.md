# 🇨🇳 HSK 1 Flashcard Master

Aplikasi pembelajaran Bahasa Mandarin tingkat HSK 1 yang modern, responsif, dan interaktif. Dibangun dengan **React**, **TypeScript**, dan **Tailwind CSS**.

## ✨ Fitur Utama

- **Sistem Flashcard**: Kartu interaktif yang dapat dibalik (flip) untuk mempelajari Hanzi, Pinyin, dan Arti.
- **Suara (Text-to-Speech)**: Menggunakan Web Speech API untuk membacakan Hanzi dengan aksen Mandarin yang natural.
- **Jadwal (Spaced Repetition)**: Algoritma sederhana (Easy, Good, Hard) untuk mengatur frekuensi review kata.
- **Latihan (Quiz Mode)**: Uji kemampuan Anda dengan kuis pilihan ganda yang interaktif.
- **Penyimpanan Lokal**: Semua progres belajar Anda disimpan secara otomatis di browser (`localStorage`).
- **Desain Refined**: Menggunakan palet warna yang hangat dan tipografi serif yang elegan untuk kenyamanan belajar.

## 🚀 Teknologi yang Digunakan

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS (v4)
- **Animasi**: Motion (Framer Motion)
- **Ikon**: Lucide React
- **Voice**: Web Speech API

## 📦 Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek di mesin lokal Anda:

1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd hsk1-flashcard
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```

4. **Buka aplikasi**:
   Aplikasi akan berjalan di `http://localhost:3000`.

## 📁 Struktur Folder

```text
/src
  /components     # Komponen UI (Flashcard, Quiz, dll.)
  /data           # Data kosakata HSK 1 (JSON)
  /hooks          # Custom hooks (useTTS untuk suara)
  /types          # Definisi tipe TypeScript
  App.tsx         # Root component & logika aplikasi
  index.css       # Global styles & konfigurasi Tailwind
```

## 🧠 Cara Menggunakan

1. **Mode Flashcard**: Klik pada kartu untuk melihat arti dan pinyin. Klik ikon speaker untuk mendengarkan pelafalan. Pilih tingkat kesulitan (Easy/Good/Hard) untuk menandai progres Anda.
2. **Mode Kuis**: Klik tab "Kuis" di bagian atas untuk memulai latihan. Pilih arti yang tepat untuk Hanzi yang muncul.
3. **Progres**: Pantau jumlah kata yang sudah Anda "pelajari" melalui bar progres di bagian atas.

---
Dikembangkan dengan ❤️ untuk pembelajar Bahasa Mandarin.
