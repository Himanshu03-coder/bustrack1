// BUSTRACK brand mark — geometric "B" with integrated route-pin element.
// Champagne-gold + silver, works on dark and light backgrounds.

interface LogoProps {
  size?: number;
  onClick?: () => void;
  showWord?: boolean;
}

export function Logo({ size = 40, onClick, showWord = true }: LogoProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 group select-none"
      aria-label="BUSTRACK home"
    >
      <span
        className="relative transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
        >
          <defs>
            <linearGradient id="bt-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F0D08A" />
              <stop offset="50%" stopColor="#E0B66B" />
              <stop offset="100%" stopColor="#B8893F" />
            </linearGradient>
            <linearGradient id="bt-silver" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8ECEF" />
              <stop offset="50%" stopColor="#C5C9D0" />
              <stop offset="100%" stopColor="#9498A0" />
            </linearGradient>
          </defs>
          {/* Rounded glass tile */}
          <rect x="1" y="1" width="46" height="46" rx="13" fill="url(#bt-silver)" opacity="0.12" />
          <rect x="1.5" y="1.5" width="45" height="45" rx="12.5" stroke="url(#bt-gold)" strokeWidth="1" opacity="0.5" />
          {/* Geometric B */}
          <path
            d="M15 12 L15 36 L26 36 Q33 36 33 30 Q33 26 29 24.5 Q32 23 32 19 Q32 12 25 12 Z"
            fill="none"
            stroke="url(#bt-gold)"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Route-pin integrated into the B's curve */}
          <circle cx="26" cy="30" r="3.4" fill="url(#bt-gold)" />
          <circle cx="26" cy="30" r="1.3" fill="#090A0D" />
          {/* Road dash through the spine */}
          <line x1="15" y1="24" x2="20" y2="24" stroke="url(#bt-silver)" strokeWidth="1.4" strokeDasharray="2 2" strokeLinecap="round" opacity="0.7" />
        </svg>
      </span>
      {showWord && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-extrabold tracking-[0.16em]" style={{ color: '#F5F5F5' }}>
            BUS<span style={{ color: '#E0B66B' }}>TRACK</span>
          </span>
          <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.32em]" style={{ color: '#C5C9D0' }}>
            Smart Mobility · Seamless Journeys
          </span>
        </span>
      )}
    </button>
  );
}
