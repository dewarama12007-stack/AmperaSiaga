"use client";

import React, { useState, useEffect } from "react";
import { Ambulance } from "@/types";

interface QuickInfoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambulance: Ambulance | null;
  userLocation: { lat: number; lng: number; address: string };
  initialData?: {
    nama?: string;
    telepon?: string;
    keterangan?: string;
  };
  onSubmit: (formData: {
    nama: string;
    telepon: string;
    lokasi: string;
    koordinat: string;
    keterangan: string;
  }) => void;
  onOpenManualLocation?: () => void;
}

export default function QuickInfoFormModal({
  isOpen,
  onClose,
  ambulance,
  userLocation,
  initialData,
  onSubmit,
  onOpenManualLocation,
}: QuickInfoFormModalProps) {
  const [nama, setNama] = useState(initialData?.nama || "");
  const [telepon, setTelepon] = useState(initialData?.telepon || "");
  const [lokasi, setLokasi] = useState(userLocation.address || "");
  const [keterangan, setKeterangan] = useState(initialData?.keterangan || "");

  // Synchronize location if user updates location on the map
  useEffect(() => {
    if (userLocation?.address) {
      setLokasi(userLocation.address);
    }
  }, [userLocation?.address]);

  // Synchronize initialData if provided from previous submissions
  useEffect(() => {
    if (initialData?.nama) setNama(initialData.nama);
    if (initialData?.telepon) setTelepon(initialData.telepon);
    if (initialData?.keterangan) setKeterangan(initialData.keterangan);
  }, [initialData]);

  if (!isOpen || !ambulance) return null;

  const koordinat = `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nama,
      telepon,
      lokasi,
      koordinat,
      keterangan,
    });
  };

  return (
    <div
      className="bg-slate-950/70 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[580px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-50 transition-transform transform scale-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Breadcrumb & Back */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Langkah 3 dari 4 • Formulir Cepat Penjemputan
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#1d4ed8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Peta</span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Hubungi Admin AmperaSiaga
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Lengkapi data singkat berikut agar admin dapat segera mengoordinasikan unit ambulans yang sesuai.
          </p>
        </div>

        {/* Selected Ambulance Info Card */}
        <div className="mb-5 bg-[#f2f3ff] border border-[#1d4ed8]/20 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1d4ed8] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">ambulance</span>
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-none">{ambulance.name}</span>
                <span className="text-xs text-slate-500 font-medium">{ambulance.unit_code}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>Tersedia</span>
            </span>
          </div>
          <div className="pt-2 border-t border-[#1d4ed8]/10 flex items-center justify-between text-slate-700 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#1d4ed8] text-base">route</span>
              <span className="font-bold text-slate-900">{ambulance.distance_km || 2.4} km</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Jarak dari lokasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#1d4ed8] text-base">timer</span>
              <span className="font-bold text-slate-900">Estimasi {ambulance.estimated_minutes || 8} menit</span>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5" htmlFor="nama_lengkap">
              Nama Lengkap <span className="text-[#bb0112] font-bold">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-base">person</span>
              </div>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8] transition-all"
                id="nama_lengkap"
                required
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Budi Santoso"
              />
            </div>
          </div>

          {/* Nomor Telepon WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5" htmlFor="telepon_whatsapp">
              Nomor Telepon (WhatsApp) <span className="text-[#bb0112] font-bold">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-base">chat</span>
              </div>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8] transition-all font-mono"
                id="telepon_whatsapp"
                required
                type="tel"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="Contoh: 0812-3456-7890"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Admin akan menghubungi via WhatsApp untuk konfirmasi penjemputan segera.
            </p>
          </div>

          {/* Lokasi Anda */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-800" htmlFor="lokasi_anda">
                Lokasi Anda <span className="text-[#bb0112] font-bold">*</span>
              </label>
              {onOpenManualLocation && (
                <button
                  type="button"
                  onClick={onOpenManualLocation}
                  className="text-xs font-semibold text-[#1d4ed8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">map</span>
                  <span>Ubah di peta</span>
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-base">pin_drop</span>
              </div>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8] transition-all"
                id="lokasi_anda"
                required
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Ketik alamat penjemputan"
              />
            </div>
          </div>

          {/* Koordinat Titik Jemput */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Koordinat Titik Jemput
            </label>
            <div className="w-full pl-3.5 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 flex items-center justify-between select-all text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-base">location_on</span>
                <span className="font-mono font-semibold text-slate-800">{koordinat}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-semibold uppercase">
                GPS Akurat
              </span>
            </div>
          </div>

          {/* Keterangan Kondisi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-800" htmlFor="keterangan_kondisi">
                Keterangan Kondisi
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Opsional</span>
            </div>
            <textarea
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8] transition-all resize-none"
              id="keterangan_kondisi"
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Pasien sesak napas, butuh tabung oksigen & rujukan segera"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              className="w-full h-11 sm:h-12 bg-[#0F7B6C] hover:bg-[#0B5E53] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
              type="submit"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.19.84.85-3.12-.2-.32a8.189 8.189 0 0 1-1.26-4.28c0-4.52 3.68-8.2 8.22-8.2 2.19 0 4.26.86 5.82 2.41a8.175 8.175 0 0 1 2.4 5.79c0 4.53-3.69 8.23-8.23 8.23zm4.51-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28z"></path>
              </svg>
              <span>Hubungi Admin WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-full h-10 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium flex items-center justify-center transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="pt-1 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-slate-400">info</span>
              <span>Permintaan Anda dicatat agar admin dapat membantu. Tidak ada pemesanan otomatis.</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
