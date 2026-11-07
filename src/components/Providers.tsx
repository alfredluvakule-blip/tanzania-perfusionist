"use client";

import { MotionConfig } from "framer-motion";
import { ScrollProgress } from "./ScrollProgress";
import { PointerGlow } from "./PointerGlow";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <PointerGlow />
      {children}
    </MotionConfig>
  );
}
