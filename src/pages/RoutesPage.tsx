import { useState } from 'react';
import {
  Bus, MapPin, ChevronRight, Shield, AlertTriangle,
  Clock, ArrowRight, Search, Filter
} from 'lucide-react';
import { useStore } from '@/store';
import { ROUTES, getTripsByRoute } from '@/data/busData';

export function RoutesPage() {
  const { page, go } = useStore();
  const selectedId = page.name === 'routes' ? page.routeId : undefined;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'public' | 'institutional'>('public');

  const filtered = ROUTES.filter((r) => {
    const q = query.toLowerCase();
    const matchesQuery = !q ||
      r.route_name.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q) ||
      r.route_number.toLowerCase().includes(q) ||
      r.agency.toLowerCase().includes(q);
    const matchesFilter =
      filter === 'all' ||
      (filter === 'public' && !r.is_institutional) ||
      (filter === 'institutional' && r.is_institutional);
    return matchesQuery && matchesFilter;
  });

  const selected = selectedId ? ROUTES.find((r) => r.route_id === selectedId) : filtered[0];
  const selectedTrips = selected ? getTripsByRoute(selected.route_id) : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Bus Routes</h1>
        <p className="text-sm text-muted mt-1">
          Browse all verified routes — CTU, PRTC, and institutional services.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search routes, stops, agencies…"
            className="input pl-9 text-sm w-full" />
        </div>
        <div className="flex items-center gap-1 glass-sm rounded-xl p-1">
          <Filter className="h-4 w-4 text-muted ml-1" />
          {([['all', 'All'], ['public', 'Public'], ['institutional', 'Institutional']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filter === v ? 'bg-accent text-white' : 'text-muted hover:bg-white/5'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Route list */}
        <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="glass p-8 text-center rounded-2xl text-muted text-sm">No routes found</div>
          ) : (
            filtered.map((r) => (
              <button key={r.route_id}
                onClick={() => go({ name: 'routes', routeId: r.route_id })}
                className={`glass w-full p-4 text-left rounded-2xl border transition hover:-translate-y-0.5 ${
                  selected?.route_id === r.route_id ? 'border-accent/50 shadow-glow' : 'border-white/5 hover:border-accent/25'
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-[11px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full">
                        {r.agency} {r.route_number !== 'Inter-State' && r.route_number !== 'Regional' ? `·${r.route_number}` : ''}
                      </span>
                      {r.is_institutional && (
                        <span className="chip-warn text-[10px]"><AlertTriangle className="h-2.5 w-2.5" />Inst.</span>
                      )}
                      {r.verification_status === 'Verified' && (
                        <span className="chip-verified text-[10px]"><Shield className="h-2.5 w-2.5" />✓</span>
                      )}
                    </div>
                    <div className="font-semibold text-ink text-sm truncate">
                      {r.origin.split('(')[0].trim()}
                    </div>
                    <div className="text-xs text-muted flex items-center gap-1 truncate">
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      {r.destination.split('(')[0].trim()}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted shrink-0 mt-1" />
                </div>
                <div className="mt-2 flex gap-1.5 text-xs flex-wrap">
                  {r.duration_min && <span className="chip-gray"><Clock className="h-3 w-3" />{r.duration_min}m</span>}
                  {r.distance_km && <span className="chip-gray">{r.distance_km}km</span>}
                  <span className="chip-gray">{getTripsByRoute(r.route_id).length} trips</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Route detail */}
        {selected ? (
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-3xl p-6 border border-white/5">
              {selected.is_institutional && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-300">
                    <strong>Institutional Bus.</strong> This service is operated exclusively for enrolled students and staff of {selected.operator_name}.
                    It is not available to the general public.
                  </div>
                </div>
              )}

              <h2 className="text-xl font-extrabold text-ink mb-1">{selected.route_name}</h2>
              <div className="text-sm text-muted mb-4">
                {selected.operator_name} · {selected.service_type}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 mb-4">
                {[
                  { l: 'Origin', v: selected.origin },
                  { l: 'Destination', v: selected.destination },
                  { l: 'Via', v: selected.via || 'Direct' },
                  { l: 'Distance', v: selected.distance_km ? `${selected.distance_km} km` : 'Not available' },
                  { l: 'Duration', v: `${selected.duration_min} minutes` },
                  { l: 'Verification', v: selected.verification_status },
                ].map(({ l, v }) => (
                  <div key={l} className="glass-sm p-3 rounded-xl">
                    <div className="text-xs text-muted mb-0.5">{l}</div>
                    <div className="text-sm font-semibold text-ink">{v}</div>
                  </div>
                ))}
              </div>

              {/* Scheduled trips */}
              {selectedTrips.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
                    Scheduled Departures ({selectedTrips.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrips.map((t) => (
                      <div key={t.trip_id}
                        className="glass-sm px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <Bus className="h-3 w-3 text-blue-400" />
                        {t.departure_time}
                        {t.fare_ordinary && <span className="text-muted">· ₹{t.fare_ordinary}</span>}
                        <span className="text-muted">· {t.bus_type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stop sequence */}
              {selected.stops.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-bold text-muted uppercase tracking-wide mb-3">
                    Stop Sequence ({selected.stops.length} stops)
                  </h3>
                  <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                    {selected.stops.map((s, i) => (
                      <div key={s.stop_id} className="flex items-center gap-3 py-1">
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${i === 0 ? 'bg-blue-400' : i === selected.stops.length - 1 ? 'bg-emerald-400' : 'bg-white/15'}`} />
                        <span className="text-sm text-ink flex-1">{s.stop_name}</span>
                        <span className="text-xs text-muted">{s.arrival_offset_min} min</span>
                        <span className="text-xs text-muted/50">
                          {s.coordinates.lat.toFixed(4)}°N {s.coordinates.lng.toFixed(4)}°E
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-[10px] text-muted/50">
                Source: {selected.data_source} · Last verified: {selected.last_verified_at}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 glass rounded-3xl p-10 text-center border border-white/5">
            <MapPin className="h-10 w-10 text-muted mx-auto mb-3" />
            <p className="text-muted text-sm">Select a route to view its details</p>
          </div>
        )}
      </div>
    </div>
  );
}
