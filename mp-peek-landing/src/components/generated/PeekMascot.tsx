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
  return <img src="https://storage.googleapis.com/storage.magicpath.ai/component-assets/412449284668157952/412774233677115392/5dc7dff1d2c328be6abf40c1028fd89b55531b1538623c3d8394c21249dba56f.png" alt="Peek mascot" width={size} height={size} draggable={false} className={className} style={{
    width: size,
    height: size,
    objectFit: 'contain',
    display: 'block',
    userSelect: 'none'
  }} />;
};