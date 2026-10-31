import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Clock, MapPin, Navigation, Bus, Info, RefreshCw } from 'lucide-react';
import { useStore } from '@/store';
import { ROUTES, TRIPS, getTripsByRoute, getRouteById } from '@/data/busData';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TRACKING_MODE_NOTE = `Live GPS tracking is not currently active for this service.
Schedule information is shown based on the published CTU timetable (July 25, 2026).
No real-time bus positions are displayed. When a genuine GPS data feed is connected
to this platform, the bus position will appear here automatically.`;

export function TrackingPage() {
  const { page, go } = useStore();
  const tripId = page.name === 'tracking' ? page.tripId : TRIPS[0]?.trip_id;
  const trip = TRIPS.find((t) => t.trip_id === tripId) ?? TRIPS[0];
  const route = trip ? getRouteById(trip.route_id) : undefined;

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const center = route?.stops?.[0]?.coordinates
      ? [route.stops[0].coordinates.lat, route.stops[0].coordinates.lng] as [number, number]
      : [30.7333, 76.7794] as [number, number];

    const map = L.map(mapRef.current, {
      center, zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    // Draw route polyline
    if (route?.stops && route.stops.length > 1) {
      const latLngs = route.stops.map((s) => [s.coordinates.lat, s.coordinates.lng] as [number, number]);

      L.polyline(latLngs, {
        color: '#3B82F6',
        weight: 3,
        opacity: 0.8,
        dashArray: '8 4',
      }).addTo(map);

      // Stop markers
      route.stops.forEach((s, i) => {
        const isFirst = i === 0;
        const isLast = i === route.stops.length - 1;

        const icon = L!.divIcon({
          className: `stop-marker ${isFirst ? 'reached' : isLast ? '' : ''}`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });

        L!.marker([s.coordinates.lat, s.coordinates.lng], { icon })
          .bindPopup(`<strong>${s.stop_name}</strong><br>Offset: +${s.arrival_offset_min} min`)
          .addTo(map);
      });

      // Fit map to route
      const group = L.latLngBounds(latLngs);
      map.fitBounds(group, { padding: [30, 30] });
    }

    mapInstance.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [route]);

  const allTrips = route ? getTripsByRoute(route.route_id) : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Bus Tracker</h1>
          <p className="text-sm text-muted">Scheduled route view</p>
        </div>
        <button onClick={() => go({ name: 'results' })} className="btn-ghost text-sm px-4 py-2 rounded-xl">
          ← Back to results
        </button>
      </div>

      {/* No GPS warning */}
      <div className="glass rounded-2xl p-4 border border-amber-500/25 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <div className="font-bold text-ink mb-1">📡 Scheduled Data Only — No Live GPS</div>
          <div className="text-muted text-xs leading-relaxed">{TRACKING_MODE_NOTE}</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2">
          <div ref={mapRef}
            className="w-full rounded-3xl overflow-hidden border border-white/10"
            style={{ height: '420px', background: 'rgb(8 12 24)' }}>
            {!mapReady && (
              <div className="h-full flex items-center justify-center text-muted text-sm gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" /> Loading map…
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-muted/60 text-center">
            Map shows scheduled stop positions · No real-time tracking active
          </p>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          {/* Trip info */}
          {trip && route && (
            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Bus className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-ink text-sm">{route.agency} · Route {route.route_number}</div>
                  <div className="text-xs text-muted">{trip.bus_type}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-muted text-xs">From</div>
                    <div className="text-ink font-semibold">{route.origin.split('(')[0].trim()}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Navigation className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-muted text-xs">To</div>
                    <div className="text-ink font-semibold">{route.destination.split('(')[0].trim()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-muted text-xs">Departure</div>
                    <div className="text-ink font-semibold">{trip.departure_time} → {trip.arrival_time}</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="chip-gray text-xs">{route.stops.length} stops</span>
                <span className="chip-gray text-xs">{route.duration_min} min</span>
                {trip.fare_ordinary && <span className="chip-gray text-xs">₹{trip.fare_ordinary}</span>}
              </div>

              <div className="mt-3 p-2 rounded-xl bg-amber-500/8 border border-amber-500/15 text-xs text-amber-300/80 flex items-center gap-1.5">
                <Info className="h-3 w-3 shrink-0" />
                Tracking Status: <strong>Scheduled Only</strong>
              </div>
            </div>
          )}

          {/* Other departures */}
          {allTrips.length > 1 && (
            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className="text-xs font-bold text-muted uppercase tracking-wide mb-3">
                Other Departures Today
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {allTrips.filter((t) => t.trip_id !== trip?.trip_id).slice(0, 10).map((t) => (
                  <button key={t.trip_id}
                    onClick={() => go({ name: 'tracking', tripId: t.trip_id })}
                    className="flex w-full items-center gap-2 p-2 rounded-xl hover:bg-white/3 text-sm text-left transition">
                    <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span className="font-semibold text-ink">{t.departure_time}</span>
                    <span className="text-muted text-xs">→ {t.arrival_time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stop list */}
          {route && route.stops.length > 0 && (
            <div className="glass rounded-2xl p-4 border border-white/5">
              <div className="text-xs font-bold text-muted uppercase tracking-wide mb-3">Stop Sequence</div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {route.stops.map((s, i) => (
                  <div key={s.stop_id} className="flex items-center gap-2 text-xs">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${i === 0 ? 'bg-blue-400' : i === route.stops.length - 1 ? 'bg-emerald-400' : 'bg-white/15'}`} />
                    <span className="text-ink flex-1">{s.stop_name}</span>
                    <span className="text-muted">+{s.arrival_offset_min}m</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
