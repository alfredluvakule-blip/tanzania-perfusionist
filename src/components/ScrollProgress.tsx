"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A thin "blood-line" across the top of every page that fills as you read. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-teal-400 via-cyan-300 to-pulse-500 shadow-[0_0_12px_rgba(34,211,238,.7)]"
    />
  );
}
