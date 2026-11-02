"use client";

import React, { useState } from "react";
import { updateAdminProfile, updateAdminPassword } from "@/lib/api";

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser: { id?: number; name?: string; email?: string } | null;
  adminToken: string | null;
  onProfileUpdated: (updatedUser: { id?: number; name: string; email: string }) => void;
  onPasswordUpdated: (newToken: string) => void;
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}

export default function AdminProfileModal({
  isOpen,
  onClose,
  adminUser,
  adminToken,
  onProfileUpdated,
  onPasswordUpdated,
  onToast,
}: AdminProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"profil" | "keamanan">("profil");

  // Profil Form State
  const [name, setName] = useState(adminUser?.name || "");
  const [email, setEmail] = useState(adminUser?.email || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Kata Sandi Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  React.useEffect(() => {
    if (adminUser) {
      setName(adminUser.name || "");
      setEmail(adminUser.email || "");
    }
  }, [adminUser]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      onToast("Nama dan email tidak boleh kosong.", "error");
      return;
    }
    if (!adminToken) {
      onToast("Sesi tidak ditemukan. Silakan login kembali.", "error");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await updateAdminProfile({ name: name.trim(), email: email.trim() }, adminToken);
      setIsUpdatingProfile(false);
      if (res.success && res.user) {
        onProfileUpdated(res.user);
        onToast("Profil operator berhasil diperbarui!", "success");
      } else {
        onToast(res.message || "Gagal memperbarui profil.", "error");
      }
    } catch {
      setIsUpdatingProfile(false);
      onToast("Gagal menghubungi server untuk update profil.", "error");
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError("Masukkan kata sandi saat ini.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }
    if (!adminToken) {
      onToast("Sesi tidak valid.", "error");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await updateAdminPassword(
        { current_password: currentPassword, new_password: newPassword },
        adminToken
      );
      setIsUpdatingPassword(false);

      if (res.success) {
        if (res.token) {
          onPasswordUpdated(res.token);
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onToast("Kata sandi berhasil diubah! Token sesi telah diperbarui.", "success");
        onClose();
      } else {
        setPasswordError(res.message || "Gagal mengubah kata sandi.");
      }
    } catch {
      setIsUpdatingPassword(false);
      setPasswordError("Gagal menghubungi server backend.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Modal */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">manage_accounts</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                Pengaturan Akun &amp; Keamanan Posko
              </h3>
              <p className="text-[11px] text-slate-400">
                Konfigurasi kredensial operator Command Center AmperaSiaga
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup dialog"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("profil")}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === "profil"
                ? "border-blue-700 text-blue-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-base">person</span>
            <span>Profil Petugas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("keamanan")}
            className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === "keamanan"
                ? "border-blue-700 text-blue-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="material-symbols-outlined text-base">lock_reset</span>
            <span>Ubah Kata Sandi</span>
          </button>
        </div>

        {/* Tab 1: Profil Petugas */}
        {activeTab === "profil" && (
          <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="profName">
                Nama Lengkap / Panggilan Dinas
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  badge
                </span>
                <input
                  id="profName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="contoh: Bpk. Rian Hidayat, S.Kep"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="profEmail">
                Alamat Email Kedinasan
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  mail
                </span>
                <input
                  id="profEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@amperasiaga.palembang.go.id"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Email ini digunakan untuk autentikasi saat masuk ke portal Command Center.
              </p>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center gap-3 text-xs text-blue-950">
              <span className="material-symbols-outlined text-blue-700 text-lg shrink-0">
                security
              </span>
              <p className="leading-relaxed text-[11px]">
                Otoritas Akun: <strong>Super Admin Dispatcher</strong> • Hak akses penuh telemetri armada dan tanggap darurat Palembang 112.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isUpdatingProfile ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Ubah Kata Sandi */}
        {activeTab === "keamanan" && (
          <form onSubmit={handleSavePassword} className="p-6 space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-red-600">error</span>
                <span>{passwordError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="curPass">
                Kata Sandi Saat Ini
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  lock
                </span>
                <input
                  id="curPass"
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-base">
                    {showCurrentPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="newPass">
                Kata Sandi Baru (Min. 6 Karakter)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  key
                </span>
                <input
                  id="newPass"
                  type={showNewPass ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter kombinasi"
                  className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-base">
                    {showNewPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800" htmlFor="confPass">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  lock_clock
                </span>
                <input
                  id="confPass"
                  type={showNewPass ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
              <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">
                verified
              </span>
              <p className="leading-relaxed">
                <strong>Catatan Produksi:</strong> Mengubah kata sandi akan otomatis memperbarui token sesi Anda untuk mencegah akses ilegal.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isUpdatingPassword ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Memperbarui...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">password</span>
                    <span>Ubah Kata Sandi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

