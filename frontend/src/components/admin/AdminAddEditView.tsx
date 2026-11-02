"use client";

import React, { useState } from "react";
import { Ambulance, Provider } from "@/types";

interface AdminAddEditViewProps {
  ambulance?: Ambulance | null;
  providers: Provider[];
  isSaving: boolean;
  onCancel: () => void;
  onSave: (data: Partial<Ambulance>) => Promise<void>;
}

export default function AdminAddEditView({
  ambulance,
  providers,
  isSaving,
  onCancel,
  onSave,
}: AdminAddEditViewProps) {
  const isEdit = Boolean(ambulance);

  const [namaAmbulans, setNamaAmbulans] = useState(ambulance?.name || "");
  const [nomorUnit, setNomorUnit] = useState(ambulance?.unit_code || "");
  const [nopol, setNopol] = useState(ambulance?.unit_code || "");
  const [telepon, setTelepon] = useState(ambulance?.driver_phone || "");
  const [whatsapp, setWhatsapp] = useState(ambulance?.whatsapp_number || "6282162319964");
  const [status, setStatus] = useState<"tersedia" | "sedang_bertugas" | "offline">(
    ambulance?.status || "tersedia"
  );
  const [tipeLayanan, setTipeLayanan] = useState<"advance" | "transport" | "neonatal">(
    ambulance?.vehicle_type === "icu_mobile"
      ? "advance"
      : ambulance?.vehicle_type === "transport"
      ? "transport"
      : "advance"
  );
  const [deskripsi, setDeskripsi] = useState(ambulance?.description || "");

  const [lat, setLat] = useState<string>(
    ambulance?.latitude ? String(ambulance.latitude) : "-2.9760"
  );
  const [lng, setLng] = useState<string>(
    ambulance?.longitude ? String(ambulance.longitude) : "104.7564"
  );

  const [providerId, setProviderId] = useState<number>(
    ambulance?.provider_id || providers[0]?.id || 1
  );
  const [hasOxygen, setHasOxygen] = useState<boolean>(ambulance?.has_oxygen ?? true);
  const [hasIcu, setHasIcu] = useState<boolean>(ambulance?.has_icu ?? false);
  const [hasDefibrillator, setHasDefibrillator] = useState<boolean>(true);
  const [hasStretcher, setHasStretcher] = useState<boolean>(true);

  const [driverName, setDriverName] = useState(ambulance?.driver_name || "");
  const [baseLocation, setBaseLocation] = useState(
    ambulance?.base_location || providers[0]?.name || "Palembang"
  );

  // Sync state whenever ambulance prop changes (switching between Edit and Add mode)
  React.useEffect(() => {
    if (ambulance) {
      setNamaAmbulans(ambulance.name);
      setNomorUnit(ambulance.unit_code);
      setNopol(ambulance.unit_code);
      setTelepon(ambulance.driver_phone || ambulance.whatsapp_number || "");
      setWhatsapp(ambulance.whatsapp_number || "6282162319964");
      setStatus(ambulance.status || "tersedia");
      setTipeLayanan(
        ambulance.vehicle_type === "icu_mobile"
          ? "advance"
          : ambulance.vehicle_type === "transport"
          ? "transport"
          : "advance"
      );
      setDeskripsi(ambulance.description || "");
      setLat(ambulance.latitude ? String(ambulance.latitude) : "-2.9760");
      setLng(ambulance.longitude ? String(ambulance.longitude) : "104.7564");
      setProviderId(ambulance.provider_id || providers[0]?.id || 1);
      setHasOxygen(ambulance.has_oxygen ?? true);
      setHasIcu(ambulance.has_icu ?? false);
      setDriverName(ambulance.driver_name || "");
      setBaseLocation(ambulance.base_location || "");
    } else {
      setNamaAmbulans("");
      setNomorUnit("");
      setNopol("");
      setTelepon("");
      setWhatsapp("6282162319964");
      setStatus("tersedia");
      setTipeLayanan("advance");
      setDeskripsi("");
      setLat("-2.9760");
      setLng("104.7564");
      setProviderId(providers[0]?.id || 1);
      setHasOxygen(true);
      setHasIcu(false);
      setDriverName("");
      setBaseLocation(providers[0]?.name || "Palembang");
    }
  }, [ambulance, providers]);

  // Validation
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const isLatInvalid = isNaN(latNum) || latNum < -90 || latNum > 90;
  const isLngInvalid = isNaN(lngNum) || lngNum < -180 || lngNum > 180;

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isLatInvalid) {
      setErrorMsg("Latitude harus berupa angka antara -90 dan 90.");
      return;
    }
    if (isLngInvalid) {
      setErrorMsg("Longitude harus berupa angka antara -180 dan 180.");
      return;
    }
    if (!namaAmbulans.trim() || !nomorUnit.trim()) {
      setErrorMsg("Nama ambulans dan nomor unit wajib diisi.");
      return;
    }

    const calculatedVehicleType =
      tipeLayanan === "advance"
        ? "icu_mobile"
        : tipeLayanan === "transport"
        ? "transport"
        : "standar";

    try {
      await onSave({
        name: namaAmbulans.trim(),
        unit_code: nomorUnit.trim().toUpperCase(),
        provider_id: providerId,
        status,
        vehicle_type: calculatedVehicleType,
        has_oxygen: hasOxygen,
        has_icu: hasIcu || tipeLayanan === "advance",
        latitude: latNum,
        longitude: lngNum,
        base_location: baseLocation.trim() || "Palembang",
        driver_name: driverName.trim() || null,
        driver_phone: telepon.trim() || null,
        whatsapp_number: whatsapp.trim() || "6282162319964",
        description: deskripsi.trim() || null,
      });
    } catch (err: any) {
      setErrorMsg(err?.message || "Gagal menyimpan data armada");
    }
  };

  const selectedProvider = providers.find((p) => p.id === providerId) || providers[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-16">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={onCancel} className="hover:text-blue-700 transition-colors">
          Sistem
        </button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <button onClick={onCancel} className="hover:text-blue-700 transition-colors">
          Manajemen Armada
        </button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-900 font-bold">
          {isEdit ? "Edit Data Unit Ambulans" : "Tambah Unit Ambulans Baru"}
        </span>
      </nav>

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isEdit ? "Edit Ambulans" : "Tambah Ambulans"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {isEdit ? "Mode Pembaruan Unit" : "Mode Pendaftaran Unit"}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Masukkan data spesifikasi teknis dan lokasi pangkalan armada ambulans di wilayah Kota Palembang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Kembali ke Tabel</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* 2-COLUMN BALANCED WORKSPACE (Sesuai Layar A5) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Form Spesifikasi & Koordinat (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: Identitas & Operasional Armada */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </span>
                <h2 className="text-base font-bold text-slate-900">Spesifikasi Armada</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                * Wajib diisi untuk kesiapan dispatch
              </span>
            </div>

            {/* Field: Nama Ambulans */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="nama_ambulans">
                Nama Ambulans <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="nama_ambulans"
                  type="text"
                  required
                  value={namaAmbulans}
                  onChange={(e) => setNamaAmbulans(e.target.value)}
                  placeholder="Contoh: Ambulans E (RS Bhayangkara)"
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition"
                />
                <span className="absolute right-3.5 top-3 material-symbols-outlined text-slate-400 text-[20px]">
                  directions_car
                </span>
              </div>
            </div>

            {/* Row: Nomor Unit & Nomor Polisi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800" htmlFor="nomor_unit">
                  Nomor Unit <span className="text-red-500">*</span>
                </label>
                <input
                  id="nomor_unit"
                  type="text"
                  required
                  value={nomorUnit}
                  onChange={(e) => setNomorUnit(e.target.value)}
                  placeholder="AMB-005"
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 text-sm text-slate-900 font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800" htmlFor="nopol">
                  Nomor Polisi (Plat BG) <span className="text-red-500">*</span>
                </label>
                <input
                  id="nopol"
                  type="text"
                  required
                  value={nopol}
                  onChange={(e) => setNopol(e.target.value.toUpperCase())}
                  placeholder="BG 1988 PZ"
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 text-sm text-slate-900 uppercase tracking-wider font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition"
                />
              </div>
            </div>

            {/* Row: Nomor Telepon Driver & Status Operasional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800" htmlFor="telepon">
                  Nomor Telepon Hotline Driver <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="telepon"
                    type="tel"
                    required
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="0812-3456-0005"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition font-mono"
                  />
                  <span className="absolute right-3.5 top-3 material-symbols-outlined text-slate-400 text-[20px]">
                    call
                  </span>
                </div>
              </div>

              {/* Status Operasional Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800" htmlFor="status">
                  Status Operasional
                </label>
                <div className="relative">
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-11 pl-9 pr-8 rounded-xl border border-slate-300 text-sm font-semibold bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none appearance-none cursor-pointer"
                  >
                    <option value="tersedia">Tersedia (Siaga)</option>
                    <option value="sedang_bertugas">Sedang Bertugas</option>
                    <option value="offline">Offline / Perawatan</option>
                  </select>
                  {/* Indikator Dot */}
                  <span
                    className={`absolute left-3.5 top-4 w-2.5 h-2.5 rounded-full ${
                      status === "tersedia"
                        ? "bg-[#10B981] ring-2 ring-emerald-200"
                        : status === "sedang_bertugas"
                        ? "bg-[#F59E0B] ring-2 ring-amber-200"
                        : "bg-slate-400 ring-2 ring-slate-200"
                    }`}
                  />
                  <span className="absolute right-3 top-3 material-symbols-outlined text-slate-400 pointer-events-none text-xl">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Field: Tipe Layanan (Chips/Radios) */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-800">
                Tipe Layanan Medis
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Option 1: Advance */}
                <label
                  onClick={() => setTipeLayanan("advance")}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition select-none ${
                    tipeLayanan === "advance"
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipe_layanan"
                    checked={tipeLayanan === "advance"}
                    onChange={() => setTipeLayanan("advance")}
                    className="text-blue-600 focus:ring-blue-600 h-4 w-4"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Gawat Darurat Advance</span>
                    <span className="text-[11px] text-slate-500">ICU &amp; Tim Paramedis</span>
                  </div>
                </label>

                {/* Option 2: Transport */}
                <label
                  onClick={() => setTipeLayanan("transport")}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition select-none ${
                    tipeLayanan === "transport"
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipe_layanan"
                    checked={tipeLayanan === "transport"}
                    onChange={() => setTipeLayanan("transport")}
                    className="text-blue-600 focus:ring-blue-600 h-4 w-4"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Transport Medis</span>
                    <span className="text-[11px] text-slate-500">Rujukan Antar-RS</span>
                  </div>
                </label>

                {/* Option 3: Neonatal */}
                <label
                  onClick={() => setTipeLayanan("neonatal")}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition select-none ${
                    tipeLayanan === "neonatal"
                      ? "border-blue-600 bg-blue-50/50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipe_layanan"
                    checked={tipeLayanan === "neonatal"}
                    onChange={() => setTipeLayanan("neonatal")}
                    className="text-blue-600 focus:ring-blue-600 h-4 w-4"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">Neonatal NICU</span>
                    <span className="text-[11px] text-slate-500">Inkubator Bayi</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Field: Deskripsi & Kelengkapan */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-800" htmlFor="deskripsi">
                Deskripsi &amp; Kelengkapan Medis
              </label>
              <textarea
                id="deskripsi"
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Catatan unit operasional, kelengkapan obat atau alat medis khusus..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition"
              />
            </div>
          </div>

          {/* SECTION 2: Bagian Koordinat GPS & Validasi Error Alert */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                </span>
                <h3 className="text-base font-bold text-slate-900">Titik Koordinat Pangkalan</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">WGS-84 Format (Palembang)</span>
            </div>

            {/* Dual Inputs: Latitude & Longitude */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Latitude */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    className={`text-xs font-bold ${isLatInvalid ? "text-red-600" : "text-slate-800"}`}
                    htmlFor="lat"
                  >
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Batas: -90 s/d 90</span>
                </div>
                <div className="relative">
                  <input
                    id="lat"
                    type="text"
                    required
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className={`w-full h-11 px-4 rounded-xl border text-sm font-mono font-bold outline-none transition ${
                      isLatInvalid
                        ? "border-red-500 bg-red-50/40 text-red-700"
                        : "border-slate-300 text-slate-900 focus:border-blue-600"
                    }`}
                  />
                  {isLatInvalid && (
                    <span className="absolute right-3.5 top-3 material-symbols-outlined text-red-500 text-[20px]">
                      error
                    </span>
                  )}
                </div>
                {isLatInvalid && (
                  <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>Latitude harus berupa angka antara -90 dan 90.</span>
                  </div>
                )}
              </div>

              {/* Longitude */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    className={`text-xs font-bold ${isLngInvalid ? "text-red-600" : "text-slate-800"}`}
                    htmlFor="lng"
                  >
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Batas: -180 s/d 180</span>
                </div>
                <div className="relative">
                  <input
                    id="lng"
                    type="text"
                    required
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className={`w-full h-11 px-4 rounded-xl border text-sm font-mono font-bold outline-none transition ${
                      isLngInvalid
                        ? "border-red-500 bg-red-50/40 text-red-700"
                        : "border-slate-300 text-slate-900 focus:border-blue-600"
                    }`}
                  />
                  {isLngInvalid && (
                    <span className="absolute right-3.5 top-3 material-symbols-outlined text-red-500 text-[20px]">
                      error
                    </span>
                  )}
                </div>
                {isLngInvalid && (
                  <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>Longitude harus berupa angka antara -180 dan 180.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Coordinate Buttons for Palembang */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Isi cepat koordinat RS:</span>
              <button
                type="button"
                onClick={() => {
                  setLat("-2.9764");
                  setLng("104.7534");
                  setBaseLocation("RS Charitas Palembang");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                RS Charitas
              </button>
              <button
                type="button"
                onClick={() => {
                  setLat("-2.9685");
                  setLng("104.7483");
                  setBaseLocation("RSUP Dr. Mohammad Hoesin");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                RSUP Dr. M. Hoesin
              </button>
              <button
                type="button"
                onClick={() => {
                  setLat("-2.9580");
                  setLng("104.7220");
                  setBaseLocation("PMI Kota Palembang");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                PMI Palembang
              </button>
              <button
                type="button"
                onClick={() => {
                  setLat("-3.0100");
                  setLng("104.7700");
                  setBaseLocation("RSUD Palembang BARI");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                RSUD BARI
              </button>
              <button
                type="button"
                onClick={() => {
                  setLat("-2.9480");
                  setLng("104.7351");
                  setBaseLocation("RSUD Siti Fatimah");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                RSUD Siti Fatimah
              </button>
              <button
                type="button"
                onClick={() => {
                  setLat("-2.9713");
                  setLng("104.7307");
                  setBaseLocation("RS Islam Siti Khadijah");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                RSI Siti Khadijah
              </button>
              <button
                type="button"
                onClick={() => {
                  setLat("-2.9928");
                  setLng("104.8167");
                  setBaseLocation("RS Pertamina Plaju");
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                RS Pertamina Plaju
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pangkalan & Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pangkalan RS / Provider Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700">local_hospital</span>
                <h3 className="text-sm font-bold text-slate-900">Pangkalan Rumah Sakit / Instansi</h3>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="provider_select">
                Pilih Fasilitas Kesehatan
              </label>
              <select
                id="provider_select"
                value={providerId}
                onChange={(e) => setProviderId(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 cursor-pointer"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="base_location">
                Alamat Pos Siaga / Pangkalan
              </label>
              <input
                id="base_location"
                type="text"
                value={baseLocation}
                onChange={(e) => setBaseLocation(e.target.value)}
                placeholder="cth. Posko IGD RS Charitas Jl. Sudirman"
                className="w-full h-11 px-4 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="driver_name">
                Nama Driver / Paramedis Siaga
              </label>
              <input
                id="driver_name"
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Rian Pratama"
                className="w-full h-11 px-4 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="whatsapp">
                Nomor WhatsApp Dispatch (Diawali 62)
              </label>
              <input
                id="whatsapp"
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="6282162319964"
                className="w-full h-11 px-4 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 outline-none font-mono"
              />
            </div>
          </div>

          {/* Kelengkapan Medis Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Kelengkapan Medis Terverifikasi
            </h3>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={hasOxygen}
                  onChange={(e) => setHasOxygen(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-600 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Tabung Oksigen Siaga (O2 Medis)
                </span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={hasIcu}
                  onChange={(e) => setHasIcu(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-600 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Ventilator Portable / ICU Monitoring
                </span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={hasDefibrillator}
                  onChange={(e) => setHasDefibrillator(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-600 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Defibrillator Portabel AED
                </span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition">
                <input
                  type="checkbox"
                  checked={hasStretcher}
                  onChange={(e) => setHasStretcher(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-600 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Tandu Lipat Stretcher &amp; Spine Board
                </span>
              </label>
            </div>
          </div>

          {/* Action Submission Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Menyimpan ke Server...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>{isEdit ? "Simpan Perubahan Unit" : "Simpan Data Armada"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="w-full h-11 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center transition active:scale-[0.98] cursor-pointer"
            >
              Batal &amp; Kembali
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
