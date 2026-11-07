"use client";

import { motion } from "framer-motion";

/** An ECG trace that draws itself across the hero, then a bright pulse keeps running along it. */
export function HeartbeatLine({ className = "" }: { className?: string }) {
  const d =
    "M0 60 H260 l18 -6 14 6 H360 l10 -46 14 92 12 -70 10 24 H560 l18 -6 14 6 H700 l10 -46 14 92 12 -70 10 24 H900 l18 -6 14 6 H1040 l10 -46 14 92 12 -70 10 24 H1440";
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="hb-g" x1="0" x2="1">
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset=".2" stopColor="#22d3ee" stopOpacity=".7" />
          <stop offset=".8" stopColor="#e11d48" stopOpacity=".8" />
          <stop offset="1" stopColor="#e11d48" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={d} fill="none" stroke="url(#hb-g)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" opacity=".45"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
      />
      <path d={d} fill="none" stroke="#fda4af" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" className="ecg-pulse" pathLength={1} />
    </svg>
  );
}
