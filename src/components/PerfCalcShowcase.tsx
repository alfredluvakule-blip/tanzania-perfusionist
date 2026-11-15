"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated photo frame for the PerfCalc TZ sections: the team photos
 * cross-fade with a slow zoom and soft lights pulse over the pump's lamps,
 * matching the banner inside the app. Motion stops for visitors who ask
 * for reduced motion.
 */

interface Glow { x: number; y: number; size: number; color: string; delay: number }

const PHOTOS: { src: string; alt: string; caption: string; position: string; glows?: Glow[] }[] = [
  {
    src: "/images/perfcalc/team-1.jpg",
    alt: "Perfusionist in theatre writing on the perfusion chart beside a heart-lung machine",
    caption: "Charting beside the pump",
    position: "50% 70%",
    // Positions are percentages of the 4:3 frame, over the pump's indicator lamps.
    glows: [
      { x: 62.5, y: 18.5, size: 13, color: "#ff5c8a", delay: 0 },
      { x: 77.5, y: 19, size: 13, color: "#4ade80", delay: 0.9 },
      { x: 75, y: 60.5, size: 12, color: "#60a5fa", delay: 0.4 },
      { x: 59, y: 59.5, size: 11, color: "#ff5c8a", delay: 1.3 },
      { x: 73.5, y: 85, size: 16, color: "#fbbf24", delay: 0.7 },
    ],
  },
  {
    src: "/images/perfcalc/team-2.jpg",
    alt: "Two theatre staff arranging fluid bags and lines on a stand",
    caption: "Preparing fluids and lines",
    position: "45% 50%",
  },
  {
    src: "/images/perfcalc/team-3.jpg",
    alt: "Perfusionist checking tubing at the oxygenator and reservoir",
    caption: "Checking the circuit",
    position: "50% 0%",
  },
];

const SLIDE_SECONDS = 6.5;

export function PerfCalcShowcase({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const t = window.setTimeout(() => setSlide((s) => (s + 1) % PHOTOS.length), SLIDE_SECONDS * 1000);
    return () => window.clearTimeout(t);
  }, [slide, reduced, paused]);

  return (
    <figure
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-navy-900 shadow-2xl ring-1 ring-white/15 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {PHOTOS.map((photo, i) => (
        <motion.div
          key={photo.src}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === slide ? 1 : 0 }}
          transition={{ duration: 1 }}
          aria-hidden={i !== slide}
        >
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: photo.position }}
            initial={{ scale: i % 2 === 0 ? 1.03 : 1.13 }}
            animate={reduced ? undefined : { scale: i % 2 === 0 ? 1.13 : 1.03 }}
            transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <Image
              src={photo.src}
              alt={i === slide ? photo.alt : ""}
              fill
              sizes="(min-width: 1024px) 32rem, (min-width: 768px) 24rem, 100vw"
              className="object-cover"
              style={{ objectPosition: photo.position }}
              priority={priority && i === 0}
            />
            {photo.glows?.map((g, n) => (
              <motion.span
                key={n}
                className="absolute rounded-full mix-blend-screen"
                style={{
                  left: `${g.x}%`,
                  top: `${g.y}%`,
                  width: `${g.size}%`,
                  aspectRatio: "1",
                  marginLeft: `-${g.size / 2}%`,
                  marginTop: `-${g.size / 2}%`,
                  background: `radial-gradient(circle, ${g.color} 0%, ${g.color}55 35%, transparent 70%)`,
                  opacity: 0.45,
                }}
                animate={reduced ? undefined : { opacity: [0.15, 0.8, 0.15], scale: [0.8, 1.15, 0.8] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: g.delay }}
              />
            ))}
          </motion.div>
        </motion.div>
      ))}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/80 to-transparent" />

      <motion.figcaption
        key={PHOTOS[slide].caption}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute bottom-3 left-4 text-xs font-medium text-white/90"
      >
        {PHOTOS[slide].caption}
      </motion.figcaption>

      {/* Slide markers: the current one fills as its time runs */}
      <div className="absolute left-4 top-3 flex gap-1.5">
        {PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setSlide(i)}
            aria-label={`Show photo ${i + 1} of ${PHOTOS.length}: ${photo.caption}`}
            aria-current={i === slide}
            className="group flex h-6 items-center focus-visible:outline-none"
          >
            <span className="relative block h-1 w-7 overflow-hidden rounded-full bg-white/30 group-focus-visible:ring-2 group-focus-visible:ring-white">
              {i === slide && (
                <motion.span
                  key={`${slide}-${paused}`}
                  className="absolute inset-0 origin-left rounded-full bg-white"
                  initial={{ scaleX: reduced || paused ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduced || paused ? 0 : SLIDE_SECONDS, ease: "linear" }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </figure>
  );
}
