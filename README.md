#AmperaSiaga - Sistem Cerdas Ambulans Gawat Darurat Kota Palembang

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![Laravel](https://img.shields.io/badge/Laravel-11-red?style=flat&logo=laravel)](https://laravel.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat&logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

AmperaSiaga adalah platform layanan panggilan dan pemantauan armada ambulans gawat darurat terpadu satu pintu untuk Kota Palembang. Sistem ini menghubungkan masyarakat yang membutuhkan pertolongan darurat medis dengan Command Center operasional faskes dan Dinas Kesehatan secara real-time.

---

##Masalah Nyata & Keunggulan Khusus Palembang

Kota Palembang memiliki karakteristik geografis unik karena dibelah oleh **Sungai Musi** menjadi kawasan **Seberang Ilir** dan **Seberang Ulu**.

1. **Algoritma Cerdas Koridor Sungai Musi:**
   - Sistem secara otomatis memprioritaskan unit ambulans yang berada di sisi sungai yang sama dengan pasien.
   - Jika harus menyeberangi **Jembatan Ampera**, sistem otomatis menghitung rute lewat koridor jembatan dan menambahkan estimasi buffer waktu akibat potensi kepadatan lalu lintas jembatan.
2. **Dual-Mode Fleet Radar (Mode Terang & Radar Gelap):**
   - Tampilan peta command center dapat dialihkan antara **Mode Terang** (default siang hari) dan **Radar Gelap** (taktis malam hari) dengan preferensi tersimpan di local storage.
3. **Dispatch Workflow & Reassignment (Alihkan Unit):**
   - Alur penanganan SOP satu klik: `Menunggu` ➔ `Dihubungi` ➔ `Ditangani` ➔ `Selesai` / `Dibatalkan`.
   - Fasilitas pengalihan unit (*re-dispatch*) jika ambulans yang ditugaskan mengalami kendala armada di perjalanan.
4. **Keamanan Standar Operasional:**
   - Proteksi *Anti-Brute Force* login admin (kunci 15 detik jika 5x gagal berturut-turut).
   - Rate limiting API untuk mencegah spam request.
   - Enkripsi kata sandi dan manajemen profil petugas.

---

##Struktur Tim & Pembagian Peran

| Anggota | Peran | Fokus Utama |
| :--- | :--- | :--- |
| **Anggota 1** | **Project Lead & Full-Stack Architect** (~45%) | Arsitektur sistem Next.js - Laravel API, Algoritma Musi River & Jembatan Ampera, Audio Tone Sirine, Keamanan Login & Dispatch Realtime. |
| **Anggota 2** | **Frontend & UI/UX Specialist** (~27.5%) | Desain antarmuka sisi warga, Peta Interaktif Leaflet, Mode Terang/Gelap, dan Integrasi WhatsApp Darurat. |
| **Anggota 3** | **Backend, Database & QA Specialist** (~27.5%) | Desain Database MySQL di XAMPP, Controller API Laravel, Seeding Data 28 Unit Ambulans Palembang, dan Pengujian Skenario Fallback. |

---

##Arsitektur Teknologi

- **Frontend:** Next.js 16.3.6 (App Router), React 19, TypeScript, Tailwind CSS v4, Leaflet.js, OpenStreetMap.
- **Backend:** Laravel 11, PHP 8.2+, Laravel Sanctum (Token Auth).
- **Database:** MySQL (XAMPP).
- **Komunikasi:** REST API JSON dengan proteksi *Safe-Fallback Data Lokal* jika backend offline.

---

## Panduan Menjalankan Sistem

### 1. Prasyarat:
- Node.js 20+
- PHP 8.2+ & Composer
- XAMPP (Apache & MySQL)

### 2. Menjalankan Backend (Laravel):
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Pastikan MySQL di XAMPP aktif (database: amperasiaga)
php artisan migrate --seed
php artisan serve
```
Backend berjalan di: `http://localhost:8000`

### 3. Menjalankan Frontend (Next.js):
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di: `http://localhost:3000`

- **Halaman Warga:** `http://localhost:3000/`
- **Portal Command Center Admin:** `http://localhost:3000/admin`

---

##Dokumen Lengkap & Panduan Presentasi
Panduan lengkap penjelasan sistem dalam bahasa pemula beserta naskah presentasi 12 menit dan kunci jawaban FAQ dosen/penguji tersedia di file:
- `AmperaSiaga_Panduan_Projek_Lengkap.pdf`

---
© 2026 Tim Pengembang AmperaSiaga. Dibuat untuk Kota Palembang Siaga Tanggap Darurat.
