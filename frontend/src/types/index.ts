export interface Provider {
  id: number;
  name: string;
  type: string;
  address: string;
  phone: string | null;
  whatsapp_admin: string;
  latitude: string | number;
  longitude: string | number;
  is_active: boolean;
  ambulances_count?: number;
  available_ambulances_count?: number;
}

export interface Ambulance {
  id: number;
  unit_code: string;
  name: string;
  provider_id: number;
  status: 'tersedia' | 'sedang_bertugas' | 'offline';
  vehicle_type: 'standar' | 'icu_mobile' | 'transport';
  has_oxygen: boolean;
  has_icu: boolean;
  latitude: string | number;
  longitude: string | number;
  base_location: string;
  driver_name: string | null;
  driver_phone: string | null;
  whatsapp_number: string;
  description: string | null;
  distance_km?: number;
  estimated_minutes?: number;
  provider?: Provider;
}

export interface StatsData {
  city: string;
  region: string;
  total_ambulances: number;
  available_ambulances: number;
  on_duty_ambulances: number;
  offline_ambulances: number;
  total_providers: number;
  emergency_hotlines: string[];
}

export interface ContactRequest {
  id: number;
  ambulance_id: number;
  user_name: string | null;
  user_phone: string | null;
  user_latitude: number | null;
  user_longitude: number | null;
  user_address: string | null;
  patient_condition: string | null;
  status: 'menunggu' | 'dihubungi' | 'ditangani' | 'selesai' | 'dibatalkan';
  admin_notes: string | null;
  contacted_via: string;
  ip_address: string | null;
  created_at: string;
  ambulance?: Ambulance;
}
