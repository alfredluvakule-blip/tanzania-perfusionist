"use client";

import { motion } from "framer-motion";

/**
 * Stylised heart-lung machine illustration: roller pump heads, oxygenator,
 * reservoir and arterial/venous lines with animated flow. Original artwork.
 */
export function HeartLungMachine({ className = "" }: { className?: string }) {
  const pumps = [120, 220, 320];
  return (
    <svg viewBox="0 0 520 440" className={className} role="img" aria-label="Illustration of a heart-lung machine with blood flowing through its circuit">
      <defs>
        <linearGradient id="hl-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a3263" />
          <stop offset="1" stopColor="#0b1733" />
        </linearGradient>
        <linearGradient id="hl-oxy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#be123c" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
        <filter id="hl-glow"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>

      {/* console */}
      <rect x="60" y="220" width="360" height="170" rx="18" fill="url(#hl-body)" stroke="#30559e" />
      <rect x="80" y="400" width="320" height="10" rx="5" fill="#122449" />
      {/* monitor */}
      <rect x="300" y="40" width="170" height="110" rx="12" fill="#060d1f" stroke="#30559e" />
      <path d="M312 110h22l8-18 12 34 9-22 8 6h22l7-10 10 10h30" fill="none" stroke="#22d3ee" strokeWidth="2" className="flow-line" style={{ strokeDasharray: "180 40", animationDuration: "3s" }} />
      <text x="314" y="66" fill="#67e8f9" fontSize="12" fontFamily="monospace">FLOW 4.6 L/min</text>
      <text x="314" y="84" fill="#fca5a5" fontSize="12" fontFamily="monospace">MAP  65 mmHg</text>
      <line x1="385" y1="150" x2="385" y2="220" stroke="#30559e" strokeWidth="6" />

      {/* reservoir + oxygenator mast */}
      <line x1="130" y1="40" x2="130" y2="220" stroke="#30559e" strokeWidth="6" />
      <rect x="96" y="56" width="68" height="70" rx="10" fill="#122449" stroke="#4f74bb" />
      <motion.rect
        x="100" width="60" rx="7" fill="url(#hl-oxy)" opacity=".85"
        initial={{ y: 92, height: 30 }} animate={{ y: [92, 86, 92], height: [30, 36, 30] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <text x="106" y="72" fill="#adc3e7" fontSize="9" fontFamily="sans-serif">RESERVOIR</text>
      <rect x="104" y="140" width="52" height="64" rx="26" fill="#122449" stroke="#22d3ee" />
      <g stroke="#22d3ee" strokeOpacity=".5">
        {[152, 162, 172, 182, 192].map((y) => <line key={y} x1="112" x2="148" y1={y} y2={y} />)}
      </g>
      <text x="164" y="176" fill="#adc3e7" fontSize="9" fontFamily="sans-serif">OXYGENATOR</text>

      {/* roller pump heads */}
      {pumps.map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="300" r="40" fill="#060d1f" stroke="#4f74bb" strokeWidth="2" />
          <motion.g
            style={{ originX: `${cx}px`, originY: "300px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: i === 0 ? 2.2 : 3.4, repeat: Infinity, ease: "linear" }}
          >
            <line x1={cx - 28} y1="300" x2={cx + 28} y2="300" stroke="#7d9dd4" strokeWidth="5" strokeLinecap="round" />
            <circle cx={cx - 28} cy="300" r="7" fill="#22d3ee" />
            <circle cx={cx + 28} cy="300" r="7" fill="#22d3ee" />
          </motion.g>
          <circle cx={cx} cy="300" r="6" fill="#adc3e7" />
          <text x={cx} y="362" textAnchor="middle" fill="#7d9dd4" fontSize="10" fontFamily="sans-serif">
            {["ARTERIAL", "CARDIOPLEGIA", "SUCTION"][i]}
          </text>
        </g>
      ))}

      {/* circuit lines */}
      <path id="arterial" d="M156 172 C 230 172, 230 120, 300 160 S 480 200, 500 260" fill="none" stroke="#e11d48" strokeWidth="5" strokeLinecap="round" opacity=".9" />
      <path d="M156 172 C 230 172, 230 120, 300 160 S 480 200, 500 260" fill="none" stroke="#fecdd3" strokeWidth="2" className="flow-line" />
      <path d="M20 260 C 40 200, 60 120, 96 100" fill="none" stroke="#9f1239" strokeWidth="5" strokeLinecap="round" opacity=".8" />
      <path d="M20 260 C 40 200, 60 120, 96 100" fill="none" stroke="#fca5a5" strokeWidth="2" className="flow-line" style={{ animationDuration: "7s" }} />
      <path d="M130 126 L130 140" stroke="#e11d48" strokeWidth="5" />

      {/* glow */}
      <circle cx="130" cy="172" r="36" fill="#22d3ee" opacity=".12" filter="url(#hl-glow)" />
    </svg>
  );
}
