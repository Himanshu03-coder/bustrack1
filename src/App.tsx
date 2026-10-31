import { StoreProvider, useStore } from '@/store';
import { Header } from '@/components/Header';
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
import { useEffect } from 'react';
import { applyTheme } from '@/theme';

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
    default:              return <HomePage />;
  }
}

function Shell() {
  useEffect(() => {
    applyTheme('midnight');
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-12">
          <Router />
        </div>
      </main>
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
