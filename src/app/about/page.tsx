import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Camera, Globe2, HeartPulse, History, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { SWAHILI_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: "About Tanzania Perfusionists: mission, values and editorial standards." };

const PILLARS = [
  { icon: Globe2, t: "Medical news platform", d: "Local and international perfusion news, linked to original sources." },
  { icon: BookOpen, t: "Scientific journal hub", d: "Research summaries that always point to the original publication." },
  { icon: Users, t: "Professional community", d: "Profiles, networking and moderated discussion." },
  { icon: History, t: "Historical archive", d: "The global story of CPB and the documented story of perfusion in Tanzania." },
  { icon: Camera, t: "Multimedia library", d: "Videos, photographs, interviews and teaching material." },
  { icon: HeartPulse, t: "Clinical education", d: "Anonymised case reports for shared learning." },
];

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About Tanzania Perfusionists" title="A trusted digital home for perfusion professionals"
        intro="We connect perfusionists, cardiovascular professionals, students and researchers in Tanzania and beyond, preserve the history of our profession and share current scientific knowledge." />
      <section className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="h-section">Our mission</h2>
            <div className="prose mt-4 max-w-none text-navy-700">
              <p>In Kiswahili we are <em lang="sw">{SWAHILI_NAME}</em>: the specialists who stop and restart the heart.</p>
              <p>Perfusionists run the heart-lung machine that keeps patients alive during cardiac surgery, and increasingly manage ECMO and other extracorporeal therapies. Their work is highly specialised and often invisible.</p>
              <p>Tanzania Perfusionists exists to document the experiences of perfusionists, support learning and research, and strengthen the future of perfusion practice in Tanzania and across Africa.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="card p-8">
            <h3 className="flex items-center gap-2 font-display text-xl font-semibold"><ShieldCheck className="h-6 w-6 text-teal-600" /> Editorial standards</h3>
            <ul className="mt-4 space-y-3 text-sm text-navy-700">
              <li>Scientific articles are linked to their original sources, and references are checked before publication.</li>
              <li>Original research and our own educational summaries are always labelled differently.</li>
              <li>Images and videos are used only with permission or an appropriate licence.</li>
              <li>Personal memories, photographs, interviews and tributes are published only with consent.</li>
              <li>Case reports must be anonymised and submitted with the required institutional approvals and consent.</li>
              <li>Historical milestones for Tanzania are added only once verified; until then they are shown as placeholders.</li>
              <li>Educational content is not individual patient-care instruction.</li>
            </ul>
            <Link href="/guidelines" className="btn-outline mt-6">Read the full policy</Link>
          </Reveal>
        </div>
        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.05} className="card p-6">
              <Icon className="h-7 w-7 text-teal-600" />
              <p className="mt-4 font-display text-lg font-semibold">{t}</p>
              <p className="mt-1 text-sm text-navy-600">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
