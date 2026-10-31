import { useEffect, useState } from 'react';
import {
  Menu, X, Home, MapPin, Route, Navigation, Info, Settings, Bell, User, Palette, Check, Map, Ticket, Database
} from 'lucide-react';
import { useStore, type Page } from '@/store';
import { useLocalStorage } from '@/lib';
import { GlassIcon } from './GlassIcon';
import { THEMES, applyTheme, type ThemeName } from '@/theme';

const NAV: { label: string; icon: any; page: Page }[] = [
  { label: 'Home',           icon: Home,       page: { name: 'home' }        },
  { label: 'Journey Planner',icon: Navigation, page: { name: 'planner' }     },
  { label: 'All Buses',      icon: Route,      page: { name: 'results' }     },
  { label: 'Book Seat',      icon: Ticket,     page: { name: 'booking' }     },
  { label: 'Routes',         icon: Map,        page: { name: 'routes' }      },
  { label: 'Nearby',         icon: MapPin,     page: { name: 'nearby' }      },
  { label: 'Data Audit',     icon: Database,   page: { name: 'data-audit' }  },
  { label: 'About',          icon: Info,       page: { name: 'about' }       },
];

const MOBILE_NAV = [
  NAV[0], // Home
  NAV[1], // Planner
  NAV[2], // Buses
  NAV[3], // Book Seat
  NAV[5], // Nearby
];

function isActive(cur: Page, target: Page): boolean {
  if (cur.name === target.name) return true;
  if (target.name === 'results' && cur.name === 'tracking') return true;
  if (target.name === 'planner' && cur.name === 'planner') return true;
  if (target.name === 'booking' && cur.name === 'booking') return true;
  return false;
}

function ThemeSelector() {
  const [theme, setTheme] = useLocalStorage<ThemeName>('wimb_theme', 'midnight');
  const [open, setOpen] = useState(false);

  useEffect(() => { applyTheme(theme); }, [theme]);

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="nav-item w-full" aria-label="Theme">
        <Palette className="h-5 w-5" />
        <span className="flex-1 text-left">Theme</span>
      </button>
      {open && (
        <div className="glass-sm absolute left-0 right-0 top-full z-50 mt-2 p-2 animate-fade-in">
          {THEMES.map((t) => (
            <button key={t.id} onClick={() => { setTheme(t.id); setOpen(false); }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-white/5">
              <span className="h-4 w-4 rounded-full border border-line/30" style={{ background: t.swatch }} />
              <span className="flex-1 text-left">{t.label}</span>
              {theme === t.id && <Check className="h-4 w-4 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 group">
      <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
          <path d="M5 3h14a2 2 0 012 2v10a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2zm2 5a1 1 0 100 2h10a1 1 0 100-2H7zm0 3a1 1 0 100 2h7a1 1 0 100-2H7z"/>
        </svg>
      </div>
      <div className="text-left">
        <div className="text-sm font-extrabold text-ink leading-tight tracking-tight">
          BUSTRACK
        </div>
        <div className="text-[10px] text-muted leading-tight">Smart Insights for a Better Journey</div>
      </div>
    </button>
  );
}

export function Header() {
  const { page, go } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-line/10 bg-surface2/80 backdrop-blur-xl lg:flex">
        <div className="px-5 py-5">
          <Logo onClick={() => go({ name: 'home' })} />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map((n) => {
            const active = isActive(page, n.page);
            return (
              <button key={n.label} onClick={() => go(n.page)}
                className={`nav-item w-full ${active ? 'active' : ''}`}>
                <n.icon className="h-5 w-5" />
                {n.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-line/10 mt-2">
            <button onClick={() => go({ name: 'partner' })}
              className="nav-item w-full text-accent font-bold">
              <span className="h-5 w-5 text-center text-sm">🚀</span>
              Partner With Us
            </button>
          </div>
        </nav>
        <div className="space-y-1 border-t border-line/10 px-3 py-3">
          <button className="nav-item w-full"><Bell className="h-5 w-5" />Notifications</button>
          <button className="nav-item w-full"><Settings className="h-5 w-5" />Settings</button>
          <button className="nav-item w-full"><User className="h-5 w-5" />Profile</button>
          <ThemeSelector />
        </div>
        <div className="px-5 py-4 text-[10px] text-muted">
          © {new Date().getFullYear()} BUSTRACK<br />
          <span className="opacity-60">Data: CTU · PRTC · CGC University</span>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-line/10 bg-surface2/80 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Logo onClick={() => go({ name: 'home' })} />
          <button className="bubble silver grid h-10 w-10 place-items-center"
            onClick={() => setOpen((o) => !o)} aria-label="Open menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-line/10 bg-surface2/95 p-3 animate-fade-in">
            {[...NAV, { label: 'Partner', icon: Navigation, page: { name: 'partner' } as Page }].map((n) => {
              const active = isActive(page, n.page);
              return (
                <button key={n.label} onClick={() => { go(n.page); setOpen(false); }}
                  className={`nav-item w-full ${active ? 'active' : ''}`}>
                  <n.icon className="h-5 w-5" />
                  {n.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden">
        <div className="glass-sm mx-auto flex max-w-md items-stretch justify-around gap-1 p-2">
          {MOBILE_NAV.map((n) => {
            const active = isActive(page, n.page);
            return (
              <button key={n.label} onClick={() => go(n.page)}
                className="flex flex-1 flex-col items-center gap-1 py-1" aria-label={n.label}>
                <GlassIcon icon={n.icon} size={20} bubbleSize={40} active={active} />
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
