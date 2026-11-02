"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Ambulance } from "@/types";
import { logContactRequest } from "@/lib/api";
import WhatsAppConfirmModal from "./WhatsAppConfirmModal";
import QuickInfoFormModal from "./QuickInfoFormModal";
import {
  calculateDistanceKm,
  estimateMinutes,
  isCrossingMusiRiver,
  getRoadRoute,
} from "@/lib/geo";

const PalembangMap = dynamic(() => import("./PalembangMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[580px] sm:h-[620px] rounded-2xl border border-[#c4c5d7] bg-slate-100 flex flex-col items-center justify-center gap-3 shadow-md">
      <div className="w-10 h-10 border-4 border-[#1d4ed8] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs text-slate-500 font-bold">Memuat Peta Interaktif Palembang...</p>
    </div>
  ),
});

const AmbulanceRouteModal = dynamic(() => import("./AmbulanceRouteModal"), { ssr: false });
const ManualLocationModal = dynamic(() => import("./ManualLocationModal"), { ssr: false });
const AmbulanceDetailModal = dynamic(() => import("./AmbulanceDetailModal"), { ssr: false });

interface AmbulanceFinderProps {
  ambulances: Ambulance[];
  isLoading?: boolean;
  userLocation: { lat: number; lng: number; address: string };
  onUpdateLocation: (newLocation: { lat: number; lng: number; address: string }) => void;
  onRequestGeolocation?: () => void;
  isLocationDenied?: boolean;
  onShowLocationHelp?: () => void;
}

export default function AmbulanceFinder({
  ambulances,
  isLoading = false,
  userLocation,
  onUpdateLocation,
  onRequestGeolocation,
  isLocationDenied = false,
  onShowLocationHelp,
}: AmbulanceFinderProps) {
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(userLocation.address);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [newAddressInput, setNewAddressInput] = useState(userLocation.address);
  const [showRoutePolyline, setShowRoutePolyline] = useState(true);

  // Modals from Stitch screens
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isManualLocationOpen, setIsManualLocationOpen] = useState(false);
  const [activeAmbulance, setActiveAmbulance] = useState<Ambulance | null>(null);
  const [recentTicket, setRecentTicket] = useState<{
    id: number;
    ambulanceName: string;
    unitCode: string;
    phone: string;
    status: string;
    time: string;
  } | null>(null);
  const [activeModalTicketId, setActiveModalTicketId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nama: "",
    telepon: "",
    lokasi: userLocation.address,
    koordinat: `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`,
    keterangan: "",
  });

  const ADMIN_WHATSAPP = "6282162319964";
  const ambulanceWhatsApp = ADMIN_WHATSAPP;

  // Dynamic real road route metrics cache mapped by ambulance ID
  const [routeMetricsMap, setRouteMetricsMap] = useState<
    Record<
      number,
      {
        distance_km: number;
        estimated_minutes: number;
        is_real_road: boolean;
        coordinates?: [number, number][];
      }
    >
  >({});

  // Centralized callback to update road route metrics from Map or RouteModal
  const handleUpdateRouteMetrics = React.useCallback(
    (
      ambId: number,
      metrics: { distance_km: number; estimated_minutes: number; coordinates?: [number, number][] }
    ) => {
      setRouteMetricsMap((prev) => {
        const existing = prev[ambId];
        if (
          existing &&
          existing.distance_km === metrics.distance_km &&
          existing.estimated_minutes === metrics.estimated_minutes
        ) {
          return prev;
        }
        return {
          ...prev,
          [ambId]: {
            distance_km: metrics.distance_km,
            estimated_minutes: metrics.estimated_minutes,
            is_real_road: true,
            coordinates: metrics.coordinates,
          },
        };
      });
    },
    []
  );

  // Dynamic Distance & Duration calculation based on userLocation + live road metrics
  const ambulancesWithDistance = useMemo(() => {
    return ambulances.map((amb) => {
      const ambLat = Number(amb.latitude);
      const ambLng = Number(amb.longitude);
      const cached = routeMetricsMap[amb.id];

      if (cached) {
        return {
          ...amb,
          distance_km: cached.distance_km,
          estimated_minutes: cached.estimated_minutes,
        };
      }

      const hasCoords = !isNaN(ambLat) && !isNaN(ambLng) && ambLat !== 0 && ambLng !== 0;
      const crosses = hasCoords ? isCrossingMusiRiver(ambLat, userLocation.lat) : false;
      const dist = hasCoords
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, ambLat, ambLng)
        : (amb.distance_km || 2.4);
      const minutes = estimateMinutes(dist, crosses);

      return {
        ...amb,
        distance_km: dist,
        estimated_minutes: minutes,
      };
    });
  }, [ambulances, userLocation.lat, userLocation.lng, routeMetricsMap]);

  // Filter & Sort: nearest available units first
  const sortedFilteredAmbulances = useMemo(() => {
    return ambulancesWithDistance
      .filter((item) => {
        if (filterStatus === "tersedia") return item.status === "tersedia";
        if (filterStatus === "icu") return item.has_icu;
        if (filterStatus === "standby")
          return item.status === "tersedia" || item.status === "sedang_bertugas";
        return true;
      })
      .sort((a, b) => {
        // Priority 1: Status (tersedia > sedang_bertugas > offline)
        const statusOrder: Record<string, number> = { tersedia: 1, sedang_bertugas: 2, offline: 3 };
        const orderA = statusOrder[a.status] || 99;
        const orderB = statusOrder[b.status] || 99;
        if (orderA !== orderB) return orderA - orderB;

        // Priority 2: Distance ascending
        return (a.distance_km || 0) - (b.distance_km || 0);
      });
  }, [ambulancesWithDistance, filterStatus]);

  // Synchronized selected ambulance with latest calculated distance
  const currentSelectedAmbulance = useMemo(() => {
    if (!selectedAmbulance) {
      return sortedFilteredAmbulances[0] || null;
    }
    return (
      sortedFilteredAmbulances.find((a) => a.id === selectedAmbulance.id) ||
      sortedFilteredAmbulances[0] ||
      null
    );
  }, [selectedAmbulance, sortedFilteredAmbulances]);

  // Pre-fetch exact road route for current selected or nearest available unit
  React.useEffect(() => {
    if (!currentSelectedAmbulance) return;
    const amb = currentSelectedAmbulance;
    const ambLat = Number(amb.latitude);
    const ambLng = Number(amb.longitude);
    if (isNaN(ambLat) || isNaN(ambLng) || ambLat === 0 || ambLng === 0) return;

    let isMounted = true;
    const controller = new AbortController();

    getRoadRoute(
      { lat: ambLat, lng: ambLng },
      { lat: userLocation.lat, lng: userLocation.lng },
      controller.signal
    ).then((route) => {
      if (!isMounted) return;
      handleUpdateRouteMetrics(amb.id, {
        distance_km: route.distanceKm,
        estimated_minutes: route.estimatedMinutes,
        coordinates: route.coordinates,
      });
    });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [currentSelectedAmbulance?.id, userLocation.lat, userLocation.lng, handleUpdateRouteMetrics]);

  // Helper to ensure any action passes the fully synchronized ambulance object
  const getSyncedAmbulance = (amb: Ambulance): Ambulance => {
    return sortedFilteredAmbulances.find((a) => a.id === amb.id) || amb;
  };

  const handleSelectAmbulance = (ambulance: Ambulance) => {
    const synced = getSyncedAmbulance(ambulance);
    setSelectedAmbulance(synced);
    setShowRoutePolyline(true);
  };

  const handleOpenContactFlow = (ambulance: Ambulance) => {
    const synced = getSyncedAmbulance(ambulance);
    setActiveAmbulance(synced);
    setSelectedAmbulance(synced);
    setFormData((prev) => ({
      ...prev,
      lokasi: userLocation.address,
      koordinat: `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`,
    }));
    setIsInfoModalOpen(true);
  };

  const handleFormSubmitted = async (data: typeof formData) => {
    setFormData(data);
    setIsInfoModalOpen(false);

    let loggedTicketId: number | null = null;
    if (activeAmbulance) {
      try {
        const res = await logContactRequest({
          ambulance_id: activeAmbulance.id,
          user_name: data.nama,
          user_phone: data.telepon,
          user_latitude: userLocation.lat,
          user_longitude: userLocation.lng,
          user_address: data.lokasi,
          patient_condition: data.keterangan || "Memerlukan penjemputan darurat segera",
        });

        if (res.success && res.data) {
          loggedTicketId = res.data.id;
          setActiveModalTicketId(res.data.id);
          setRecentTicket({
            id: res.data.id,
            ambulanceName: activeAmbulance.name,
            unitCode: activeAmbulance.unit_code,
            phone: activeAmbulance.driver_phone || activeAmbulance.whatsapp_number,
            status: "Menunggu Konfirmasi Operator",
            time: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
          });
        }
      } catch (err) {
        console.error("Failed to log contact request:", err);
      }
    }

    setActiveModalTicketId(loggedTicketId);
    setIsConfirmModalOpen(true);
  };

  const handleOpenRoute = (ambulance: Ambulance) => {
    const synced = getSyncedAmbulance(ambulance);
    setSelectedAmbulance(synced);
    setActiveAmbulance(synced);
    setIsRouteModalOpen(true);
  };

  const handleOpenDetail = (ambulance: Ambulance) => {
    const synced = getSyncedAmbulance(ambulance);
    setSelectedAmbulance(synced);
    setActiveAmbulance(synced);
    setIsDetailModalOpen(true);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLocation({
      ...userLocation,
      address: newAddressInput,
    });
    setSearchQuery(newAddressInput);
    setIsEditingLocation(false);
  };

  return (
    <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full" id="cari-ambulans">
      {/* Section Title & Subtitle */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-[#1d4ed8] mb-1">
              Pencarian & Pemetaan Terpadu
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#131b2e]">
              Ambulans di Sekitar Anda
            </h2>
            <p className="text-sm md:text-base text-[#434655] mt-1">
              Data ketersediaan terhubung ke database Laravel di wilayah Kota Palembang.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === "all"
                  ? "bg-[#1d4ed8] text-white shadow-xs"
                  : "bg-[#eaedff] text-[#131b2e] hover:bg-slate-200"
              }`}
            >
              Semua ({ambulances.length})
            </button>
            <button
              onClick={() => setFilterStatus("tersedia")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterStatus === "tersedia"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Tersedia
            </button>
            <button
              onClick={() => setFilterStatus("icu")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === "icu"
                  ? "bg-[#0f7b6c] text-white shadow-xs"
                  : "bg-[#e2e7ff] text-[#004e44] hover:bg-slate-200"
              }`}
            >
              ICU Mobile
            </button>
          </div>
        </div>
      </div>

      {/* Split View Container: Left List Panel + Right Full Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KIRI: PANEL LIST AMBULANS */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* User Location Address Chip Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#c4c5d7] shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-[#dce1ff] text-[#1d4ed8] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined fill text-xl">location_on</span>
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] text-[#434655] font-semibold">Lokasi Anda Sekarang</div>
                  <div className="text-sm font-bold text-[#131b2e] truncate">{userLocation.address}</div>
                </div>
              </div>
              <button
                onClick={() => setIsManualLocationOpen(true)}
                className="text-xs font-bold text-[#1d4ed8] hover:text-[#1e40af] px-3 py-1.5 rounded-lg hover:bg-[#eaedff] transition-colors cursor-pointer shrink-0"
              >
                Ubah
              </button>
            </div>
            {isLocationDenied && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  GPS perangkat tidak aktif / ditolak
                </span>
                {onShowLocationHelp && (
                  <button
                    onClick={onShowLocationHelp}
                    className="text-[#1d4ed8] font-bold hover:underline cursor-pointer text-[11px]"
                  >
                    Panduan Lokasi &rarr;
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Edit Location Dialog */}
          {isEditingLocation && (
            <form
              onSubmit={handleSaveLocation}
              className="p-3 bg-white rounded-xl border-2 border-[#1d4ed8] shadow-md flex items-center gap-2"
            >
              <input
                type="text"
                value={newAddressInput}
                onChange={(e) => setNewAddressInput(e.target.value)}
                placeholder="Masukkan alamat di Palembang..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#1d4ed8] text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsEditingLocation(false)}
                className="px-2 py-2 text-slate-500 text-xs hover:bg-slate-100 rounded-lg shrink-0 cursor-pointer"
              >
                Batal
              </button>
            </form>
          )}

          {/* Banner Status Permintaan Darurat Terkini */}
          {recentTicket && (
            <div className="bg-emerald-50 border-2 border-emerald-500/60 rounded-2xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className="material-symbols-outlined text-emerald-600 text-2xl shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-md">
                        Tiket #AMP-{String(recentTicket.id).padStart(4, "0")}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {recentTicket.time} WIB
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                      Panggilan tercatat untuk unit {recentTicket.ambulanceName} ({recentTicket.unitCode})
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Status: <span className="font-semibold text-emerald-700">{recentTicket.status}</span>.
                      Telah tersinkronisasi ke dashboard operator siaga.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRecentTicket(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-emerald-100/60 transition-colors cursor-pointer shrink-0"
                  title="Tutup banner"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
            {isLoading ? (
              /* Stitch State Loading: Header Spinner + Shimmer Skeleton Stack */
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-4 border border-[#c4c5d7] flex items-center gap-3.5 shadow-xs">
                  <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                    <svg className="animate-spin w-7 h-7 text-[#1d4ed8]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-80" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor"></path>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#131b2e] truncate">Mencari ambulans di sekitar Anda…</h3>
                    <p className="text-xs text-[#434655] truncate">Memindai unit terdekat di area Palembang...</p>
                  </div>
                </div>

                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-2xl p-5 border border-[#c4c5d7] shadow-xs space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-2 flex-1">
                        <div className="h-4.5 w-3/5 rounded-md shimmer-effect"></div>
                        <div className="h-3.5 w-2/5 rounded-md shimmer-effect"></div>
                      </div>
                      <div className="h-7 w-24 rounded-full shimmer-effect"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#f2f3ff] rounded-xl border border-slate-100">
                      <div className="h-7 rounded-lg shimmer-effect"></div>
                      <div className="h-7 rounded-lg shimmer-effect"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="h-10 rounded-xl shimmer-effect"></div>
                      <div className="h-10 rounded-xl shimmer-effect"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedFilteredAmbulances.length === 0 ? (
              /* Stitch State Kosong: Empty State View */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 flex flex-col items-center text-center animate-in fade-in duration-200">
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1d4ed8] mb-3.5">
                  <svg className="w-8 h-8 text-[#1d4ed8]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="10" cy="10" r="7"></circle>
                    <line x1="21" y1="21" x2="15" y2="15"></line>
                    <line x1="7" y1="10" x2="13" y2="10"></line>
                  </svg>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#131b2e] mb-1.5 leading-snug max-w-[320px]">
                  Belum ada ambulans tersedia di sekitar lokasi Anda
                </h3>
                <p className="text-xs text-[#434655] mb-5 max-w-[300px] leading-relaxed">
                  Anda tetap bisa menghubungi admin untuk dibantu mencarikan layanan tanggap darurat Palembang.
                </p>

                <div className="w-full space-y-2.5">
                  <a
                    href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(`Halo Admin AmperaSiaga, saya membutuhkan bantuan ambulans darurat di sekitar lokasi: ${userLocation.address} (${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}). Mohon dibantu pengecekan armada.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 bg-[#0F7B6C] hover:bg-[#0B5E53] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">chat</span>
                    <span>Hubungi Admin WhatsApp Siaga</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (filterStatus !== "all") {
                        setFilterStatus("all");
                      } else {
                        setIsManualLocationOpen(true);
                      }
                    }}
                    className="w-full h-11 border border-slate-300 hover:border-[#1d4ed8] bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg text-slate-500">tune</span>
                    <span>{filterStatus !== "all" ? "Tampilkan Semua Ambulans" : "Ubah Lokasi atau Radius"}</span>
                  </button>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 w-full text-center">
                  <p className="text-[11px] text-[#434655]">
                    Situasi kritis?{" "}
                    <a href="tel:119" className="font-bold text-[#bb0112] hover:underline">
                      Hubungi langsung PSC 119 / 112 Palembang
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              sortedFilteredAmbulances.map((ambulance, index) => {
                const isSelected = currentSelectedAmbulance?.id === ambulance.id;
                const isFirstAvailable = index === 0 && ambulance.status === "tersedia";

                return (
                  <div
                    key={ambulance.id}
                    onClick={() => handleSelectAmbulance(ambulance)}
                    className={`bg-white rounded-2xl p-5 transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-2 border-[#1d4ed8] shadow-lg ring-2 ring-[#1d4ed8]/20"
                        : "border border-[#c4c5d7] shadow-xs hover:border-[#1d4ed8]/60 hover:shadow-md"
                    }`}
                  >
                    {/* Top Badge Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {isFirstAvailable ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#dce1ff] text-[#1d4ed8] font-bold text-xs">
                          <span className="material-symbols-outlined text-sm fill">bolt</span>
                          <span>Estimasi tercepat</span>
                        </span>
                      ) : (
                        <span className="text-xs text-[#434655] font-semibold truncate">
                          {ambulance.base_location || "Unit Siaga Palembang"}
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isCrossingMusiRiver(Number(ambulance.latitude), userLocation.lat) && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1d4ed8] text-[10px] font-bold">
                            via Jembatan Ampera
                          </span>
                        )}
                        {/* Status Badge */}
                        {ambulance.status === "tersedia" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                            Tersedia
                          </span>
                        )}
                        {ambulance.status === "sedang_bertugas" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Sedang Bertugas
                          </span>
                        )}
                        {ambulance.status === "offline" && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-600 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            Offline
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Unit Info */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-[#131b2e]">{ambulance.name}</h3>
                          {ambulance.has_icu && (
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                              ICU
                            </span>
                          )}
                          {ambulance.has_oxygen && (
                            <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
                              O2
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#434655] font-medium mt-0.5">
                          ID Unit: {ambulance.unit_code} • {ambulance.provider?.name || "Mitra Palembang"}
                        </p>
                      </div>
                    </div>

                    {/* Metrik Grid (Jarak & Durasi) Real Time */}
                    <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-[#f2f3ff] rounded-xl border border-[#c4c5d7]/50">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#1d4ed8] text-xl">distance</span>
                        <div>
                          <div className="text-xs text-[#434655]">Jarak Rute Jalan</div>
                          <div className="text-sm font-bold text-[#131b2e]">
                            {ambulance.distance_km} km
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 border-l border-[#c4c5d7] pl-3">
                        <span className="material-symbols-outlined text-[#0f7b6c] text-xl">schedule</span>
                        <div>
                          <div className="text-xs text-[#434655]">Durasi Tiba</div>
                          <div className="text-sm font-bold text-[#0f7b6c]">
                            Estimasi {ambulance.estimated_minutes} menit
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Caption Metric */}
                    <p className="text-[12px] text-[#434655] mb-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 truncate">
                        <span className="material-symbols-outlined text-sm text-[#1d4ed8]">alt_route</span>
                        <span className="truncate">
                          {isCrossingMusiRiver(Number(ambulance.latitude), userLocation.lat)
                            ? "Rute melintasi Koridor Jembatan Ampera"
                            : "Rute jalan protokol tercepat ke lokasi"}
                        </span>
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        Sinkron Rute
                      </span>
                    </p>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenRoute(ambulance)}
                        className={`min-h-[44px] px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#1d4ed8] text-white border-[#1d4ed8]"
                            : "border-[#747686] hover:border-[#1d4ed8] text-[#131b2e] hover:bg-[#eaedff]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">alt_route</span>
                        <span>Lihat Rute</span>
                      </button>
                      <button
                        onClick={() => handleOpenContactFlow(ambulance)}
                        className="min-h-[44px] px-3 rounded-xl bg-[#0f7b6c] hover:bg-[#0b5e53] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined fill text-lg">chat</span>
                        <span>Hubungi Admin</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Note Bawah Kartu */}
          <div className="p-3.5 rounded-xl bg-[#eaedff]/60 border border-[#c4c5d7] text-xs text-[#434655] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-base text-[#1d4ed8] shrink-0 mt-0.5">verified_user</span>
            <span>Admin WhatsApp siaga 24 jam untuk koordinasi konvoi dan penjemputan darurat Palembang.</span>
          </div>
        </div>

        {/* KANAN: AREA PETA BESAR PALEMBANG CARTOGRAPHY INTERAKTIF (LEAFLET + OSM) */}
        <div className="lg:col-span-7">
          <PalembangMap
            ambulances={sortedFilteredAmbulances}
            selectedAmbulance={currentSelectedAmbulance}
            onSelectAmbulance={(amb) => {
              setSelectedAmbulance(amb);
            }}
            userLocation={userLocation}
            onUpdateUserLocation={(newLoc) => {
              onUpdateLocation(newLoc);
              setNewAddressInput(newLoc.address);
              setSearchQuery(newLoc.address);
            }}
            onOpenContactFlow={handleOpenContactFlow}
            onOpenRoute={handleOpenRoute}
            showRoute={showRoutePolyline}
            onUpdateRouteMetrics={handleUpdateRouteMetrics}
          />
        </div>
      </div>

      {/* MODAL 1: Form Informasi Singkat (Screen 3) */}
      <QuickInfoFormModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        ambulance={activeAmbulance || currentSelectedAmbulance}
        userLocation={userLocation}
        initialData={formData}
        onSubmit={handleFormSubmitted}
        onOpenManualLocation={() => {
          setIsInfoModalOpen(false);
          setIsManualLocationOpen(true);
        }}
      />

      {/* MODAL 2: Konfirmasi Buka WhatsApp (Screen 1) */}
      <WhatsAppConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        ambulance={activeAmbulance || currentSelectedAmbulance}
        formData={formData}
        adminPhone={ambulanceWhatsApp}
        ticketId={activeModalTicketId || recentTicket?.id}
      />

      {/* MODAL 3: Tampilan Rute Ambulans (Screen 2) */}
      <AmbulanceRouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        ambulance={activeAmbulance || currentSelectedAmbulance}
        userLocation={userLocation}
        onContactWhatsApp={(amb) => {
          setIsRouteModalOpen(false);
          handleOpenContactFlow(amb);
        }}
        adminPhone={ambulanceWhatsApp}
        onRouteCalculated={handleUpdateRouteMetrics}
      />

      {/* MODAL 4: Izin Lokasi & Pilih Manual (Screen 4) */}
      <ManualLocationModal
        isOpen={isManualLocationOpen}
        onClose={() => setIsManualLocationOpen(false)}
        currentLocation={userLocation}
        isDenied={isLocationDenied}
        onSelectLocation={(newLoc) => {
          onUpdateLocation(newLoc);
          setNewAddressInput(newLoc.address);
          setSearchQuery(newLoc.address);
        }}
        onRequestGeolocation={onRequestGeolocation}
      />

      {/* MODAL 5: Detail Ambulans A (Screen 5) */}
      <AmbulanceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        ambulance={activeAmbulance || currentSelectedAmbulance}
        userLocation={userLocation}
        onViewRoute={(amb) => {
          setIsDetailModalOpen(false);
          handleOpenRoute(amb);
        }}
        onContactWhatsApp={(amb) => {
          setIsDetailModalOpen(false);
          handleOpenContactFlow(amb);
        }}
      />
    </section>
  );
}
