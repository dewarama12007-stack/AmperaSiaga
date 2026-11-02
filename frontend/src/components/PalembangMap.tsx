"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import { Ambulance } from "@/types";

interface PalembangMapProps {
  ambulances: Ambulance[];
  selectedAmbulance: Ambulance | null;
  onSelectAmbulance: (ambulance: Ambulance) => void;
  userLocation: { lat: number; lng: number; address: string };
  onUpdateUserLocation: (newLoc: { lat: number; lng: number; address: string }) => void;
  onOpenContactFlow: (ambulance: Ambulance) => void;
  onOpenRoute: (ambulance: Ambulance) => void;
  showRoute?: boolean;
  onUpdateRouteMetrics?: (
    ambId: number,
    metrics: { distance_km: number; estimated_minutes: number; coordinates?: [number, number][] }
  ) => void;
}

import {
  calculateDistanceKm,
  estimateMinutes,
  isCrossingMusiRiver,
  getRoadRoute,
  AMPERA_BRIDGE,
} from "@/lib/geo";

export { calculateDistanceKm, estimateMinutes, isCrossingMusiRiver, getRoadRoute };

const PALEMBANG_LANDMARKS = [
  { name: "Simpang Charitas", lat: -2.9764, lng: 104.7534, district: "Ilir Timur I" },
  { name: "Jembatan Ampera (Pusat Kota)", lat: -2.9918, lng: 104.7634, district: "Pusat Palembang" },
  { name: "RSUP Dr. Mohammad Hoesin (RSMH)", lat: -2.9685, lng: 104.7483, district: "Kemuning" },
  { name: "RSUD Siti Fatimah (Km. 6)", lat: -2.9480, lng: 104.7351, district: "Sukarami" },
  { name: "RSI Siti Khadijah (Demang)", lat: -2.9713, lng: 104.7307, district: "Ilir Barat I" },
  { name: "Benteng Kuto Besak (BKB)", lat: -2.9915, lng: 104.7592, district: "Bukit Kecil" },
  { name: "PTC Mall (Jl. R. Sukamto)", lat: -2.9612, lng: 104.7678, district: "Ilir Timur II" },
  { name: "Jakabaring Sport City", lat: -3.0215, lng: 104.7925, district: "Seberang Ulu I" },
  { name: "RSUD Palembang BARI", lat: -3.01, lng: 104.77, district: "Seberang Ulu I" },
  { name: "Kawasan Plaju (Pertamina)", lat: -2.9928, lng: 104.8167, district: "Plaju" },
];

export default function PalembangMap({
  ambulances,
  selectedAmbulance,
  onSelectAmbulance,
  userLocation,
  onUpdateUserLocation,
  onOpenContactFlow,
  onOpenRoute,
  showRoute = true,
  onUpdateRouteMetrics,
}: PalembangMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const ambulanceMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeHaloRef = useRef<L.Polyline | null>(null);

  const onUpdateUserLocationRef = useRef(onUpdateUserLocation);
  useEffect(() => {
    onUpdateUserLocationRef.current = onUpdateUserLocation;
  });

  const [mapLayer, setMapLayer] = useState<"standard" | "satellite">("standard");
  const [searchQuery, setSearchQuery] = useState(userLocation.address);
  const [isSearching, setIsSearching] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [selectedRoadMetrics, setSelectedRoadMetrics] = useState<{
    distance: number;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    if (selectedAmbulance) {
      setIsCardVisible(true);
      if (selectedAmbulance.distance_km && selectedAmbulance.estimated_minutes) {
        setSelectedRoadMetrics({
          distance: selectedAmbulance.distance_km,
          minutes: selectedAmbulance.estimated_minutes,
        });
      } else {
        setSelectedRoadMetrics(null);
      }
    }
  }, [selectedAmbulance?.id]);

  // Real-time calculated distance and ETA for selected ambulance
  const selectedMetrics = useMemo(() => {
    if (!selectedAmbulance) return null;
    if (selectedRoadMetrics) {
      return selectedRoadMetrics;
    }
    const ambLat = Number(selectedAmbulance.latitude);
    const ambLng = Number(selectedAmbulance.longitude);
    const crosses = isCrossingMusiRiver(ambLat, userLocation.lat);
    const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, ambLat, ambLng);
    const time = estimateMinutes(dist, crosses);
    return { distance: dist, minutes: time };
  }, [selectedAmbulance, userLocation, selectedRoadMetrics]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Palembang center: around -2.985, 104.755
    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: false,
    });

    // Default OpenStreetMap standard tile layer (free, no API key watermark)
    const standardLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }
    ).addTo(map);

    tileLayerRef.current = standardLayer;
    mapInstanceRef.current = map;

    // Click on map to move user location!
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const addr = `Titik Palembang (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      onUpdateUserLocationRef.current({ lat, lng, address: addr });
      setSearchQuery(addr);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Layer Switch (Peta vs Satelit)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapLayer === "satellite") {
      tileLayerRef.current = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          maxZoom: 18,
        }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(map);
    }
  }, [mapLayer]);

  // 3. Render or Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const userHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
        <div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping pointer-events-none"></div>
        <div class="w-9 h-9 bg-[#1d4ed8] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover:scale-110">
          <span class="material-symbols-outlined text-base">my_location</span>
        </div>
        <div class="absolute -bottom-7 bg-[#131b2e] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap pointer-events-none">
          Titik Jemput Anda
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: "custom-user-marker",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", (e) => {
        const target = e.target as L.Marker;
        const pos = target.getLatLng();
        const addr = `Titik Geser (${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)})`;
        onUpdateUserLocation({ lat: pos.lat, lng: pos.lng, address: addr });
        setSearchQuery(addr);
      });

      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  // 4. Render or Update Ambulance Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(ambulanceMarkersRef.current).forEach((m) => map.removeLayer(m));
    ambulanceMarkersRef.current = {};

    ambulances.forEach((amb) => {
      const lat = Number(amb.latitude);
      const lng = Number(amb.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const isSelected = selectedAmbulance?.id === amb.id;
      let badgeColor = "#16a34a"; // green available
      if (amb.status === "sedang_bertugas") badgeColor = "#f59e0b"; // amber
      if (amb.status === "offline") badgeColor = "#94a3b8"; // gray

      const markerHtml = `
        <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          ${
            isSelected
              ? `<div class="absolute w-12 h-12 rounded-full animate-ping" style="background-color: ${badgeColor}33;"></div>`
              : ""
          }
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white transition-transform group-hover:scale-110 ${
            isSelected ? "ring-3 ring-[#1d4ed8]" : ""
          }" style="background-color: ${badgeColor};">
            <span class="material-symbols-outlined text-lg">ambulance</span>
          </div>
          <div class="mt-1 bg-white/95 px-1.5 py-0.5 rounded shadow-xs text-[10px] font-bold text-slate-800 border border-slate-200 whitespace-nowrap">
            ${amb.unit_code}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: "custom-amb-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectAmbulance(amb);
      });

      ambulanceMarkersRef.current[amb.id] = marker;
    });
  }, [ambulances, selectedAmbulance]);

  useEffect(() => {
    setSearchQuery(userLocation.address);
  }, [userLocation.address]);

  // 5. Render Route Polyline Between Selected Ambulance & User
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    if (routeHaloRef.current) {
      map.removeLayer(routeHaloRef.current);
      routeHaloRef.current = null;
    }

    if (!showRoute || !selectedAmbulance) return;

    const ambLat = Number(selectedAmbulance.latitude);
    const ambLng = Number(selectedAmbulance.longitude);
    if (isNaN(ambLat) || isNaN(ambLng)) return;

    let isCancelled = false;
    const controller = new AbortController();

    const drawRoute = (latlngs: L.LatLngExpression[]) => {
      if (routeHaloRef.current) {
        map.removeLayer(routeHaloRef.current);
      }
      if (routePolylineRef.current) {
        map.removeLayer(routePolylineRef.current);
      }

      // White outer halo
      const halo = L.polyline(latlngs, {
        color: "#FFFFFF",
        weight: 9,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // Blue high contrast route line
      const polyline = L.polyline(latlngs, {
        color: "#1D4ED8",
        weight: 5,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      routeHaloRef.current = halo;
      routePolylineRef.current = polyline;

      try {
        map.fitBounds(polyline.getBounds(), { padding: [60, 60], maxZoom: 16 });
      } catch (e) {}
    };

    // Fetch road route via cached helper
    getRoadRoute(
      { lat: ambLat, lng: ambLng },
      { lat: userLocation.lat, lng: userLocation.lng },
      controller.signal
    )
      .then((routeResult) => {
        if (isCancelled) return;
        drawRoute(routeResult.coordinates);
        setSelectedRoadMetrics({
          distance: routeResult.distanceKm,
          minutes: routeResult.estimatedMinutes,
        });
        onUpdateRouteMetrics?.(selectedAmbulance.id, {
          distance_km: routeResult.distanceKm,
          estimated_minutes: routeResult.estimatedMinutes,
          coordinates: routeResult.coordinates,
        });
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [selectedAmbulance?.id, userLocation.lat, userLocation.lng, showRoute]);

  // Helper Map Actions
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  const handleCenterUser = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.2 });
  };

  const handleSelectLandmark = (landmark: typeof PALEMBANG_LANDMARKS[0]) => {
    onUpdateUserLocation({
      lat: landmark.lat,
      lng: landmark.lng,
      address: landmark.name,
    });
    setSearchQuery(landmark.name);
    setIsSearching(false);
    mapInstanceRef.current?.flyTo([landmark.lat, landmark.lng], 15, { duration: 1.2 });
  };

  const syncedAmbulance = useMemo(() => {
    if (!selectedAmbulance) return null;
    return {
      ...selectedAmbulance,
      distance_km: selectedMetrics ? selectedMetrics.distance : selectedAmbulance.distance_km,
      estimated_minutes: selectedMetrics ? selectedMetrics.minutes : selectedAmbulance.estimated_minutes,
    };
  }, [selectedAmbulance, selectedMetrics]);

  const isCrossRiver =
    selectedAmbulance &&
    isCrossingMusiRiver(Number(selectedAmbulance.latitude), userLocation.lat);

  return (
    <div className="relative w-full h-[580px] sm:h-[620px] rounded-2xl overflow-hidden border border-[#c4c5d7] shadow-md bg-slate-100 select-none">
      {/* 1. Real Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. Floating Search Bar & Landmark Dropdown (Top Left) */}
      <div className="absolute top-4 left-4 z-20 w-72 max-w-[calc(100%-140px)]">
        <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-xl border border-[#c4c5d7] shadow-md">
          <span className="material-symbols-outlined text-slate-400 pl-3 text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearching(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jalan / landmark Palembang..."
            className="w-full bg-transparent border-0 text-xs py-2.5 px-2 focus:outline-hidden text-[#131b2e] font-semibold"
          />
          <button
            onClick={handleCenterUser}
            className="pr-3 text-[#1d4ed8] hover:text-[#1e40af] cursor-pointer"
            title="Pusatkan ke lokasi saya"
          >
            <span className="material-symbols-outlined text-base">my_location</span>
          </button>
        </div>

        {/* Dropdown Landmark Populer */}
        {isSearching && (
          <div className="mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
            <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
              <span>Landmark Populer Palembang</span>
              <button
                onClick={() => setIsSearching(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Tutup
              </button>
            </div>
            {PALEMBANG_LANDMARKS.map((lm, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLandmark(lm)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-[#eaedff] flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="truncate font-semibold text-[#131b2e]">{lm.name}</div>
                <div className="text-[10px] text-slate-400 shrink-0 ml-2">{lm.district}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Map Controls: Layer Switcher & Zoom (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Layer Switcher */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-[#c4c5d7] shadow-md p-1 flex">
          <button
            onClick={() => setMapLayer("standard")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
              mapLayer === "standard"
                ? "bg-[#1d4ed8] text-white shadow-xs"
                : "text-[#434655] hover:text-[#131b2e]"
            }`}
          >
            Peta
          </button>
          <button
            onClick={() => setMapLayer("satellite")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
              mapLayer === "satellite"
                ? "bg-[#1d4ed8] text-white shadow-xs"
                : "text-[#434655] hover:text-[#131b2e]"
            }`}
          >
            Satelit
          </button>
        </div>

        {/* Zoom & Crosshair Controls */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-[#c4c5d7] shadow-md flex flex-col items-center divide-y divide-[#c4c5d7] w-9">
          <button
            onClick={handleZoomIn}
            className="w-9 h-8 flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] rounded-t-xl cursor-pointer"
            title="Perbesar Peta"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-8 flex items-center justify-center text-[#131b2e] hover:bg-[#eaedff] cursor-pointer"
            title="Perkecil Peta"
          >
            <span className="material-symbols-outlined text-sm font-bold">remove</span>
          </button>
          <button
            onClick={handleCenterUser}
            className="w-9 h-8 flex items-center justify-center text-[#1d4ed8] hover:bg-[#eaedff] rounded-b-xl cursor-pointer"
            title="Pusatkan Lokasi Saya"
          >
            <span className="material-symbols-outlined text-sm">my_location</span>
          </button>
        </div>
      </div>

      {/* 4. Floating Selected Ambulance Card (Bottom Left/Center) */}
      {selectedAmbulance && isCardVisible && (
        <div className="absolute left-4 right-4 sm:left-6 sm:right-auto sm:w-[380px] bottom-6 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#c4c5d7] p-4 shadow-xl transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#1d4ed8] shrink-0">
                  <span className="material-symbols-outlined text-lg">ambulance</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#131b2e] truncate">{selectedAmbulance.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {selectedAmbulance.unit_code} • {selectedAmbulance.provider?.name || "Mitra Palembang"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedAmbulance.status === "tersedia"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedAmbulance.status === "sedang_bertugas"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedAmbulance.status === "tersedia"
                    ? "Tersedia"
                    : selectedAmbulance.status === "sedang_bertugas"
                    ? "Bertugas"
                    : "Offline"}
                </span>

                {/* Tombol X / Tutup Info Card */}
                <button
                  type="button"
                  onClick={() => setIsCardVisible(false)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Tutup info kartu untuk melihat peta penuh (bisa dibuka kembali)"
                  aria-label="Tutup info ambulans"
                >
                  <span className="material-symbols-outlined text-base font-bold">close</span>
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="my-2.5 flex items-baseline justify-between">
              <div className="text-lg sm:text-xl font-extrabold text-[#1d4ed8]">
                {selectedMetrics?.distance || selectedAmbulance.distance_km || 2.4} km{" "}
                <span className="text-slate-300 font-normal">•</span>{" "}
                <span className="text-[#131b2e]">
                  {selectedMetrics?.minutes || selectedAmbulance.estimated_minutes || 8} menit
                </span>
              </div>
              <div>
                {isCrossRiver ? (
                  <span className="px-1.5 py-0.5 bg-blue-50 text-[#1d4ed8] border border-blue-200 rounded text-[10px] font-bold">
                    via Jembatan Ampera
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    <span>Rute Terverifikasi</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => onOpenRoute(syncedAmbulance || selectedAmbulance)}
                className="h-10 flex-1 border border-slate-300 hover:border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#eaedff] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">alt_route</span>
                <span>Rute Jalur</span>
              </button>
              <button
                onClick={() => onOpenContactFlow(syncedAmbulance || selectedAmbulance)}
                className="h-10 flex-1 bg-[#0F7B6C] hover:bg-[#0B5E53] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>Hubungi Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Floating Pill to Re-open Card in PalembangMap */}
      {selectedAmbulance && !isCardVisible && (
        <div className="absolute left-4 bottom-6 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            type="button"
            onClick={() => setIsCardVisible(true)}
            className="bg-white/95 backdrop-blur-md hover:bg-white text-slate-900 border border-[#c4c5d7] px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-[#1d4ed8]/20 group"
            title="Klik untuk menampilkan kembali informasi ambulans terpilih"
          >
            <div className="w-6 h-6 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#1d4ed8] group-hover:bg-[#1d4ed8] group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-sm">ambulance</span>
            </div>
            <span>
              Tampilkan Info {selectedAmbulance.name} (
              {selectedMetrics?.distance || selectedAmbulance.distance_km || 2.4} km)
            </span>
            <span className="material-symbols-outlined text-base text-[#1d4ed8]">expand_less</span>
          </button>
        </div>
      )}

      {/* 5. Status Legend (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 text-xs flex items-center gap-3 text-slate-700 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400">Unit:</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span className="text-[11px]">Tersedia</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span className="text-[11px]">Bertugas</span>
        </span>
      </div>

      {/* Tip helper at top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] text-slate-600 border border-slate-200 hidden md:flex items-center gap-1 shadow-xs pointer-events-none">
        <span className="material-symbols-outlined text-xs text-[#1d4ed8]">info</span>
        <span>Ketuk peta atau geser penanda biru untuk ubah titik jemput</span>
      </div>
    </div>
  );
}
