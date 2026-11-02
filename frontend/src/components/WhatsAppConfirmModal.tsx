"use client";

import React from "react";
import { Ambulance } from "@/types";
import { isCrossingMusiRiver } from "@/lib/geo";

interface WhatsAppConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambulance: Ambulance | null;
  formData: {
    nama: string;
    telepon: string;
    lokasi: string;
    koordinat: string;
    keterangan: string;
  };
  adminPhone?: string;
  ticketId?: number | null;
}

export default function WhatsAppConfirmModal({
  isOpen,
  onClose,
  ambulance,
  formData,
  adminPhone = "6282162319964",
  ticketId,
}: WhatsAppConfirmModalProps) {
  if (!isOpen || !ambulance) return null;

  const currentWIB = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  const cleanAdminPhone = adminPhone.replace(/\D/g, "");

  const userLat = Number(formData.koordinat.split(",")[0]) || -2.985;
  const ambLat = Number(ambulance.latitude) || -2.985;
  const isCrossRiver = isCrossingMusiRiver(ambLat, userLat);

  const ticketStr = ticketId ? `#AMP-${String(ticketId).padStart(4, "0")}` : "Menunggu Nomor Tiket";

  const messageText = `Halo Admin AmperaSiaga, saya membutuhkan bantuan layanan ambulans darurat.

TIKET DISPATCH: ${ticketStr}
NAMA: ${formData.nama || "Pemohon"}
NOMOR TELEPON: ${formData.telepon || "-"}
LOKASI PENJEMPUTAN: ${formData.lokasi}
KOORDINAT GPS: ${formData.koordinat}
UNIT DIMINTA: ${ambulance.name} (${ambulance.unit_code})
FASKES/RS: ${ambulance.provider?.name || "Mitra Palembang"}
JARAK DARI LOKASI: ${ambulance.distance_km || 2.4} km (Est. ${ambulance.estimated_minutes || 8} mnt${isCrossRiver ? " via Jembatan Ampera" : " via rute jalan raya"})
KONDISI PASIEN: ${formData.keterangan || "Pasien darurat membutuhkan penjemputan segera."}

Mohon segera diverifikasi dan ditugaskan unit ambulans ini. Terima kasih!`;

  const waUrl = `https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(messageText)}`;

  const handleSend = () => {
    window.open(waUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div
      className="bg-slate-950/70 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-50 transition-transform transform scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Ikon WhatsApp di bagian atas */}
        <div className="flex justify-center">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#0F7B6C] flex items-center justify-center shadow-lg shadow-[#0F7B6C]/25 ring-4 ring-[#0F7B6C]/15">
            <svg aria-label="WhatsApp Icon" className="w-10 h-10 sm:w-11 sm:h-11 fill-white" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.19.84.85-3.12-.2-.32a8.189 8.189 0 0 1-1.26-4.28c0-4.52 3.68-8.2 8.22-8.2 2.19 0 4.26.86 5.82 2.41a8.175 8.175 0 0 1 2.4 5.79c0 4.53-3.69 8.23-8.23 8.23zm4.51-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28z"></path>
            </svg>
          </div>
        </div>

        {/* 2. Judul Modal */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mt-4 tracking-tight">
          Buka WhatsApp?
        </h2>

        {/* 3. Teks Pengantar */}
        <p className="text-center text-slate-600 text-xs sm:text-sm mt-1.5 mb-5 px-2">
          Anda akan diarahkan ke WhatsApp untuk menghubungi admin AmperaSiaga (<strong>0821-6231-9964</strong>) dengan pesan berikut:
        </p>

        {/* 4. Pratinjau Pesan: Gelembung Chat WhatsApp Hijau Muda */}
        <div className="relative bg-[#DCF8C6] border border-[#C5E1A5] rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs text-slate-800 text-xs sm:text-sm font-mono leading-relaxed select-all">
          <div className="absolute -top-[1px] -left-2.5 w-0 h-0 border-t-[10px] border-t-[#DCF8C6] border-l-[10px] border-l-transparent"></div>
          <div className="space-y-1.5">
            <p className="font-semibold text-slate-900">
              Halo Admin AmperaSiaga, saya membutuhkan bantuan layanan ambulans.
            </p>
            <div className="pt-1 space-y-1 text-slate-700">
              <p>
                <span className="text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">NAMA:</span>{" "}
                {formData.nama}
              </p>
              <p>
                <span className="text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">NOMOR TELEPON:</span>{" "}
                {formData.telepon}
              </p>
              <p>
                <span className="text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">LOKASI:</span>{" "}
                {formData.lokasi}
              </p>
              <p>
                <span className="text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">KOORDINAT:</span>{" "}
                {formData.koordinat}
              </p>
              <p>
                <span className="text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">AMBULANS:</span>{" "}
                {ambulance.name} ({ambulance.unit_code})
              </p>
              <p>
                <span className="text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">JARAK RUTE:</span>{" "}
                {ambulance.distance_km || 2.4} km {isCrossRiver ? "(via Jembatan Ampera)" : "(Rute Jalan Raya)"}
              </p>
              <p>
                <span className="text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">ESTIMASI TIBA:</span>{" "}
                ~{ambulance.estimated_minutes || 8} menit
              </p>
              <p>
                <span className="text-slate-500 font-sans text-xs uppercase tracking-wider font-bold">KETERANGAN:</span>{" "}
                {formData.keterangan || "Pasien darurat"}
              </p>
            </div>
            <p className="pt-2 font-medium text-slate-900 border-t border-[#c0e09d]/70">
              Mohon dibantu mencarikan layanan ambulans.
            </p>
          </div>
          <div className="mt-3 text-right">
            <span className="text-[11px] font-sans text-slate-500 font-medium">
              {currentWIB} WIB • Belum terkirim
            </span>
          </div>
        </div>

        {/* 5. Catatan Kecil */}
        <div className="flex items-center gap-2 mt-4 px-1 text-slate-500 text-xs">
          <span className="material-symbols-outlined text-slate-400 text-base shrink-0">info</span>
          <span>AmperaSiaga tidak memesan ambulans otomatis. Admin akan membantu mencarikan layanan.</span>
        </div>

        {/* 6. Dua Tombol Aksi */}
        <div className="flex items-center gap-3.5 mt-6">
          <button
            onClick={onClose}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl h-11 sm:h-12 px-5 sm:px-6 flex-1 transition-colors text-center text-sm cursor-pointer"
            type="button"
          >
            Batal
          </button>
          <button
            onClick={handleSend}
            className="bg-[#0F7B6C] hover:bg-[#0c6357] text-white font-bold rounded-xl h-11 sm:h-12 px-5 sm:px-6 flex-[2] flex items-center justify-center gap-2 shadow-sm transition-all text-sm active:scale-98 cursor-pointer"
            type="button"
          >
            <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.19.84.85-3.12-.2-.32a8.189 8.189 0 0 1-1.26-4.28c0-4.52 3.68-8.2 8.22-8.2 2.19 0 4.26.86 5.82 2.41a8.175 8.175 0 0 1 2.4 5.79c0 4.53-3.69 8.23-8.23 8.23zm4.51-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28z"></path>
            </svg>
            <span>Kirim WhatsApp ({ticketStr})</span>
          </button>
        </div>

        {/* 7. Opsi Alternatif Telepon Suara Instan */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Sangat kritis? Hubungi langsung:</span>
          <a
            href={`tel:${ambulance.driver_phone || ambulance.whatsapp_number || "112"}`}
            className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Telepon Driver / Hotline</span>
          </a>
        </div>
      </div>
    </div>
  );
}
