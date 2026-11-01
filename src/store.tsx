import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { RecentSearch, BookingRecord } from './types';
import { useLocalStorage } from './lib';
import { ROUTES, type TransitRoute } from './data/busData';
import { getSavedTheme, applyTheme, type ThemeName } from './theme';

export type Page =
  | { name: 'home' }
  | { name: 'results'; from?: string; to?: string; date?: string; busNumber?: string; operator?: string }
  | { name: 'tracking'; tripId: string }
  | { name: 'routes'; routeId?: string }
  | { name: 'nearby' }
  | { name: 'about' }
  | { name: 'partner' }
  | { name: 'planner'; from?: string; to?: string; date?: string }
  | { name: 'booking'; tripId?: string }
  | { name: 'data-audit' }
  | { name: 'admin' };

export interface SiteAlert {
  active: boolean;
  message: string;
  type: 'info' | 'warn' | 'success';
}

interface Store {
  page: Page;
  go: (p: Page) => void;
  back: () => void;
  recent: RecentSearch[];
  addRecent: (from: string, to: string) => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  bookings: BookingRecord[];
  addBooking: (b: Omit<BookingRecord, 'bookingId' | 'pnr' | 'bookedAt' | 'status'>) => BookingRecord;
  cancelBooking: (pnr: string) => void;
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  allRoutes: TransitRoute[];
  addCustomRoute: (r: TransitRoute) => void;
  deleteCustomRoute: (routeId: string) => void;
  resetRoutes: () => void;
  // Theme & Setup
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
  isSetupModalOpen: boolean;
  openSetupModal: () => void;
  closeSetupModal: () => void;
  siteAlert: SiteAlert;
  setSiteAlert: (a: SiteAlert) => void;
  loadDemoData: () => void;
}

const Ctx = createContext<Store | null>(null);

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>({ name: 'home' });
  const [history, setHistory] = useState<Page[]>([]);
  const [recent, setRecent] = useLocalStorage<RecentSearch[]>('wimb_recent', [
    { id: 'r1', from: 'Landran (CGC)', to: 'Chandigarh ISBT-43', at: Date.now() - 3600000 },
    { id: 'r2', from: 'Kharar Bus Stand', to: 'Chandigarh ISBT-17', at: Date.now() - 7200000 },
  ]);
  const [favourites, setFavourites] = useLocalStorage<string[]>('wimb_fav', ['CTU-R213']);
  const [bookings, setBookings] = useLocalStorage<BookingRecord[]>('wimb_bookings', []);
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>('bt_admin_auth', false);
  const [customRoutes, setCustomRoutes] = useLocalStorage<TransitRoute[]>('bt_custom_routes', []);

  // Theme state
  const [theme, setThemeState] = useState<ThemeName>(() => getSavedTheme());
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Global site alert
  const [siteAlert, setSiteAlert] = useLocalStorage<SiteAlert>('bt_site_alert', {
    active: true,
    message: '🚀 BUSTRACK 2.0 Live — Official CTU Timetables, Multi-City Transfers & CGC Campus Routes Active.',
    type: 'info',
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    applyTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: ThemeName = prev === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return next;
    });
  }, []);

  const openSetupModal = useCallback(() => setIsSetupModalOpen(true), []);
  const closeSetupModal = useCallback(() => setIsSetupModalOpen(false), []);

  const allRoutes = useMemo(() => {
    return [...customRoutes, ...ROUTES];
  }, [customRoutes]);

  const go = useCallback((p: Page) => {
    setPage((cur) => {
      setHistory((h) => [...h, cur].slice(-30));
      return p;
    });
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) { setPage({ name: 'home' }); return h; }
      const prev = h[h.length - 1];
      setPage(prev);
      return h.slice(0, -1);
    });
  }, []);

  const addRecent = useCallback((from: string, to: string) => {
    if (!from.trim() && !to.trim()) return;
    setRecent((rs) => {
      const id = `rs-${Date.now()}`;
      const next = [
        { id, from: from.trim(), to: to.trim(), at: Date.now() },
        ...rs.filter((r) => !(r.from === from.trim() && r.to === to.trim())),
      ].slice(0, 6);
      return next;
    });
  }, [setRecent]);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]);
  }, [setFavourites]);

  const addBooking = useCallback((b: Omit<BookingRecord, 'bookingId' | 'pnr' | 'bookedAt' | 'status'>): BookingRecord => {
    const pnr = `BT-${Math.floor(100000 + Math.random() * 900000)}`;
    const record: BookingRecord = {
      ...b,
      bookingId: `bk-${Date.now()}`,
      pnr,
      bookedAt: Date.now(),
      status: 'Confirmed',
    };
    setBookings((prev) => [record, ...prev]);
    return record;
  }, [setBookings]);

  const cancelBooking = useCallback((pnr: string) => {
    setBookings((prev) =>
      prev.map((item) => (item.pnr === pnr ? { ...item, status: 'Cancelled' as const } : item))
    );
  }, [setBookings]);

  const loginAdmin = useCallback((pwd: string): boolean => {
    if (pwd === 'bustrack@2026') {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, [setIsAdmin]);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
  }, [setIsAdmin]);

  const addCustomRoute = useCallback((r: TransitRoute) => {
    setCustomRoutes((prev) => [r, ...prev.filter((x) => x.route_id !== r.route_id)]);
  }, [setCustomRoutes]);

  const deleteCustomRoute = useCallback((routeId: string) => {
    setCustomRoutes((prev) => prev.filter((x) => x.route_id !== routeId));
  }, [setCustomRoutes]);

  const resetRoutes = useCallback(() => {
    setCustomRoutes([]);
  }, [setCustomRoutes]);

  const loadDemoData = useCallback(() => {
    // Preload sample recent searches
    setRecent([
      { id: 'demo1', from: 'Landran (CGC)', to: 'Chandigarh ISBT-43', at: Date.now() - 1000 },
      { id: 'demo2', from: 'Delhi Kashmere Gate', to: 'Landran (CGC)', at: Date.now() - 2000 },
      { id: 'demo3', from: 'Kharar Bus Stand', to: 'Chandigarh ISBT-17', at: Date.now() - 3000 },
    ]);
    setSiteAlert({
      active: true,
      message: '✨ Hackathon Demo Mode Active — Pre-loaded Landran ⇄ ISBT-43 schedules & live radar.',
      type: 'success',
    });
  }, [setRecent, setSiteAlert]);

  useEffect(() => {
    if (page.name === 'home') setHistory([]);
  }, [page]);

  const value = useMemo<Store>(
    () => ({
      page,
      go,
      back,
      recent,
      addRecent,
      favourites,
      toggleFavourite,
      bookings,
      addBooking,
      cancelBooking,
      isAdmin,
      loginAdmin,
      logoutAdmin,
      allRoutes,
      addCustomRoute,
      deleteCustomRoute,
      resetRoutes,
      theme,
      setTheme,
      toggleTheme,
      isSetupModalOpen,
      openSetupModal,
      closeSetupModal,
      siteAlert,
      setSiteAlert,
      loadDemoData,
    }),
    [
      page,
      go,
      back,
      recent,
      addRecent,
      favourites,
      toggleFavourite,
      bookings,
      addBooking,
      cancelBooking,
      isAdmin,
      loginAdmin,
      logoutAdmin,
      allRoutes,
      addCustomRoute,
      deleteCustomRoute,
      resetRoutes,
      theme,
      setTheme,
      toggleTheme,
      isSetupModalOpen,
      openSetupModal,
      closeSetupModal,
      siteAlert,
      setSiteAlert,
      loadDemoData,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
