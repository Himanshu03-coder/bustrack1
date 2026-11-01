import { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  PlusCircle,
  Upload,
  Database,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Bus,
  FileText,
  Key,
  LogOut,
  RefreshCw,
  Sparkles,
  Download,
  Sliders,
  Sun,
  Moon,
  Palette,
  Bell,
  Check,
} from 'lucide-react';
import { useStore } from '@/store';
import { ROUTES, type TransitRoute, type ServiceType, type VerificationStatus } from '@/data/busData';
import { THEMES, type ThemeName } from '@/theme';

export function AdminPage() {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    allRoutes,
    addCustomRoute,
    deleteCustomRoute,
    resetRoutes,
    go,
    theme,
    setTheme,
    toggleTheme,
    siteAlert,
    setSiteAlert,
    loadDemoData,
  } = useStore();

  // Login form state
  const [email, setEmail] = useState('admin@bustrack.in');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin tab state
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'upload' | 'partners' | 'setup'>('manage');

  // Add route form state
  const [routeNumber, setRouteNumber] = useState('');
  const [routeName, setRouteName] = useState('');
  const [operatorName, setOperatorName] = useState('Chandigarh Transport Undertaking');
  const [agency, setAgency] = useState('CTU');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [via, setVia] = useState('');
  const [durationMin, setDurationMin] = useState(45);
  const [distanceKm, setDistanceKm] = useState(25);
  const [serviceType, setServiceType] = useState<ServiceType>('Public CTU');
  const [formSuccess, setFormSuccess] = useState('');

  // Upload state
  const [uploadText, setUploadText] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Setup tab state
  const [alertMsgInput, setAlertMsgInput] = useState(siteAlert.message);
  const [alertActiveInput, setAlertActiveInput] = useState(siteAlert.active);
  const [alertTypeInput, setAlertTypeInput] = useState<'info' | 'warn' | 'success'>(siteAlert.type);
  const [setupSavedToast, setSetupSavedToast] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@bustrack.in' && password === 'bustrack@2026') {
      loginAdmin(password);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin@bustrack.in and bustrack@2026');
    }
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeNumber || !origin || !destination) {
      alert('Please fill route number, origin, and destination.');
      return;
    }

    const newId = `BT-ADM-${Date.now().toString().slice(-5)}`;
    const newRoute: TransitRoute = {
      route_id: newId,
      route_number: routeNumber.trim(),
      route_name: routeName.trim() || `${origin} ↔ ${destination}`,
      operator_name: operatorName,
      operator_id: agency,
      agency: agency,
      origin: origin.trim(),
      destination: destination.trim(),
      via: via.trim() || undefined,
      stops: [
        { stop_id: `${newId}-S01`, stop_name: origin.trim(), coordinates: { lat: 30.7333, lng: 76.7794 }, arrival_offset_min: 0, departure_offset_min: 0 },
        { stop_id: `${newId}-S02`, stop_name: destination.trim(), coordinates: { lat: 30.6941, lng: 76.6657 }, arrival_offset_min: durationMin, departure_offset_min: durationMin },
      ],
      distance_km: distanceKm,
      duration_min: durationMin,
      service_type: serviceType,
      category: serviceType.includes('Private') ? 'Private' : 'Government',
      is_institutional: serviceType === 'Institutional',
      data_source: 'Admin Direct Entry — Verified Dispatch',
      last_verified_at: new Date().toISOString().split('T')[0],
      verification_status: 'Verified',
      notes: `Published via BUSTRACK Admin Console by ${email}.`,
    };

    addCustomRoute(newRoute);
    setFormSuccess(`Route ${routeNumber} successfully registered into active platform database!`);
    setTimeout(() => setFormSuccess(''), 4000);

    // Reset inputs
    setRouteNumber('');
    setRouteName('');
    setOrigin('');
    setDestination('');
    setVia('');
  };

  const handleJSONUpload = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(uploadText);
      const items: TransitRoute[] = Array.isArray(parsed) ? parsed : parsed.routes || [parsed];
      let count = 0;
      for (const item of items) {
        if (item.route_number && item.origin && item.destination) {
          addCustomRoute({
            ...item,
            route_id: item.route_id || `UP-${Date.now()}-${count}`,
            verification_status: item.verification_status || 'Verified',
            data_source: 'Bulk File Upload (Admin)',
            last_verified_at: new Date().toISOString().split('T')[0],
          });
          count++;
        }
      }
      setUploadStatus(`Successfully parsed & imported ${count} transit routes!`);
      setUploadText('');
    } catch (err: any) {
      setUploadStatus(`Error parsing JSON: ${err.message}`);
    }
  };

  const handleSaveSetup = () => {
    setSiteAlert({
      active: alertActiveInput,
      message: alertMsgInput,
      type: alertTypeInput,
    });
    setSetupSavedToast(true);
    setTimeout(() => setSetupSavedToast(false), 2500);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 glass rounded-3xl p-8 border border-line shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent shadow-sm">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-ink">BUSTRACK Admin Console</h1>
          <p className="text-xs text-muted">
            Authorized transport authority portal for schedule updates, theme setup & data uploads.
          </p>
        </div>

        {/* Hackathon credential badge */}
        <div className="bg-accent/10 border border-accent/25 rounded-2xl p-3.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-accent">
            <Key className="h-3.5 w-3.5" /> Hackathon Demo Credentials
          </div>
          <p className="text-muted text-[11px] leading-relaxed">
            Admin ID: <strong className="text-ink">admin@bustrack.in</strong><br />
            Password: <strong className="text-ink">bustrack@2026</strong>
          </p>
        </div>

        {loginError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="label mb-1.5 block">Administrator Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input text-xs"
            />
          </div>

          <div>
            <label className="label mb-1.5 block">Secret Password</label>
            <input
              type="password"
              required
              placeholder="Enter password…"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input text-xs"
            />
          </div>

          <button
            type="submit"
            className="btn-blue w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            <ShieldCheck className="h-4 w-4" /> Sign In to Admin Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip-verified text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Admin Authenticated
            </span>
            <span className="text-xs text-muted font-mono">{email}</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-ink sm:text-3xl tracking-tight">
            Transit Authority Control Console
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Configure website themes, publish live routes, set alerts, and manage datasets in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Reset custom admin changes back to official CTU default dataset?')) {
                resetRoutes();
              }
            }}
            className="btn-ghost text-xs px-3 py-2 rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 text-accent" /> Reset to Default
          </button>
          <button
            onClick={logoutAdmin}
            className="btn-outline text-xs text-red-500 hover:text-red-600 px-3 py-2 rounded-xl flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass rounded-2xl p-4 border border-line">
          <span className="text-xs text-muted font-semibold">Total Live Routes</span>
          <div className="text-2xl font-black text-ink mt-1">{allRoutes.length}</div>
          <span className="text-[10px] text-accent font-semibold">Published & Searchable</span>
        </div>
        <div className="glass rounded-2xl p-4 border border-line">
          <span className="text-xs text-muted font-semibold">Government Fleets</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {allRoutes.filter((r) => r.category === 'Government').length}
          </div>
          <span className="text-[10px] text-muted">CTU & PRTC Carriage</span>
        </div>
        <div className="glass rounded-2xl p-4 border border-line">
          <span className="text-xs text-muted font-semibold">Campus & Private</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {allRoutes.filter((r) => r.category !== 'Government').length}
          </div>
          <span className="text-[10px] text-muted">Empaneled & Shuttles</span>
        </div>
        <div className="glass rounded-2xl p-4 border border-line">
          <span className="text-xs text-muted font-semibold">Active Theme</span>
          <div className="text-2xl font-black text-ink mt-1 capitalize">{theme}</div>
          <span className="text-[10px] text-muted">Switchable Live</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-line gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'manage', label: `Manage Routes (${allRoutes.length})`, icon: Database },
          { id: 'add', label: 'Add New Route', icon: PlusCircle },
          { id: 'upload', label: 'Upload Data (JSON/CSV)', icon: Upload },
          { id: 'setup', label: 'Website Setup & Themes', icon: Sliders },
          { id: 'partners', label: 'Operator Approvals', icon: Bus },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-accent text-white shadow-sm font-bold'
                : 'bg-surface2 text-muted hover:text-ink border border-line'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. MANAGE ROUTES */}
      {activeTab === 'manage' && (
        <div className="glass rounded-3xl p-6 border border-line space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
            <div>
              <h3 className="font-bold text-ink text-base">Active Transit Database</h3>
              <p className="text-xs text-muted">
                Inspect, modify verification status, or remove routes from passenger search.
              </p>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(allRoutes, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `bustrack-live-dataset-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="btn-blue text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Export Current Dataset
            </button>
          </div>

          <div className="divide-y divide-line text-xs">
            {allRoutes.map((r) => (
              <div key={r.route_id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {r.route_number}
                    </span>
                    <strong className="text-ink text-sm">
                      {r.origin} ↔ {r.destination}
                    </strong>
                    <span className="chip-gray text-[10px]">{r.agency}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        r.verification_status === 'Verified' ? 'chip-verified' : 'chip-warn'
                      }`}
                    >
                      {r.verification_status}
                    </span>
                  </div>
                  {r.via && <p className="text-muted text-[11px]">Via: {r.via}</p>}
                  <p className="text-[10px] text-muted">
                    ID: {r.route_id} • Source: {r.data_source} • {r.duration_min} mins
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => go({ name: 'routes', routeId: r.route_id })}
                    className="btn-ghost text-xs px-2.5 py-1.5 rounded-lg"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove route ${r.route_number} (${r.origin} ↔ ${r.destination})?`)) {
                        deleteCustomRoute(r.route_id);
                      }
                    }}
                    className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete route"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ADD ROUTE FORM */}
      {activeTab === 'add' && (
        <form onSubmit={handleAddRoute} className="glass rounded-3xl p-6 sm:p-8 border border-line space-y-6">
          <div>
            <h3 className="font-bold text-ink text-lg">Register New Transit Route</h3>
            <p className="text-xs text-muted">
              Add a new official or private operator service directly to the live search index.
            </p>
          </div>

          {formSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="label mb-1.5 block">Route Number / Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. 213, 20A, or EXP-01"
                value={routeNumber}
                onChange={(e) => setRouteNumber(e.target.value)}
                className="input text-xs"
              />
            </div>

            <div>
              <label className="label mb-1.5 block">Operating Agency *</label>
              <select
                value={agency}
                onChange={(e) => {
                  setAgency(e.target.value);
                  setOperatorName(
                    e.target.value === 'CTU'
                      ? 'Chandigarh Transport Undertaking'
                      : e.target.value === 'PRTC'
                      ? 'PEPSU Road Transport Corporation'
                      : 'Private Fleet Operator'
                  );
                }}
                className="input text-xs"
              >
                <option value="CTU">CTU (Chandigarh Transport Undertaking)</option>
                <option value="PRTC">PRTC / PUNBUS (Punjab Roadways)</option>
                <option value="CGC">CGC University (Institutional)</option>
                <option value="Private">Private Empaneled Charter</option>
              </select>
            </div>

            <div>
              <label className="label mb-1.5 block">Service Classification</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as any)}
                className="input text-xs"
              >
                <option value="Public CTU">Public CTU</option>
                <option value="Public PRTC">Public PRTC</option>
                <option value="Public PUNBUS">Public PUNBUS</option>
                <option value="Institutional">Institutional (Campus Only)</option>
                <option value="Private Charter">Private Charter (Bookable)</option>
              </select>
            </div>

            <div>
              <label className="label mb-1.5 block">Origin Station *</label>
              <input
                type="text"
                required
                placeholder="e.g. Landran Junction"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="input text-xs"
              />
            </div>

            <div>
              <label className="label mb-1.5 block">Destination Station *</label>
              <input
                type="text"
                required
                placeholder="e.g. ISBT Sector 43"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input text-xs"
              />
            </div>

            <div>
              <label className="label mb-1.5 block">Duration (minutes)</label>
              <input
                type="number"
                min={5}
                max={600}
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
                className="input text-xs"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="label mb-1.5 block">Via / Intermediate Stops</label>
              <input
                type="text"
                placeholder="e.g. Sohana, Fortis Chowk, Phase 7, YPS"
                value={via}
                onChange={(e) => setVia(e.target.value)}
                className="input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-blue px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" /> Save & Publish Route to Database
          </button>
        </form>
      )}

      {/* 3. BULK UPLOAD FILE */}
      {activeTab === 'upload' && (
        <form onSubmit={handleJSONUpload} className="glass rounded-3xl p-6 sm:p-8 border border-line space-y-4">
          <div>
            <h3 className="font-bold text-ink text-lg">Bulk Transit Data Ingestion</h3>
            <p className="text-xs text-muted">
              Paste or upload JSON transit records formatted according to the BUSTRACK schema.
            </p>
          </div>

          {uploadStatus && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold ${
                uploadStatus.includes('Error')
                  ? 'bg-red-500/10 border-red-500/30 text-red-500'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {uploadStatus}
            </div>
          )}

          <div>
            <textarea
              rows={8}
              value={uploadText}
              onChange={(e) => setUploadText(e.target.value)}
              placeholder={`[
  {
    "route_number": "EXP-99",
    "origin": "Chandigarh ISBT-17",
    "destination": "Delhi Kashmiri Gate",
    "agency": "PRTC",
    "duration_min": 240,
    "distance_km": 250,
    "service_type": "Public PRTC",
    "via": "Ambala, Karnal, Panipat"
  }
]`}
              className="input font-mono text-xs"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!uploadText.trim()}
              className="btn-blue px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              <Upload className="h-4 w-4" /> Validate & Merge Records
            </button>
            <button
              type="button"
              onClick={() =>
                setUploadText(
                  JSON.stringify(
                    [
                      {
                        route_number: 'ADM-101',
                        origin: 'Landran Light Point',
                        destination: 'Mohali Railway Station',
                        agency: 'CTU',
                        duration_min: 30,
                        distance_km: 12,
                        service_type: 'Public CTU',
                        via: 'Sohana, Sec 68',
                      },
                    ],
                    null,
                    2
                  )
                )
              }
              className="btn-ghost px-4 py-2.5 text-xs rounded-xl"
            >
              Insert Sample JSON
            </button>
          </div>
        </form>
      )}

      {/* 4. WEBSITE SETUP & THEMES TAB */}
      {activeTab === 'setup' && (
        <div className="glass rounded-3xl p-6 sm:p-8 border border-line space-y-6">
          <div>
            <h3 className="font-bold text-ink text-lg">In-App Website Setup & Visuals</h3>
            <p className="text-xs text-muted">
              Configure themes, global emergency banners, and showcase features directly from this portal.
            </p>
          </div>

          {/* Theme Switcher */}
          <div className="space-y-3 p-4 rounded-2xl bg-surface border border-line">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <Palette className="h-4 w-4 text-accent" />
                <span>Active Theme Selection</span>
              </div>
              <button
                onClick={toggleTheme}
                className="btn-outline px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                {theme === 'light' ? <Moon className="h-3.5 w-3.5 text-blue-400" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
                <span>Flip to {theme === 'light' ? 'Dark' : 'Light'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {THEMES.map((t) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      active
                        ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent'
                        : 'border-line bg-surface2 hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="h-5 w-5 rounded-full border border-line shadow-sm"
                        style={{ background: t.swatch }}
                      />
                      {active && <Check className="h-4 w-4 text-accent" />}
                    </div>
                    <div className="text-xs font-bold text-ink">{t.label}</div>
                    <div className="text-[10px] text-muted leading-tight mt-0.5">{t.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Announcement Banner Setup */}
          <div className="space-y-3 p-4 rounded-2xl bg-surface border border-line">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <Bell className="h-4 w-4 text-amber-500" />
                <span>Global Site Announcement Broadcast</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
                <input
                  type="checkbox"
                  checked={alertActiveInput}
                  onChange={(e) => setAlertActiveInput(e.target.checked)}
                  className="rounded accent-blue-600 h-4 w-4"
                />
                <span>Broadcast Enabled</span>
              </label>
            </div>

            <input
              type="text"
              value={alertMsgInput}
              onChange={(e) => setAlertMsgInput(e.target.value)}
              placeholder="Broadcast text displayed at top of website…"
              className="input text-xs"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted">Type:</span>
                {(['info', 'warn', 'success'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setAlertTypeInput(t)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize border ${
                      alertTypeInput === t ? 'bg-accent/15 border-accent text-accent' : 'border-line bg-surface2 text-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {setupSavedToast && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                    <Check className="h-3.5 w-3.5" /> Broadcast updated live!
                  </span>
                )}
                <button
                  onClick={handleSaveSetup}
                  className="btn-blue px-4 py-2 text-xs font-bold rounded-xl shadow-sm"
                >
                  Save & Publish Broadcast
                </button>
              </div>
            </div>
          </div>

          {/* Hackathon Showcase Preload */}
          <div className="p-4 rounded-2xl bg-surface border border-line flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>Preload Hackathon Evaluator Showcase</span>
              </div>
              <p className="text-[11px] text-muted">
                Instantly populate demo searches, Landran to ISBT-43 routes, and live radar previews.
              </p>
            </div>
            <button
              onClick={() => {
                loadDemoData();
                alert('Hackathon Showcase Data Loaded! Redirecting to Home.');
                go({ name: 'home' });
              }}
              className="btn-outline px-4 py-2 text-xs font-bold rounded-xl text-accent"
            >
              Load Showcase Data
            </button>
          </div>
        </div>
      )}

      {/* 5. PARTNER APPROVALS */}
      {activeTab === 'partners' && (
        <div className="glass rounded-3xl p-6 border border-line space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-ink text-base">Private Operator Partner Inquiries</h3>
            <p className="text-muted">
              Review monthly subscription requests submitted from the Partner portal.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                operator: 'Royal Star Express Travels',
                owner: 'Sukhwinder Singh',
                email: 'contact@royalstarbus.com',
                fleet: '6 Buses (Sleeper/Semi-Sleeper)',
                plan: 'Growth Operator (₹2,499/mo)',
                status: 'Verified & Approved',
                corridors: 'Mohali Phase 8 ↔ Delhi Kashmiri Gate',
              },
              {
                operator: 'Tricity City Connect',
                owner: 'Harpreet Kaur',
                email: 'harpreet@tricityconnect.in',
                fleet: '2 Buses (Air-Conditioned Mini)',
                plan: 'Starter Fleet (₹999/mo)',
                status: 'Permit Verification Active',
                corridors: 'Landran Junction ↔ Kharar Bus Stand',
              },
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-2xl bg-surface border border-line space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-ink text-sm">{p.operator}</h4>
                    <p className="text-muted">
                      Owner: {p.owner} ({p.email})
                    </p>
                  </div>
                  <span className="chip-verified text-[10px]">{p.status}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-muted pt-1">
                  <span>Fleet Size: <strong className="text-ink">{p.fleet}</strong></span>
                  <span>Subscription: <strong className="text-accent">{p.plan}</strong></span>
                  <span>Corridor: <strong className="text-ink">{p.corridors}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
