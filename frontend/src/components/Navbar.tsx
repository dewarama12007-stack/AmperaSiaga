"use client";

import React, { useState } from "react";
import AdminModal from "./AdminModal";

import Logo from "./Logo";

interface NavbarProps {
  onOpenAdmin?: () => void;
}

export default function Navbar({ onOpenAdmin }: NavbarProps) {
  const [internalAdminOpen, setInternalAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenAdmin = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    } else {
      setInternalAdminOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-[#c4c5d7]/50 shadow-xs">
        <div className="w-full px-4 md:px-8 lg:px-12 max-w-7xl mx-auto flex items-center justify-between h-16">
          {/* Brand Logo AmperaSiaga Biru Merah */}
          <a
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            href="#beranda"
            aria-label="AmperaSiaga Beranda"
          >
            <Logo variant="inline" />
          </a>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <a className="text-[#1d4ed8] font-bold border-b-2 border-[#1d4ed8] pb-1" href="#beranda">
              Beranda
            </a>
            <a className="text-[#434655] hover:text-[#1d4ed8] transition-colors" href="#cari-ambulans">
              Cari Ambulans
            </a>
            <a className="text-[#434655] hover:text-[#1d4ed8] transition-colors" href="#cara-kerja">
              Cara Kerja
            </a>
            <a className="text-[#434655] hover:text-[#1d4ed8] transition-colors" href="#disclaimer">
              Disclaimer
            </a>
          </nav>

          {/* Trailing Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-[#131b2e] border border-[#c4c5d7] hover:bg-[#eaedff] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">support_agent</span>
              <span>Masuk Admin</span>
            </a>
            <a
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-all shadow-sm active:scale-95"
              href="tel:112"
            >
              <span className="material-symbols-outlined fill text-lg">emergency</span>
              <span className="hidden sm:inline">Hubungi 112 / 119</span>
              <span className="sm:hidden">112 / 119</span>
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#131b2e] hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 bg-white border-b border-slate-200 flex flex-col gap-3">
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#1d4ed8] font-bold py-2 border-b border-slate-100"
              href="#beranda"
            >
              Beranda
            </a>
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#434655] font-semibold py-2 border-b border-slate-100"
              href="#cari-ambulans"
            >
              Cari Ambulans
            </a>
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#434655] font-semibold py-2 border-b border-slate-100"
              href="#cara-kerja"
            >
              Cara Kerja
            </a>
            <a
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#434655] font-semibold py-2 border-b border-slate-100"
              href="#disclaimer"
            >
              Disclaimer
            </a>
            <a
              href="/admin"
              className="flex items-center gap-2 text-left py-2 text-[#131b2e] font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">support_agent</span>
              <span>Masuk Admin</span>
            </a>
          </div>
        )}
      </header>

      {/* Admin Login Modal (if managed internally) */}
      {!onOpenAdmin && internalAdminOpen && (
        <AdminModal onClose={() => setInternalAdminOpen(false)} />
      )}
    </>
  );
}
