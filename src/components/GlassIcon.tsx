import type { LucideIcon } from 'lucide-react';

interface GlassIconProps {
  icon: LucideIcon;
  size?: number;
  bubbleSize?: number;
  active?: boolean;
  silver?: boolean;
  className?: string;
}

export function GlassIcon({
  icon: Icon,
  size = 22,
  bubbleSize = 44,
  active = false,
  silver = false,
  className = '',
}: GlassIconProps) {
  return (
    <span
      className={`bubble ${active ? 'active' : silver ? 'silver' : ''} ${className}`}
      style={{ width: bubbleSize, height: bubbleSize }}
    >
      <Icon style={{ width: size, height: size }} strokeWidth={2} />
    </span>
  );
}
