import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "inline";
  height?: number;
  width?: number;
  isDark?: boolean;
}

export default function Logo({
  className = "",
  variant = "full",
  height = 42,
  width = 168,
  isDark = false,
}: LogoProps) {
  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 120 120"
        className={`w-10 h-10 shrink-0 ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="amperaRedIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="medBlueIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="musiRiverIcon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DBEAFE" />
            <stop offset="50%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </linearGradient>
        </defs>
        {/* Container Badge Shield/Squircle */}
        <rect x="2" y="2" width="116" height="116" rx="28" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        {/* Subtle Sungai Musi wave */}
        <path d="M 12 94 C 36 90, 84 98, 108 94 L 108 102 C 90 106, 30 106, 12 102 Z" fill="url(#musiRiverIcon)" />
        {/* Jembatan Ampera Horizontal Deck */}
        <rect x="18" y="70" width="84" height="6" rx="2" fill="url(#amperaRedIcon)" />
        {/* Left Tower */}
        <path d="M38 32 L46 32 L48 88 L36 88 Z" fill="url(#amperaRedIcon)" />
        <polygon points="34,32 50,32 46,22 38,22" fill="#991B1B" />
        <rect x="40" y="42" width="4" height="8" rx="1" fill="#FFFFFF" opacity="0.95" />
        <rect x="40" y="56" width="4" height="8" rx="1" fill="#FFFFFF" opacity="0.95" />
        {/* Right Tower */}
        <path d="M74 32 L82 32 L84 88 L72 88 Z" fill="url(#amperaRedIcon)" />
        <polygon points="70,32 86,32 82,22 74,22" fill="#991B1B" />
        <rect x="76" y="42" width="4" height="8" rx="1" fill="#FFFFFF" opacity="0.95" />
        <rect x="76" y="56" width="4" height="8" rx="1" fill="#FFFFFF" opacity="0.95" />
        {/* Cable Stays */}
        <line x1="42" y1="36" x2="20" y2="70" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
        <line x1="78" y1="36" x2="100" y2="70" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
        {/* Medical Cross Base */}
        <circle cx="60" cy="58" r="23" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="1.5" />
        <rect x="54" y="42" width="12" height="32" rx="3.5" fill="url(#medBlueIcon)" />
        <rect x="44" y="52" width="32" height="12" rx="3.5" fill="url(#medBlueIcon)" />
        {/* Heartbeat pulse */}
        <path
          d="M 45 58 L 52 58 L 55 50 L 59 66 L 63 53 L 66 58 L 75 58"
          stroke="#FFFFFF"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="60" cy="58" r="2.2" fill="#EF4444" />
      </svg>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <Logo variant="icon" />
        <div className="flex flex-col">
          <span className="font-extrabold text-xl tracking-tight leading-none">
            <span className={isDark ? "text-white" : "text-[#1D4ED8]"}>Ampera</span>
            <span className="text-[#DC2626]">Siaga</span>
          </span>
          <span className={`text-[9.5px] font-bold tracking-wider uppercase mt-0.5 ${isDark ? "text-slate-400" : "text-[#475569]"}`}>
            Palembang
          </span>
        </div>
      </div>
    );
  }

  // Full SVG Logo from Stitch
  return (
    <div className={`relative inline-block ${className}`} style={{ width, height }}>
      <Image
        src="/logo-amperasiaga.svg"
        alt="Logo AmperaSiaga Biru Merah"
        width={width}
        height={height}
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  );
}
