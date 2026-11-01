import { useState } from 'react';
import {
  X,
  Sliders,
  Sun,
  Moon,
  Check,
  Bell,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  Bus,
  Layers,
  Palette,
  Eye,
  Key,
} from 'lucide-react';
import { useStore } from '@/store';
import { THEMES, type ThemeName } from '@/theme';

export function WebsiteSetupModal() {
  const {
    isSetupModalOpen,
    closeSetupModal,
    theme,
    setTheme,
    toggleTheme,
    siteAlert,
    setSiteAlert,
    loadDemoData,
    resetRoutes,
    go,
  } = useStore();

  const [alertMessage, setAlertMessage] = useState(siteAlert.message);
  const [alertEnabled, setAlertEnabled] = useState(siteAlert.active);
  const [alertType, setAlertType] = useState<'info' | 'warn' | 'success'>(siteAlert.type);
  const [saveToast, setSaveToast] = useState(false);

  if (!isSetupModalOpen) return null;

  const handleSaveAlert = () => {
    setSiteAlert({
      active: alertEnabled,
      message: alertMessage,
      type: alertType,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const setPresetAlert = (msg: string, type: 'info' | 'warn' | 'success') => {
    setAlertMessage(msg);
    setAlertType(type);
    setAlertEnabled(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-line">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-ink">Website Setup & Control Center</h2>
              <p className="text-xs text-muted">Customize themes, live announcements & transit settings directly from this interface</p>
            </div>
          </div>
          <button
            onClick={closeSetupModal}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition"
            aria-label="Close setup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Mode Toggle */}
        <div className="p-4 rounded-2xl bg-surface border border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'light' ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-400" />
            )}
            <div>
              <div className="text-sm font-bold text-ink">
                Current Display Mode: <span className="capitalize text-accent">{theme}</span>
              </div>
              <div className="text-xs text-muted">Instant 1-click toggle between Light & Dark themes</div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="btn-outline px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2"
          >
            Switch to {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        {/* 1. Theme Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <Palette className="h-4 w-4 text-accent" />
            <span>Theme Options</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {THEMES.map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    active
                      ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent'
                      : 'border-line bg-surface hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="h-5 w-5 rounded-full border border-line/40 shadow-sm"
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

        {/* 2. Global Live Announcement Banner Setup */}
        <div className="space-y-3 p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <Bell className="h-4 w-4 text-amber-500" />
              <span>Live Site Announcement Banner</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink">
              <input
                type="checkbox"
                checked={alertEnabled}
                onChange={(e) => setAlertEnabled(e.target.checked)}
                className="rounded accent-blue-600 h-4 w-4"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              placeholder="Enter announcement text to broadcast to all visitors…"
              className="input text-xs py-2.5"
            />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-muted">Banner Type:</span>
              {(['info', 'warn', 'success'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAlertType(type)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize border ${
                    alertType === type
                      ? 'bg-accent/15 border-accent text-accent'
                      : 'border-line bg-surface2 text-muted'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Presets */}
            <div className="pt-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">
                Quick Presets (Click to apply):
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() =>
                    setPresetAlert(
                      '🏆 Welcome Hackathon Evaluators! Direct routes from Landran to ISBT-43 & Delhi live.',
                      'success'
                    )
                  }
                  className="chip text-[11px] py-0.5 px-2.5 hover:border-accent"
                >
                  Judges Welcome
                </button>
                <button
                  onClick={() =>
                    setPresetAlert(
                      '🌧️ Weather Alert: Route 213 & Route 20 operating with 5-10 min minor rain delays.',
                      'warn'
                    )
                  }
                  className="chip text-[11px] py-0.5 px-2.5 hover:border-accent"
                >
                  Weather / Delay Notice
                </button>
                <button
                  onClick={() =>
                    setPresetAlert(
                      '🎓 CGC Landran University fleet operating on official examination schedule.',
                      'info'
                    )
                  }
                  className="chip text-[11px] py-0.5 px-2.5 hover:border-accent"
                >
                  CGC Exam Schedule
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleSaveAlert}
                className="btn-blue px-4 py-2 text-xs font-bold rounded-xl"
              >
                Apply Announcement Live
              </button>
              {saveToast && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                  <Check className="h-3.5 w-3.5" /> Announcement updated live!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Hackathon Presentation & Quick Controls */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-surface border border-line space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Hackathon Demo Showcase</span>
            </div>
            <p className="text-[11px] text-muted">
              Pre-load search queries, verified connections, and demo active radar.
            </p>
            <button
              onClick={() => {
                loadDemoData();
                closeSetupModal();
                go({ name: 'home' });
              }}
              className="btn-outline w-full py-2 text-xs font-bold rounded-xl text-accent"
            >
              Load Hackathon Showcase
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-line space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <Key className="h-4 w-4 text-emerald-500" />
              <span>Admin Credentials</span>
            </div>
            <div className="text-[11px] text-muted space-y-0.5">
              <div>Email: <strong className="text-ink">admin@bustrack.in</strong></div>
              <div>Secret: <strong className="text-ink">bustrack@2026</strong></div>
            </div>
            <button
              onClick={() => {
                closeSetupModal();
                go({ name: 'admin' });
              }}
              className="btn-ghost w-full py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Open Admin Portal
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (confirm('Reset custom routes and revert to default verified timetable?')) {
                resetRoutes();
                alert('Database reset to official verified timetables.');
              }
            }}
            className="text-muted hover:text-rose-500 transition flex items-center gap-1 text-[11px]"
          >
            <RefreshCw className="h-3 w-3" /> Reset Custom Route Edits
          </button>
          <button
            onClick={closeSetupModal}
            className="btn-blue px-5 py-2 text-xs font-bold rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
