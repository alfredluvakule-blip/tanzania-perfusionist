"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HERO_VIDEO } from "@/lib/site";

/**
 * Muted, looping film for the homepage hero. Falls back to the still poster when the
 * visitor prefers reduced motion or has data saver on, and pauses while off screen.
 */
export function HeroVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const update = () => setPlay(!reduce.matches && !saveData);
    update();
    reduce.addEventListener("change", update);
    return () => reduce.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !play) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [play]);

  return (
    <div className={`relative ${className}`}>
      <Image src={HERO_VIDEO.poster} alt={HERO_VIDEO.alt} fill priority sizes="(min-width:1024px) 28rem, 90vw" className="object-cover" />
      {play && (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          poster={HERO_VIDEO.poster}
          autoPlay muted loop playsInline preload="auto"
          aria-label={HERO_VIDEO.alt}
        >
          <source src={HERO_VIDEO.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
