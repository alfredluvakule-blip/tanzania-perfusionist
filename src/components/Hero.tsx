"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BookOpen, History, Newspaper, Users } from "lucide-react";
import { FlowLines } from "./FlowLines";
import Image from "next/image";
import { HERO_IMAGE, HERO_VIDEO, SWAHILI_NAME } from "@/lib/site";
import { HeroVideo } from "./HeroVideo";

const CTAS = [
  { href: "/news", label: "Explore Perfusion News", icon: Newspaper, primary: true },
  { href: "/history", label: "Discover Our History", icon: History },
  { href: "/research", label: "Read Research", icon: BookOpen },
  { href: "/community#join", label: "Join the Community", icon: Users },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="noise relative flex min-h-[100svh] items-center lg:min-h-[100svh] overflow-hidden bg-navy-950 pt-20 text-white">
      {/* background: optional uploaded photo/video still, plus gradients and flowing lines */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {/* the same photo, blurred and darkened, as a cinematic backdrop */}
        <Image src={HERO_IMAGE.src} alt="" fill priority sizes="100vw" className="scale-110 object-cover opacity-25 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_40%,rgba(8,145,178,.35),transparent_60%),radial-gradient(50%_50%_at_10%_90%,rgba(225,29,72,.18),transparent_60%)]" />
        <FlowLines className="absolute inset-0 h-full w-full" />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent" />

      <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_1fr]">
        <motion.div style={{ opacity: fade }}>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="eyebrow !text-teal-300">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-pulse-500" /></span>
            The perfusion knowledge network
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-display text-[min(10.5vw,3rem)] font-bold leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl"
          >
            TANZANIA
            <span className="block bg-gradient-to-r from-teal-300 via-teal-400 to-cyan-200 bg-clip-text text-transparent">PERFUSIONISTS</span>
          </motion.h1>
          <motion.p
            lang="sw"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-4 flex items-center gap-3 font-display text-lg font-medium italic text-teal-200 sm:text-2xl"
          >
            <svg viewBox="0 0 48 16" className="h-4 w-12 shrink-0" aria-hidden="true">
              <path d="M0 8h14l3-6 5 12 4-9 3 3h19" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="flow-line" style={{ strokeDasharray: "60 20", animationDuration: "2.4s" }} />
            </svg>
            {SWAHILI_NAME}
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-5 max-w-xl text-lg text-navy-100 sm:text-xl">
            Connecting Perfusionists. Preserving Our History. Advancing Cardiac Care.
          </motion.p>
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.6 } } }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {CTAS.map(({ href, label, icon: Icon, primary }) => (
              <motion.div key={href} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link href={href} className={`${primary ? "btn-primary" : "btn-ghost"} group`}>
                  <Icon className="h-4 w-4" /> {label}
                  {primary && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.figure
          style={{ y: artY }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm lg:max-w-md"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-teal-500/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/15">
            <motion.div style={{ scale: photoScale }} className="relative aspect-[3/4]">
              <HeroVideo className="h-full w-full" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
            <FlowLines className="pointer-events-none absolute inset-0 h-full w-full opacity-50 mix-blend-screen" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-5 text-sm font-medium text-white">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-pulse-500" /></span>
              {HERO_VIDEO.caption}
            </figcaption>
          </div>
          {/* floating accent chip */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
            className="absolute -left-6 top-10 hidden rounded-2xl bg-navy-950/80 px-4 py-3 text-xs text-navy-100 shadow-xl ring-1 ring-white/10 backdrop-blur sm:block"
          >
            <span className="block font-display text-lg font-semibold text-teal-300">Since 1953</span>
            the heart-lung machine
          </motion.div>
        </motion.figure>
      </div>

      <motion.a href="#latest" style={{ opacity: fade }} className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-navy-200 sm:flex">
        Scroll
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/30 pt-1.5">
          <motion.span animate={{ y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-teal-300" />
        </span>
      </motion.a>
    </section>
  );
}
