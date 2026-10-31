import { Check, Clock, CircleDot, MapPin } from 'lucide-react';
import type { StopState } from '@/useTracking';
import type { Bus } from '@/types';

interface Props {
  stops: StopState[];
  currentIndex: number;
  bus: Bus;
}

function toClock(dep: string, offsetMin: number, delayMin: number): string {
  const [h, m] = dep.split(':').map(Number);
  const total = h * 60 + m + offsetMin + delayMin;
  const hh = Math.floor((total / 60) % 24);
  const mm = Math.floor(total % 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function RouteTimeline({ stops, currentIndex, bus }: Props) {
  return (
    <ol className="relative">
      <span
        className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-line/15"
        aria-hidden
      />
      {stops.map((st, i) => {
        const reached = i < currentIndex;
        const current = i === currentIndex;
        const eta = toClock(bus.departureTime, st.stop.arrivalOffsetMin, bus.delayMin);
        const etd = toClock(bus.departureTime, st.stop.departureOffsetMin, bus.delayMin);
        return (
          <li key={st.stop.id} className="relative flex gap-3 pb-5 last:pb-0">
            <div className="relative z-10 shrink-0">
              {reached ? (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ok text-surface shadow-sm ring-4 ring-surface">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              ) : current ? (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-surface shadow-sm ring-4 ring-surface animate-pulse-soft">
                  <CircleDot className="h-4 w-4" strokeWidth={2.6} />
                </span>
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-line/25 bg-surface2 text-muted ring-4 ring-surface">
                  <MapPin className="h-4 w-4" />
                </span>
              )}
            </div>

            <div className={`glass-flat flex-1 p-3 transition ${current ? 'border-gold/30 bg-gold/8' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`font-bold ${current ? 'text-gold' : reached ? 'text-ink' : 'text-ink/80'}`}>
                  {st.stop.name}
                </span>
                {current && (
                  <span className="chip bg-gold text-surface">
                    <span className="h-1.5 w-1.5 rounded-full bg-surface animate-pulse-soft" />
                    Now
                  </span>
                )}
                {reached && (
                  <span className="chip bg-ok/15 text-ok">
                    <Check className="h-3 w-3" /> Reached
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Arr {eta}
                </span>
                <span>Dep {etd}</span>
                {st.stop.distanceKm != null && (
                  <span>{st.stop.distanceKm} km from origin</span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
