import React from "react";

export default function EmergencyHeader() {
  return (
    <div className="bg-[#ffdad6] text-[#bb0112] border-b border-[#ffb4ab] px-4 py-2 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs md:text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#bb0112] text-lg">emergency</span>
          <span className="font-bold">Kondisi gawat darurat?</span>
          <span className="hidden sm:inline">Hubungi 112 atau 119 (layanan darurat resmi).</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            className="inline-flex items-center gap-1 text-xs bg-[#bb0112] text-white px-3 py-1 rounded-full hover:bg-[#e02928] transition-colors shadow-xs"
            href="tel:112"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            <span>Panggil 112 / 119</span>
          </a>
        </div>
      </div>
    </div>
  );
}
