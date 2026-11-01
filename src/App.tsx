import { StoreProvider, useStore } from '@/store';
import { Header } from '@/components/Header';
import { WebsiteSetupModal } from '@/components/WebsiteSetupModal';
import { HomePage } from '@/pages/HomePage';
import { ResultsPage } from '@/pages/ResultsPage';
import { TrackingPage } from '@/pages/TrackingPage';
import { RoutesPage } from '@/pages/RoutesPage';
import { NearbyPage } from '@/pages/NearbyPage';
import { AboutPage } from '@/pages/AboutPage';
import { PartnerPage } from '@/pages/PartnerPage';
import { JourneyPlannerPage } from '@/pages/JourneyPlannerPage';
import { BookingPage } from '@/pages/BookingPage';
import { DataAuditPage } from '@/pages/DataAuditPage';
import { AdminPage } from '@/pages/AdminPage';
import { AlertCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';

function Router() {
  const { page } = useStore();
  switch (page.name) {
    case 'home':          return <HomePage />;
    case 'results':       return <ResultsPage />;
    case 'tracking':      return <TrackingPage />;
    case 'routes':        return <RoutesPage />;
    case 'nearby':        return <NearbyPage />;
    case 'about':         return <AboutPage />;
    case 'partner':       return <PartnerPage />;
    case 'planner':       return <JourneyPlannerPage />;
    case 'booking':       return <BookingPage />;
    case 'data-audit':    return <DataAuditPage />;
    case 'admin':         return <AdminPage />;
    default:              return <HomePage />;
  }
}

function SiteAlertBanner() {
  const { siteAlert, setSiteAlert } = useStore();
  if (!siteAlert || !siteAlert.active || !siteAlert.message) return null;

  const bgStyle =
    siteAlert.type === 'warn'
      ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
      : siteAlert.type === 'success'
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
      : 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400';

  const Icon =
    siteAlert.type === 'warn'
      ? AlertTriangle
      : siteAlert.type === 'success'
      ? CheckCircle2
      : AlertCircle;

  return (
    <div className={`mb-6 rounded-2xl border p-3.5 px-4 text-xs font-semibold flex items-center justify-between gap-3 ${bgStyle} animate-fade-in`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{siteAlert.message}</span>
      </div>
      <button
        onClick={() => setSiteAlert({ ...siteAlert, active: false })}
        className="h-6 w-6 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center shrink-0 opacity-70 hover:opacity-100 transition"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Shell() {
  return (
    <div className="min-h-screen bg-surface transition-colors duration-200">
      <Header />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:py-7 lg:pb-12">
          <SiteAlertBanner />
          <Router />
        </div>
      </main>
      <WebsiteSetupModal />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
