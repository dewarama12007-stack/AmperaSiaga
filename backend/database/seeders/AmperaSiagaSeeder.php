<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Provider;
use App\Models\Ambulance;
use Illuminate\Support\Facades\DB;

class AmperaSiagaSeeder extends Seeder
{
    /**
     * Seed 25 official Palembang hospitals & 28 ambulance units.
     * Accurate coordinates verified per Palembang Health Department & RS networks.
     */
    public function run(): void
    {
        // Truncate existing data to prevent duplicate seeds
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Ambulance::truncate();
        Provider::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // ===== 25 RUMAH SAKIT & FASKES RESMI KOTA PALEMBANG =====
        $providers = [];

        $providers[1] = Provider::create([
            'id' => 1,
            'name' => 'RSUP Dr. Mohammad Hoesin (RSMH)',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Sudirman Km. 3,5, Sekip Jaya, Kemuning, Palembang',
            'phone' => '(0711) 354088',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.966654,
            'longitude' => 104.750067,
            'is_active' => true,
        ]);

        $providers[2] = Provider::create([
            'id' => 2,
            'name' => 'RS Bhayangkara M. Hasan',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Sudirman KM 4,5, Ario Kemuning, Kemuning, Palembang',
            'phone' => '(0711) 410023',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.959032,
            'longitude' => 104.737223,
            'is_active' => true,
        ]);

        $providers[3] = Provider::create([
            'id' => 3,
            'name' => 'RSU Sriwijaya',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Sudirman KM 4,5 No. 502, 20 Ilir D. IV, Ilir Timur I, Palembang',
            'phone' => '(0711) 372222',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.959631,
            'longitude' => 104.737009,
            'is_active' => true,
        ]);

        $providers[4] = Provider::create([
            'id' => 4,
            'name' => 'RS RK Charitas (Sudirman)',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Sudirman No. 1054, Sungai Pangeran, Ilir Timur I, Palembang',
            'phone' => '(0711) 353374',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.975063,
            'longitude' => 104.752677,
            'is_active' => true,
        ]);

        $providers[5] = Provider::create([
            'id' => 5,
            'name' => 'RS Siloam Sriwijaya',
            'type' => 'rumah_sakit',
            'address' => 'Jl. POM IX, Komp. Palembang Square, Lorok Pakjo, Ilir Barat I, Palembang',
            'phone' => '1500911',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.97777,
            'longitude' => 104.742333,
            'is_active' => true,
        ]);

        $providers[6] = Provider::create([
            'id' => 6,
            'name' => 'RS Islam Siti Khadijah',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Demang Lebar Daun No. 175, Lorok Pakjo, Ilir Barat I, Palembang',
            'phone' => '(0711) 356001',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.97165,
            'longitude' => 104.73141,
            'is_active' => true,
        ]);

        $providers[7] = Provider::create([
            'id' => 7,
            'name' => 'RS Bunda Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Demang Lebar Daun No. 70, Ilir Barat I, Palembang',
            'phone' => '(0711) 411778',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.967935,
            'longitude' => 104.73444,
            'is_active' => true,
        ]);

        $providers[8] = Provider::create([
            'id' => 8,
            'name' => 'RS Graha Mandiri',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Kol. H. Burlian No. 11, Siring Agung, Ilir Barat I, Palembang',
            'phone' => '(0711) 410058',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.968521,
            'longitude' => 104.726269,
            'is_active' => true,
        ]);

        $providers[9] = Provider::create([
            'id' => 9,
            'name' => 'RSUD Siti Fatimah (Prov. Sumsel)',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Kol. H. Burlian Km. 6, Sukabangun, Sukarami, Palembang',
            'phone' => '(0711) 5718883',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.948235,
            'longitude' => 104.73455,
            'is_active' => true,
        ]);

        $providers[10] = Provider::create([
            'id' => 10,
            'name' => 'RS Charitas KM 7',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Kol. H. Burlian No. 228, KM 7, Sukarami, Palembang',
            'phone' => '(0711) 363636',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.941137,
            'longitude' => 104.726085,
            'is_active' => true,
        ]);

        $providers[11] = Provider::create([
            'id' => 11,
            'name' => 'RS Hermina Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Basuki Rachmat No. 897, Pahlawan, Kemuning, Palembang',
            'phone' => '(0711) 352525',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.955805,
            'longitude' => 104.748308,
            'is_active' => true,
        ]);

        $providers[12] = Provider::create([
            'id' => 12,
            'name' => 'RS Muhammadiyah Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Jend. Ahmad Yani No. 13, 13 Ulu, Seberang Ulu II, Palembang',
            'phone' => '(0711) 519191',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.996363,
            'longitude' => 104.776689,
            'is_active' => true,
        ]);

        $providers[13] = Provider::create([
            'id' => 13,
            'name' => 'RSUD Palembang BARI',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Panca Usaha No. 1, 5 Ulu, Seberang Ulu I, Palembang',
            'phone' => '(0711) 510670',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -3.010678,
            'longitude' => 104.768599,
            'is_active' => true,
        ]);

        $providers[14] = Provider::create([
            'id' => 14,
            'name' => 'RS dr. AK Gani',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Dr. AK Gani No. 1, 19 Ilir, Bukit Kecil (Benteng Kuto Besak), Palembang',
            'phone' => '(0711) 354691',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.990328,
            'longitude' => 104.760142,
            'is_active' => true,
        ]);

        $providers[15] = Provider::create([
            'id' => 15,
            'name' => 'IHC RS Pelabuhan',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Mayor Memet Sastrawirya No. 1, Boom Baru, Lawang Kidul, Ilir Timur II, Palembang',
            'phone' => '(0711) 714422',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.979007,
            'longitude' => 104.776816,
            'is_active' => true,
        ]);

        $providers[16] = Provider::create([
            'id' => 16,
            'name' => 'RS Permata Palembang',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Soekarno Hatta No. 88, Karya Baru, Alang-Alang Lebar, Palembang',
            'phone' => '(0711) 561234',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.985984,
            'longitude' => 104.718573,
            'is_active' => true,
        ]);

        $providers[17] = Provider::create([
            'id' => 17,
            'name' => 'RS Namira',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Kol. H. Burlian Km. 9, Sukarami, Palembang',
            'phone' => '(0711) 412233',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.91082,
            'longitude' => 104.713631,
            'is_active' => true,
        ]);

        $providers[18] = Provider::create([
            'id' => 18,
            'name' => 'RS Pusri',
            'type' => 'rumah_sakit',
            'address' => 'Komp. PT Pusri, Jl. Mayor Zen, Sei Selayur, Kalidoni, Palembang',
            'phone' => '(0711) 712222',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.970278,
            'longitude' => 104.801361,
            'is_active' => true,
        ]);

        $providers[19] = Provider::create([
            'id' => 19,
            'name' => 'RS Pertamina Plaju',
            'type' => 'rumah_sakit',
            'address' => 'Komp. Pertamina RU III, Jl. Pengantingan No. 1, Komperta, Plaju, Palembang',
            'phone' => '(0711) 596111',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.994504,
            'longitude' => 104.824686,
            'is_active' => true,
        ]);

        $providers[20] = Provider::create([
            'id' => 20,
            'name' => 'Charitas Hospital Kenten',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Betawi Raya No. 1340, Lebong Gajah, Sematang Borang, Palembang',
            'phone' => '(0711) 820251',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.937275,
            'longitude' => 104.794784,
            'is_active' => true,
        ]);

        $providers[21] = Provider::create([
            'id' => 21,
            'name' => 'RSIA Azzahra',
            'type' => 'rumah_sakit',
            'address' => 'Jl. MP. Mangkunegara No. 16, 8 Ilir, Ilir Timur II, Palembang',
            'phone' => '(0711) 810787',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.942285,
            'longitude' => 104.78411,
            'is_active' => true,
        ]);

        $providers[22] = Provider::create([
            'id' => 22,
            'name' => 'RS Hermina OPI Jakabaring',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Gubernur H.A. Bastari, Kompleks OPI Mall, Jakabaring, Palembang',
            'phone' => '(0711) 5742525',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -3.033882,
            'longitude' => 104.790994,
            'is_active' => true,
        ]);

        $providers[23] = Provider::create([
            'id' => 23,
            'name' => 'RS Bunda Medika Jakabaring',
            'type' => 'rumah_sakit',
            'address' => 'Jl. Gubernur H.A. Bastari No. 10, Jakabaring Selatan, Palembang',
            'phone' => '(0711) 5740000',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -3.049886,
            'longitude' => 104.803343,
            'is_active' => true,
        ]);

        $providers[24] = Provider::create([
            'id' => 24,
            'name' => 'RSIA Marissa (Plaju)',
            'type' => 'rumah_sakit',
            'address' => 'Jl. DI Panjaitan No. 12, Bagus Kuning, Plaju, Palembang',
            'phone' => '(0711) 541234',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -3.005749,
            'longitude' => 104.818078,
            'is_active' => true,
        ]);

        $providers[25] = Provider::create([
            'id' => 25,
            'name' => 'RS Rika Amelia (Alang-Alang Lebar)',
            'type' => 'rumah_sakit',
            'address' => 'Jl. By Pass Alang-Alang Lebar No. 89, Sukarami, Palembang',
            'phone' => '(0711) 742111',
            'whatsapp_admin' => '6282162319964',
            'latitude' => -2.913931,
            'longitude' => 104.695589,
            'is_active' => true,
        ]);

        // ===== 28 AMBULANS SIAGA KOTA PALEMBANG =====
        Ambulance::create([
            'id' => 1,
            'unit_code' => 'AMB-001',
            'name' => 'Ambulans A',
            'provider_id' => $providers[1]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -2.966654,
            'longitude' => 104.750067,
            'base_location' => 'IGD RSUP Dr. Mohammad Hoesin (RSMH)',
            'driver_name' => 'Budi Santoso',
            'driver_phone' => '081234567001',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile RSMH rujukan utama Sumsel, ventilator portable & defibrillator.',
        ]);

        Ambulance::create([
            'id' => 2,
            'unit_code' => 'AMB-002',
            'name' => 'Ambulans B',
            'provider_id' => $providers[1]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.966654,
            'longitude' => 104.750067,
            'base_location' => 'IGD RSUP Dr. Mohammad Hoesin (RSMH)',
            'driver_name' => 'Hendri Prasetyo',
            'driver_phone' => '081234567002',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans gawat darurat standar dengan monitor & oksigen tabung IGD RSMH.',
        ]);

        Ambulance::create([
            'id' => 3,
            'unit_code' => 'AMB-003',
            'name' => 'Ambulans C',
            'provider_id' => $providers[2]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.959032,
            'longitude' => 104.737223,
            'base_location' => 'IGD RS Bhayangkara M. Hasan',
            'driver_name' => 'Eko Prabowo',
            'driver_phone' => '081234567003',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans taktis medis RS Bhayangkara Polda Sumsel Jl. Sudirman Km. 4,5.',
        ]);

        Ambulance::create([
            'id' => 4,
            'unit_code' => 'AMB-004',
            'name' => 'Ambulans D',
            'provider_id' => $providers[3]->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.959631,
            'longitude' => 104.737009,
            'base_location' => 'IGD RSU Sriwijaya',
            'driver_name' => 'Agus Setiawan',
            'driver_phone' => '081234567004',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans evakuasi medis RSU Sriwijaya, siaga rujukan Km. 4,5 Palembang.',
        ]);

        Ambulance::create([
            'id' => 5,
            'unit_code' => 'AMB-005',
            'name' => 'Ambulans E',
            'provider_id' => $providers[4]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -2.975063,
            'longitude' => 104.752677,
            'base_location' => 'IGD RS RK Charitas (Sudirman)',
            'driver_name' => 'Rian Hidayat',
            'driver_phone' => '081234567005',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile RS RK Charitas Sudirman dengan peralatan resusitasi jantung lengkap.',
        ]);

        Ambulance::create([
            'id' => 6,
            'unit_code' => 'AMB-006',
            'name' => 'Ambulans F',
            'provider_id' => $providers[4]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.975063,
            'longitude' => 104.752677,
            'base_location' => 'IGD RS RK Charitas (Sudirman)',
            'driver_name' => 'Doni Wijaya',
            'driver_phone' => '081234567006',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans respon cepat RS Charitas Sudirman koridor pusat kota Simpang Charitas.',
        ]);

        Ambulance::create([
            'id' => 7,
            'unit_code' => 'AMB-007',
            'name' => 'Ambulans G',
            'provider_id' => $providers[5]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -2.97777,
            'longitude' => 104.742333,
            'base_location' => 'IGD RS Siloam Sriwijaya',
            'driver_name' => 'Fajar Nugraha',
            'driver_phone' => '081234567007',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile Siloam Sriwijaya area POM IX Palembang Square, monitor multi-parameter.',
        ]);

        Ambulance::create([
            'id' => 8,
            'unit_code' => 'AMB-008',
            'name' => 'Ambulans H',
            'provider_id' => $providers[6]->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.97165,
            'longitude' => 104.73141,
            'base_location' => 'IGD RS Islam Siti Khadijah',
            'driver_name' => 'Hendra Saputra',
            'driver_phone' => '081234567008',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans gawat darurat RSI Siti Khadijah koridor Demang Lebar Daun.',
        ]);

        Ambulance::create([
            'id' => 9,
            'unit_code' => 'AMB-009',
            'name' => 'Ambulans I',
            'provider_id' => $providers[7]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.967935,
            'longitude' => 104.73444,
            'base_location' => 'IGD RS Bunda Palembang',
            'driver_name' => 'Irfan Hakim',
            'driver_phone' => '081234567009',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans siaga 24 jam RS Bunda Palembang Jl. Demang Lebar Daun No. 70.',
        ]);

        Ambulance::create([
            'id' => 10,
            'unit_code' => 'AMB-010',
            'name' => 'Ambulans J',
            'provider_id' => $providers[8]->id,
            'status' => 'offline',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.968521,
            'longitude' => 104.726269,
            'base_location' => 'IGD RS Graha Mandiri',
            'driver_name' => 'Joko Susilo',
            'driver_phone' => '081234567010',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans RS Graha Mandiri, dalam jadwal perawatan servis berkala.',
        ]);

        Ambulance::create([
            'id' => 11,
            'unit_code' => 'AMB-011',
            'name' => 'Ambulans K',
            'provider_id' => $providers[9]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -2.948235,
            'longitude' => 104.73455,
            'base_location' => 'IGD RSUD Siti Fatimah (Prov. Sumsel)',
            'driver_name' => 'Kurniawan',
            'driver_phone' => '081234567011',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile RSUD Siti Fatimah Provinsi Sumsel Km. 6, ventilator transport digital.',
        ]);

        Ambulance::create([
            'id' => 12,
            'unit_code' => 'AMB-012',
            'name' => 'Ambulans L',
            'provider_id' => $providers[10]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.941137,
            'longitude' => 104.726085,
            'base_location' => 'IGD RS Charitas KM 7',
            'driver_name' => 'Lukman Harun',
            'driver_phone' => '081234567012',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans siaga 24 jam RS Charitas KM 7 (Myria) kawasan Sukarami.',
        ]);

        Ambulance::create([
            'id' => 13,
            'unit_code' => 'AMB-013',
            'name' => 'Ambulans M',
            'provider_id' => $providers[11]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.955805,
            'longitude' => 104.748308,
            'base_location' => 'IGD RS Hermina Palembang',
            'driver_name' => 'M. Rizki',
            'driver_phone' => '081234567013',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans darurat RS Hermina, dilengkapi inkubator transport bayi & oksigen.',
        ]);

        Ambulance::create([
            'id' => 14,
            'unit_code' => 'AMB-014',
            'name' => 'Ambulans N',
            'provider_id' => $providers[12]->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.996363,
            'longitude' => 104.776689,
            'base_location' => 'IGD RS Muhammadiyah Palembang',
            'driver_name' => 'Noval Pratama',
            'driver_phone' => '081234567014',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans darurat RS Muhammadiyah Palembang, pangkalan zona Seberang Ulu II.',
        ]);

        Ambulance::create([
            'id' => 15,
            'unit_code' => 'AMB-015',
            'name' => 'Ambulans O',
            'provider_id' => $providers[13]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -3.010678,
            'longitude' => 104.768599,
            'base_location' => 'IGD RSUD Palembang BARI',
            'driver_name' => 'Oki Chandra',
            'driver_phone' => '081234567015',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile RSUD BARI, posko utama tanggap darurat zona Seberang Ulu I.',
        ]);

        Ambulance::create([
            'id' => 16,
            'unit_code' => 'AMB-016',
            'name' => 'Ambulans P',
            'provider_id' => $providers[13]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -3.010678,
            'longitude' => 104.768599,
            'base_location' => 'IGD RSUD Palembang BARI',
            'driver_name' => 'Panji Gumilang',
            'driver_phone' => '081234567016',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans evakuasi standar RSUD BARI Jl. Panca Usaha 5 Ulu Palembang.',
        ]);

        Ambulance::create([
            'id' => 17,
            'unit_code' => 'AMB-017',
            'name' => 'Ambulans Q',
            'provider_id' => $providers[14]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.990328,
            'longitude' => 104.760142,
            'base_location' => 'IGD RS dr. AK Gani',
            'driver_name' => 'Serka Anton',
            'driver_phone' => '081234567017',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans taktis medis RS AK Gani Kesdam II Sriwijaya kawasan Benteng Kuto Besak.',
        ]);

        Ambulance::create([
            'id' => 18,
            'unit_code' => 'AMB-018',
            'name' => 'Ambulans R',
            'provider_id' => $providers[15]->id,
            'status' => 'offline',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.979007,
            'longitude' => 104.776816,
            'base_location' => 'IGD IHC RS Pelabuhan',
            'driver_name' => 'Robby Darmawan',
            'driver_phone' => '081234567018',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans RS Pelabuhan Boom Baru, dalam pengecekan berkala kelayakan operasional.',
        ]);

        Ambulance::create([
            'id' => 19,
            'unit_code' => 'AMB-019',
            'name' => 'Ambulans S',
            'provider_id' => $providers[16]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.985984,
            'longitude' => 104.718573,
            'base_location' => 'IGD RS Permata Palembang',
            'driver_name' => 'Surya Kencana',
            'driver_phone' => '081234567019',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans RS Permata Palembang Jl. Soekarno Hatta, siaga rujukan Ilir Barat I.',
        ]);

        Ambulance::create([
            'id' => 20,
            'unit_code' => 'AMB-020',
            'name' => 'Ambulans T',
            'provider_id' => $providers[17]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.91082,
            'longitude' => 104.713631,
            'base_location' => 'IGD RS Namira',
            'driver_name' => 'Taufik Hidayat',
            'driver_phone' => '081234567020',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans RS Namira Jl. Kol. H. Burlian Km. 9 kawasan Sukarami utara.',
        ]);

        Ambulance::create([
            'id' => 21,
            'unit_code' => 'AMB-021',
            'name' => 'Ambulans U',
            'provider_id' => $providers[18]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.970278,
            'longitude' => 104.801361,
            'base_location' => 'IGD RS Pusri',
            'driver_name' => 'Umar Bakri',
            'driver_phone' => '081234567021',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans gawat darurat RS Pusri kawasan industri Sei Selayur Kalidoni.',
        ]);

        Ambulance::create([
            'id' => 22,
            'unit_code' => 'AMB-022',
            'name' => 'Ambulans V',
            'provider_id' => $providers[19]->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.994504,
            'longitude' => 104.824686,
            'base_location' => 'IGD RS Pertamina Plaju',
            'driver_name' => 'Vicky Prasetyo',
            'driver_phone' => '081234567022',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans RS Pertamina Plaju, melayani wilayah Komperta, Bagus Kuning & Plaju.',
        ]);

        Ambulance::create([
            'id' => 23,
            'unit_code' => 'AMB-023',
            'name' => 'Ambulans W',
            'provider_id' => $providers[20]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.937275,
            'longitude' => 104.794784,
            'base_location' => 'IGD Charitas Hospital Kenten',
            'driver_name' => 'Wahyu Ramadhan',
            'driver_phone' => '081234567023',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans Charitas Hospital Kenten Jl. Betawi Raya Sematang Borang / Sako.',
        ]);

        Ambulance::create([
            'id' => 24,
            'unit_code' => 'AMB-024',
            'name' => 'Ambulans X',
            'provider_id' => $providers[21]->id,
            'status' => 'offline',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.942285,
            'longitude' => 104.78411,
            'base_location' => 'IGD RSIA Azzahra',
            'driver_name' => 'Xaverius T.',
            'driver_phone' => '081234567024',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans RSIA Azzahra MP Mangkunegara, pemeliharaan rutin perlengkapan medis.',
        ]);

        Ambulance::create([
            'id' => 25,
            'unit_code' => 'AMB-025',
            'name' => 'Ambulans Y',
            'provider_id' => $providers[22]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'icu_mobile',
            'has_oxygen' => true,
            'has_icu' => true,
            'latitude' => -3.033882,
            'longitude' => 104.790994,
            'base_location' => 'IGD RS Hermina OPI Jakabaring',
            'driver_name' => 'Yoga Pratama',
            'driver_phone' => '081234567025',
            'whatsapp_number' => '6282162319964',
            'description' => 'ICU Mobile RS Hermina OPI Jakabaring, siaga gawat darurat kawasan Jakabaring Sport City.',
        ]);

        Ambulance::create([
            'id' => 26,
            'unit_code' => 'AMB-026',
            'name' => 'Ambulans Z',
            'provider_id' => $providers[23]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -3.049886,
            'longitude' => 104.803343,
            'base_location' => 'IGD RS Bunda Medika Jakabaring',
            'driver_name' => 'Zainal Abidin',
            'driver_phone' => '081234567026',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans siaga 24 jam RS Bunda Medika Jakabaring koridor Jl. Gubernur Bastari.',
        ]);

        Ambulance::create([
            'id' => 27,
            'unit_code' => 'AMB-027',
            'name' => 'Ambulans AA',
            'provider_id' => $providers[24]->id,
            'status' => 'sedang_bertugas',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -3.005749,
            'longitude' => 104.818078,
            'base_location' => 'IGD RSIA Marissa (Plaju)',
            'driver_name' => 'Aditya Wardhana',
            'driver_phone' => '081234567027',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans rujukan ibu & anak RSIA Marissa Jl. DI Panjaitan Plaju.',
        ]);

        Ambulance::create([
            'id' => 28,
            'unit_code' => 'AMB-028',
            'name' => 'Ambulans AB',
            'provider_id' => $providers[25]->id,
            'status' => 'tersedia',
            'vehicle_type' => 'standar',
            'has_oxygen' => true,
            'has_icu' => false,
            'latitude' => -2.913931,
            'longitude' => 104.695589,
            'base_location' => 'IGD RS Rika Amelia (Alang-Alang Lebar)',
            'driver_name' => 'Bambang Pamungkas',
            'driver_phone' => '081234567028',
            'whatsapp_number' => '6282162319964',
            'description' => 'Ambulans siaga darurat RS Rika Amelia By Pass Alang-Alang Lebar Palembang.',
        ]);

    }
}
