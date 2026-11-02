# 🚑 AmperaSiaga - Project Plan

## Architecture: Laravel API + Next.js Frontend

### Tech Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Laravel 11 (PHP 8.2) | REST API, data management |
| **Frontend** | Next.js 15 + React 19 | SSR/CSR UI, interactive map |
| **Styling** | Tailwind CSS 4 | Design system from Stitch |
| **Map** | Leaflet + OpenStreetMap | Interactive ambulance map |
| **Icons** | Material Symbols | Consistent icon system |
| **Fonts** | Plus Jakarta Sans + Inter | Typography from Stitch design |
| **State** | React Context + SWR | Data fetching & state management |

### Project Structure
```
AmperaSiaga/
├── backend/                    # Laravel API
│   ├── app/Models/            # Ambulance, Provider models
│   ├── app/Http/Controllers/  # API controllers
│   ├── routes/api.php         # API routes
│   ├── database/migrations/   # DB schema
│   └── database/seeders/      # Simulation data
├── frontend/                   # Next.js App
│   ├── src/app/               # App router pages
│   ├── src/components/        # React components
│   ├── src/lib/               # API client, utilities
│   └── src/styles/            # Global CSS + Tailwind
└── stitch-assets/             # Original Stitch design files
```

### Backend API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ambulances` | List all ambulances with filters |
| GET | `/api/ambulances/{id}` | Get ambulance details |
| GET | `/api/ambulances/nearest` | Find nearest ambulances by location |
| GET | `/api/providers` | List ambulance providers |
| GET | `/api/stats` | Dashboard statistics |
| POST | `/api/contact-request` | Log WhatsApp contact request |

### Frontend Pages
| Page | Route | Description |
|------|-------|-------------|
| Landing / Home | `/` | Hero + search + map + how it works |
| Admin Login | `/admin` | Admin authentication page |

### Design System (from Stitch)
- **Primary**: `#1D4ED8` (Blue - trust/authority)
- **Secondary/Emergency**: `#DC2626` (Red - emergency actions)
- **Tertiary/WhatsApp**: `#0F7B6C` (Teal - dispatch/communication)
- **Surface**: `#FAF8FF` (Bright, anti-glare)
- **Fonts**: Plus Jakarta Sans (headings), Inter (body)

### Key Features
1. ✅ Emergency hotline strip (112/119)
2. ✅ Interactive map with ambulance markers
3. ✅ Ambulance cards with distance/ETA
4. ✅ WhatsApp integration for admin contact
5. ✅ Status badges (Tersedia, Sedang Bertugas, Offline)
6. ✅ "Cara Kerja" guide section
7. ✅ Responsive design (mobile-first)
8. ✅ Floating emergency button (mobile)
9. ✅ Disclaimer section
