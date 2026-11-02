"use client";

import React, { useState, useEffect } from "react";
import { Ambulance } from "@/types";

export interface EmergencyRequestItem {
  id: number;
  time: string;
  timestamp: string;
  rawDate?: string;
  callerName: string;
  callerPhone: string;
  pickupLocation: string;
  coordinates: string;
  assignedAmbulance: Ambulance;
  distanceKm: number;
  etaMinutes: number;
  status: "menunggu" | "dihubungi" | "ditangani" | "selesai" | "dibatalkan";
  notes: string;
  adminNote?: string;
  timeline: { time: string; text: string; user: string }[];
}

interface AdminDetailPermintaanDrawerProps {
  request: EmergencyRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    requestId: number,
    newStatus: EmergencyRequestItem["status"],
    note: string,
    reassignedAmbulanceId?: number
  ) => void;
  ambulances?: Ambulance[];
}

export default function AdminDetailPermintaanDrawer({
  request,
  isOpen,
  onClose,
  onUpdateStatus,
  ambulances = [],
}: AdminDetailPermintaanDrawerProps) {
  const [currentStatus, setCurrentStatus] = useState<EmergencyRequestItem["status"]>(
    request?.status || "menunggu"
  );
  const [adminNote, setAdminNote] = useState(request?.adminNote || "");
  const [assignedAmbulanceId, setAssignedAmbulanceId] = useState<number>(
    request?.assignedAmbulance?.id || 1
  );
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);

  // Sync state whenever selected request changes
  useEffect(() => {
    if (request) {
      setCurrentStatus(request.status);
      setAdminNote(request.adminNote || "");
      setAssignedAmbulanceId(request.assignedAmbulance?.id || 1);
      setIsReassigning(false);
    }
  }, [request]);

  if (!isOpen || !request) return null;

  // Active ambulance (effective if reassigned or fallback to original)
  const effectiveAmbulance =
    ambulances.find((a) => a.id === assignedAmbulanceId) || request.assignedAmbulance;

  const handleCopyPhone = () => {
    if (request?.callerPhone) {
      navigator.clipboard.writeText(request.callerPhone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleSaveStatus = () => {
    setIsUpdating(true);
    setTimeout(() => {
      onUpdateStatus(
        request.id,
        currentStatus,
        adminNote,
        assignedAmbulanceId !== request.assignedAmbulance?.id ? assignedAmbulanceId : undefined
      );
      setIsUpdating(false);
    }, 250);
  };

  const handleQuickStatusTransition = (
    nextStatus: EmergencyRequestItem["status"],
    defaultNote: string
  ) => {
    setCurrentStatus(nextStatus);
    const updatedNote = adminNote.trim()
      ? `${adminNote} [${defaultNote}]`
      : defaultNote;
    setAdminNote(updatedNote);

    setIsUpdating(true);
    setTimeout(() => {
      onUpdateStatus(
        request.id,
        nextStatus,
        updatedNote,
        assignedAmbulanceId !== request.assignedAmbulance?.id ? assignedAmbulanceId : undefined
      );
      setIsUpdating(false);
    }, 250);
  };

  const getStatusBadge = (status: EmergencyRequestItem["status"]) => {
    switch (status) {
      case "menunggu":
        return {
          bg: "bg-[#FEF3C7] text-[#B45309] border-amber-300",
          dot: "bg-[#F59E0B]",
          label: "Menunggu Konfirmasi",
        };
      case "dihubungi":
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-300",
          dot: "bg-blue-600",
          label: "Dihubungi (Verifikasi)",
        };
      case "ditangani":
        return {
          bg: "bg-purple-100 text-purple-800 border-purple-300",
          dot: "bg-purple-600",
          label: "Ditangani (Meluncur)",
        };
      case "selesai":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-600",
          label: "Selesai (Tiba di RS)",
        };
      case "dibatalkan":
      default:
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-300",
          dot: "bg-slate-400",
          label: "Dibatalkan",
        };
    }
  };

  const badge = getStatusBadge(currentStatus);

  return (
    <>
      {/* OVERLAY / BACKDROP */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 transition-opacity duration-300 animate-in fade-in"
      />

      {/* SLIDING DRAWER */}
      <aside className="fixed top-0 right-0 w-full sm:w-[500px] h-full bg-white z-50 shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
        {/* HEADER DRAWER */}
        <header className="p-5 border-b border-[#E2E8F0] bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
                #
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Permintaan #{request.id}
              </h2>
              {/* Dynamic Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${badge.dot} animate-ping`}></span>
                {badge.label}
              </span>
            </div>

            {/* Tombol Tutup [X] */}
            <button
              onClick={onClose}
              aria-label="Tutup Drawer"
              className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Waktu Masuk Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="material-symbols-outlined text-[16px] text-amber-600">
              schedule
            </span>
            <span>
              Masuk:{" "}
              <strong className="text-slate-800 font-semibold">
                {request.timestamp}
              </strong>{" "}
              ({request.time})
            </span>
          </div>
        </header>

        {/* DRAWER SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* QUICK ACTION DISPATCH WORKFLOW STRIP */}
          <section className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-blue-400">bolt</span>
                Aksi Cepat Dispatcher:
              </span>
              <span className="text-[11px] text-slate-400">Langkah Operasional</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {currentStatus === "menunggu" && (
                <button
                  type="button"
                  onClick={() =>
                    handleQuickStatusTransition(
                      "dihubungi",
                      "Kontak pelapor telah diverifikasi oleh operator posko."
                    )
                  }
                  className="col-span-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>1. Verifikasi Telepon (Ubah ke DIHUBUNGI)</span>
                </button>
              )}

              {currentStatus === "dihubungi" && (
                <button
                  type="button"
                  onClick={() =>
                    handleQuickStatusTransition(
                      "ditangani",
                      `Armada ${effectiveAmbulance?.unit_code || "ambulans"} diperintahkan meluncur ke lokasi.`
                    )
                  }
                  className="col-span-2 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-base">emergency</span>
                  <span>2. Tugaskan Armada Meluncur (DITANGANI)</span>
                </button>
              )}

              {currentStatus === "ditangani" && (
                <button
                  type="button"
                  onClick={() =>
                    handleQuickStatusTransition(
                      "selesai",
                      "Pasien berhasil dievakuasi dan diserahterimakan di faskes tujuan."
                    )
                  }
                  className="col-span-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  <span>3. Selesai (Pasien Tiba di Rumah Sakit)</span>
                </button>
              )}

              {currentStatus !== "dibatalkan" && currentStatus !== "selesai" && (
                <button
                  type="button"
                  onClick={() =>
                    handleQuickStatusTransition(
                      "dibatalkan",
                      "Panggilan dibatalkan atas konfirmasi pemohon / kondisi terkendali."
                    )
                  }
                  className="py-1.5 px-3 bg-slate-800 hover:bg-red-950 text-red-400 border border-red-500/30 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  <span>Batalkan</span>
                </button>
              )}

              {currentStatus === "selesai" && (
                <div className="col-span-2 py-2 px-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                  <span>Permintaan ini telah selesai ditangani.</span>
                </div>
              )}
            </div>
          </section>

          {/* BAGIAN 1: Data Pengguna & Pemohon */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[20px]">
                  person_pin
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Data Pengguna &amp; Pemohon
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="material-symbols-outlined text-[13px]">verified</span> GPS Akurat
              </span>
            </div>

            {/* Detail Nama & Kontak */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Nama Pemanggil</span>
                <span className="font-bold text-slate-900 text-base">{request.callerName}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Nomor Telepon</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-bold text-slate-900">{request.callerPhone}</span>
                  <button
                    onClick={handleCopyPhone}
                    className="text-slate-400 hover:text-blue-700 p-1 rounded-md transition-colors cursor-pointer"
                    title="Salin Nomor"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedPhone ? "check" : "content_copy"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tombol WhatsApp Pengguna */}
            {request.callerPhone && request.callerPhone !== "-" ? (
              <a
                href={`https://wa.me/${request.callerPhone.replace(/[^0-9]/g, "").replace(/^0/, "62")}?text=Halo%20${encodeURIComponent(request.callerName)}%2C%20kami%20dari%20Command%20Center%20AmperaSiaga%20Palembang%20mengenai%20permintaan%20ambulans%20Tiket%20%23AMP-${request.id}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-[#0F7B6C] hover:bg-[#0B5E53] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Chat WhatsApp Pengguna</span>
              </a>
            ) : (
              <div className="w-full h-11 bg-slate-100 text-slate-400 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200">
                <span className="material-symbols-outlined text-sm">phone_disabled</span>
                <span>Nomor telepon pelapor tidak tercantum</span>
              </div>
            )}

            {/* Lokasi Jemput */}
            <div className="pt-2 border-t border-slate-100 text-sm">
              <span className="text-xs text-slate-400 block mb-1 font-medium">Titik Jemput Pasien:</span>
              <p className="text-slate-900 font-semibold leading-snug">
                {request.pickupLocation}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-mono">
                <span className="material-symbols-outlined text-[15px] text-blue-700">
                  my_location
                </span>
                <span>Koordinat: {request.coordinates}</span>
              </div>
            </div>

            {/* Mini-peta Palembang Route Graphic */}
            <div className="w-full h-[140px] rounded-xl overflow-hidden relative border border-slate-200 bg-slate-950 shadow-inner flex flex-col justify-between p-3">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path d="M 30 110 Q 180 30 400 80" fill="none" stroke="#38BDF8" strokeWidth="6" strokeDasharray="6 4" />
              </svg>

              {/* Marker Ambulans */}
              <div className="relative z-10 self-start inline-flex items-center gap-1.5 bg-white/95 px-2.5 py-1 rounded-full shadow-md border border-emerald-500 text-[11px] font-bold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="material-symbols-outlined text-emerald-600 text-[14px]">local_hospital</span>
                <span>{effectiveAmbulance?.unit_code || "AMB"}</span>
              </div>

              {/* Trajectory Distance Indicator */}
              <div className="relative z-10 self-center px-2.5 py-0.5 bg-blue-900/90 text-white rounded-full text-[11px] font-bold border border-blue-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">navigation</span>
                <span>{request.distanceKm || 2.5} km • {request.etaMinutes || 8} mnt</span>
              </div>

              {/* Marker Pasien */}
              <div className="relative z-10 self-end inline-flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full shadow-md text-[11px] font-bold border border-white">
                <span className="material-symbols-outlined text-[14px]">person_pin_circle</span>
                <span>Titik Jemput: {request.callerName}</span>
              </div>
            </div>
          </section>

          {/* BAGIAN 2: Ambulans Dialokasikan & Fitur Alihkan Unit */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                  airport_shuttle
                </span>
                <h3 className="text-sm font-bold text-slate-900">Ambulans Dialokasikan</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReassigning(!isReassigning)}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
                <span>{isReassigning ? "Selesai" : "Alihkan Unit"}</span>
              </button>
            </div>

            {/* Reassign Dropdown (if toggled) */}
            {isReassigning && ambulances.length > 0 && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 animate-fade-in">
                <label className="block text-xs font-bold text-blue-900">
                  Pilih Unit Ambulans Pengganti:
                </label>
                <select
                  value={assignedAmbulanceId}
                  onChange={(e) => setAssignedAmbulanceId(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  {ambulances.map((amb) => (
                    <option key={amb.id} value={amb.id}>
                      [{amb.unit_code}] {amb.name} • {amb.provider?.name || amb.base_location} ({amb.status.toUpperCase()})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-blue-700 leading-tight">
                  Unit yang dipilih akan otomatis diperbarui dan disinkronkan ke laporan tiket ini.
                </p>
              </div>
            )}

            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {effectiveAmbulance?.name || "Unit Ambulans"} • Unit {effectiveAmbulance?.unit_code || "-"}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  {effectiveAmbulance?.provider?.name || effectiveAmbulance?.base_location || "Posko Siaga Palembang"}
                </div>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-slate-400">person</span>
                  Driver: {effectiveAmbulance?.driver_name || "Petugas Dispatcher"}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Estimasi Tiba (ETA)</span>
                <span className="text-xl font-extrabold text-blue-700">
                  {request.etaMinutes || 8} Menit
                </span>
                <span className="text-xs text-slate-500 block font-semibold">
                  Jarak {request.distanceKm || 2.5} km
                </span>
              </div>
            </div>

            {/* Capability Badges */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                {effectiveAmbulance?.vehicle_type === "icu_mobile" ? "ICU Portable Advance" : "Standar Gawat Darurat"}
              </span>
              {effectiveAmbulance?.has_oxygen && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                  Tabung O2 Aktif
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                Paramedis Siaga (2 Orang)
              </span>
            </div>
          </section>

          {/* BAGIAN 3: Keterangan & Kondisi Pasien */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-[20px]">
                description
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Keterangan &amp; Kondisi Pasien
              </h3>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-body-md italic">
              &quot;{request.notes}&quot;
            </div>
          </section>

          {/* BAGIAN 4: Formulir Catatan & Status Manual */}
          <section className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-sm space-y-4 bg-gradient-to-b from-blue-50/30 to-white">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-700 text-[20px]">
                  edit_note
                </span>
                <h3 className="text-sm font-bold text-blue-800">
                  Formulir Status &amp; Catatan Dispatch
                </h3>
              </div>
              <span className="text-[11px] text-blue-600 font-semibold">Tindakan Petugas</span>
            </div>

            {/* Dropdown Status */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Pilih Status Operasional:
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as any)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-sm font-bold bg-white text-slate-800 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-xs cursor-pointer"
              >
                <option value="menunggu">● Menunggu Konfirmasi</option>
                <option value="dihubungi">● Dihubungi (Verifikasi Pelapor)</option>
                <option value="ditangani">● Ditangani (Unit Meluncur ke Lokasi)</option>
                <option value="selesai">● Selesai (Pasien Tiba di Rumah Sakit)</option>
                <option value="dibatalkan">● Dibatalkan</option>
              </select>
            </div>

            {/* Textarea Catatan Petugas */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Catatan Petugas Dispatcher:
              </label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Tuliskan catatan verifikasi, nomor plat pendamping, hambatan rute, atau RS rujukan..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white"
              />
            </div>

            {/* Tombol Simpan Perubahan */}
            <button
              onClick={handleSaveStatus}
              disabled={isUpdating}
              className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </section>

          {/* BAGIAN 5: Riwayat Status (Timeline) */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[20px]">
                  timeline
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Riwayat Log Status
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {request.timeline.length} Aktivitas
              </span>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {request.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-200"></div>
                  <div className="flex items-baseline justify-between mb-0.5">
                    <span className="text-xs text-blue-700 font-bold">{item.time}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                      {item.user}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
