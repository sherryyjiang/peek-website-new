interface PeekMascotProps {
  size?: number;
  className?: string;
  // kept for API compatibility; the official mark is a single fixed asset
  expression?: 'peek' | 'happy' | 'wink';
}

// ---------------------------------------------------------------------------
// Peek mascot — the official brand asset, not a recreation.
// Source of truth: BluejayFinance/peek-mobile-4 → assets/images/peek-logo.png
// (copied into this component's /assets and rewritten to a stable URL on sync).
// ---------------------------------------------------------------------------
export const PeekMascot = ({
  size = 120,
  className = ''
}: PeekMascotProps) => {
  return <img src="../../../assets/peek-logo.png" alt="Peek mascot" width={size} height={size} draggable={false} className={className} style={{
    width: size,
    height: size,
    objectFit: 'contain',
    display: 'block',
    userSelect: 'none'
  }} />;
};
