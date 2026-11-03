import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { DutiesOverview, DutyTimeline } from "@/components/DutiesFlow";
import { DUTY_AREAS, TOTAL_DUTIES } from "@/lib/duties";
import { SWAHILI_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Duties of a Cardiovascular Perfusionist",
  description:
    "What a cardiovascular perfusionist does in cardiac surgery, the cath lab and ICU, oncology (isolated limb perfusion) and orthopaedics (cell salvage).",
};

export default function Duties() {
  return (
    <>
      <PageHeader
        eyebrow="The profession"
        title="Duties of a Cardiovascular Perfusionist"
        intro={`${TOTAL_DUTIES} duties across three clinical areas, from the heart-lung machine and ECMO to isolated limb perfusion and cell salvage.`}
      >
        <p className="mt-3 text-teal-200"><em lang="sw">{SWAHILI_NAME}</em></p>
        <nav aria-label="Clinical areas" className="mt-8 flex flex-wrap gap-2">
          {DUTY_AREAS.map((a) => (
            <a key={a.id} href={`#${a.id}`} className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-teal-500 hover:text-navy-950">
              {a.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      <section className="relative overflow-hidden bg-navy-950 pb-20 pt-4 text-white">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-pulse-500/10 blur-3xl" />
        <div className="container-x relative">
          <DutiesOverview areas={DUTY_AREAS} dark />
        </div>
      </section>

      {DUTY_AREAS.map((a, i) => (
        <section key={a.id} id={a.id} className={`scroll-mt-20 overflow-x-clip py-20 sm:py-24 ${i % 2 ? "bg-white" : ""}`}>
          <div className="container-x">
            <Reveal className="mx-auto mb-12 max-w-3xl text-center">
              <p className="eyebrow">Area {i + 1} of {DUTY_AREAS.length}</p>
              <h2 className="h-section mt-2">{a.title}</h2>
              <p className="mt-3 text-navy-600">{a.intro}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {a.settings.map((s) => <span key={s} className="chip !bg-navy-900 !text-teal-200">{s}</span>)}
              </div>
            </Reveal>
            <DutyTimeline area={a} />
          </div>
        </section>
      ))}

      <section className="container-x pb-24">
        <Reveal className="flex items-start gap-3 rounded-2xl bg-navy-50 p-5 text-sm text-navy-700">
          <Info className="mt-0.5 h-5 w-5 flex-none text-teal-700" />
          <p>The exact scope of practice varies between hospitals and countries, and perfusionists work under local protocols and the direction of the surgical and anaesthesia team.</p>
        </Reveal>
        <Reveal className="relative mt-10 overflow-hidden rounded-3xl bg-navy-950 p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal-500/25 blur-3xl" />
          <h2 className="relative font-display text-2xl font-semibold sm:text-3xl">Thinking about a career in perfusion?</h2>
          <p className="relative mt-3 max-w-2xl text-navy-100">Find courses and fellowships, or share your own experience of the profession with the community.</p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <Link href="/training" className="btn-primary">Training & careers <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/submit?type=legacy" className="btn-ghost">Share your story</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
