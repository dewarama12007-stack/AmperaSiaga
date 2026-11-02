"use client";

import React, { useState, useEffect } from "react";
import EmergencyHeader from "@/components/EmergencyHeader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AmbulanceFinder from "@/components/AmbulanceFinder";
import HowItWorks from "@/components/HowItWorks";
import Disclaimer from "@/components/Disclaimer";
import Footer from "@/components/Footer";
import FloatingEmergencyButton from "@/components/FloatingEmergencyButton";
import PreLocationPermissionModal from "@/components/PreLocationPermissionModal";
import AdminModal from "@/components/AdminModal";
import LocationNotFoundView from "@/components/LocationNotFoundView";
import { Ambulance } from "@/types";
import { fetchAmbulances, FALLBACK_AMBULANCES } from "@/lib/api";

export default function Home() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>(FALLBACK_AMBULANCES);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState({
    lat: -2.9760,
    lng: 104.7564,
    address: "Jl. Jenderal Sudirman, Palembang",
  });

  const [isPreLocationModalOpen, setIsPreLocationModalOpen] = useState(false);
  const [isLocationDenied, setIsLocationDenied] = useState(false);
  const [showLocationHelp, setShowLocationHelp] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" | "warning" } | null>(null);

  const showToast = (text: string, type: "success" | "info" | "warning" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load from Laravel API
  const loadAmbulances = async (lat?: number, lng?: number) => {
    setIsLoading(true);
    try {
      const data = await fetchAmbulances(lat ?? userLocation.lat, lng ?? userLocation.lng);
      setAmbulances(data);
    } catch (err) {
      console.error("Error loading ambulances:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAmbulances(userLocation.lat, userLocation.lng);
  }, []);

  // Actual Geolocation execution
  const handleActualGeolocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: "Titik Lokasi GPS Terdeteksi (Palembang)",
          };
          setUserLocation(newLoc);
          setIsLocationDenied(false);
          loadAmbulances(newLoc.lat, newLoc.lng);
          showToast("Lokasi Anda berhasil terdeteksi via GPS perangkat.", "success");
          const el = document.getElementById("cari-ambulans");
          el?.scrollIntoView({ behavior: "smooth" });
        },
        (err) => {
          console.warn("Geolocation denied or failed:", err);
          setIsLocationDenied(true);
          showToast("Akses GPS ditolak/tidak aktif. Anda dapat memilih titik lokasi di peta.", "warning");
          const el = document.getElementById("cari-ambulans");
          el?.scrollIntoView({ behavior: "smooth" });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsLocationDenied(true);
      showToast("Peramban Anda tidak mendukung deteksi lokasi otomatis.", "warning");
      const el = document.getElementById("cari-ambulans");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleUseMyLocationClick = () => {
    setIsPreLocationModalOpen(true);
  };

  const handleExploreMap = () => {
    const el = document.getElementById("cari-ambulans");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpdateLocation = (newLoc: { lat: number; lng: number; address: string }) => {
    setUserLocation(newLoc);
    setIsLocationDenied(false);
    loadAmbulances(newLoc.lat, newLoc.lng);
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen flex flex-col font-sans">
      {/* 1. Thin Emergency Top Strip */}
      <EmergencyHeader />

      {/* 2. Sticky Navbar with Brand & Hotlines */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-semibold ${
              toastMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : toastMessage.type === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-blue-50 border-blue-200 text-blue-900"
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">
              {toastMessage.type === "success"
                ? "check_circle"
                : toastMessage.type === "warning"
                ? "warning"
                : "info"}
            </span>
            <span className="flex-1">{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-slate-700 font-bold ml-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="grow">
        {showLocationHelp ? (
          <LocationNotFoundView
            onRetry={() => {
              setShowLocationHelp(false);
              handleActualGeolocation();
            }}
            onSelectManual={() => {
              setShowLocationHelp(false);
              const el = document.getElementById("cari-ambulans");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            onBackToFinder={() => setShowLocationHelp(false)}
          />
        ) : (
          <>
            {/* 3. Hero Section with Palembang Landmark Watermark */}
            <HeroSection
              onUseLocation={handleUseMyLocationClick}
              onExploreMap={handleExploreMap}
              nearestCount={ambulances.filter((a) => a.status === "tersedia").length}
              currentAddress={userLocation.address}
            />

            {/* 4. Split-View Ambulance Finder & Map */}
            <AmbulanceFinder
              ambulances={ambulances}
              isLoading={isLoading}
              userLocation={userLocation}
              onUpdateLocation={handleUpdateLocation}
              onRequestGeolocation={handleActualGeolocation}
              isLocationDenied={isLocationDenied}
              onShowLocationHelp={() => setShowLocationHelp(true)}
            />

            {/* 5. Cara Kerja - 4 Steps Guide */}
            <HowItWorks />

            {/* 6. Emergency Disclaimer */}
            <Disclaimer />
          </>
        )}
      </main>

      {/* 7. Comprehensive 4-Column Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* 8. Mobile Sticky Emergency Trigger */}
      <FloatingEmergencyButton />

      {/* S1: Pra-Izin Lokasi Modal */}
      <PreLocationPermissionModal
        isOpen={isPreLocationModalOpen}
        onClose={() => setIsPreLocationModalOpen(false)}
        onAllowLocation={handleActualGeolocation}
        onSelectManual={() => {
          setIsPreLocationModalOpen(false);
          const el = document.getElementById("cari-ambulans");
          el?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Portal Admin & Posko Modal */}
      {isAdminOpen && <AdminModal onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}
