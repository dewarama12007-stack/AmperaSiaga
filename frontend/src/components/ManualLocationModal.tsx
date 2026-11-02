"use client";

import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";

interface ManualLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: { lat: number; lng: number; address: string };
  onSelectLocation: (location: { lat: number; lng: number; address: string }) => void;
  onRequestGeolocation?: () => void;
  isDenied?: boolean;
}

const PALEMBANG_PRESETS = [
  { name: "Jl. Jenderal Sudirman (Simpang Charitas)", lat: -2.9764, lng: 104.7534, district: "Ilir Timur I" },
  { name: "Jl. Demang Lebar Daun (Depan RSI Siti Khadijah)", lat: -2.9713, lng: 104.7307, district: "Ilir Barat I" },
  { name: "Jl. Kol. H. Burlian Km. 6 (RSUD Siti Fatimah)", lat: -2.9480, lng: 104.7351, district: "Sukarami" },
  { name: "Jl. R. Sukamto (Depan PTC Mall)", lat: -2.9612, lng: 104.7678, district: "Ilir Timur II" },
  { name: "Jl. KH. Wahid Hasyim (Seberang Ulu I)", lat: -3.0042, lng: 104.7612, district: "Seberang Ulu I" },
  { name: "Kawasan Komperta Plaju (Jl. Pengantingan)", lat: -2.9928, lng: 104.8167, district: "Plaju" },
  { name: "Jl. Kolonel Atmo (Pusat Kota)", lat: -2.9812, lng: 104.7598, district: "Ilir Timur I" },
  { name: "Kawasan Jakabaring Sport City", lat: -3.0215, lng: 104.7925, district: "Seberang Ulu I" },
];

export default function ManualLocationModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onRequestGeolocation,
  isDenied = false,
}: ManualLocationModalProps) {
  const [searchQuery, setSearchQuery] = useState(currentLocation.address);
  const [selectedCoords, setSelectedCoords] = useState({
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });
  const [selectedAddress, setSelectedAddress] = useState(currentLocation.address);
  const [selectedDistrict, setSelectedDistrict] = useState("Ilir Timur I");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Sync state if currentLocation changes when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCoords({ lat: currentLocation.lat, lng: currentLocation.lng });
      setSelectedAddress(currentLocation.address);
      setSearchQuery(currentLocation.address);
    }
  }, [isOpen, currentLocation]);

  // Initialize or update interactive Leaflet map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedCoords.lat, selectedCoords.lng],
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const userHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
          <div class="w-10 h-10 bg-[#1d4ed8] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span class="material-symbols-outlined text-lg">my_location</span>
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        html: userHtml,
        className: "custom-pick-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([selectedCoords.lat, selectedCoords.lng], {
        icon: markerIcon,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", (e) => {
        const target = e.target as L.Marker;
        const pos = target.getLatLng();
        const addr = `Titik Palembang (${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)})`;
        setSelectedCoords({ lat: pos.lat, lng: pos.lng });
        setSelectedAddress(addr);
        setSearchQuery(addr);
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        const addr = `Titik Palembang (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        setSelectedCoords({ lat, lng });
        setSelectedAddress(addr);
        setSearchQuery(addr);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } else {
      mapInstanceRef.current.invalidateSize();
      markerRef.current?.setLatLng([selectedCoords.lat, selectedCoords.lng]);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChoosePreset = (preset: typeof PALEMBANG_PRESETS[0]) => {
    setSelectedCoords({ lat: preset.lat, lng: preset.lng });
    setSelectedAddress(preset.name);
    setSearchQuery(preset.name);
    setSelectedDistrict(preset.district);

    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([preset.lat, preset.lng]);
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], 15, { duration: 1 });
    }
  };

  const handleConfirm = () => {
    onSelectLocation({
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
      address: selectedAddress || searchQuery,
    });
    onClose();
  };

  return (
    <div
      className="bg-slate-950/75 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Warning banner ONLY if isDenied is true, else clean standard header */}
        {isDenied ? (
          <div className="bg-[#fffbeb] border-b border-[#fef3c7] p-3 sm:px-6 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#92400e]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#d97706] text-xl">location_off</span>
              <div>
                <strong className="font-bold">Izin lokasi GPS tidak aktif atau ditolak.</strong>{" "}
                <span>Anda dapat memilih titik jemput secara manual di peta wilayah Kota Palembang.</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-lg leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
              <span className="material-symbols-outlined text-[#1d4ed8]">pin_drop</span>
              <span>Pilih Titik Penjemputan di Palembang</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 sm:p-6 gap-6">
          {/* Left Panel */}
          <aside className="w-full lg:w-[400px] flex flex-col gap-4 shrink-0">
            {/* Search Input Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Alamat atau nama lokasi penjemputan
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedAddress(e.target.value);
                  }}
                  placeholder="Ketik nama jalan atau landmark Palembang..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1d4ed8]"
                />
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="bg-[#eaedff]/70 border border-[#c4c5d7]/60 p-3 rounded-xl flex items-center gap-2.5 text-xs text-[#1d4ed8]">
              <span className="material-symbols-outlined text-lg shrink-0">touch_app</span>
              <span>Ketuk langsung peta di kanan atau pilih titik strategis Palembang di bawah ini.</span>
            </div>

            {/* Preset Palembang Locations */}
            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Titik Populer Palembang
              </span>
              {PALEMBANG_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoosePreset(p)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    selectedAddress === p.name
                      ? "border-[#1d4ed8] bg-[#eaedff] font-bold text-[#1d4ed8]"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="truncate pr-2">{p.name}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{p.district}</span>
                </button>
              ))}
            </div>

            {/* Selected Coordinates Card */}
            <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  TITIK KOORDINAT TERPILIH
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                  Aktif
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-slate-800">
                {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)}
              </div>
              <div className="text-xs text-slate-600 truncate flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#1d4ed8]">location_on</span>
                <span>{selectedAddress}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleConfirm}
                className="w-full h-11 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Gunakan Lokasi Ini</span>
              </button>

              {onRequestGeolocation && (
                <button
                  type="button"
                  onClick={() => {
                    onRequestGeolocation();
                    onClose();
                  }}
                  className="w-full text-center text-xs text-[#1d4ed8] hover:underline font-semibold py-1.5 cursor-pointer flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">my_location</span>
                  <span>Coba izinkan lokasi GPS lagi</span>
                </button>
              )}
            </div>
          </aside>

          {/* Right Interactive Leaflet Map Container */}
          <section className="flex-1 relative rounded-2xl overflow-hidden border border-[#c4c5d7] bg-slate-100 min-h-[380px] flex flex-col">
            <div ref={mapContainerRef} className="w-full h-full z-0 flex-1" />

            {/* Instruction Overlay Top */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex items-center gap-2 shadow-xs z-10 pointer-events-none">
              <span className="material-symbols-outlined text-sm text-[#1d4ed8]">ads_click</span>
              <span className="font-semibold text-slate-700">Klik atau geser penanda untuk ubah titik jemput</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
