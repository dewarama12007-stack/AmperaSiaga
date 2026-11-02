import React from "react";

export default function FloatingEmergencyButton() {
  return (
    <div className="fixed bottom-5 right-5 z-40 md:hidden animate-bounce">
      <a
        aria-label="Panggil Darurat 112"
        className="w-14 h-14 rounded-full bg-[#dc2626] text-white shadow-2xl flex items-center justify-center active:scale-95 transition-transform border-2 border-white ring-4 ring-red-300"
        href="tel:112"
      >
        <span className="material-symbols-outlined fill text-2xl">emergency</span>
      </a>
    </div>
  );
}
