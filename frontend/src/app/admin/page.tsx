"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import AdminLoginView from "@/components/admin/AdminLoginView";
import AdminDashboardView from "@/components/admin/AdminDashboardView";
import AdminArmadaView from "@/components/admin/AdminArmadaView";
import AdminAddEditView from "@/components/admin/AdminAddEditView";
import AdminRiwayatPermintaanView from "@/components/admin/AdminRiwayatPermintaanView";
import AdminDetailPermintaanDrawer, { EmergencyRequestItem } from "@/components/admin/AdminDetailPermintaanDrawer";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";
import AdminProfileModal from "@/components/admin/AdminProfileModal";
import { Ambulance, Provider } from "@/types";
import {
  fetchAmbulances,
  fetchProviders,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
  fetchContactRequests,
  updateContactRequestStatus,
  adminLogout,
  adminGetMe,
  FALLBACK_AMBULANCES,
} from "@/lib/api";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{ id?: number; name?: string; email?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "armada" | "permintaan" | "tambah_edit">("dashboard");

  const [ambulances, setAmbulances] = useState<Ambulance[]>(FALLBACK_AMBULANCES);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Screen A4: Delete modal
  const [deletingAmbulance, setDeletingAmbulance] = useState<Ambulance | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Screen A5: Add/Edit
  const [editingAmbulance, setEditingAmbulance] = useState<Ambulance | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Screen A7: Drawer Detail Permintaan
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequestItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Global Readiness: Account Settings & Audio Dispatch Alarm
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const playEmergencyTone = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Seed / Simulated Emergency Requests matching Stitch A6 & A7
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequestItem[]>([
    {
      id: 128,
      time: "10:42 WIB",
      timestamp: "Selasa, 24 Okt 2026 • 10:42 WIB",
      rawDate: "2026-10-24T10:42:00",
      callerName: "Dewa",
      callerPhone: "0812-3456-7890",
      pickupLocation: "Jl. Jenderal Sudirman (Simpang Charitas), Kec. Ilir Timur I, Palembang",
      coordinates: "-2.97610, 104.77540",
      assignedAmbulance: FALLBACK_AMBULANCES[0],
      distanceKm: 2.4,
      etaMinutes: 8,
      status: "menunggu",
      notes: "Pasien lansia mengalami sesak napas dan lemas mendadak, perlu segera diantar ke IGD RSUP Mohammad Hoesin. Akses jalan depan rumah lebar 4 meter.",
      adminNote: "",
      timeline: [
        { time: "10:44 WIB", user: "Petugas Rian H.", text: "Pesan konfirmasi terkirim ke WhatsApp pelapor." },
        { time: "10:42 WIB", user: "Sistem AmperaSiaga", text: "Permintaan darurat baru diterima via portal warga." },
      ],
    },
    {
      id: 127,
      time: "10:35 WIB",
      timestamp: "Selasa, 24 Okt 2026 • 10:35 WIB",
      rawDate: "2026-10-24T10:35:00",
      callerName: "Siti Rahma",
      callerPhone: "0813-8822-1100",
      pickupLocation: "Kertapati, Jl. Ki Merogan No. 88, Seberang Ulu I, Palembang",
      coordinates: "-2.99820, 104.75110",
      assignedAmbulance: FALLBACK_AMBULANCES[1] || FALLBACK_AMBULANCES[0],
      distanceKm: 4.1,
      etaMinutes: 14,
      status: "dihubungi",
      notes: "Pasien ibu hamil mengalami kontraksi awal dengan riwayat komplikasi, rujukan ke RSUD BARI.",
      adminNote: "",
      timeline: [
        { time: "10:38 WIB", user: "Petugas Rian H.", text: "Verifikasi telepon berhasil. Pasien dalam kondisi stabil." },
        { time: "10:35 WIB", user: "Sistem AmperaSiaga", text: "Permintaan darurat diterima dari zona Seberang Ulu." },
      ],
    },
    {
      id: 126,
      time: "10:18 WIB",
      timestamp: "Selasa, 24 Okt 2026 • 10:18 WIB",
      rawDate: "2026-10-24T10:18:00",
      callerName: "H. Syamsuddin",
      callerPhone: "0811-7899-2345",
      pickupLocation: "Plaju, Jl. D.I. Panjaitan dekat Pasar Plaju, Palembang",
      coordinates: "-2.99210, 104.79230",
      assignedAmbulance: FALLBACK_AMBULANCES[2] || FALLBACK_AMBULANCES[0],
      distanceKm: 3.8,
      etaMinutes: 11,
      status: "ditangani",
      notes: "Kecelakaan lalu lintas roda dua, korban sadar dengan cedera tungkai kiri.",
      adminNote: "",
      timeline: [
        { time: "10:24 WIB", user: "Driver Budi", text: "Armada meluncur dengan sirine aktif." },
        { time: "10:20 WIB", user: "Petugas Rian H.", text: "Dispatch unit AMB-003 disetujui." },
        { time: "10:18 WIB", user: "Sistem AmperaSiaga", text: "Laporan masuk via hotline darurat." },
      ],
    },
    {
      id: 125,
      time: "09:40 WIB",
      timestamp: "Selasa, 24 Okt 2026 • 09:40 WIB",
      rawDate: "2026-10-24T09:40:00",
      callerName: "Budi Prakoso",
      callerPhone: "0852-7311-9988",
      pickupLocation: "Bukit Kecil, Jl. Merdeka No. 12, Ilir Barat I, Palembang",
      coordinates: "-2.98650, 104.75400",
      assignedAmbulance: FALLBACK_AMBULANCES[3] || FALLBACK_AMBULANCES[0],
      distanceKm: 1.7,
      etaMinutes: 5,
      status: "selesai",
      notes: "Pasien demam tinggi anak-anak telah berhasil diantarkan ke IGD RS RK Charitas.",
      adminNote: "",
      timeline: [
        { time: "10:05 WIB", user: "Driver Dimas", text: "Pasien tiba dan diserahterimakan di IGD Charitas." },
        { time: "09:45 WIB", user: "Driver Dimas", text: "Pasien telah berada di dalam ambulans." },
        { time: "09:40 WIB", user: "Sistem AmperaSiaga", text: "Panggilan masuk dari keluarga pasien." },
      ],
    },
  ]);

  // Helper mapping backend ContactRequest to EmergencyRequestItem
  const mapBackendToEmergencyItem = (item: any): EmergencyRequestItem => {
    const createdDate = item.created_at ? new Date(item.created_at) : new Date();
    const timeStr =
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(createdDate) + " WIB";

    const dateStr =
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(createdDate) + " WIB";

    const assigned =
      item.ambulance ||
      FALLBACK_AMBULANCES.find((a) => a.id === item.ambulance_id) ||
      FALLBACK_AMBULANCES[0];

    const timelineEvents: { time: string; user: string; text: string }[] = [];
    if (item.status === "selesai") {
      timelineEvents.push({
        time: timeStr,
        user: "Operator Siaga",
        text: "Pelayanan ambulans telah selesai diserahterimakan.",
      });
    } else if (item.status === "ditangani") {
      timelineEvents.push({
        time: timeStr,
        user: "Driver " + (assigned.driver_name || "Ambulans"),
        text: "Unit sedang meluncur menuju lokasi penjemputan.",
      });
    } else if (item.status === "dihubungi") {
      timelineEvents.push({
        time: timeStr,
        user: "Operator Siaga",
        text: "Verifikasi kontak pelapor via WhatsApp/Telepon berhasil.",
      });
    }
    timelineEvents.push({
      time: timeStr,
      user: "Sistem AmperaSiaga",
      text: "Laporan darurat dicatat via portal warga.",
    });

    return {
      id: item.id,
      time: timeStr,
      timestamp: dateStr,
      rawDate: item.created_at || createdDate.toISOString(),
      callerName: item.user_name || "Pemohon Publik",
      callerPhone: item.user_phone || "-",
      pickupLocation: item.user_address || "Lokasi Warga (Palembang)",
      coordinates:
        item.user_latitude && item.user_longitude
          ? `${Number(item.user_latitude).toFixed(5)}, ${Number(item.user_longitude).toFixed(5)}`
          : "-2.9760, 104.7564",
      assignedAmbulance: assigned,
      distanceKm: assigned.distance_km || 2.4,
      etaMinutes: assigned.estimated_minutes || 8,
      status: item.status || "menunggu",
      notes: item.patient_condition || "Memerlukan penjemputan darurat segera.",
      adminNote: item.admin_notes || "",
      timeline: timelineEvents,
    };
  };

  // Auth check on mount: check localStorage or sessionStorage, and verify with /auth/me
  useEffect(() => {
    const savedToken =
      localStorage.getItem("ampera_admin_token") || sessionStorage.getItem("ampera_admin_token");
    const savedEmail = localStorage.getItem("ampera_admin_email");

    if (savedToken) {
      setAdminToken(savedToken);
      setIsAuthenticated(true);
      if (savedEmail) {
        setAdminUser({ name: "Operator Siaga Palembang", email: savedEmail });
      }

      // Verify token with backend
      adminGetMe(savedToken).then((res) => {
        if (res.success && res.user) {
          setAdminUser(res.user);
        } else if (
          res.message?.toLowerCase().includes("unauthorized") ||
          res.message?.toLowerCase().includes("tidak valid")
        ) {
          // Token expired or invalid on backend, cleanly log out
          handleLogout();
        }
      });
    }
  }, []);

  // Load backend ambulances, providers, and real contact requests
  const loadData = async (tokenOverride?: string) => {
    setIsLoading(true);
    const token = tokenOverride || adminToken || undefined;
    try {
      const [ambData, provData, reqData] = await Promise.all([
        fetchAmbulances(),
        fetchProviders(),
        fetchContactRequests(undefined, token),
      ]);
      setAmbulances(ambData);
      setProviders(provData);
      if (reqData && reqData.length > 0) {
        setEmergencyRequests(reqData.map(mapBackendToEmergencyItem));
      }
    } catch (e) {
      console.error("Error loading admin data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, adminToken]);

  // Periodic Auto-refresh for dispatch requests every 12 seconds with audible chime
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      try {
        const reqData = await fetchContactRequests(undefined, adminToken || undefined);
        if (reqData && reqData.length > 0) {
          const mapped = reqData.map(mapBackendToEmergencyItem);
          setEmergencyRequests((prev) => {
            const prevWaiting = prev.filter((r) => r.status === "menunggu").length;
            const newWaiting = mapped.filter((r) => r.status === "menunggu").length;
            if (newWaiting > prevWaiting) {
              playEmergencyTone();
              showToast(
                `Perhatian: ${newWaiting - prevWaiting} permintaan darurat baru masuk!`,
                "info"
              );
            }
            return mapped;
          });
        }
      } catch (err) {
        // silent
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [isAuthenticated, adminToken, soundEnabled]);

  const handleProfileUpdated = (updatedUser: { id?: number; name: string; email: string }) => {
    setAdminUser(updatedUser);
    try {
      localStorage.setItem("ampera_admin_email", updatedUser.email);
    } catch {}
  };

  const handlePasswordUpdated = (newToken: string) => {
    setAdminToken(newToken);
    try {
      if (localStorage.getItem("ampera_admin_token")) {
        localStorage.setItem("ampera_admin_token", newToken);
      } else {
        sessionStorage.setItem("ampera_admin_token", newToken);
      }
    } catch {}
  };

  const handleLoginSuccess = (email: string, token: string, user?: any) => {
    setAdminToken(token);
    if (user) {
      setAdminUser(user);
    } else {
      setAdminUser({ name: "Operator Siaga Palembang", email });
    }
    setIsAuthenticated(true);
    showToast(`Selamat datang di Command Center, ${user?.name || email}!`, "success");
    loadData(token);
  };

  const handleLogout = async () => {
    if (adminToken) {
      await adminLogout(adminToken);
    }
    localStorage.removeItem("ampera_admin_token");
    localStorage.removeItem("ampera_admin_email");
    localStorage.removeItem("amperasiaga_admin_auth");
    sessionStorage.removeItem("ampera_admin_token");
    setAdminToken(null);
    setAdminUser(null);
    setIsAuthenticated(false);
    showToast("Anda telah keluar dari Command Center.", "info");
  };

  // Status Change handler in Table A3
  const handleStatusChange = async (
    ambulance: Ambulance,
    newStatus: "tersedia" | "sedang_bertugas" | "offline"
  ) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === ambulance.id ? { ...a, status: newStatus } : a))
    );

    try {
      const res = await updateAmbulance(
        ambulance.id,
        { status: newStatus },
        adminToken || undefined
      );
      if (res.success) {
        showToast(
          `Status ${ambulance.name} diubah menjadi ${newStatus.replace("_", " ")}.`,
          "success"
        );
      }
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  // Delete handler for Screen A4
  const handleConfirmDelete = async () => {
    if (!deletingAmbulance) return;
    setIsDeleting(true);

    try {
      const res = await deleteAmbulance(deletingAmbulance.id, adminToken || undefined);
      if (res.success) {
        setAmbulances((prev) => prev.filter((a) => a.id !== deletingAmbulance.id));
        showToast(
          `Data unit ${deletingAmbulance.name} (${deletingAmbulance.unit_code}) berhasil dihapus.`,
          "success"
        );
        setDeletingAmbulance(null);
      } else {
        showToast(res.message || "Gagal menghapus ambulans dari server.", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Gagal menghapus ambulans", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Add / Edit Save handler for Screen A5
  const handleSaveAmbulance = async (data: Partial<Ambulance>) => {
    setIsSaving(true);
    try {
      if (editingAmbulance) {
        const res = await updateAmbulance(editingAmbulance.id, data, adminToken || undefined);
        if (res.success && res.data) {
          setAmbulances((prev) =>
            prev.map((a) => (a.id === editingAmbulance.id ? (res.data as Ambulance) : a))
          );
          showToast(`Unit ${data.name || editingAmbulance.name} berhasil diperbarui.`, "success");
          setActiveTab("armada");
          setEditingAmbulance(null);
        } else {
          showToast(res.message || "Gagal memperbarui unit armada.", "error");
        }
      } else {
        const res = await createAmbulance(data, adminToken || undefined);
        if (res.success && res.data) {
          setAmbulances((prev) => [res.data as Ambulance, ...prev]);
          showToast(`Unit ambulans ${data.name} berhasil ditambahkan!`, "success");
          setActiveTab("armada");
          setEditingAmbulance(null);
        } else {
          // If server is completely offline / demo mode
          if (!res.success && res.message?.includes("Gagal menghubungi")) {
            const newUnit: Ambulance = {
              id: Date.now(),
              unit_code: data.unit_code || "AMB-NEW",
              name: data.name || "Ambulans Baru",
              provider_id: data.provider_id || 1,
              status: data.status || "tersedia",
              vehicle_type: data.vehicle_type || "standar",
              has_oxygen: data.has_oxygen ?? true,
              has_icu: data.has_icu ?? false,
              latitude: data.latitude || -2.9760,
              longitude: data.longitude || 104.7564,
              base_location: data.base_location || "Palembang",
              driver_name: data.driver_name || null,
              driver_phone: data.driver_phone || null,
              whatsapp_number: data.whatsapp_number || "6282162319964",
              description: data.description || null,
              provider: providers.find((p) => p.id === data.provider_id) || providers[0],
            };
            setAmbulances((prev) => [newUnit, ...prev]);
            showToast(`Unit ${data.name} disimpan secara lokal (server offline).`, "info");
            setActiveTab("armada");
            setEditingAmbulance(null);
          } else {
            showToast(res.message || "Gagal menambahkan unit ambulans.", "error");
          }
        }
      }
    } catch (err: any) {
      showToast(err?.message || "Gagal menyimpan armada", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Drawer status update for Screen A7
  const handleUpdateDrawerStatus = async (
    requestId: number,
    newStatus: EmergencyRequestItem["status"],
    note: string,
    reassignedAmbulanceId?: number
  ) => {
    const updatedTimeStr =
      new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(new Date()) + " WIB";

    const targetAmbulance = reassignedAmbulanceId
      ? ambulances.find((a) => a.id === reassignedAmbulanceId)
      : undefined;

    const newLogEntry = {
      time: updatedTimeStr,
      user: "Operator Siaga",
      text: `Status diperbarui menjadi ${newStatus.toUpperCase()}${
        targetAmbulance ? ` (Unit dialihkan ke ${targetAmbulance.unit_code})` : ""
      }${note ? `: ${note}` : ""}`,
    };

    // Optimistic fleet status update
    const currentReq = emergencyRequests.find((r) => r.id === requestId);
    const effectiveAmbId = reassignedAmbulanceId || currentReq?.assignedAmbulance?.id;

    if (effectiveAmbId) {
      setAmbulances((prev) =>
        prev.map((amb) => {
          // If ambulance was reassigned, free up the previous ambulance
          if (
            reassignedAmbulanceId &&
            currentReq?.assignedAmbulance?.id &&
            amb.id === currentReq.assignedAmbulance.id &&
            amb.id !== reassignedAmbulanceId
          ) {
            return amb.status !== "offline" ? { ...amb, status: "tersedia" } : amb;
          }
          // Update the target ambulance
          if (amb.id === effectiveAmbId) {
            if (newStatus === "ditangani") {
              return { ...amb, status: "sedang_bertugas" };
            } else if (newStatus === "selesai" || newStatus === "dibatalkan") {
              return amb.status !== "offline" ? { ...amb, status: "tersedia" } : amb;
            }
          }
          return amb;
        })
      );
    }

    // Optimistic UI update for emergencyRequests list
    setEmergencyRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: newStatus,
            adminNote: note,
            assignedAmbulance: targetAmbulance || r.assignedAmbulance,
            timeline: [newLogEntry, ...r.timeline],
          };
        }
        return r;
      })
    );

    // Optimistic UI update for currently open drawer
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              adminNote: note,
              assignedAmbulance: targetAmbulance || prev.assignedAmbulance,
              timeline: [newLogEntry, ...prev.timeline],
            }
          : null
      );
    }

    try {
      const res = await updateContactRequestStatus(
        requestId,
        newStatus,
        note,
        adminToken || undefined,
        reassignedAmbulanceId
      );

      if (res.success) {
        showToast(
          `Status Permintaan #${requestId} berhasil diperbarui menjadi ${newStatus.toUpperCase()}${
            targetAmbulance ? ` (${targetAmbulance.unit_code})` : ""
          }.`,
          "success"
        );
        loadData();
      } else {
        showToast(
          res.message || `Status Permintaan #${requestId} diperbarui secara lokal.`,
          "info"
        );
      }
    } catch (err) {
      showToast(
        `Status Permintaan #${requestId} disimpan secara lokal di posko.`,
        "info"
      );
    }
  };

  const handleOpenRequestDetail = (req: EmergencyRequestItem) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  if (!isAuthenticated) {
    return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const waitingCount = emergencyRequests.filter((r) => r.status === "menunggu").length;

  return (
    <div className="bg-[#FAF8FF] text-[#131b2e] antialiased flex min-h-screen overflow-x-hidden">
      {/* Toast handled below at end of component */}

      {/* SIDEBAR KIRI (Shared Component: SideNavBar Sesuai Stitch Screen A2, A3, A6) */}
      <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col justify-between z-40 bg-[#131b2e] border-r border-slate-800 shadow-md text-white select-none">
        {/* Top Branding & Navigation */}
        <div className="p-4 flex flex-col gap-6">
          {/* Logo Container */}
          <div className="px-2 pt-2 flex flex-col gap-2">
            <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs border border-white/10 flex items-center justify-center">
              <Logo variant="inline" />
            </div>
            <div className="mt-1">
              <h1 className="text-base text-white font-extrabold tracking-tight">AmperaSiaga</h1>
              <p className="text-[11px] text-slate-400 font-medium">Palembang Emergency Command</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-1.5 mt-2">
            {/* 1. Dashboard (A2) */}
            <button
              onClick={() => setActiveTab("dashboard")}
              type="button"
              className={`rounded-xl px-4 py-3 flex items-center gap-3 font-semibold transition duration-150 ease-in-out cursor-pointer text-left ${
                activeTab === "dashboard"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <span className="text-sm">Dashboard</span>
            </button>

            {/* 2. Armada Ambulans (A3) */}
            <button
              onClick={() => setActiveTab("armada")}
              type="button"
              className={`rounded-xl px-4 py-3 flex items-center gap-3 font-semibold transition duration-150 ease-in-out cursor-pointer text-left ${
                activeTab === "armada" || activeTab === "tambah_edit"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-xl">local_hospital</span>
              <span className="text-sm">Armada Ambulans</span>
            </button>

            {/* 3. Permintaan (A6 with Badge) */}
            <button
              onClick={() => setActiveTab("permintaan")}
              type="button"
              className={`rounded-xl px-4 py-3 flex items-center justify-between font-semibold transition duration-150 ease-in-out cursor-pointer text-left ${
                activeTab === "permintaan"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">notification_important</span>
                <span className="text-sm">Permintaan</span>
              </div>
              {waitingCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-xs animate-pulse">
                  {waitingCount} Baru
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer text-left group"
            title="Kelola Profil & Kata Sandi"
          >
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold ring-2 ring-blue-500/40 text-sm shrink-0">
              {(adminUser?.name || "Admin").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-semibold truncate leading-tight group-hover:text-blue-300 transition-colors">
                {adminUser?.name || "Operator Siaga Palembang"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {adminUser?.email || "Admin Dispatcher"}
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 group-hover:text-white text-base">
              settings
            </span>
          </button>

          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs font-bold transition duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* MAIN WRAPPER (TopNavBar + Content Canvas) */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Left: Title & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {activeTab === "dashboard"
                  ? "Dashboard Posko"
                  : activeTab === "armada"
                  ? "Manajemen Armada Ambulans"
                  : activeTab === "permintaan"
                  ? "Riwayat Permintaan Ambulans"
                  : "Formulir Armada Ambulans"}
              </h2>
              <p className="text-xs text-slate-500">
                Sistem /{" "}
                <span className="text-blue-700 font-semibold">
                  {activeTab === "dashboard"
                    ? "Dashboard Utama"
                    : activeTab === "armada"
                    ? "Armada Palembang"
                    : activeTab === "permintaan"
                    ? "Log Permintaan Warga"
                    : "Formulir Tambah / Edit"}
                </span>
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-700 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Web Publik</span>
            </a>

            {/* Alarm Sound Toggle Button */}
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                showToast(
                  next ? "Alarm suara dispatch diaktifkan." : "Alarm suara dispatch dibisukan.",
                  "info"
                );
              }}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                soundEnabled
                  ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  : "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200"
              }`}
              title={soundEnabled ? "Non-aktifkan alarm suara" : "Aktifkan alarm suara"}
            >
              <span className="material-symbols-outlined text-base">
                {soundEnabled ? "notifications_active" : "notifications_off"}
              </span>
              <span className="hidden md:inline">{soundEnabled ? "Alarm: On" : "Alarm: Bisu"}</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 text-slate-600 text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="material-symbols-outlined text-blue-700 text-sm">schedule</span>
              <span>WIB (UTC+7)</span>
            </div>

            <a
              href="tel:112"
              className="hidden xl:inline-flex items-center gap-1.5 bg-red-600 text-white text-xs px-3.5 py-1.5 rounded-lg font-bold shadow-xs hover:bg-red-700 transition"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>Hubungi 112/119</span>
            </a>

            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity cursor-pointer text-left"
              title="Pengaturan Akun & Ubah Kata Sandi"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {(adminUser?.name || "Admin").slice(0, 2).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {adminUser?.name || "Admin Operasional"}
                  </p>
                  <span className="material-symbols-outlined text-xs text-slate-400">tune</span>
                </div>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Super Admin
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* CONTENT CANVAS */}
        <main className="p-6 md:p-8 flex-1 flex flex-col gap-6">
          {activeTab === "dashboard" ? (
            <AdminDashboardView
              ambulances={ambulances}
              providers={providers}
              emergencyRequests={emergencyRequests}
              onNavigateToArmada={() => setActiveTab("armada")}
              onSelectAmbulance={() => {
                setActiveTab("armada");
              }}
              onSelectRequest={handleOpenRequestDetail}
            />
          ) : activeTab === "armada" ? (
            <AdminArmadaView
              ambulances={ambulances}
              providers={providers}
              onAddAmbulance={() => {
                setEditingAmbulance(null);
                setActiveTab("tambah_edit");
              }}
              onEditAmbulance={(amb) => {
                setEditingAmbulance(amb);
                setActiveTab("tambah_edit");
              }}
              onDeleteAmbulance={(amb) => {
                setDeletingAmbulance(amb);
              }}
              onStatusChange={handleStatusChange}
              onRefresh={loadData}
              isLoading={isLoading}
            />
          ) : activeTab === "permintaan" ? (
            <AdminRiwayatPermintaanView
              requests={emergencyRequests}
              onSelectRequest={handleOpenRequestDetail}
              onRefresh={() => {
                loadData();
                showToast("Data log permintaan dimuat ulang.", "info");
              }}
            />
          ) : (
            <AdminAddEditView
              ambulance={editingAmbulance}
              providers={providers}
              isSaving={isSaving}
              onCancel={() => {
                setEditingAmbulance(null);
                setActiveTab("armada");
              }}
              onSave={handleSaveAmbulance}
            />
          )}
        </main>
      </div>

      {/* Modal Dialog Hapus (Screen A4) */}
      {deletingAmbulance && (
        <AdminDeleteDialog
          ambulance={deletingAmbulance}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingAmbulance(null)}
        />
      )}

      {/* Drawer Detail Permintaan (Screen A7) */}
      {selectedRequest && isDrawerOpen && (
        <AdminDetailPermintaanDrawer
          request={selectedRequest}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onUpdateStatus={handleUpdateDrawerStatus}
          ambulances={ambulances}
        />
      )}

      {/* Admin Profile & Security Settings Modal */}
      <AdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        adminUser={adminUser}
        adminToken={adminToken}
        onProfileUpdated={handleProfileUpdated}
        onPasswordUpdated={handlePasswordUpdated}
        onToast={showToast}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-bottom duration-250 transition-all bg-white text-slate-800 border-slate-200"
        >
          <span
            className={`w-3 h-3 rounded-full shrink-0 ${
              toastMessage.type === "success"
                ? "bg-emerald-500 ring-4 ring-emerald-100"
                : toastMessage.type === "error"
                ? "bg-red-500 ring-4 ring-red-100"
                : "bg-blue-600 ring-4 ring-blue-100"
            }`}
          />
          <span className="text-xs sm:text-sm text-slate-800 leading-snug">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 ml-2 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title="Tutup Notifikasi"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
