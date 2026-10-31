import { ArrowRightLeft, Search, MapPin, Navigation as NavIcon } from 'lucide-react';
import { useState } from 'react';
import { ALL_CITIES } from '@/data';

interface Props {
  onSearch: (from: string, to: string) => void;
  onSwap?: () => void;
  initialFrom?: string;
  initialTo?: string;
  compact?: boolean;
}

export function SearchCard({ onSearch, onSwap, initialFrom = '', initialTo = '', compact = false }: Props) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  const swap = () => {
    setFrom(to);
    setTo(from);
    onSwap?.();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(from.trim(), to.trim());
  };

  return (
    <form onSubmit={submit} className={`glass ${compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-end">
        <div>
          <label className="label mb-1.5 block">From</label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
            <input
              list="cities"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Starting point"
              className="input pl-10"
              autoComplete="off"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={swap}
          className="hidden sm:grid sm:place-items-center"
          aria-label="Swap locations"
        >
          <span className="bubble silver grid h-10 w-10 place-items-center active:rotate-180">
            <ArrowRightLeft className="h-5 w-5" />
          </span>
        </button>

        <div>
          <label className="label mb-1.5 block">To</label>
          <div className="relative">
            <NavIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" />
            <input
              list="cities"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Destination"
              className="input pl-10"
              autoComplete="off"
            />
          </div>
        </div>

        <button type="submit" className="btn-gold h-[46px] w-full px-6 sm:w-auto">
          <Search className="h-5 w-5" />
          Search Buses
        </button>
      </div>

      <button
        type="button"
        onClick={swap}
        className="btn-ghost mt-3 w-full py-2 text-sm sm:hidden"
      >
        <ArrowRightLeft className="h-4 w-4" />
        Swap locations
      </button>

      <datalist id="cities">
        {ALL_CITIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </form>
  );
}
