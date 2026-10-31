import { useMemo, useState } from 'react';
import {
  SlidersHorizontal, ArrowDownWideNarrow, X, Search, Bus,
  Shield, AlertTriangle, Clock, MapPin, ChevronRight, Navigation, Ticket
} from 'lucide-react';
import { useStore } from '@/store';
import { ROUTES, TRIPS, searchRoutes, getTripsByRoute } from '@/data/busData';
import type { TransitRoute, Trip } from '@/data/busData';

type SortBy = 'dep' | 'dur' | 'fare' | 'name';
type FilterServiceType = 'all' | 'Public CTU' | 'Public PRTC' | 'Public PUNBUS' | 'Institutional' | 'Private Charter';

function TripCard({ route, trip }: { route: TransitRoute; trip: Trip }) {
  const { go } = useStore();
  const bestFare = trip.fare_ordinary ?? trip.fare_hvac ?? trip.fare_volvo;

  return (
    <div className={`glass rounded-2xl overflow-hidden border ${route.is_institutional ? 'border-amber-500/20' : 'border-white/5'}`}>
      {route.is_institutional && (
        <div className="bg-amber-500/10 border-b border-amber-500/15 px-4 py-1.5 flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="text-xs text-amber-300 font-semibold">
            Institutional Bus — Enrolled students & staff only
          </span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300">
                {route.agency} {route.route_number !== 'Inter-State' && route.route_number !== 'Regional' ? `· Route ${route.route_number}` : ''}
              </span>
              {route.verification_status === 'Verified' && (
                <span className="chip-verified"><Shield className="h-3 w-3" />Verified</span>
              )}
            </div>
            <div className="font-bold text-ink flex items-center gap-1.5 flex-wrap">
              <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{route.origin.split('(')[0].trim()}</span>
              <ChevronRight className="h-4 w-4 text-muted" />
              <span className="truncate">{route.destination.split('(')[0].trim()}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="chip-gray flex items-center gap-1">
                <Clock className="h-3 w-3" /> {trip.departure_time} → {trip.arrival_time}
              </span>
              {route.duration_min && (
                <span className="chip-gray">
                  {route.duration_min >= 60
                    ? `${Math.floor(route.duration_min / 60)}h ${route.duration_min % 60}m`
                    : `${route.duration_min} min`}
                </span>
              )}
              {bestFare && <span className="chip-gray">₹{bestFare}</span>}
              {route.distance_km && <span className="chip-gray">{route.distance_km} km</span>}
            </div>
            <div className="mt-1.5 text-xs text-muted flex flex-wrap gap-1">
              {trip.amenities.slice(0, 3).map((a) => (
                <span key={a} className="chip-gray">{a}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            {trip.is_bookable && (
              <button onClick={() => go({ name: 'booking', tripId: trip.trip_id })}
                className="btn-blue text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 font-semibold shadow-glow-blue">
                <Ticket className="h-3.5 w-3.5" /> Book Seat
              </button>
            )}
            {!route.is_institutional && (
              <button onClick={() => go({ name: 'tracking', tripId: trip.trip_id })}
                className="btn-ghost text-xs px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5" /> Track
              </button>
            )}
            <button onClick={() => go({ name: 'routes', routeId: route.route_id })}
              className="btn-ghost text-xs px-3 py-1.5 rounded-xl">
              Details
            </button>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-muted/50">
          Source: {route.data_source} · Verified: {route.last_verified_at}
        </div>
      </div>
    </div>
  );
}

export function ResultsPage() {
  const { page, go } = useStore();
  const init = page.name === 'results' ? page : { from: '', to: '', busNumber: '', operator: '' };

  const [sort, setSort] = useState<SortBy>('dep');
  const [serviceFilter, setServiceFilter] = useState<FilterServiceType>('all');
  const [showInstitutional, setShowInstitutional] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const initialFrom = (init as any).from || '';
  const initialTo = (init as any).to || '';

  // Find matching routes
  const matchingRoutes = useMemo(() => {
    let routes = searchRoutes(initialFrom, initialTo);
    if (serviceFilter !== 'all') routes = routes.filter((r) => r.service_type === serviceFilter);
    if (!showInstitutional) routes = routes.filter((r) => !r.is_institutional);
    return routes;
  }, [initialFrom, initialTo, serviceFilter, showInstitutional]);

  // Build trip+route pairs
  const allItems = useMemo(() => {
    const items: { route: TransitRoute; trip: Trip }[] = [];
    for (const route of matchingRoutes) {
      const trips = getTripsByRoute(route.route_id);
      if (trips.length === 0) {
        // Route with no trips — show as a placeholder
        items.push({ route, trip: { trip_id: `${route.route_id}-placeholder`, route_id: route.route_id, bus_number: 'Schedule only', operator_name: route.operator_name, category: route.category, service_type: route.service_type, departure_time: 'See timetable', arrival_time: 'See timetable', duration_min: route.duration_min, bus_type: 'Various', operating_days: [0,1,2,3,4,5,6], amenities: ['Published timetable'], tracking_status: 'Scheduled Only', is_bookable: false, data_source: route.data_source, verification_status: route.verification_status } });
      } else {
        trips.forEach((trip) => items.push({ route, trip }));
      }
    }

    items.sort((a, b) => {
      if (sort === 'dep') return a.trip.departure_time.localeCompare(b.trip.departure_time);
      if (sort === 'dur') return a.route.duration_min - b.route.duration_min;
      if (sort === 'fare') return (a.trip.fare_ordinary ?? 9999) - (b.trip.fare_ordinary ?? 9999);
      return a.route.route_name.localeCompare(b.route.route_name);
    });
    return items;
  }, [matchingRoutes, sort]);

  const heading = initialFrom || initialTo
    ? `${initialFrom || 'Any'} → ${initialTo || 'Any'}`
    : 'All Bus Services';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">{heading}</h1>
          <p className="text-sm text-muted">
            {allItems.length} service{allItems.length !== 1 ? 's' : ''} found
            {!showInstitutional && ' · Institutional buses hidden'}
          </p>
        </div>
        <button onClick={() => go({ name: 'planner', from: initialFrom, to: initialTo })}
          className="btn-blue text-xs px-4 py-2 rounded-xl flex items-center gap-2">
          <Navigation className="h-3.5 w-3.5" /> Plan Full Journey
        </button>
      </div>

      {/* Sort + filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/3 p-1">
          <ArrowDownWideNarrow className="ml-1 h-4 w-4 text-muted" />
          {(['dep', 'dur', 'fare', 'name'] as SortBy[]).map((s) => (
            <button key={s} onClick={() => setSort(s)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold capitalize transition ${sort === s ? 'bg-accent text-surface' : 'text-muted hover:bg-white/5'}`}>
              {s === 'dep' ? 'Departure' : s === 'dur' ? 'Duration' : s === 'fare' ? 'Fare' : 'Name'}
            </button>
          ))}
        </div>

        <button onClick={() => setShowFilters((s) => !s)} className="btn-outline px-3 py-2 text-xs">
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {serviceFilter !== 'all' && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-400" />}
        </button>

        <button onClick={() => setShowInstitutional((v) => !v)}
          className={`btn-outline px-3 py-2 text-xs ${showInstitutional ? 'border-amber-500/40 text-amber-300' : ''}`}>
          <AlertTriangle className="h-4 w-4" />
          {showInstitutional ? 'Hide' : 'Show'} Institutional
        </button>

        {serviceFilter !== 'all' && (
          <button onClick={() => setServiceFilter('all')} className="text-xs font-semibold text-muted hover:text-ink">
            <X className="mr-1 inline h-3.5 w-3.5" />Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="glass grid gap-4 p-4 animate-fade-in sm:grid-cols-2 rounded-2xl">
          <div>
            <label className="label mb-1.5 block">Service Type</label>
            <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value as FilterServiceType)} className="input">
              <option value="all">All services</option>
              <option value="Public CTU">Public CTU</option>
              <option value="Public PRTC">Public PRTC</option>
              <option value="Public PUNBUS">Public PUNBUS</option>
              <option value="Private Charter">Private Charter</option>
              <option value="Institutional">Institutional</option>
            </select>
          </div>
        </div>
      )}

      {allItems.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 p-10 text-center rounded-3xl">
          <Bus className="h-12 w-12 text-muted" />
          <h3 className="text-lg font-bold text-ink">No services found</h3>
          <p className="max-w-sm text-sm text-muted">
            Try a different route, or use the Journey Planner for multi-city trips.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button onClick={() => go({ name: 'home' })} className="btn-blue px-4 py-2 text-sm rounded-xl">
              <Search className="h-4 w-4" /> New Search
            </button>
            <button onClick={() => go({ name: 'planner' })} className="btn-outline px-4 py-2 text-sm rounded-xl">
              <Navigation className="h-4 w-4" /> Journey Planner
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {allItems.map(({ route, trip }) => (
            <TripCard key={trip.trip_id} route={route} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
