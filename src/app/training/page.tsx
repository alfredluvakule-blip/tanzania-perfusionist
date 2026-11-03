import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { getOpportunities } from "@/lib/content";

export const metadata: Metadata = { title: "Training & Career Opportunities" };
export const revalidate = 300;

export default async function Training() {
  const items = await getOpportunities();
  return (
    <>
      <PageHeader eyebrow="Training & careers" title="Grow your perfusion career"
        intro="Training programmes, courses, fellowships, scholarships and job opportunities for perfusionists and students.">
        <div className="mt-8"><Link href="/submit?type=opportunities" className="btn-primary">Post an opportunity</Link></div>
      </PageHeader>
      <section className="container-x py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((o, i) => (
            <Reveal key={o.id} delay={(i % 3) * 0.05} className="card flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="chip !bg-teal-50 !text-teal-700">{o.kind}</span>
                {o.is_placeholder && <span className="badge-placeholder">Placeholder</span>}
              </div>
              <Briefcase className="mt-4 h-6 w-6 text-navy-400" />
              <h2 className="mt-2 font-display text-lg font-semibold">{o.title}</h2>
              <p className="text-sm text-navy-500">{o.organisation} · {o.location}</p>
              <p className="mt-3 text-sm text-navy-700">{o.description}</p>
              <div className="mt-auto flex items-center justify-between pt-5 text-xs text-navy-500">
                {o.deadline ? <span>Deadline: {new Date(o.deadline).toLocaleDateString("en-GB", { dateStyle: "medium" })}</span> : <span />}
                {o.url && <a href={o.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-teal-700">Details <ExternalLink className="h-3.5 w-3.5" /></a>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
