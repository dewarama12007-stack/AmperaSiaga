"use client";

import React, { useState } from "react";
import { Ambulance, Provider } from "@/types";

interface AdminAnalyticsChartsProps {
  ambulances: Ambulance[];
  providers: Provider[];
}

export default function AdminAnalyticsCharts({
  ambulances,
  providers,
}: AdminAnalyticsChartsProps) {
  const [activeTab, setActiveTab] = useState<"status" | "tren" | "faskes">("status");

  const hasAmbulances = ambulances && ambulances.length > 0;
  const total = hasAmbulances ? ambulances.length : 28;
  const tersedia = hasAmbulances ? ambulances.filter((a) => a.status === "tersedia").length : 18;
  const bertugas = hasAmbulances ? ambulances.filter((a) => a.status === "sedang_bertugas").length : 6;
  const offline = hasAmbulances ? ambulances.filter((a) => a.status === "offline").length : 4;

  const pctTersedia = total > 0 ? Math.round((tersedia / total) * 100) : 0;
  const pctBertugas = total > 0 ? Math.round((bertugas / total) * 100) : 0;
  const pctOffline = Math.max(0, 100 - pctTersedia - pctBertugas);

  const oxygenCount = hasAmbulances ? ambulances.filter((a) => a.has_oxygen).length : 26;
  const oxygenPct = total > 0 ? ((oxygenCount / total) * 100).toFixed(1) : "0";

  const icuCount = hasAmbulances
    ? ambulances.filter((a) => a.has_icu || a.vehicle_type === "icu_mobile").length
    : 10;
  const icuPct = total > 0 ? ((icuCount / total) * 100).toFixed(1) : "0";

  // Donut chart calculations (circumference = 2 * PI * r = 2 * 3.14159 * 42 ≈ 263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeTersedia = (pctTersedia / 100) * circumference;
  const strokeBertugas = (pctBertugas / 100) * circumference;
  const strokeOffline = (pctOffline / 100) * circumference;

  const offsetTersedia = 0;
  const offsetBertugas = -strokeTersedia;
  const offsetOffline = -(strokeTersedia + strokeBertugas);

  // 24-hour emergency dispatch trend data
  const trendData = [
    { hour: "00:00 - 04:00", label: "Dini Hari", count: 2, height: "18%" },
    { hour: "04:00 - 08:00", label: "Pagi", count: 5, height: "42%" },
    { hour: "08:00 - 12:00", label: "Siang (Puncak 1)", count: 9, height: "78%", peak: true },
    { hour: "12:00 - 16:00", label: "Siang-Sore", count: 7, height: "60%" },
    { hour: "16:00 - 20:00", label: "Sore (Puncak 2)", count: 11, height: "95%", peak: true },
    { hour: "20:00 - 24:00", label: "Malam", count: 4, height: "35%" },
  ];

  // Hospital fleet distribution
  const defaultHospitalData = [
    { name: "RSUP Dr. Mohammad Hoesin", region: "Ilir (Kemuning)", total: 5, ready: 3, busy: 2, off: 0 },
    { name: "RS Charitas Palembang", region: "Ilir Timur I", total: 4, ready: 3, busy: 1, off: 0 },
    { name: "RSUD Palembang BARI", region: "Seberang Ulu I", total: 4, ready: 2, busy: 1, off: 1 },
    { name: "RSI Siti Khadijah", region: "Ilir Barat I", total: 3, ready: 2, busy: 1, off: 0 },
    { name: "RSUD Siti Fatimah (Km. 6)", region: "Sukarami", total: 3, ready: 2, busy: 0, off: 1 },
    { name: "PMI Kota Palembang", region: "Alang-Alang Lebar", total: 3, ready: 2, busy: 1, off: 0 },
  ];

  const dynamicHospitalData =
    providers.length > 0 && hasAmbulances
      ? providers
          .map((p) => {
            const pAmbs = ambulances.filter((a) => a.provider_id === p.id);
            const ready = pAmbs.filter((a) => a.status === "tersedia").length;
            const busy = pAmbs.filter((a) => a.status === "sedang_bertugas").length;
            const off = pAmbs.filter((a) => a.status === "offline").length;
            return {
              name: p.name,
              region: p.address?.toLowerCase().includes("seberang ulu") ? "Seberang Ulu" : "Seberang Ilir",
              total: pAmbs.length,
              ready,
              busy,
              off,
            };
          })
          .filter((h) => h.total > 0)
      : [];

  const hospitalData = dynamicHospitalData.length > 0 ? dynamicHospitalData : defaultHospitalData;

  // Patient emergency case types
  const caseTypes = [
    { name: "Kardiovaskular & Sesak Akut", pct: 40, color: "bg-red-500", icon: "cardiology" },
    { name: "Kecelakaan Lalu Lintas (Laka Lantas)", pct: 28, color: "bg-amber-500", icon: "car_crash" },
    { name: "Trauma Medis & Gawat Darurat", pct: 18, color: "bg-blue-600", icon: "personal_injury" },
    { name: "Transfer Rujukan Antar Rumah Sakit", pct: 14, color: "bg-teal-600", icon: "swap_horiz" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-5">
      {/* Header Toolbar Diagram */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Diagram Analitik & Kesiapan Layanan</h3>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Laporan Real-time
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistik performa armada, tren panggilan darurat, dan persebaran faskes Palembang
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("status")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "status"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Status & Kesiapan
          </button>
          <button
            onClick={() => setActiveTab("tren")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "tren"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tren 24 Jam
          </button>
          <button
            onClick={() => setActiveTab("faskes")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "faskes"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sebaran Faskes
          </button>
        </div>
      </div>

      {/* CONTENT TAB 1: STATUS & KESIAPAN ARMADA (DONUT CHART) */}
      {activeTab === "status" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Donut Chart Visual (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />

                {/* Slice 1: Tersedia (Hijau Emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#16a34a"
                  strokeWidth="12"
                  strokeDasharray={`${strokeTersedia} ${circumference}`}
                  strokeDashoffset={offsetTersedia}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />

                {/* Slice 2: Sedang Bertugas (Kuning Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="12"
                  strokeDasharray={`${strokeBertugas} ${circumference}`}
                  strokeDashoffset={offsetBertugas}
                  className="transition-all duration-700 ease-out"
                />

                {/* Slice 3: Offline (Abu-abu Slate) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#94a3b8"
                  strokeWidth="12"
                  strokeDasharray={`${strokeOffline} ${circumference}`}
                  strokeDashoffset={offsetOffline}
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Metrics Inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {pctTersedia}%
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                  Siaga Aktif
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5">Kota Palembang</span>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-600 mt-3 text-center">
              Rasio Kesiapan Armada Ambulans Kota
            </p>
          </div>

          {/* Breakdown Metrics & Legend (7 cols) */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tersedia */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>Tersedia (Siaga)</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-emerald-800">{tersedia}</span>
                  <span className="text-xs text-emerald-600 font-medium">unit ({pctTersedia}%)</span>
                </div>
                <p className="text-[10px] text-emerald-700 mt-1">Siap berangkat instan</p>
              </div>

              {/* Sedang Bertugas */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Sedang Bertugas</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-amber-800">{bertugas}</span>
                  <span className="text-xs text-amber-600 font-medium">unit ({pctBertugas}%)</span>
                </div>
                <p className="text-[10px] text-amber-700 mt-1">Dalam rute penjemputan</p>
              </div>

              {/* Offline */}
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                  <span>Offline</span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-slate-800">{offline}</span>
                  <span className="text-xs text-slate-500 font-medium">unit ({pctOffline}%)</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Pemeliharaan armada</p>
              </div>
            </div>

            {/* Sub-indikator Perlengkapan Khusus */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-700">
                Kesiapan Fasilitas Khusus:
              </span>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-sky-600">air</span>
                      <span>Tabung Oksigen Siaga ({oxygenCount} unit)</span>
                    </span>
                    <span className="font-bold text-slate-900">{oxygenPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: `${oxygenPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-red-600">monitor_heart</span>
                      <span>Peralatan ICU Mobile & Defibrillator ({icuCount} unit)</span>
                    </span>
                    <span className="font-bold text-slate-900">{icuPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${icuPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TAB 2: TREN PANGGILAN 24 JAM (BAR / HISTOGRAM CHART) */}
      {activeTab === "tren" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-blue-700">schedule</span>
              <span className="font-semibold text-blue-900">
                Waktu Tanggap Rata-rata (Response Time): <strong>6.8 Menit</strong>
              </span>
            </div>
            <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full text-[11px]">
              Target Terpenuhi (&lt; 10 Menit)
            </span>
          </div>

          {/* Visual Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-200 pb-2">
              {trendData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip / Value on top of bar */}
                  <div className="opacity-80 group-hover:opacity-100 transition-opacity mb-1.5 flex flex-col items-center">
                    <span className="text-xs font-extrabold text-slate-800">
                      {item.count}
                    </span>
                    <span className="text-[9px] text-slate-400">panggilan</span>
                  </div>

                  {/* The Bar */}
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${
                        item.peak
                          ? "bg-gradient-to-t from-red-600 to-rose-400 group-hover:from-red-700 group-hover:to-rose-500 shadow-sm"
                          : "bg-gradient-to-t from-blue-600 to-sky-400 group-hover:from-blue-700 group-hover:to-sky-500"
                      }`}
                      style={{ height: item.height }}
                    ></div>
                  </div>

                  {/* Label below bar */}
                  <span className="text-[10px] font-bold text-slate-700 mt-2 truncate max-w-full text-center">
                    {item.label}
                  </span>
                  <span className="text-[9px] text-slate-400 text-center font-mono">
                    {item.hour.split(" - ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-red-600 to-rose-400"></span>
              Puncak Panggilan Darurat (Jam Sibuk Sudirman & Jembatan Ampera)
            </span>
            <span className="font-semibold text-slate-700">Total Hari Ini: 38 Dispatch</span>
          </div>
        </div>
      )}

      {/* CONTENT TAB 3: SEBARAN FASKES / RUMAH SAKIT */}
      {activeTab === "faskes" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Perbandingan alokasi unit armada siaga di fasilitas kesehatan Seberang Ilir dan Seberang Ulu:
          </p>

          <div className="space-y-2.5">
            {hospitalData.map((faskes, idx) => {
              const readyPct = Math.round((faskes.ready / faskes.total) * 100);
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{faskes.name}</span>
                      <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {faskes.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="text-emerald-700 font-bold">{faskes.ready} Siaga</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-600">{faskes.total} Total</span>
                    </div>
                  </div>

                  {/* Stacked Progress Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${readyPct}%` }}
                      title={`${faskes.ready} Siaga`}
                    ></div>
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${((faskes.busy || 0) / faskes.total) * 100}%` }}
                      title={`${faskes.busy || 0} Bertugas`}
                    ></div>
                    {Boolean(faskes.off) && (
                      <div
                        className="bg-slate-400 h-full"
                        style={{ width: `${((faskes.off || 0) / faskes.total) * 100}%` }}
                        title={`${faskes.off || 0} Offline`}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              Unit Siaga Standby
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
              Sedang di Jalan / Bertugas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span>
              Offline / Perawatan
            </span>
          </div>
        </div>
      )}

      {/* Mini Case Type Breakdown Strip at Bottom */}
      <div className="pt-3 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
          Kategori Kasus Darurat Warga Terlayani:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {caseTypes.map((c, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className={`w-2 h-7 rounded-sm ${c.color}`}></div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-slate-800">{c.pct}%</span>
                <p className="text-[10px] text-slate-500 truncate" title={c.name}>
                  {c.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
