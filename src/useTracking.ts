import { useCallback, useEffect, useRef, useState } from 'react';
import type { Bus, Route, Stop, StopState } from '@/types';
import { routeById, busById } from '@/data';

export type TrackPhase = 'idle' | 'running' | 'paused' | 'completed';

export type { StopState };

export interface SimState {
  phase: TrackPhase;
  /** seconds elapsed since journey start */
  elapsed: number;
  /** journey progress 0..1 */
  progress: number;
  /** index of current stop in route.stops */
  currentIndex: number;
  /** next stop index (currentIndex+1) or undefined if last reached */
  nextIndex: number | undefined;
  /** current position [lat,lng] */
  position: [number, number];
  /** last updated timestamp */
  lastUpdated: number;
  /** estimated delay in minutes */
  delayMin: number;
  /** bus status derived from sim */
  status: 'Running' | 'Delayed' | 'Not Started' | 'Approaching Stop' | 'Completed';
}

export function useTracking(busId: string) {
  const bus: Bus | undefined = busById(busId);
  const route: Route | undefined = bus ? routeById(bus.routeId) : undefined;

  const initialIndex = computeInitialIndex(bus);
  const [phase, setPhase] = useState<TrackPhase>('idle');
  const [elapsed, setElapsed] = useState<number>(
    route ? route.stops[initialIndex].arrivalOffsetMin * 60 : 0,
  );
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const [, force] = useState(0);

  const total = route ? route.stops[route.stops.length - 1].arrivalOffsetMin * 60 : 1;

  const progress = Math.min(1, elapsed / total);
  const currentIndex = computeIndexFromElapsed(route, elapsed);
  const nextIndex =
    currentIndex < (route?.stops.length ?? 0) - 1 ? currentIndex + 1 : undefined;

  const position = computePosition(route, elapsed);
  const delayMin = (bus?.delayMin ?? 0);

  const recompute = useCallback(() => {
    force((n) => n + 1);
    setLastUpdated(Date.now());
  }, []);

  const tick = useCallback(
    (ts: number) => {
      if (!lastTickRef.current) lastTickRef.current = ts;
      const dt = (ts - lastTickRef.current) / 1000;
      lastTickRef.current = ts;

      setElapsed((e) => {
        const ne = e + dt * 60; // 60x speed for demo (1 real sec = 1 min journey)
        if (ne >= total) {
          return total;
        }
        return ne;
      });

      setLastUpdated(Date.now());
      rafRef.current = requestAnimationFrame(tick);
    },
    [total],
  );

  // loop
  useEffect(() => {
    if (phase !== 'running') return;
    lastTickRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, tick]);

  // detect completion
  useEffect(() => {
    if (elapsed >= total && phase === 'running') {
      setPhase('completed');
    }
  }, [elapsed, total, phase]);

  const start = useCallback(() => {
    if (!route) return;
    setElapsed(route.stops[initialIndex].arrivalOffsetMin * 60);
    setPhase('running');
    setLastUpdated(Date.now());
  }, [route, initialIndex]);

  const resume = useCallback(() => {
    if (elapsed >= total) return;
    setPhase('running');
  }, [elapsed, total]);

  const pause = useCallback(() => setPhase('paused'), []);
  const reset = useCallback(() => {
    setPhase('idle');
    setElapsed(route ? route.stops[initialIndex].arrivalOffsetMin * 60 : 0);
    setLastUpdated(Date.now());
  }, [route, initialIndex]);

  const refresh = useCallback(() => {
    recompute();
  }, [recompute]);

  const status: SimState['status'] =
    phase === 'idle'
      ? 'Not Started'
      : phase === 'completed'
        ? 'Completed'
        : delayMin > 10
          ? 'Delayed'
          : nextIndex !== undefined && progress > 0.92
            ? 'Approaching Stop'
            : 'Running';

  const stops: StopState[] = route
    ? route.stops.map((s, i) => {
        const reached = i < currentIndex;
        const current = i === currentIndex && phase !== 'completed' && phase !== 'idle'
          ? true
          : i === currentIndex && (phase === 'completed' || phase === 'idle')
            ? i === 0 && phase === 'idle' ? false : false
            : false;
        return {
          stop: s,
          status: reached ? 'reached' : current ? 'current' : 'upcoming',
          reachedAt: reached ? toClock(bus?.departureTime ?? '00:00', s.arrivalOffsetMin, delayMin) : undefined,
        };
      })
    : [];

  const sim: SimState = {
    phase,
    elapsed,
    progress,
    currentIndex,
    nextIndex,
    position,
    lastUpdated,
    delayMin,
    status,
  };

  return { bus, route, sim, stops, start, resume, pause, reset, refresh };
}

function computeInitialIndex(bus?: Bus): number {
  if (!bus) return 0;
  switch (bus.status) {
    case 'Running':
      return 3;
    case 'Delayed':
      return 2;
    case 'Approaching Stop':
      return 4;
    case 'Completed':
      return -1; // handled below
    case 'Not Started':
    default:
      return 0;
  }
}

function computeIndexFromElapsed(route: Route | undefined, elapsed: number): number {
  if (!route) return 0;
  const stops = route.stops;
  if (elapsed >= stops[stops.length - 1].arrivalOffsetMin * 60) return stops.length - 1;
  for (let i = stops.length - 1; i >= 0; i--) {
    if (elapsed >= stops[i].arrivalOffsetMin * 60) return i;
  }
  return 0;
}

function computePosition(route: Route | undefined, elapsed: number): [number, number] {
  if (!route) return [0, 0];
  const stops = route.stops;
  let i = 0;
  for (let j = stops.length - 1; j >= 0; j--) {
    if (elapsed >= stops[j].arrivalOffsetMin * 60) {
      i = j;
      break;
    }
  }
  const a = stops[i];
  const b = stops[Math.min(i + 1, stops.length - 1)];
  if (i === stops.length - 1 || a === b) return [a.lat, a.lng];
  const segStart = a.departureOffsetMin * 60;
  const segEnd = b.arrivalOffsetMin * 60;
  const t = Math.min(
    1,
    Math.max(0, (elapsed - segStart) / Math.max(1, segEnd - segStart)),
  );
  return [a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t];
}

function toClock(dep: string, offsetMin: number, delayMin: number): string {
  const [h, m] = dep.split(':').map(Number);
  const total = h * 60 + m + offsetMin + delayMin;
  const hh = Math.floor((total / 60) % 24);
  const mm = Math.floor(total % 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
