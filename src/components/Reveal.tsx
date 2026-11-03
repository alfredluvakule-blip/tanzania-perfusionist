"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

/** Fade/slide-in on scroll. Respects reduced motion via MotionConfig in the root layout. */
export function Reveal({
  children, delay = 0, y = 24, className, ...rest
}: { delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
