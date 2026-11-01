/** Animated "blood-flow" lines: dashed paths drifting through a circuit. CSS-only, honours reduced motion. */
export function FlowLines({ className = "" }: { className?: string }) {
  const paths = [
    "M-50 420 C 200 300, 380 520, 620 380 S 1020 220, 1500 360",
    "M-50 520 C 260 420, 420 640, 700 500 S 1100 360, 1500 480",
    "M-50 300 C 180 200, 460 380, 760 260 S 1160 120, 1500 220",
    "M-50 620 C 300 560, 520 720, 860 600 S 1240 520, 1500 600",
  ];
  return (
    <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fl-a" x1="0" x2="1">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset=".5" stopColor="#22d3ee" stopOpacity=".8" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fl-r" x1="0" x2="1">
          <stop offset="0" stopColor="#e11d48" stopOpacity="0" />
          <stop offset=".5" stopColor="#e11d48" stopOpacity=".7" />
          <stop offset="1" stopColor="#e11d48" stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={i % 2 ? "url(#fl-r)" : "url(#fl-a)"} strokeWidth="1" opacity=".35" />
          <path
            d={d} fill="none" stroke={i % 2 ? "url(#fl-r)" : "url(#fl-a)"} strokeWidth={i % 2 ? 2 : 2.5}
            strokeLinecap="round" className="flow-line" style={{ animationDuration: `${5 + i * 1.3}s` }}
          />
        </g>
      ))}
    </svg>
  );
}
