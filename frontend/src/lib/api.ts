import { Ambulance, Provider, StatsData } from "@/types";

const getCleanApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!envUrl) return "http://127.0.0.1:8000/api";
  const stripped = envUrl.replace(/\/+$/, "");
  return stripped.endsWith("/api") ? stripped : `${stripped}/api`;
};

const API_BASE_URL = getCleanApiBaseUrl();

// Fallback seed data matching enriched Palembang providers when API is offline
export const FALLBACK_AMBULANCES: Ambulance[] = [
  {
    id: 1,
    unit_code: "AMB-001",
    name: "Ambulans A",
    provider_id: 1,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9764,
    longitude: 104.7534,
    base_location: "IGD RS Charitas",
    driver_name: "Budi Santoso",
    driver_phone: "081234567001",
    whatsapp_number: "6282162319964",
    description: "Ambulans gawat darurat dengan tabung oksigen & monitor, siaga di IGD RS Charitas Jl. Sudirman.",
    distance_km: 2.1,
    estimated_minutes: 8,
    provider: {
      id: 1,
      name: "RS Charitas Palembang",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman No. 1054, Sungai Pangeran, Ilir Timur I, Palembang",
      phone: "(0711) 353374",
      whatsapp_admin: "6282162319964",
      latitude: -2.9764,
      longitude: 104.7534,
      is_active: true,
    },
  },
  {
    id: 2,
    unit_code: "AMB-002",
    name: "Ambulans B",
    provider_id: 1,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -2.9762,
    longitude: 104.7532,
    base_location: "UGD RS Charitas",
    driver_name: "Hendri Prasetyo",
    driver_phone: "081234567002",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile RS Charitas, peralatan lengkap ventilator portable & defibrillator.",
    distance_km: 2.2,
    estimated_minutes: 8,
    provider: {
      id: 1,
      name: "RS Charitas Palembang",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman No. 1054, Sungai Pangeran, Ilir Timur I, Palembang",
      phone: "(0711) 353374",
      whatsapp_admin: "6282162319964",
      latitude: -2.9764,
      longitude: 104.7534,
      is_active: true,
    },
  },
  {
    id: 3,
    unit_code: "AMB-003",
    name: "Ambulans C",
    provider_id: 2,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -2.9685,
    longitude: 104.7483,
    base_location: "IGD RSUP Dr. Mohammad Hoesin",
    driver_name: "Eko Prabowo",
    driver_phone: "081234567003",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile RSMH rujukan utama Sumsel, standby 24 jam di area IGD pusat Km. 3,5.",
    distance_km: 3.2,
    estimated_minutes: 10,
    provider: {
      id: 2,
      name: "RSUP Dr. Mohammad Hoesin",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman Km. 3,5, Sekip Jaya, Kemuning, Palembang",
      phone: "(0711) 354088",
      whatsapp_admin: "6282162319964",
      latitude: -2.9685,
      longitude: 104.7483,
      is_active: true,
    },
  },
  {
    id: 4,
    unit_code: "AMB-004",
    name: "Ambulans D",
    provider_id: 2,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9725,
    longitude: 104.745,
    base_location: "IGD RSUP Dr. Mohammad Hoesin",
    driver_name: "Irfan Maulana",
    driver_phone: "081234567004",
    whatsapp_number: "6282162319964",
    description: "Sedang menjemput pasien gawat darurat di area Jl. Demang Lebar Daun.",
    distance_km: 2.8,
    estimated_minutes: 9,
    provider: {
      id: 2,
      name: "RSUP Dr. Mohammad Hoesin",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman Km. 3,5, Sekip Jaya, Kemuning, Palembang",
      phone: "(0711) 354088",
      whatsapp_admin: "6282162319964",
      latitude: -2.9685,
      longitude: 104.7483,
      is_active: true,
    },
  },
  {
    id: 5,
    unit_code: "AMB-005",
    name: "Ambulans E",
    provider_id: 3,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.962,
    longitude: 104.735,
    base_location: "Markas PMI Kota Palembang",
    driver_name: "Ahmad Hidayat",
    driver_phone: "081234567005",
    whatsapp_number: "6282162319964",
    description: "Sedang evakuasi pasien dari Sukarami menuju RSMH.",
    distance_km: 4.5,
    estimated_minutes: 13,
    provider: {
      id: 3,
      name: "PMI Kota Palembang",
      type: "pmi",
      address: "Jl. Srijaya No. 869A, Alang-Alang Lebar, Palembang",
      phone: "(0711) 351601",
      whatsapp_admin: "6282162319964",
      latitude: -2.958,
      longitude: 104.722,
      is_active: true,
    },
  },
  {
    id: 6,
    unit_code: "AMB-006",
    name: "Ambulans F",
    provider_id: 3,
    status: "tersedia",
    vehicle_type: "transport",
    has_oxygen: false,
    has_icu: false,
    latitude: -2.958,
    longitude: 104.722,
    base_location: "Markas PMI Kota Palembang",
    driver_name: "Rudi Hartono",
    driver_phone: "081234567006",
    whatsapp_number: "6282162319964",
    description: "Unit transport medis PMI Palembang untuk bantuan darurat & antar-jemput pasien.",
    distance_km: 5.2,
    estimated_minutes: 15,
    provider: {
      id: 3,
      name: "PMI Kota Palembang",
      type: "pmi",
      address: "Jl. Srijaya No. 869A, Alang-Alang Lebar, Palembang",
      phone: "(0711) 351601",
      whatsapp_admin: "6282162319964",
      latitude: -2.958,
      longitude: 104.722,
      is_active: true,
    },
  },
  {
    id: 7,
    unit_code: "AMB-007",
    name: "Ambulans G",
    provider_id: 4,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9571,
    longitude: 104.7363,
    base_location: "IGD RSU Sriwijaya",
    driver_name: "Doni Saputra",
    driver_phone: "081234567007",
    whatsapp_number: "6282162319964",
    description: "Ambulans standar RSU Sriwijaya, siaga di Jl. Sudirman Km. 4,5.",
    distance_km: 3.9,
    estimated_minutes: 12,
    provider: {
      id: 4,
      name: "RSU Sriwijaya",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman KM 4,5 No. 502, Ilir Timur I, Palembang",
      phone: "(0711) 372222",
      whatsapp_admin: "6282162319964",
      latitude: -2.9571,
      longitude: 104.7363,
      is_active: true,
    },
  },
  {
    id: 8,
    unit_code: "AMB-008",
    name: "Ambulans H",
    provider_id: 5,
    status: "offline",
    vehicle_type: "transport",
    has_oxygen: false,
    has_icu: false,
    latitude: -3.01,
    longitude: 104.77,
    base_location: "RSUD Palembang BARI",
    driver_name: "Rizki Ananda",
    driver_phone: "081234567008",
    whatsapp_number: "6282162319964",
    description: "Unit transport RSUD BARI Seberang Ulu I, sedang perawatan berkala.",
    distance_km: 6.8,
    estimated_minutes: 19,
    provider: {
      id: 5,
      name: "RSUD Palembang BARI",
      type: "rumah_sakit",
      address: "Jl. Panca Usaha No. 1, 5 Ulu, Seberang Ulu I, Palembang",
      phone: "(0711) 510670",
      whatsapp_admin: "6282162319964",
      latitude: -3.01,
      longitude: 104.77,
      is_active: true,
    },
  },
  {
    id: 9,
    unit_code: "AMB-009",
    name: "Ambulans I",
    provider_id: 5,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -3.0098,
    longitude: 104.7698,
    base_location: "IGD RSUD Palembang BARI",
    driver_name: "Agus Kurniawan",
    driver_phone: "081234567009",
    whatsapp_number: "6282162319964",
    description: "Ambulans standar RSUD BARI, siaga melayani wilayah Seberang Ulu I & Jakabaring.",
    distance_km: 6.7,
    estimated_minutes: 19,
    provider: {
      id: 5,
      name: "RSUD Palembang BARI",
      type: "rumah_sakit",
      address: "Jl. Panca Usaha No. 1, 5 Ulu, Seberang Ulu I, Palembang",
      phone: "(0711) 510670",
      whatsapp_admin: "6282162319964",
      latitude: -3.01,
      longitude: 104.77,
      is_active: true,
    },
  },
  {
    id: 11,
    unit_code: "AMB-011",
    name: "Ambulans K",
    provider_id: 7,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -2.9754,
    longitude: 104.7423,
    base_location: "IGD Siloam Hospitals Sriwijaya",
    driver_name: "Wahyu Pratama",
    driver_phone: "081234567011",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile Siloam PS Mall, dilengkapi defibrillator, ventilator portable, dan monitor EKG.",
    distance_km: 2.6,
    estimated_minutes: 9,
    provider: {
      id: 7,
      name: "Siloam Hospitals Sriwijaya",
      type: "rumah_sakit",
      address: "Jl. POM IX, Komp. Palembang Square, Lorok Pakjo, Ilir Barat I, Palembang",
      phone: "1500911",
      whatsapp_admin: "6282162319964",
      latitude: -2.9754,
      longitude: 104.7423,
      is_active: true,
    },
  },
  {
    id: 13,
    unit_code: "AMB-013",
    name: "Ambulans M",
    provider_id: 8,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9665,
    longitude: 104.7431,
    base_location: "IGD RS Bhayangkara",
    driver_name: "Yusuf Hidayat",
    driver_phone: "081234567013",
    whatsapp_number: "6282162319964",
    description: "Ambulans standar RS Bhayangkara Polda Sumsel, area Jl. Sudirman Km. 4,5.",
    distance_km: 3.4,
    estimated_minutes: 10,
    provider: {
      id: 8,
      name: "RS Bhayangkara Tk. II M. Hasan Palembang",
      type: "rumah_sakit",
      address: "Jl. Jend. Sudirman KM 4,5, Ario Kemuning, Kemuning, Palembang",
      phone: "(0711) 355816",
      whatsapp_admin: "6282162319964",
      latitude: -2.9665,
      longitude: 104.7431,
      is_active: true,
    },
  },
  {
    id: 14,
    unit_code: "AMB-014",
    name: "Ambulans N",
    provider_id: 9,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.943,
    longitude: 104.728,
    base_location: "IGD RS Myria (KM 7)",
    driver_name: "Dimas Ardiansyah",
    driver_phone: "081234567014",
    whatsapp_number: "6282162319964",
    description: "Sedang dalam tugas di koridor Jl. Kol. H. Burlian Km. 7 Sukarami.",
    distance_km: 5.9,
    estimated_minutes: 16,
    provider: {
      id: 9,
      name: "RS Myria (Charitas Hospital KM 7)",
      type: "rumah_sakit",
      address: "Jl. Kol. H. Burlian No. 228, KM 7, Sukarami, Palembang",
      phone: "(0711) 363636",
      whatsapp_admin: "6282162319964",
      latitude: -2.9411,
      longitude: 104.7261,
      is_active: true,
    },
  },
  {
    id: 15,
    unit_code: "AMB-015",
    name: "Ambulans O",
    provider_id: 10,
    status: "offline",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.992,
    longitude: 104.757,
    base_location: "Posko PSC 119 Dinkes Palembang",
    driver_name: "Heri Susanto",
    driver_phone: "081234567015",
    whatsapp_number: "6282162319964",
    description: "Unit PSC 119 Dinas Kesehatan Palembang, rotasi shift regu piket.",
    distance_km: 3.1,
    estimated_minutes: 9,
    provider: {
      id: 10,
      name: "PSC 119 Palembang (Dinkes)",
      type: "psc",
      address: "Jl. Merdeka No. 06, 22 Ilir, Bukit Kecil, Palembang",
      phone: "119",
      whatsapp_admin: "6282162319964",
      latitude: -2.992,
      longitude: 104.757,
      is_active: true,
    },
  },
  {
    id: 16,
    unit_code: "AMB-016",
    name: "Ambulans P",
    provider_id: 11,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -2.948,
    longitude: 104.7351,
    base_location: "IGD RSUD Siti Fatimah",
    driver_name: "Hendri Wijaya",
    driver_phone: "081234567016",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile canggih RSUD Provinsi Sumatera Selatan, dilengkapi ventilator transport & AED.",
    distance_km: 4.8,
    estimated_minutes: 13,
    provider: {
      id: 11,
      name: "RSUD Siti Fatimah Provinsi Sumatera Selatan",
      type: "rumah_sakit",
      address: "Jl. Kol. H. Burlian Km. 6, Sukabangun, Sukarami, Palembang",
      phone: "(0711) 5718883",
      whatsapp_admin: "6282162319964",
      latitude: -2.948,
      longitude: 104.7351,
      is_active: true,
    },
  },
  {
    id: 17,
    unit_code: "AMB-017",
    name: "Ambulans Q",
    provider_id: 11,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9478,
    longitude: 104.7353,
    base_location: "IGD RSUD Siti Fatimah",
    driver_name: "Ilham Saputra",
    driver_phone: "081234567017",
    whatsapp_number: "6282162319964",
    description: "Ambulans tanggap darurat RSUD Siti Fatimah Km. 6 Sukarami.",
    distance_km: 4.9,
    estimated_minutes: 13,
    provider: {
      id: 11,
      name: "RSUD Siti Fatimah Provinsi Sumatera Selatan",
      type: "rumah_sakit",
      address: "Jl. Kol. H. Burlian Km. 6, Sukabangun, Sukarami, Palembang",
      phone: "(0711) 5718883",
      whatsapp_admin: "6282162319964",
      latitude: -2.948,
      longitude: 104.7351,
      is_active: true,
    },
  },
  {
    id: 18,
    unit_code: "AMB-018",
    name: "Ambulans R",
    provider_id: 12,
    status: "tersedia",
    vehicle_type: "icu_mobile",
    has_oxygen: true,
    has_icu: true,
    latitude: -2.9713,
    longitude: 104.7307,
    base_location: "IGD RSI Siti Khadijah",
    driver_name: "Fahmi Idris",
    driver_phone: "081234567018",
    whatsapp_number: "6282162319964",
    description: "ICU Mobile RSI Siti Khadijah, peralatan resusitasi lengkap & oksigen central.",
    distance_km: 2.9,
    estimated_minutes: 9,
    provider: {
      id: 12,
      name: "RS Islam Siti Khadijah",
      type: "rumah_sakit",
      address: "Jl. Demang Lebar Daun No. 175, Lorok Pakjo, Ilir Barat I, Palembang",
      phone: "(0711) 356001",
      whatsapp_admin: "6282162319964",
      latitude: -2.9713,
      longitude: 104.7307,
      is_active: true,
    },
  },
  {
    id: 19,
    unit_code: "AMB-019",
    name: "Ambulans S",
    provider_id: 12,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.974,
    longitude: 104.733,
    base_location: "IGD RSI Siti Khadijah",
    driver_name: "M. Ridwan",
    driver_phone: "081234567019",
    whatsapp_number: "6282162319964",
    description: "Sedang dalam tugas evakuasi medis darurat di koridor Demang Lebar Daun.",
    distance_km: 2.6,
    estimated_minutes: 8,
    provider: {
      id: 12,
      name: "RS Islam Siti Khadijah",
      type: "rumah_sakit",
      address: "Jl. Demang Lebar Daun No. 175, Lorok Pakjo, Ilir Barat I, Palembang",
      phone: "(0711) 356001",
      whatsapp_admin: "6282162319964",
      latitude: -2.9713,
      longitude: 104.7307,
      is_active: true,
    },
  },
  {
    id: 20,
    unit_code: "AMB-020",
    name: "Ambulans T",
    provider_id: 13,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9558,
    longitude: 104.7483,
    base_location: "IGD RS Hermina Palembang",
    driver_name: "Bambang Irawan",
    driver_phone: "081234567020",
    whatsapp_number: "6282162319964",
    description: "Ambulans darurat RS Hermina, dilengkapi inkubator transport bayi & oksigen.",
    distance_km: 3.8,
    estimated_minutes: 11,
    provider: {
      id: 13,
      name: "RS Hermina Palembang",
      type: "rumah_sakit",
      address: "Jl. Jend. Basuki Rachmat No. 897, Pahlawan, Kemuning, Palembang",
      phone: "(0711) 352525",
      whatsapp_admin: "6282162319964",
      latitude: -2.9558,
      longitude: 104.7483,
      is_active: true,
    },
  },
  {
    id: 21,
    unit_code: "AMB-021",
    name: "Ambulans U",
    provider_id: 14,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9903,
    longitude: 104.7601,
    base_location: "IGD RS Dr. AK Gani",
    driver_name: "Serka Anton",
    driver_phone: "081234567021",
    whatsapp_number: "6282162319964",
    description: "Ambulans taktis medis RS AK Gani Kesdam II Sriwijaya kawasan Benteng Kuto Besak.",
    distance_km: 3.2,
    estimated_minutes: 9,
    provider: {
      id: 14,
      name: "RS Dr. AK Gani (Kesdam II Sriwijaya)",
      type: "rumah_sakit",
      address: "Jl. Dr. AK Gani No. 1, 19 Ilir, Bukit Kecil (Benteng Kuto Besak), Palembang",
      phone: "(0711) 354691",
      whatsapp_admin: "6282162319964",
      latitude: -2.9903,
      longitude: 104.7601,
      is_active: true,
    },
  },
  {
    id: 22,
    unit_code: "AMB-022",
    name: "Ambulans V",
    provider_id: 15,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9679,
    longitude: 104.7345,
    base_location: "IGD RS Bunda Palembang",
    driver_name: "Dedi Setiawan",
    driver_phone: "081234567022",
    whatsapp_number: "6282162319964",
    description: "Ambulans siaga 24 jam RS Bunda Palembang Jl. Demang Lebar Daun.",
    distance_km: 3.1,
    estimated_minutes: 9,
    provider: {
      id: 15,
      name: "RS Bunda Palembang",
      type: "rumah_sakit",
      address: "Jl. Demang Lebar Daun No. 70, Ilir Barat I, Palembang",
      phone: "(0711) 411778",
      whatsapp_admin: "6282162319964",
      latitude: -2.9679,
      longitude: 104.7345,
      is_active: true,
    },
  },
  {
    id: 23,
    unit_code: "AMB-023",
    name: "Ambulans W",
    provider_id: 16,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9928,
    longitude: 104.8167,
    base_location: "IGD RS Pertamina Plaju",
    driver_name: "Teguh Prasetya",
    driver_phone: "081234567023",
    whatsapp_number: "6282162319964",
    description: "Ambulans gawat darurat RS Pertamina Plaju, melayani wilayah Seberang Ulu & Plaju.",
    distance_km: 7.8,
    estimated_minutes: 21,
    provider: {
      id: 16,
      name: "RS Pertamina Plaju",
      type: "rumah_sakit",
      address: "Komp. Pertamina RU III, Jl. Pengantingan No. 1, Komperta, Plaju, Palembang",
      phone: "(0711) 596111",
      whatsapp_admin: "6282162319964",
      latitude: -2.9928,
      longitude: 104.8167,
      is_active: true,
    },
  },
  {
    id: 24,
    unit_code: "AMB-024",
    name: "Ambulans X",
    provider_id: 17,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.979,
    longitude: 104.7768,
    base_location: "IGD RS Pelabuhan Boom Baru",
    driver_name: "Arief Rahman",
    driver_phone: "081234567024",
    whatsapp_number: "6282162319964",
    description: "Ambulans tanggap darurat kawasan Pelabuhan Boom Baru dan Ilir Timur II.",
    distance_km: 4.2,
    estimated_minutes: 12,
    provider: {
      id: 17,
      name: "RS Pelabuhan Palembang (Boom Baru)",
      type: "rumah_sakit",
      address: "Jl. Mayor Memet Sastrawirya No. 1, Boom Baru, Lawang Kidul, Ilir Timur II, Palembang",
      phone: "(0711) 714422",
      whatsapp_admin: "6282162319964",
      latitude: -2.979,
      longitude: 104.7768,
      is_active: true,
    },
  },
  {
    id: 25,
    unit_code: "AMB-025",
    name: "Ambulans Y",
    provider_id: 18,
    status: "sedang_bertugas",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.968,
    longitude: 104.795,
    base_location: "IGD RS Pusri Palembang",
    driver_name: "Bayu Nugroho",
    driver_phone: "081234567025",
    whatsapp_number: "6282162319964",
    description: "Sedang evakuasi pasien rujukan di koridor Kalidoni / Lemabang.",
    distance_km: 5.4,
    estimated_minutes: 15,
    provider: {
      id: 18,
      name: "RS Pusri Palembang",
      type: "rumah_sakit",
      address: "Komp. PT Pusri, Jl. Mayor Zen, Sei Selayur, Kalidoni, Palembang",
      phone: "(0711) 712222",
      whatsapp_admin: "6282162319964",
      latitude: -2.9703,
      longitude: 104.8014,
      is_active: true,
    },
  },
  {
    id: 26,
    unit_code: "AMB-026",
    name: "Ambulans Z",
    provider_id: 19,
    status: "tersedia",
    vehicle_type: "transport",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9364,
    longitude: 104.7938,
    base_location: "IGD Charitas Hospital Kenten",
    driver_name: "Yohanes Bosco",
    driver_phone: "081234567026",
    whatsapp_number: "6282162319964",
    description: "Unit layanan darurat medis & transport Charitas Kenten wilayah Sako & Sematang Borang.",
    distance_km: 6.5,
    estimated_minutes: 18,
    provider: {
      id: 19,
      name: "Charitas Hospital Kenten (RS Karya Asih)",
      type: "rumah_sakit",
      address: "Jl. Betawi Raya No. 1340, Lebong Gajah, Sematang Borang, Palembang",
      phone: "(0711) 820251",
      whatsapp_admin: "6282162319964",
      latitude: -2.9364,
      longitude: 104.7938,
      is_active: true,
    },
  },
  {
    id: 27,
    unit_code: "AMB-027",
    name: "Ambulans AA",
    provider_id: 20,
    status: "tersedia",
    vehicle_type: "standar",
    has_oxygen: true,
    has_icu: false,
    latitude: -3.0153,
    longitude: 104.6919,
    base_location: "IGD RSUD Gandus Palembang",
    driver_name: "Rian Firmansyah",
    driver_phone: "081234567027",
    whatsapp_number: "6282162319964",
    description: "Ambulans tanggap darurat RSUD Gandus, melayani wilayah barat daya Kota Palembang.",
    distance_km: 8.2,
    estimated_minutes: 22,
    provider: {
      id: 20,
      name: "RSUD Gandus Palembang",
      type: "rumah_sakit",
      address: "Jl. TPH Sofyan Kenawas, Gandus, Palembang",
      phone: "(0711) 5732100",
      whatsapp_admin: "6282162319964",
      latitude: -3.0153,
      longitude: 104.6919,
      is_active: true,
    },
  },
  {
    id: 28,
    unit_code: "AMB-028",
    name: "Ambulans AB",
    provider_id: 21,
    status: "offline",
    vehicle_type: "transport",
    has_oxygen: true,
    has_icu: false,
    latitude: -2.9233,
    longitude: 104.6803,
    base_location: "Pool Armada RS Ernaldi Bahar KM 12",
    driver_name: "Suryadi",
    driver_phone: "081234567028",
    whatsapp_number: "6282162319964",
    description: "Unit transport khusus evakuasi medis Alang-Alang Lebar KM 12, sedang rotasi berkala.",
    distance_km: 9.5,
    estimated_minutes: 25,
    provider: {
      id: 21,
      name: "RSUD dr. Ernaldi Bahar Provinsi Sumsel",
      type: "rumah_sakit",
      address: "Jl. Gubernur H. M. Ali Amin (Tembus Terminal) KM 12, Alang-Alang Lebar, Palembang",
      phone: "(0711) 410354",
      whatsapp_admin: "6282162319964",
      latitude: -2.9233,
      longitude: 104.6803,
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
    return json.data || [];
  } catch (err) {
    console.warn("Using fallback provider data:", err);
    return [];
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
