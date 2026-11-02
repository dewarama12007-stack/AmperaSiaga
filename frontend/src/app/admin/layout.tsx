import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Command Center Dispatcher | AmperaSiaga Palembang",
  description:
    "Pusat Komando Operasional & Pemantauan Telemetri Ambulans Gawat Darurat PSC 119 Kota Palembang",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

