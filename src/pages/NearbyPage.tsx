import { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  LocateFixed,
  Crosshair,
  Bus,
  Clock,
  ExternalLink,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useStore } from '@/store';
import {
  VERIFIED_NODES,
  ROUTES,
  TRIPS,
  type GeoPoint,
  type TransitRoute,
  type Trip,
} from '@/data/busData';
import { distanceFromKm } from '@/lib';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface StopWithMeta {
  code: string;
  name: string;
  pin?: string;
  coords: GeoPoint;
  distanceKm: number | null;
  servingRoutes: TransitRoute[];
  upcomingTrips: Trip[];
}

export function NearbyPage() {
  const { go } = useStore();
  const [userLoc, setUserLoc] = useState<GeoPoint | null>(null);
  const [locStatus, setLocStatus] = useState<'idle' | 'requesting' | 'denied' | 'ok'>('idle');
  const [selectedStopCode, setSelectedStopCode] = useState<string>('LND-CEN-01');

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);

  // Determine stops with metadata
  const stopsList: StopWithMeta[] = Object.entries(VERIFIED_NODES).map(([code, node]) => {
    const coords: GeoPoint = { lat: node.lat, lng: node.lng };
    const dist = userLoc ? distanceFromKm(userLoc, [coords.lat, coords.lng]) : null;

    // Find routes serving this stop (either directly matched name or approximate)
    const serving = ROUTES.filter((r) =>
      r.stops.some(
        (s) =>
          s.stop_name.toLowerCase().includes(node.name.toLowerCase().slice(0, 8)) ||
          node.name.toLowerCase().includes(s.stop_name.toLowerCase().slice(0, 8)) ||
          (node.name.includes('Landran') && r.stops.some((st) => st.stop_name.includes('Landran'))) ||
          (node.name.includes('ISBT-43') && r.stops.some((st) => st.stop_name.includes('43'))) ||
          (node.name.includes('ISBT-17') && r.stops.some((st) => st.stop_name.includes('17')))
      )
    );

    // Find upcoming trips for serving routes
    const trips = TRIPS.filter((t) => serving.some((r) => r.route_id === t.route_id)).slice(0, 4);

    return {
      code,
      name: node.name,
      pin: node.pin,
      coords,
      distanceKm: dist,
      servingRoutes: serving,
      upcomingTrips: trips,
    };
  });

  // Sort: by distance if user location known, else alphabetically/default
  stopsList.sort((a, b) => {
    if (a.distanceKm !== null && b.distanceKm !== null) {
      return a.distanceKm - b.distanceKm;
    }
    return a.name.localeCompare(b.name);
  });

  const selectedStop = stopsList.find((s) => s.code === selectedStopCode) ?? stopsList[0];

  const requestLocation = () => {
    setLocStatus('requesting');
    if (!navigator.geolocation) {
      setLocStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus('ok');
      },
      () => {
        setLocStatus('denied');
      },
      { timeout: 8000 }
    );
  };

  // Initialize and update map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const initialCenter: [number, number] = [selectedStop.coords.lat, selectedStop.coords.lng];

    const map = L.map(mapRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    markersGroup.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Sync markers when stops or selectedStop changes
  useEffect(() => {
    if (!mapInstance.current || !markersGroup.current) return;

    markersGroup.current.clearLayers();

    // Add markers for all stops
    stopsList.forEach((stop) => {
      const isSelected = stop.code === selectedStopCode;
      const markerHtml = `
        <div style="
          width: ${isSelected ? '22px' : '14px'};
          height: ${isSelected ? '22px' : '14px'};
          background: ${isSelected ? '#3B82F6' : '#60A5FA'};
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 0 10px ${isSelected ? 'rgba(59,130,246,0.8)' : 'rgba(0,0,0,0.3)'};
          cursor: pointer;
        "></div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-stop-pin',
        iconSize: [isSelected ? 22 : 14, isSelected ? 22 : 14],
        iconAnchor: [isSelected ? 11 : 7, isSelected ? 11 : 7],
      });

      const marker = L.marker([stop.coords.lat, stop.coords.lng], { icon: customIcon })
        .bindPopup(`<strong>${stop.name}</strong><br><span style="font-size: 11px; color: #666;">Code: ${stop.code}</span>`)
        .on('click', () => {
          setSelectedStopCode(stop.code);
        });

      marker.addTo(markersGroup.current!);
    });

    // Add user marker if available
    if (userLoc) {
      const userIcon = L.divIcon({
        html: `
          <div style="
            width: 16px;
            height: 16px;
            background: #10B981;
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 12px rgba(16,185,129,0.9);
          "></div>
        `,
        className: 'user-loc-pin',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([userLoc.lat, userLoc.lng], { icon: userIcon })
        .bindPopup('<strong>Your Location</strong>')
        .addTo(markersGroup.current!);
    }

    // Pan map to selected stop
    mapInstance.current.panTo([selectedStop.coords.lat, selectedStop.coords.lng], {
      animate: true,
      duration: 0.5,
    });
  }, [selectedStopCode, userLoc]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip-blue text-xs font-semibold uppercase tracking-wider">Transit Discovery</span>
            <span className="chip-verified text-xs">Official Geocodes</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">Nearby Bus Stops</h1>
          <p className="text-sm text-muted">
            Locate verified transit stations, bus stops, and junction hubs across Chandigarh, Mohali & Landran.
          </p>
        </div>

        {/* Location Action */}
        <div>
          {locStatus === 'idle' && (
            <button onClick={requestLocation} className="btn-blue flex items-center gap-2 px-4 py-2 text-sm rounded-xl">
              <LocateFixed className="h-4 w-4" /> Detect My Location
            </button>
          )}
          {locStatus === 'requesting' && (
            <div className="chip-blue px-3 py-2 text-sm flex items-center gap-2">
              <Compass className="h-4 w-4 animate-spin" /> Detecting coordinates…
            </div>
          )}
          {locStatus === 'ok' && (
            <div className="chip-verified px-3 py-1.5 text-xs flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Location Active ({userLoc?.lat.toFixed(4)}, {userLoc?.lng.toFixed(4)})
            </div>
          )}
          {locStatus === 'denied' && (
            <div className="chip-warn px-3 py-1.5 text-xs">
              Location access denied — choose a stop from the list below
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Map & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leaflet Map */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="glass rounded-2xl overflow-hidden border border-line/20 shadow-lg relative">
            <div ref={mapRef} className="h-[440px] w-full" />
            <div className="absolute top-3 right-3 z-[1000] glass px-3 py-1.5 rounded-lg text-xs font-medium text-ink shadow flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              {stopsList.length} Verified Hubs
            </div>
          </div>

          {/* Quick Hub Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs text-muted font-medium shrink-0">Popular Hubs:</span>
            {stopsList.slice(0, 6).map((s) => (
              <button
                key={s.code}
                onClick={() => setSelectedStopCode(s.code)}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  s.code === selectedStopCode
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'glass hover:bg-surface-elevated text-muted hover:text-ink'
                }`}
              >
                {s.name.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Stop Detail & Departures */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Stop Card */}
          <div className="glass rounded-2xl p-5 border border-line/20 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-blue-400 font-semibold">{selectedStop.code}</span>
                <h2 className="text-lg font-bold text-ink">{selectedStop.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  <span>
                    {selectedStop.coords.lat.toFixed(5)}, {selectedStop.coords.lng.toFixed(5)}
                  </span>
                  {selectedStop.pin && <span>• PIN {selectedStop.pin}</span>}
                </div>
              </div>
              {selectedStop.distanceKm !== null && (
                <div className="chip-blue text-xs font-semibold shrink-0">
                  {selectedStop.distanceKm.toFixed(1)} km away
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => go({ name: 'planner', from: selectedStop.name.split('(')[0].trim() })}
                className="btn-blue flex-1 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Navigation className="h-3.5 w-3.5" /> Plan Journey From Here
              </button>
              <button
                onClick={() => go({ name: 'results', from: selectedStop.name.split('(')[0].trim() })}
                className="btn-ghost text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Bus className="h-3.5 w-3.5" /> Search Buses
              </button>
            </div>

            {/* Serving Routes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Serving Routes ({selectedStop.servingRoutes.length})
                </span>
              </div>
              {selectedStop.servingRoutes.length === 0 ? (
                <p className="text-xs text-muted italic">Connecting intermediate stop on regional corridors.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedStop.servingRoutes.map((r) => (
                    <button
                      key={r.route_id}
                      onClick={() => go({ name: 'routes', routeId: r.route_id })}
                      className="chip-blue text-xs font-medium hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                    >
                      <Bus className="h-3 w-3" />
                      <span>{r.route_number}</span>
                      <span className="text-[10px] opacity-75">({r.agency})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scheduled Departures */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                Upcoming Timetable Departures
              </span>
              {selectedStop.upcomingTrips.length === 0 ? (
                <p className="text-xs text-muted italic">
                  Headway-based service every 15–30 minutes (05:30 to 20:00).
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedStop.upcomingTrips.map((t) => (
                    <div
                      key={t.trip_id}
                      onClick={() => go({ name: 'tracking', tripId: t.trip_id })}
                      className="p-2.5 rounded-xl bg-surface/60 hover:bg-surface-elevated border border-line/10 transition-colors cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        <div>
                          <span className="font-bold text-ink">{t.departure_time}</span>
                          <span className="text-muted ml-2">{t.bus_number}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="chip-gray text-[10px]">{t.operator_name}</span>
                        <span className="text-blue-400 hover:underline">Track →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All Verified Stops List */}
          <div className="glass rounded-2xl p-4 border border-line/20">
            <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
              All Verified Transit Nodes ({stopsList.length})
            </span>
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {stopsList.map((stop) => (
                <div
                  key={stop.code}
                  onClick={() => setSelectedStopCode(stop.code)}
                  className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    stop.code === selectedStopCode
                      ? 'bg-blue-600/15 border border-blue-500/40 text-ink font-semibold'
                      : 'hover:bg-surface-elevated text-silver'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className={`h-3.5 w-3.5 shrink-0 ${stop.code === selectedStopCode ? 'text-blue-400' : 'text-muted'}`} />
                    <span className="truncate">{stop.name}</span>
                  </div>
                  {stop.distanceKm !== null && (
                    <span className="text-[11px] text-muted shrink-0 ml-2 font-mono">
                      {stop.distanceKm.toFixed(1)} km
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
