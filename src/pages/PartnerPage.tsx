import { useState } from 'react';
import {
  CheckCircle2, Zap, Bus, BarChart3, MapPin, Shield,
  Star, ArrowRight, Phone, Mail, ExternalLink, Building2,
  X, Check, AlertCircle, Sparkles, Send
} from 'lucide-react';
import { useStore } from '@/store';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  color: string;
  badge: string | null;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Fleet',
    price: '₹999',
    period: '/month',
    color: 'border-blue-500/30',
    badge: null,
    features: [
      'List up to 3 buses',
      'Basic route & stop management',
      'Appear in search & journey planner',
      'Standard support (WhatsApp/Email)',
      'Verified operator badge on profile',
      '14-day free trial included',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Operator',
    price: '₹2,499',
    period: '/month',
    color: 'border-purple-500/40',
    badge: 'Most Popular',
    features: [
      'List up to 15 buses',
      'Vacant seat inventory & passenger booking',
      'Priority search placement on corridors',
      'Operator analytics & earnings breakdown',
      'Dedicated account coordinator',
      'Zero booking commissions in trial',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Fleet',
    price: '₹5,999',
    period: '/month',
    color: 'border-emerald-500/30',
    badge: 'Full Features',
    features: [
      'Unlimited bus & route listings',
      'Real-time automated seat allocation',
      'Live GPS telematics API integration',
      'Custom branded operator profile page',
      'Automated passenger SMS & ticket dispatch',
      'Priority 24/7 technical hotline',
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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[1]); // Default to Growth
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Form inputs
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [busCount, setBusCount] = useState('4');
  const [corridor, setCorridor] = useState('Landran ↔ Chandigarh ISBT-43');
  const [permitType, setPermitType] = useState('Stage Carriage Permit');

  // Contact copy feedback
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleOpenModal = (plan?: Plan) => {
    if (plan) setSelectedPlan(plan);
    setSubmittedAppId(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !phone.trim()) {
      alert('Please fill out all required company & contact details.');
      return;
    }

    const appId = `OP-APP-${Math.floor(10000 + Math.random() * 90000)}`;

    // Store in localStorage for persistence and Admin portal retrieval
    try {
      const existing = JSON.parse(localStorage.getItem('bt_partner_applications') || '[]');
      const newApp = {
        appId,
        companyName,
        contactName,
        phone,
        email: email || `${contactName.toLowerCase().replace(/\s+/g, '')}@operator.in`,
        plan: `${selectedPlan.name} (${selectedPlan.price}${selectedPlan.period})`,
        busCount,
        corridor,
        permitType,
        appliedAt: new Date().toISOString(),
        status: 'Under Document Verification',
      };
      localStorage.setItem('bt_partner_applications', JSON.stringify([newApp, ...existing]));
    } catch {
      // Local storage fallback
    }

    setSubmittedAppId(appId);
  };

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 3000);
    }
  };

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
            Sell eligible vacant seats, connect with daily commuters, and modernize your fleet operations.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleOpenModal(PLANS[1])}
              className="btn-blue flex items-center gap-2 px-6 py-3 font-bold rounded-2xl text-sm shadow-glow-blue cursor-pointer"
            >
              <Building2 className="h-4 w-4" />
              Apply to Partner Now
            </button>
            <button onClick={() => go({ name: 'about' })}
              className="btn-outline flex items-center gap-2 px-6 py-3 font-bold rounded-2xl text-sm">
              Learn Verification Rules <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section>
        <h2 className="text-xl font-extrabold text-ink mb-6">Why Partner With BUSTRACK?</h2>
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
        <h2 className="text-xl font-extrabold text-ink mb-2">Monthly Subscription Plans</h2>
        <p className="text-sm text-muted mb-6">All plans include a 14-day free trial. Choose a plan and complete onboarding instantly.</p>
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
              <button
                onClick={() => handleOpenModal(plan)}
                className="btn-blue w-full py-2.5 text-sm font-bold rounded-xl text-center block shadow-glow-blue cursor-pointer"
              >
                Choose {plan.name} →
              </button>
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
            'Valid Stage Carriage Permit or Contract Carriage Permit issued by Punjab / Chandigarh Transport Authority',
            'Current mechanical fitness certificate for all listed vehicles',
            'Valid commercial third-party passenger insurance for each bus',
            'Driver background verification and commercial heavy-vehicle licence',
            'Clear route stage timetable and transparent passenger fare schedule',
            'Zero tolerance for unauthorized route deviation or surge pricing',
          ].map((r) => (
            <li key={r} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Interactive Contact & Support Options */}
      <section>
        <h2 className="text-lg font-bold text-ink mb-4">Direct Partner Support</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Email Card with 1-click action */}
          <div
            onClick={() => handleOpenModal(PLANS[1])}
            className="glass p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition flex items-center gap-4 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink text-sm flex items-center justify-between">
                <span>Direct Partnership Inquiries</span>
                <span className="text-[11px] text-blue-400 font-semibold group-hover:underline">Open Form →</span>
              </div>
              <div className="text-blue-400 text-xs font-mono">partner@bustrack.in</div>
              <div className="text-muted text-xs mt-0.5">Click to launch application or email us directly</div>
            </div>
          </div>

          {/* Phone Card with Copy & Call */}
          <div
            onClick={() => handleCopy('+911722704005', 'phone')}
            className="glass p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition flex items-center gap-4 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Phone className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink text-sm flex items-center justify-between">
                <span>Helpline & Telematics Desk</span>
                {copiedPhone && <span className="chip-verified text-[10px]">Copied!</span>}
              </div>
              <div className="text-emerald-400 text-xs font-mono font-bold">+91 172 2704005</div>
              <div className="text-muted text-xs mt-0.5">09:00 AM – 07:00 PM IST (Mon–Sat)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OPERATOR ONBOARDING MODAL ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-blue-500/30 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-muted hover:text-ink p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            {submittedAppId ? (
              /* Success screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glow-blue">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-ink">Application Submitted!</h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Your operator enrollment request for <strong>{companyName}</strong> has been received and indexed.
                </p>

                <div className="bg-surface/70 border border-line/15 rounded-2xl p-4 text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted">Application ID:</span>
                    <strong className="text-blue-400 font-mono">{submittedAppId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Selected Tier:</span>
                    <strong className="text-ink">{selectedPlan.name} ({selectedPlan.price})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Assigned Route:</span>
                    <strong className="text-ink">{corridor}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Trial Status:</span>
                    <span className="chip-verified text-[10px]">14-Day Free Trial Active</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted italic">
                  An administrator has been notified. You can review this application inside the Admin Portal under "Operator Approvals".
                </p>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn-blue w-full py-3 rounded-xl text-xs font-bold"
                >
                  Close & Back to Portal
                </button>
              </div>
            ) : (
              /* Application Form */
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 chip-blue text-[10px] uppercase font-bold w-fit mb-2">
                    <Sparkles className="h-3 w-3" /> Fleet Onboarding
                  </div>
                  <h3 className="text-xl font-black text-ink">Register Bus Fleet</h3>
                  <p className="text-muted text-[11px]">
                    Enter your transport agency details to activate vacant-seat listings.
                  </p>
                </div>

                {/* Plan Selector Pills */}
                <div>
                  <label className="text-muted block mb-1 font-semibold">Selected Subscription Plan</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLANS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlan(p)}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          selectedPlan.id === p.id
                            ? 'bg-blue-600/20 border-blue-500 text-ink font-bold shadow-sm'
                            : 'bg-surface/40 border-line/15 text-muted hover:text-ink'
                        }`}
                      >
                        <div className="text-[11px]">{p.name.split(' ')[0]}</div>
                        <div className="text-blue-400 font-mono font-bold text-xs">{p.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted block mb-1 font-medium">Company / Agency Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Star Travels"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface rounded-xl border border-line/20 text-ink focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-muted block mb-1 font-medium">Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manpreet Singh"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface rounded-xl border border-line/20 text-ink focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-muted block mb-1 font-medium">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-surface rounded-xl border border-line/20 text-ink focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-muted block mb-1 font-medium">Fleet Size (Buses)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={busCount}
                      onChange={(e) => setBusCount(e.target.value)}
                      className="w-full px-3 py-2 bg-surface rounded-xl border border-line/20 text-ink focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted block mb-1 font-medium">Primary Operating Corridor</label>
                  <input
                    type="text"
                    placeholder="e.g. Landran ↔ Chandigarh ISBT-43 or Mohali ↔ Delhi"
                    value={corridor}
                    onChange={(e) => setCorridor(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line/20 text-ink focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-muted block mb-1 font-medium">Permit Classification</label>
                  <select
                    value={permitType}
                    onChange={(e) => setPermitType(e.target.value)}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-line/20 text-ink focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Stage Carriage Permit">Stage Carriage Permit (Regular Route)</option>
                    <option value="Contract Carriage Permit">Contract Carriage Permit (Charter/Express)</option>
                    <option value="Campus Educational Shuttle">Campus / Institutional Shuttle</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn-blue w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-glow-blue mt-2 cursor-pointer"
                >
                  <Send className="h-4 w-4" /> Submit Application & Start Free Trial
                </button>

                <p className="text-[10px] text-muted text-center">
                  14-Day zero risk trial • No payment credentials required for submission
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
