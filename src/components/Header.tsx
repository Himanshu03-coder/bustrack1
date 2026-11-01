import { useState } from 'react';
import {
  Menu,
  X,
  Home,
  MapPin,
  Route,
  Navigation,
  Info,
  Settings,
  Bell,
  Palette,
  Check,
  Map,
  Ticket,
  Database,
  ShieldCheck,
  Sun,
  Moon,
  Sliders,
} from 'lucide-react';
import { useStore, type Page } from '@/store';
import { GlassIcon } from './GlassIcon';
import { THEMES } from '@/theme';

const NAV: { label: string; icon: any; page: Page }[] = [
  { label: 'Home',            icon: Home,        page: { name: 'home' }       },
  { label: 'Journey Planner', icon: Navigation,  page: { name: 'planner' }    },
  { label: 'All Buses',       icon: Route,       page: { name: 'results' }    },
  { label: 'Book Seat',       icon: Ticket,      page: { name: 'booking' }    },
  { label: 'Routes',          icon: Map,         page: { name: 'routes' }     },
  { label: 'Nearby Stops',    icon: MapPin,      page: { name: 'nearby' }     },
  { label: 'Data Audit',      icon: Database,    page: { name: 'data-audit' } },
  { label: 'Admin Portal',    icon: ShieldCheck, page: { name: 'admin' }      },
  { label: 'About',           icon: Info,        page: { name: 'about' }      },
];

const MOBILE_NAV = [
  NAV[0], // Home
  NAV[1], // Planner
  NAV[2], // Buses
  NAV[3], // Book Seat
  NAV[7], // Admin
];

function isActive(cur: Page, target: Page): boolean {
  if (cur.name === target.name) return true;
  if (target.name === 'results' && cur.name === 'tracking') return true;
  if (target.name === 'planner' && cur.name === 'planner') return true;
  if (target.name === 'booking' && cur.name === 'booking') return true;
  if (target.name === 'admin' && cur.name === 'admin') return true;
  return false;
}

function ThemeDropdown() {
  const { theme, setTheme } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="nav-item w-full flex items-center justify-between"
        aria-label="Select Theme"
      >
        <span className="flex items-center gap-2.5">
          <Palette className="h-4 w-4" />
          <span className="text-xs font-semibold">Theme ({theme})</span>
        </span>
        <span
          className="h-3.5 w-3.5 rounded-full border border-line"
          style={{ background: THEMES.find((t) => t.id === theme)?.swatch || '#2563EB' }}
        />
      </button>

      {open && (
        <div className="glass-sm absolute left-0 right-0 bottom-full z-50 mb-2 p-1.5 shadow-xl animate-fade-in border border-line">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-ink transition hover:bg-surface"
            >
              <span className="h-3.5 w-3.5 rounded-full border border-line" style={{ background: t.swatch }} />
              <span className="flex-1 text-left">{t.label}</span>
              {theme === t.id && <Check className="h-3.5 w-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 group text-left">
      <div
        className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)' }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
          <path d="M5 3h14a2 2 0 012 2v10a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2zm2 5a1 1 0 100 2h10a1 1 0 100-2H7zm0 3a1 1 0 100 2h7a1 1 0 100-2H7z" />
        </svg>
      </div>
      <div>
        <div className="text-sm font-black text-ink leading-tight tracking-tight flex items-center gap-1.5">
          BUSTRACK
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-accent/15 text-accent">2.0</span>
        </div>
        <div className="text-[10px] text-muted leading-tight font-medium">Smart Insights for a Better Journey</div>
      </div>
    </button>
  );
}

export function Header() {
  const { page, go, theme, toggleTheme, openSetupModal } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-line bg-surface2/95 backdrop-blur-xl lg:flex">
        {/* Top brand */}
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <Logo onClick={() => go({ name: 'home' })} />
        </div>

        {/* Quick Mode & Setup action strip */}
        <div className="p-3 border-b border-line bg-surface/40 flex items-center gap-1.5">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold border border-line bg-surface2 text-ink hover:border-accent transition"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-blue-400" />
                <span className="capitalize">{theme}</span>
              </>
            )}
          </button>

          <button
            onClick={openSetupModal}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold border border-line bg-surface2 text-accent hover:border-accent transition"
            title="Open Website Setup"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Setup</span>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-0.5 px-3 py-3 overflow-y-auto">
          {NAV.map((n) => {
            const active = isActive(page, n.page);
            return (
              <button
                key={n.label}
                onClick={() => go(n.page)}
                className={`nav-item w-full ${active ? 'active' : ''}`}
              >
                <n.icon className="h-4 w-4" />
                <span className="text-xs font-semibold">{n.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-line mt-2">
            <button
              onClick={() => go({ name: 'partner' })}
              className="nav-item w-full text-accent font-bold"
            >
              <span className="h-4 w-4 text-center text-xs">🚀</span>
              <span className="text-xs">Partner With Us</span>
            </button>
          </div>
        </nav>

        {/* Bottom controls */}
        <div className="space-y-1 border-t border-line px-3 py-3">
          <ThemeDropdown />
        </div>

        <div className="px-5 py-3 border-t border-line text-[10px] text-muted flex items-center justify-between">
          <span>© {new Date().getFullYear()} BUSTRACK</span>
          <span className="font-semibold text-accent">CTU · PRTC · CGC</span>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface2/95 backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between px-3">
          <Logo onClick={() => go({ name: 'home' })} />

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="h-8 w-8 rounded-lg flex items-center justify-center border border-line bg-surface text-ink"
              title="Toggle theme"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-blue-400" />
              )}
            </button>

            <button
              onClick={openSetupModal}
              className="h-8 w-8 rounded-lg flex items-center justify-center border border-line bg-surface text-accent"
              title="Website Setup"
            >
              <Sliders className="h-4 w-4" />
            </button>

            <button
              className="h-8 w-8 rounded-lg flex items-center justify-center border border-line bg-surface text-ink"
              onClick={() => setOpen((o) => !o)}
              aria-label="Open menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-line bg-surface2 p-3 space-y-1 animate-fade-in shadow-xl">
            {[...NAV, { label: 'Partner With Us', icon: Navigation, page: { name: 'partner' } as Page }].map((n) => {
              const active = isActive(page, n.page);
              return (
                <button
                  key={n.label}
                  onClick={() => {
                    go(n.page);
                    setOpen(false);
                  }}
                  className={`nav-item w-full ${active ? 'active' : ''}`}
                >
                  <n.icon className="h-4 w-4" />
                  <span className="text-xs font-semibold">{n.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-2 lg:hidden">
        <div className="glass-sm mx-auto flex max-w-md items-stretch justify-around gap-1 p-1.5 shadow-lg">
          {MOBILE_NAV.map((n) => {
            const active = isActive(page, n.page);
            return (
              <button
                key={n.label}
                onClick={() => go(n.page)}
                className="flex flex-1 flex-col items-center gap-0.5 py-1"
                aria-label={n.label}
              >
                <GlassIcon icon={n.icon} size={18} bubbleSize={36} active={active} />
                <span className={`text-[10px] font-semibold ${active ? 'text-accent' : 'text-muted'}`}>
                  {n.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
