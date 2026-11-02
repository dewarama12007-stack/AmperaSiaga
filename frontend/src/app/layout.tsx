import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AmperaSiaga - Layanan Informasi Ambulans Kota Palembang",
  description:
    "Temukan layanan ambulans di Palembang, jarak dan estimasi waktu tempuhnya, lalu hubungi admin lewat WhatsApp untuk verifikasi unit siaga. Siaga 112 / 119.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
