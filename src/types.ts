// Core types for BUSTRACK demo data

export type BusCategory = 'Government' | 'Private';

export type RunningStatus =
  | 'Running'
  | 'Delayed'
  | 'Not Started'
  | 'Approaching Stop'
  | 'Completed';

export interface Stop {
  id: string;
  name: string;
  /** approximate lat/lng for demo map plotting */
  lat: number;
  lng: number;
  /** minutes from origin (scheduled arrival offset) */
  arrivalOffsetMin: number;
  /** minutes from origin (scheduled departure offset); === arrival if no halt */
  departureOffsetMin: number;
  /** distance in km from origin where available */
  distanceKm?: number;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm?: number;
  durationMin: number;
  stops: Stop[];
}

export interface Bus {
  id: string;
  number: string; // fictional vehicle number
  operator: string;
  category: BusCategory;
  routeId: string;
  departureTime: string; // "HH:MM"
  arrivalTime: string; // "HH:MM"
  durationMin: number;
  stopsCount: number;
  /** operating days, 0=Sun..6=Sat */
  operatingDays: number[];
  status: RunningStatus;
  delayMin: number;
  busType: string; // e.g. "Volvo AC Seater"
  fare: number;
  rating: number;
  amenities: string[];
}

export interface StopState {
  stop: Stop;
  status: 'reached' | 'current' | 'upcoming';
  reachedAt?: string; // clock string when reached
}

export interface RecentSearch {
  id: string;
  from: string;
  to: string;
  at: number; // timestamp
}

export interface BookingRecord {
  bookingId: string;
  pnr: string;
  tripId: string;
  routeNumber: string;
  operatorName: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  seatNumbers: string[];
  totalFare: number;
  passengerName: string;
  passengerPhone: string;
  passengerGender?: string;
  boardingPoint: string;
  bookedAt: number;
  status: 'Confirmed' | 'Cancelled';
}
