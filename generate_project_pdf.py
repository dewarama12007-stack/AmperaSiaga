# -*- coding: utf-8 -*-
"""
Script Generator PDF: Panduan Proyek & Presentasi Tim AmperaSiaga
Diformat khusus dengan pembagian peran: 60% (Frontend Lead) - 20% (Backend) - 20% (UI/UX, QA & Dok).
"""

import os
import textwrap
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle
from matplotlib.backends.backend_pdf import PdfPages

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'

TOTAL_PAGES = 6

def create_page():
    fig, ax = plt.subplots(figsize=(8.27, 11.69), dpi=150)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 141.4)  # Rasio A4 (1 : 1.414)
    ax.axis('off')
    return fig, ax

def draw_header(ax, title, subtitle, category="DOKUMEN RESMI PROYEK & PANDUAN PRESENTASI"):
    strip = Rectangle((0, 131.4), 100, 10, fc="#1e3a8a", ec="none")
    ax.add_patch(strip)
    
    cat_box = FancyBboxPatch((5, 134), 48, 4.5, boxstyle="round,pad=0.2,rounding_size=1", fc="#3b82f6", ec="none")
    ax.add_patch(cat_box)
    ax.text(7, 135.5, category, color="white", fontsize=7.5, weight="bold")
    
    ax.text(5, 126.5, title, color="#0f172a", fontsize=15, weight="bold")
    ax.text(5, 123.5, subtitle, color="#475569", fontsize=8.5)
    
    ax.plot([5, 95], [121, 121], color="#e2e8f0", lw=1.2)

def draw_footer(ax, current_page, total_pages=TOTAL_PAGES):
    ax.plot([5, 95], [7.5, 7.5], color="#e2e8f0", lw=1)
    ax.text(5, 4.5, "AmperaSiaga • Sistem Layanan Ambulans Gawat Darurat Kota Palembang", color="#64748b", fontsize=7.5)
    ax.text(95, 4.5, f"Halaman {current_page} dari {total_pages}", color="#1e3a8a", fontsize=8, weight="bold", ha="right")

def draw_card(ax, x, y, w, h, bg_color="#f8fafc", border_color="#cbd5e1", radius=1.5):
    card = FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0.3,rounding_size={radius}", fc=bg_color, ec=border_color, lw=1)
    ax.add_patch(card)

def draw_badge(ax, x, y, text, bg_color="#dbeafe", text_color="#1e40af", size=7.2):
    w = max(len(text) * 1.25 + 2.5, 14)
    badge = FancyBboxPatch((x, y), w, 3.2, boxstyle="round,pad=0.2,rounding_size=0.8", fc=bg_color, ec="none")
    ax.add_patch(badge)
    ax.text(x + 1.2, y + 0.9, text, color=text_color, fontsize=size, weight="bold")
    return w

def draw_wrapped_text(ax, x, y, text, width_chars=80, fontsize=7.2, color="#0f172a", linespacing=1.32, weight="normal", style="normal"):
    lines = []
    for paragraph in text.split("\n"):
        if not paragraph.strip():
            lines.append("")
        elif paragraph.startswith("• "):
            wrapped = textwrap.wrap(paragraph[2:], width=max(width_chars - 3, 15))
            if wrapped:
                lines.append(f"• {wrapped[0]}")
                for sub in wrapped[1:]:
                    lines.append(f"   {sub}")
            else:
                lines.append("• ")
        elif paragraph.startswith("- "):
            wrapped = textwrap.wrap(paragraph[2:], width=max(width_chars - 3, 15))
            if wrapped:
                lines.append(f"- {wrapped[0]}")
                for sub in wrapped[1:]:
                    lines.append(f"   {sub}")
            else:
                lines.append("- ")
        elif len(paragraph) > 3 and paragraph[:2].isdigit() and paragraph[2] == ".":
            prefix = paragraph[:3] + " "
            wrapped = textwrap.wrap(paragraph[3:].strip(), width=max(width_chars - 4, 15))
            if wrapped:
                lines.append(f"{prefix}{wrapped[0]}")
                for sub in wrapped[1:]:
                    lines.append(f"    {sub}")
            else:
                lines.append(prefix)
        else:
            wrapped = textwrap.wrap(paragraph, width=width_chars)
            lines.extend(wrapped)
            
    wrapped_text = "\n".join(lines)
    ax.text(x, y, wrapped_text, va="top", ha="left", color=color, fontsize=fontsize, 
            linespacing=linespacing, weight=weight, style=style)

def render_page_1(ax):
    draw_header(ax, "1. Pengenalan AmperaSiaga (Bahasa Pemula)", "Memahami ide proyek dengan logika sederhana & masalah nyata Palembang")
    draw_card(ax, 5, 96, 90, 23.5, bg_color="#eff6ff", border_color="#93c5fd", radius=2)
    draw_badge(ax, 7.5, 115, "ANALOGI BAHASA BAYI (PALING GAMPANG)", bg_color="#2563eb", text_color="white", size=7.8)
    
    hero_text = (
        "Bayangkan AmperaSiaga itu seperti aplikasi ojek online (Gojek / Grab), tapi BUKAN untuk pesan makanan, "
        "melainkan KHUSUS MENYELAMATKAN NYAWA orang sakit gawat darurat di Kota Palembang!\n\n"
        "Perbedaannya dengan cara lama:\n"
        "• Dulu: Pasien pingsan -> Keluarga panik mencari nomor RS di brosur lama -> Nomor tidak aktif / sibuk -> Nunggu lama.\n"
        "• Sekarang: Buka web dari HP -> Otomatis disortirkan ambulans SIAGA terdekat -> Klik satu tombol, "
        "operator posko langsung bersiap dan sopir meluncur!"
    )
    draw_wrapped_text(ax, 7.5, 113.2, hero_text, width_chars=96, fontsize=7.4, color="#1e293b", linespacing=1.3)
    ax.text(5, 92, "Kenapa Proyek Ini Lahir? (Masalah Nyata di Lapangan):", color="#0f172a", fontsize=10.5, weight="bold")
    
    draw_card(ax, 5, 64, 28, 26, bg_color="#fff1f2", border_color="#fecdd3")
    draw_badge(ax, 6.5, 85.5, "1. SUNGAI MUSI", bg_color="#e11d48", text_color="white", size=6.5)
    m1_desc = (
        "Palembang terbelah dua: Seberang Ilir & Seberang Ulu.\n\n"
        "Kalau warga di Ulu manggil ambulans dari Ilir, mobil bisa terjebak macet parah di Jembatan Ampera!\n\n"
        "Solusi: Sistem otomatis memprioritaskan unit yang berada di satu sisi sungai."
    )
    draw_wrapped_text(ax, 6.5, 84, m1_desc, width_chars=34, fontsize=6.4, color="#881337", linespacing=1.26)
    
    draw_card(ax, 36, 64, 28, 26, bg_color="#fefce8", border_color="#fef08a")
    draw_badge(ax, 37.5, 85.5, "2. WARGA PANIK", bg_color="#ca8a04", text_color="white", size=6.5)
    m2_desc = (
        "Saat ada keluarga stroke atau kejang, orang tidak sempat mencari-cari kontak puluhan RS satu per satu.\n\n"
        "Solusi: Web dibuat sangat bersih, otomatis baca lokasi HP, dan tombol WhatsApp darurat siap kirim pesan."
    )
    draw_wrapped_text(ax, 37.5, 84, m2_desc, width_chars=34, fontsize=6.4, color="#713f12", linespacing=1.26)
    
    draw_card(ax, 67, 64, 28, 26, bg_color="#f0fdf4", border_color="#bbf7d0")
    draw_badge(ax, 68.5, 85.5, "3. FASKES BUTA", bg_color="#16a34a", text_color="white", size=6.5)
    m3_desc = (
        "RS dan Dinkes tidak punya layar monitor bersama untuk memantau ambulans mana yang sibuk vs nganggur.\n\n"
        "Solusi: Command Center dengan radar peta live 28 unit armada se-Palembang terpantau transparan."
    )
    draw_wrapped_text(ax, 68.5, 84, m3_desc, width_chars=34, fontsize=6.4, color="#14532d", linespacing=1.26)
    
    draw_card(ax, 5, 17.5, 90, 44.5, bg_color="#ffffff", border_color="#cbd5e1", radius=2)
    ax.text(8, 58.5, "Dua Sisi Utama Sistem (Saling Terhubung Real-Time):", color="#0f172a", fontsize=10, weight="bold")
    
    draw_card(ax, 8, 20.5, 41, 35, bg_color="#f8fafc", border_color="#e2e8f0")
    draw_badge(ax, 10, 51.5, "SISI MASYARAKAT (WARGA)", bg_color="#0284c7", text_color="white", size=7.2)
    warga_pts = (
        "• Buka web langsung dari browser HP tanpa instal aplikasi.\n"
        "• Titik jemput otomatis GPS atau ketik alamat di Palembang.\n"
        "• Lihat daftar ambulans terdekat lengkap dengan jarak (km) dan estimasi menit.\n"
        "• Filter fasilitas medis: Tabung Oksigen atau alat ICU mini.\n"
        "• Klik Panggil -> Langsung buka WhatsApp IGD dengan nomor tiket resmi."
    )
    draw_wrapped_text(ax, 10, 49.5, warga_pts, width_chars=44, fontsize=6.8, color="#334155", linespacing=1.35)
    
    draw_card(ax, 51, 20.5, 41, 35, bg_color="#0f172a", border_color="#1e293b")
    draw_badge(ax, 53, 51.5, "SISI POSKO (COMMAND CENTER)", bg_color="#10b981", text_color="white", size=7.2)
    admin_pts = (
        "• Layar pantau untuk operator RS & Dinas Kesehatan.\n"
        "• Peta Pemantauan Armada Palembang (Mode Terang & Gelap).\n"
        "• Alarm sirine audio berbunyi otomatis saat ada panggilan masuk.\n"
        "• Alur Cepat (Dispatch Strip): Verifikasi -> Meluncur -> Selesai.\n"
        "• Keamanan: Anti brute-force password & ganti sandi aman."
    )
    draw_wrapped_text(ax, 53, 49.5, admin_pts, width_chars=44, fontsize=6.8, color="#f1f5f9", linespacing=1.35)
    
    draw_card(ax, 5, 9.5, 90, 7, bg_color="#faf5ff", border_color="#e9d5ff")
    draw_wrapped_text(ax, 7.5, 14.5, ">> Pesan Kunci: 'AmperaSiaga mengubah proses manual yang lambat dan bikin panik menjadi sistem digital 1 pintu yang adil, cepat, dan transparan bagi seluruh warga Palembang.'", width_chars=94, fontsize=7.0, color="#6b21a8", weight="bold")
    draw_footer(ax, 1)

def render_page_2(ax):
    draw_header(ax, "2. Pembagian Peran Tim (60% - 20% - 20%)", "Rincian tugas konkret & pembagian beban kerja adil (Total 100%)")
    intro_role = (
        "Proyek ini dikembangkan oleh tim beranggotakan 3 orang dengan pembagian peran terukur dan proporsional: "
        "Peran 1 bertindak sebagai Frontend Developer (Peran Utama 60%), sementara Peran 2 (Backend & Database) "
        "dan Peran 3 (UI/UX, QA & Dokumentasi) masing-masing memegang porsi kerja seimbang sebesar 20%."
    )
    draw_card(ax, 5, 109.5, 90, 10.5, bg_color="#f8fafc", border_color="#cbd5e1")
    draw_wrapped_text(ax, 7.5, 118, intro_role, width_chars=95, fontsize=7.1, color="#1e293b", linespacing=1.28)
    
    # PERAN 1 (60%)
    draw_card(ax, 5, 75.5, 90, 33, bg_color="#eff6ff", border_color="#3b82f6", radius=2)
    draw_badge(ax, 7.5, 104, "PERAN 1: FRONTEND DEVELOPER (PERAN UTAMA - PORSI: 60%)", bg_color="#1d4ed8", text_color="white", size=7.5)
    a1_desc = (
        "Fokus Utama: Antarmuka Warga, Peta Interaktif, Rute Jembatan Ampera, & Dashboard Admin Posko.\n\n"
        "Tugas Konkret yang Dikerjakan:\n"
        "1. Membangun Antarmuka Warga: Halaman pencarian ambulans ramah panik, deteksi GPS otomatis, filter oksigen/ICU, dan modal tiket WhatsApp.\n"
        "2. Peta Interaktif Leaflet: Peta Kota Palembang 28 armada dengan ikon berdenyut serta segmented switch Mode Terang & Radar Gelap.\n"
        "3. Algoritma Musi River & Jembatan Ampera: Menyusun rumus penentu apakah rute harus melewati Jembatan Ampera atau tidak, serta buffer macet jembatan.\n"
        "4. Command Center Admin: Dashboard posko dengan alarm sirine Web Audio API ting-tung otomatis, drawer dispatch, dan fitur Alihkan Unit.\n"
        "5. Mekanisme Safe-Fallback: Menjamin web tidak pernah crash/layar putih meski server backend atau XAMPP offline."
    )
    draw_wrapped_text(ax, 7.5, 102.5, a1_desc, width_chars=96, fontsize=6.6, color="#0f172a", linespacing=1.28)
    
    # PERAN 2 (20%)
    draw_card(ax, 5, 43.5, 90, 30.5, bg_color="#f0fdf4", border_color="#22c55e", radius=2)
    draw_badge(ax, 7.5, 69.5, "PERAN 2: BACKEND & DATABASE DEVELOPER (PORSI: 20%)", bg_color="#15803d", text_color="white", size=7.5)
    a2_desc = (
        "Fokus Utama: REST API Laravel 11, Autentikasi Admin Token Sanctum, Skema Database MySQL XAMPP & Data.\n\n"
        "Tugas Konkret yang Dikerjakan:\n"
        "1. Skema Database MySQL: Merancang tabel ambulances, providers (faskes), contact_requests (tiket warga), dan users (admin).\n"
        "2. Controller API Laravel: Menulis fungsi CRUD armada dan pembaruan status dispatch di AmbulanceController dan AuthController.\n"
        "3. Autentikasi & Keamanan Admin: Menerapkan token Sanctum, enkripsi bcrypt password, dan email case-insensitive trim.\n"
        "4. Satpam Anti-Spam (Rate Limiting): Memasang throttle 10 req/menit untuk login dan 30 req/menit untuk tiket darurat.\n"
        "5. Seeding Data Nyata: Memasukkan data akurat 28 unit ambulans dari RS Charitas, RSMH, BARI, Hermina, dsb."
    )
    draw_wrapped_text(ax, 7.5, 68, a2_desc, width_chars=96, fontsize=6.6, color="#0f172a", linespacing=1.28)
    
    # PERAN 3 (20%)
    draw_card(ax, 5, 11, 90, 31, bg_color="#fffbeb", border_color="#f59e0b", radius=2)
    draw_badge(ax, 7.5, 37.5, "PERAN 3: UI/UX, QA & DOKUMENTASI (PORSI: 20%)", bg_color="#b45309", text_color="white", size=7.5)
    a3_desc = (
        "Fokus Utama: Desain Ramah Panik, Pengujian Bug & Skenario Ekstrem (QA), Laporan Resmi & Repositori GitHub.\n\n"
        "Tugas Konkret yang Dikerjakan:\n"
        "1. Desain Antarmuka Ramah Panik: Menata skema warna medis, hierarki visual, dan ukuran tombol ramah jempol (thumb-friendly).\n"
        "2. Pengujian Mutu (QA Testing): Menguji skenario ekstrem (kunci login 15 detik jika 5x salah password, uji coba offline fallback).\n"
        "3. Laporan & Panduan Resmi: Menyusun dokumen Word (.DOC) dan PDF panduan lengkap sistem beserta skrip presentasi 12 menit.\n"
        "4. Manajemen Repositori GitHub: Mengelola repositori publik dewarama12007-stack/AmperaSiaga, menyusun README.md, dan .gitignore.\n"
        "5. Validasi Presentasi: Mempersiapkan tim menghadapi sesi tanya-jawab dosen dengan daftar contekan FAQ."
    )
    draw_wrapped_text(ax, 7.5, 36, a3_desc, width_chars=96, fontsize=6.6, color="#0f172a", linespacing=1.28)
    draw_footer(ax, 2)

def render_page_3(ax):
    draw_header(ax, "3. Cara Kerja Sistem dari A sampai Z", "Alur operasional penanganan darurat dari pemanggilan hingga pasien tiba di IGD")
    steps = [
        ("LANGKAH 1", "Warga Mengakses Web", "#3b82f6", 
         "Warga membuka website AmperaSiaga lewat HP. Sistem langsung mendeteksi koordinat GPS atau warga memilih alamat penjemputan di area Palembang."),
        ("LANGKAH 2", "Sistem Menghitung Otomatis", "#6366f1", 
         "Komputer memeriksa posisi 28 ambulans: 'Mana ambulans yang statusnya SIAGA dan paling dekat?'. Sistem juga mengecek apakah perlu menyeberang Sungai Musi."),
        ("LANGKAH 3", "Penerbitan Tiket & WhatsApp", "#0ea5e9", 
         "Warga klik 'Panggil Ambulans'. Nomor tiket resmi terbit otomatis (misal: #AMP-20261024-001) dan sistem membuka chat WA ke IGD dengan teks darurat yang sudah terisi."),
        ("LANGKAH 4", "Alarm Posko Admin Berbunyi", "#f59e0b", 
         "Di Command Center, nada dering sirine berbunyi ting-tung! Banner darurat muncul dan tiket masuk ke daftar antrean 'Menunggu'."),
        ("LANGKAH 5", "Tugaskan Unit (Dispatching)", "#ec4899", 
         "Operator memverifikasi kondisi pasien lalu klik 'Tugaskan Unit'. Status ambulans di peta berubah jadi KUNING (Bertugas) dan sopir meluncur ke lokasi jemput."),
        ("LANGKAH 6", "Penanganan & Pasien Tiba di RS", "#10b981", 
         "Pasien dijemput, diantar ke IGD RS rujukan. Operator klik 'Selesai'. Ambulans otomatis kembali HIJAU (Siaga) siap menangani pasien berikutnya.")
    ]
    
    y_pos = 106
    for num, title, col, desc in steps:
        draw_card(ax, 5, y_pos, 90, 13, bg_color="#ffffff", border_color="#e2e8f0", radius=1.5)
        bar = Rectangle((5, y_pos), 3, 13, fc=col, ec="none")
        ax.add_patch(bar)
        
        draw_badge(ax, 10, y_pos + 8.5, num, bg_color=col, text_color="white", size=6.8)
        ax.text(26, y_pos + 9.2, title, color="#0f172a", fontsize=9, weight="bold")
        draw_wrapped_text(ax, 10, y_pos + 7.5, desc, width_chars=86, fontsize=7.0, color="#475569", linespacing=1.28)
        y_pos -= 15.5
        
    draw_card(ax, 5, 10, 90, 16.5, bg_color="#f8fafc", border_color="#cbd5e1", radius=1.5)
    draw_badge(ax, 7.5, 22.5, "SOP RESMI STATUS DISPATCH OPERATOR", bg_color="#334155", text_color="white", size=7.2)
    sop_text = (
        "1. MENUNGGU  : Tiket baru masuk dari warga, operator sedang membaca data kondisi pasien.\n"
        "2. DIHUBUNGI : Operator menelepon/chat keluarga pasien untuk verifikasi keparahan & lokasi.\n"
        "3. DITANGANI : Ambulans resmi ditugaskan dan meluncur dengan sirine menyala ke lokasi jemput.\n"
        "4. SELESAI   : Pasien telah sampai dengan selamat di IGD dan diserahterimakan ke dokter jaga.\n"
        "5. DIBATALKAN: Permintaan dibatalkan karena salah pencet, sudah dapat kendaraan lain, dsb."
    )
    draw_wrapped_text(ax, 7.5, 21.0, sop_text, width_chars=88, fontsize=6.8, color="#1e293b", linespacing=1.3)
    draw_footer(ax, 3)

def render_page_4(ax):
    draw_header(ax, "4. Bedah Teknologi yang Digunakan", "Penjelasan komponen teknologi dengan analogi sederhana dunia nyata")
    intro_tech = (
        "Membangun AmperaSiaga diibaratkan seperti mendirikan sebuah 'Restoran Cepat Saji Penyelamat Nyawa'. "
        "Semua komponen bekerja sama: ada bagian etalase kasir yang melayani warga dengan cepat, "
        "ada dapur disiplin yang mengolah data, dan ada buku arsip raksasa yang mencatat seluruh armada."
    )
    draw_card(ax, 5, 111, 90, 8.5, bg_color="#f8fafc", border_color="#cbd5e1")
    draw_wrapped_text(ax, 7.5, 117.5, intro_tech, width_chars=95, fontsize=7.2, color="#1e293b", linespacing=1.3)
    
    techs = [
        ("Next.js 16 & React 19", "Frontend Modern (Etalase Kasir Cepat)", "#0284c7",
         "ANALOGI: 'Etalase kasir super gesit tanpa antrean membosankan.'\n"
         "Fungsi di Proyek: Menampilkan peta, kartu armada, dan tombol yang langsung merespons sentuhan jari warga tanpa layar putih berkedip (Single Page Application). Saat panik, kecepatan respon adalah segalanya."),
        ("Tailwind CSS v4", "Desain Visual (Pakaian Pas di Semua Ukuran)", "#06b6d4",
         "ANALOGI: 'Baju seragam yang pas di segala ukuran tubuh.'\n"
         "Fungsi di Proyek: Mengatur warna, tata letak, dan ukuran tombol agar tetap rapi dan proporsional baik dibuka di layar HP Android kecil, iPhone, tablet petugas, maupun monitor TV Command Center 32 inci."),
        ("Leaflet.js & OpenStreetMap", "Peta Digital Interaktif Bebas Biaya", "#10b981",
         "ANALOGI: 'Peta kota resmi tanpa sewa pajak bulanan.'\n"
         "Fungsi di Proyek: Memvisualisasikan jalanan Kota Palembang, sebaran 28 ambulans, posisi Jembatan Ampera, serta fitur Mode Terang (siang) dan Radar Gelap (malam) tanpa ketergantungan biaya kartu kredit Google Maps."),
        ("Laravel 11 & PHP 8", "Backend Framework (Koki Dapur yang Disiplin)", "#ef4444",
         "ANALOGI: 'Koki kepala di dapur belakang yang bekerja teliti dan aman.'\n"
         "Fungsi di Proyek: Menerima pesanan tiket dari warga, memvalidasi nomor telepon, memastikan tidak ada 2 pasien berebut 1 ambulans, dan mengenkripsi kata sandi petugas posko."),
        ("MySQL Database & XAMPP", "Gudang Penyimpanan Data Terstruktur", "#f59e0b",
         "ANALOGI: 'Buku catatan arsip rumah sakit di lemari berkunci besi.'\n"
         "Fungsi di Proyek: Menyimpan daftar faskes rumah sakit, nomor telepon IGD, data spesifikasi unit ambulans, riwayat panggilan warga, serta catatan log operasional operator.")
    ]
    
    y = 92
    for name, subtitle, color, desc in techs:
        draw_card(ax, 5, y, 90, 17.5, bg_color="#ffffff", border_color="#e2e8f0", radius=1.5)
        bar = Rectangle((5, y), 3, 17.5, fc=color, ec="none")
        ax.add_patch(bar)
        
        bw = draw_badge(ax, 10, y + 12.8, name, bg_color=color, text_color="white", size=7.2)
        ax.text(10 + bw + 2.5, y + 13.8, f"({subtitle})", color="#64748b", fontsize=7.0, style="italic")
        draw_wrapped_text(ax, 10, y + 11.2, desc, width_chars=86, fontsize=6.8, color="#1e293b", linespacing=1.3)
        y -= 20.0
        
    draw_footer(ax, 4)

def render_page_5(ax):
    draw_header(ax, "5. Fitur Unggulan & Kesiapan Global", "Keistimewaan geografis Kota Palembang & standar keamanan siap produksi")
    features = [
        ("1. Logika Sungai Musi & Jembatan Ampera", "#1e40af", "#eff6ff",
         "Palembang punya tantangan geografis unik di mana Sungai Musi membelah kota jadi Seberang Ilir dan Seberang Ulu.\n\n"
         "• Sistem otomatis mendeteksi apakah pasien dan ambulans berada di sisi sungai yang sama.\n"
         "• Jika harus menyeberang Ampera, sistem menambahkan buffer waktu karena risiko macet jembatan.\n"
         "• Prioritas utama selalu unit satu sisi sungai agar pasien cepat tertolong!"),
        ("2. Peta Dual-Mode (Terang & Gelap)", "#047857", "#f0fdf4",
         "Peta posko kendali dilengkapi segmented switch:\n\n"
         "• Mode Terang (Default): Sangat bersih dan berdaya kontras tinggi saat siang hari.\n"
         "• Radar Gelap: Tampilan nuansa taktis hitam-cyan yang nyaman di mata saat petugas piket malam (mencegah mata cepat lelah).\n"
         "• Preferensi operator tersimpan otomatis di browser (localStorage)."),
        ("3. Fitur Alihkan Unit (Re-dispatch)", "#b45309", "#fffbeb",
         "Bagaimana jika ambulans yang sedang meluncur mendadak ban bocor atau mogok di jalan?\n\n"
         "• Operator tidak perlu panik menghapus pesanan.\n"
         "• Cukup buka menu 'Alihkan Unit' dan pilih ambulans siaga lainnya.\n"
         "• Sistem membebaskan unit lama dan mengalihkan tiket ke unit baru dengan riwayat log timeline tercatat rapi."),
        ("4. Keamanan Standar Rumah Sakit", "#6b21a8", "#faf5ff",
         "Portal admin dibangun dengan standar keamanan produksi:\n\n"
         "• Anti-Brute Force: Mengunci percobaan login 15 detik jika 5x salah password berturut-turut.\n"
         "• Rate Limiting API: Mencegah serangan spam dan DDoS dari pihak iseng.\n"
         "• Manajemen Akun: Operator dapat memperbarui email dan mengganti password secara aman.")
    ]
    
    cards_pos = [(5, 68), (52, 68), (5, 12), (52, 12)]
    for i, (title, header_col, bg_col, desc) in enumerate(features):
        x, y = cards_pos[i]
        draw_card(ax, x, y, 43, 52, bg_color=bg_col, border_color="#cbd5e1", radius=1.5)
        header_bar = FancyBboxPatch((x, y + 44), 43, 8, boxstyle="round,pad=0.2,rounding_size=1", fc=header_col, ec="none")
        ax.add_patch(header_bar)
        ax.text(x + 2, y + 48, title, color="white", fontsize=7.8, weight="bold")
        draw_wrapped_text(ax, x + 2.5, y + 41, desc, width_chars=40, fontsize=7.0, color="#1e293b", linespacing=1.35)
        
    draw_footer(ax, 5)

def render_page_6(ax):
    draw_header(ax, "6. Naskah Presentasi & Bocoran Pertanyaan", "Panduan praktis giliran bicara di depan penguji / dosen dan kunci jawaban FAQ")
    draw_card(ax, 5, 67, 90, 52.5, bg_color="#ffffff", border_color="#cbd5e1", radius=2)
    draw_badge(ax, 7.5, 115.5, "SKENARIO & STRATEGI GILIRAN BICARA (DURASI 12 MENIT)", bg_color="#1e3a8a", text_color="white", size=7.8)
    
    scripts = (
        "• Menit 00:00 - 04:00 | DIBUKA OLEH PERAN 1 (FRONTEND DEVELOPER - 60%):\n"
        "  'Selamat pagi bapak/ibu dosen dan teman-teman. Kami dari Tim AmperaSiaga. Masalah darurat medis di Palembang sangat khas: "
        "sungai membelah kota, warga panik mencari nomor RS, dan ambulans sering telat karena macet Ampera. "
        "Saya sebagai Frontend Developer membangun portal 1 pintu untuk warga, peta Leaflet 28 armada, algoritma rute Jembatan Ampera, "
        "hingga layar Command Center posko.'\n\n"
        "• Menit 04:00 - 07:30 | DILANJUTKAN OLEH PERAN 2 (BACKEND & DATABASE - 20%):\n"
        "  'Terima kasih. Di balik layar yang simpel itu, ada mesin database MySQL di XAMPP dan REST API Laravel 11. "
        "Tugas saya merancang database untuk 28 unit armada se-Palembang, mengamankan pintu login dengan token Sanctum, "
        "mencegah serangan spam dengan rate limiting, dan memastikan status panggilan tersimpan dengan benar.'\n\n"
        "• Menit 07:30 - 10:30 | DILANJUTKAN OLEH PERAN 3 (UI/UX, QA & DOKUMENTASI - 20%):\n"
        "  'Saya bertanggung jawab di bidang UI/UX, pengujian mutu (QA), dan dokumentasi. Tugas saya memastikan antarmuka ramah jempol "
        "bagi warga yang panik, menguji sistem dari berbagai skenario ekstrem seperti uji salah password 5x dan uji coba jaringan offline, "
        "serta menyusun laporan dokumentasi dan mengelola repositori GitHub.'\n\n"
        "• Menit 10:30 - 12:00 | KESIMPULAN & PENUTUP OLEH PERAN 1:\n"
        "  'Dengan integrasi Frontend 60%, Backend 20%, dan QA/Dokumentasi 20%, sistem AmperaSiaga siap mewujudkan respon gawat darurat "
        "Kota Palembang yang cepat, adil, dan transparan. Terima kasih!'"
    )
    draw_wrapped_text(ax, 7.5, 114, scripts, width_chars=96, fontsize=6.4, color="#0f172a", linespacing=1.28)
    
    draw_card(ax, 5, 9.5, 90, 55.5, bg_color="#f8fafc", border_color="#94a3b8", radius=2)
    draw_badge(ax, 7.5, 61, "BOCORAN PERTANYAAN DOSEN / PENGUJI (FAQ) & KUNCI JAWABAN", bg_color="#b91c1c", text_color="white", size=7.8)
    
    faqs = (
        "1. TANYA: 'Kenapa pembagian porsinya 60% - 20% - 20%?'\n"
        "   JAWAB: 'Karena AmperaSiaga berpusat pada aplikasi web interaktif modern. Frontend (60%) memegang 2 portal sekaligus, peta Leaflet, "
        "dan algoritma Musi River. Backend (20%) mengawal keandalan database MySQL dan API Sanctum. UI/UX & QA (20%) menguji bug ekstrem, "
        "menjamin kenyamanan pengguna, dan menyusun laporan serta repositori.'\n\n"
        "2. TANYA: 'Kenapa kalian pakai OpenStreetMap / Leaflet, bukan Google Maps API?'\n"
        "   JAWAB: 'OpenStreetMap itu open-source dan gratis tanpa biaya per-klik kuota kartu kredit, sangat cocok untuk instansi pemerintahan. "
        "Selain itu, Leaflet sangat ringan dan fleksibel kami kustomisasi, seperti fitur Radar Gelap dan filter koordinat Sungai Musi.'\n\n"
        "3. TANYA: 'Bagaimana jika koneksi internet backend Laravel atau database XAMPP sedang mati/gangguan?'\n"
        "   JAWAB: 'Frontend sudah dipasangi proteksi Safe-Fallback. Jika backend offline, sistem otomatis beralih menggunakan data cadangan lokal, "
        "sehingga aplikasi tidak akan pernah mengalami crash atau layar putih di hadapan warga.'\n\n"
        "4. TANYA: 'Kenapa tombol panggil langsung mengarah ke WhatsApp?'\n"
        "   JAWAB: 'Dalam situasi gawat darurat, verifikasi suara dan instruksi first aid dari perawat IGD via WhatsApp jauh lebih krusial "
        "dibanding animasi mobil bergerak. WhatsApp sudah 100% dipahami oleh seluruh warga Palembang tanpa hambatan belajar.'"
    )
    draw_wrapped_text(ax, 7.5, 59.5, faqs, width_chars=96, fontsize=6.4, color="#0f172a", linespacing=1.28)
    draw_footer(ax, 6)

def main():
    output_filename = "AmperaSiaga_Panduan_Projek_Lengkap.pdf"
    output_path = os.path.join(os.getcwd(), output_filename)
    
    print(f"Memulai pembuatan dokumen PDF: {output_path}")
    with PdfPages(output_path) as pdf:
        pages = [
            ("Halaman 1", render_page_1),
            ("Halaman 2", render_page_2),
            ("Halaman 3", render_page_3),
            ("Halaman 4", render_page_4),
            ("Halaman 5", render_page_5),
            ("Halaman 6", render_page_6),
        ]
        for name, fn in pages:
            fig, ax = create_page()
            fn(ax)
            pdf.savefig(fig)
            plt.close(fig)
            print(f"-> {name} berhasil dibuat")

    print(f"\nSELESAI! Dokumen PDF berhasil disimpan di:\n{output_path}")
    print(f"Ukuran file: {os.path.getsize(output_path)} bytes")

if __name__ == "__main__":
    main()
