import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { RecentSearch, BookingRecord } from './types';
import { useLocalStorage } from './lib';

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
  | { name: 'data-audit' };

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
  const [recent, setRecent] = useLocalStorage<RecentSearch[]>('wimb_recent', []);
  const [favourites, setFavourites] = useLocalStorage<string[]>('wimb_fav', []);
  const [bookings, setBookings] = useLocalStorage<BookingRecord[]>('wimb_bookings', []);

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
    }),
    [page, go, back, recent, addRecent, favourites, toggleFavourite, bookings, addBooking, cancelBooking],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
