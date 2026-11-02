"use client";

import React, { useState } from "react";
import { Ambulance, Provider } from "@/types";

interface AdminAddEditModalProps {
  ambulance?: Ambulance | null;
  providers: Provider[];
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: Partial<Ambulance>) => Promise<void>;
}

export default function AdminAddEditModal({
  ambulance,
  providers,
  isOpen,
  isSaving,
  onClose,
  onSave,
}: AdminAddEditModalProps) {
  const isEdit = Boolean(ambulance);

  const [formData, setFormData] = useState({
    name: ambulance?.name || "",
    unit_code: ambulance?.unit_code || "",
    provider_id: ambulance?.provider_id || (providers[0]?.id ?? 1),
    status: ambulance?.status || "tersedia",
    vehicle_type: ambulance?.vehicle_type || "standar",
    has_oxygen: ambulance?.has_oxygen ?? true,
    has_icu: ambulance?.has_icu ?? false,
    latitude: ambulance?.latitude || -2.9760,
    longitude: ambulance?.longitude || 104.7564,
    base_location: ambulance?.base_location || "IGD RSUP Mohammad Hoesin Palembang",
    driver_name: ambulance?.driver_name || "",
    driver_phone: ambulance?.driver_phone || "",
    whatsapp_number: ambulance?.whatsapp_number || "6282162319964",
    description: ambulance?.description || "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name || !formData.unit_code) {
      setErrorMsg("Nama unit dan kode unit wajib diisi.");
      return;
    }

    try {
      await onSave({
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal menyimpan data ambulans.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 my-8 relative z-50 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">
                {isEdit ? "edit_note" : "add_circle"}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isEdit ? "Edit Unit Ambulans" : "Tambah Unit Ambulans Baru"}
              </h3>
              <p className="text-xs text-slate-500">
                Armada Siaga Wilayah Palembang & Koridor Jembatan Ampera
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 pr-1 mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="cth. Ambulans Siaga 01"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kode Unit / Nomor Polisi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.unit_code}
                onChange={(e) => setFormData({ ...formData, unit_code: e.target.value })}
                placeholder="cth. AMB-016 (BG 1234 PZ)"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pangkalan / Rumah Sakit
              </label>
              <select
                value={formData.provider_id}
                onChange={(e) => setFormData({ ...formData, provider_id: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status Operasional
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="tersedia">Siaga / Tersedia (Hijau)</option>
                <option value="sedang_bertugas">Sedang Bertugas (Kuning)</option>
                <option value="offline">Offline / Perawatan (Abu-abu)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tipe Kendaraan
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value as any })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="standar">Standar Gawat Darurat</option>
                <option value="icu_mobile">ICU Mobile / Advance</option>
                <option value="transport">Transport Pasien Rutin</option>
              </select>
            </div>
            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.has_oxygen}
                  onChange={(e) => setFormData({ ...formData, has_oxygen: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-xs font-semibold text-slate-700">Tabung Oksigen</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.has_icu}
                  onChange={(e) => setFormData({ ...formData, has_icu: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span className="text-xs font-semibold text-slate-700">Ventilator / ICU</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Driver / Petugas
              </label>
              <input
                type="text"
                value={formData.driver_name}
                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                placeholder="cth. Rian Pratama"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Dispatch (Diawali 62)
              </label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="6282162319964"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Latitude GPS
              </label>
              <input
                type="number"
                step="0.00001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Longitude GPS
              </label>
              <input
                type="number"
                step="0.00001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Lokasi Standby / Pangkalan
            </label>
            <input
              type="text"
              value={formData.base_location}
              onChange={(e) => setFormData({ ...formData, base_location: e.target.value })}
              placeholder="cth. Posko IGD RS Charitas Jl. Sudirman"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Keterangan Tambahan
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Catatan unit atau kelengkapan medis..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>{isEdit ? "Simpan Perubahan" : "Tambah Armada"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
