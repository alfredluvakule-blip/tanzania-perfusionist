"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { THEATRE_PHOTOS } from "@/lib/site";

/**
 * "Inside the theatre": a parallax photo mosaic. A blood-flow line draws itself
 * through the section as you scroll, each column drifts at its own speed, and each
 * photo is revealed with a wipe and settles from a slight zoom.
 */
export function PhotoStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useTransform(scrollYProgress, [0.05, 0.75], [0, 1]);
  const colA = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const colB = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const colC = useTransform(scrollYProgress, [0, 1], [100, -40]);

  const [p0, p1, p2, p3, p4] = THEATRE_PHOTOS;

  return (
    <section ref={ref} className="noise relative overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
      {/* scroll-drawn circuit lines */}
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <motion.path d="M-20 820 C 240 640, 380 980, 640 760 S 980 300, 1180 420 S 1400 260, 1460 160"
          fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" style={{ pathLength: draw }} opacity=".7" />
        <motion.path d="M-20 180 C 260 320, 420 60, 720 220 S 1080 700, 1460 560"
          fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" style={{ pathLength: draw }} opacity=".55" />
        <path d="M-20 820 C 240 640, 380 980, 640 760 S 980 300, 1180 420 S 1400 260, 1460 160" fill="none" stroke="#fecdd3" strokeWidth="1.5" className="flow-line" opacity=".5" />
      </svg>
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-pulse-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="container-x relative">
        <div className="mb-14 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="eyebrow !text-teal-300">Inside the theatre</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Where every heartbeat <span className="text-pulse-400">passes through our hands</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="text-navy-200 lg:pb-2">
            From priming the circuit to charting every minute on bypass: the daily work of Tanzanian perfusionists, in their own photographs.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          <Column y={colA}>
            <Photo p={p0} aspect="aspect-[4/5]" delay={0} />
            <Photo p={p3} aspect="aspect-square" delay={0.1} />
          </Column>
          <Column y={colB} className="pt-10 sm:pt-16">
            <Photo p={p2} aspect="aspect-[4/5]" delay={0.05} />
            <Photo p={p1} aspect="aspect-[5/4]" delay={0.15} className="lg:hidden" />
          </Column>
          <Column y={colC} className="col-span-2 grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-1 lg:flex">
            <Photo p={p1} aspect="aspect-[5/4]" delay={0.1} className="hidden lg:block" />
            <Photo p={p4} aspect="aspect-[3/4]" delay={0.2} className="col-span-2" />
          </Column>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-14 flex justify-center">
          <Link href="/media?category=In%20the%20theatre" className="btn-ghost group">
            See more in the Media Hub <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function Column({ y, className = "", children }: { y: MotionValue<number>; className?: string; children: React.ReactNode }) {
  return <motion.div style={{ y }} className={`flex flex-col gap-3 sm:gap-5 ${className}`}>{children}</motion.div>;
}

function Photo({
  p, aspect, delay, className = "",
}: { p: (typeof THEATRE_PHOTOS)[number]; aspect: string; delay: number; className?: string }) {
  const ease = [0.22, 1, 0.36, 1] as const;
  // The in-view trigger sits on an unclipped wrapper: a fully clipped element can be
  // reported as not intersecting, which would leave the photo hidden forever.
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className={className}>
      <motion.figure
        variants={{
          hidden: { clipPath: "inset(100% 0% 0% 0% round 1.5rem)" },
          show: { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", transition: { duration: 1.1, delay, ease } },
        }}
        className="group relative overflow-hidden rounded-3xl ring-1 ring-white/10"
      >
        <motion.div
          variants={{ hidden: { scale: 1.18 }, show: { scale: 1, transition: { duration: 1.6, delay, ease } } }}
          className={`relative ${aspect}`}
        >
          <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 30vw, 50vw" className="object-cover transition duration-700 group-hover:scale-110" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/0 to-transparent opacity-90" />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-sm font-medium text-white transition duration-500 sm:translate-y-2 sm:group-hover:translate-y-0">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pulse-500" />
          {p.caption}
        </figcaption>
        <span className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-teal-400/0 transition duration-500 group-hover:ring-2 group-hover:ring-teal-400/60" />
      </motion.figure>
    </motion.div>
  );
}
