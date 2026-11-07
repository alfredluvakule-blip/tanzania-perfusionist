"use client";

import { useEffect } from "react";

/**
 * Site-wide hover spotlight: as the mouse moves over any `.card` (or `[data-glow]`),
 * its position is written to CSS variables that a soft radial highlight follows.
 * One passive listener, rAF-throttled, mouse only.
 */
export function PointerGlow() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      if (!last) return;
      const el = (last.target as Element | null)?.closest?.<HTMLElement>(".card, [data-glow]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${last.clientX - r.left}px`);
      el.style.setProperty("--my", `${last.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => { document.removeEventListener("pointermove", onMove); cancelAnimationFrame(frame); };
  }, []);
  return null;
}
