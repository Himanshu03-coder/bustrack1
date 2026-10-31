import { useState, useEffect } from 'react';
import {
  MapPin, Clock, Calendar, Search, Navigation, Route as RouteIcon,
  Zap, ArrowRight, ChevronRight, Bus, Shield, Star, Activity,
  Phone, ExternalLink, AlertTriangle
} from 'lucide-react';
import { useStore } from '@/store';
import { ROUTES, TRIPS, ALL_CITIES } from '@/data/busData';

// ─── Animated 3D-style SVG Bus ────────────────────────────────────────────────

function AnimatedBus() {
  return (
    <div className="relative select-none pointer-events-none">
      {/* Glow behind bus */}
      <div className="absolute inset-0 blur-3xl opacity-30"
        style={{ background: 'radial-gradient(ellipse at center, #3B82F6 0%, #6366F1 40%, transparent 70%)' }} />

      {/* Bus body */}
      <svg viewBox="0 0 280 160" className="w-full max-w-sm mx-auto drop-shadow-2xl animate-float" aria-hidden="true">
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="50%" stopColor="#0F2040" />
            <stop offset="100%" stopColor="#091428" />
          </linearGradient>
          <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="windowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="wheelGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>

        {/* Main bus body */}
        <rect x="15" y="30" width="250" height="100" rx="14" fill="url(#bodyGrad)"
          stroke="#2563EB" strokeWidth="1.5" opacity="0.9" />

        {/* Roof accent stripe */}
        <rect x="15" y="30" width="250" height="22" rx="14" fill="url(#topGrad)" />
        <rect x="15" y="44" width="250" height="8" fill="url(#topGrad)" />

        {/* Route text on side */}
        <text x="50" y="64" fill="#DBEAFE" fontSize="11" fontWeight="bold" fontFamily="monospace" opacity="0.9" letterSpacing="2">
          BUSTRACK
        </text>

        {/* Windows */}
        {[38, 78, 118, 158, 198].map((x, i) => (
          <g key={i}>
            <rect x={x} y="78" width="28" height="28" rx="5" fill="url(#windowGrad)" opacity="0.85" />
            {/* Window light reflection */}
            <rect x={x + 3} y="80" width="10" height="6" rx="2" fill="white" opacity="0.35" />
          </g>
        ))}

        {/* Front windshield */}
        <rect x="228" y="72" width="28" height="42" rx="6" fill="url(#windowGrad)" opacity="0.8" />
        <rect x="231" y="74" width="12" height="8" rx="2" fill="white" opacity="0.3" />

        {/* Headlights */}
        <ellipse cx="263" cy="90" rx="6" ry="5" fill="#FEF08A" filter="url(#glow)" />
        <ellipse cx="263" cy="102" rx="4" ry="3" fill="#FCA5A5" opacity="0.8" />

        {/* CTU stripe */}
        <rect x="15" y="118" width="250" height="6" fill="#2563EB" opacity="0.5" />

        {/* Door */}
        <rect x="18" y="82" width="14" height="36" rx="3" fill="#1E40AF" stroke="#3B82F6" strokeWidth="0.5" opacity="0.7" />

        {/* Underside detail */}
        <rect x="25" y="128" width="230" height="6" rx="3" fill="#0F172A" />

        {/* Wheels */}
        <circle cx="58" cy="138" r="18" fill="url(#wheelGrad)" />
        <circle cx="58" cy="138" r="11" fill="#1F2937" />
        <circle cx="58" cy="138" r="5" fill="#374151" />
        <circle cx="58" cy="138" r="2" fill="#6B7280" />

        <circle cx="208" cy="138" r="18" fill="url(#wheelGrad)" />
        <circle cx="208" cy="138" r="11" fill="#1F2937" />
        <circle cx="208" cy="138" r="5" fill="#374151" />
        <circle cx="208" cy="138" r="2" fill="#6B7280" />

        {/* Wheel hubcaps spokes */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <g key={i} transform={`rotate(${deg} 58 138)`}>
            <line x1="58" y1="127" x2="58" y2="133" stroke="#6B7280" strokeWidth="1.5" />
          </g>
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <g key={i} transform={`rotate(${deg} 208 138)`}>
            <line x1="208" y1="127" x2="208" y2="133" stroke="#6B7280" strokeWidth="1.5" />
          </g>
        ))}

        {/* Ground shadow */}
        <ellipse cx="140" cy="157" rx="120" ry="5" fill="black" opacity="0.25" />

        {/* Route line under bus (animated in CSS) */}
        <line x1="0" y1="156" x2="280" y2="156" stroke="#2563EB" strokeWidth="1.5"
          strokeDasharray="6 4" opacity="0.4" />
      </svg>
    </div>
  );
}

// ─── Floating Route Cards ─────────────────────────────────────────────────────

function FloatingCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/20 animate-float-slow ${className}`}>
      {children}
    </div>
  );
}

// ─── Search Widget ────────────────────────────────────────────────────────────

function HeroSearch({ onSearch }: { onSearch: (from: string, to: string, date: string) => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [fromSugs, setFromSugs] = useState<string[]>([]);
  const [toSugs, setToSugs] = useState<string[]>([]);

  const getSuggestions = (q: string) =>
    q.length < 1 ? [] : ALL_CITIES.filter((c) =>
      c.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6);

  const handleSwap = () => { setFrom(to); setTo(from); };

  return (
    <div className="glass rounded-3xl p-6 shadow-2xl border border-blue-500/20 backdrop-blur-2xl">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* From */}
        <div className="relative">
          <label className="label mb-1.5 block text-blue-300">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
            <input
              value={from}
              onChange={(e) => { setFrom(e.target.value); setFromSugs(getSuggestions(e.target.value)); }}
              onBlur={() => setTimeout(() => setFromSugs([]), 200)}
              placeholder="City or stop…"
              className="input pl-9 text-sm"
            />
            {fromSugs.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-50 mt-1 glass-sm rounded-xl overflow-hidden shadow-xl border border-blue-500/20 max-h-48 overflow-y-auto">
                {fromSugs.map((s) => (
                  <li key={s}>
                    <button onMouseDown={() => { setFrom(s); setFromSugs([]); }}
                      className="w-full px-3 py-2 text-sm text-left text-ink hover:bg-blue-500/10 flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-blue-400 shrink-0" />{s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Swap + To */}
        <div className="relative">
          <label className="label mb-1.5 block text-blue-300">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <input
              value={to}
              onChange={(e) => { setTo(e.target.value); setToSugs(getSuggestions(e.target.value)); }}
              onBlur={() => setTimeout(() => setToSugs([]), 200)}
              placeholder="City or stop…"
              className="input pl-9 text-sm"
            />
            {/* Swap button */}
            <button onClick={handleSwap}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-blue-600 border border-blue-400/40 flex items-center justify-center shadow-lg hover:bg-blue-500 transition"
              title="Swap">
              <ArrowRight className="h-3.5 w-3.5 text-white rotate-90 sm:rotate-0" />
            </button>
            {toSugs.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-50 mt-1 glass-sm rounded-xl overflow-hidden shadow-xl border border-blue-500/20 max-h-48 overflow-y-auto">
                {toSugs.map((s) => (
                  <li key={s}>
                    <button onMouseDown={() => { setTo(s); setToSugs([]); }}
                      className="w-full px-3 py-2 text-sm text-left text-ink hover:bg-blue-500/10 flex items-center gap-2">
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
          <label className="label mb-1.5 block text-blue-300">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input pl-9 text-sm" />
          </div>
        </div>
      </div>

      <button
        onClick={() => onSearch(from, to, date)}
        className="mt-5 w-full btn-blue flex items-center justify-center gap-2 py-3.5 text-base font-bold rounded-2xl hover:shadow-glow-blue transition-all duration-300"
      >
        <Search className="h-5 w-5" />
        Find My Bus
      </button>
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Bus; value: string; label: string; color: string }) {
  return (
    <div className="glass flex items-center gap-3 p-4 rounded-2xl border border-white/5">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xl font-extrabold text-ink">{value}</div>
        <div className="text-xs text-muted">{label}</div>
      </div>
    </div>
  );
}

// ─── Feature Cards ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Navigation,
    title: 'Live Route Tracking',
    desc: 'See scheduled routes on an interactive map. Live GPS feeds integrated when available from official sources.',
    tag: 'Scheduled Data Available',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: RouteIcon,
    title: 'Multi-City Planner',
    desc: 'Plan journeys like Delhi → Chandigarh → Mohali → Landran with transfer guidance and timing.',
    tag: 'Real CTU + PRTC Data',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: MapPin,
    title: 'Nearby Stops',
    desc: 'Find bus stops around you using your device location. See routes serving each stop.',
    tag: 'Verified Coordinates',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Zap,
    title: 'Seat Booking',
    desc: 'Partner private operators list vacant seats for your route. Book eligible journeys directly.',
    tag: 'Private Operators',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

// ─── Popular Routes ───────────────────────────────────────────────────────────

function PopularRouteCard({ route }: { route: typeof ROUTES[0] }) {
  const { go } = useStore();
  const tripCount = TRIPS.filter((t) => t.route_id === route.route_id).length;

  return (
    <button
      onClick={() => go({ name: 'routes', routeId: route.route_id })}
      className="glass group p-4 text-left rounded-2xl border border-white/5 hover:border-blue-500/30 hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink truncate">{route.origin.split('(')[0].trim()}</div>
          <div className="text-xs text-muted flex items-center gap-1">
            <ArrowRight className="h-3 w-3 shrink-0" />
            {route.destination.split('(')[0].trim()}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted shrink-0 group-hover:text-blue-400 transition" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        {route.verification_status === 'Verified' && (
          <span className="chip-verified">
            <Shield className="h-3 w-3" /> Verified
          </span>
        )}
        <span className="chip-gray">
          <Bus className="h-3 w-3" /> {tripCount} service{tripCount !== 1 ? 's' : ''}
        </span>
        {route.distance_km && (
          <span className="chip-gray">{route.distance_km} km</span>
        )}
        {route.is_institutional && (
          <span className="chip-warn">
            <AlertTriangle className="h-3 w-3" /> Institutional
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Data Disclaimer ─────────────────────────────────────────────────────────

function DataDisclaimer() {
  return (
    <div className="glass rounded-2xl p-4 border border-amber-500/20 flex gap-3">
      <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
      <div className="text-sm text-muted">
        <span className="font-semibold text-ink">Data Notice: </span>
        Schedule data is sourced from CTU Official Timetable (effective July 25, 2026), PRTC, and verified institutional directories.
        Live GPS tracking is not available for all buses. Institutional buses (CGC University, CGC Landran) are for enrolled students only and are clearly labelled.
        All fares are indicative — confirm with the operator before boarding.
        <a href="https://ctuonline.chd.gov.in" target="_blank" rel="noopener noreferrer"
          className="text-blue-400 hover:underline ml-1 inline-flex items-center gap-1">
          Official CTU Portal <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

export function HomePage() {
  const { go, addRecent, recent } = useStore();
  const [now, setNow] = useState('');

  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (from: string, to: string, date: string) => {
    addRecent(from, to);
    go({ name: 'results', from, to, date });
  };

  const handleMultiCity = (from: string, to: string, date: string) => {
    addRecent(from, to);
    go({ name: 'planner', from, to, date });
  };

  const publicRoutes = ROUTES.filter((r) => !r.is_institutional).slice(0, 6);
  const verifiedCount = ROUTES.filter((r) => r.verification_status === 'Verified').length;

  return (
    <div className="space-y-8">
      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl min-h-[520px] flex flex-col justify-center">
        {/* Background atmosphere */}
        <div className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 40%, #091428 100%)',
          }} />
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
          {/* Animated route lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
            <path d="M0,400 Q200,200 400,300 T800,200" stroke="url(#routeGrad)" strokeWidth="1.5" fill="none" strokeDasharray="8 4" />
            <path d="M0,300 Q300,100 600,250 T1200,150" stroke="url(#routeGrad)" strokeWidth="1" fill="none" strokeDasharray="5 8" opacity="0.5" />
            <circle cx="400" cy="300" r="4" fill="#3B82F6" opacity="0.8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="200" r="3" fill="#818CF8" opacity="0.6">
              <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center p-6 sm:p-10">
          {/* Left — Text + Search */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-300">
                <Activity className="h-3.5 w-3.5" />
                <span>Chandigarh · Mohali · Punjab · Landran</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                <span className="text-white">Your Journey.</span>
                <br />
                <span className="text-gradient-blue">Your Bus.</span>
                <br />
                <span className="text-white">Your City.</span>
              </h1>

              <p className="text-muted text-base sm:text-lg max-w-md leading-relaxed">
                Discover routes, track buses, and find smarter ways to travel across
                Chandigarh, Mohali and Punjab.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <button onClick={() => go({ name: 'planner' })}
                className="btn-blue flex items-center gap-2 px-6 py-3 font-bold rounded-2xl">
                <Navigation className="h-5 w-5" />
                Find My Bus
              </button>
              <button onClick={() => go({ name: 'partner' })}
                className="btn-outline flex items-center gap-2 px-6 py-3 font-bold rounded-2xl">
                Partner With Us
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Live time */}
            <div className="flex items-center gap-2 text-sm text-muted">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>Current Time: <span className="text-ink font-semibold">{now}</span></span>
              <span className="mx-2 opacity-30">|</span>
              <span className="text-blue-300 font-medium">{verifiedCount} verified routes</span>
            </div>
          </div>

          {/* Right — Animated Bus + Floating Cards */}
          <div className="relative hidden lg:block">
            <AnimatedBus />

            {/* Floating info cards */}
            <FloatingCard className="absolute -top-2 right-4 text-xs min-w-[160px]">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 font-semibold">CTU Route 213</span>
              </div>
              <div className="text-muted mt-0.5">Landran → Derabassi</div>
              <div className="text-ink font-bold mt-0.5">Next: 07:00 AM</div>
              <div className="text-[10px] text-muted/70 mt-0.5">⚠️ Demo card — see real data below</div>
            </FloatingCard>

            <FloatingCard className="absolute bottom-8 -left-4 text-xs min-w-[150px]">
              <div className="text-muted">ISBT-43 → Landran</div>
              <div className="text-blue-300 font-bold">₹25 · 26 mins</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">Via Routes 20, 213</div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* ── Quick Search ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted mb-4">Quick Search</h2>
        <HeroSearch onSearch={handleSearch} />
        <div className="mt-3 flex flex-wrap gap-2">
          {['Landran → ISBT-43', 'Chandigarh → Delhi', 'Patiala → Mohali', 'Landran → Derabassi'].map((q) => {
            const [f, t] = q.split(' → ');
            return (
              <button key={q} onClick={() => handleSearch(f, t, new Date().toISOString().split('T')[0])}
                className="chip text-xs hover:border-blue-500/40 hover:text-blue-300 transition">
                {q}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Bus} value={String(TRIPS.filter(t => !t.route_id.startsWith('CGC')).length)} label="Scheduled Services" color="bg-blue-500/15 text-blue-400" />
        <StatCard icon={RouteIcon} value={String(ROUTES.filter(r => !r.is_institutional).length)} label="Public Routes" color="bg-purple-500/15 text-purple-400" />
        <StatCard icon={Shield} value={String(verifiedCount)} label="Verified Routes" color="bg-emerald-500/15 text-emerald-400" />
        <StatCard icon={Star} value="4" label="Agencies (CTU, PRTC…)" color="bg-amber-500/15 text-amber-400" />
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-muted">Platform Features</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title}
              className="glass group p-5 rounded-2xl border border-white/5 hover:border-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-blue">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <div className="font-bold text-ink mb-1.5">{f.title}</div>
              <div className="text-xs text-muted leading-relaxed">{f.desc}</div>
              <div className={`mt-3 text-[10px] font-semibold uppercase tracking-wide ${f.color} opacity-70`}>{f.tag}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Routes ────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Popular Routes</h2>
          <button onClick={() => go({ name: 'routes' })}
            className="text-xs font-semibold text-blue-400 hover:underline">
            View all →
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {publicRoutes.map((r) => <PopularRouteCard key={r.route_id} route={r} />)}
        </div>
      </section>

      {/* ── Recent Searches ───────────────────────────────────────────────────── */}
      {recent.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">Recent Searches</h2>
          <div className="glass rounded-2xl divide-y divide-white/5">
            {recent.map((r) => (
              <button key={r.id}
                onClick={() => go({ name: 'results', from: r.from, to: r.to })}
                className="flex w-full items-center gap-3 p-3.5 text-left hover:bg-white/3 transition rounded-2xl">
                <Clock className="h-4 w-4 shrink-0 text-blue-400" />
                <div className="flex-1 text-sm font-semibold text-ink">
                  {r.from || 'Any'} <ArrowRight className="inline h-3 w-3" /> {r.to || 'Any'}
                </div>
                <ChevronRight className="h-4 w-4 text-muted" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Helplines ─────────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted">Official Helplines</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'CTU Toll-Free', number: '1800-274-7400', note: 'Fleet, smart card, complaints' },
            { name: 'ISBT-43 Enquiry', number: '0172-2624403', note: 'Interstate services (Punjab, HP, J&K)' },
            { name: 'ISBT-17 Enquiry', number: '0172-2700006', note: 'Delhi, Haryana, UP services' },
            { name: 'CTU Booking Portal', number: 'ctuonline.chd.gov.in', note: 'Online bus ticket booking', isLink: true },
            { name: 'PRTC Portal', number: 'pepsurtc.com', note: 'Punjab inter-city booking', isLink: true },
            { name: 'CGC University Transport', number: '+91-94166-48137', note: 'Institutional fleet incharge' },
          ].map((h) => (
            <div key={h.name} className="glass-sm p-4 rounded-2xl flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-ink">{h.name}</div>
                {(h as any).isLink ? (
                  <a href={`https://${h.number}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1">
                    {h.number} <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <a href={`tel:${h.number.replace(/\s/g, '')}`}
                    className="text-xs text-blue-400 hover:underline">{h.number}</a>
                )}
                <div className="text-xs text-muted mt-0.5">{h.note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Data Disclaimer ───────────────────────────────────────────────────── */}
      <DataDisclaimer />
    </div>
  );
}
