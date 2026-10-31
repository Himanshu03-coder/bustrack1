import { BusFront, Clock, Navigation, ArrowRight, Heart } from 'lucide-react';
import type { Bus } from '@/types';
import { routeById } from '@/data';
import { useStore } from '@/store';
import { StatusBadge, CategoryBadge, Stars } from './Badges';
import { GlassIcon } from './GlassIcon';

export function BusCard({ bus }: { bus: Bus }) {
  const { go, favourites, toggleFavourite } = useStore();
  const route = routeById(bus.routeId);
  const fav = favourites.includes(bus.id);

  return (
    <div className="glass p-4 transition hover:shadow-glow sm:p-5 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <GlassIcon icon={BusFront} bubbleSize={44} size={22} active />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-ink">{bus.operator}</span>
              <CategoryBadge category={bus.category} />
            </div>
            <div className="mt-0.5 text-xs font-semibold text-muted">
              {bus.number} · {bus.busType}
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleFavourite(bus.id)}
          className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-glass"
          aria-label={fav ? 'Remove favourite' : 'Add favourite'}
        >
          <Heart className={`h-5 w-5 ${fav ? 'fill-err text-err' : 'fill-none text-current'}`} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 sm:gap-4">
        <div className="flex flex-col">
          <span className="text-lg font-extrabold text-ink">{bus.departureTime}</span>
          <span className="text-xs font-medium text-muted">{route?.origin.split(' (')[0]}</span>
        </div>

        <div className="flex flex-1 flex-col items-center">
          <span className="flex items-center gap-1 text-xs font-semibold text-muted">
            <Clock className="h-3.5 w-3.5" />
            {Math.floor(bus.durationMin / 60)}h {bus.durationMin % 60}m
          </span>
          <div className="relative my-1 h-px w-full bg-line/15">
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gold" />
          </div>
          <span className="text-[11px] text-muted">{bus.stopsCount} stops</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-lg font-extrabold text-ink">{bus.arrivalTime}</span>
          <span className="text-xs font-medium text-muted">{route?.destination.split(' (')[0]}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={bus.status} />
          {bus.delayMin > 0 && (
            <span className="chip text-warn">+{bus.delayMin} min delay</span>
          )}
          <Stars rating={bus.rating} />
          <span className="chip text-silver">₹{bus.fare}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => go({ name: 'routes', routeId: bus.routeId })}
            className="btn-outline px-3 py-2 text-sm"
          >
            Details
          </button>
          <button
            onClick={() => go({ name: 'tracking', tripId: bus.id })}
            className="btn-gold px-3 py-2 text-sm"
          >
            <Navigation className="h-4 w-4" />
            Track
          </button>
        </div>
      </div>
    </div>
  );
}
