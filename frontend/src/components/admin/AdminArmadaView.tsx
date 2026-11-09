"use client";

import React, { useState } from "react";
import { Ambulance, Provider } from "@/types";

interface AdminArmadaViewProps {
  ambulances: Ambulance[];
  providers: Provider[];
  onAddAmbulance: () => void;
  onEditAmbulance: (ambulance: Ambulance) => void;
  onDeleteAmbulance: (ambulance: Ambulance) => void;
  onStatusChange: (ambulance: Ambulance, newStatus: "tersedia" | "sedang_bertugas" | "offline") => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function AdminArmadaView({
  ambulances,
  providers,
  onAddAmbulance,
  onEditAmbulance,
  onDeleteAmbulance,
  onStatusChange,
  onRefresh,
  isLoading = false,
}: AdminArmadaViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const total = ambulances.length;
  const tersedia = ambulances.filter((a) => a.status === "tersedia").length;
  const bertugas = ambulances.filter((a) => a.status === "sedang_bertugas").length;
  const offline = ambulances.filter((a) => a.status === "offline").length;

  const handleCopy = (phone: string, id: number) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = ambulances.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.unit_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.driver_name && item.driver_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.provider?.name && item.provider.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesProvider =
      providerFilter === "all" || String(item.provider_id) === providerFilter;

    return matchesSearch && matchesStatus && matchesProvider;
  });

  return (
    <div className="space-y-6">
      {/* Header Section Utama */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Armada Ambulans</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola data armada ambulans operasional di wilayah Kota Palembang
          </p>
        </div>
        <div>
          <button
            onClick={onAddAmbulance}
            type="button"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all hover:shadow-md text-sm active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>+ Tambah Ambulans</span>
          </button>
        </div>
      </section>

      {/* KPI Status Mini Banners */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Unit Terdaftar</p>
            <p className="text-xl text-slate-900 mt-0.5 font-bold">{total} Unit</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 font-medium">Siaga / Tersedia</p>
            <p className="text-xl text-emerald-700 mt-0.5 font-bold">{tersedia} Siaga</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 font-medium">Sedang Bertugas</p>
            <p className="text-xl text-amber-700 mt-0.5 font-bold">{bertugas} Tanggap</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined">emergency</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pemeliharaan / Off</p>
            <p className="text-xl text-slate-600 mt-0.5 font-bold">{offline} Unit</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <span className="material-symbols-outlined">build</span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <section className="bg-white rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        {/* Sisi Kiri: Input Search */}
        <div className="relative w-full sm:w-[340px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, kode plat, driver..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          />
        </div>

        {/* Sisi Kanan: Dropdown Filter Status & Fasilitas RS */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter Status"
            className="flex-1 sm:flex-initial bg-white border border-slate-300 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="tersedia">Tersedia (Siaga)</option>
            <option value="sedang_bertugas">Sedang Bertugas</option>
            <option value="offline">Offline / Perawatan</option>
          </select>

          {/* Filter Fasilitas / Pangkalan RS */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            aria-label="Filter Pangkalan RS"
            className="flex-1 sm:flex-initial bg-white border border-slate-300 text-slate-800 text-xs font-semibold py-2 px-3 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer max-w-[200px]"
          >
            <option value="all">Semua Fasilitas RS/PMI</option>
            {providers.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Reset Filter Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 shrink-0"
            title="Muat ulang data tabel"
            type="button"
          >
            <span className={`material-symbols-outlined text-lg ${isLoading ? "animate-spin" : ""}`}>
              refresh
            </span>
          </button>
        </div>
      </section>

      {/* Kartu Tabel Data Ambulans */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* TAMPILAN MOBILE: KARTU INTERAKTIF (Khusus Layar HP < md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-400 p-4">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">search_off</span>
              <p className="text-xs">Tidak ada armada yang sesuai filter.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">
                        {item.has_icu ? "emergency" : "airport_shuttle"}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                        <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {item.vehicle_type === "icu_mobile"
                            ? "ICU"
                            : item.has_oxygen
                            ? "O2"
                            : "Standard"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{item.unit_code}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditAmbulance(item)}
                      className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                      title="Edit Armada"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteAmbulance(item)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Armada"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>

                {/* Status Selector & Provider Info */}
                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <div className="relative">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        onStatusChange(item, e.target.value as "tersedia" | "sedang_bertugas" | "offline")
                      }
                      aria-label={`Ubah status ${item.name}`}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer appearance-none pr-6 transition-all ${
                        item.status === "tersedia"
                          ? "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30"
                          : item.status === "sedang_bertugas"
                          ? "bg-[#FEF3C7] text-[#B45309] border-[#B45309]/30"
                          : "bg-[#F3F4F6] text-[#6B7280] border-slate-300"
                      }`}
                    >
                      <option value="tersedia">● Tersedia</option>
                      <option value="sedang_bertugas">● Bertugas</option>
                      <option value="offline">● Offline</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none text-current">
                      arrow_drop_down
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate max-w-[170px] text-right">
                    {item.provider?.name || item.base_location}
                  </p>
                </div>

                {/* Driver Contact & Location Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-slate-400">person</span>
                    <span className="text-slate-700 font-medium truncate max-w-[120px]">
                      {item.driver_name || "Petugas"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/${item.whatsapp_number}?text=Halo%20AmperaSiaga%20Palembang`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">chat</span>
                      <span>WA</span>
                    </a>
                    <button
                      onClick={() => handleCopy(item.driver_phone || item.whatsapp_number, item.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Salin Nomor"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copiedId === item.id ? "check" : "content_copy"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* TAMPILAN DESKTOP: TABEL (Khusus Layar Tablet / Desktop md ke atas) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3.5 px-6" scope="col">AMBULANS</th>
                <th className="py-3.5 px-6" scope="col">NOMOR KONTAK</th>
                <th className="py-3.5 px-6" scope="col">STATUS OPERASIONAL</th>
                <th className="py-3.5 px-6" scope="col">KOORDINAT TERAKHIR</th>
                <th className="py-3.5 px-6" scope="col">DIPERBARUI</th>
                <th className="py-3.5 px-6 text-right" scope="col">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">search_off</span>
                    <p>Tidak ada armada yang sesuai dengan pencarian atau filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Kolom 1: Ambulans */}
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-xl">
                            {item.has_icu ? "emergency" : "airport_shuttle"}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <span className="inline-block bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                              {item.vehicle_type === "icu_mobile"
                                ? "ICU Mobile"
                                : item.has_oxygen
                                ? "Standar + O2"
                                : "Transport"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.unit_code} • {item.provider?.name || item.base_location}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Driver: <span className="font-medium text-slate-600">{item.driver_name || "Petugas Jaga"}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Nomor Kontak */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-800">
                          {item.driver_phone || item.whatsapp_number}
                        </span>
                        <a
                          href={`https://wa.me/${item.whatsapp_number}?text=Halo%20AmperaSiaga%20Palembang,%20terkait%20kesiapsiagaan%20armada%20${item.unit_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-md transition-colors"
                          title="Hubungi WhatsApp Driver"
                        >
                          <span className="material-symbols-outlined text-base">chat</span>
                        </a>
                        <button
                          onClick={() => handleCopy(item.driver_phone || item.whatsapp_number, item.id)}
                          className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-md transition-colors cursor-pointer"
                          title="Salin Nomor Telepon"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">
                            {copiedId === item.id ? "check" : "content_copy"}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Kolom 3: Status Operasional (Dropdown interaktif) */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            onStatusChange(item, e.target.value as "tersedia" | "sedang_bertugas" | "offline")
                          }
                          aria-label={`Ubah status ${item.name}`}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer appearance-none pr-7 transition-all ${
                            item.status === "tersedia"
                              ? "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30 hover:bg-[#bbf7d0]"
                              : item.status === "sedang_bertugas"
                              ? "bg-[#FEF3C7] text-[#B45309] border-[#B45309]/30 hover:bg-[#fde68a]"
                              : "bg-[#F3F4F6] text-[#6B7280] border-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          <option value="tersedia">● Tersedia (Siaga)</option>
                          <option value="sedang_bertugas">● Sedang Bertugas</option>
                          <option value="offline">● Offline / Non-Aktif</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none text-current">
                          arrow_drop_down
                        </span>
                      </div>
                    </td>

                    {/* Kolom 4: Koordinat Terakhir */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div>
                        <span className="font-mono text-xs font-semibold text-slate-800">
                          {Number(item.latitude).toFixed(4)}, {Number(item.longitude).toFixed(4)}
                        </span>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-xs text-red-500">pin_drop</span>
                          <span className="truncate max-w-[150px]">{item.base_location || "Palembang Kota"}</span>
                        </p>
                      </div>
                    </td>

                    {/* Kolom 5: Diperbarui */}
                    <td className="py-4 px-6 whitespace-nowrap text-slate-500 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-slate-400">history</span>
                        Realtime
                      </span>
                    </td>

                    {/* Kolom 6: Aksi */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditAmbulance(item)}
                          className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                          title="Edit Armada"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteAmbulance(item)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Armada"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tabel Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <span>Kesiapsiagaan Posko: 100% Terintegrasi Command Center 112 Palembang</span>
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <span className="material-symbols-outlined text-sm text-blue-600">location_on</span>
            <span>Pangkalan Aktif: {providers.length} RS & Fasilitas Kesehatan Palembang</span>
          </div>
        </div>
      </section>
    </div>
  );
}
