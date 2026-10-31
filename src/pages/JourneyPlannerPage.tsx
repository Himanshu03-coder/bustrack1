import { useState } from 'react';
import {
  MapPin, Calendar, Search, ArrowRight, Bus, Clock,
  Shield, AlertTriangle, ChevronDown, ChevronUp, Navigation,
  Info, CheckCircle2, AlertCircle, HelpCircle
} from 'lucide-react';
import { useStore } from '@/store';
import {
  ALL_CITIES, planJourney, type JourneyLeg,
  getTripsByRoute, searchRoutes
} from '@/data/busData';

// ─── Confidence Badge ─────────────────────────────────────────────────────────

function ConfidenceBadge({ level }: { level: JourneyLeg['confidence'] }) {
  const map = {
    High:       { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'High Confidence' },
    Medium:     { icon: AlertCircle,  color: 'text-amber-400',   bg: 'bg-amber-500/10',   label: 'Estimated Connection' },
    Low:        { icon: HelpCircle,   color: 'text-orange-400',  bg: 'bg-orange-500/10',  label: 'Needs Verification' },
    Unverified: { icon: AlertTriangle,color: 'text-red-400',     bg: 'bg-red-500/10',     label: 'Unverified' },
  };
  const { icon: Icon, color, bg, label } = map[level];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${bg} ${color}`}>
      <Icon className="h-3 w-3" />{label}
    </span>
  );
}

// ─── Journey Leg Card ─────────────────────────────────────────────────────────

function LegCard({ leg }: { leg: JourneyLeg }) {
  const { go } = useStore();
  const [expanded, setExpanded] = useState(false);
  const trips = getTripsByRoute(leg.route.route_id);
  const r = leg.route;

  const serviceTypeBadge = {
    'Public CTU':    { color: 'text-blue-300',   bg: 'bg-blue-500/15'   },
    'Public PRTC':   { color: 'text-purple-300',  bg: 'bg-purple-500/15' },
    'Public PUNBUS': { color: 'text-indigo-300',  bg: 'bg-indigo-500/15' },
    'Institutional': { color: 'text-amber-300',   bg: 'bg-amber-500/15'  },
    'Private Charter':{ color: 'text-rose-300',   bg: 'bg-rose-500/15'   },
  }[r.service_type] ?? { color: 'text-muted', bg: 'bg-white/5' };

  return (
    <div className={`glass rounded-2xl border ${r.is_institutional ? 'border-amber-500/30' : 'border-white/5'} overflow-hidden`}>
      {/* Transfer note */}
      {leg.transferNote && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="text-xs text-amber-300 font-medium">{leg.transferNote}</span>
        </div>
      )}

      {/* Institutional warning */}
      {r.is_institutional && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span className="text-xs text-amber-300 font-semibold">
            INSTITUTIONAL BUS — For enrolled students &amp; staff only. Not available to general public.
          </span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Leg label */}
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {leg.legNumber}
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${serviceTypeBadge.bg} ${serviceTypeBadge.color}`}>
                {r.agency} · {r.route_number !== 'Inter-State' && r.route_number !== 'Regional' ? `Route ${r.route_number}` : r.service_type}
              </span>
              <ConfidenceBadge level={leg.confidence} />
            </div>

            {/* Origin → Destination */}
            <div className="font-bold text-ink flex items-center gap-2 flex-wrap">
              <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
              <span>{r.origin.split('(')[0].trim()}</span>
              <ArrowRight className="h-4 w-4 text-muted" />
              <span>{r.destination.split('(')[0].trim()}</span>
            </div>

            {r.via && (
              <div className="mt-1 text-xs text-muted flex items-start gap-1">
                <span className="shrink-0">Via:</span>
                <span className="line-clamp-2">{r.via}</span>
              </div>
            )}

            {/* Key facts */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {r.duration_min && (
                <span className="chip-gray flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {r.duration_min >= 60
                    ? `${Math.floor(r.duration_min / 60)}h ${r.duration_min % 60}m`
                    : `${r.duration_min} min`}
                </span>
              )}
              {r.distance_km && (
                <span className="chip-gray">{r.distance_km} km</span>
              )}
              {r.stops.length > 0 && (
                <span className="chip-gray">{r.stops.length} stops</span>
              )}
              {r.verification_status === 'Verified' && (
                <span className="chip-verified">
                  <Shield className="h-3 w-3" />Verified
                </span>
              )}
            </div>
          </div>

          {/* Track / Details */}
          <div className="flex flex-col gap-2 shrink-0">
            <button onClick={() => setExpanded((e) => !e)}
              className="btn-ghost text-xs px-3 py-1.5 rounded-xl">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {expanded ? 'Less' : 'Stops'}
            </button>
            {!r.is_institutional && (
              <button
                onClick={() => trips[0] && go({ name: 'tracking', tripId: trips[0].trip_id })}
                className="btn-blue text-xs px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5" /> Track
              </button>
            )}
          </div>
        </div>

        {/* Scheduled Services */}
        {trips.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">
              Scheduled Departures ({trips.length} services)
            </div>
            <div className="flex flex-wrap gap-2">
              {trips.slice(0, 8).map((t) => (
                <div key={t.trip_id}
                  className="glass-sm px-3 py-1.5 rounded-xl text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Bus className="h-3 w-3 text-blue-400" />
                  {t.departure_time}
                  {t.fare_ordinary && <span className="text-muted">·  ₹{t.fare_ordinary}</span>}
                  {t.headway_min && <span className="text-muted">· every {t.headway_min}m</span>}
                </div>
              ))}
              {trips.length > 8 && (
                <span className="chip-gray text-xs">+{trips.length - 8} more</span>
              )}
            </div>
          </div>
        )}

        {/* Stop sequence */}
        {expanded && r.stops.length > 0 && (
          <div className="mt-4 border-t border-white/5 pt-4">
            <div className="text-xs font-bold text-muted uppercase tracking-wide mb-3">Stop Sequence</div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {r.stops.map((s, i) => (
                <div key={s.stop_id} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${i === 0 ? 'bg-blue-400' : i === r.stops.length - 1 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                  <span className="text-xs text-ink flex-1">{s.stop_name}</span>
                  <span className="text-xs text-muted">{s.arrival_offset_min}m</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source info */}
        <div className="mt-3 flex items-center gap-1 text-[10px] text-muted/60">
          <Info className="h-3 w-3" />
          Source: {r.data_source} · Last verified: {r.last_verified_at}
        </div>
      </div>
    </div>
  );
}

// ─── Journey Result ───────────────────────────────────────────────────────────

function JourneyResult({ legs, index }: { legs: JourneyLeg[]; index: number }) {
  const allVerified = legs.every((l) => l.confidence === 'High');
  const totalMin = legs.reduce((sum, l) => sum + l.route.duration_min, 0);
  const totalKm = legs.reduce((sum, l) => sum + (l.route.distance_km ?? 0), 0);

  return (
    <div className="glass rounded-3xl border border-white/5 overflow-hidden">
      {/* Journey header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-ink">
            {legs.length === 1 ? 'Direct Journey' : `${legs.length}-Leg Journey`}
          </span>
          {allVerified ? (
            <span className="chip-verified text-xs"><Shield className="h-3 w-3" />Fully Verified</span>
          ) : (
            <span className="chip-warn text-xs"><AlertTriangle className="h-3 w-3" />Partially Estimated</span>
          )}
        </div>
        <div className="text-xs text-muted">
          {totalMin >= 60 ? `${Math.floor(totalMin / 60)}h ${totalMin % 60}m` : `${totalMin}m`}
          {totalKm > 0 && ` · ${totalKm} km`}
        </div>
      </div>

      {/* Journey legs */}
      <div className="p-4 space-y-4">
        {legs.map((leg, i) => (
          <LegCard key={`${index}-${i}`} leg={leg} />
        ))}
      </div>

      {/* Transfer disclaimer if multi-leg */}
      {legs.length > 1 && (
        <div className="mx-4 mb-4 glass-sm rounded-xl px-4 py-3 border border-amber-500/20 text-xs text-muted flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Transfer connections are estimated based on scheduled times. Verify current schedules before travel.
            Allow adequate transfer time at interchange stops. The platform does not guarantee real-time connections.
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Journey Planner Page ─────────────────────────────────────────────────────

export function JourneyPlannerPage() {
  const { page, go } = useStore();
  const init = page.name === 'planner' ? page : {};

  const [from, setFrom] = useState((init as any).from || '');
  const [to, setTo] = useState((init as any).to || '');
  const [date, setDate] = useState((init as any).date || new Date().toISOString().split('T')[0]);
  const [searched, setSearched] = useState(!!(init as any).from && !!(init as any).to);
  const [fromSugs, setFromSugs] = useState<string[]>([]);
  const [toSugs, setToSugs] = useState<string[]>([]);

  const getSuggestions = (q: string) =>
    q.length < 1 ? [] : ALL_CITIES.filter((c) => c.toLowerCase().includes(q.toLowerCase())).slice(0, 6);

  const journeys = searched && from && to ? planJourney(from, to) : [];
  const directResults = searched ? searchRoutes(from, to) : [];

  const handleSearch = () => setSearched(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl flex items-center gap-3">
          <Navigation className="h-7 w-7 text-blue-400" />
          Journey Planner
        </h1>
        <p className="text-sm text-muted mt-1">
          Plan multi-city journeys with transfer guidance. Includes Delhi → Chandigarh → Mohali → Landran routing.
        </p>
      </div>

      {/* Search Form */}
      <div className="glass rounded-3xl p-5 border border-blue-500/15">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* From */}
          <div className="relative">
            <label className="label mb-1.5 block">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input value={from}
                onChange={(e) => { setFrom(e.target.value); setFromSugs(getSuggestions(e.target.value)); setSearched(false); }}
                onBlur={() => setTimeout(() => setFromSugs([]), 200)}
                placeholder="Origin city or stop…"
                className="input pl-9 text-sm" />
              {fromSugs.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-50 mt-1 glass-sm rounded-xl overflow-hidden shadow-xl border border-white/10">
                  {fromSugs.map((s) => (
                    <li key={s}>
                      <button onMouseDown={() => { setFrom(s); setFromSugs([]); }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-blue-500/10 flex items-center gap-2 text-ink">
                        <MapPin className="h-3 w-3 text-blue-400 shrink-0" />{s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* To */}
          <div className="relative">
            <label className="label mb-1.5 block">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <input value={to}
                onChange={(e) => { setTo(e.target.value); setToSugs(getSuggestions(e.target.value)); setSearched(false); }}
                onBlur={() => setTimeout(() => setToSugs([]), 200)}
                placeholder="Destination city or stop…"
                className="input pl-9 text-sm" />
              {toSugs.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-50 mt-1 glass-sm rounded-xl overflow-hidden shadow-xl border border-white/10">
                  {toSugs.map((s) => (
                    <li key={s}>
                      <button onMouseDown={() => { setTo(s); setToSugs([]); }}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-blue-500/10 flex items-center gap-2 text-ink">
                        <MapPin className="h-3 w-3 text-cyan-400 shrink-0" />{s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="label mb-1.5 block">Travel Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="input pl-9 text-sm" />
            </div>
          </div>
        </div>
        <button onClick={handleSearch}
          className="mt-4 w-full btn-blue py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
          <Search className="h-5 w-5" />
          Plan Journey
        </button>

        {/* Example queries */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { f: 'Delhi', t: 'Landran' },
            { f: 'Chandigarh', t: 'Landran' },
            { f: 'Patiala', t: 'Mohali' },
            { f: 'Chandigarh', t: 'Delhi' },
          ].map(({ f, t }) => (
            <button key={`${f}-${t}`}
              onClick={() => { setFrom(f); setTo(t); setSearched(true); }}
              className="chip text-xs hover:border-blue-500/40 hover:text-blue-300 transition">
              {f} → {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-5">
          {journeys.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center border border-white/5">
              <Bus className="h-12 w-12 mx-auto text-muted mb-4" />
              <h3 className="text-lg font-bold text-ink mb-2">No Verified Routes Found</h3>
              <p className="text-sm text-muted max-w-md mx-auto">
                No verified routes were found connecting <strong className="text-ink">{from || 'your origin'}</strong> to{' '}
                <strong className="text-ink">{to || 'your destination'}</strong>.
                <br /><br />
                This may be because:
              </p>
              <ul className="text-sm text-muted mt-3 space-y-1 max-w-sm mx-auto text-left list-disc list-inside">
                <li>The route isn't in our current dataset</li>
                <li>The journey requires a mode change not yet supported</li>
                <li>Try searching city names like "Chandigarh", "Mohali", "Landran"</li>
              </ul>
              <button onClick={() => go({ name: 'about' })}
                className="mt-5 btn-outline px-5 py-2 text-sm rounded-xl">
                About Our Data Sources
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink">
                  {from} → {to}
                  <span className="text-sm text-muted font-normal ml-2">
                    · {journeys.length} journey option{journeys.length !== 1 ? 's' : ''} found
                  </span>
                </h2>
              </div>

              {/* Multi-leg note */}
              {journeys.some((j) => j.length > 1) && (
                <div className="glass-sm rounded-2xl px-4 py-3 border border-blue-500/20 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted">
                    Multi-leg journeys show routes that require a <strong className="text-ink">transfer</strong>.
                    Each leg is shown separately. Transfer timing is estimated from published schedules — allow extra time.
                    Connections are NOT guaranteed.
                  </p>
                </div>
              )}

              {journeys.map((legs, i) => (
                <JourneyResult key={i} legs={legs} index={i} />
              ))}

              {/* Disclaimer */}
              <div className="glass rounded-2xl p-4 border border-amber-500/15 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-muted">
                  <strong className="text-ink">Important: </strong>
                  Schedule data is sourced from CTU Official Timetable (July 25, 2026) and PRTC.
                  No live GPS tracking is active. Real-time bus positions are not shown unless a genuine feed is connected.
                  Always verify timings with the operator before boarding.
                  CTU Helpline: <a href="tel:18002747400" className="text-blue-400">1800-274-7400</a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

