/** Brand mark: a heart whose circulation loop runs through a roller-pump head (heart-lung machine). */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lg-heart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      <path
        d="M24 41s-14-8.6-14-19.2C10 16.3 14 13 18.3 13c2.6 0 4.6 1.3 5.7 3.2C25.1 14.3 27.1 13 29.7 13 34 13 38 16.3 38 21.8 38 32.4 24 41 24 41Z"
        fill="none" stroke="url(#lg-heart)" strokeWidth="3" strokeLinejoin="round"
      />
      <path d="M6 24h8l3-6 4 12 3-6h4" fill="none" stroke="#e11d48" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="35" cy="27" r="6.5" fill="#0b1733" stroke="#22d3ee" strokeWidth="2" />
      <g className="origin-[35px_27px] animate-spin-slow motion-reduce:animate-none">
        <circle cx="35" cy="22.5" r="1.6" fill="#22d3ee" />
        <circle cx="35" cy="31.5" r="1.6" fill="#22d3ee" />
      </g>
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-none">
        <span className={`block font-display text-[15px] font-bold tracking-[0.14em] ${light ? "text-white" : "text-navy-900"}`}>
          TANZANIA
        </span>
        <span className="block text-[10.5px] font-semibold tracking-[0.32em] text-teal-500">PERFUSIONIST</span>
      </span>
    </span>
  );
}
