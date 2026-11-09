import { Ambulance, Provider, StatsData } from "@/types";

const getCleanApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!envUrl) return "http://127.0.0.1:8000/api";
  const stripped = envUrl.replace(/\/+$/, "");
  return stripped.endsWith("/api") ? stripped : `${stripped}/api`;
};

const API_BASE_URL = getCleanApiBaseUrl();

// 25 Rumah Sakit & Fasilitas Kesehatan Palembang (Koordinat Resmi Terverifikasi)
export const FALLBACK_PROVIDERS: Provider[] = [
  {
    id: 1,
    name: "RSUP Dr. Mohammad Hoesin (RSMH)",
    type: "rumah_sakit",
    address: "Jl. Jend. Sudirman Km. 3,5, Sekip Jaya, Kemuning, Palembang",
    phone: "(0711) 354088",
    whatsapp_admin: "6282162319964",
    latitude: -2.966654,
    longitude: 104.750067,
    is_active: true,
  },
  {
    id: 2,
    name: "RS Bhayangkara M. Hasan",
    type: "rumah_sakit",
    address: "Jl. Jend. Sudirman KM 4,5, Ario Kemuning, Kemuning, Palembang",
    phone: "(0711) 410023",
    whatsapp_admin: "6282162319964",
    latitude: -2.959032,
    longitude: 104.737223,
    is_active: true,
  },
  {
    id: 3,
    name: "RSU Sriwijaya",
    type: "rumah_sakit",
    address: "Jl. Jend. Sudirman KM 4,5 No. 502, 20 Ilir D. IV, Ilir Timur I, Palembang",
    phone: "(0711) 372222",
    whatsapp_admin: "6282162319964",
    latitude: -2.959631,
    longitude: 104.737009,
    is_active: true,
  },
  {
    id: 4,
    name: "RS RK Charitas (Sudirman)",
    type: "rumah_sakit",
    address: "Jl. Jend. Sudirman No. 1054, Sungai Pangeran, Ilir Timur I, Palembang",
    phone: "(0711) 353374",
    whatsapp_admin: "6282162319964",
    latitude: -2.975063,
    longitude: 104.752677,
    is_active: true,
  },
  {
    id: 5,
    name: "RS Siloam Sriwijaya",
    type: "rumah_sakit",
    address: "Jl. POM IX, Komp. Palembang Square, Lorok Pakjo, Ilir Barat I, Palembang",
    phone: "1500911",
    whatsapp_admin: "6282162319964",
    latitude: -2.97777,
    longitude: 104.742333,
    is_active: true,
  },
  {
    id: 6,
    name: "RS Islam Siti Khadijah",
    type: "rumah_sakit",
    address: "Jl. Demang Lebar Daun No. 175, Lorok Pakjo, Ilir Barat I, Palembang",
    phone: "(0711) 356001",
    whatsapp_admin: "6282162319964",
    latitude: -2.97165,
    longitude: 104.73141,
    is_active: true,
  },
  {
    id: 7,
    name: "RS Bunda Palembang",
    type: "rumah_sakit",
    address: "Jl. Demang Lebar Daun No. 70, Ilir Barat I, Palembang",
    phone: "(0711) 411778",
    whatsapp_admin: "6282162319964",
    latitude: -2.967935,
    longitude: 104.73444,
    is_active: true,
  },
  {
    id: 8,
    name: "RS Graha Mandiri",
    type: "rumah_sakit",
    address: "Jl. Kol. H. Burlian No. 11, Siring Agung, Ilir Barat I, Palembang",
    phone: "(0711) 410058",
    whatsapp_admin: "6282162319964",
    latitude: -2.968521,
    longitude: 104.726269,
    is_active: true,
  },
  {
    id: 9,
    name: "RSUD Siti Fatimah (Prov. Sumsel)",
    type: "rumah_sakit",
    address: "Jl. Kol. H. Burlian Km. 6, Sukabangun, Sukarami, Palembang",
    phone: "(0711) 5718883",
    whatsapp_admin: "6282162319964",
    latitude: -2.948235,
    longitude: 104.73455,
    is_active: true,
  },
  {
    id: 10,
    name: "RS Charitas KM 7",
    type: "rumah_sakit",
    address: "Jl. Kol. H. Burlian No. 228, KM 7, Sukarami, Palembang",
    phone: "(0711) 363636",
    whatsapp_admin: "6282162319964",
    latitude: -2.941137,
    longitude: 104.726085,
    is_active: true,
  },
  {
    id: 11,
    name: "RS Hermina Palembang",
    type: "rumah_sakit",
    address: "Jl. Jend. Basuki Rachmat No. 897, Pahlawan, Kemuning, Palembang",
    phone: "(0711) 352525",
    whatsapp_admin: "6282162319964",
    latitude: -2.955805,
    longitude: 104.748308,
    is_active: true,
  },
  {
    id: 12,
    name: "RS Muhammadiyah Palembang",
    type: "rumah_sakit",
    address: "Jl. Jend. Ahmad Yani No. 13, 13 Ulu, Seberang Ulu II, Palembang",
    phone: "(0711) 519191",
    whatsapp_admin: "6282162319964",
    latitude: -2.996363,
    longitude: 104.776689,
    is_active: true,
  },
  {
    id: 13,
    name: "RSUD Palembang BARI",
    type: "rumah_sakit",
    address: "Jl. Panca Usaha No. 1, 5 Ulu, Seberang Ulu I, Palembang",
    phone: "(0711) 510670",
    whatsapp_admin: "6282162319964",
    latitude: -3.010678,
    longitude: 104.768599,
    is_active: true,
  },
  {
    id: 14,
    name: "RS dr. AK Gani",
    type: "rumah_sakit",
    address: "Jl. Dr. AK Gani No. 1, 19 Ilir, Bukit Kecil (Benteng Kuto Besak), Palembang",
    phone: "(0711) 354691",
    whatsapp_admin: "6282162319964",
    latitude: -2.990328,
    longitude: 104.760142,
    is_active: true,
  },
  {
    id: 15,
    name: "IHC RS Pelabuhan",
    type: "rumah_sakit",
    address: "Jl. Mayor Memet Sastrawirya No. 1, Boom Baru, Lawang Kidul, Ilir Timur II, Palembang",
    phone: "(0711) 714422",
    whatsapp_admin: "6282162319964",
    latitude: -2.979007,
    longitude: 104.776816,
    is_active: true,
  },
  {
    id: 16,
    name: "RS Permata Palembang",
    type: "rumah_sakit",
    address: "Jl. Soekarno Hatta No. 88, Karya Baru, Alang-Alang Lebar, Palembang",
    phone: "(0711) 561234",
    whatsapp_admin: "6282162319964",
    latitude: -2.985984,
    longitude: 104.718573,
    is_active: true,
  },
  {
    id: 17,
    name: "RS Namira",
    type: "rumah_sakit",
    address: "Jl. Kol. H. Burlian Km. 9, Sukarami, Palembang",
    phone: "(0711) 412233",
    whatsapp_admin: "6282162319964",
    latitude: -2.91082,
    longitude: 104.713631,
    is_active: true,
  },
  {
    id: 18,
    name: "RS Pusri",
    type: "rumah_sakit",
    address: "Komp. PT Pusri, Jl. Mayor Zen, Sei Selayur, Kalidoni, Palembang",
    phone: "(0711) 712222",
    whatsapp_admin: "6282162319964",
    latitude: -2.970278,
    longitude: 104.801361,
    is_active: true,
  },
  {
    id: 19,
    name: "RS Pertamina Plaju",
    type: "rumah_sakit",
    address: "Komp. Pertamina RU III, Jl. Pengantingan No. 1, Komperta, Plaju, Palembang",
    phone: "(0711) 596111",
    whatsapp_admin: "6282162319964",
    latitude: -2.994504,
    longitude: 104.824686,
    is_active: true,
  },
  {
    id: 20,
    name: "Charitas Hospital Kenten",
    type: "rumah_sakit",
    address: "Jl. Betawi Raya No. 1340, Lebong Gajah, Sematang Borang, Palembang",
    phone: "(0711) 820251",
    whatsapp_admin: "6282162319964",
    latitude: -2.937275,
    longitude: 104.794784,
    is_active: true,
  },
  {
    id: 21,
    name: "RSIA Azzahra",
    type: "rumah_sakit",
    address: "Jl. MP. Mangkunegara No. 16, 8 Ilir, Ilir Timur II, Palembang",
    phone: "(0711) 810787",
    whatsapp_admin: "6282162319964",
    latitude: -2.942285,
    longitude: 104.78411,
    is_active: true,
  },
  {
    id: 22,
    name: "RS Hermina OPI Jakabaring",
    type: "rumah_sakit",
    address: "Jl. Gubernur H.A. Bastari, Kompleks OPI Mall, Jakabaring, Palembang",
    phone: "(0711) 5742525",
    whatsapp_admin: "6282162319964",
    latitude: -3.033882,
    longitude: 104.790994,
    is_active: true,
  },
  {
    id: 23,
    name: "RS Bunda Medika Jakabaring",
    type: "rumah_sakit",
    address: "Jl. Gubernur H.A. Bastari No. 10, Jakabaring Selatan, Palembang",
    phone: "(0711) 5740000",
    whatsapp_admin: "6282162319964",
    latitude: -3.049886,
    longitude: 104.803343,
    is_active: true,
  },
  {
    id: 24,
    name: "RSIA Marissa (Plaju)",
    type: "rumah_sakit",
    address: "Jl. DI Panjaitan No. 12, Bagus Kuning, Plaju, Palembang",
    phone: "(0711) 541234",
    whatsapp_admin: "6282162319964",
    latitude: -3.005749,
    longitude: 104.818078,
    is_active: true,
  },
  {
    id: 25,
    name: "RS Rika Amelia (Alang-Alang Lebar)",
    type: "rumah_sakit",
    address: "Jl. By Pass Alang-Alang Lebar No. 89, Sukarami, Palembang",
    phone: "(0711) 742111",
    whatsapp_admin: "6282162319964",
    latitude: -2.913931,
    longitude: 104.695589,
    is_active: true,
  },
];

// 28 Unit Ambulans Tersebar di 25 Rumah Sakit Palembang
export const FALLBACK_AMBULANCES: Ambulance[] = [
  {
    id: 1,
    unit_code: "AMB-001",
    name: "Ambulans A",
    provider_id: 1,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -2.966654,
    longitude: 104.750067,
    base_location: "IGD RSUP Dr. Mohammad Hoesin (RSMH)",
    driver_name: "Budi Santoso",
    driver_phone: "081234567001",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile RSMH rujukan utama Sumsel, ventilator portable & defibrillator.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 1,
      name: "RSUP Dr. Mohammad Hoesin (RSMH)",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman Km. 3,5, Sekip Jaya, Kemuning, Palembang",
      phone: "(0711) 354088",
      whatsapp_admin: "6282162319964",
      latitude: -2.966654,
      longitude: 104.750067,
      is_active: true,
    },
  },
  {
    id: 2,
    unit_code: "AMB-002",
    name: "Ambulans B",
    provider_id: 1,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.966654,
    longitude: 104.750067,
    base_location: "IGD RSUP Dr. Mohammad Hoesin (RSMH)",
    driver_name: "Hendri Prasetyo",
    driver_phone: "081234567002",
    whatsapp_number: "6282162319964",
    description: "Ambulans gawat darurat standar dengan monitor & oksigen tabung IGD RSMH.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 1,
      name: "RSUP Dr. Mohammad Hoesin (RSMH)",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman Km. 3,5, Sekip Jaya, Kemuning, Palembang",
      phone: "(0711) 354088",
      whatsapp_admin: "6282162319964",
      latitude: -2.966654,
      longitude: 104.750067,
      is_active: true,
    },
  },
  {
    id: 3,
    unit_code: "AMB-003",
    name: "Ambulans C",
    provider_id: 2,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.959032,
    longitude: 104.737223,
    base_location: "IGD RS Bhayangkara M. Hasan",
    driver_name: "Eko Prabowo",
    driver_phone: "081234567003",
    whatsapp_number: "6282162319964",
    description: "Ambulans taktis medis RS Bhayangkara Polda Sumsel Jl. Sudirman Km. 4,5.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 2,
      name: "RS Bhayangkara M. Hasan",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman KM 4,5, Ario Kemuning, Kemuning, Palembang",
      phone: "(0711) 410023",
      whatsapp_admin: "6282162319964",
      latitude: -2.959032,
      longitude: 104.737223,
      is_active: true,
    },
  },
  {
    id: 4,
    unit_code: "AMB-004",
    name: "Ambulans D",
    provider_id: 3,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.959631,
    longitude: 104.737009,
    base_location: "IGD RSU Sriwijaya",
    driver_name: "Agus Setiawan",
    driver_phone: "081234567004",
    whatsapp_number: "6282162319964",
    description: "Ambulans evakuasi medis RSU Sriwijaya, siaga rujukan Km. 4,5 Palembang.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 3,
      name: "RSU Sriwijaya",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman KM 4,5 No. 502, 20 Ilir D. IV, Ilir Timur I, Palembang",
      phone: "(0711) 372222",
      whatsapp_admin: "6282162319964",
      latitude: -2.959631,
      longitude: 104.737009,
      is_active: true,
    },
  },
  {
    id: 5,
    unit_code: "AMB-005",
    name: "Ambulans E",
    provider_id: 4,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -2.975063,
    longitude: 104.752677,
    base_location: "IGD RS RK Charitas (Sudirman)",
    driver_name: "Rian Hidayat",
    driver_phone: "081234567005",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile RS RK Charitas Sudirman dengan peralatan resusitasi jantung lengkap.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 4,
      name: "RS RK Charitas (Sudirman)",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman No. 1054, Sungai Pangeran, Ilir Timur I, Palembang",
      phone: "(0711) 353374",
      whatsapp_admin: "6282162319964",
      latitude: -2.975063,
      longitude: 104.752677,
      is_active: true,
    },
  },
  {
    id: 6,
    unit_code: "AMB-006",
    name: "Ambulans F",
    provider_id: 4,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.975063,
    longitude: 104.752677,
    base_location: "IGD RS RK Charitas (Sudirman)",
    driver_name: "Doni Wijaya",
    driver_phone: "081234567006",
    whatsapp_number: "6282162319964",
    description: "Ambulans respon cepat RS Charitas Sudirman koridor pusat kota Simpang Charitas.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 4,
      name: "RS RK Charitas (Sudirman)",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman No. 1054, Sungai Pangeran, Ilir Timur I, Palembang",
      phone: "(0711) 353374",
      whatsapp_admin: "6282162319964",
      latitude: -2.975063,
      longitude: 104.752677,
      is_active: true,
    },
  },
  {
    id: 7,
    unit_code: "AMB-007",
    name: "Ambulans G",
    provider_id: 5,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -2.97777,
    longitude: 104.742333,
    base_location: "IGD RS Siloam Sriwijaya",
    driver_name: "Fajar Nugraha",
    driver_phone: "081234567007",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile Siloam Sriwijaya area POM IX Palembang Square, monitor multi-parameter.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 5,
      name: "RS Siloam Sriwijaya",
      type: "rumah_sakit",
      address: "Jl. POM IX, Komp. Palembang Square, Lorok Pakjo, Ilir Barat I, Palembang",
      phone: "1500911",
      whatsapp_admin: "6282162319964",
      latitude: -2.97777,
      longitude: 104.742333,
      is_active: true,
    },
  },
  {
    id: 8,
    unit_code: "AMB-008",
    name: "Ambulans H",
    provider_id: 6,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.97165,
    longitude: 104.73141,
    base_location: "IGD RS Islam Siti Khadijah",
    driver_name: "Hendra Saputra",
    driver_phone: "081234567008",
    whatsapp_number: "6282162319964",
    description: "Ambulans gawat darurat RSI Siti Khadijah koridor Demang Lebar Daun.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 6,
      name: "RS Islam Siti Khadijah",
      type: "rumah_sakit",
      address: "Jl. Demang Lebar Daun No. 175, Lorok Pakjo, Ilir Barat I, Palembang",
      phone: "(0711) 356001",
      whatsapp_admin: "6282162319964",
      latitude: -2.97165,
      longitude: 104.73141,
      is_active: true,
    },
  },
  {
    id: 9,
    unit_code: "AMB-009",
    name: "Ambulans I",
    provider_id: 7,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.967935,
    longitude: 104.73444,
    base_location: "IGD RS Bunda Palembang",
    driver_name: "Irfan Hakim",
    driver_phone: "081234567009",
    whatsapp_number: "6282162319964",
    description: "Ambulans siaga 24 jam RS Bunda Palembang Jl. Demang Lebar Daun No. 70.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 7,
      name: "RS Bunda Palembang",
      type: "rumah_sakit",
      address: "Jl. Demang Lebar Daun No. 70, Ilir Barat I, Palembang",
      phone: "(0711) 411778",
      whatsapp_admin: "6282162319964",
      latitude: -2.967935,
      longitude: 104.73444,
      is_active: true,
    },
  },
  {
    id: 10,
    unit_code: "AMB-010",
    name: "Ambulans J",
    provider_id: 8,
    status: "offline",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.968521,
    longitude: 104.726269,
    base_location: "IGD RS Graha Mandiri",
    driver_name: "Joko Susilo",
    driver_phone: "081234567010",
    whatsapp_number: "6282162319964",
    description: "Ambulans RS Graha Mandiri, dalam jadwal perawatan servis berkala.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 8,
      name: "RS Graha Mandiri",
      type: "rumah_sakit",
      address: "Jl. Kol. H. Burlian No. 11, Siring Agung, Ilir Barat I, Palembang",
      phone: "(0711) 410058",
      whatsapp_admin: "6282162319964",
      latitude: -2.968521,
      longitude: 104.726269,
      is_active: true,
    },
  },
  {
    id: 11,
    unit_code: "AMB-011",
    name: "Ambulans K",
    provider_id: 9,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -2.948235,
    longitude: 104.73455,
    base_location: "IGD RSUD Siti Fatimah (Prov. Sumsel)",
    driver_name: "Kurniawan",
    driver_phone: "081234567011",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile RSUD Siti Fatimah Provinsi Sumsel Km. 6, ventilator transport digital.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 9,
      name: "RSUD Siti Fatimah (Prov. Sumsel)",
      type: "rumah_sakit",
      address: "Jl. Kol. H. Burlian Km. 6, Sukabangun, Sukarami, Palembang",
      phone: "(0711) 5718883",
      whatsapp_admin: "6282162319964",
      latitude: -2.948235,
      longitude: 104.73455,
      is_active: true,
    },
  },
  {
    id: 12,
    unit_code: "AMB-012",
    name: "Ambulans L",
    provider_id: 10,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.941137,
    longitude: 104.726085,
    base_location: "IGD RS Charitas KM 7",
    driver_name: "Lukman Harun",
    driver_phone: "081234567012",
    whatsapp_number: "6282162319964",
    description: "Ambulans siaga 24 jam RS Charitas KM 7 (Myria) kawasan Sukarami.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 10,
      name: "RS Charitas KM 7",
      type: "rumah_sakit",
      address: "Jl. Kol. H. Burlian No. 228, KM 7, Sukarami, Palembang",
      phone: "(0711) 363636",
      whatsapp_admin: "6282162319964",
      latitude: -2.941137,
      longitude: 104.726085,
      is_active: true,
    },
  },
  {
    id: 13,
    unit_code: "AMB-013",
    name: "Ambulans M",
    provider_id: 11,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.955805,
    longitude: 104.748308,
    base_location: "IGD RS Hermina Palembang",
    driver_name: "M. Rizki",
    driver_phone: "081234567013",
    whatsapp_number: "6282162319964",
    description: "Ambulans darurat RS Hermina, dilengkapi inkubator transport bayi & oksigen.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 11,
      name: "RS Hermina Palembang",
      type: "rumah_sakit",
      address: "Jl. Jend. Basuki Rachmat No. 897, Pahlawan, Kemuning, Palembang",
      phone: "(0711) 352525",
      whatsapp_admin: "6282162319964",
      latitude: -2.955805,
      longitude: 104.748308,
      is_active: true,
    },
  },
  {
    id: 14,
    unit_code: "AMB-014",
    name: "Ambulans N",
    provider_id: 12,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.996363,
    longitude: 104.776689,
    base_location: "IGD RS Muhammadiyah Palembang",
    driver_name: "Noval Pratama",
    driver_phone: "081234567014",
    whatsapp_number: "6282162319964",
    description: "Ambulans darurat RS Muhammadiyah Palembang, pangkalan zona Seberang Ulu II.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 12,
      name: "RS Muhammadiyah Palembang",
      type: "rumah_sakit",
      address: "Jl. Jend. Ahmad Yani No. 13, 13 Ulu, Seberang Ulu II, Palembang",
      phone: "(0711) 519191",
      whatsapp_admin: "6282162319964",
      latitude: -2.996363,
      longitude: 104.776689,
      is_active: true,
    },
  },
  {
    id: 15,
    unit_code: "AMB-015",
    name: "Ambulans O",
    provider_id: 13,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -3.010678,
    longitude: 104.768599,
    base_location: "IGD RSUD Palembang BARI",
    driver_name: "Oki Chandra",
    driver_phone: "081234567015",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile RSUD BARI, posko utama tanggap darurat zona Seberang Ulu I.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 13,
      name: "RSUD Palembang BARI",
      type: "rumah_sakit",
      address: "Jl. Panca Usaha No. 1, 5 Ulu, Seberang Ulu I, Palembang",
      phone: "(0711) 510670",
      whatsapp_admin: "6282162319964",
      latitude: -3.010678,
      longitude: 104.768599,
      is_active: true,
    },
  },
  {
    id: 16,
    unit_code: "AMB-016",
    name: "Ambulans P",
    provider_id: 13,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -3.010678,
    longitude: 104.768599,
    base_location: "IGD RSUD Palembang BARI",
    driver_name: "Panji Gumilang",
    driver_phone: "081234567016",
    whatsapp_number: "6282162319964",
    description: "Ambulans evakuasi standar RSUD BARI Jl. Panca Usaha 5 Ulu Palembang.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 13,
      name: "RSUD Palembang BARI",
      type: "rumah_sakit",
      address: "Jl. Panca Usaha No. 1, 5 Ulu, Seberang Ulu I, Palembang",
      phone: "(0711) 510670",
      whatsapp_admin: "6282162319964",
      latitude: -3.010678,
      longitude: 104.768599,
      is_active: true,
    },
  },
  {
    id: 17,
    unit_code: "AMB-017",
    name: "Ambulans Q",
    provider_id: 14,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.990328,
    longitude: 104.760142,
    base_location: "IGD RS dr. AK Gani",
    driver_name: "Serka Anton",
    driver_phone: "081234567017",
    whatsapp_number: "6282162319964",
    description: "Ambulans taktis medis RS AK Gani Kesdam II Sriwijaya kawasan Benteng Kuto Besak.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 14,
      name: "RS dr. AK Gani",
      type: "rumah_sakit",
      address: "Jl. Dr. AK Gani No. 1, 19 Ilir, Bukit Kecil (Benteng Kuto Besak), Palembang",
      phone: "(0711) 354691",
      whatsapp_admin: "6282162319964",
      latitude: -2.990328,
      longitude: 104.760142,
      is_active: true,
    },
  },
  {
    id: 18,
    unit_code: "AMB-018",
    name: "Ambulans R",
    provider_id: 15,
    status: "offline",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.979007,
    longitude: 104.776816,
    base_location: "IGD IHC RS Pelabuhan",
    driver_name: "Robby Darmawan",
    driver_phone: "081234567018",
    whatsapp_number: "6282162319964",
    description: "Ambulans RS Pelabuhan Boom Baru, dalam pengecekan berkala kelayakan operasional.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 15,
      name: "IHC RS Pelabuhan",
      type: "rumah_sakit",
      address: "Jl. Mayor Memet Sastrawirya No. 1, Boom Baru, Lawang Kidul, Ilir Timur II, Palembang",
      phone: "(0711) 714422",
      whatsapp_admin: "6282162319964",
      latitude: -2.979007,
      longitude: 104.776816,
      is_active: true,
    },
  },
  {
    id: 19,
    unit_code: "AMB-019",
    name: "Ambulans S",
    provider_id: 16,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.985984,
    longitude: 104.718573,
    base_location: "IGD RS Permata Palembang",
    driver_name: "Surya Kencana",
    driver_phone: "081234567019",
    whatsapp_number: "6282162319964",
    description: "Ambulans RS Permata Palembang Jl. Soekarno Hatta, siaga rujukan Ilir Barat I.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 16,
      name: "RS Permata Palembang",
      type: "rumah_sakit",
      address: "Jl. Soekarno Hatta No. 88, Karya Baru, Alang-Alang Lebar, Palembang",
      phone: "(0711) 561234",
      whatsapp_admin: "6282162319964",
      latitude: -2.985984,
      longitude: 104.718573,
      is_active: true,
    },
  },
  {
    id: 20,
    unit_code: "AMB-020",
    name: "Ambulans T",
    provider_id: 17,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.91082,
    longitude: 104.713631,
    base_location: "IGD RS Namira",
    driver_name: "Taufik Hidayat",
    driver_phone: "081234567020",
    whatsapp_number: "6282162319964",
    description: "Ambulans RS Namira Jl. Kol. H. Burlian Km. 9 kawasan Sukarami utara.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 17,
      name: "RS Namira",
      type: "rumah_sakit",
      address: "Jl. Kol. H. Burlian Km. 9, Sukarami, Palembang",
      phone: "(0711) 412233",
      whatsapp_admin: "6282162319964",
      latitude: -2.91082,
      longitude: 104.713631,
      is_active: true,
    },
  },
  {
    id: 21,
    unit_code: "AMB-021",
    name: "Ambulans U",
    provider_id: 18,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.970278,
    longitude: 104.801361,
    base_location: "IGD RS Pusri",
    driver_name: "Umar Bakri",
    driver_phone: "081234567021",
    whatsapp_number: "6282162319964",
    description: "Ambulans gawat darurat RS Pusri kawasan industri Sei Selayur Kalidoni.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 18,
      name: "RS Pusri",
      type: "rumah_sakit",
      address: "Komp. PT Pusri, Jl. Mayor Zen, Sei Selayur, Kalidoni, Palembang",
      phone: "(0711) 712222",
      whatsapp_admin: "6282162319964",
      latitude: -2.970278,
      longitude: 104.801361,
      is_active: true,
    },
  },
  {
    id: 22,
    unit_code: "AMB-022",
    name: "Ambulans V",
    provider_id: 19,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.994504,
    longitude: 104.824686,
    base_location: "IGD RS Pertamina Plaju",
    driver_name: "Vicky Prasetyo",
    driver_phone: "081234567022",
    whatsapp_number: "6282162319964",
    description: "Ambulans RS Pertamina Plaju, melayani wilayah Komperta, Bagus Kuning & Plaju.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 19,
      name: "RS Pertamina Plaju",
      type: "rumah_sakit",
      address: "Komp. Pertamina RU III, Jl. Pengantingan No. 1, Komperta, Plaju, Palembang",
      phone: "(0711) 596111",
      whatsapp_admin: "6282162319964",
      latitude: -2.994504,
      longitude: 104.824686,
      is_active: true,
    },
  },
  {
    id: 23,
    unit_code: "AMB-023",
    name: "Ambulans W",
    provider_id: 20,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.937275,
    longitude: 104.794784,
    base_location: "IGD Charitas Hospital Kenten",
    driver_name: "Wahyu Ramadhan",
    driver_phone: "081234567023",
    whatsapp_number: "6282162319964",
    description: "Ambulans Charitas Hospital Kenten Jl. Betawi Raya Sematang Borang / Sako.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 20,
      name: "Charitas Hospital Kenten",
      type: "rumah_sakit",
      address: "Jl. Betawi Raya No. 1340, Lebong Gajah, Sematang Borang, Palembang",
      phone: "(0711) 820251",
      whatsapp_admin: "6282162319964",
      latitude: -2.937275,
      longitude: 104.794784,
      is_active: true,
    },
  },
  {
    id: 24,
    unit_code: "AMB-024",
    name: "Ambulans X",
    provider_id: 21,
    status: "offline",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.942285,
    longitude: 104.78411,
    base_location: "IGD RSIA Azzahra",
    driver_name: "Xaverius T.",
    driver_phone: "081234567024",
    whatsapp_number: "6282162319964",
    description: "Ambulans RSIA Azzahra MP Mangkunegara, pemeliharaan rutin perlengkapan medis.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 21,
      name: "RSIA Azzahra",
      type: "rumah_sakit",
      address: "Jl. MP. Mangkunegara No. 16, 8 Ilir, Ilir Timur II, Palembang",
      phone: "(0711) 810787",
      whatsapp_admin: "6282162319964",
      latitude: -2.942285,
      longitude: 104.78411,
      is_active: true,
    },
  },
  {
    id: 25,
    unit_code: "AMB-025",
    name: "Ambulans Y",
    provider_id: 22,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -3.033882,
    longitude: 104.790994,
    base_location: "IGD RS Hermina OPI Jakabaring",
    driver_name: "Yoga Pratama",
    driver_phone: "081234567025",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile RS Hermina OPI Jakabaring, siaga gawat darurat kawasan Jakabaring Sport City.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 22,
      name: "RS Hermina OPI Jakabaring",
      type: "rumah_sakit",
      address: "Jl. Gubernur H.A. Bastari, Kompleks OPI Mall, Jakabaring, Palembang",
      phone: "(0711) 5742525",
      whatsapp_admin: "6282162319964",
      latitude: -3.033882,
      longitude: 104.790994,
      is_active: true,
    },
  },
  {
    id: 26,
    unit_code: "AMB-026",
    name: "Ambulans Z",
    provider_id: 23,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -3.049886,
    longitude: 104.803343,
    base_location: "IGD RS Bunda Medika Jakabaring",
    driver_name: "Zainal Abidin",
    driver_phone: "081234567026",
    whatsapp_number: "6282162319964",
    description: "Ambulans siaga 24 jam RS Bunda Medika Jakabaring koridor Jl. Gubernur Bastari.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 23,
      name: "RS Bunda Medika Jakabaring",
      type: "rumah_sakit",
      address: "Jl. Gubernur H.A. Bastari No. 10, Jakabaring Selatan, Palembang",
      phone: "(0711) 5740000",
      whatsapp_admin: "6282162319964",
      latitude: -3.049886,
      longitude: 104.803343,
      is_active: true,
    },
  },
  {
    id: 27,
    unit_code: "AMB-027",
    name: "Ambulans AA",
    provider_id: 24,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -3.005749,
    longitude: 104.818078,
    base_location: "IGD RSIA Marissa (Plaju)",
    driver_name: "Aditya Wardhana",
    driver_phone: "081234567027",
    whatsapp_number: "6282162319964",
    description: "Ambulans rujukan ibu & anak RSIA Marissa Jl. DI Panjaitan Plaju.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 24,
      name: "RSIA Marissa (Plaju)",
      type: "rumah_sakit",
      address: "Jl. DI Panjaitan No. 12, Bagus Kuning, Plaju, Palembang",
      phone: "(0711) 541234",
      whatsapp_admin: "6282162319964",
      latitude: -3.005749,
      longitude: 104.818078,
      is_active: true,
    },
  },
  {
    id: 28,
    unit_code: "AMB-028",
    name: "Ambulans AB",
    provider_id: 25,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.913931,
    longitude: 104.695589,
    base_location: "IGD RS Rika Amelia (Alang-Alang Lebar)",
    driver_name: "Bambang Pamungkas",
    driver_phone: "081234567028",
    whatsapp_number: "6282162319964",
    description: "Ambulans siaga darurat RS Rika Amelia By Pass Alang-Alang Lebar Palembang.",
    distance_km: 2.5,
    estimated_minutes: 8,
    provider: {
      id: 25,
      name: "RS Rika Amelia (Alang-Alang Lebar)",
      type: "rumah_sakit",
      address: "Jl. By Pass Alang-Alang Lebar No. 89, Sukarami, Palembang",
      phone: "(0711) 742111",
      whatsapp_admin: "6282162319964",
      latitude: -2.913931,
      longitude: 104.695589,
      is_active: true,
    },
  },
];

export async function fetchAmbulances(lat?: number, lng?: number, status?: string): Promise<Ambulance[]> {
  try {
    const params = new URLSearchParams();
    if (lat !== undefined && lng !== undefined) {
      params.append("lat", lat.toString());
      params.append("lng", lng.toString());
    }
    if (status) {
      params.append("status", status);
    }

    const res = await fetch(`${API_BASE_URL}/ambulances?${params.toString()}`, {
      next: { revalidate: 10 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch from Laravel API");
    const json = await res.json();
    return json.data || FALLBACK_AMBULANCES;
  } catch (err) {
    console.warn("Using fallback ambulance data:", err);
    return FALLBACK_AMBULANCES;
  }
}

export async function fetchProviders(): Promise<Provider[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/providers`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch providers");
    const json = await res.json();
    return (json.data && json.data.length > 0) ? json.data : FALLBACK_PROVIDERS;
  } catch (err) {
    console.warn("Using fallback provider data:", err);
    return FALLBACK_PROVIDERS;
  }
}

export async function logContactRequest(data: {
  ambulance_id: number;
  user_name?: string;
  user_phone?: string;
  user_latitude?: number;
  user_longitude?: number;
  user_address?: string;
  patient_condition?: string;
}): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return json;
  } catch (e: any) {
    console.error("Failed to log contact request:", e);
    return { success: false, message: e?.message || "Gagal mencatat panggilan" };
  }
}

export async function fetchStats(): Promise<StatsData | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`, {
      next: { revalidate: 15 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn("Using fallback stats:", err);
    return null;
  }
}

export async function fetchContactRequests(
  filters?: { status?: string; search?: string },
  token?: string
): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "semua") {
      params.append("status", filters.status);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/contact-requests?${params.toString()}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers,
    });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }

    // Fallback to public endpoint if token auth not passed or 401
    const pubRes = await fetch(`${API_BASE_URL}/public/contact-requests?${params.toString()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (pubRes.ok) {
      const pubJson = await pubRes.json();
      return pubJson.data || [];
    }

    return [];
  } catch (err) {
    console.warn("Backend API unreachable for contact requests, using local data.");
    return [];
  }
}

async function parseJsonSafely(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message:
        res.status >= 500
          ? "Terjadi kendala koneksi ke database backend (HTTP 500). Pastikan XAMPP MySQL aktif."
          : text || `HTTP ${res.status}: ${res.statusText}`,
    };
  }
}

export async function updateContactRequestStatus(
  id: number,
  status: "menunggu" | "dihubungi" | "ditangani" | "selesai" | "dibatalkan",
  adminNotes?: string,
  token?: string,
  ambulanceId?: number
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const payload: Record<string, any> = {
      status,
      admin_notes: adminNotes,
    };
    if (ambulanceId) {
      payload.ambulance_id = ambulanceId;
    }

    let res = await fetch(`${API_BASE_URL}/contact-requests/${id}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    const json = await parseJsonSafely(res);
    return json;
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal memperbarui status permintaan" };
  }
}

// ==========================================
// Admin Authentication APIs
// ==========================================
export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: any; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await parseJsonSafely(res);
    return json;
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal menghubungi server autentikasi" };
  }
}

export async function adminGetMe(
  token: string
): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await parseJsonSafely(res);
    return json;
  } catch (err: any) {
    return { success: false, message: err?.message || "Sesi tidak valid" };
  }
}

export async function adminLogout(token: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.warn("Logout error:", err);
  }
}

export async function createAmbulance(
  data: any,
  token?: string
): Promise<{ success: boolean; data?: Ambulance; message?: string }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/ambulances`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    const json = await parseJsonSafely(res);
    if (!res.ok && json.errors) {
      const errorStrings = Object.values(json.errors).flat().join(". ");
      return { success: false, message: errorStrings || json.message || "Data input tidak valid." };
    }
    return json;
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal menghubungi server" };
  }
}

export async function updateAmbulance(
  id: number,
  data: any,
  token?: string
): Promise<{ success: boolean; data?: Ambulance; message?: string }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/ambulances/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    const json = await parseJsonSafely(res);
    if (!res.ok && json.errors) {
      const errorStrings = Object.values(json.errors).flat().join(". ");
      return { success: false, message: errorStrings || json.message || "Data input tidak valid." };
    }
    return json;
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal menghubungi server" };
  }
}

export async function deleteAmbulance(
  id: number,
  token?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/ambulances/${id}`, {
      method: "DELETE",
      headers,
    });
    const json = await parseJsonSafely(res);
    if (!res.ok) {
      return { success: false, message: json.message || "Gagal menghapus unit ambulans." };
    }
    return json;
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal menghubungi server" };
  }
}

export async function updateAdminProfile(
  data: { name: string; email: string },
  token: string
): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await parseJsonSafely(res);
    return json;
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal memperbarui profil admin" };
  }
}

export async function updateAdminPassword(
  data: { current_password: string; new_password: string },
  token: string
): Promise<{ success: boolean; token?: string; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await parseJsonSafely(res);
    return json;
  } catch (err: any) {
    return { success: false, message: err?.message || "Gagal memperbarui kata sandi" };
  }
}
