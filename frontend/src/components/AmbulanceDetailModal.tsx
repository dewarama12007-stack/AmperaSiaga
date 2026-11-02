"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Ambulance } from "@/types";
import { isCrossingMusiRiver } from "@/lib/geo";

interface AmbulanceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambulance: Ambulance | null;
  userLocation: { lat: number; lng: number; address: string };
  onViewRoute: (ambulance: Ambulance) => void;
  onContactWhatsApp: (ambulance: Ambulance) => void;
}

export default function AmbulanceDetailModal({
  isOpen,
  onClose,
  ambulance,
  userLocation,
  onViewRoute,
  onContactWhatsApp,
}: AmbulanceDetailModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize interactive Leaflet map for Detail Preview
  useEffect(() => {
    if (!isOpen || !ambulance || !mapContainerRef.current) return;

    const ambLat = Number(ambulance.latitude);
    const ambLng = Number(ambulance.longitude);
    if (isNaN(ambLat) || isNaN(ambLng)) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [(ambLat + userLocation.lat) / 2, (ambLng + userLocation.lng) / 2],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Ambulance Marker
      const ambHtml = `
        <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
          <div class="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-lg border-2 border-white">
            <span class="material-symbols-outlined text-lg">ambulance</span>
          </div>
          <div class="mt-1 bg-white/95 px-2 py-0.5 rounded shadow-xs text-[10px] font-bold text-slate-800 border border-slate-200 whitespace-nowrap">
            ${ambulance.name}
          </div>
        </div>
      `;
      const ambIcon = L.divIcon({
        html: ambHtml,
        className: "custom-detail-amb-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      L.marker([ambLat, ambLng], { icon: ambIcon }).addTo(map);

      // User Marker
      const userHtml = `
        <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
          <div class="w-9 h-9 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-lg border-2 border-white">
            <span class="material-symbols-outlined text-base">my_location</span>
          </div>
          <div class="mt-1 bg-[#131b2e] text-white px-2 py-0.5 rounded shadow-xs text-[10px] font-bold whitespace-nowrap">
            Titik Jemput Anda
          </div>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userHtml,
        className: "custom-detail-user-marker",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);

      // Route line
      const routeLine = L.polyline(
        [
          [ambLat, ambLng],
          [userLocation.lat, userLocation.lng],
        ],
        {
          color: "#1d4ed8",
          weight: 4,
          dashArray: "6, 6",
        }
      ).addTo(map);

      try {
        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
      } catch (e) {}

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, ambulance, userLocation]);

  if (!isOpen || !ambulance) return null;

  return (
    <div
      className="bg-slate-950/75 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[#1d4ed8] font-bold text-xs sm:text-sm hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Kembali ke Daftar Ambulans</span>
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto p-4 sm:p-6 gap-6">
          {/* Left Detail Panel */}
          <div className="w-full lg:w-[420px] flex flex-col gap-4 shrink-0">
            {/* Unit Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#eaedff] text-[#1d4ed8] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">emergency</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#131b2e] leading-snug">{ambulance.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Unit {ambulance.unit_code} • {ambulance.provider?.name || "Mitra Pelayanan Palembang"}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                    ambulance.status === "tersedia"
                      ? "bg-emerald-100 text-emerald-800"
                      : ambulance.status === "sedang_bertugas"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      ambulance.status === "tersedia"
                        ? "bg-emerald-600 animate-pulse"
                        : ambulance.status === "sedang_bertugas"
                        ? "bg-amber-500"
                        : "bg-slate-400"
                    }`}
                  ></span>
                  <span>
                    {ambulance.status === "tersedia"
                      ? "Tersedia"
                      : ambulance.status === "sedang_bertugas"
                      ? "Sedang Bertugas"
                      : "Offline"}
                  </span>
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#f8fafc] border border-slate-200 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-500 flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#1d4ed8]">distance</span>
                      <span>Jarak Rute Jalan</span>
                    </span>
                    {isCrossingMusiRiver(Number(ambulance.latitude), userLocation.lat) && (
                      <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        Lintas Ampera
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-extrabold text-[#131b2e] mt-0.5">
                    {ambulance.distance_km || 2.4} km
                  </div>
                  <div className="text-[10px] text-slate-400">Rute jalan raya ke titik jemput</div>
                </div>
                <div className="bg-[#f8fafc] border border-slate-200 p-3 rounded-xl">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-sm text-emerald-600">schedule</span>
                    <span>Estimasi Tiba</span>
                  </div>
                  <div className="text-lg font-extrabold text-emerald-700 mt-0.5">
                    ~{ambulance.estimated_minutes || 8} menit
                  </div>
                  <div className="text-[10px] text-slate-400">Jalur prioritas darurat</div>
                </div>
              </div>

              {/* Lokasi Standby */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#1d4ed8]">location_on</span>
                  <span>Pangkalan / Posko Standby</span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {ambulance.base_location || ambulance.provider?.address || "Palembang"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {ambulance.provider?.name || "Kota Palembang, Sumatera Selatan"}
                </p>
              </div>

              {/* Driver & Status */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-600 px-1 border-t border-slate-100 pt-2">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-sm text-slate-500">badge</span>
                  <span>Petugas: {ambulance.driver_name || "Driver Siaga"}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>GPS Terkoneksi</span>
                </span>
              </div>
            </div>

            {/* Deskripsi & Fasilitas */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#1d4ed8]">info</span>
                <span>Fasilitas &amp; Peralatan Medis</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {ambulance.description ||
                  "Unit ambulans evakuasi medis darat dilengkapi peralatan resusitasi, tabung oksigen, dan brankar standar gawat darurat."}
              </p>

              {/* Fasilitas Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {ambulance.has_oxygen && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
                    <span className="material-symbols-outlined text-sm text-teal-700">check_circle</span>
                    <span>Tabung Oksigen &amp; Regulator</span>
                  </span>
                )}
                {ambulance.has_icu && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
                    <span className="material-symbols-outlined text-sm text-blue-700">check_circle</span>
                    <span>ICU Mobile &amp; Monitor Pasien</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm text-[#1d4ed8]">check_circle</span>
                  <span>Brankar / Tandu Lipat Medis</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm text-[#1d4ed8]">check_circle</span>
                  <span>Sirine &amp; Lampu Strobo Darurat</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => onViewRoute(ambulance)}
                className="w-full h-11 border border-slate-300 hover:border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#eaedff] rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">alt_route</span>
                <span>Lihat Panduan Rute</span>
              </button>
              <button
                onClick={() => onContactWhatsApp(ambulance)}
                className="w-full h-12 bg-[#0F7B6C] hover:bg-[#0B5E53] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>Hubungi Admin WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Map Preview */}
          <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative min-h-[380px] flex flex-col">
            <div ref={mapContainerRef} className="w-full h-full z-0 flex-1" />

            {/* Status Header Badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex items-center gap-2 shadow-xs z-10 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700">Pelacakan Real-time Kota Palembang</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
