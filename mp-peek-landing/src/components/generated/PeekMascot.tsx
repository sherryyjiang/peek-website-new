interface PeekMascotProps {
  size?: number;
  className?: string;
  expression?: 'peek' | 'happy' | 'wink';
}
export const PeekMascot = ({
  size = 120,
  className = '',
  expression = 'peek'
}: PeekMascotProps) => {
  return <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className} role="img" aria-label="Peek mascot">
      
      <defs>
        <linearGradient id="peek-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF8A3D" />
          <stop offset="55%" stopColor="#FF6900" />
          <stop offset="100%" stopColor="#FE875C" />
        </linearGradient>
        <linearGradient id="peek-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF7A45" />
          <stop offset="100%" stopColor="#FE5A2E" />
        </linearGradient>
        <clipPath id="peek-clip">
          <rect x="6" y="6" width="108" height="108" rx="30" />
        </clipPath>
      </defs>

      {/* App-icon container */}
      <rect x="6" y="6" width="108" height="108" rx="30" fill="url(#peek-bg)" />

      <g clipPath="url(#peek-clip)">
        {/* dark purple inner well the creature peeks out of */}
        <rect x="6" y="62" width="108" height="58" fill="#37004B" />
        <ellipse cx="60" cy="64" rx="58" ry="12" fill="#2A0138" />

        {/* creature body peeking up */}
        <ellipse cx="60" cy="92" rx="34" ry="33" fill="url(#peek-body)" />

        {/* eyes */}
        <g>
          <ellipse cx="48" cy="78" rx="11" ry="13" fill="#FFFFFF" />
          <ellipse cx="72" cy="78" rx="11" ry="13" fill="#FFFFFF" />
          <circle cx="50" cy="80" r="5.2" fill="#1B0026" />
          {expression === 'wink' ? <rect x="66" y="77" width="12" height="3.4" rx="1.7" fill="#1B0026" /> : <circle cx="70" cy="80" r="5.2" fill="#1B0026" />}
          <circle cx="51.6" cy="78" r="1.7" fill="#FFFFFF" />
          {expression !== 'wink' && <circle cx="71.6" cy="78" r="1.7" fill="#FFFFFF" />}
        </g>

        {/* cheeks + smile for happy */}
        {expression === 'happy' && <>
            <ellipse cx="40" cy="92" rx="5" ry="3.2" fill="#FF3D6E" opacity="0.5" />
            <ellipse cx="80" cy="92" rx="5" ry="3.2" fill="#FF3D6E" opacity="0.5" />
            <path d="M52 92 Q60 100 68 92" stroke="#1B0026" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>}
      </g>
    </svg>;
};