import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Building2,
  MapPin,
  Lock,
} from 'lucide-react';
import { useStore } from '@/store';
import { HELPLINE_LIST, ROUTES, TRIPS, FARE_TABLE, PRIVATE_OPERATORS } from '@/data/busData';

export function AboutPage() {
  const { go } = useStore();

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="glass rounded-3xl p-8 sm:p-10 border border-blue-500/20 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 chip-blue text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" /> University Hackathon Project
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            BUSTRACK
          </h1>
          <p className="mt-2 text-xl font-medium text-gradient-blue">
            Smart Insights for a Better Journey
          </p>
          <p className="mt-4 text-silver text-sm sm:text-base leading-relaxed">
            A next-generation public transit discovery and vacant-seat booking platform engineered for
            Chandigarh Tricity, Mohali, Landran, and Punjab regional corridors. Built with unwavering commitment
            to data authenticity, transparency, and commuter empowerment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => go({ name: 'planner' })}
              className="btn-blue px-5 py-2.5 text-sm rounded-xl flex items-center gap-2 shadow-glow-blue"
            >
              Multi-City Journey Planner <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => go({ name: 'data-audit' })}
              className="btn-ghost px-4 py-2.5 text-sm rounded-xl flex items-center gap-2"
            >
              <Database className="h-4 w-4" /> View Data Audit & Validation
            </button>
          </div>
        </div>
      </section>

      {/* Dataset Statistics */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
          Verified Transit Intelligence Matrix
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Routes', value: ROUTES.length, sub: 'CTU, PRTC & Institutional' },
            { label: 'Timetable Trips', value: TRIPS.length, sub: 'Scheduled Dep/Arr' },
            { label: 'Fare Corridors', value: FARE_TABLE.length, sub: 'Stage-wise pricing' },
            { label: 'Private Operators', value: PRIVATE_OPERATORS.length, sub: 'Empaneled fleets' },
          ].map((item, idx) => (
            <div key={idx} className="glass rounded-2xl p-4 border border-line/15">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{item.value}</div>
              <div className="text-sm font-semibold text-ink mt-1">{item.label}</div>
              <div className="text-xs text-muted mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles & Integrity Rules */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Data Integrity & Verification Principles</h2>
          <p className="text-sm text-muted">
            How we protect passengers from fabricated timetables, fake GPS feeds, and misleading bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" /> Strict Source Attribution
            </div>
            <p className="text-xs text-silver leading-relaxed">
              Every route, stop, timetable, and fare entry maintains full provenance. CTU routes cite the official
              July 25, 2026 depot timetable; PRTC entries cite the PEPSU fare stage matrix; institutional services cite
              the CGC Landran academic transport directorate.
            </p>
          </div>

          <div className="glass rounded-2xl p-5 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="h-4 w-4" /> Zero GPS Simulation
            </div>
            <p className="text-xs text-silver leading-relaxed">
              We never fabricate simulated bus movements or present them as real GPS fixes. When genuine telematics
              are disconnected, services are transparently labelled as <strong>"Scheduled Only"</strong>.
            </p>
          </div>

          <div className="glass rounded-2xl p-5 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Building2 className="h-4 w-4" /> Institutional Transit Isolation
            </div>
            <p className="text-xs text-silver leading-relaxed">
              College and university buses (e.g., CGC University Landran routes R01–R12) are explicitly segregated
              from public transit. They carry distinct amber warning banners stating they are restricted to enrolled
              students and staff.
            </p>
          </div>

          <div className="glass rounded-2xl p-5 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Lock className="h-4 w-4" /> Transparent Pricing & Fares
            </div>
            <p className="text-xs text-silver leading-relaxed">
              If an official fare stage is missing or unverified, we display <strong>"Not available"</strong> rather than
              guessing or fabricating a price. Verified fares adhere strictly to the Punjab/CTU ₹5 rounding rule.
            </p>
          </div>
        </div>
      </section>

      {/* Authoritative Transit Sources */}
      <section className="glass rounded-2xl p-6 border border-line/20 space-y-4">
        <h3 className="text-base font-bold text-ink flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-400" /> Primary Transport Authority Datasets
        </h3>
        <div className="divide-y divide-line/10 text-xs">
          <div className="py-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-ink">Chandigarh Transport Undertaking (CTU)</p>
              <p className="text-muted">Depot II, III, IV Official Public Timetable (effective July 25, 2026)</p>
            </div>
            <a
              href="https://ctuonline.chd.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              ctuonline.chd.gov.in <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="py-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-ink">PEPSU Road Transport Corporation (PRTC / PUNBUS)</p>
              <p className="text-muted">Interstate Stage Carriage Fare Tables & Corridors (Patiala, Delhi, Bathinda)</p>
            </div>
            <a
              href="https://pepsurtc.com"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              pepsurtc.com <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="py-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-ink">CGC University Landran Transport Directorate</p>
              <p className="text-muted">Academic Session 2025–26 / 2026–27 Fleet Routes R01 through R12</p>
            </div>
            <span className="chip-warn text-[10px]">Institutional Campus Access Only</span>
          </div>
        </div>
      </section>

      {/* Official Helplines */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-blue-400" /> Official Passenger Helplines & Assistance
          </h2>
          <p className="text-sm text-muted">Direct contact numbers for transport control rooms and emergencies.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HELPLINE_LIST.map((h, i) => (
            <div key={i} className="glass rounded-xl p-4 border border-line/15 space-y-1">
              <span className="chip-blue text-[10px] font-semibold">{h.agency}</span>
              <p className="text-sm font-bold text-ink mt-1">{h.purpose}</p>
              <a
                href={`tel:${h.number.replace(/\s+/g, '')}`}
                className="text-sm font-mono font-bold text-blue-400 hover:underline block pt-1"
              >
                {h.number}
              </a>
              {h.timings && <p className="text-[10px] text-muted">Operating: {h.timings}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
