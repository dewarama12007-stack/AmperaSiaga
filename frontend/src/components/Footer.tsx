import Logo from "./Logo";

interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-[#131b2e] text-slate-300 border-t border-[#747686]/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        {/* 4 Kolom Grid Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Kolom 1: Logo & Deskripsi */}
          <div className="space-y-4">
            <Logo variant="inline" isDark={true} />
            <p className="text-xs leading-relaxed text-slate-400">
              Platform prototipe dan simulasi layanan tanggap darurat medis Kota Palembang, memetakan unit ambulans di
              Seberang Ilir dan Ulu secara real-time.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Simulasi Operasional 2026</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigasi Cepat</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a className="hover:text-white transition-colors" href="#beranda">
                  Beranda
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#cari-ambulans">
                  Cari Ambulans
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#cara-kerja">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#disclaimer">
                  Disclaimer
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#cari-ambulans">
                  Peta Palembang
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Darurat Resmi */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Layanan Darurat Resmi</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-white">Panggilan Darurat 112</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Bebas pulsa tanggap bencana & darurat Kota Palembang.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-white">SPGDT 119</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Sistem Penanggulangan Gawat Darurat Terpadu Kemenkes RI.
                </div>
              </div>
            </div>
          </div>

          {/* Kolom 4: Akses Khusus Admin & Kontak Dispatch */}
          <div className="space-y-3" id="kontak-admin">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Akses Posko &amp; Admin</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pusat koordinasi armada siaga darurat Kota Palembang.
            </p>
            <div className="space-y-2 pt-0.5">
              <a
                href="https://wa.me/6282162319964?text=Halo%20Admin%20AmperaSiaga%2C%20saya%20membutuhkan%20informasi%20layanan%20ambulans."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#0F7B6C] hover:bg-[#0B5E53] text-white text-xs font-bold transition-all shadow-xs"
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">chat</span>
                  <span>WA: 0821-6231-9964</span>
                </span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md uppercase font-semibold">Siaga</span>
              </a>
              <button
                onClick={onOpenAdmin}
                className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Masuk Admin Posko</span>
              </button>
            </div>
          </div>
        </div>

        {/* Baris Bawah / Copyright Line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 text-center md:text-left">
          <div>
            AmperaSiaga adalah prototype. Data ambulans adalah simulasi. Hak Cipta © 2026 AmperaSiaga Palembang.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <a className="hover:text-white transition-colors" href="#disclaimer">
              Kebijakan Privasi
            </a>
            <span>•</span>
            <a className="hover:text-white transition-colors" href="#disclaimer">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
