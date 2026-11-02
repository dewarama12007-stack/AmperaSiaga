"use client";

import React from "react";

interface PreLocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllowLocation: () => void;
  onSelectManual: () => void;
}

export default function PreLocationPermissionModal({
  isOpen,
  onClose,
  onAllowLocation,
  onSelectManual,
}: PreLocationPermissionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="bg-slate-950/70 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-50 transition-transform transform scale-100 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>

        {/* Location Icon with soft blue circle */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#eaedff] flex items-center justify-center mx-auto mb-5 text-[#0037b0]">
          <span className="material-symbols-outlined text-3xl sm:text-4xl">location_on</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
          Izinkan akses lokasi?
        </h3>

        {/* Explanation */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 px-2">
          AmperaSiaga memakai lokasi Anda untuk mencari ambulans di sekitar serta menghitung jarak dan estimasi waktu penjemputan.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onAllowLocation();
              onClose();
            }}
            className="w-full h-12 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">near_me</span>
            <span>Izinkan Lokasi</span>
          </button>

          <button
            onClick={() => {
              onSelectManual();
              onClose();
            }}
            className="w-full h-12 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">pin_drop</span>
            <span>Pilih Lokasi Manual</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <span className="material-symbols-outlined text-sm text-slate-400">lock</span>
          <span>Data lokasi hanya digunakan selama sesi pencarian darurat aktif.</span>
        </div>
      </div>
    </div>
  );
}
