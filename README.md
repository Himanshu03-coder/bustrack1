# BUSTRACK
> **Smart Insights for a Better Journey**

A university hackathon transit discovery, multi-city journey planning, and vacant-seat booking platform engineered specifically for **Chandigarh Tricity (Chandigarh, Mohali, Panchkula)**, **Landran**, **Kharar**, and **Punjab** regional corridors.

---

## 🌟 Key Features

1. **Futuristic 3D Mobility Hero Section**
   - Deep Midnight Blue and Electric Cyan aesthetic.
   - Animated SVG/CSS 3D bus with floating cards and subtle ambient route paths.
   - Dynamic autocomplete search across 20+ Tricity & regional hubs.

2. **Authoritative Transit Dataset Integration**
   - **Chandigarh Transport Undertaking (CTU)**: Official Depot II, III, IV Timetable (effective July 25, 2026), including CTU Routes 20, 20A, 213 (14 outbound & 13 inbound services), and 242.
   - **PEPSU Road Transport Corporation (PRTC / PUNBUS)**: Intercity stage carriage corridors and fare tables (Patiala, Delhi, Bathinda, Ludhiana, Jalandhar) adhering to the official ₹5 rounding rule.
   - **CGC University Landran**: Academic Session 2025–26 / 2026–27 Fleet Routes R01–R12 with mandatory institutional warning badges.
   - **Private Operators Directory**: Registered private fleet operators in the Mohali/Landran belt.

3. **Multi-City Connecting Journey Planner**
   - Intelligent transfer resolution (e.g., **Delhi → Chandigarh → Mohali → Landran**).
   - Independent leg breakdown with transfer locations, estimated durations, and confidence levels (`High`, `Medium`, `Low`, `Unverified`).

4. **Live & Scheduled Bus Tracking**
   - Interactive Leaflet map with stop-by-stop route polyline.
   - **Strict Data Truth**: Zero simulated GPS masquerading as real telemetry. Clear "Scheduled Only" status banner when real-time hardware feeds are disconnected.

5. **Nearby Stops Discovery**
   - Geolocation-based discovery of verified transit nodes with distance calculations.
   - Interactive map pins with route popups and upcoming timetable departures.

6. **Operator Vacant-Seat Platform & Seat Booking**
   - Interactive 2x2 luxury coach seat map (available, selected, occupied).
   - Instant PNR generation, digital e-Ticket with SVG QR code, and printable boarding passes.
   - "My Bookings" management dashboard with cancellation capability.

7. **Monthly Partner Portal**
   - Tiered monthly subscription plans (₹999, ₹2,499, ₹5,999) for private bus operators to list fleets, manage schedules, and sell vacant corridor seats.

8. **Automated Data Integrity & Audit Dashboard**
   - Built-in schema validator and geocheck inspector (`runDataImportAudit()`).
   - One-click export of normalized JSON dataset.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation & Run

```bash
# Navigate to project directory
cd where-is-my-bus

# Install dependencies (already installed)
npm install

# Start Vite local development server
npm run dev
```

Open your browser and navigate to:
**`http://localhost:5173`**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
where-is-my-bus/
├── public/
│   └── bus.svg                     # Fallback SVG asset
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Sidebar & mobile bottom nav bar
│   │   ├── GlassIcon.tsx           # Glassmorphic icon helper
│   │   └── Badges.tsx              # Verification & status chips
│   ├── data/
│   │   ├── busData.ts              # Primary normalized dataset & journey engine
│   │   └── importScript.ts         # Schema validation & audit suite
│   ├── pages/
│   │   ├── HomePage.tsx            # Futuristic hero & quick search
│   │   ├── JourneyPlannerPage.tsx  # Multi-city connecting journey planner
│   │   ├── ResultsPage.tsx         # All buses list with filters
│   │   ├── TrackingPage.tsx        # Leaflet map route view
│   │   ├── NearbyPage.tsx          # Stop discovery & geocoded nodes
│   │   ├── BookingPage.tsx         # 2x2 seat reservation & e-ticket
│   │   ├── PartnerPage.tsx         # Operator subscription tiers
│   │   ├── DataAuditPage.tsx       # Live data validation & audit metrics
│   │   └── AboutPage.tsx           # Mission, data sources, helplines
│   ├── App.tsx                     # Main router shell
│   ├── store.tsx                   # Central React Context state & localStorage
│   ├── index.css                   # Custom theme & utility styles
│   └── theme.ts                    # Dynamic theme switcher (Midnight Blue default)
├── index.html                      # HTML5 entrypoint with SEO metadata
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite bundler configuration
```

---

## 🛡️ Data Integrity Commitments

- **No GPS Simulation**: We never render an animated moving bus pretending to be real GPS data.
- **Institutional Transit Segregation**: College buses are strictly flagged and never mixed with public booking.
- **Transparent Fares**: If a fare is not in official gazettes, it is displayed as "Not available" rather than fabricated.
- **Full Provenance**: Every record displays its official authority source and last verification timestamp.

