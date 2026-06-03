interface PeekMascotProps {
  size?: number;
  className?: string;
  expression?: 'peek' | 'happy' | 'wink';
}

// ---------------------------------------------------------------------------
// Peek mascot — faithful recreation of the real app character
// (BluejayFinance/peek-mobile-4 → assets/images/peek-logo.png + peek-mascot.png):
// a soft coral blob with two big googly eyes. No app-icon frame, no "well".
// ---------------------------------------------------------------------------
export const PeekMascot = ({
  size = 120,
  className = '',
  expression = 'peek'
}: PeekMascotProps) => {
  const uid = `peek-${expression}-${size}`;
  return <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} role="img" aria-label="Peek mascot">
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF9264" />
          <stop offset="55%" stopColor="#FB7A52" />
          <stop offset="100%" stopColor="#F76B45" />
        </linearGradient>
      </defs>

      {/* coral blob body — rounded dome top, soft tapered bottom */}
      <path d="M50 4
        C72 4 87.5 20.5 87.5 45.5
        C87.5 64 81.5 79 70.5 87
        C66 90.3 60 89 56.5 84.6
        C53.8 81.2 47.2 81 44.4 84.4
        C40.6 89 33 90 27.5 85
        C18 76.5 12.5 63 12.5 45.5
        C12.5 20.5 28 4 50 4 Z" fill={`url(#${uid}-body)`} />

      {/* eyes */}
      <g>
        <ellipse cx="38.5" cy="46" rx="12.5" ry="14.5" fill="#FFFFFF" />
        {expression === 'wink' ? <path d="M51 45 q9 7 18 0" stroke="#1B0026" strokeWidth="4.4" strokeLinecap="round" fill="none" /> : <ellipse cx="62" cy="46" rx="12.5" ry="14.5" fill="#FFFFFF" />}

        {/* pupils — looking slightly down + out, peeking */}
        <circle cx="40.5" cy="48.5" r="6.4" fill="#1B0026" />
        <circle cx="42.4" cy="46.4" r="2" fill="#FFFFFF" />
        {expression !== 'wink' && <>
            <circle cx="64" cy="48.5" r="6.4" fill="#1B0026" />
            <circle cx="65.9" cy="46.4" r="2" fill="#FFFFFF" />
          </>}
      </g>

      {/* happy: blush + little smile */}
      {expression === 'happy' && <>
          <ellipse cx="28" cy="64" rx="5.5" ry="3.4" fill="#FF3D6E" opacity="0.45" />
          <ellipse cx="72" cy="64" rx="5.5" ry="3.4" fill="#FF3D6E" opacity="0.45" />
          <path d="M43 66 Q50 73 57 66" stroke="#1B0026" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </>}
    </svg>;
};
