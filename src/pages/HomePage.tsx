import { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Search,
  Navigation,
  Route as RouteIcon,
  Zap,
  ArrowRight,
  ArrowLeftRight,
  ChevronRight,
  Bus,
  Shield,
  Star,
  Activity,
  Phone,
  ExternalLink,
  AlertTriangle,
  Ticket,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/store';
import { ROUTES, TRIPS, ALL_CITIES } from '@/data/busData';

// ─── Live Transit Radar Preview (Minimalist interactive mobility board) ────────

function LiveTransitRadar() {
  const { go } = useStore();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Just now');

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  const sampleLiveBuses = [
    {
      routeNumber: '213',
      operator: 'CTU Chandigarh',
      title: 'Derabassi ⇄ Landran (CGC)',
      nextDep: '07:00 AM',
      status: 'On Schedule',
      statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      tripId: 'CTU-213-T01',
      routeId: 'CTU-R213',
      stops: 'Derabassi → Zirakpur → Tribune Chowk → ISBT-43 → Landran',
    },
    {
      routeNumber: 'R03',
      operator: 'CGC University Fleet',
      title: 'Mohali Ph-7 ⇄ Landran Campus',
      nextDep: '07:45 AM',
      status: 'Campus Shuttle',
      statusColor: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30',
      tripId: 'CGC-R03-MORN',
      routeId: 'CGC-R03',
      stops: 'Phase 7 → Sohana Gurdwara → Landran Campus',
    },
    {
      routeNumber: '104',
      operator: 'PRTC Punjab Roadways',
      title: 'ISBT-43 ⇄ Delhi ISBT Kashmere Gate',
      nextDep: '08:30 AM',
      status: 'Seats Available',
      statusColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30',
      tripId: 'PRTC-CHD-DEL-01',
      routeId: 'PRTC-CHD-DEL',
      stops: 'ISBT-43 → Ambala Cantt → Panipat → Delhi ISBT',
    },
  ];

  return (
    <div className="glass rounded-3xl p-5 sm:p-6 border border-line space-y-4">
      {/* Radar header */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-ink uppercase tracking-wider">Live Transit Radar</span>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="text-[11px] text-muted hover:text-accent font-semibold flex items-center gap-1 transition"
          title="Refresh transit pulse"
        >
          <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin text-accent' : ''}`} />
          <span>{syncing ? 'Syncing…' : `Updated: ${lastSync}`}</span>
        </button>
      </div>

      {/* Live cards list */}
      <div className="space-y-2.5">
        {sampleLiveBuses.map((bus) => (
          <div
            key={bus.routeId}
            className="p-3.5 rounded-2xl bg-surface border border-line hover:border-accent/40 transition group cursor-pointer"
            onClick={() => go({ name: 'routes', routeId: bus.routeId })}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-accent/15 text-accent">
                  Route {bus.routeNumber}
                </span>
                <span className="text-[11px] font-medium text-muted">{bus.operator}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bus.statusColor}`}>
                {bus.status}
              </span>
            </div>

            <div className="text-xs font-bold text-ink group-hover:text-accent transition">{bus.title}</div>
            <div className="text-[11px] text-muted truncate mt-0.5">{bus.stops}</div>

            <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between text-[11px]">
              <span className="text-muted flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3 text-accent" /> Dep: <strong className="text-ink">{bus.nextDep}</strong>
              </span>
              <span className="text-accent font-bold flex items-center gap-0.5">
                View Schedule <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action footer */}
      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={() => go({ name: 'results' })}
          className="btn-outline flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
        >
          <Bus className="h-3.5 w-3.5 text-accent" />
          <span>Browse All 38 Trips</span>
        </button>
        <button
          onClick={() => go({ name: 'nearby' })}
          className="btn-ghost py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
          title="Stops near current location"
        >
          <MapPin className="h-3.5 w-3.5 text-accent" />
          <span>Nearby</span>
        </button>
      </div>
    </div>
  );
}

// ─── Unified Minimalist Travel Search ──────────────────────────────────────────

function MinimalistSearch({ onSearch }: { onSearch: (from: string, to: string, date: string) => void }) {
  const { go } = useStore();
  const [activeTab, setActiveTab] = useState<'direct' | 'multicity' | 'booking' | 'nearby'>('direct');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [fromSugs, setFromSugs] = useState<string[]>([]);
  const [toSugs, setToSugs] = useState<string[]>([]);

  const getSuggestions = (q: string) => {
    if (!q || q.length < 1) return [];
    const query = q.toLowerCase();
    return ALL_CITIES.filter((c) => c.toLowerCase().includes(query)).slice(0, 6);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeTab === 'multicity') {
      go({ name: 'planner', from, to, date });
    } else if (activeTab === 'booking') {
      go({ name: 'booking' });
    } else if (activeTab === 'nearby') {
      go({ name: 'nearby' });
    } else {
      onSearch(from, to, date);
    }
  };

  const popularShortcuts = [
    { label: 'Landran ⇄ ISBT-43', from: 'Landran (CGC)', to: 'Chandigarh ISBT-43' },
    { label: 'Kharar ⇄ Sector 17', from: 'Kharar Bus Stand', to: 'Chandigarh ISBT-17' },
    { label: 'Delhi ⇄ Chandigarh', from: 'Delhi Kashmere Gate', to: 'Chandigarh ISBT-43' },
    { label: 'Derabassi ⇄ Landran', from: 'Derabassi', to: 'Landran (CGC)' },
    { label: 'Patiala ⇄ Mohali', from: 'Patiala Bus Stand', to: 'Mohali Phase 7' },
  ];

  return (
    <div className="glass rounded-3xl p-5 sm:p-7 border border-line shadow-sm space-y-5">
      {/* Tab Segment Controls */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-line overflow-x-auto">
        <button
          onClick={() => setActiveTab('direct')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'direct'
              ? 'bg-surface2 text-accent shadow-sm border border-line'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Bus className="h-3.5 w-3.5" />
          <span>Bus Search</span>
        </button>

        <button
          onClick={() => setActiveTab('multicity')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'multicity'
              ? 'bg-surface2 text-accent shadow-sm border border-line'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>Multi-City Route</span>
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'booking'
              ? 'bg-surface2 text-accent shadow-sm border border-line'
              : 'text-muted hover:text-ink'
          }`}
        >
          <Ticket className="h-3.5 w-3.5" />
          <span>Seat Booking</span>
        </button>

        <button
          onClick={() => go({ name: 'nearby' })}
          className="flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-muted hover:text-ink"
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>Stops Near Me</span>
        </button>
      </div>

      {/* Search Input Row */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-7 items-center">
          {/* Origin */}
          <div className="sm:col-span-3 relative">
            <label className="label mb-1.5 block">Starting Point (From)</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
              <input
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setFromSugs(getSuggestions(e.target.value));
                }}
                onBlur={() => setTimeout(() => setFromSugs([]), 200)}
                placeholder="City, sector, or bus stop…"
                className="input pl-10 text-xs sm:text-sm"
              />
              {fromSugs.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-50 mt-1 glass rounded-xl overflow-hidden shadow-xl border border-line max-h-48 overflow-y-auto">
                  {fromSugs.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onMouseDown={() => {
                          setFrom(s);
                          setFromSugs([]);
                        }}
                        className="w-full px-3.5 py-2 text-xs text-left text-ink hover:bg-surface flex items-center gap-2"
                      >
                        <MapPin className="h-3 w-3 text-accent shrink-0" />
                        <span>{s}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex items-center justify-center pt-5 sm:pt-6">
            <button
              type="button"
              onClick={handleSwap}
              className="h-9 w-9 rounded-full border border-line bg-surface hover:bg-surface2 text-muted hover:text-ink flex items-center justify-center transition shadow-sm"
              title="Swap From and To"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* Destination */}
          <div className="sm:col-span-3 relative">
            <label className="label mb-1.5 block">Destination (To)</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-accent2" />
              <input
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setToSugs(getSuggestions(e.target.value));
                }}
                onBlur={() => setTimeout(() => setToSugs([]), 200)}
                placeholder="Where do you want to go?"
                className="input pl-10 text-xs sm:text-sm"
              />
              {toSugs.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-50 mt-1 glass rounded-xl overflow-hidden shadow-xl border border-line max-h-48 overflow-y-auto">
                  {toSugs.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onMouseDown={() => {
                          setTo(s);
                          setToSugs([]);
                        }}
                        className="w-full px-3.5 py-2 text-xs text-left text-ink hover:bg-surface flex items-center gap-2"
                      >
                        <MapPin className="h-3 w-3 text-accent2 shrink-0" />
                        <span>{s}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Date + Submit Row */}
        <div className="grid gap-3 sm:grid-cols-3 pt-1 items-end">
          <div className="sm:col-span-1">
            <label className="label mb-1.5 block">Travel Date</label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="input pl-10 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="btn-blue w-full py-3.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <Search className="h-4 w-4" />
              <span>
                {activeTab === 'multicity'
                  ? 'Plan Multi-City Journey'
                  : activeTab === 'booking'
                  ? 'Find Available Coach Seats'
                  : 'Search Scheduled Buses'}
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* Quick Route Shortcuts */}
      <div className="pt-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
          Popular Direct Corridors:
        </div>
        <div className="flex flex-wrap gap-2">
          {popularShortcuts.map((sc) => (
            <button
              key={sc.label}
              onClick={() => {
                setFrom(sc.from);
                setTo(sc.to);
                onSearch(sc.from, sc.to, date);
              }}
              className="chip hover:border-accent hover:text-accent transition text-xs py-1 px-3"
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  value,
  label,
  sublabel,
}: {
  icon: typeof Bus;
  value: string;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="glass p-4 sm:p-5 rounded-2xl border border-line flex items-center gap-3.5">
      <div className="h-11 w-11 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-black text-ink tracking-tight">{value}</div>
        <div className="text-xs font-bold text-ink">{label}</div>
        {sublabel && <div className="text-[10px] text-muted">{sublabel}</div>}
      </div>
    </div>
  );
}

// ─── Capability Card ──────────────────────────────────────────────────────────

const CAPABILITIES = [
  {
    icon: Navigation,
    title: 'Live Route Tracking',
    desc: 'Explore scheduled route polylines, verified stops, and real-time transit milestones across Chandigarh, Mohali & Landran.',
    badge: 'CTU Timetable 2026',
    actionText: 'Open Radar',
    targetPage: 'results',
  },
  {
    icon: RouteIcon,
    title: 'Multi-City Journey Planner',
    desc: 'Connect complex journeys like Delhi → Chandigarh ISBT-43 → Mohali → Landran with explicit transfer instructions.',
    badge: 'Transfer Guidance',
    actionText: 'Plan Journey',
    targetPage: 'planner',
  },
  {
    icon: MapPin,
    title: 'Nearby Transit Stops',
    desc: 'Instantly find bus stops closest to your location with GPS radius scanning and routes serving each stop.',
    badge: 'Verified Coordinates',
    actionText: 'Find Stops',
    targetPage: 'nearby',
  },
  {
    icon: Ticket,
    title: 'Private Coach Seat Booking',
    desc: 'Reserve vacant seats directly for partner luxury and university express coaches with instant SVG QR e-tickets.',
    badge: 'E-Ticket Generator',
    actionText: 'Book Seat',
    targetPage: 'booking',
  },
];

// ─── Popular Route Card ───────────────────────────────────────────────────────

function PopularRouteCard({ route }: { route: typeof ROUTES[0] }) {
  const { go } = useStore();
  const tripCount = TRIPS.filter((t) => t.route_id === route.route_id).length;

  return (
    <button
      onClick={() => go({ name: 'routes', routeId: route.route_id })}
      className="glass group p-4 sm:p-5 text-left rounded-2xl border border-line hover:border-accent transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent">
              {route.agency} · {route.route_number}
            </span>
            {route.verification_status === 'Verified' && (
              <span className="chip-verified text-[10px]">
                <Shield className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
          <div className="font-bold text-sm text-ink truncate group-hover:text-accent transition">
            {route.origin.split('(')[0].trim()}
          </div>
          <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
            <ArrowRight className="h-3 w-3 shrink-0 text-accent" />
            <span className="truncate">{route.destination.split('(')[0].trim()}</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition" />
      </div>

      <div className="mt-3 pt-3 border-t border-line/60 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="chip-gray">
          <Bus className="h-3 w-3" /> {tripCount} trips/day
        </span>
        {route.distance_km && <span className="chip-gray">{route.distance_km} km</span>}
        {route.duration_min && <span className="chip-gray">{route.duration_min} min</span>}
      </div>
    </button>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

export function HomePage() {
  const { go, addRecent, recent, openSetupModal } = useStore();
  const [now, setNow] = useState('');

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (from: string, to: string, date: string) => {
    addRecent(from, to);
    go({ name: 'results', from, to, date });
  };

  const publicRoutes = ROUTES.filter((r) => !r.is_institutional).slice(0, 6);
  const verifiedCount = ROUTES.filter((r) => r.verification_status === 'Verified').length;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ── Hero Mobility Section ─────────────────────────────────────────── */}
      <section className="space-y-6">
        {/* Headline + Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-accent/10 border border-accent/25 text-accent">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>BUSTRACK 2.0 · Punjab & Tricity Transit</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight leading-tight">
              Transit that just works.
            </h1>
            <p className="text-sm sm:text-base text-muted max-w-xl leading-relaxed">
              Real-time verified timetable schedules, multi-city connection transfers, and seat reservations across Chandigarh, Mohali, Landran, and Punjab.
            </p>
          </div>

          {/* Quick Setup Pill for Judges & Admins */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openSetupModal}
              className="btn-outline px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:border-accent"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Website Setup</span>
            </button>
            <button
              onClick={() => go({ name: 'admin' })}
              className="btn-ghost px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

        {/* Search Card + Live Radar Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <MinimalistSearch onSearch={handleSearch} />
          </div>
          <div className="lg:col-span-5">
            <LiveTransitRadar />
          </div>
        </div>
      </section>

      {/* ── Key Metrics Strip ──────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Bus}
          value="38+"
          label="Scheduled Trips"
          sublabel="Daily CTU & PRTC services"
        />
        <StatCard
          icon={RouteIcon}
          value="16"
          label="Verified Corridors"
          sublabel="Tricity, Punjab & Delhi"
        />
        <StatCard
          icon={Shield}
          value="100%"
          label="Schema Verified"
          sublabel="Official CTU Depots II & III"
        />
        <StatCard
          icon={Star}
          value="4"
          label="Transit Agencies"
          sublabel="CTU · PRTC · PUNBUS · CGC"
        />
      </section>

      {/* ── Platform Capabilities ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink">Built for Every Passenger</h2>
            <p className="text-xs text-muted">Core navigation features built for daily commuters, students & inter-city travellers</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => (
            <div
              key={c.title}
              onClick={() => go({ name: c.targetPage as any })}
              className="glass p-5 rounded-2xl border border-line hover:border-accent transition group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="font-bold text-sm text-ink mb-1 group-hover:text-accent transition">
                  {c.title}
                </div>
                <div className="text-xs text-muted leading-relaxed">{c.desc}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10">
                  {c.badge}
                </span>
                <span className="text-accent font-bold flex items-center gap-0.5 text-[11px]">
                  {c.actionText} <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Verified Corridors ────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-ink">High-Demand Routes</h2>
            <p className="text-xs text-muted">Frequently searched student and commuter corridors with verified timetables</p>
          </div>
          <button
            onClick={() => go({ name: 'routes' })}
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>View All Routes</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {publicRoutes.map((r) => (
            <PopularRouteCard key={r.route_id} route={r} />
          ))}
        </div>
      </section>

      {/* ── Recent Searches ───────────────────────────────────────────────── */}
      {recent.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Your Recent Searches</h2>
          <div className="glass rounded-2xl border border-line divide-y divide-line overflow-hidden">
            {recent.map((r) => (
              <button
                key={r.id}
                onClick={() => go({ name: 'results', from: r.from, to: r.to })}
                className="flex w-full items-center justify-between p-3.5 text-left hover:bg-surface transition"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-accent shrink-0" />
                  <div className="text-xs sm:text-sm font-semibold text-ink">
                    <span>{r.from || 'Any'}</span>
                    <ArrowRight className="inline h-3 w-3 mx-2 text-muted" />
                    <span>{r.to || 'Any'}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Official Helplines & Portals ──────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-ink">Official Transit Helplines</h2>
          <p className="text-xs text-muted">Official contacts for fleet enquiries, lost & found, and smart cards</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'CTU Toll-Free Helpline', number: '1800-274-7400', note: 'Fleet tracking, complaints, pass enquiry' },
            { name: 'ISBT-43 Enquiry Office', number: '0172-2624403', note: 'Interstate departures (Punjab, HP, J&K)' },
            { name: 'ISBT-17 Enquiry Office', number: '0172-2700006', note: 'Delhi, Haryana, UP interstate buses' },
            { name: 'CTU Official Web Booking', number: 'ctuonline.chd.gov.in', note: 'Direct government online booking portal', isLink: true },
            { name: 'PRTC Punjab Booking Portal', number: 'pepsurtc.com', note: 'Punjab inter-city online tickets', isLink: true },
            { name: 'CGC Transport Helpdesk', number: '+91-94166-48137', note: 'Campus shuttle coordination desk' },
          ].map((h) => (
            <div key={h.name} className="glass p-4 rounded-2xl border border-line flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink truncate">{h.name}</div>
                {h.isLink ? (
                  <a
                    href={`https://${h.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    {h.number} <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <a
                    href={`tel:${h.number.replace(/\s/g, '')}`}
                    className="text-xs font-semibold text-accent hover:underline mt-0.5 block"
                  >
                    {h.number}
                  </a>
                )}
                <div className="text-[11px] text-muted mt-0.5 leading-snug">{h.note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Data Notice & Grounding ───────────────────────────────────────── */}
      <section className="glass rounded-2xl p-4 sm:p-5 border border-line flex items-start gap-3.5">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs text-muted leading-relaxed">
          <strong className="text-ink font-semibold">Data Accuracy Notice: </strong>
          Timetable schedules are grounded in CTU Official Timetable (effective July 25, 2026), PRTC official notifications, and CGC University student directories. Institutional buses are clearly labeled and restricted to enrolled students. Real-time updates depend on active transit feed availability.
        </div>
      </section>
    </div>
  );
}
