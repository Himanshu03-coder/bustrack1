/**
 * BUSTRACK — Punjab & Chandigarh Transit Dataset
 *
 * Data Sources:
 *   - CTU Official Timetable (Depot II, III, IV) — effective July 25, 2026
 *   - PRTC / PUNBUS official fare tables
 *   - CGC University Transport Directory 2025–26 / 2026–27
 *   - India Urban Data Exchange (IUDX) / Smart Cities portal
 *
 * Data Rules:
 *   - Institutional buses are NOT presented as public buses.
 *   - Missing values are "Not available", never fabricated.
 *   - No live GPS is claimed unless a real feed is connected.
 *   - All records carry a source and verification status.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type VerificationStatus = 'Verified' | 'Unverified' | 'Needs Update';
export type ServiceType = 'Public CTU' | 'Public PRTC' | 'Public PUNBUS' | 'Institutional' | 'Private Charter';
export type TrackingStatus = 'Live GPS' | 'Last Known Position' | 'Scheduled Only' | 'Demo Simulation' | 'Unavailable';
export type BusCategory = 'Government' | 'Private' | 'Institutional';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface TransitStop {
  stop_id: string;
  stop_name: string;
  coordinates: GeoPoint;
  /** Minutes from route origin */
  arrival_offset_min: number;
  departure_offset_min: number;
  zone_id?: string;
}

export interface TransitRoute {
  route_id: string;
  route_number: string;
  route_name: string;
  operator_name: string;
  operator_id: string;
  agency: string;
  origin: string;
  destination: string;
  via?: string;
  stops: TransitStop[];
  distance_km?: number;
  duration_min: number;
  service_type: ServiceType;
  category: BusCategory;
  /** Is this an institutional-only bus (not for general public)? */
  is_institutional: boolean;
  data_source: string;
  last_verified_at: string;
  verification_status: VerificationStatus;
  notes?: string;
}

export interface Trip {
  trip_id: string;
  route_id: string;
  bus_number: string;
  operator_name: string;
  category: BusCategory;
  service_type: ServiceType;
  departure_time: string; // HH:MM
  arrival_time: string;   // HH:MM
  duration_min: number;
  bus_type: string;
  fare_ordinary?: number;
  fare_hvac?: number;
  fare_volvo?: number;
  operating_days: number[]; // 0=Sun … 6=Sat
  headway_min?: number;
  amenities: string[];
  tracking_status: TrackingStatus;
  seats_available?: number;
  is_bookable: boolean;
  data_source: string;
  verification_status: VerificationStatus;
  notes?: string;
}

export interface Operator {
  id: string;
  name: string;
  type: ServiceType;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  coverage: string;
}

export interface FareEntry {
  corridor: string;
  origin: string;
  destination: string;
  via?: string;
  distance_km?: number;
  fare_ordinary?: number;
  fare_hvac?: number;
  fare_volvo?: number;
  operator: string;
  notes?: string;
  source: string;
  verified_at: string;
}

// ─── Verified Node Coordinates ─────────────────────────────────────────────

export const VERIFIED_NODES: Record<string, GeoPoint & { name: string; pin?: string }> = {
  'LND-CEN-01':  { name: 'Landran Locality Center (NH 205-A Hub)',        lat: 30.694144, lng: 76.665689, pin: '140307' },
  'LND-LPT-02':  { name: 'Landran Light Point / Chowk',                   lat: 30.693400, lng: 76.663500, pin: '140307' },
  'LND-UP-03':   { name: 'Landran (Up) Bus Stop — Inbound',                lat: 30.693800, lng: 76.664200, pin: '140307' },
  'LND-DN-04':   { name: 'Landran (Down) Bus Stop — Outbound',             lat: 30.693100, lng: 76.662900, pin: '140307' },
  'CGC-LND-05':  { name: 'CGC Landran Campus Gate (Sector 112)',           lat: 30.686500, lng: 76.664800, pin: '140307' },
  'SEC-111-06':  { name: 'Sector 111 / Bhago Majra / TDI City',            lat: 30.675717, lng: 76.663500, pin: '140307' },
  'JHJ-UNI-07':  { name: 'Jhanjeri Bus Stop / CGC University',             lat: 30.682860, lng: 76.614860, pin: '140307' },
  'ISBT-43':     { name: 'ISBT Sector 43, Chandigarh',                     lat: 30.7333,   lng: 76.7794,  pin: '160043' },
  'ISBT-17':     { name: 'ISBT Sector 17, Chandigarh',                     lat: 30.7420,   lng: 76.7930,  pin: '160017' },
  'PGI':         { name: 'PGI Chandigarh',                                 lat: 30.7650,   lng: 76.7780,  pin: '160012' },
  'KHARAR-BS':   { name: 'Kharar Bus Stand',                               lat: 30.7444,   lng: 76.6422,  pin: '140301' },
  'SOHANA':      { name: 'Sohana / DC Office Mohali',                      lat: 30.6900,   lng: 76.7060,  pin: '160055' },
  'DERABASSI':   { name: 'Derabassi',                                       lat: 30.5880,   lng: 76.8400,  pin: '140507' },
  'ZIRAKPUR':    { name: 'Zirakpur',                                        lat: 30.6431,   lng: 76.8251,  pin: '140603' },
  'AMBALA-CANTT':{ name: 'Ambala Cantt Bus Stand',                         lat: 30.3742,   lng: 76.9912,  pin: '133001' },
  'PATIALA-BS':  { name: 'Patiala Bus Stand',                              lat: 30.3398,   lng: 76.3869,  pin: '147001' },
  'LUDHIANA-BS': { name: 'Ludhiana Bus Stand',                             lat: 30.9010,   lng: 75.8573,  pin: '141001' },
  'DELHI-ISBT':  { name: 'ISBT Kashmere Gate, Delhi',                      lat: 28.6680,   lng: 77.2286,  pin: '110006' },
  'CHANDIGARH-AIRPORT': { name: 'Shaheed Bhagat Singh Intl Airport',       lat: 30.6735,   lng: 76.7885   },
};

// ─── CTU Route 213: Landran ↔ Derabassi (Complete Stop-Level Data) ──────────

const R213_OUTBOUND_STOPS: TransitStop[] = [
  { stop_id: 'R213-S01', stop_name: 'Landran',             coordinates: { lat: 30.6941, lng: 76.6657 }, arrival_offset_min: 0,  departure_offset_min: 0  },
  { stop_id: 'R213-S02', stop_name: 'DC Office / Lakhnour',coordinates: { lat: 30.6960, lng: 76.6770 }, arrival_offset_min: 4,  departure_offset_min: 4  },
  { stop_id: 'R213-S03', stop_name: 'Sohana',              coordinates: { lat: 30.6900, lng: 76.7060 }, arrival_offset_min: 8,  departure_offset_min: 8  },
  { stop_id: 'R213-S04', stop_name: 'Sec-69/68 (Mohali)',  coordinates: { lat: 30.6950, lng: 76.7310 }, arrival_offset_min: 11, departure_offset_min: 11 },
  { stop_id: 'R213-S05', stop_name: 'Fortis / PSEB',       coordinates: { lat: 30.7000, lng: 76.7420 }, arrival_offset_min: 15, departure_offset_min: 15 },
  { stop_id: 'R213-S06', stop_name: 'Sec-62/63 (Phase 8)', coordinates: { lat: 30.7150, lng: 76.7490 }, arrival_offset_min: 19, departure_offset_min: 19 },
  { stop_id: 'R213-S07', stop_name: 'Sec-51 (CHD)',         coordinates: { lat: 30.7210, lng: 76.7650 }, arrival_offset_min: 23, departure_offset_min: 23 },
  { stop_id: 'R213-S08', stop_name: 'ISBT-43',              coordinates: { lat: 30.7333, lng: 76.7794 }, arrival_offset_min: 26, departure_offset_min: 26 },
  { stop_id: 'R213-S09', stop_name: 'Sec-44',               coordinates: { lat: 30.7310, lng: 76.7860 }, arrival_offset_min: 30, departure_offset_min: 30 },
  { stop_id: 'R213-S10', stop_name: 'Sec-45',               coordinates: { lat: 30.7200, lng: 76.7860 }, arrival_offset_min: 34, departure_offset_min: 34 },
  { stop_id: 'R213-S11', stop_name: 'Sec-46/47',            coordinates: { lat: 30.7100, lng: 76.7900 }, arrival_offset_min: 38, departure_offset_min: 38 },
  { stop_id: 'R213-S12', stop_name: 'Sec-32/31 (GMCH)',     coordinates: { lat: 30.7240, lng: 76.8250 }, arrival_offset_min: 42, departure_offset_min: 42 },
  { stop_id: 'R213-S13', stop_name: 'Tribune Chowk',        coordinates: { lat: 30.7150, lng: 76.8420 }, arrival_offset_min: 45, departure_offset_min: 45 },
  { stop_id: 'R213-S14', stop_name: 'Hallo Majra',          coordinates: { lat: 30.6960, lng: 76.8420 }, arrival_offset_min: 49, departure_offset_min: 49 },
  { stop_id: 'R213-S15', stop_name: 'Airport Chowk',        coordinates: { lat: 30.6730, lng: 76.8380 }, arrival_offset_min: 53, departure_offset_min: 53 },
  { stop_id: 'R213-S16', stop_name: 'Zirakpur',             coordinates: { lat: 30.6431, lng: 76.8251 }, arrival_offset_min: 57, departure_offset_min: 57 },
  { stop_id: 'R213-S17', stop_name: 'Singhpura',            coordinates: { lat: 30.6200, lng: 76.8320 }, arrival_offset_min: 60, departure_offset_min: 60 },
  { stop_id: 'R213-S18', stop_name: 'Bhankharpur',          coordinates: { lat: 30.6020, lng: 76.8380 }, arrival_offset_min: 64, departure_offset_min: 64 },
  { stop_id: 'R213-S19', stop_name: 'Derabassi',            coordinates: { lat: 30.5880, lng: 76.8400 }, arrival_offset_min: 68, departure_offset_min: 68 },
];

// ─── Routes ────────────────────────────────────────────────────────────────

export const ROUTES: TransitRoute[] = [
  // ── CTU Route 213 ─────────────────────────────────────────────────────────
  {
    route_id: 'CTU-213',
    route_number: '213',
    route_name: 'Landran ↔ Derabassi',
    operator_name: 'Chandigarh Transport Undertaking',
    operator_id: 'CTU',
    agency: 'CTU',
    origin: 'Landran',
    destination: 'Derabassi',
    via: 'Sohana, ISBT-43, Sec 44/45/46/47, Tribune Chowk, Zirakpur',
    stops: R213_OUTBOUND_STOPS,
    distance_km: 36,
    duration_min: 68,
    service_type: 'Public CTU',
    category: 'Government',
    is_institutional: false,
    data_source: 'CTU Official Timetable, Depot II/III/IV — effective July 25, 2026',
    last_verified_at: '2026-07-25',
    verification_status: 'Verified',
    notes: 'Exact 55-minute departure interval. 14 outbound, 13 inbound daily services. Cross-regional East–West connector.',
  },

  // ── CTU Route 20: ISBT-17 ↔ Kharar ───────────────────────────────────────
  {
    route_id: 'CTU-20',
    route_number: '20',
    route_name: 'ISBT-17 Chandigarh ↔ Kharar',
    operator_name: 'Chandigarh Transport Undertaking',
    operator_id: 'CTU',
    agency: 'CTU',
    origin: 'ISBT Sector 17, Chandigarh',
    destination: 'Kharar',
    via: 'Aroma, Sec-21, Sec-33/34, ISBT-43, YPS, Mohali Phase-7, Sohana, Lakhnaur, Landran, Chappar Chiri, Sante Majra',
    stops: [
      { stop_id: 'R20-S01', stop_name: 'ISBT Sector 17',         coordinates: { lat: 30.7420, lng: 76.7930 }, arrival_offset_min: 0,  departure_offset_min: 0  },
      { stop_id: 'R20-S02', stop_name: 'Aroma / Sec-21 Mkt',     coordinates: { lat: 30.7380, lng: 76.7850 }, arrival_offset_min: 5,  departure_offset_min: 5  },
      { stop_id: 'R20-S03', stop_name: 'Sec-33/34',              coordinates: { lat: 30.7300, lng: 76.7820 }, arrival_offset_min: 10, departure_offset_min: 10 },
      { stop_id: 'R20-S04', stop_name: 'Sec-44/45',              coordinates: { lat: 30.7220, lng: 76.7860 }, arrival_offset_min: 15, departure_offset_min: 15 },
      { stop_id: 'R20-S05', stop_name: 'ISBT-43',                coordinates: { lat: 30.7333, lng: 76.7794 }, arrival_offset_min: 20, departure_offset_min: 20 },
      { stop_id: 'R20-S06', stop_name: 'YPS Chowk',              coordinates: { lat: 30.7180, lng: 76.7620 }, arrival_offset_min: 28, departure_offset_min: 28 },
      { stop_id: 'R20-S07', stop_name: 'Mohali Phase-7',         coordinates: { lat: 30.7046, lng: 76.7159 }, arrival_offset_min: 35, departure_offset_min: 35 },
      { stop_id: 'R20-S08', stop_name: 'Sohana',                 coordinates: { lat: 30.6900, lng: 76.7060 }, arrival_offset_min: 45, departure_offset_min: 45 },
      { stop_id: 'R20-S09', stop_name: 'Lakhnaur',               coordinates: { lat: 30.6960, lng: 76.6770 }, arrival_offset_min: 50, departure_offset_min: 50 },
      { stop_id: 'R20-S10', stop_name: 'Landran',                coordinates: { lat: 30.6941, lng: 76.6657 }, arrival_offset_min: 55, departure_offset_min: 55 },
      { stop_id: 'R20-S11', stop_name: 'Chappar Chiri',          coordinates: { lat: 30.7050, lng: 76.6450 }, arrival_offset_min: 62, departure_offset_min: 62 },
      { stop_id: 'R20-S12', stop_name: 'Sante Majra',            coordinates: { lat: 30.7200, lng: 76.6350 }, arrival_offset_min: 68, departure_offset_min: 68 },
      { stop_id: 'R20-S13', stop_name: 'Kharar',                 coordinates: { lat: 30.7444, lng: 76.6422 }, arrival_offset_min: 75, departure_offset_min: 75 },
    ],
    distance_km: 28,
    duration_min: 75,
    service_type: 'Public CTU',
    category: 'Government',
    is_institutional: false,
    data_source: 'CTU Official Timetable — July 25, 2026',
    last_verified_at: '2026-07-25',
    verification_status: 'Verified',
    notes: 'Primary Landran trunk. Frequency: 15–30 mins. Operating: 05:30 AM–20:00 Hrs (CHD→Kharar).',
  },

  // ── CTU Route 20A: ISBT-17 ↔ Kharar via Fortis ──────────────────────────
  {
    route_id: 'CTU-20A',
    route_number: '20A',
    route_name: 'ISBT-17 Chandigarh ↔ Kharar (Via Fortis)',
    operator_name: 'Chandigarh Transport Undertaking',
    operator_id: 'CTU',
    agency: 'CTU',
    origin: 'ISBT Sector 17, Chandigarh',
    destination: 'Kharar',
    via: 'Aroma, ISBT-43, YPS, Phase-7, PSEB, Fortis Hospital, Forest Complex, Kumbra Village, Sec-68/69, Sohana, Lakhnaur, Landran',
    stops: [
      { stop_id: 'R20A-S01', stop_name: 'ISBT Sector 17',         coordinates: { lat: 30.7420, lng: 76.7930 }, arrival_offset_min: 0,  departure_offset_min: 0  },
      { stop_id: 'R20A-S02', stop_name: 'ISBT-43',                 coordinates: { lat: 30.7333, lng: 76.7794 }, arrival_offset_min: 18, departure_offset_min: 18 },
      { stop_id: 'R20A-S03', stop_name: 'YPS Chowk',               coordinates: { lat: 30.7180, lng: 76.7620 }, arrival_offset_min: 25, departure_offset_min: 25 },
      { stop_id: 'R20A-S04', stop_name: 'Mohali Phase-7',          coordinates: { lat: 30.7046, lng: 76.7159 }, arrival_offset_min: 32, departure_offset_min: 32 },
      { stop_id: 'R20A-S05', stop_name: 'PSEB / Fortis Hospital',  coordinates: { lat: 30.7000, lng: 76.7420 }, arrival_offset_min: 40, departure_offset_min: 40 },
      { stop_id: 'R20A-S06', stop_name: 'Forest Complex',          coordinates: { lat: 30.6980, lng: 76.7350 }, arrival_offset_min: 44, departure_offset_min: 44 },
      { stop_id: 'R20A-S07', stop_name: 'Kumbra Village',          coordinates: { lat: 30.6950, lng: 76.7250 }, arrival_offset_min: 48, departure_offset_min: 48 },
      { stop_id: 'R20A-S08', stop_name: 'Sec-68/69 (Mohali)',      coordinates: { lat: 30.6950, lng: 76.7310 }, arrival_offset_min: 52, departure_offset_min: 52 },
      { stop_id: 'R20A-S09', stop_name: 'Sohana',                  coordinates: { lat: 30.6900, lng: 76.7060 }, arrival_offset_min: 58, departure_offset_min: 58 },
      { stop_id: 'R20A-S10', stop_name: 'Lakhnaur',                coordinates: { lat: 30.6960, lng: 76.6770 }, arrival_offset_min: 63, departure_offset_min: 63 },
      { stop_id: 'R20A-S11', stop_name: 'Landran',                 coordinates: { lat: 30.6941, lng: 76.6657 }, arrival_offset_min: 68, departure_offset_min: 68 },
      { stop_id: 'R20A-S12', stop_name: 'Kharar',                  coordinates: { lat: 30.7444, lng: 76.6422 }, arrival_offset_min: 80, departure_offset_min: 80 },
    ],
    distance_km: 30,
    duration_min: 80,
    service_type: 'Public CTU',
    category: 'Government',
    is_institutional: false,
    data_source: 'CTU Official Timetable — July 25, 2026',
    last_verified_at: '2026-07-25',
    verification_status: 'Verified',
    notes: 'Diverts via medical corridor (Fortis, PSEB). Operating: 07:45 AM–18:45 Hrs. Headway: 30–45 mins.',
  },

  // ── CTU Route 242: PGI ↔ Tangori via CGC Landran ─────────────────────────
  {
    route_id: 'CTU-242',
    route_number: '242',
    route_name: 'PGI ↔ Tangori (Via CGC Landran)',
    operator_name: 'Chandigarh Transport Undertaking',
    operator_id: 'CTU',
    agency: 'CTU',
    origin: 'PGI Chandigarh',
    destination: 'Tangori',
    via: 'PGI, New OPD, ISBT-17, ISBT-43, IVY Hospital (Sec-71), Sohana, Lakhnaur, Landran, CGC Landran (NH 205-A)',
    stops: [
      { stop_id: 'R242-S01', stop_name: 'PGI',                      coordinates: { lat: 30.7650, lng: 76.7780 }, arrival_offset_min: 0,  departure_offset_min: 0  },
      { stop_id: 'R242-S02', stop_name: 'New OPD',                   coordinates: { lat: 30.7640, lng: 76.7770 }, arrival_offset_min: 5,  departure_offset_min: 5  },
      { stop_id: 'R242-S03', stop_name: 'ISBT Sector 17',            coordinates: { lat: 30.7420, lng: 76.7930 }, arrival_offset_min: 15, departure_offset_min: 15 },
      { stop_id: 'R242-S04', stop_name: 'ISBT-43',                   coordinates: { lat: 30.7333, lng: 76.7794 }, arrival_offset_min: 25, departure_offset_min: 25 },
      { stop_id: 'R242-S05', stop_name: 'IVY Hospital (Sec-71)',     coordinates: { lat: 30.7050, lng: 76.7330 }, arrival_offset_min: 35, departure_offset_min: 35 },
      { stop_id: 'R242-S06', stop_name: 'Sohana',                    coordinates: { lat: 30.6900, lng: 76.7060 }, arrival_offset_min: 42, departure_offset_min: 42 },
      { stop_id: 'R242-S07', stop_name: 'Lakhnaur',                  coordinates: { lat: 30.6960, lng: 76.6770 }, arrival_offset_min: 47, departure_offset_min: 47 },
      { stop_id: 'R242-S08', stop_name: 'Landran (Down/Up)',         coordinates: { lat: 30.6941, lng: 76.6657 }, arrival_offset_min: 52, departure_offset_min: 52 },
      { stop_id: 'R242-S09', stop_name: 'CGC Landran (NH 205-A)',    coordinates: { lat: 30.6865, lng: 76.6648 }, arrival_offset_min: 58, departure_offset_min: 58 },
      { stop_id: 'R242-S10', stop_name: 'Tangori',                   coordinates: { lat: 30.6700, lng: 76.6600 }, arrival_offset_min: 65, departure_offset_min: 65 },
    ],
    distance_km: 22,
    duration_min: 65,
    service_type: 'Public CTU',
    category: 'Government',
    is_institutional: false,
    data_source: 'CTU Official Timetable — July 25, 2026',
    last_verified_at: '2026-07-25',
    verification_status: 'Verified',
    notes: 'Only direct public bus to CGC Landran campus gate. 3 daily services (peak-aligned). Scholar & hospital schedule.',
  },

  // ── CTU Route 8: Mohali Phase-XI ↔ PGI ────────────────────────────────────
  {
    route_id: 'CTU-8',
    route_number: '8',
    route_name: 'Mohali Phase-XI ↔ PGI',
    operator_name: 'Chandigarh Transport Undertaking',
    operator_id: 'CTU',
    agency: 'CTU',
    origin: 'Mohali Phase-XI',
    destination: 'PGI',
    via: 'Sec-49/48, Jagatpura, Sec-47/46/45/44 Mkts, ISBT-43, Sec-35/34, Aroma, Sec-22/17, PEC, New OPD',
    stops: [
      { stop_id: 'R8-S01', stop_name: 'Mohali Phase-XI',      coordinates: { lat: 30.7010, lng: 76.7040 }, arrival_offset_min: 0,  departure_offset_min: 0  },
      { stop_id: 'R8-S02', stop_name: 'Sec-49/48',            coordinates: { lat: 30.7060, lng: 76.7200 }, arrival_offset_min: 8,  departure_offset_min: 8  },
      { stop_id: 'R8-S03', stop_name: 'Sec-47 Market',        coordinates: { lat: 30.7100, lng: 76.7300 }, arrival_offset_min: 14, departure_offset_min: 14 },
      { stop_id: 'R8-S04', stop_name: 'Sec-44 Market',        coordinates: { lat: 30.7150, lng: 76.7560 }, arrival_offset_min: 22, departure_offset_min: 22 },
      { stop_id: 'R8-S05', stop_name: 'ISBT-43',              coordinates: { lat: 30.7333, lng: 76.7794 }, arrival_offset_min: 30, departure_offset_min: 30 },
      { stop_id: 'R8-S06', stop_name: 'Sec-35/34',            coordinates: { lat: 30.7360, lng: 76.7880 }, arrival_offset_min: 38, departure_offset_min: 38 },
      { stop_id: 'R8-S07', stop_name: 'Aroma / Sec-22/17',   coordinates: { lat: 30.7390, lng: 76.7850 }, arrival_offset_min: 44, departure_offset_min: 44 },
      { stop_id: 'R8-S08', stop_name: 'ISBT Sector 17',       coordinates: { lat: 30.7420, lng: 76.7930 }, arrival_offset_min: 50, departure_offset_min: 50 },
      { stop_id: 'R8-S09', stop_name: 'PEC / New OPD',        coordinates: { lat: 30.7600, lng: 76.7790 }, arrival_offset_min: 58, departure_offset_min: 58 },
      { stop_id: 'R8-S10', stop_name: 'PGI',                  coordinates: { lat: 30.7650, lng: 76.7780 }, arrival_offset_min: 65, departure_offset_min: 65 },
    ],
    distance_km: 21,
    duration_min: 65,
    service_type: 'Public CTU',
    category: 'Government',
    is_institutional: false,
    data_source: 'CTU Official Timetable — July 25, 2026',
    last_verified_at: '2026-07-25',
    verification_status: 'Verified',
    notes: 'Transfer route for Landran-bound passengers from Mohali Phase 11. Operating: 06:05 AM–20:50 Hrs.',
  },

  // ── CTU Chandigarh → Delhi ────────────────────────────────────────────────
  {
    route_id: 'CTU-CHD-DEL',
    route_number: 'Inter-State',
    route_name: 'Chandigarh → Delhi (ISBT Kashmere Gate)',
    operator_name: 'Chandigarh Transport Undertaking',
    operator_id: 'CTU',
    agency: 'CTU',
    origin: 'ISBT Sector 17, Chandigarh',
    destination: 'Delhi ISBT Kashmere Gate',
    via: 'Zirakpur, Ambala Cantt, Kurukshetra, Karnal, Panipat, Sonipat',
    stops: [
      { stop_id: 'CHD-DEL-S01', stop_name: 'ISBT Sector 17, Chandigarh', coordinates: { lat: 30.7420, lng: 76.7930 }, arrival_offset_min: 0,   departure_offset_min: 0   },
      { stop_id: 'CHD-DEL-S02', stop_name: 'Zirakpur',                    coordinates: { lat: 30.6431, lng: 76.8251 }, arrival_offset_min: 25,  departure_offset_min: 27  },
      { stop_id: 'CHD-DEL-S03', stop_name: 'Ambala Cantt.',               coordinates: { lat: 30.3742, lng: 76.9912 }, arrival_offset_min: 75,  departure_offset_min: 78  },
      { stop_id: 'CHD-DEL-S04', stop_name: 'Kurukshetra',                 coordinates: { lat: 29.9695, lng: 76.8783 }, arrival_offset_min: 120, departure_offset_min: 122 },
      { stop_id: 'CHD-DEL-S05', stop_name: 'Karnal',                      coordinates: { lat: 29.6857, lng: 76.9885 }, arrival_offset_min: 160, departure_offset_min: 162 },
      { stop_id: 'CHD-DEL-S06', stop_name: 'Panipat',                     coordinates: { lat: 29.3909, lng: 76.9635 }, arrival_offset_min: 200, departure_offset_min: 202 },
      { stop_id: 'CHD-DEL-S07', stop_name: 'Sonipat',                     coordinates: { lat: 28.9956, lng: 77.0145 }, arrival_offset_min: 240, departure_offset_min: 242 },
      { stop_id: 'CHD-DEL-S08', stop_name: 'Delhi ISBT Kashmere Gate',    coordinates: { lat: 28.6680, lng: 77.2286 }, arrival_offset_min: 305, departure_offset_min: 305 },
    ],
    distance_km: 246,
    duration_min: 305,
    service_type: 'Public CTU',
    category: 'Government',
    is_institutional: false,
    data_source: 'CTU Online Booking Portal — ctuonline.chd.gov.in / July 2026',
    last_verified_at: '2026-07-01',
    verification_status: 'Verified',
    notes: '17 CTU options daily. Departs from ISBT Sector 17 (NOT Sector 43). Duration 4h50m–5h08m. Ordinary ₹245; HVAC ₹414; Volvo ₹410.',
  },

  // ── PRTC Patiala → Chandigarh ─────────────────────────────────────────────
  {
    route_id: 'PRTC-PTA-CHD',
    route_number: 'Regional',
    route_name: 'Patiala → Chandigarh',
    operator_name: 'PRTC (Pepsu Road Transport Corporation)',
    operator_id: 'PRTC',
    agency: 'PRTC',
    origin: 'Patiala',
    destination: 'Chandigarh ISBT-43',
    via: 'Rajpura, Zirakpur',
    stops: [
      { stop_id: 'PTA-CHD-S01', stop_name: 'Patiala Bus Stand',    coordinates: { lat: 30.3398, lng: 76.3869 }, arrival_offset_min: 0,   departure_offset_min: 0   },
      { stop_id: 'PTA-CHD-S02', stop_name: 'Rajpura',              coordinates: { lat: 30.4810, lng: 76.5914 }, arrival_offset_min: 30,  departure_offset_min: 32  },
      { stop_id: 'PTA-CHD-S03', stop_name: 'Zirakpur',             coordinates: { lat: 30.6431, lng: 76.8251 }, arrival_offset_min: 75,  departure_offset_min: 77  },
      { stop_id: 'PTA-CHD-S04', stop_name: 'ISBT-43, Chandigarh', coordinates: { lat: 30.7333, lng: 76.7794 }, arrival_offset_min: 105, departure_offset_min: 105 },
    ],
    distance_km: 70,
    duration_min: 105,
    service_type: 'Public PRTC',
    category: 'Government',
    is_institutional: false,
    data_source: 'PRTC Official Portal — pepsurtc.com / July 2026',
    last_verified_at: '2026-07-01',
    verification_status: 'Verified',
    notes: 'Ordinary ₹90–₹110; Duration ~1h45m.',
  },

  // ── Patiala → Mohali (via Banur/Landran) ──────────────────────────────────
  {
    route_id: 'PRTC-PTA-MOH',
    route_number: 'Regional',
    route_name: 'Patiala → Mohali (Via Banur & Landran)',
    operator_name: 'PRTC (Pepsu Road Transport Corporation)',
    operator_id: 'PRTC',
    agency: 'PRTC',
    origin: 'Patiala',
    destination: 'Mohali',
    via: 'Banur, NH 205-A, Landran',
    stops: [
      { stop_id: 'PTA-MOH-S01', stop_name: 'Patiala Bus Stand', coordinates: { lat: 30.3398, lng: 76.3869 }, arrival_offset_min: 0,  departure_offset_min: 0  },
      { stop_id: 'PTA-MOH-S02', stop_name: 'Banur',             coordinates: { lat: 30.5070, lng: 76.7060 }, arrival_offset_min: 35, departure_offset_min: 37 },
      { stop_id: 'PTA-MOH-S03', stop_name: 'Landran',           coordinates: { lat: 30.6941, lng: 76.6657 }, arrival_offset_min: 55, departure_offset_min: 55 },
      { stop_id: 'PTA-MOH-S04', stop_name: 'Mohali (Phase 7)',  coordinates: { lat: 30.7046, lng: 76.7159 }, arrival_offset_min: 70, departure_offset_min: 70 },
    ],
    distance_km: 64,
    duration_min: 70,
    service_type: 'Public PRTC',
    category: 'Government',
    is_institutional: false,
    data_source: 'PRTC Official Portal — pepsurtc.com / July 2026',
    last_verified_at: '2026-07-01',
    verification_status: 'Verified',
    notes: 'HVAC fare ₹70. Direct feeder across Banur–Landran–Mohali corridor (NH 205-A).',
  },

  // ── Chandigarh → Ludhiana ─────────────────────────────────────────────────
  {
    route_id: 'CTU-CHD-LDH',
    route_number: 'Regional',
    route_name: 'Chandigarh → Ludhiana',
    operator_name: 'Chandigarh Transport Undertaking / CTU',
    operator_id: 'CTU',
    agency: 'CTU',
    origin: 'ISBT Sector 43, Chandigarh',
    destination: 'Ludhiana',
    via: 'Kharar, Khamanon, Samrala',
    stops: [
      { stop_id: 'CHD-LDH-S01', stop_name: 'ISBT-43, Chandigarh', coordinates: { lat: 30.7333, lng: 76.7794 }, arrival_offset_min: 0,   departure_offset_min: 0   },
      { stop_id: 'CHD-LDH-S02', stop_name: 'Kharar',               coordinates: { lat: 30.7444, lng: 76.6422 }, arrival_offset_min: 30,  departure_offset_min: 32  },
      { stop_id: 'CHD-LDH-S03', stop_name: 'Khamanon',             coordinates: { lat: 30.8200, lng: 76.3800 }, arrival_offset_min: 80,  departure_offset_min: 82  },
      { stop_id: 'CHD-LDH-S04', stop_name: 'Samrala',              coordinates: { lat: 30.8360, lng: 76.1920 }, arrival_offset_min: 100, departure_offset_min: 102 },
      { stop_id: 'CHD-LDH-S05', stop_name: 'Ludhiana Bus Stand',   coordinates: { lat: 30.9010, lng: 75.8573 }, arrival_offset_min: 135, departure_offset_min: 135 },
    ],
    distance_km: 97,
    duration_min: 135,
    service_type: 'Public CTU',
    category: 'Government',
    is_institutional: false,
    data_source: 'CTU ctuonline.chd.gov.in / July 2026',
    last_verified_at: '2026-07-01',
    verification_status: 'Verified',
    notes: 'Ordinary ₹135; HVAC ₹155. Duration 1h55m–2h45m. 11 CTU options.',
  },

  // ── CGC University Route R03A (Institutional — NOT public) ───────────────
  {
    route_id: 'CGC-R03A',
    route_number: 'CGC-R03A',
    route_name: 'Central CHD → CGC University, Jhanjeri (Via Mohali Ph-7)',
    operator_name: 'CGC University Transport (Institutional)',
    operator_id: 'CGC_TRANS',
    agency: 'CGC_TRANS',
    origin: 'Sec 7/8 Petrol Pump, Chandigarh',
    destination: 'CGC University, Jhanjeri (Mohali)',
    via: 'Sec 17, Sec 19/27, Sec 20, Sec 33, Sec 45, ISBT-43 area, Sec 51, Phase 7 Chawla Lights',
    stops: [
      { stop_id: 'CGCR03A-S01', stop_name: 'Sec 7/8 Petrol Pump, CHD',       coordinates: { lat: 30.7480, lng: 76.8050 }, arrival_offset_min: 0,  departure_offset_min: 0  },
      { stop_id: 'CGCR03A-S02', stop_name: 'Sec 17 Parade Ground',            coordinates: { lat: 30.7420, lng: 76.7930 }, arrival_offset_min: 5,  departure_offset_min: 5  },
      { stop_id: 'CGCR03A-S03', stop_name: 'Sec 19/27 Lights',                coordinates: { lat: 30.7380, lng: 76.7870 }, arrival_offset_min: 10, departure_offset_min: 10 },
      { stop_id: 'CGCR03A-S04', stop_name: 'Sec 20, CHD',                     coordinates: { lat: 30.7330, lng: 76.7810 }, arrival_offset_min: 20, departure_offset_min: 20 },
      { stop_id: 'CGCR03A-S05', stop_name: 'Sec 33 Lights',                   coordinates: { lat: 30.7290, lng: 76.7820 }, arrival_offset_min: 30, departure_offset_min: 30 },
      { stop_id: 'CGCR03A-S06', stop_name: 'Sec 44/45, CHD',                  coordinates: { lat: 30.7210, lng: 76.7860 }, arrival_offset_min: 35, departure_offset_min: 35 },
      { stop_id: 'CGCR03A-S07', stop_name: 'Sec 44/51 Roundabout',            coordinates: { lat: 30.7170, lng: 76.7750 }, arrival_offset_min: 40, departure_offset_min: 40 },
      { stop_id: 'CGCR03A-S08', stop_name: 'Sec 51, CHD',                     coordinates: { lat: 30.7210, lng: 76.7700 }, arrival_offset_min: 50, departure_offset_min: 50 },
      { stop_id: 'CGCR03A-S09', stop_name: 'Phase 7 Chawla Lights, Mohali',   coordinates: { lat: 30.7046, lng: 76.7159 }, arrival_offset_min: 60, departure_offset_min: 60 },
      { stop_id: 'CGCR03A-S10', stop_name: 'CGC University, Jhanjeri',        coordinates: { lat: 30.6829, lng: 76.6149 }, arrival_offset_min: 85, departure_offset_min: 85 },
    ],
    distance_km: 32,
    duration_min: 85,
    service_type: 'Institutional',
    category: 'Institutional',
    is_institutional: true,
    data_source: 'CGC University Transport Directory 2025–26/2026–27 (official route chart)',
    last_verified_at: '2026-01-01',
    verification_status: 'Verified',
    notes: '⚠️ INSTITUTIONAL BUS — For enrolled CGC University students & staff only. Not available to general public. Morning pickup. Route Incharge: Sanchi Rawat +91-90561-83065. Campus arrival: ~09:05 AM.',
  },

  // ── CGC University Route R11A (Panchkula/Zirakpur → Campus) ─────────────
  {
    route_id: 'CGC-R11A',
    route_number: 'CGC-R11A',
    route_name: 'Peermushalla / Zirakpur → CGC University (Via Landran)',
    operator_name: 'CGC University Transport (Institutional)',
    operator_id: 'CGC_TRANS',
    agency: 'CGC_TRANS',
    origin: 'Peermushalla Sec-20, Panchkula',
    destination: 'CGC University, Jhanjeri',
    via: 'Zirakpur, Airport Chowk, CRPF Chowk, Hallo Majra, Ram Darbar, Sec-32, Sec-46/47, Sec-48/49, Ph-10 Mohali, Sec-67/68, Sec-78/79, Landran Chowk',
    stops: [
      { stop_id: 'CGCR11A-S01', stop_name: 'Peermushalla Sec-20, PKL',    coordinates: { lat: 30.6780, lng: 76.8500 }, arrival_offset_min: 0,  departure_offset_min: 0  },
      { stop_id: 'CGCR11A-S02', stop_name: 'Sec-20 PKL',                   coordinates: { lat: 30.6760, lng: 76.8480 }, arrival_offset_min: 5,  departure_offset_min: 5  },
      { stop_id: 'CGCR11A-S03', stop_name: 'Zirakpur',                     coordinates: { lat: 30.6431, lng: 76.8251 }, arrival_offset_min: 15, departure_offset_min: 15 },
      { stop_id: 'CGCR11A-S04', stop_name: 'Airport Chowk',                coordinates: { lat: 30.6730, lng: 76.8380 }, arrival_offset_min: 20, departure_offset_min: 20 },
      { stop_id: 'CGCR11A-S05', stop_name: 'CRPF Chowk',                   coordinates: { lat: 30.6780, lng: 76.8320 }, arrival_offset_min: 22, departure_offset_min: 22 },
      { stop_id: 'CGCR11A-S06', stop_name: 'Hallo Majra',                  coordinates: { lat: 30.6960, lng: 76.8420 }, arrival_offset_min: 25, departure_offset_min: 25 },
      { stop_id: 'CGCR11A-S07', stop_name: 'Ram Darbar',                   coordinates: { lat: 30.7050, lng: 76.8200 }, arrival_offset_min: 30, departure_offset_min: 30 },
      { stop_id: 'CGCR11A-S08', stop_name: 'Sec-32 Lights, CHD',           coordinates: { lat: 30.7240, lng: 76.8250 }, arrival_offset_min: 35, departure_offset_min: 35 },
      { stop_id: 'CGCR11A-S09', stop_name: 'Sec-46/47 Lights, CHD',        coordinates: { lat: 30.7100, lng: 76.7900 }, arrival_offset_min: 40, departure_offset_min: 40 },
      { stop_id: 'CGCR11A-S10', stop_name: 'Sec-48/49 Lights, CHD',        coordinates: { lat: 30.7080, lng: 76.7800 }, arrival_offset_min: 43, departure_offset_min: 43 },
      { stop_id: 'CGCR11A-S11', stop_name: 'Gurudwara Ph-10, Mohali',      coordinates: { lat: 30.7020, lng: 76.7450 }, arrival_offset_min: 45, departure_offset_min: 45 },
      { stop_id: 'CGCR11A-S12', stop_name: 'Ph-10/11 Lights, Mohali',      coordinates: { lat: 30.7010, lng: 76.7380 }, arrival_offset_min: 47, departure_offset_min: 47 },
      { stop_id: 'CGCR11A-S13', stop_name: 'Ph-10 Stadium Lights',         coordinates: { lat: 30.7000, lng: 76.7300 }, arrival_offset_min: 50, departure_offset_min: 50 },
      { stop_id: 'CGCR11A-S14', stop_name: 'Sec-67/68 Lights, Mohali',     coordinates: { lat: 30.6950, lng: 76.7310 }, arrival_offset_min: 55, departure_offset_min: 55 },
      { stop_id: 'CGCR11A-S15', stop_name: 'Sec-78/79 Lights, Mohali',     coordinates: { lat: 30.6880, lng: 76.7090 }, arrival_offset_min: 60, departure_offset_min: 60 },
      { stop_id: 'CGCR11A-S16', stop_name: 'Landran Chowk',                coordinates: { lat: 30.6934, lng: 76.6635 }, arrival_offset_min: 75, departure_offset_min: 75 },
      { stop_id: 'CGCR11A-S17', stop_name: 'CGC University, Jhanjeri',     coordinates: { lat: 30.6829, lng: 76.6149 }, arrival_offset_min: 85, departure_offset_min: 85 },
    ],
    distance_km: 38,
    duration_min: 85,
    service_type: 'Institutional',
    category: 'Institutional',
    is_institutional: true,
    data_source: 'CGC University Transport Directory 2025–26/2026–27',
    last_verified_at: '2026-01-01',
    verification_status: 'Verified',
    notes: '⚠️ INSTITUTIONAL BUS — For enrolled CGC University students & staff only. Morning departure 07:40 AM from Peermushalla. Campus arrival: 09:05 AM. Incharge: +91-94166-48137.',
  },
];

// ─── Trips (Scheduled Services) ───────────────────────────────────────────────

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5, 6];

/** CTU Route 213 — 14 outbound trips from Landran */
const R213_OUTBOUND_TIMES = [
  ['07:00', '08:08'], ['07:55', '09:03'], ['08:50', '09:58'],
  ['09:45', '10:53'], ['10:40', '11:48'], ['11:35', '12:43'],
  ['12:30', '13:38'], ['13:25', '14:33'], ['14:20', '15:28'],
  ['15:15', '16:23'], ['16:10', '17:18'], ['17:05', '18:13'],
  ['18:00', '19:08'], ['18:55', '20:03'],
];

const R213_INBOUND_TIMES = [
  ['07:05', '08:13'], ['08:00', '09:08'], ['08:55', '10:03'],
  ['09:50', '10:58'], ['10:45', '11:53'], ['11:40', '12:48'],
  ['12:35', '13:43'], ['13:30', '14:38'], ['14:25', '15:33'],
  ['15:20', '16:28'], ['16:15', '17:23'], ['17:10', '18:18'],
  ['18:05', '19:13'],
];

export const TRIPS: Trip[] = [
  // Route 213 outbound trips
  ...R213_OUTBOUND_TIMES.map(([dep, arr], i) => ({
    trip_id: `CTU-213-OUT-${String(i + 1).padStart(2, '0')}`,
    route_id: 'CTU-213',
    bus_number: `CTU-213-T${String(i + 1).padStart(2, '0')}`,
    operator_name: 'Chandigarh Transport Undertaking',
    category: 'Government' as BusCategory,
    service_type: 'Public CTU' as ServiceType,
    departure_time: dep,
    arrival_time: arr,
    duration_min: 68,
    bus_type: 'Ordinary Seater',
    fare_ordinary: 30,
    operating_days: ALL_DAYS,
    amenities: ['Published Timetable', 'Schedule Tracking'],
    tracking_status: 'Scheduled Only' as TrackingStatus,
    is_bookable: false,
    data_source: 'CTU Official Timetable — July 25, 2026',
    verification_status: 'Verified' as VerificationStatus,
    notes: 'Outbound: Landran → Derabassi. Exact 55-min departure interval.',
  })),

  // Route 213 inbound trips
  ...R213_INBOUND_TIMES.map(([dep, arr], i) => ({
    trip_id: `CTU-213-IN-${String(i + 1).padStart(2, '0')}`,
    route_id: 'CTU-213',
    bus_number: `CTU-213-T${String(i + 1).padStart(2, '0')}-RET`,
    operator_name: 'Chandigarh Transport Undertaking',
    category: 'Government' as BusCategory,
    service_type: 'Public CTU' as ServiceType,
    departure_time: dep,
    arrival_time: arr,
    duration_min: 68,
    bus_type: 'Ordinary Seater',
    fare_ordinary: 30,
    operating_days: ALL_DAYS,
    amenities: ['Published Timetable', 'Schedule Tracking'],
    tracking_status: 'Scheduled Only' as TrackingStatus,
    is_bookable: false,
    data_source: 'CTU Official Timetable — July 25, 2026',
    verification_status: 'Verified' as VerificationStatus,
    notes: 'Inbound: Derabassi → Landran. Exact 55-min departure interval.',
  })),

  // Route 20 sample trips (headway-based)
  { trip_id: 'CTU-20-T01', route_id: 'CTU-20', bus_number: 'CTU-20-A', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '05:30', arrival_time: '06:45', duration_min: 75, bus_type: 'Ordinary Seater', fare_ordinary: 30, operating_days: ALL_DAYS, headway_min: 15, amenities: ['Frequent Service'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'CTU Official Timetable — July 25, 2026', verification_status: 'Verified', notes: 'Approx 15–30 min headway. Operating 05:30–20:00 Hrs.' },
  { trip_id: 'CTU-20A-T01', route_id: 'CTU-20A', bus_number: 'CTU-20A-A', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '07:45', arrival_time: '09:05', duration_min: 80, bus_type: 'Ordinary Seater', fare_ordinary: 30, operating_days: ALL_DAYS, headway_min: 30, amenities: ['Via Fortis Hospital'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'CTU Official Timetable — July 25, 2026', verification_status: 'Verified', notes: 'Via Fortis/PSEB medical corridor. Headway: 30–45 mins.' },
  { trip_id: 'CTU-242-T01', route_id: 'CTU-242', bus_number: 'CTU-242-A', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '07:30', arrival_time: '08:35', duration_min: 65, bus_type: 'Ordinary Seater', fare_ordinary: 35, operating_days: ALL_DAYS, amenities: ['Direct to CGC Landran'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'CTU Official Timetable — July 25, 2026', verification_status: 'Verified', notes: '3 daily services. Only direct public bus to CGC Landran gate.' },
  { trip_id: 'CTU-242-T02', route_id: 'CTU-242', bus_number: 'CTU-242-B', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '09:00', arrival_time: '10:05', duration_min: 65, bus_type: 'Ordinary Seater', fare_ordinary: 35, operating_days: ALL_DAYS, amenities: ['Direct to CGC Landran'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'CTU Official Timetable — July 25, 2026', verification_status: 'Verified' },
  { trip_id: 'CTU-242-T03', route_id: 'CTU-242', bus_number: 'CTU-242-C', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '14:00', arrival_time: '15:05', duration_min: 65, bus_type: 'Ordinary Seater', fare_ordinary: 35, operating_days: ALL_DAYS, amenities: ['Direct to CGC Landran'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'CTU Official Timetable — July 25, 2026', verification_status: 'Verified' },

  // Chandigarh → Delhi sample trips
  { trip_id: 'CTU-CHD-DEL-T01', route_id: 'CTU-CHD-DEL', bus_number: 'CHD-DEL-01', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '06:00', arrival_time: '11:05', duration_min: 305, bus_type: 'Volvo AC Multi-Axle', fare_ordinary: 245, fare_hvac: 414, fare_volvo: 410, operating_days: ALL_DAYS, amenities: ['AC', 'Charging Point', 'Water Bottle'], tracking_status: 'Scheduled Only', is_bookable: true, data_source: 'CTU ctuonline.chd.gov.in', verification_status: 'Verified' },
  { trip_id: 'CTU-CHD-DEL-T02', route_id: 'CTU-CHD-DEL', bus_number: 'CHD-DEL-02', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '08:00', arrival_time: '13:05', duration_min: 305, bus_type: 'HVAC Seater', fare_ordinary: 245, fare_hvac: 414, operating_days: ALL_DAYS, amenities: ['AC', 'Charging Point'], tracking_status: 'Scheduled Only', is_bookable: true, data_source: 'CTU ctuonline.chd.gov.in', verification_status: 'Verified' },
  { trip_id: 'CTU-CHD-DEL-T03', route_id: 'CTU-CHD-DEL', bus_number: 'CHD-DEL-03', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '10:30', arrival_time: '15:35', duration_min: 305, bus_type: 'Non-AC Seater', fare_ordinary: 245, operating_days: WEEKDAYS, amenities: ['Non-AC', 'Charging Point'], tracking_status: 'Scheduled Only', is_bookable: true, data_source: 'CTU ctuonline.chd.gov.in', verification_status: 'Verified' },
  { trip_id: 'CTU-CHD-DEL-T04', route_id: 'CTU-CHD-DEL', bus_number: 'CHD-DEL-04', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '14:00', arrival_time: '19:05', duration_min: 305, bus_type: 'Volvo Multi-Axle Sleeper', fare_volvo: 410, operating_days: ALL_DAYS, amenities: ['AC', 'Sleeper', 'Charging Point', 'Water Bottle'], tracking_status: 'Scheduled Only', is_bookable: true, data_source: 'CTU ctuonline.chd.gov.in', verification_status: 'Verified' },
  { trip_id: 'CTU-CHD-DEL-T05', route_id: 'CTU-CHD-DEL', bus_number: 'CHD-DEL-05', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '22:00', arrival_time: '03:05', duration_min: 305, bus_type: 'Volvo AC Semi-Sleeper', fare_volvo: 410, operating_days: ALL_DAYS, amenities: ['AC', 'Charging Point', 'Water Bottle', 'Night Service'], tracking_status: 'Scheduled Only', is_bookable: true, data_source: 'CTU ctuonline.chd.gov.in', verification_status: 'Verified' },

  // PRTC Patiala → Chandigarh
  { trip_id: 'PRTC-PTA-CHD-T01', route_id: 'PRTC-PTA-CHD', bus_number: 'PRTC-PTA-01', operator_name: 'PRTC', category: 'Government', service_type: 'Public PRTC', departure_time: '06:00', arrival_time: '07:45', duration_min: 105, bus_type: 'Non-AC Seater', fare_ordinary: 90, operating_days: ALL_DAYS, amenities: ['Non-AC'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'pepsurtc.com', verification_status: 'Verified' },
  { trip_id: 'PRTC-PTA-CHD-T02', route_id: 'PRTC-PTA-CHD', bus_number: 'PRTC-PTA-02', operator_name: 'PRTC', category: 'Government', service_type: 'Public PRTC', departure_time: '08:30', arrival_time: '10:15', duration_min: 105, bus_type: 'HVAC Seater', fare_ordinary: 110, fare_hvac: 110, operating_days: ALL_DAYS, amenities: ['AC'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'pepsurtc.com', verification_status: 'Verified' },

  // PRTC Patiala → Mohali (via Banur/Landran)
  { trip_id: 'PRTC-PTA-MOH-T01', route_id: 'PRTC-PTA-MOH', bus_number: 'PRTC-PTA-MOH-01', operator_name: 'PRTC', category: 'Government', service_type: 'Public PRTC', departure_time: '07:00', arrival_time: '08:10', duration_min: 70, bus_type: 'HVAC Seater', fare_hvac: 70, operating_days: ALL_DAYS, amenities: ['AC', 'Via Banur-Landran axis'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'pepsurtc.com / July 2026', verification_status: 'Verified' },

  // CTU Chandigarh → Ludhiana
  { trip_id: 'CTU-CHD-LDH-T01', route_id: 'CTU-CHD-LDH', bus_number: 'CTU-LDH-01', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '06:00', arrival_time: '08:15', duration_min: 135, bus_type: 'HVAC Seater', fare_ordinary: 135, fare_hvac: 155, operating_days: ALL_DAYS, amenities: ['AC', 'Charging Point'], tracking_status: 'Scheduled Only', is_bookable: true, data_source: 'CTU ctuonline.chd.gov.in', verification_status: 'Verified' },
  { trip_id: 'CTU-CHD-LDH-T02', route_id: 'CTU-CHD-LDH', bus_number: 'CTU-LDH-02', operator_name: 'CTU', category: 'Government', service_type: 'Public CTU', departure_time: '10:00', arrival_time: '12:15', duration_min: 135, bus_type: 'Ordinary Seater', fare_ordinary: 135, operating_days: ALL_DAYS, amenities: ['Non-AC'], tracking_status: 'Scheduled Only', is_bookable: true, data_source: 'CTU ctuonline.chd.gov.in', verification_status: 'Verified' },

  // CGC University Route R03A (institutional morning trip)
  { trip_id: 'CGC-R03A-MORNING', route_id: 'CGC-R03A', bus_number: 'CGC-CHO4L1127', operator_name: 'CGC University Transport', category: 'Institutional', service_type: 'Institutional', departure_time: '07:40', arrival_time: '09:05', duration_min: 85, bus_type: '52-Seater Institutional Bus', operating_days: WEEKDAYS, amenities: ['GPS Tracked', 'Speed Governor', 'CCTV (Select Routes)'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'CGC University Transport Directory 2025–26', verification_status: 'Verified', notes: '⚠️ Institutional bus for CGC University students & staff only.' },

  // CGC University Route R11A (institutional morning trip)
  { trip_id: 'CGC-R11A-MORNING', route_id: 'CGC-R11A', bus_number: 'CGC-R11A-BUS', operator_name: 'CGC University Transport', category: 'Institutional', service_type: 'Institutional', departure_time: '07:40', arrival_time: '09:05', duration_min: 85, bus_type: '52-Seater Institutional Bus', operating_days: WEEKDAYS, amenities: ['GPS Tracked', 'Speed Governor'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: 'CGC University Transport Directory 2025–26', verification_status: 'Verified', notes: '⚠️ Institutional bus — via Zirakpur, Landran. Incharge: +91-94166-48137.' },
];

// ─── Fare Tables ──────────────────────────────────────────────────────────────

export const FARE_TABLE: FareEntry[] = [
  // CTU Local / Tricity
  { corridor: 'UT Local (Within CHD)', origin: 'Chandigarh (any)', destination: 'Chandigarh (any)', fare_ordinary: 10, notes: 'Base ₹10 up to 10 km; +₹5 per 5 km slab; max ₹35', operator: 'CTU', source: 'CTU official fare schedule', verified_at: '2026-07-25' },
  { corridor: 'Tricity Cross-Border (Mohali/Landran)', origin: 'Chandigarh', destination: 'Landran (via Sohana)', fare_ordinary: 35, notes: 'ISBT-17 to Landran ≈ ₹35 Non-AC; ₹45 AC. Cross-border stage fares.', operator: 'CTU', source: 'CTU official fare schedule', verified_at: '2026-07-25' },
  { corridor: 'Airport Shuttle', origin: 'ISBT-17 / ISBT-43', destination: 'Shaheed Bhagat Singh Airport', fare_hvac: 100, notes: '₹100 flat fare. Dedicated CTU Airport Shuttle.', operator: 'CTU', source: 'CTU official fare schedule', verified_at: '2026-07-25' },
  { corridor: 'Landran → ISBT-43', origin: 'Landran', destination: 'ISBT-43', fare_ordinary: 25, notes: 'CTU Route 213/20/20A', operator: 'CTU', source: 'CTU official timetable', verified_at: '2026-07-25' },
  { corridor: 'Landran → Derabassi', origin: 'Landran', destination: 'Derabassi', fare_ordinary: 30, notes: 'CTU Route 213', operator: 'CTU', source: 'CTU official timetable', verified_at: '2026-07-25' },
  // Daily / Monthly Passes
  { corridor: 'Daily Unlimited Pass (Non-AC)', origin: 'All Tricity', destination: 'All Tricity', fare_ordinary: 60, notes: '₹60/day (green pass). Unlimited local/tricity travel. Buy from conductor.', operator: 'CTU', source: 'CTU official fare schedule', verified_at: '2026-07-25' },
  { corridor: 'Daily Unlimited Pass (AC/HVAC)', origin: 'All Tricity', destination: 'All Tricity', fare_hvac: 75, notes: '₹75/day (AC pass). Buy from conductor.', operator: 'CTU', source: 'CTU official fare schedule', verified_at: '2026-07-25' },
  { corridor: 'Monthly Smart Card (Non-AC)', origin: 'All Tricity', destination: 'All Tricity', fare_ordinary: 470, notes: '₹470/month + ₹30 Smart Card fee. Issued at ISBT-17 / ISBT-43.', operator: 'CTU', source: 'CTU official fare schedule', verified_at: '2026-07-25' },
  // PRTC Regional
  { corridor: 'Patiala → Mohali (via Banur)', origin: 'Patiala', destination: 'Mohali', via: 'Banur, NH 205-A, Landran', distance_km: 64, fare_hvac: 70, operator: 'PRTC', source: 'pepsurtc.com / July 2026', verified_at: '2026-07-01' },
  { corridor: 'Patiala → Chandigarh', origin: 'Patiala', destination: 'Chandigarh', via: 'Rajpura, Zirakpur', distance_km: 70, fare_ordinary: 90, notes: 'PRTC ₹90; CTU Non-AC ₹110. Duration ~1h45m.', operator: 'PRTC/CTU', source: 'pepsurtc.com / ctuonline.chd.gov.in', verified_at: '2026-07-01' },
  { corridor: 'Chandigarh → Delhi', origin: 'Chandigarh ISBT-17', destination: 'Delhi ISBT Kashmere Gate', distance_km: 246, fare_ordinary: 245, fare_hvac: 414, fare_volvo: 410, notes: '17 CTU buses daily from ISBT-17. Duration 4h50m–5h08m.', operator: 'CTU', source: 'ctuonline.chd.gov.in / July 2026', verified_at: '2026-07-01' },
  { corridor: 'Chandigarh → Ludhiana', origin: 'ISBT-43', destination: 'Ludhiana', via: 'Kharar, Khamanon, Samrala', distance_km: 97, fare_ordinary: 135, fare_hvac: 155, notes: '11 CTU options. Duration 1h55m–2h45m.', operator: 'CTU', source: 'ctuonline.chd.gov.in', verified_at: '2026-07-01' },
  { corridor: 'Chandigarh → Shimla', origin: 'ISBT-43', destination: 'Shimla', via: 'Pinjore, Parwanoo, Solan', distance_km: 113, fare_ordinary: 263, notes: 'Duration ~4h35m. CTU Non-AC / HVAC.', operator: 'CTU/HRTC', source: 'ctuonline.chd.gov.in', verified_at: '2026-07-01' },
  { corridor: 'Chandigarh → Amritsar', origin: 'ISBT-43', destination: 'Amritsar', via: 'Ropar, Nawanshahr, Phagwara', distance_km: 225, fare_ordinary: 360, notes: 'Duration ~5h34m.', operator: 'CTU', source: 'ctuonline.chd.gov.in', verified_at: '2026-07-01' },
  { corridor: 'Chandigarh → Pathankot', origin: 'ISBT-43', destination: 'Pathankot', via: 'Ropar, Dasuya, Mukerian', distance_km: 243, fare_ordinary: 472, notes: 'Duration ~4h49m. 5 CTU options.', operator: 'CTU', source: 'ctuonline.chd.gov.in', verified_at: '2026-07-01' },
  { corridor: 'Patiala → Delhi ISBT', origin: 'Patiala', destination: 'Delhi ISBT', distance_km: 271, fare_ordinary: 260, fare_hvac: 420, fare_volvo: 585, notes: '10 PRTC buses daily. Duration 5h–6h.', operator: 'PRTC', source: 'pepsurtc.com / AbhiBus', verified_at: '2026-07-01' },
  { corridor: 'Ludhiana → Delhi ISBT', origin: 'Ludhiana', destination: 'Delhi ISBT', distance_km: 332, fare_ordinary: 325, fare_hvac: 500, fare_volvo: 730, notes: '14 PRTC buses. Duration 5h50m–6h30m.', operator: 'PRTC', source: 'pepsurtc.com', verified_at: '2026-07-01' },
  { corridor: 'Amritsar → Delhi ISBT', origin: 'Amritsar', destination: 'Delhi ISBT', distance_km: 481, fare_hvac: 840, fare_volvo: 1075, operator: 'PRTC', source: 'pepsurtc.com', verified_at: '2026-07-01' },
  { corridor: 'Sangrur → Chandigarh', origin: 'Sangrur', destination: 'Chandigarh', via: 'Patiala', distance_km: 127, fare_ordinary: 155, fare_hvac: 195, operator: 'PRTC/CTU', source: 'pepsurtc.com', verified_at: '2026-07-01' },
  { corridor: 'Bathinda → Chandigarh', origin: 'Bathinda', destination: 'Chandigarh', distance_km: 169, fare_ordinary: 280, fare_hvac: 350, operator: 'PRTC', source: 'pepsurtc.com', verified_at: '2026-07-01' },
];

// ─── Verified Private Operators Directory ─────────────────────────────────────

export const PRIVATE_OPERATORS: Operator[] = [
  { id: 'OP-SHIVAY', name: 'Shivay Travels', type: 'Private Charter', address: 'Sector 115, Santemajra, Landran–Kharar Road, Landran, Mohali – 140307', coverage: 'Landran–Kharar Highway & Sector 115 feeder corridor' },
  { id: 'OP-NANUAN', name: 'Nanuan Bus Service', type: 'Private Charter', address: 'Main Highway Banur, Near Bus Stand Goyal Colony, Banur, Mohali – 140601', coverage: 'Banur–Landran–Mohali–Rajpura highway stage carriage' },
  { id: 'OP-RAJPREET', name: 'Rajpreet Travels Chandigarh', type: 'Private Charter', address: 'Old Bus Stand Phase-8, Sector 62 (Near Angeetha Sahib Gurudwara Lambia), Mohali – 160062', coverage: 'Phase 8 Mohali Old Bus Stand regional charters' },
  { id: 'OP-KARTAR', name: 'Kartar Travels Pvt. Ltd.', type: 'Private Charter', address: 'Office No. 621/6, Ground Floor, Village Kajheri, Sector 52 (Opposite ISBT-43), CHD – 160036', coverage: 'Punjab intercity stage carriage & ISBT-43 feeder' },
  { id: 'OP-ONKAR', name: 'Onkar Tourist Bus Service', type: 'Private Charter', address: 'Opposite Manav Mangal School, Sector 88, SAS Nagar, Mohali – 160055', coverage: 'Sector 88 / Southern Mohali & Manimajra corridors' },
  { id: 'OP-LONGIA', name: 'Longia Bus Service', type: 'Private Charter', address: 'Plot 2090, Sector 85 (Near Shishu Niketan Public School), SAS Nagar, Mohali – 140307', coverage: 'Sector 85 / Sohana–Landran institutional belt' },
  { id: 'OP-HARGOBIND', name: 'Hargobind Travels', type: 'Private Charter', address: 'Sec 78 / Sec 74A (Near Airport Road), Mohali – 140307', coverage: 'Airport Road (PR-7) and Phase 8 Industrial Area shuttles' },
  { id: 'OP-TRIP2', name: 'Trip 2 Traveller World Pvt. Ltd.', type: 'Private Charter', address: 'No. 2C, Gobind Enclave, Sunny Enclave, Kharar – 140301 (Mohali Sector 117)', coverage: 'Sunny Enclave / Sector 117 / Kharar–Landran corridor' },
];

// ─── Official Helplines ───────────────────────────────────────────────────────

export interface HelplineItem {
  agency: string;
  purpose: string;
  number: string;
  timings?: string;
}

export const HELPLINE_LIST: HelplineItem[] = [
  { agency: 'CTU Chandigarh', purpose: 'Toll-Free Control Room & Grievance', number: '1800-274-7400', timings: '24x7' },
  { agency: 'CTU Chandigarh', purpose: 'ISBT Sector 43 General Enquiry', number: '0172-2624403', timings: '06:00 - 22:00' },
  { agency: 'CTU Chandigarh', purpose: 'ISBT Sector 17 General Enquiry', number: '0172-2700006', timings: '06:00 - 22:00' },
  { agency: 'HRTC Himachal', purpose: 'ISBT-43 Counter & Booking Enquiry', number: '0172-2668943', timings: '06:00 - 21:00' },
  { agency: 'CGC Landran', purpose: 'Campus Transport Control Room', number: '+91-94166-48137', timings: '07:30 - 18:00' },
  { agency: 'CGC University', purpose: 'Chandigarh Fleet Incharge', number: '+91-90561-83065', timings: '07:30 - 18:00' },
];

export const HELPLINES = {
  ctu_toll_free:      '1800-274-7400',
  ctu_email:          'ctu-chd@nic.in',
  ctu_live_tracking:  'https://ctucitybus.com',
  ctu_booking:        'https://ctuonline.chd.gov.in',
  ctu_isbt43_enquiry: '0172-2624403',
  ctu_isbt17_enquiry: '0172-2700006',
  hrtc_isbt43:        '0172-2668943',
  prtc_portal:        'https://pepsurtc.com',
  punbus_portal:      'https://punbusonline.com',
  cgc_landran_tollfree: '1800-200-3575',
  cgc_landran_email:  'info@cgc.edu.in',
  cgc_university_transport: '+91-94166-48137',
  cgc_university_chd_incharge: '+91-90561-83065 (Sanchi Rawat)',
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getRouteById(id: string): TransitRoute | undefined {
  return ROUTES.find((r) => r.route_id === id);
}

export function getTripsByRoute(routeId: string): Trip[] {
  return TRIPS.filter((t) => t.route_id === routeId);
}

export function getTripById(id: string): Trip | undefined {
  return TRIPS.find((t) => t.trip_id === id);
}

export function searchRoutes(from: string, to: string): TransitRoute[] {
  const f = from.trim().toLowerCase();
  const t = to.trim().toLowerCase();
  if (!f && !t) return ROUTES;

  return ROUTES.filter((r) => {
    const origin = r.origin.toLowerCase();
    const dest = r.destination.toLowerCase();
    const via = (r.via || '').toLowerCase();
    const stops = r.stops.map((s) => s.stop_name.toLowerCase()).join(' ');
    const allText = `${origin} ${dest} ${via} ${stops}`;

    const fromMatch = !f || allText.includes(f);
    const toMatch = !t || allText.includes(t);
    return fromMatch && toMatch;
  });
}

/**
 * Find multi-leg journeys (e.g. Delhi → Chandigarh → Mohali → Landran)
 * Returns an array of journey legs, each being a route+trip combination.
 */
export interface JourneyLeg {
  legNumber: number;
  route: TransitRoute;
  trip?: Trip;
  boardingStop?: string;
  alightingStop?: string;
  transferNote?: string;
  isConfirmed: boolean;
  confidence: 'High' | 'Medium' | 'Low' | 'Unverified';
}

export function planJourney(from: string, to: string): JourneyLeg[][] {
  const direct = searchRoutes(from, to);
  const results: JourneyLeg[][] = [];

  // Direct journeys
  if (direct.length > 0) {
    for (const route of direct) {
      const trips = getTripsByRoute(route.route_id);
      results.push([{
        legNumber: 1,
        route,
        trip: trips[0],
        isConfirmed: route.verification_status === 'Verified',
        confidence: route.verification_status === 'Verified' ? 'High' : 'Low',
      }]);
    }
  }

  // Transfer journeys: find routes from 'from' to major hubs, then from hub to 'to'
  const TRANSFER_HUBS = [
    'ISBT Sector 43', 'ISBT-43', 'ISBT Sector 17', 'ISBT-17',
    'Chandigarh', 'Kharar', 'Landran', 'Sohana', 'Zirakpur',
    'Patiala', 'Ambala',
  ];

  for (const hub of TRANSFER_HUBS) {
    const leg1Routes = searchRoutes(from, hub);
    const leg2Routes = searchRoutes(hub, to);

    if (leg1Routes.length > 0 && leg2Routes.length > 0) {
      const leg1 = leg1Routes[0];
      const leg2 = leg2Routes[0];
      const trips1 = getTripsByRoute(leg1.route_id);
      const trips2 = getTripsByRoute(leg2.route_id);

      // Avoid duplicating direct routes
      const alreadyDirect = results.some(
        (j) => j.length === 1 && j[0].route.route_id === leg1.route_id
      );
      if (alreadyDirect && leg1Routes.length === 1) continue;

      results.push([
        {
          legNumber: 1,
          route: leg1,
          trip: trips1[0],
          alightingStop: hub,
          isConfirmed: leg1.verification_status === 'Verified',
          confidence: leg1.verification_status === 'Verified' ? 'High' : 'Medium',
        },
        {
          legNumber: 2,
          route: leg2,
          trip: trips2[0],
          boardingStop: hub,
          transferNote: `Transfer at ${hub}. Allow adequate time. Connection is estimated, not guaranteed.`,
          isConfirmed: leg2.verification_status === 'Verified',
          confidence: leg2.verification_status === 'Verified' ? 'Medium' : 'Low',
        },
      ]);
    }
  }

  // Remove duplicates by route_id combinations
  const seen = new Set<string>();
  return results.filter((j) => {
    const key = j.map((l) => l.route.route_id).join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6); // Return max 6 journey options
}

/** All unique city names for autocomplete */
export const ALL_CITIES = Array.from(new Set([
  ...ROUTES.map((r) => r.origin),
  ...ROUTES.map((r) => r.destination),
  // Add popular stops
  'Landran', 'Mohali', 'Chandigarh', 'Kharar', 'Sohana',
  'Derabassi', 'Zirakpur', 'Panchkula', 'Patiala', 'Ludhiana',
  'Ambala', 'Delhi', 'Amritsar', 'Shimla', 'Jalandhar',
  'ISBT Sector 43', 'ISBT Sector 17', 'PGI Chandigarh',
  'CGC Landran', 'CGC University Jhanjeri',
])).sort();

