import Image from "next/image";
import { Activity, BookOpen, Calendar, Cpu, Globe2, HeartPulse, Megaphone, MapPin, Stethoscope } from "lucide-react";

const ICONS = {
  Tanzania: MapPin, International: Globe2, "Cardiac Surgery": Stethoscope, Technology: Cpu,
  "Training & Conferences": Calendar, Announcements: Megaphone, research: BookOpen, case: HeartPulse, default: Activity,
} as const;

/**
 * Cover image for cards. Uses an uploaded image when present; otherwise an original
 * generated artwork (no stock photography, so no licence questions).
 */
export function CoverArt({
  src, alt, kind = "default", seed = 0, className = "",
}: { src?: string | null; alt: string; kind?: string; seed?: number; className?: string }) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
      </div>
    );
  }
  const Icon = (ICONS as Record<string, typeof Activity>)[kind] ?? ICONS.default;
  const hue = [190, 200, 215, 345, 180, 225][seed % 6];
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `radial-gradient(120% 90% at 10% 0%, hsl(${hue} 85% 45% / .55), transparent 60%), linear-gradient(135deg, #0b1733, #1a3263)` }}
      role="img" aria-label={alt}
    >
      <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full opacity-60 transition duration-700 group-hover:scale-110" preserveAspectRatio="none" aria-hidden="true">
        <path d={`M0 ${120 + (seed % 3) * 10} C 80 60, 160 180, 240 100 S 360 40, 400 90`} fill="none" stroke="#22d3ee" strokeWidth="1.5" className="flow-line" />
        <path d="M0 150 h90 l12 -30 l16 50 l12 -24 h270" fill="none" stroke="#e11d48" strokeWidth="1.5" opacity=".7" />
      </svg>
      <Icon className="absolute bottom-4 right-4 h-10 w-10 text-white/70 transition duration-500 group-hover:scale-110 group-hover:text-teal-300" strokeWidth={1.4} />
    </div>
  );
}
