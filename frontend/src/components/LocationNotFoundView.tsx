"use client";

import React from "react";

interface LocationNotFoundViewProps {
  onRetry: () => void;
  onSelectManual: () => void;
  onBackToFinder?: () => void;
}

export default function LocationNotFoundView({
  onRetry,
  onSelectManual,
  onBackToFinder,
}: LocationNotFoundViewProps) {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full animate-in fade-in duration-200">
      {/* Breadcrumb & Signal Status */}
      <div className="flex items-center justify-between mb-4 text-xs font-semibold">
        <div className="flex items-center gap-2 text-slate-500">
          <span>Beranda</span>
          <span>/</span>
          <span className="text-[#0037b0]">Deteksi Lokasi</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>Sinyal Terputus</span>
        </div>
      </div>

      {/* Main Grid: Left Panel + Right Map Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Width ~5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Main Warning Box */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">location_off</span>
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Lokasi belum bisa ditemukan
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  GPS mungkin mati atau sinyal lemah. Coba lagi, atau pilih lokasi penjemputan secara manual.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={onRetry}
                className="w-full h-11 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                <span>Coba Lagi</span>
              </button>
              <button
                onClick={onSelectManual}
                className="w-full h-10 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">pin_drop</span>
                <span>Pilih Lokasi Manual</span>
              </button>
            </div>
          </div>

          {/* Guide Box: Cara Mengaktifkan Lokasi Peramban */}
          <div className="bg-white border border-[#c4c5d7]/70 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0037b0] text-base">help</span>
              <span>Cara Mengaktifkan Lokasi Peramban</span>
            </h4>

            {/* Chrome */}
            <div className="space-y-1 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#0037b0]">language</span>
                <span>Google Chrome:</span>
              </div>
              <p className="text-slate-600 pl-5 text-[11px] leading-relaxed">
                Klik ikon gembok / setelan di bilah URL atas, lalu ubah izin Lokasi menjadi Izinkan.
              </p>
            </div>

            {/* Safari */}
            <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#0037b0]">devices</span>
                <span>Safari (Apple):</span>
              </div>
              <p className="text-slate-600 pl-5 text-[11px] leading-relaxed">
                Buka Pengaturan iPhone &gt; Safari &gt; Lokasi, lalu pastikan pilihan berada pada Tanya atau Izinkan.
              </p>
            </div>
          </div>

          {/* Alternatif Panggilan Langsung */}
          <div className="bg-white border border-[#c4c5d7]/70 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-700">
              <span className="material-symbols-outlined text-base">emergency</span>
              <h4 className="text-xs font-bold uppercase tracking-wider">Alternatif Panggilan Langsung</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Jika situasi kritis dan koneksi internet bermasalah, segera hubungi operator terpadu tanggap darurat Kota Palembang:
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href="tel:119"
                className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 hover:bg-blue-100 transition-colors text-center block"
              >
                <div className="text-[10px] text-slate-500 font-bold uppercase">PSC Medis</div>
                <div className="text-xl font-extrabold text-[#0037b0] mt-0.5">119</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Palembang Siaga</div>
              </a>
              <a
                href="tel:112"
                className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 hover:bg-rose-100 transition-colors text-center block"
              >
                <div className="text-[10px] text-slate-500 font-bold uppercase">Kedinasan</div>
                <div className="text-xl font-extrabold text-rose-700 mt-0.5">112</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Bebas Pulsa 24 Jam</div>
              </a>
            </div>
          </div>

          {onBackToFinder && (
            <button
              onClick={onBackToFinder}
              className="text-xs font-semibold text-[#0037b0] hover:underline flex items-center justify-center gap-1 cursor-pointer py-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Kembali ke Halaman Pencarian Ambulans</span>
            </button>
          )}
        </div>

        {/* Right Column: Simulated Map (Width ~7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#c4c5d7] shadow-sm p-2 overflow-hidden relative">
          <div className="relative w-full h-[520px] rounded-xl overflow-hidden bg-[#f1f5f9] select-none">
            {/* Top Bar on Map */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
              <div className="bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex items-center gap-2 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-slate-800">
                  Zona Tinjauan: Kota Palembang - Sungai Musi
                </span>
              </div>
              <div className="bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
                6 Unit Ambulans Standby
              </div>
            </div>

            {/* SVG Map Canvas */}
            <svg className="w-full h-full object-cover" viewBox="0 0 900 680" preserveAspectRatio="xMidYMid slice">
              {/* Secondary Street Grid */}
              <g opacity="0.5" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round">
                <path d="M 100 140 L 800 200" fill="none" />
                <path d="M 220 50 L 260 620" fill="none" />
                <path d="M 680 60 L 720 620" fill="none" />
                <path d="M 120 540 L 820 560" fill="none" />
              </g>

              {/* Sungai Musi Meander */}
              <path
                d="M -20,380 C 220,350 340,400 460,370 C 600,330 760,410 920,370 L 920,460 C 740,510 580,420 440,460 C 310,500 190,440 -20,470 Z"
                fill="#93c5fd"
                opacity="0.85"
              />
              <text fill="#1e40af" fontFamily="Plus Jakarta Sans" fontSize="15" fontWeight="700" x="720" y="420">
                Sungai Musi
              </text>

              {/* Seberang Ilir & Ulu Labels */}
              <text fill="#475569" fontFamily="Plus Jakarta Sans" fontSize="16" fontWeight="800" letterSpacing="2" x="370" y="270">
                SEBERANG ILIR
              </text>
              <text fill="#475569" fontFamily="Plus Jakarta Sans" fontSize="16" fontWeight="800" letterSpacing="2" x="360" y="570">
                SEBERANG ULU
              </text>

              {/* Arterial Road across Ampera */}
              <line x1="470" y1="40" x2="470" y2="640" stroke="#f1a340" strokeWidth="12" />
              <line x1="470" y1="40" x2="470" y2="640" stroke="#ffffff" strokeDasharray="6 4" strokeWidth="2" />

              {/* Jembatan Ampera Bridge Deck */}
              <rect x="461" y="360" width="18" height="98" rx="3" fill="#bb0112" />
              <text fill="#991b1b" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="800" x="500" y="420">
                Ampera
              </text>

              {/* Amb 1 & 2 icons on map */}
              <circle cx="430" cy="240" r="14" fill="#16a34a" stroke="#fff" strokeWidth="2.5" />
              <circle cx="500" cy="280" r="14" fill="#16a34a" stroke="#fff" strokeWidth="2.5" />
              <circle cx="520" cy="520" r="14" fill="#16a34a" stroke="#fff" strokeWidth="2.5" />

              {/* Uncertain Location Marker with Question Mark */}
              <g transform="translate(470, 340)">
                <circle cx="0" cy="0" r="32" fill="#d97706" fillOpacity="0.15" stroke="#d97706" strokeDasharray="4 2" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="18" fill="#d97706" stroke="#ffffff" strokeWidth="3" />
                <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="16" fontWeight="800" textAnchor="middle" x="0" y="6">
                  ?
                </text>
              </g>
            </svg>

            {/* Tooltip on Uncertain Marker */}
            <div className="absolute top-[375px] left-[470px] -translate-x-1/2 bg-white px-2.5 py-1 rounded-md shadow-md border border-slate-200 text-[11px] font-bold text-slate-700 whitespace-nowrap pointer-events-none">
              Lokasi Terakhir Tidak Pasti
            </div>

            {/* Floating Card on Bottom Right */}
            <div
              onClick={onSelectManual}
              className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-3.5 shadow-lg max-w-[280px] cursor-pointer hover:border-[#1d4ed8] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#eaedff] text-[#0037b0] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">pin_drop</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 leading-snug">
                    Ingin pasang pin langsung?
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Geser atau ketuk peta untuk menetapkan titik jemput darurat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
