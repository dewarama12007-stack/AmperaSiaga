"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Ambulance } from "@/types";

interface AdminFleetMapProps {
  ambulances: Ambulance[];
  onSelectAmbulance?: (ambulance: Ambulance) => void;
  onNavigateToArmada?: () => void;
}

const PALEMBANG_CENTER: [number, number] = [-2.985, 104.755];
const AMPERA_COORDS: [number, number] = [-2.9918, 104.7634];

export default function AdminFleetMap({
  ambulances,
  onSelectAmbulance,
  onNavigateToArmada,
}: AdminFleetMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});

  const [mapFilter, setMapFilter] = useState<"all" | "tersedia" | "sedang_bertugas" | "offline">("all");
  const [mapTheme, setMapTheme] = useState<"dark" | "streets">("streets");
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  // Sync preference with localStorage (default to light mode "streets")
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ampera_admin_map_theme");
      if (saved === "dark" || saved === "streets") {
        setMapTheme(saved);
      }
    } catch {}
  }, []);

  const handleSetTheme = (theme: "dark" | "streets") => {
    setMapTheme(theme);
    try {
      localStorage.setItem("ampera_admin_map_theme", theme);
    } catch {}
  };

  const total = ambulances.length;
  const tersedia = ambulances.filter((a) => a.status === "tersedia").length;
  const bertugas = ambulances.filter((a) => a.status === "sedang_bertugas").length;
  const offline = ambulances.filter((a) => a.status === "offline").length;

  // Filtered ambulances
  const filteredAmbulances = ambulances.filter((a) => {
    if (mapFilter === "all") return true;
    return a.status === mapFilter;
  });

  // Calculate Ilir vs Ulu distribution (Musi River splits roughly at latitude -2.9918)
  const ilirCount = ambulances.filter((a) => Number(a.latitude) > -2.9918).length;
  const uluCount = ambulances.filter((a) => Number(a.latitude) <= -2.9918).length;

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: PALEMBANG_CENTER,
      zoom: 13,
      zoomControl: false,
    });

    // Map tiles: standard OSM (always free, no API key needed)
    const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const tile = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Apply initial theme via CSS filter on the tile pane (default light: no filter)
    const tilePane = map.getPane("tilePane");
    if (tilePane && mapTheme === "dark") {
      tilePane.style.filter = "invert(1) hue-rotate(180deg) brightness(0.85) contrast(1.2)";
    } else if (tilePane) {
      tilePane.style.filter = "none";
    }

    tileLayerRef.current = tile;
    mapInstanceRef.current = map;

    // Add Jembatan Ampera Landmark
    const amperaIcon = L.divIcon({
      html: `
        <div class="flex items-center gap-1.5 bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-red-400 backdrop-blur-xs whitespace-nowrap -translate-x-1/2 -translate-y-1/2">
          <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          <span>Jembatan Ampera</span>
        </div>
      `,
      className: "custom-ampera-marker",
      iconSize: [110, 24],
      iconAnchor: [55, 12],
    });

    L.marker(AMPERA_COORDS, { icon: amperaIcon, interactive: false }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Switch Map Theme (Dark vs Streets)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    // Apply/remove dark theme via CSS filter instead of swapping tile providers
    const tilePane = map.getPane("tilePane");
    if (tilePane) {
      if (mapTheme === "dark") {
        tilePane.style.filter = "invert(1) hue-rotate(180deg) brightness(0.85) contrast(1.2)";
      } else {
        tilePane.style.filter = "none";
      }
    }
  }, [mapTheme]);

  // 3. Render Ambulance Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    filteredAmbulances.forEach((amb) => {
      const lat = Number(amb.latitude);
      const lng = Number(amb.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const isSelected = selectedUnitId === amb.id;

      let colorBg = "#16a34a"; // emerald
      let colorRing = "rgba(22, 163, 74, 0.4)";
      let statusLabel = "SIAGA";

      if (amb.status === "sedang_bertugas") {
        colorBg = "#f59e0b"; // amber
        colorRing = "rgba(245, 158, 11, 0.4)";
        statusLabel = "BERTUGAS";
      } else if (amb.status === "offline") {
        colorBg = "#64748b"; // slate
        colorRing = "rgba(100, 116, 139, 0.3)";
        statusLabel = "OFFLINE";
      }

      const markerHtml = `
        <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform hover:scale-115">
          ${
            amb.status === "tersedia"
              ? `<div class="absolute w-9 h-9 rounded-full animate-ping pointer-events-none" style="background-color: ${colorRing};"></div>`
              : amb.status === "sedang_bertugas"
              ? `<div class="absolute w-10 h-10 rounded-full animate-pulse pointer-events-none" style="background-color: ${colorRing};"></div>`
              : ""
          }
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-slate-900 transition-all ${
            isSelected ? "ring-3 ring-blue-400 scale-120" : ""
          }" style="background-color: ${colorBg};">
            <span class="material-symbols-outlined text-sm font-bold">ambulance</span>
          </div>
          <div class="mt-0.5 bg-slate-900/95 text-white px-1.5 py-0.2 rounded shadow-xs text-[9px] font-mono font-bold border border-slate-700 whitespace-nowrap">
            ${amb.unit_code}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: "custom-admin-marker",
        iconSize: [36, 46],
        iconAnchor: [18, 23],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div class="p-2 text-slate-800 font-sans max-w-[220px]">
          <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-1.5">
            <span class="font-bold text-xs text-slate-900 truncate">${amb.name}</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
              amb.status === "tersedia"
                ? "bg-emerald-100 text-emerald-800"
                : amb.status === "sedang_bertugas"
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-700"
            }">${statusLabel}</span>
          </div>
          <p class="text-[11px] text-slate-600 mb-1">
            <strong>Faskes:</strong> ${amb.provider?.name || amb.base_location}
          </p>
          <p class="text-[11px] text-slate-600 mb-1">
            <strong>Driver:</strong> ${amb.driver_name || "Petugas Siaga"}
          </p>
          <div class="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
            <span>Oksigen: ${amb.has_oxygen ? "✅" : "❌"}</span>
            <span>ICU: ${amb.has_icu ? "✅" : "❌"}</span>
          </div>
          <div class="text-[10px] font-mono text-slate-400 mb-2">
            Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}
          </div>
          <button
            id="btn-select-${amb.id}"
            class="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
          >
            Kelola Unit Ini &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: "admin-leaflet-popup" });

      marker.on("popupopen", () => {
        setSelectedUnitId(amb.id);
        const btn = document.getElementById(`btn-select-${amb.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectAmbulance) onSelectAmbulance(amb);
          };
        }
      });

      marker.on("click", () => {
        setSelectedUnitId(amb.id);
      });

      markersRef.current[amb.id] = marker;
    });
  }, [filteredAmbulances, selectedUnitId]);

  // Focus to a unit
  const handleFocusUnit = (amb: Ambulance) => {
    setSelectedUnitId(amb.id);
    const map = mapInstanceRef.current;
    if (map) {
      const lat = Number(amb.latitude);
      const lng = Number(amb.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 15, { duration: 1.2 });
        const marker = markersRef.current[amb.id];
        if (marker) {
          marker.openPopup();
        }
      }
    }
  };

  const handleResetPalembang = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(PALEMBANG_CENTER, 13, { duration: 1 });
      setSelectedUnitId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-4">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Peta Pemantauan Armada Palembang</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live GPS Radar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi sebaran posisi unit ambulans Seberang Ilir & Seberang Ulu secara interaktif
          </p>
        </div>

        {/* Toolbar Filter Status */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setMapFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapFilter === "all" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua ({total})
            </button>
            <button
              onClick={() => setMapFilter("tersedia")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapFilter === "tersedia" ? "bg-[#DCFCE7] text-[#16A34A] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tersedia ({tersedia})
            </button>
            <button
              onClick={() => setMapFilter("sedang_bertugas")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapFilter === "sedang_bertugas" ? "bg-[#FEF3C7] text-[#B45309] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bertugas ({bertugas})
            </button>
            <button
              onClick={() => setMapFilter("offline")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                mapFilter === "offline" ? "bg-[#F3F4F6] text-[#6B7280] shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Offline ({offline})
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Leaflet Map Container */}
      <div
        className={`relative h-[380px] w-full rounded-xl overflow-hidden border border-slate-300 shadow-inner transition-colors duration-300 ${
          mapTheme === "dark" ? "bg-slate-950" : "bg-slate-100"
        }`}
      >
        {/* Leaflet DOM Anchor */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Command Center HUD Bar (Top Left) */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-slate-950/85 text-white border border-slate-700/80 px-3 py-1.5 rounded-lg backdrop-blur-md text-xs font-semibold shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="tracking-wide">Command Center Palembang Siaga</span>
          </div>

          <div className="hidden md:inline-flex items-center gap-2 bg-slate-950/85 text-slate-300 border border-slate-700/80 px-2.5 py-1.5 rounded-lg backdrop-blur-md text-[11px]">
            <span className="text-emerald-400 font-bold">Ilir: {ilirCount}</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">Ulu: {uluCount}</span>
          </div>
        </div>

        {/* Floating Controls HUD (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {/* Segmented Theme Switcher (Mode Terang Default vs Radar Gelap) */}
          <div className="inline-flex items-center p-0.5 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-lg text-xs shadow-md">
            <button
              onClick={() => handleSetTheme("streets")}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                mapTheme === "streets"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-300 hover:text-white font-medium"
              }`}
              title="Aktifkan Mode Terang (Default)"
            >
              <span className="material-symbols-outlined text-sm text-amber-500">wb_sunny</span>
              <span>Terang</span>
            </button>
            <button
              onClick={() => handleSetTheme("dark")}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                mapTheme === "dark"
                  ? "bg-cyan-950 text-cyan-200 border border-cyan-700/60 shadow-xs font-bold"
                  : "text-slate-300 hover:text-white font-medium"
              }`}
              title="Aktifkan Radar Gelap"
            >
              <span className="material-symbols-outlined text-sm text-cyan-400">dark_mode</span>
              <span className="hidden sm:inline">Radar</span> Gelap
            </button>
          </div>

          {/* Reset Center Ampera */}
          <button
            onClick={handleResetPalembang}
            className="inline-flex items-center gap-1 bg-slate-900/85 hover:bg-slate-900 text-white border border-slate-700/80 px-2.5 py-1.5 rounded-lg backdrop-blur-md text-xs font-medium transition cursor-pointer shadow-md"
            title="Pusatkan ke Jembatan Ampera"
          >
            <span className="material-symbols-outlined text-sm">my_location</span>
            <span className="hidden sm:inline">Pusat Kota</span>
          </button>

          {/* Direct Manage Button */}
          {onNavigateToArmada && (
            <button
              onClick={onNavigateToArmada}
              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Kelola Armada</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </div>

        {/* Floating Mini Compass & River Badge (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 bg-slate-950/80 text-sky-300 border border-slate-800 px-2.5 py-1 rounded-md text-[10px] font-mono backdrop-blur-xs">
            <span className="material-symbols-outlined text-xs text-sky-400">waves</span>
            <span>Sungai Musi • Jembatan Ampera Coridor</span>
          </div>
        </div>
      </div>

      {/* Quick Interactive Fleet Unit Cards at Bottom of Map */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-blue-600">touch_app</span>
            Klik unit armada untuk fokus pada peta:
          </span>
          <span className="text-[11px] text-slate-400">
            {filteredAmbulances.length} unit terpantau
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {filteredAmbulances.slice(0, 3).map((amb) => {
            const isSelected = selectedUnitId === amb.id;
            return (
              <div
                key={amb.id}
                onClick={() => handleFocusUnit(amb)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-50/90 border-blue-500 shadow-sm ring-2 ring-blue-300/40"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 truncate">{amb.name}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      amb.status === "tersedia"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : amb.status === "sedang_bertugas"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {amb.status === "tersedia" ? "Siaga" : amb.status === "sedang_bertugas" ? "Bertugas" : "Offline"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{amb.provider?.name || amb.base_location}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-200/70">
                  <span className="font-mono font-semibold text-slate-700">{amb.unit_code}</span>
                  <span className="text-blue-600 font-medium hover:underline flex items-center gap-0.5">
                    <span>Fokus Peta</span>
                    <span className="material-symbols-outlined text-[11px]">pin_drop</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Quick List Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Menampilkan {filteredAmbulances.length} dari total {total} armada di Palembang
        </span>
        {onNavigateToArmada && (
          <button
            onClick={onNavigateToArmada}
            className="text-blue-700 hover:text-blue-900 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat seluruh rincian armada ({total} unit)</span>
            <span>&rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
}
