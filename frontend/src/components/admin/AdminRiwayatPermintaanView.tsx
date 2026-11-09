"use client";

import React, { useState } from "react";
import { EmergencyRequestItem } from "./AdminDetailPermintaanDrawer";

interface AdminRiwayatPermintaanViewProps {
  requests: EmergencyRequestItem[];
  onSelectRequest: (request: EmergencyRequestItem) => void;
  onRefresh: () => void;
}

export default function AdminRiwayatPermintaanView({
  requests,
  onSelectRequest,
  onRefresh,
}: AdminRiwayatPermintaanViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("semua");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const filteredRequests = requests.filter((item) => {
    const matchesStatus = filterStatus === "semua" || item.status === filterStatus;
    const matchesKeyword =
      !searchKeyword ||
      (item.callerName && item.callerName.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (item.callerPhone && item.callerPhone.includes(searchKeyword)) ||
      (item.pickupLocation && item.pickupLocation.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (item.assignedAmbulance?.name && item.assignedAmbulance.name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (item.assignedAmbulance?.unit_code && item.assignedAmbulance.unit_code.toLowerCase().includes(searchKeyword.toLowerCase()));

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const itemDateStr = item.rawDate;
      if (itemDateStr) {
        const itemD = new Date(itemDateStr);
        if (!isNaN(itemD.getTime())) {
          if (dateFrom) {
            const fromD = new Date(dateFrom);
            fromD.setHours(0, 0, 0, 0);
            if (itemD < fromD) matchesDate = false;
          }
          if (dateTo) {
            const toD = new Date(dateTo);
            toD.setHours(23, 59, 59, 999);
            if (itemD > toD) matchesDate = false;
          }
        }
      }
    }

    return matchesStatus && Boolean(matchesKeyword) && matchesDate;
  });

  const getStatusBadge = (status: EmergencyRequestItem["status"]) => {
    switch (status) {
      case "menunggu":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          dot: "bg-amber-500",
          label: "Menunggu",
        };
      case "dihubungi":
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-300",
          dot: "bg-blue-600",
          label: "Dihubungi",
        };
      case "ditangani":
        return {
          bg: "bg-purple-100 text-purple-800 border-purple-300",
          dot: "bg-purple-600",
          label: "Ditangani",
        };
      case "selesai":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-600",
          label: "Selesai",
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

  const exportCSV = () => {
    const headers = ["ID", "Waktu", "Nama Pemohon", "Telepon", "Lokasi", "Ambulans", "Jarak (km)", "ETA", "Status"];
    const rows = filteredRequests.map((r) => [
      `#${r.id}`,
      r.timestamp,
      `"${r.callerName || 'Warga'}"`,
      r.callerPhone || '-',
      `"${r.pickupLocation || '-'}"`,
      `"${r.assignedAmbulance?.name || 'Unit Ambulans'} (${r.assignedAmbulance?.unit_code || '-'})"`,
      r.distanceKm || 0,
      `${r.etaMinutes || 0} menit`,
      r.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `riwayat_permintaan_amperasiaga_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Headline & Intro Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-1">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Riwayat Permintaan Ambulans
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Pantau seluruh log permohonan penjemputan medis darurat yang masuk melalui portal AmperaSiaga.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sistem Terhubung Real-Time</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR (Sesuai Layar A6) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <form
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Dropdown Status */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700" htmlFor="filter-status">
              Status Permintaan
            </label>
            <div className="relative">
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-11 bg-white border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl px-3.5 pr-8 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all appearance-none cursor-pointer"
              >
                <option value="semua">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="dihubungi">Dihubungi</option>
                <option value="ditangani">Ditangani</option>
                <option value="selesai">Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none text-xl">
                expand_more
              </span>
            </div>
          </div>

          {/* Date Range: Dari & Sampai */}
          <div className="md:col-span-4 flex items-center gap-2">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="date-from">
                Dari Tanggal
              </label>
              <input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-11 bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-medium rounded-xl px-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            <span className="text-slate-400 pt-5 text-sm font-bold">-</span>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700" htmlFor="date-to">
                Sampai Tanggal
              </label>
              <input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-11 bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-medium rounded-xl px-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          {/* Search Input */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700" htmlFor="search-keyword">
              Pencarian Cepat
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">
                search
              </span>
              <input
                id="search-keyword"
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari nama, telepon, RS..."
                className="w-full h-11 pl-9 pr-3 bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 text-sm font-medium rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onRefresh}
              className="h-11 w-11 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center transition duration-150 active:scale-95 shrink-0 cursor-pointer"
              title="Reset / Muat Ulang"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
            <button
              type="button"
              onClick={exportCSV}
              className="h-11 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center gap-1.5 transition duration-150 active:scale-95 shrink-0 text-xs font-semibold cursor-pointer"
              title="Unduh Data CSV"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>CSV</span>
            </button>
          </div>
        </form>
      </section>

      {/* TABLE DATA RIWAYAT PERMINTAAN */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        {/* TAMPILAN MOBILE: KARTU PERMINTAAN (Khusus Layar HP < md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-400 p-4">
              <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">
                folder_open
              </span>
              <p className="text-xs">Tidak ada riwayat permintaan yang sesuai filter.</p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const statusInfo = getStatusBadge(req.status);
              return (
                <div
                  key={req.id}
                  onClick={() => onSelectRequest(req)}
                  className="p-4 space-y-2.5 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-blue-700">#{req.id}</span>
                      <span>•</span>
                      <span>{req.callerName}</span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-sm text-red-500 shrink-0 mt-0.5">location_on</span>
                    <p className="line-clamp-2">{req.pickupLocation}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="text-slate-500 text-[11px]">
                      <span>{req.assignedAmbulance?.name || "Siaga"}</span>
                      <span className="mx-1">•</span>
                      <span>{req.distanceKm} km ({req.etaMinutes} mnt)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{req.time}</span>
                      <span className="text-blue-600 font-bold text-xs flex items-center">
                        Detail <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* TAMPILAN DESKTOP: TABEL (Khusus Layar md ke atas) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4" scope="col">Waktu Permintaan</th>
                <th className="py-3.5 px-4" scope="col">Nama Pemohon</th>
                <th className="py-3.5 px-4" scope="col">Telepon</th>
                <th className="py-3.5 px-4" scope="col">Lokasi Penjemputan</th>
                <th className="py-3.5 px-4" scope="col">Ambulans Dialokasikan</th>
                <th className="py-3.5 px-3 text-center" scope="col">Jarak</th>
                <th className="py-3.5 px-3 text-center" scope="col">ETA</th>
                <th className="py-3.5 px-4 text-center" scope="col">Status</th>
                <th className="py-3.5 px-4 text-right" scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">
                      folder_open
                    </span>
                    <p>Tidak ada riwayat permintaan yang sesuai filter.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const statusInfo = getStatusBadge(req.status);
                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => onSelectRequest(req)}
                    >
                      {/* Waktu Permintaan */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{req.time}</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            #{req.id}
                          </span>
                        </div>
                      </td>

                      {/* Nama Pemohon */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {req.callerName}
                      </td>

                      {/* Telepon */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-xs text-slate-700">
                        {req.callerPhone}
                      </td>

                      {/* Lokasi Penjemputan */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-red-600 text-base shrink-0 mt-0.5">
                            location_on
                          </span>
                          <span className="text-xs text-slate-800 leading-snug line-clamp-2">
                            {req.pickupLocation}
                          </span>
                        </div>
                      </td>

                      {/* Ambulans Dialokasikan */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-lg">airport_shuttle</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs text-slate-900">
                              {req.assignedAmbulance?.name || "Unit Ambulans"}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {req.assignedAmbulance?.unit_code || "-"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Jarak */}
                      <td className="py-4 px-3 text-center whitespace-nowrap text-xs font-semibold text-slate-700">
                        {req.distanceKm} km
                      </td>

                      {/* ETA */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <span className="inline-block bg-blue-50 px-2 py-0.5 rounded text-xs font-bold text-blue-700">
                          {req.etaMinutes} menit
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRequest(req);
                          }}
                          className="h-8 px-3 rounded-lg border border-slate-300 hover:bg-blue-700 hover:text-white hover:border-blue-700 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition duration-150 active:scale-95 shadow-2xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Tabel Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Menampilkan {filteredRequests.length} dari {requests.length} total riwayat permohonan</span>
          <span>Palembang Smart Dispatch Response Protocol v2.4</span>
        </div>
      </section>
    </div>
  );
}
