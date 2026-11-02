"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Ambulance } from "@/types";
import { getRoadRoute, isCrossingMusiRiver, AMPERA_BRIDGE } from "@/lib/geo";

interface AmbulanceRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambulance: Ambulance | null;
  userLocation: { lat: number; lng: number; address: string };
  onContactWhatsApp: (ambulance: Ambulance) => void;
  adminPhone?: string;
  onRouteCalculated?: (
    ambId: number,
    metrics: { distance_km: number; estimated_minutes: number; coordinates?: [number, number][] }
  ) => void;
}

export default function AmbulanceRouteModal({
  isOpen,
  onClose,
  ambulance,
  userLocation,
  onContactWhatsApp,
  adminPhone = "6282162319964",
  onRouteCalculated,
}: AmbulanceRouteModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.Layer[]>([]);
  const [realRouteInfo, setRealRouteInfo] = React.useState<{ distance: string; duration: string } | null>(null);

  const [isCardVisible, setIsCardVisible] = React.useState(true);
  const [isFullMap, setIsFullMap] = React.useState(false);

  const ambLat = ambulance ? Number(ambulance.latitude) : 0;
  const ambLng = ambulance ? Number(ambulance.longitude) : 0;
  const crossesRiver = !isNaN(ambLat) ? isCrossingMusiRiver(ambLat, userLocation.lat) : false;

  const distanceText = realRouteInfo?.distance || `${ambulance?.distance_km || 2.4} km`;
  const timeText = realRouteInfo?.duration || `${ambulance?.estimated_minutes || 8} menit`;

  useEffect(() => {
    if (isOpen) {
      setIsCardVisible(true);
      setIsFullMap(false);
      if (ambulance?.distance_km && ambulance?.estimated_minutes) {
        setRealRouteInfo({
          distance: `${ambulance.distance_km} km`,
          duration: `${ambulance.estimated_minutes} menit`,
        });
      } else {
        setRealRouteInfo(null);
      }
    }
  }, [isOpen, ambulance?.id]);

  const toggleFullMap = () => {
    setIsFullMap((prev) => !prev);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
  };

  useEffect(() => {
    if (!isOpen || !ambulance || !mapContainerRef.current) return;
    if (isNaN(ambLat) || isNaN(ambLng)) return;

    let isCancelled = false;
    const controller = new AbortController();

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [(ambLat + userLocation.lat) / 2, (ambLng + userLocation.lng) / 2],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // 1. Ambulance Marker
      const ambHtml = `
        <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
          <div class="w-10 h-10 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-lg border-2 border-white">
            <span class="material-symbols-outlined text-lg">ambulance</span>
          </div>
          <div class="mt-1 bg-white/95 px-2 py-0.5 rounded shadow-xs text-[10px] font-bold text-slate-800 border border-slate-200 whitespace-nowrap">
            ${ambulance.name} (${ambulance.unit_code})
          </div>
        </div>
      `;
      const ambIcon = L.divIcon({
        html: ambHtml,
        className: "custom-amb-route-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      L.marker([ambLat, ambLng], { icon: ambIcon }).addTo(map);

      // 2. User Pickup Marker
      const userHtml = `
        <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
          <div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping pointer-events-none"></div>
          <div class="w-10 h-10 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center shadow-lg border-2 border-white">
            <span class="material-symbols-outlined text-lg">my_location</span>
          </div>
          <div class="mt-1 bg-[#131b2e] text-white px-2 py-0.5 rounded shadow-xs text-[10px] font-bold whitespace-nowrap">
            Titik Jemput Anda
          </div>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userHtml,
        className: "custom-user-route-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);

      // Clean route drawing function
      const drawRoute = (coords: L.LatLngExpression[], fitToBounds = false) => {
        routeLayersRef.current.forEach((layer) => {
          try {
            map.removeLayer(layer);
          } catch (e) {}
        });
        routeLayersRef.current = [];

        const halo = L.polyline(coords, {
          color: "#FFFFFF",
          weight: 9,
          lineCap: "round",
          lineJoin: "round",
          opacity: 0.9,
        }).addTo(map);

        const polyline = L.polyline(coords, {
          color: "#1D4ED8",
          weight: 5,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        routeLayersRef.current.push(halo, polyline);

        if (fitToBounds) {
          try {
            map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
          } catch (e) {}
        }
      };

      // Fetch exact road route via cached helper
      getRoadRoute(
        { lat: ambLat, lng: ambLng },
        { lat: userLocation.lat, lng: userLocation.lng },
        controller.signal
      )
        .then((routeResult) => {
          if (isCancelled) return;
          drawRoute(routeResult.coordinates, true);

          const distStr = `${routeResult.distanceKm} km`;
          const durStr = `${routeResult.estimatedMinutes} menit`;

          setRealRouteInfo({
            distance: distStr,
            duration: durStr,
          });

          // Sync back to parent list & modals so outside and inside match 100%
          onRouteCalculated?.(ambulance.id, {
            distance_km: routeResult.distanceKm,
            estimated_minutes: routeResult.estimatedMinutes,
            coordinates: routeResult.coordinates,
          });
        })
        .catch(() => {});

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      isCancelled = true;
      controller.abort();
      routeLayersRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, ambulance?.id, ambLat, ambLng, userLocation.lat, userLocation.lng]);

  if (!isOpen || !ambulance) return null;

  const currentSyncedAmbulance: Ambulance = {
    ...ambulance,
    distance_km: realRouteInfo ? parseFloat(realRouteInfo.distance) : ambulance.distance_km,
    estimated_minutes: realRouteInfo ? parseInt(realRouteInfo.duration) : ambulance.estimated_minutes,
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${ambLat},${ambLng}&destination=${userLocation.lat},${userLocation.lng}&travelmode=driving`;

  if (!isOpen || !ambulance) return null;

  return (
    <div
      className="bg-slate-950/75 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl bg-[#faf8ff] rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white px-5 py-3 border-b border-[#c4c5d7]/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-[#1d4ed8] font-bold text-xs sm:text-sm hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Kembali ke Daftar Ambulans</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#16A34A] px-2.5 py-0.5 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>Unit Siap Jalan</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body: Left Turn-by-Turn Panel + Right Interactive Map */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 sm:p-6 gap-6">
          {/* Left Supplementary Panel: Turn-by-Turn Guidance */}
          <aside
            className={`${
              isFullMap ? "hidden" : "w-full lg:w-[380px] flex"
            } flex-col gap-4 shrink-0 overflow-y-auto pr-1 transition-all duration-300`}
          >
            {/* Unit Card Info */}
            <div className="bg-white rounded-2xl border border-[#c4c5d7]/70 p-4 sm:p-5 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Ambulans Siaga Palembang
                  </div>
                  <h3 className="text-lg font-bold text-[#131b2e] leading-snug">
                    {ambulance.name} - {ambulance.provider?.name || "Mitra Palembang"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">
                    ID Unit: {ambulance.unit_code}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#1d4ed8] shrink-0">
                  <span className="material-symbols-outlined text-2xl">ambulance</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#00685b]">verified_user</span>
                  <span>Driver: {ambulance.driver_name || "Petugas Siaga"}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#131b2e]">
                  <span className="material-symbols-outlined text-sm text-[#1d4ed8]">medical_services</span>
                  <span>{ambulance.has_icu ? "ICU Mobile" : "O₂ & Resusitasi"}</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Road Directions */}
            <div className="bg-white rounded-2xl border border-[#c4c5d7]/70 p-4 sm:p-5 shadow-xs flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-[#131b2e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1d4ed8] text-lg">alt_route</span>
                  <span>Panduan Rute Penjemputan</span>
                </h4>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Jalur Tercepat
                </span>
              </div>

              <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-[#c4c5d7]">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full border-2 border-white bg-[#16A34A] shadow-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      TITIK PANGKALAN UNIT
                    </div>
                    <p className="font-bold text-xs text-[#131b2e] mt-0.5">
                      {ambulance.base_location || ambulance.provider?.address || "Posko Siaga Palembang"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Unit bersiap dari titik pangkalan/posko mitra resmi.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full border-2 border-white bg-[#1d4ed8] shadow-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>{crossesRiver ? "KORIDOR LINTAS JEMBATAN AMPERA" : "KORIDOR ARTERI PROTOKOL"}</span>
                      {crossesRiver && (
                        <span className="px-1.5 py-0.5 bg-blue-100 text-[#1d4ed8] rounded text-[9px] font-bold">
                          Lintas Musi
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-xs text-[#131b2e] mt-0.5">
                      {crossesRiver
                        ? "Jalur Arteri Protokol & Jembatan Ampera"
                        : "Jalur Lalu Lintas Utama Palembang"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {crossesRiver
                        ? "Ambulans mengambil koridor prioritas Jl. Jendral Sudirman melintasi Jembatan Ampera menuju titik jemput."
                        : "Melintasi jalan protokol prioritas gawat darurat menuju titik jemput."}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full border-2 border-white bg-[#1d4ed8] shadow-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      PENDEKATAN WILAYAH
                    </div>
                    <p className="font-bold text-xs text-[#131b2e] mt-0.5">
                      Kawasan {userLocation.address.split(",")[0] || "Tujuan"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ambulans mengambil jalur paling efektif mendekati titik lokasi Anda.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full border-2 border-white bg-[#dc2626] shadow-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#dc2626] uppercase tracking-wider">
                      TITIK JEMPUT PASIEN (LOKASI ANDA)
                    </div>
                    <p className="font-bold text-xs text-[#131b2e] mt-0.5">
                      {userLocation.address}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Koordinat: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons inside aside */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onContactWhatsApp(currentSyncedAmbulance);
                  }}
                  className="w-full h-11 bg-[#0F7B6C] hover:bg-[#0B5E53] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>Hubungi Admin Ambulans Ini</span>
                </button>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="Buka panduan rute navigasi Google Maps di tab baru"
                >
                  <span className="material-symbols-outlined text-base text-[#1d4ed8]">directions</span>
                  <span>Buka di Google Maps</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Interactive Leaflet Route Map */}
          <section className="flex-1 relative rounded-2xl overflow-hidden border border-[#c4c5d7]/80 bg-slate-100 shadow-inner min-h-[440px] sm:min-h-[520px] flex flex-col">
            <div ref={mapContainerRef} className="w-full h-full z-0 flex-1" />

            {/* Map Top Floating Controls: Peta Penuh Toggle */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleFullMap}
                className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 border border-[#c4c5d7] px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 text-xs font-bold transition-all hover:border-[#1d4ed8] cursor-pointer ring-1 ring-black/5"
                title={isFullMap ? "Tampilkan panel rute samping" : "Perluas peta penuh (full map)"}
              >
                <span className="material-symbols-outlined text-base text-[#1d4ed8]">
                  {isFullMap ? "view_sidebar" : "fullscreen"}
                </span>
                <span className="hidden sm:inline">
                  {isFullMap ? "Buka Panel Samping" : "Peta Penuh"}
                </span>
              </button>
            </div>

            {/* Floating Summary Card on Bottom */}
            {isCardVisible ? (
              <div className="absolute left-3 right-3 sm:left-6 sm:right-auto sm:w-[370px] bottom-4 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#c4c5d7] p-4 shadow-2xl">
                  {/* Card Header with Title and 'X' Close Button */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#1d4ed8] shrink-0">
                        <span className="material-symbols-outlined text-base">navigation</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#131b2e] truncate">
                          Rute ke {ambulance.name}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          {crossesRiver ? "Lintas Jembatan Ampera" : "Estimasi Jalan Raya Palembang"}
                        </p>
                      </div>
                    </div>

                    {/* Tombol X / Close Card */}
                    <button
                      type="button"
                      onClick={() => setIsCardVisible(false)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                      title="Tutup info kartu ini untuk melihat peta penuh (bisa dibuka kembali)"
                      aria-label="Tutup info rute"
                    >
                      <span className="material-symbols-outlined text-lg font-bold">close</span>
                    </button>
                  </div>

                  <div className="my-2.5">
                    <div className="text-xl sm:text-2xl font-extrabold text-[#1d4ed8] tracking-tight">
                      {distanceText} <span className="text-slate-300 font-normal">•</span>{" "}
                      <span className="text-[#131b2e]">{timeText}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {crossesRiver
                        ? "Jarak terhitung melalui Koridor Jembatan Ampera."
                        : "Waktu tempuh aktual bergantung pada kepadatan jalan raya."}
                    </p>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCardVisible(false)}
                      className="h-10 flex-1 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl border border-slate-300 hover:border-[#1d4ed8] text-[#131b2e] text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
                      title="Sembunyikan kartu untuk melihat rute peta penuh"
                    >
                      <span className="material-symbols-outlined text-base text-slate-500">visibility_off</span>
                      <span>Tutup Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onContactWhatsApp(currentSyncedAmbulance);
                      }}
                      className="h-10 flex-1 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[#0F7B6C] hover:bg-[#0B5E53] text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-base">chat</span>
                      <span>Hubungi Admin</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Minimized Floating Pill to Re-open Card */
              <div className="absolute left-3 bottom-4 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button
                  type="button"
                  onClick={() => setIsCardVisible(true)}
                  className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-900 border border-[#c4c5d7] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-[#1d4ed8]/20 group"
                  title="Klik untuk menampilkan kembali informasi rute ambulans"
                >
                  <div className="w-6 h-6 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#1d4ed8] group-hover:bg-[#1d4ed8] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">navigation</span>
                  </div>
                  <span>Tampilkan Info Rute ({distanceText} • {timeText})</span>
                  <span className="material-symbols-outlined text-base text-[#1d4ed8]">expand_less</span>
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Bottom Banner Strip: Clear and realistic note */}
        <div className="w-full bg-[#eaedff] border-t border-[#c4c5d7]/60 py-2.5 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1d4ed8] text-base shrink-0">info</span>
            <span>
              Simulasi panduan rute unit {ambulance.name}. Untuk melakukan verifikasi armada dan penjemputan darurat, silakan hubungi admin via WhatsApp.
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              onContactWhatsApp(currentSyncedAmbulance);
            }}
            className="text-xs font-bold text-[#1d4ed8] hover:underline flex items-center gap-1 cursor-pointer shrink-0 self-end sm:self-auto"
          >
            <span>Lanjut Hubungi Admin</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
