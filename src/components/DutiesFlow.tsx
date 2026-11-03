"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Bone, HeartPulse, Syringe } from "lucide-react";
import type { DutyArea } from "@/lib/duties";

const ICONS = { cardiac: HeartPulse, oncology: Syringe, orthopaedics: Bone } as const;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Three clinical areas joined by a "circuit" line. The line draws in when it enters the view,
 * then a pulse travels along it, like blood through the bypass circuit.
 */
export function DutiesOverview({ areas, dark = false, linkBase = "" }: { areas: DutyArea[]; dark?: boolean; linkBase?: string }) {
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-[46px] hidden h-[3px] lg:block">
        <div className={`absolute inset-0 rounded-full ${dark ? "bg-white/10" : "bg-navy-100"}`} />
        <motion.div
          className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-pulse-500 via-teal-400 to-teal-500"
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.6, ease }}
        />
        <span className="duty-travel absolute -top-[5px] h-3 w-3 rounded-full bg-white shadow-[0_0_16px_4px_rgba(34,211,238,0.7)]" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {areas.map((a, i) => {
          const Icon = ICONS[a.id];
          const tags = Array.from(new Set(a.duties.map((d) => d.tag)));
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.18, ease }}
            >
              <Link
                href={`${linkBase}#${a.id}`}
                className={`group relative mt-14 flex h-[calc(100%-3.5rem)] flex-col items-center rounded-3xl p-6 pt-0 text-center transition duration-300 hover:-translate-y-1 ${
                  dark ? "bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.08] hover:ring-teal-400/40" : "bg-white shadow-card ring-1 ring-navy-900/5 hover:ring-teal-400/60"
                }`}
              >
                <span className="relative -mt-14 flex h-24 w-24 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-teal-400/20 [animation-duration:2.8s]" />
                  <span className={`relative flex h-24 w-24 items-center justify-center rounded-full ring-4 ${
                    dark ? "bg-navy-900 ring-navy-950" : "bg-navy-950 ring-white"
                  }`}>
                    <Icon className={`h-10 w-10 ${i === 0 ? "animate-beat text-pulse-400" : "text-teal-300"}`} />
                  </span>
                </span>
                <p className={`mt-5 text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-teal-300" : "text-teal-700"}`}>
                  {a.duties.length} {a.duties.length === 1 ? "duty" : "duties"}
                </p>
                <h3 className={`mt-1 font-display text-xl font-semibold ${dark ? "text-white" : "text-navy-900"}`}>{a.title}</h3>
                <p className={`mt-2 text-sm ${dark ? "text-navy-200" : "text-navy-600"}`}>{a.intro}</p>
                <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {tags.map((t, k) => (
                    <motion.li
                      key={t}
                      initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.18 + k * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${dark ? "bg-white/10 text-navy-100" : "bg-navy-50 text-navy-700"}`}
                    >
                      {t}
                    </motion.li>
                  ))}
                </ul>
                <span className={`mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold ${dark ? "text-teal-300" : "text-teal-700"}`}>
                  See the duties <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * A vertical "bloodline" that fills as you scroll through an area's duties.
 * Each duty lights up its node on the line and slides in from alternating sides on large screens.
 */
export function DutyTimeline({ area }: { area: DutyArea }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 65%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const dropTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative">
      {/* spine */}
      <div aria-hidden className="absolute bottom-3 left-[17px] top-3 w-[3px] -translate-x-1/2 lg:left-1/2">
        <div className="absolute inset-0 rounded-full bg-navy-100" />
        <motion.div
          className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-teal-400 via-teal-500 to-pulse-500"
          style={{ scaleY: reduce ? 1 : progress }}
        />
        {!reduce && (
          <motion.span
            className="absolute left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pulse-500 ring-4 ring-pulse-500/25 shadow-[0_0_18px_rgba(225,29,72,0.6)]"
            style={{ top: dropTop }}
          />
        )}
      </div>

      <ol className="space-y-5 lg:space-y-8">
        {area.duties.map((d, i) => {
          const left = i % 2 === 0;
          return (
            <motion.li
              key={i}
              className={`relative grid lg:grid-cols-2 lg:gap-20 ${i > 0 ? "lg:!mt-[-1.5rem]" : ""}`}
              initial="off" whileInView="on" viewport={{ once: true, margin: "-90px" }}
            >
              {/* node on the spine */}
              <motion.span
                aria-hidden
                variants={{ off: { scale: 0.5, backgroundColor: "#d6e1f3", color: "#30559e" }, on: { scale: 1, backgroundColor: "#06b6d4", color: "#060d1f" } }}
                transition={{ duration: 0.45, ease }}
                className="absolute left-[17px] top-5 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-[11px] font-bold ring-4 ring-[var(--bg)] lg:left-1/2"
              >
                {i + 1}
              </motion.span>

              <motion.article
                variants={{ off: { opacity: 0, x: left ? -48 : 48 }, on: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.7, ease }}
                className={`card group ml-12 p-5 transition-shadow duration-300 hover:shadow-glow sm:p-6 lg:ml-0 ${left ? "lg:col-start-1" : "lg:col-start-2"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="bg-gradient-to-r from-teal-600 to-pulse-500 bg-clip-text font-display text-2xl font-semibold text-transparent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="chip">{d.tag}</span>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-navy-800">{d.text}</p>
                {d.sub && (
                  <ul className="mt-3 space-y-1.5">
                    {d.sub.map((s, k) => (
                      <motion.li
                        key={k}
                        variants={{ off: { opacity: 0, x: 12 }, on: { opacity: 1, x: 0 } }}
                        transition={{ delay: 0.25 + k * 0.08, duration: 0.4 }}
                        className="flex gap-2.5 text-sm text-navy-700"
                      >
                        <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-teal-500" />
                        <span><span className="font-semibold text-navy-900">{String.fromCharCode(97 + k)}.</span> {s}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.article>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
