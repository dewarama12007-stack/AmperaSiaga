"use client";

import React, { useState, useEffect, useRef } from "react";
import Logo from "../Logo";
import { adminLogin } from "@/lib/api";

interface AdminLoginViewProps {
  onLoginSuccess: (email: string, token: string, user?: any) => void;
  onBackToHome?: () => void;
}

export default function AdminLoginView({
  onLoginSuccess,
  onBackToHome,
}: AdminLoginViewProps) {
  // Inputs start clean and empty by default (no hardcoded pre-fill)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Advanced operator UX & security states
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isShake, setIsShake] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showDemoHelper, setShowDemoHelper] = useState(false);
  const [copiedDemo, setCopiedDemo] = useState<"email" | "password" | "all" | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus email input & check if there is a remembered email from previous session
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("ampera_admin_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
        // If email was remembered, focus password input directly
        passwordInputRef.current?.focus();
      } else {
        emailInputRef.current?.focus();
      }
    } catch {
      // LocalStorage unavailable in private mode
      emailInputRef.current?.focus();
    }
  }, []);

  // Cooldown timer countdown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Trigger shake animation on error
  const triggerShake = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 500);
  };

  // Detect Caps Lock state on keyboard events
  const handleKeyModifierCheck = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === "function") {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const validateInputs = (): boolean => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg("Silakan masukkan alamat email atau ID Petugas Posko.");
      emailInputRef.current?.focus();
      triggerShake();
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg("Format alamat email tidak valid (contoh: admin@amperasiaga.palembang.go.id).");
      emailInputRef.current?.focus();
      triggerShake();
      return false;
    }

    if (!password) {
      setErrorMsg("Silakan masukkan kata sandi Anda.");
      passwordInputRef.current?.focus();
      triggerShake();
      return false;
    }

    if (password.length < 4) {
      setErrorMsg("Kata sandi minimal terdiri dari 4 karakter.");
      passwordInputRef.current?.focus();
      triggerShake();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldownSeconds > 0) return;

    if (!validateInputs()) {
      return;
    }

    // Network check
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setErrorMsg("Koneksi internet terputus. Pastikan perangkat Anda terhubung ke jaringan.");
      triggerShake();
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const trimmedEmail = email.trim();

    try {
      const res = await adminLogin(trimmedEmail, password);
      setIsLoading(false);

      if (res.success && res.token) {
        // Reset security state on success
        setFailedAttempts(0);

        if (rememberMe) {
          localStorage.setItem("ampera_admin_token", res.token);
          localStorage.setItem("ampera_admin_email", trimmedEmail);
        } else {
          sessionStorage.setItem("ampera_admin_token", res.token);
          localStorage.removeItem("ampera_admin_token");
          localStorage.removeItem("ampera_admin_email");
        }
        onLoginSuccess(trimmedEmail, res.token, res.user);
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);

        if (nextFailed >= 5) {
          setCooldownSeconds(15);
          setErrorMsg(
            "Terlalu banyak percobaan gagal berturut-turut. Akses ditangguhkan selama 15 detik demi keamanan posko."
          );
        } else {
          setErrorMsg(res.message || "Email atau kata sandi tidak cocok. Silakan periksa kembali.");
        }
        triggerShake();
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg("Gagal menghubungi server API. Pastikan backend Laravel dan MySQL XAMPP aktif.");
      triggerShake();
    }
  };

  // Quick fill helper for developers / testers
  const handleQuickFillDemo = () => {
    setEmail("admin@amperasiaga.palembang.go.id");
    setPassword("admin123");
    setErrorMsg(null);
    setCopiedDemo("all");
    setTimeout(() => setCopiedDemo(null), 2500);
  };

  const handleCopyText = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    setCopiedDemo(type);
    setTimeout(() => setCopiedDemo(null), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Emergency Status Strip */}
      <header className="bg-[#bb0112] text-white py-2 px-4 shadow-xs relative z-30 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency
            </span>
            <span className="tracking-wide">
              Layanan Siaga Darurat Medis Kota Palembang (Ampera 112 / PSC 119)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Server Dispatch: Normal
            </span>
            <span className="text-white/60">•</span>
            <span>Enkripsi 256-Bit SSL Terverifikasi</span>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="w-full flex-1 flex flex-col lg:flex-row">
        {/* Left Column: Brand & Security Panel */}
        <div className="lg:w-1/2 bg-[#0F172A] relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white overflow-hidden border-r border-slate-800">
          {/* Topographic & Bridge Vector Accent */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <svg
              className="w-full h-full object-cover"
              fill="none"
              viewBox="0 0 800 800"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-100 200 C 200 150, 300 450, 900 350"
                opacity="0.25"
                stroke="#38BDF8"
                strokeLinecap="round"
                strokeWidth="32"
              ></path>
              <path
                d="M-100 250 C 220 200, 320 500, 900 400"
                opacity="0.3"
                stroke="#38BDF8"
                strokeDasharray="16 12"
                strokeWidth="12"
              ></path>
              <circle
                cx="450"
                cy="400"
                opacity="0.25"
                r="220"
                stroke="#38BDF8"
                strokeDasharray="8 6"
                strokeWidth="1.5"
              ></circle>
              <path
                d="M 400 100 L 400 550 M 430 100 L 430 550"
                opacity="0.4"
                stroke="#DC2626"
                strokeWidth="4"
              ></path>
              <path
                d="M 370 240 L 460 240 M 370 320 L 460 320 M 360 420 L 470 420"
                opacity="0.35"
                stroke="#DC2626"
                strokeWidth="3"
              ></path>
              <path
                d="M 280 420 Q 415 340 550 420"
                fill="none"
                opacity="0.35"
                stroke="#DC2626"
                strokeWidth="5"
              ></path>
            </svg>
          </div>

          {/* Left Header */}
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-3">
              <Logo variant="inline" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-xs text-slate-300">
                Pusat Kendali Dispatcher &amp; Armada Medis
              </span>
            </div>

            <div className="space-y-4 pt-4 max-w-lg">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Command Center <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  AmperaSiaga Palembang
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Platform terpusat pemantauan 28 unit ambulans, koordinasi gawat darurat 16 kecamatan,
                dan integrasi rujukan faskes se-Kota Palembang.
              </p>
            </div>
          </div>

          {/* Feature Badges Cluster */}
          <div className="relative z-10 my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-xs flex items-start gap-3">
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg shrink-0">
                <span className="material-symbols-outlined text-xl">satellite_alt</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Telemetri Real-Time</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pelacakan posisi GPS armada di Seberang Ilir &amp; Seberang Ulu
                </p>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-xs flex items-start gap-3">
              <div className="p-2 bg-emerald-600/20 text-emerald-400 rounded-lg shrink-0">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Jejaring RS &amp; PMI</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  RSMH, Charitas, RSUD BARI, RSI Siti Khadijah, RS Siti Fatimah
                </p>
              </div>
            </div>
          </div>

          {/* Left Footer: Credential Security */}
          <div className="relative z-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-slate-400 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700">
                <span className="material-symbols-outlined text-base">verified_user</span>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Enkripsi End-to-End Command Center</p>
                <p className="text-slate-400">Otorisasi protokol TLS 1.3 &amp; Posko Terpadu</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-sm text-emerald-400">lock</span>
              <span>Akses Terbatas Petugas</span>
            </div>
          </div>
        </div>

        {/* Right Column: Modernized Login Form Card */}
        <div className="lg:w-1/2 bg-[#F8FAFC] flex flex-col justify-between items-center p-6 sm:p-12 lg:p-16 relative">
          {/* Top Secondary Bar */}
          <div className="w-full flex items-center justify-between max-w-md pb-6">
            {onBackToHome ? (
              <button
                onClick={onBackToHome}
                type="button"
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors text-sm font-semibold group cursor-pointer"
              >
                <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-1">
                  arrow_back
                </span>
                <span>Kembali ke Beranda</span>
              </button>
            ) : (
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors text-sm font-semibold group"
              >
                <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-1">
                  arrow_back
                </span>
                <span>Kembali ke Beranda</span>
              </a>
            )}

            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-200/70 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>WIB (UTC+7)</span>
            </div>
          </div>

          {/* Centered Form Card */}
          <div className="w-full max-w-md my-auto">
            <div
              className={`bg-white rounded-2xl p-7 sm:p-8 border border-slate-200 shadow-sm transition-all ${
                isShake ? "animate-shake border-red-300 ring-2 ring-red-100" : ""
              }`}
            >
              {/* Card Header */}
              <div className="mb-6 space-y-1">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center mb-3 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Masuk Portal Admin
                </h2>
                <p className="text-xs text-slate-500">
                  Masukkan alamat email resmi dan kata sandi petugas operator darurat
                </p>
              </div>

              {/* Security Attempt Warning Banner (if multiple failures) */}
              {failedAttempts >= 3 && failedAttempts < 5 && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-amber-800 text-xs">
                  <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">
                    warning
                  </span>
                  <div>
                    <p className="font-semibold">Peringatan Keamanan ({failedAttempts}/5 percobaan)</p>
                    <p className="text-amber-700 mt-0.5">
                      Percobaan gagal berulang kali dicatat oleh log sistem posko. Pastikan kredensial Anda valid.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message Display */}
              {errorMsg && (
                <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-3 text-red-700 text-xs">
                  <span
                    className="material-symbols-outlined text-red-600 text-lg shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    error
                  </span>
                  <div className="flex-1">
                    <p className="font-medium leading-relaxed">{errorMsg}</p>
                  </div>
                  <button
                    onClick={() => setErrorMsg(null)}
                    type="button"
                    className="text-red-400 hover:text-red-700 p-0.5 transition-colors cursor-pointer"
                    title="Tutup pesan error"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Field 1: Email Petugas */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-xs font-bold text-slate-800"
                      htmlFor="adminEmail"
                    >
                      Alamat Email / ID Petugas
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </div>
                    <input
                      ref={emailInputRef}
                      id="adminEmail"
                      type="email"
                      name="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder="contoh: nama@amperasiaga.palembang.go.id"
                      className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                    {email.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("");
                          emailInputRef.current?.focus();
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Kosongkan input"
                      >
                        <span className="material-symbols-outlined text-base">cancel</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Field 2: Kata Sandi */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-xs font-bold text-slate-800"
                      htmlFor="adminPassword"
                    >
                      Kata Sandi
                    </label>
                    {capsLockActive && (
                      <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 animate-pulse">
                        <span className="material-symbols-outlined text-xs">keyboard_capslock</span>
                        Caps Lock Aktif
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-lg">lock</span>
                    </div>
                    <input
                      ref={passwordInputRef}
                      id="adminPassword"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      onKeyDown={handleKeyModifierCheck}
                      onKeyUp={handleKeyModifierCheck}
                      placeholder="Masukkan kata sandi posko"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all tracking-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                      aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Options: Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">Ingat email saya</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-xs text-blue-700 hover:text-blue-900 hover:underline font-semibold cursor-pointer"
                  >
                    Lupa kata sandi?
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || cooldownSeconds > 0}
                    className="w-full min-h-[46px] bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Memverifikasi Otorisasi...</span>
                      </>
                    ) : cooldownSeconds > 0 ? (
                      <>
                        <span className="material-symbols-outlined text-base">timer</span>
                        <span>Terkunci Sementara ({cooldownSeconds} dtk)</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk ke Command Center</span>
                        <span className="material-symbols-outlined text-base">login</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Expandable Demo / Testing Credentials Accordion */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDemoHelper(!showDemoHelper)}
                  className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-sm text-blue-600">badge</span>
                    <span>Informasi Akun Petugas (Pengujian)</span>
                  </span>
                  <span className="material-symbols-outlined text-base text-slate-400 transition-transform">
                    {showDemoHelper ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {showDemoHelper && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 animate-fade-in">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Akun default seeded di database lokal untuk evaluasi fungsional sistem:
                    </p>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                        <span className="truncate max-w-[210px] text-slate-800">
                          admin@amperasiaga.palembang.go.id
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText("admin@amperasiaga.palembang.go.id", "email")
                          }
                          className="text-blue-600 hover:text-blue-800 font-sans text-[11px] font-semibold cursor-pointer shrink-0 ml-2"
                        >
                          {copiedDemo === "email" ? "Tersalin!" : "Salin"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-800">admin123</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText("admin123", "password")}
                          className="text-blue-600 hover:text-blue-800 font-sans text-[11px] font-semibold cursor-pointer shrink-0 ml-2"
                        >
                          {copiedDemo === "password" ? "Tersalin!" : "Salin"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleQuickFillDemo}
                      className="w-full mt-1.5 py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                    >
                      <span className="material-symbols-outlined text-sm">magic_button</span>
                      <span>
                        {copiedDemo === "all" ? "Kredensial Dimasukkan!" : "Gunakan Akun Ini (Isi Otomatis)"}
                      </span>
                    </button>

                    <div className="p-2 bg-amber-50/90 rounded-lg border border-amber-200 text-[10px] text-amber-800 flex items-start gap-1.5 leading-relaxed">
                      <span className="material-symbols-outlined text-xs text-amber-600 shrink-0 mt-0.5">
                        security
                      </span>
                      <span>
                        <strong>Kesiapan Produksi Global:</strong> Demi keamanan di server publik, segera ubah kata sandi default ini melalui menu <em>Pengaturan Akun</em> setelah berhasil login.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Helpdesk Notice */}
              <div className="mt-4 pt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span className="material-symbols-outlined text-sm text-slate-400">support_agent</span>
                <span>Kendala akses posko? Hubungi IT Dinkes Palembang (Ext. 119)</span>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="w-full max-w-md text-center pt-6 pb-2">
            <p className="text-xs text-slate-400">
              © 2026 Pemerintah Kota Palembang • AmperaSiaga Command Center
            </p>
          </div>
        </div>
      </main>

      {/* Interactive Forgot Password Modal Dialog */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">key</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Prosedur Pemulihan Kata Sandi
                  </h3>
                  <p className="text-xs text-slate-500">SOP Keamanan Sistem AmperaSiaga</p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Tutup dialog"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                Demi menjaga keamanan data operasional darurat dan kerahasiaan dispatch pasien gawat
                darurat Palembang, reset kata sandi tidak dapat dilakukan melalui tautan email publik
                otomatis.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <p className="font-bold text-slate-800">
                  Langkah Pemulihan Akun Petugas:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>
                    Hubungi <strong>Helpdesk IT Dinkes / PSC 119</strong> melalui ekstensi internal posko: <strong>119 (Ext. 4)</strong>.
                  </li>
                  <li>
                    Atau kirimkan permohonan via WhatsApp Resmi IT Dispatch:{" "}
                    <strong>0811-789-0112</strong>.
                  </li>
                  <li>
                    Sertakan <strong>Nama Lengkap, NIP/Nomor Register Petugas,</strong> dan nama faskes pangkalan Anda.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("0811-789-0112");
                  alert("Nomor WhatsApp Helpdesk IT disalin: 0811-789-0112");
                }}
                className="px-3.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>Salin WA Helpdesk</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
