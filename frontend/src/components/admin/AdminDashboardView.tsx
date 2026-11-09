"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Ambulance, Provider } from "@/types";
import AdminAnalyticsCharts from "./AdminAnalyticsCharts";
import { EmergencyRequestItem } from "./AdminDetailPermintaanDrawer";

const AdminFleetMap = dynamic(() => import("./AdminFleetMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-xl bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-800">
      <div className="w-8 h-8 rounded-full border-3 border-blue-500 border-t-transparent animate-spin"></div>
      <span className="text-xs font-semibold text-slate-300">Menghubungkan Command Center Palembang Siaga...</span>
    </div>
  ),
});

interface AdminDashboardViewProps {
  ambulances: Ambulance[];
  providers: Provider[];
  emergencyRequests?: EmergencyRequestItem[];
  onNavigateToArmada: () => void;
  onSelectAmbulance?: (ambulance: Ambulance) => void;
  onSelectRequest?: (request: EmergencyRequestItem) => void;
}

export default function AdminDashboardView({
  ambulances,
  providers,
  emergencyRequests = [],
  onNavigateToArmada,
  onSelectAmbulance,
  onSelectRequest,
}: AdminDashboardViewProps) {
  const total = ambulances.length;
  const tersedia = ambulances.filter((a) => a.status === "tersedia").length;
  const bertugas = ambulances.filter((a) => a.status === "sedang_bertugas").length;
  const offline = ambulances.filter((a) => a.status === "offline").length;

  // Real reactive request stats
  const activeRequestsCount = emergencyRequests.filter(
    (r) => r.status === "menunggu" || r.status === "dihubungi" || r.status === "ditangani"
  ).length;
  const completedRequestsCount = emergencyRequests.filter((r) => r.status === "selesai").length;
  const waitingCount = emergencyRequests.filter((r) => r.status === "menunggu").length;

  const displayRequests = emergencyRequests.slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Mobile Section Switcher Chips (Khusus Mobile < lg) */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <a
          href="#peta-armada"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shrink-0 hover:bg-blue-100 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">map</span>
          <span>Peta Armada</span>
        </a>
        <a
          href="#permintaan-terbaru"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold shrink-0 hover:bg-red-100 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">notification_important</span>
          <span>Panggilan Baru {waitingCount > 0 && `(${waitingCount})`}</span>
        </a>
        <a
          href="#diagram-analitik"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shrink-0 hover:bg-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">analytics</span>
          <span>Analitik 24 Jam</span>
        </a>
      </div>

      {/* 6 KARTU STATISTIK (Grid 2 Kolom di HP, 3 di Tablet, 6 di Desktop) */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Kartu 1: Total Ambulans */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col justify-between transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Total Ambulans</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <span className="material-symbols-outlined text-base sm:text-lg">airport_shuttle</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{total}</h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 truncate">Seluruh armada kota</p>
          </div>
        </div>

        {/* Kartu 2: Tersedia */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col justify-between transition hover:shadow-md border-l-4 border-l-[#16A34A]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Tersedia</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] shrink-0">
              <span className="material-symbols-outlined text-base sm:text-lg">check_circle</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#16A34A] tracking-tight">{tersedia}</h3>
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full mt-0.5">
              <span>Siaga 100%</span>
            </div>
          </div>
        </div>

        {/* Kartu 3: Sedang Bertugas */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col justify-between transition hover:shadow-md border-l-4 border-l-[#F59E0B]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Sedang Bertugas</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[#B45309] shrink-0">
              <span className="material-symbols-outlined text-base sm:text-lg">emergency</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#F59E0B] tracking-tight">{bertugas}</h3>
            <p className="text-[10px] sm:text-xs text-[#B45309] font-medium mt-0.5 truncate">{bertugas} unit jalan</p>
          </div>
        </div>

        {/* Kartu 4: Offline */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col justify-between transition hover:shadow-md border-l-4 border-l-[#6B7280]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Offline</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] shrink-0">
              <span className="material-symbols-outlined text-base sm:text-lg">build</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#6B7280] tracking-tight">{offline}</h3>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 truncate">Perawatan rutin</p>
          </div>
        </div>

        {/* Kartu 5: Permintaan Aktif */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col justify-between transition hover:shadow-md border-l-4 border-l-[#1D4ED8]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Permintaan Aktif</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <span className="material-symbols-outlined text-base sm:text-lg">phone_in_talk</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1D4ED8] tracking-tight">{activeRequestsCount}</h3>
            <p className="text-[10px] sm:text-xs text-[#1D4ED8] font-semibold mt-0.5 truncate">Perlu penanganan</p>
          </div>
        </div>

        {/* Kartu 6: Permintaan Selesai */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs flex flex-col justify-between transition hover:shadow-md border-l-4 border-l-[#0F7B6C]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">Permintaan Selesai</span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-50 flex items-center justify-center text-[#0F7B6C] shrink-0">
              <span className="material-symbols-outlined text-base sm:text-lg">task_alt</span>
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F7B6C] tracking-tight">{completedRequestsCount}</h3>
            <p className="text-[10px] sm:text-xs text-teal-700 font-medium mt-0.5 truncate">Hari ini (Palembang)</p>
          </div>
        </div>
      </section>

      {/* 2 KOLOM KONTEN UTAMA: PETA ARMADA (2/3) & PERMINTAAN TERBARU (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* KOLOM KIRI (2/3 LEBAR - PETA ARMADA INTERAKTIF & DIAGRAM ANALITIK) */}
        <div className="lg:col-span-2 flex flex-col gap-5 sm:gap-6">
          {/* 1. PETA PEMANTAUAN ARMADA PALEMBANG (LEAFLET COMMAND CENTER) */}
          <div id="peta-armada" className="scroll-mt-20">
            <AdminFleetMap
              ambulances={ambulances}
              onSelectAmbulance={onSelectAmbulance}
              onNavigateToArmada={onNavigateToArmada}
            />
          </div>

          {/* 2. DIAGRAM DI DASHBOARD ADMIN DIBAWAH PETA PEMANTAUAN ARMADA */}
          <div id="diagram-analitik" className="scroll-mt-20">
            <AdminAnalyticsCharts
              ambulances={ambulances}
              providers={providers}
            />
          </div>
        </div>

        {/* KOLOM KANAN (1/3 LEBAR - FEED PERMINTAAN TERBARU) */}
        <div id="permintaan-terbaru" className="scroll-mt-20 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Permintaan Terbaru</h3>
              <p className="text-xs text-slate-500">Log panggilan darurat warga</p>
            </div>
            {waitingCount > 0 ? (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                {waitingCount} Baru
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                Terkendali
              </span>
            )}
          </div>

          <div className="space-y-3">
            {displayRequests.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">inbox</span>
                <p>Belum ada panggilan darurat baru.</p>
              </div>
            ) : (
              displayRequests.map((req) => {
                const badgeColor =
                  req.status === "menunggu"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : req.status === "dihubungi"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : req.status === "ditangani"
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : req.status === "selesai"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-slate-100 text-slate-700 border-slate-200";

                return (
                  <div
                    key={req.id}
                    onClick={() => onSelectRequest?.(req)}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all bg-slate-50/50 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                        {req.callerName} #{req.id}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">{req.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mb-2">
                      <span className="material-symbols-outlined text-xs text-red-600 shrink-0">location_on</span>
                      <span className="truncate">{req.pickupLocation}</span>
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500 text-[11px] truncate max-w-[150px]">
                        Armada: <span className="font-semibold text-slate-700">{req.assignedAmbulance?.name || "Siaga"}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize shrink-0 ${badgeColor}`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <a
            href="tel:112"
            className="w-full mt-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">phone_forwarded</span>
            <span>Buka Saluran Telepon 112 / 119</span>
          </a>
        </div>
      </div>
    </div>
  );
}
