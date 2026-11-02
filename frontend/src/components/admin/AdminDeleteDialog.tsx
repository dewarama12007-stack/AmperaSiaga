"use client";

import React from "react";
import { Ambulance } from "@/types";

interface AdminDeleteDialogProps {
  ambulance: Ambulance;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AdminDeleteDialog({
  ambulance,
  isDeleting,
  onConfirm,
  onCancel,
}: AdminDeleteDialogProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "tersedia":
        return {
          bg: "bg-[#DCFCE7] text-[#16A34A]",
          dot: "bg-[#16A34A]",
          label: "Tersedia",
        };
      case "sedang_bertugas":
        return {
          bg: "bg-[#FEF3C7] text-[#B45309]",
          dot: "bg-[#F59E0B]",
          label: "Sedang Bertugas",
        };
      case "offline":
      default:
        return {
          bg: "bg-[#F3F4F6] text-[#6B7280]",
          dot: "bg-[#9CA3AF]",
          label: "Offline",
        };
    }
  };

  const statusInfo = getStatusBadge(ambulance.status);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      {/* Modal Dialog Window (Terpusat, Card Putih Rounded-2xl) */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative z-50 animate-in zoom-in-95 duration-150">
        {/* Ikon Peringatan di atas kiri */}
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
        </div>

        {/* Judul Modal */}
        <h3 className="text-xl font-bold text-slate-900 font-headline-sm">Hapus Ambulans?</h3>

        {/* Teks Deskripsi Konfirmasi */}
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Data <span className="font-semibold text-slate-900">{ambulance.name} ({ambulance.unit_code})</span> akan dihapus permanen dari pangkalan data sistem Palembang.
        </p>

        {/* Kotak Rincian Unit yang Akan Dihapus */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-sm my-4 text-slate-700 divide-y divide-slate-200/70">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-semibold text-slate-500">Nama Unit</span>
            <span className="font-bold text-slate-900">{ambulance.name} ({ambulance.unit_code})</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-semibold text-slate-500">Nomor Polisi / Plat</span>
            <span className="font-mono font-bold text-blue-700">{ambulance.unit_code}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-semibold text-slate-500">Pangkalan</span>
            <span className="font-medium text-slate-800">{ambulance.provider?.name || ambulance.base_location || "Kota Palembang"}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-500">Status Terakhir</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusInfo.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Catatan Peringatan Protokol */}
        <div className="flex items-start gap-2 bg-red-50 p-2.5 rounded-lg mb-2 border border-red-200/60">
          <span className="material-symbols-outlined text-red-600 text-sm mt-0.5">info</span>
          <p className="text-xs text-red-800 leading-tight">
            Penghapusan unit ini akan melepaskan rute darurat aktif dan mencatat log tindakan ke Sistem Audit Palembang Siaga.
          </p>
        </div>

        {/* Aksi Tombol */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            type="button"
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
          >
            Batalkan
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">delete</span>
                <span>Hapus Permanen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
