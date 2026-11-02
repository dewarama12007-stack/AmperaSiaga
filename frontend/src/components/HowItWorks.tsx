import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: "near_me",
      title: "Tentukan lokasi Anda",
      desc: "Izinkan akses GPS otomatis atau pilih titik Anda secara manual di peta wilayah Palembang.",
      tag: "Otomatis terdeteksi",
      color: "text-[#1d4ed8]",
      bg: "bg-[#dce1ff]",
    },
    {
      num: "02",
      icon: "radar",
      title: "Lihat ambulans di sekitar",
      desc: "Cek status ketersediaan, jarak kilometer, dan estimasi waktu tempuh menuju titik penjemputan.",
      tag: "Urutan estimasi tercepat",
      color: "text-[#1d4ed8]",
      bg: "bg-[#dce1ff]",
    },
    {
      num: "03",
      icon: "checklist",
      title: "Pilih ambulans",
      desc: "Pilih unit terdekat dan siapkan informasi singkat mengenai kondisi pasien serta alamat lengkap.",
      tag: "Format ringkas disiapkan",
      color: "text-[#1d4ed8]",
      bg: "bg-[#dce1ff]",
    },
    {
      num: "04",
      icon: "chat",
      title: "Hubungi admin via WhatsApp",
      desc: "Admin kami akan segera membantu mencarikan, memverifikasi, dan mengatur layanan ambulans untuk Anda.",
      tag: "Respon komunikasi terpadu",
      color: "text-[#0f7b6c]",
      bg: "bg-[#99f3e0]",
    },
  ];

  return (
    <section className="py-16 bg-[#f2f3ff] border-y border-[#c4c5d7]/60" id="cara-kerja">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs uppercase tracking-wider font-bold text-[#1d4ed8] mb-2">
            Panduan Penggunaan
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#131b2e]">
            Cara Kerja AmperaSiaga
          </h2>
          <p className="text-sm md:text-base text-[#434655] mt-2">
            Empat langkah sederhana untuk mendapatkan bantuan ambulans dengan cepat dan teratur di Kota Palembang.
          </p>
        </div>

        {/* 4 Langkah Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-6 border border-[#c4c5d7] shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${step.bg} ${step.color} flex items-center justify-center font-bold`}>
                    <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                  </div>
                  <span className="text-3xl font-extrabold text-[#dae2fd]">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#131b2e] mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[#434655] leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-[#1d4ed8] font-semibold">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>{step.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
