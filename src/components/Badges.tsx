import type { RunningStatus } from '@/types';

const MAP: Record<RunningStatus, { cls: string; dot: string }> = {
  Running: { cls: 'text-ok', dot: 'bg-ok' },
  Delayed: { cls: 'text-warn', dot: 'bg-warn' },
  'Not Started': { cls: 'text-muted', dot: 'bg-muted/60' },
  'Approaching Stop': { cls: 'text-gold', dot: 'bg-gold' },
  Completed: { cls: 'text-silver', dot: 'bg-silver/70' },
};

export function StatusBadge({ status, className = '' }: { status: RunningStatus; className?: string }) {
  const m = MAP[status];
  return (
    <span className={`chip ${m.cls} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot} ${status === 'Running' || status === 'Approaching Stop' ? 'animate-pulse-soft' : ''}`} />
      {status}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const gov = category === 'Government';
  return (
    <span className={`chip ${gov ? 'text-gold' : 'text-silver'}`}>
      {gov ? 'Government' : 'Private'}
    </span>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-silver">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-gold text-gold">
        <path d="M12 2l2.9 6.1 6.8.9-5 4.7 1.3 6.7L12 17.8 5.9 20.4l1.3-6.7-5-4.7 6.8-.9z" />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}

