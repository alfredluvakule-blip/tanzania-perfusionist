import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { LegacyCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { getLegacy } from "@/lib/content";

export const metadata: Metadata = { title: "Perfusionist Memories & Legacy" };
export const revalidate = 300;

export default async function Legacy() {
  const stories = await getLegacy();
  return (
    <>
      <PageHeader eyebrow="Perfusionist memories & legacy" title="Preserving the people and stories of our profession"
        intro="Profiles of Tanzanian perfusionists, their journeys and milestones, interviews, photographs from training and surgical camps, and tributes to retired and late colleagues.">
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/submit?type=legacy" className="btn-primary">Submit a story or photos</Link>
          <Link href="/guidelines#consent" className="btn-ghost">How we handle consent</Link>
        </div>
      </PageHeader>
      <section className="container-x py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((s, i) => <Reveal key={s.id} delay={(i % 4) * 0.06}><LegacyCard s={s} i={i} /></Reveal>)}
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            { icon: Mic, t: "Interviews & oral history", d: "Recorded with the speaker's written consent, and reviewed by them before publication." },
            { icon: Camera, t: "Photographs", d: "Training, surgical camps, conferences and events. People shown must agree to publication." },
            { icon: Sparkles, t: "Tributes", d: "For late colleagues, published only with authorisation from their family." },
          ].map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.05} className="card p-6"><Icon className="h-6 w-6 text-teal-600" /><p className="mt-3 font-semibold">{t}</p><p className="mt-1 text-sm text-navy-600">{d}</p></Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex items-start gap-3 rounded-2xl bg-teal-50 p-5 text-sm text-teal-900">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          Every submission is reviewed by an editor and is published only after permission for personal photographs, interviews or memorial content has been recorded.
        </Reveal>
      </section>
    </>
  );
}
