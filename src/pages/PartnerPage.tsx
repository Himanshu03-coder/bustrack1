import {
  CheckCircle2, Zap, Bus, BarChart3, MapPin, Shield,
  Star, ArrowRight, Phone, Mail, ExternalLink, Building2
} from 'lucide-react';
import { useStore } from '@/store';

const PLANS = [
  {
    name: 'Starter',
    price: '₹999',
    period: '/month',
    color: 'border-blue-500/30',
    badge: null,
    features: [
      'List up to 3 buses',
      'Basic route management',
      'Appear in search results',
      'Standard support (email)',
      'Data verified badge on profile',
    ],
  },
  {
    name: 'Growth',
    price: '₹2,499',
    period: '/month',
    color: 'border-purple-500/40',
    badge: 'Most Popular',
    features: [
      'List up to 15 buses',
      'Seat availability display',
      'Passenger booking requests',
      'Priority search placement',
      'Analytics dashboard (basic)',
      'WhatsApp + email support',
    ],
  },
  {
    name: 'Enterprise',
    price: '₹5,999',
    period: '/month',
    color: 'border-emerald-500/30',
    badge: 'Full Features',
    features: [
      'Unlimited bus listings',
      'Real-time seat booking',
      'GPS tracking integration',
      'Custom route page',
      'Advanced analytics',
      'Dedicated account manager',
      'API access (beta)',
    ],
  },
];

const BENEFITS = [
  { icon: Bus, title: 'List Your Buses', desc: 'Add your fleet routes, stops, departure times, and seat capacity directly.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track views, inquiries, and booking conversions for your listed services.' },
  { icon: MapPin, title: 'Map Placement', desc: 'Your buses appear on route maps alongside official CTU and PRTC services.' },
  { icon: Shield, title: 'Verified Badge', desc: 'Get a verified operator badge after document review and approval.' },
  { icon: Star, title: 'Ratings & Reviews', desc: 'Passengers rate and review your service to build trust and attract bookings.' },
  { icon: Zap, title: 'Seat Booking', desc: 'Accept booking requests from passengers travelling along your routes.' },
];

export function PartnerPage() {
  const { go } = useStore();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 60%, #0f1430 100%)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        </div>
        <div className="relative z-10 p-8 sm:p-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300 mb-5">
            <Building2 className="h-3.5 w-3.5" />
            Operator Subscription Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Grow Your Bus <br />
            <span style={{ background: 'linear-gradient(135deg, #A78BFA, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Business With Us
            </span>
          </h1>
          <p className="text-muted text-lg max-w-xl mb-8">
            List your private buses alongside official CTU and PRTC services.
            Connect with passengers travelling your routes. Grow your bookings.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:partner@bustrack.in"
              className="btn-blue flex items-center gap-2 px-6 py-3 font-bold rounded-2xl text-sm">
              <Mail className="h-4 w-4" />
              Apply to Partner
            </a>
            <button onClick={() => go({ name: 'about' })}
              className="btn-outline flex items-center gap-2 px-6 py-3 font-bold rounded-2xl text-sm">
              Learn More <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section>
        <h2 className="text-xl font-extrabold text-ink mb-6">Why Partner With Us?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="glass p-5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
                <b.icon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="font-bold text-ink mb-1">{b.title}</div>
              <div className="text-sm text-muted">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section>
        <h2 className="text-xl font-extrabold text-ink mb-2">Subscription Plans</h2>
        <p className="text-sm text-muted mb-6">All plans include a 14-day free trial. No credit card required to start.</p>
        <div className="grid gap-5 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={`glass rounded-3xl p-6 border-2 ${plan.color} relative flex flex-col`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500 text-white shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="mb-4">
                <div className="font-bold text-muted text-sm mb-1">{plan.name}</div>
                <div className="text-3xl font-extrabold text-ink">
                  {plan.price}
                  <span className="text-sm font-normal text-muted">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="mailto:partner@bustrack.in?subject=Subscription Inquiry"
                className="btn-blue w-full py-2.5 text-sm font-bold rounded-xl text-center block">
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section className="glass rounded-3xl p-6 border border-amber-500/20">
        <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-400" />
          Operator Eligibility Requirements
        </h2>
        <ul className="space-y-2 text-sm text-muted">
          {[
            'Valid Stage Carriage Permit or Contract Carriage Permit issued by the competent authority',
            'Current fitness certificate for all listed vehicles',
            'Valid third-party insurance for each vehicle',
            'Operator registered under applicable state transport authority',
            'Accurate route, stop, and schedule information provided upfront',
            'Compliance with PRTC Kilometre Scheme rules if applicable',
          ].map((r) => (
            <li key={r} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted/70">
          The platform reserves the right to verify all operator documents before listing. Institutional buses
          (college/university fleets) are listed separately and clearly labelled. Institutional operators are
          not eligible for the public booking tier.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-lg font-bold text-ink mb-4">Get In Touch</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a href="mailto:partner@bustrack.in"
            className="glass p-5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="font-bold text-ink text-sm">Email Us</div>
              <div className="text-blue-400 text-xs">partner@bustrack.in</div>
              <div className="text-muted text-xs mt-0.5">Partnership & subscription queries</div>
            </div>
          </a>
          <a href="tel:+919876543210"
            className="glass p-5 rounded-2xl border border-white/5 hover:border-blue-500/20 transition flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-ink text-sm">Call Us</div>
              <div className="text-emerald-400 text-xs">+91-98765-43210</div>
              <div className="text-muted text-xs mt-0.5">Mon–Sat, 9 AM – 6 PM</div>
            </div>
          </a>
        </div>
        <p className="mt-4 text-xs text-muted/60 text-center">
          * Contact details are illustrative. Update with real operator contact before launch.
        </p>
      </section>
    </div>
  );
}

