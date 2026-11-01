"use client";

import { animate, useInView, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function AnimatedStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    if (inView) animate(mv, value, { duration: 1.6, ease: "easeOut" });
  }, [inView, mv, value]);
  return (
    <div ref={ref}>
      <p className="font-display text-4xl font-semibold text-white sm:text-5xl">
        <motion.span>{rounded}</motion.span>{suffix}
      </p>
      <p className="mt-1 text-sm text-navy-200">{label}</p>
    </div>
  );
}
