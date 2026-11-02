"use client";

import React, { useState } from "react";

import Logo from "./Logo";

interface AdminModalProps {
  onClose: () => void;
}

export default function AdminModal({ onClose }: AdminModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      setStatusMsg("Portal prototipe: Login berhasil disimulasikan. Mode manajemen armada terbuka.");
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Tutup"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Logo variant="icon" />
          <div>
            <h3 className="text-xl font-bold text-[#131b2e]">Portal Posko & Admin</h3>
            <p className="text-xs text-[#434655]">AmperaSiaga Dispatcher Palembang</p>
          </div>
        </div>

        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-1">Email / ID Petugas</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="petugas@palembangsiaga.go.id"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1d4ed8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#131b2e] mb-1">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1d4ed8]"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="rounded text-[#1d4ed8]" />
              <span>Ingat saya</span>
            </label>
            <span className="text-[#1d4ed8] hover:underline cursor-pointer">Lupa sandi?</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#1d4ed8] text-white font-bold text-sm hover:bg-[#1e40af] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Memverifikasi...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">lock</span>
                <span>Masuk ke Dashboard Posko</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Khusus unit operasional RSUP Dr. Mohammad Hoesin, Charitas, PMI, & Dinas Kesehatan Palembang.
          </p>
        </div>
      </div>
    </div>
  );
}
