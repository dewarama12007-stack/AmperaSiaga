import React from "react";

export default function Disclaimer() {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full" id="disclaimer">
      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-5 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-3xl">info</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-amber-950">Disclaimer Penting</h3>
          <p className="text-sm md:text-base text-amber-900 leading-relaxed">
            AmperaSiaga merupakan prototype / platform informasi dan penghubung layanan ambulans. Informasi lokasi,
            ketersediaan, dan estimasi waktu dapat berubah. Sistem ini bukan layanan dispatch ambulans resmi dan tidak
            menjamin waktu kedatangan. Untuk kondisi darurat kritis yang mengancam nyawa, segera gunakan layanan
            darurat resmi pemerintah (Hubungi 112 atau 119).
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-amber-800">Layanan Darurat Resmi:</span>
            <a
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-200/80 hover:bg-amber-300 text-amber-900 px-3.5 py-1.5 rounded-lg transition-colors"
              href="tel:112"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>112 Palembang Siaga</span>
            </a>
            <a
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-200/80 hover:bg-amber-300 text-amber-900 px-3.5 py-1.5 rounded-lg transition-colors"
              href="tel:119"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>119 SPGDT Kemenkes RI</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
