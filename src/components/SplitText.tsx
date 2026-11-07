"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Masked text reveal: each word (or letter) rises out of its own clipping line.
 * The full string stays readable to screen readers as one phrase.
 */
export function SplitText({
  text, by = "word", delay = 0, stagger, className = "", itemClassName = "", inView = false,
}: {
  text: string;
  by?: "word" | "letter";
  delay?: number;
  stagger?: number;
  className?: string;
  itemClassName?: string;
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean;
}) {
  const parts = by === "letter" ? Array.from(text) : text.split(" ");
  const step = stagger ?? (by === "letter" ? 0.035 : 0.06);
  const trigger = inView
    ? { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-40px" } }
    : { initial: "hidden", animate: "show" };

  return (
    <motion.span
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } }}
      className={className}
    >
      <span className="sr-only">{text}</span>
      {parts.map((p, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className={`inline-block will-change-transform ${itemClassName}`}
              variants={{
                hidden: { y: "110%", rotate: by === "letter" ? 6 : 2 },
                show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease } },
              }}
            >
              {p === " " ? " " : p}
            </motion.span>
          </span>
          {by === "word" && i < parts.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
}
