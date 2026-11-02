<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Provider;
use App\Models\Ambulance;

class AmperaSiagaSeeder extends Seeder
{
    /**
     * Seed ambulance providers and units with realistic Palembang data.
     * Sources: palembang.go.id, PMI Sumsel, RS websites
     */
    public function run(): void
    {
        // ===== PROVIDERS (10 Real Palembang Healthcare Facilities) =====
        // Koordinat diverifikasi dari Google Maps per Oktober 2026

        $charitas = Provider::create([
            'name' => 'RS Charitas Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Sudirman No. 1054, Sungai Pangeran, Ilir Timur I, Palembang',
            'phone' => '(0711) 353374',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.97640,
            'longitude' => 104.75340,
            'is_active' => true,
        ]);

        $rsmh = Provider::create([
            'name' => 'RSUP Dr. Mohammad Hoesin',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Sudirman Km. 3,5, Sekip Jaya, Kemuning, Palembang',
            'phone' => '(0711) 354088',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.96850,
            'longitude' => 104.74830,
            'is_active' => true,
        ]);

        $pmi = Provider::create([
            'name' => 'PMI Kota Palembang',
            'type' => 'pmi',
            'address' => 'Jl. Srijaya No. 869A, Alang-Alang Lebar, Palembang',
            'phone' => '(0711) 351601',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.95800,
            'longitude' => 104.72200,
            'is_active' => true,
        ]);

        $sriwijaya = Provider::create([
            'name' => 'RSU Sriwijaya',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Sudirman KM 4,5 No. 502, 20 Ilir D. IV, Ilir Timur I, Palembang',
            'phone' => '(0711) 372222',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.95710,
            'longitude' => 104.73630,
            'is_active' => true,
        ]);

        $bari = Provider::create([
            'name' => 'RSUD Palembang BARI',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Panca Usaha No. 1, 5 Ulu, Seberang Ulu I, Palembang',
            'phone' => '(0711) 510670',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -3.01000,
            'longitude' => 104.77000,
            'is_active' => true,
        ]);

        $muhammadiyah = Provider::create([
            'name' => 'RS Muhammadiyah Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Ahmad Yani No. 13, 13 Ulu, Seberang Ulu II, Palembang',
            'phone' => '(0711) 519191',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.99700,
            'longitude' => 104.75700,
            'is_active' => true,
        ]);

        $siloam = Provider::create([
            'name' => 'Siloam Hospitals Sriwijaya',
            'type' => 'rumah_sakit',
            'address' => 'Jl. POM IX, Komp. Palembang Square, Lorok Pakjo, Ilir Barat I, Palembang',
            'phone' => '1500911',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.97540,
            'longitude' => 104.74230,
            'is_active' => true,
        ]);

        $bhayangkara = Provider::create([
            'name' => 'RS Bhayangkara Tk. II M. Hasan Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Sudirman KM 4,5, Ario Kemuning, Kemuning, Palembang',
            'phone' => '(0711) 355816',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.96650,
            'longitude' => 104.74310,
            'is_active' => true,
        ]);

        $myria = Provider::create([
            'name' => 'RS Myria (Charitas Hospital KM 7)',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Kol. H. Burlian No. 228, KM 7, Sukarami, Palembang',
            'phone' => '(0711) 363636',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.94110,
            'longitude' => 104.72610,
            'is_active' => true,
        ]);

        $psc119 = Provider::create([
            'name' => 'PSC 119 Palembang (Dinkes)',
            'type' => 'psc',
            'address' => 'Jl. Merdeka No. 06, 22 Ilir, Bukit Kecil, Palembang',
            'phone' => '119',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.99200,
            'longitude' => 104.75700,
            'is_active' => true,
        ]);

        $sitiFatimah = Provider::create([
            'name' => 'RSUD Siti Fatimah Provinsi Sumatera Selatan',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Kol. H. Burlian Km. 6, Sukabangun, Sukarami, Palembang',
            'phone' => '(0711) 5718883',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.94800,
            'longitude' => 104.73510,
            'is_active' => true,
        ]);

        $sitiKhadijah = Provider::create([
            'name' => 'RS Islam Siti Khadijah',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Demang Lebar Daun No. 175, Lorok Pakjo, Ilir Barat I, Palembang',
            'phone' => '(0711) 356001',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.97130,
            'longitude' => 104.73070,
            'is_active' => true,
        ]);

        $hermina = Provider::create([
            'name' => 'RS Hermina Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Basuki Rachmat No. 897, Pahlawan, Kemuning, Palembang',
            'phone' => '(0711) 352525',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.95580,
            'longitude' => 104.74830,
            'is_active' => true,
        ]);

        $akGani = Provider::create([
            'name' => 'RS Dr. AK Gani (Kesdam II Sriwijaya)',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Dr. AK Gani No. 1, 19 Ilir, Bukit Kecil (Benteng Kuto Besak), Palembang',
            'phone' => '(0711) 354691',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.99030,
            'longitude' => 104.76010,
            'is_active' => true,
        ]);

        $bunda = Provider::create([
            'name' => 'RS Bunda Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Demang Lebar Daun No. 70, Ilir Barat I, Palembang',
            'phone' => '(0711) 411778',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.96790,
            'longitude' => 104.73450,
            'is_active' => true,
        ]);

        $pertaminaPlaju = Provider::create([
            'name' => 'RS Pertamina Plaju',
            'type' => 'rumah_sakit',
            'address' => 'Komp. Pertamina RU III, Jl. Pengantingan No. 1, Komperta, Plaju, Palembang',
            'phone' => '(0711) 596111',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.99280,
            'longitude' => 104.81670,
            'is_active' => true,
        ]);

        $pelabuhan = Provider::create([
            'name' => 'RS Pelabuhan Palembang (Boom Baru)',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Mayor Memet Sastrawirya No. 1, Boom Baru, Lawang Kidul, Ilir Timur II, Palembang',
            'phone' => '(0711) 714422',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.97900,
            'longitude' => 104.77680,
            'is_active' => true,
        ]);

        $pusri = Provider::create([
            'name' => 'RS Pusri Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Komp. PT Pusri, Jl. Mayor Zen, Sei Selayur, Kalidoni, Palembang',
            'phone' => '(0711) 712222',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.97030,
            'longitude' => 104.80140,
            'is_active' => true,
        ]);

        $charitasKenten = Provider::create([
            'name' => 'Charitas Hospital Kenten (RS Karya Asih)',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Betawi Raya No. 1340, Lebong Gajah, Sematang Borang, Palembang',
            'phone' => '(0711) 820251',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.93640,
            'longitude' => 104.79380,
            'is_active' => true,
        ]);

        $gandus = Provider::create([
            'name' => 'RSUD Gandus Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. TPH Sofyan Kenawas, Gandus, Palembang',
            'phone' => '(0711) 5732100',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -3.01530,
            'longitude' => 104.69190,
            'is_active' => true,
        ]);

        $ernaldiBahar = Provider::create([
            'name' => 'RSUD dr. Ernaldi Bahar Provinsi Sumsel',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Gubernur H. M. Ali Amin (Tembus Terminal) KM 12, Alang-Alang Lebar, Palembang',
            'phone' => '(0711) 410354',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.92330,
            'longitude' => 104.68030,
            'is_active' => true,
        ]);

        // ===== AMBULANCES (28 Units — Comprehensive Palembang Coverage) =====
        // Status distribution: 19 tersedia, 5 sedang_bertugas, 4 offline

        // --- RS Charitas (2 units) ---
        Ambulance::create([
            'unit_code' => 'AMB-001',
            'name' => 'Ambulans A',
            'provider_id' => $charitas->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.97640,
            'longitude' => 104.75340,
            'base_location' => 'IGD RS Charitas',
            'driver_name' => 'Budi Santoso',
            'driver_phone' => '081234567001',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans gawat darurat dengan oksigen & monitor, siaga di IGD RS Charitas Jl. Sudirman.',
        ]);

        Ambulance::create([
            'unit_code' => 'AMB-002',
            'name' => 'Ambulans B',
            'provider_id' => $charitas->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -2.97620,
            'longitude' => 104.75320,
            'base_location' => 'UGD RS Charitas',
            'driver_name' => 'Hendri Prasetyo',
            'driver_phone' => '081234567002',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile RS Charitas, peralatan lengkap ventilator portable & defibrillator.',
        ]);

        // --- RSUP Dr. Mohammad Hoesin (2 units) ---
        Ambulance::create([
            'unit_code' => 'AMB-003',
            'name' => 'Ambulans C',
            'provider_id' => $rsmh->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -2.96850,
            'longitude' => 104.74830,
            'base_location' => 'IGD RSUP Dr. Mohammad Hoesin',
            'driver_name' => 'Eko Prabowo',
            'driver_phone' => '081234567003',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile RSMH rujukan utama Sumsel, standby 24 jam di area IGD pusat Km. 3,5.',
        ]);

        Ambulance::create([
            'unit_code' => 'AMB-004',
            'name' => 'Ambulans D',
            'provider_id' => $rsmh->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.97250,
            'longitude' => 104.74500,
            'base_location' => 'IGD RSUP Dr. Mohammad Hoesin',
            'driver_name' => 'Irfan Maulana',
            'driver_phone' => '081234567004',
            'whatsapp_number' => '6282162319964',
            'description' => 'Sedang menjemput pasien gawat darurat di area Jl. Demang Lebar Daun.',
        ]);

        // --- PMI Kota Palembang (2 units) ---
        Ambulance::create([
            'unit_code' => 'AMB-005',
            'name' => 'Ambulans E',
            'provider_id' => $pmi->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.96200,
            'longitude' => 104.73500,
            'base_location' => 'Markas PMI Kota Palembang',
            'driver_name' => 'Ahmad Hidayat',
            'driver_phone' => '081234567005',
            'whatsapp_number' => '6282162319964',
            'description' => 'Sedang evakuasi pasien dari Sukarami menuju RSMH.',
        ]);

        Ambulance::create([
            'unit_code' => 'AMB-006',
            'name' => 'Ambulans F',
            'provider_id' => $pmi->id,
            'status' => 'tersedia',
            'vehicle_type' => 'transport',
            'has_oxygen' => false,
            'has_icu' => false,
            'latitude' => -2.95800,
            'longitude' => 104.72200,
            'base_location' => 'Markas PMI Kota Palembang',
            'driver_name' => 'Rudi Hartono',
            'driver_phone' => '081234567006',
            'whatsapp_number' => '6282162319964',
            'description' => 'Unit transport medis PMI Palembang untuk bantuan darurat & antar-jemput pasien.',
        ]);

        // --- RSU Sriwijaya (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-007',
            'name' => 'Ambulans G',
            'provider_id' => $sriwijaya->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.95710,
            'longitude' => 104.73630,
            'base_location' => 'IGD RSU Sriwijaya',
            'driver_name' => 'Doni Saputra',
            'driver_phone' => '081234567007',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans standar RSU Sriwijaya, siaga di Jl. Sudirman Km. 4,5.',
        ]);

        // --- RSUD Palembang BARI (2 units) ---
        Ambulance::create([
            'unit_code' => 'AMB-008',
            'name' => 'Ambulans H',
            'provider_id' => $bari->id,
            'status' => 'offline',
            'vehicle_type' => 'transport',
            'has_oxygen' => false,
            'has_icu' => false,
            'latitude' => -3.01000,
            'longitude' => 104.77000,
            'base_location' => 'RSUD Palembang BARI',
            'driver_name' => 'Rizki Ananda',
            'driver_phone' => '081234567008',
            'whatsapp_number' => '6282162319964',
            'description' => 'Unit transport RSUD BARI Seberang Ulu I, sedang perawatan berkala.',
        ]);

        Ambulance::create([
            'unit_code' => 'AMB-009',
            'name' => 'Ambulans I',
            'provider_id' => $bari->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -3.00980,
            'longitude' => 104.76980,
            'base_location' => 'IGD RSUD Palembang BARI',
            'driver_name' => 'Agus Kurniawan',
            'driver_phone' => '081234567009',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans standar RSUD BARI, siaga melayani wilayah Seberang Ulu I & Jakabaring.',
        ]);

        // --- RS Muhammadiyah Palembang (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-010',
            'name' => 'Ambulans J',
            'provider_id' => $muhammadiyah->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.99900,
            'longitude' => 104.76000,
            'base_location' => 'IGD RS Muhammadiyah',
            'driver_name' => 'Faisal Rahman',
            'driver_phone' => '081234567010',
            'whatsapp_number' => '6282162319964',
            'description' => 'Sedang evakuasi pasien rujukan di area Seberang Ulu II Jl. Ahmad Yani.',
        ]);

        // --- Siloam Hospitals Sriwijaya (2 units) ---
        Ambulance::create([
            'unit_code' => 'AMB-011',
            'name' => 'Ambulans K',
            'provider_id' => $siloam->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -2.97540,
            'longitude' => 104.74230,
            'base_location' => 'IGD Siloam Hospitals Sriwijaya',
            'driver_name' => 'Wahyu Pratama',
            'driver_phone' => '081234567011',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile Siloam PS Mall, dilengkapi defibrillator, ventilator portable, dan monitor EKG.',
        ]);

        Ambulance::create([
            'unit_code' => 'AMB-012',
            'name' => 'Ambulans L',
            'provider_id' => $siloam->id,
            'status' => 'offline',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.97550,
            'longitude' => 104.74200,
            'base_location' => 'Pool Siloam Hospitals Sriwijaya',
            'driver_name' => 'Bambang Sugiarto',
            'driver_phone' => '081234567012',
            'whatsapp_number' => '6282162319964',
            'description' => 'Sedang dalam perawatan mesin rutin, estimasi kembali beroperasi besok pagi.',
        ]);

        // --- RS Bhayangkara (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-013',
            'name' => 'Ambulans M',
            'provider_id' => $bhayangkara->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.96650,
            'longitude' => 104.74310,
            'base_location' => 'IGD RS Bhayangkara',
            'driver_name' => 'Yusuf Hidayat',
            'driver_phone' => '081234567013',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans standar RS Bhayangkara Polda Sumsel, area Jl. Sudirman Km. 4,5.',
        ]);

        // --- RS Myria (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-014',
            'name' => 'Ambulans N',
            'provider_id' => $myria->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.94300,
            'longitude' => 104.72800,
            'base_location' => 'IGD RS Myria (KM 7)',
            'driver_name' => 'Dimas Ardiansyah',
            'driver_phone' => '081234567014',
            'whatsapp_number' => '6282162319964',
            'description' => 'Sedang dalam tugas di koridor Jl. Kol. H. Burlian Km. 7 Sukarami.',
        ]);

        // --- PSC 119 Palembang (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-015',
            'name' => 'Ambulans O',
            'provider_id' => $psc119->id,
            'status' => 'offline',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.99200,
            'longitude' => 104.75700,
            'base_location' => 'Posko PSC 119 Dinkes Palembang',
            'driver_name' => 'Heri Susanto',
            'driver_phone' => '081234567015',
            'whatsapp_number' => '6282162319964',
            'description' => 'Unit PSC 119 Dinas Kesehatan Palembang, rotasi shift regu piket.',
        ]);

        // --- RSUD Siti Fatimah (2 units) ---
        Ambulance::create([
            'unit_code' => 'AMB-016',
            'name' => 'Ambulans P',
            'provider_id' => $sitiFatimah->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -2.94800,
            'longitude' => 104.73510,
            'base_location' => 'IGD RSUD Siti Fatimah',
            'driver_name' => 'Hendri Wijaya',
            'driver_phone' => '081234567016',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile canggih RSUD Provinsi Sumatera Selatan, dilengkapi ventilator transport & AED.',
        ]);

        Ambulance::create([
            'unit_code' => 'AMB-017',
            'name' => 'Ambulans Q',
            'provider_id' => $sitiFatimah->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.94780,
            'longitude' => 104.73530,
            'base_location' => 'IGD RSUD Siti Fatimah',
            'driver_name' => 'Ilham Saputra',
            'driver_phone' => '081234567017',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans tanggap darurat RSUD Siti Fatimah Km. 6 Sukarami.',
        ]);

        // --- RS Islam Siti Khadijah (2 units) ---
        Ambulance::create([
            'unit_code' => 'AMB-018',
            'name' => 'Ambulans R',
            'provider_id' => $sitiKhadijah->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -2.97130,
            'longitude' => 104.73070,
            'base_location' => 'IGD RSI Siti Khadijah',
            'driver_name' => 'Fahmi Idris',
            'driver_phone' => '081234567018',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile RSI Siti Khadijah, peralatan resusitasi lengkap & oksigen central.',
        ]);

        Ambulance::create([
            'unit_code' => 'AMB-019',
            'name' => 'Ambulans S',
            'provider_id' => $sitiKhadijah->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.97400,
            'longitude' => 104.73300,
            'base_location' => 'IGD RSI Siti Khadijah',
            'driver_name' => 'M. Ridwan',
            'driver_phone' => '081234567019',
            'whatsapp_number' => '6282162319964',
            'description' => 'Sedang dalam tugas evakuasi medis darurat di koridor Demang Lebar Daun.',
        ]);

        // --- RS Hermina Palembang (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-020',
            'name' => 'Ambulans T',
            'provider_id' => $hermina->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.95580,
            'longitude' => 104.74830,
            'base_location' => 'IGD RS Hermina Palembang',
            'driver_name' => 'Bambang Irawan',
            'driver_phone' => '081234567020',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans darurat RS Hermina, dilengkapi inkubator transport bayi & oksigen.',
        ]);

        // --- RS Dr. AK Gani (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-021',
            'name' => 'Ambulans U',
            'provider_id' => $akGani->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.99030,
            'longitude' => 104.76010,
            'base_location' => 'IGD RS Dr. AK Gani',
            'driver_name' => 'Serka Anton',
            'driver_phone' => '081234567021',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans taktis medis RS AK Gani Kesdam II Sriwijaya kawasan Benteng Kuto Besak.',
        ]);

        // --- RS Bunda Palembang (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-022',
            'name' => 'Ambulans V',
            'provider_id' => $bunda->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.96790,
            'longitude' => 104.73450,
            'base_location' => 'IGD RS Bunda Palembang',
            'driver_name' => 'Dedi Setiawan',
            'driver_phone' => '081234567022',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans siaga 24 jam RS Bunda Palembang Jl. Demang Lebar Daun.',
        ]);

        // --- RS Pertamina Plaju (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-023',
            'name' => 'Ambulans W',
            'provider_id' => $pertaminaPlaju->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.99280,
            'longitude' => 104.81670,
            'base_location' => 'IGD RS Pertamina Plaju',
            'driver_name' => 'Teguh Prasetya',
            'driver_phone' => '081234567023',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans gawat darurat RS Pertamina Plaju, melayani wilayah Seberang Ulu & Plaju.',
        ]);

        // --- RS Pelabuhan Palembang (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-024',
            'name' => 'Ambulans X',
            'provider_id' => $pelabuhan->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.97900,
            'longitude' => 104.77680,
            'base_location' => 'IGD RS Pelabuhan Boom Baru',
            'driver_name' => 'Arief Rahman',
            'driver_phone' => '081234567024',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans tanggap darurat kawasan Pelabuhan Boom Baru dan Ilir Timur II.',
        ]);

        // --- RS Pusri Palembang (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-025',
            'name' => 'Ambulans Y',
            'provider_id' => $pusri->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.96800,
            'longitude' => 104.79500,
            'base_location' => 'IGD RS Pusri Palembang',
            'driver_name' => 'Bayu Nugroho',
            'driver_phone' => '081234567025',
            'whatsapp_number' => '6282162319964',
            'description' => 'Sedang evakuasi pasien rujukan di koridor Kalidoni / Lemabang.',
        ]);

        // --- Charitas Hospital Kenten (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-026',
            'name' => 'Ambulans Z',
            'provider_id' => $charitasKenten->id,
            'status' => 'tersedia',
            'vehicle_type' => 'transport',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.93640,
            'longitude' => 104.79380,
            'base_location' => 'IGD Charitas Hospital Kenten',
            'driver_name' => 'Yohanes Bosco',
            'driver_phone' => '081234567026',
            'whatsapp_number' => '6282162319964',
            'description' => 'Unit layanan darurat medis & transport Charitas Kenten wilayah Sako & Sematang Borang.',
        ]);

        // --- RSUD Gandus Palembang (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-027',
            'name' => 'Ambulans AA',
            'provider_id' => $gandus->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -3.01530,
            'longitude' => 104.69190,
            'base_location' => 'IGD RSUD Gandus Palembang',
            'driver_name' => 'Rian Firmansyah',
            'driver_phone' => '081234567027',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans tanggap darurat RSUD Gandus, melayani wilayah barat daya Kota Palembang.',
        ]);

        // --- RSUD dr. Ernaldi Bahar (1 unit) ---
        Ambulance::create([
            'unit_code' => 'AMB-028',
            'name' => 'Ambulans AB',
            'provider_id' => $ernaldiBahar->id,
            'status' => 'offline',
            'vehicle_type' => 'transport',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.92330,
            'longitude' => 104.68030,
            'base_location' => 'Pool Armada RS Ernaldi Bahar KM 12',
            'driver_name' => 'Suryadi',
            'driver_phone' => '081234567028',
            'whatsapp_number' => '6282162319964',
            'description' => 'Unit transport khusus evakuasi medis Alang-Alang Lebar KM 12, sedang rotasi berkala.',
        ]);

        // ===== DEFAULT ADMIN ACCOUNT =====
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@amperasiaga.palembang.go.id'],
            [
                'name' => 'Operator Siaga Palembang',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
                'role' => 'admin',
                'api_token' => \Illuminate\Support\Str::random(64),
            ]
        );

        // ===== INITIAL REALISTIC CONTACT REQUESTS =====
        $amb001 = Ambulance::where('unit_code', 'AMB-001')->first();
        $amb005 = Ambulance::where('unit_code', 'AMB-005')->first();
        $amb014 = Ambulance::where('unit_code', 'AMB-014')->first();

        \App\Models\ContactRequest::create([
            'ambulance_id' => $amb001->id,
            'user_name' => 'Dewa Pratama',
            'user_phone' => '0812-3456-7890',
            'user_latitude' => -2.97610,
            'user_longitude' => 104.77540,
            'user_address' => 'Jl. Jenderal Sudirman (Simpang Charitas), Kec. Ilir Timur I, Palembang',
            'patient_condition' => 'Pasien lansia mengalami sesak napas dan lemas mendadak, perlu segera diantar ke IGD RS Charitas.',
            'status' => 'menunggu',
            'admin_notes' => 'Petugas telah mengirim pesan verifikasi WhatsApp ke pemohon.',
            'contacted_via' => 'whatsapp',
            'ip_address' => '127.0.0.1',
        ]);

        \App\Models\ContactRequest::create([
            'ambulance_id' => $amb005->id,
            'user_name' => 'Siti Rahmawati',
            'user_phone' => '0813-8822-1100',
            'user_latitude' => -2.99820,
            'user_longitude' => 104.75110,
            'user_address' => 'Kertapati, Jl. Ki Merogan No. 88, Seberang Ulu I, Palembang',
            'patient_condition' => 'Pasien ibu hamil kontraksi intensif dengan riwayat penyulit kehamilan.',
            'status' => 'dihubungi',
            'admin_notes' => 'Driver AMB-005 dikonfirmasi telah siap bersiaga.',
            'contacted_via' => 'whatsapp',
            'ip_address' => '127.0.0.1',
        ]);

        \App\Models\ContactRequest::create([
            'ambulance_id' => $amb014->id,
            'user_name' => 'H. Syamsuddin',
            'user_phone' => '0811-7899-2345',
            'user_latitude' => -2.96800,
            'user_longitude' => 104.75200,
            'user_address' => 'Jl. Kol. H. Burlian Km. 7, Sukarami, Palembang',
            'patient_condition' => 'Kecelakaan lalu lintas ringan, korban sadar dengan cedera pergelangan kaki.',
            'status' => 'ditangani',
            'admin_notes' => 'Unit AMB-014 dalam perjalanan menuju titik jemput di Km. 7.',
            'contacted_via' => 'whatsapp',
            'ip_address' => '127.0.0.1',
        ]);
    }
}
