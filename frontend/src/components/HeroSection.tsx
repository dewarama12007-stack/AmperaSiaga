"use client";

import React from "react";

interface HeroSectionProps {
  onUseLocation: () => void;
  onExploreMap: () => void;
  nearestCount?: number;
  currentAddress?: string;
}

export default function HeroSection({
  onUseLocation,
  onExploreMap,
  nearestCount = 2,
  currentAddress,
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#f2f3ff] to-[#faf8ff] py-12 md:py-20 border-b border-[#c4c5d7]/50"
      id="beranda"
    >
      {/* Siluet Halus Jembatan Ampera (SVG Watermark Vector Background) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] flex items-end justify-center overflow-hidden">
        <svg className="w-full max-w-6xl h-96 text-[#1d4ed8]" fill="currentColor" viewBox="0 0 1200 400">
          <path d="M0,400 L0,360 L120,360 L120,240 L160,240 L160,360 L480,360 L480,100 L510,70 L540,100 L540,360 L660,360 L660,100 L690,70 L720,100 L720,360 L1040,360 L1040,240 L1080,240 L1080,360 L1200,360 L1200,400 Z" />
          <line stroke="currentColor" strokeWidth="4" x1="510" x2="300" y1="70" y2="360" />
          <line stroke="currentColor" strokeWidth="4" x1="690" x2="900" y1="70" y2="360" />
          <line stroke="currentColor" strokeWidth="8" x1="525" x2="675" y1="120" y2="120" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Kiri: Informasi & Panggilan Aksi */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">

            {/* Main Headline */}
            <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#131b2e] tracking-tight leading-tight">
              Temukan Layanan Ambulans di Sekitar Anda
            </h1>

            {/* Subtext / Description */}
            <p className="text-base md:text-lg text-[#434655] max-w-2xl leading-relaxed">
              Lihat ambulans di Palembang, jarak dan estimasi waktu tempuhnya, lalu hubungi admin lewat WhatsApp untuk verifikasi unit siaga.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={onUseLocation}
                className="min-h-[52px] px-6 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold text-sm md:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined fill text-xl">my_location</span>
                <span>Gunakan Lokasi Saya</span>
              </button>
              <button
                onClick={onExploreMap}
                className="min-h-[52px] px-6 rounded-xl border-2 border-[#c4c5d7] hover:border-[#1d4ed8] bg-white hover:bg-[#f2f3ff] text-[#131b2e] font-bold text-sm md:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">map</span>
                <span>Cari di Peta</span>
              </button>
            </div>

            {/* Quick Metrics Trust Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#c4c5d7]/60 w-full max-w-lg">
              <div>
                <div className="text-xl md:text-2xl font-bold text-[#1d4ed8]">Palembang</div>
                <div className="text-xs text-[#434655]">Seberang Ilir & Ulu</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-[#0f7b6c]">Siaga</div>
                <div className="text-xs text-[#434655]">Unit Terverifikasi</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-[#dc2626]">112 / 119</div>
                <div className="text-xs text-[#434655]">Darurat Terpadu</div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Pratinjau Peta Mini Interaktif */}
          <div className="lg:col-span-5">
            <div className="bg-white p-3 rounded-3xl border border-[#c4c5d7] shadow-xl relative group">
              <div className="relative h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                {/* Map Simulator Vector Canvas (Palembang Center Preview) */}
                <svg className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" viewBox="0 0 500 400">
                  {/* Base Ground & Parks */}
                  <rect fill="#f1f5f9" height="400" width="500" />
                  <path d="M 50,20 Q 90,80 140,50 T 220,100 L 180,180 L 40,150 Z" fill="#dcfce7" opacity="0.7" />
                  <path d="M 320,280 Q 400,260 460,320 L 420,380 L 290,360 Z" fill="#dcfce7" opacity="0.6" />

                  {/* Sungai Musi (Waterway) */}
                  <path d="M -20,240 C 120,210 260,260 520,190 L 520,250 C 280,310 130,270 -20,300 Z" fill="#93c5fd" />

                  {/* Main Roads / Jembatan Ampera Line */}
                  <line stroke="#cbd5e1" strokeWidth="12" x1="250" x2="250" y1="0" y2="400" />
                  <line stroke="#ffffff" strokeWidth="8" x1="250" x2="250" y1="0" y2="400" />

                  {/* Jembatan Ampera Bridge Span Indicator over river */}
                  <line stroke="#dc2626" strokeWidth="10" x1="244" x2="256" y1="210" y2="255" />

                  {/* Jl Sudirman Lateral */}
                  <path d="M 60,110 L 440,140" stroke="#ffffff" strokeWidth="6" />
                  <path d="M 60,110 L 440,140" stroke="#e2e8f0" strokeDasharray="6 4" strokeWidth="8" />
                  <path d="M 120,340 L 420,310" stroke="#ffffff" strokeWidth="6" />

                  {/* Radius Sensor Wave Around User */}
                  <circle cx="250" cy="130" fill="#3b82f6" fillOpacity="0.12" r="60" stroke="#3b82f6" strokeDasharray="4 3" strokeWidth="1.5" />
                  <circle className="pulsing-wave" cx="250" cy="130" fill="#3b82f6" fillOpacity="0.2" r="28" />
                  <circle cx="250" cy="130" fill="#1d4ed8" r="8" stroke="#ffffff" strokeWidth="3" />

                  {/* Ambulance Markers Mini */}
                  {/* Unit A */}
                  <g transform="translate(205, 100)" className="cursor-pointer">
                    <circle cx="14" cy="14" fill="#16a34a" r="14" />
                    <circle cx="14" cy="14" opacity="0.5" r="18" stroke="#16a34a" strokeWidth="1.5" />
                    <text fill="#ffffff" fontFamily="'Material Symbols Outlined'" fontSize="16" textAnchor="middle" x="14" y="19">
                      ambulance
                    </text>
                  </g>

                  {/* Unit B */}
                  <g transform="translate(310, 160)" className="cursor-pointer">
                    <circle cx="14" cy="14" fill="#16a34a" r="14" />
                    <text fill="#ffffff" fontFamily="'Material Symbols Outlined'" fontSize="16" textAnchor="middle" x="14" y="19">
                      ambulance
                    </text>
                  </g>

                  {/* River & Bridge Labels */}
                  <text fill="#1e40af" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="600" opacity="0.7" x="70" y="270">
                    Sungai Musi
                  </text>
                  <text fill="#991b1b" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" x="265" y="235">
                    Jembatan Ampera
                  </text>
                </svg>

                {/* Floating Quick Stat Badge */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#00685b]/15 text-[#004e44] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-lg">near_me</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#131b2e] truncate max-w-[200px]" title={currentAddress}>
                        {currentAddress || "Wilayah Kota Palembang"}
                      </div>
                      <div className="text-[11px] text-[#434655]">
                        {nearestCount} unit terdekat dalam radius siaga
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1d4ed8] bg-[#dce1ff] px-2.5 py-1 rounded-md">
                    Aktif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
