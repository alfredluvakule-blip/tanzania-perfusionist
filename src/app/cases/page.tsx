import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CaseCard } from "@/components/Cards";
import { Disclaimer } from "@/components/Disclaimer";
import { Reveal } from "@/components/Reveal";
import { getCases } from "@/lib/content";

export const metadata: Metadata = { title: "Clinical Case Reports" };
export const revalidate = 300;

export default async function CasesPage() {
  const cases = await getCases();
  return (
    <>
      <PageHeader eyebrow="Clinical case reports" title="An educational case library for perfusionists"
        intro="Share and learn from real clinical experience: setup, cannulation, CPB parameters, temperature, cardioplegia, monitoring, challenges and lessons learned.">
        <div className="mt-8"><Link href="/submit?type=case" className="btn-primary">Submit a case report</Link></div>
      </PageHeader>
      <section className="container-x py-14">
        <Disclaimer />
        <div className="mt-6 rounded-2xl bg-white p-5 text-sm text-navy-700 ring-1 ring-navy-100">
          <strong>Before you submit:</strong> remove every patient identifier (names, dates, hospital numbers, images showing faces or records), confirm that patient consent and any required institutional or ethics approval are in place, and get permission for any photograph, diagram or video.
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => <Reveal key={c.id} delay={(i % 3) * 0.05}><CaseCard c={c} /></Reveal>)}
        </div>
      </section>
    </>
  );
}
