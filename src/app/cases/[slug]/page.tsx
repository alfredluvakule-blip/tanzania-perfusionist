import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";
import { ShareButtons } from "@/components/ShareButtons";
import { fmtDate } from "@/components/Cards";
import { getCaseBySlug, getCases } from "@/lib/content";
import { CASE_SECTIONS } from "@/lib/types";

export const revalidate = 300;
type P = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return (await getCases()).map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = await getCaseBySlug((await params).slug);
  return c ? { title: c.title } : {};
}

export default async function CasePage({ params }: P) {
  const c = await getCaseBySlug((await params).slug);
  if (!c) notFound();
  return (
    <article className="container-x max-w-5xl pb-10 pt-24">
      <Link href="/cases" className="inline-flex items-center gap-1 text-sm text-teal-700 hover:underline"><ArrowLeft className="h-4 w-4" /> Case library</Link>
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="chip !bg-pulse-500/10 !text-pulse-600">Age group: {c.age_group}</span>
        <span className="chip">{c.procedure}</span>
        {c.is_template && <span className="badge-placeholder">Template</span>}
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{c.title}</h1>
      <p className="mt-3 text-sm text-navy-500">{c.author} · {fmtDate(c.published_at)}</p>
      <div className="mt-6"><Disclaimer /></div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block" aria-label="Case sections">
          <ol className="sticky top-24 space-y-1 border-l border-navy-100 text-sm">
            {CASE_SECTIONS.map(([k, label]) => (
              <li key={k}><a href={`#${k}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-navy-600 hover:border-teal-500 hover:text-navy-900">{label}</a></li>
            ))}
          </ol>
        </nav>
        <div className="space-y-6">
          {CASE_SECTIONS.map(([k, label], i) => (
            <section key={k} id={k} className="card scroll-mt-24 p-6">
              <h2 className="flex items-center gap-3 font-display text-lg font-semibold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-xs text-teal-300">{i + 1}</span>{label}</h2>
              <p className="mt-3 whitespace-pre-line text-navy-700">{c.sections[k] || "Not reported."}</p>
            </section>
          ))}
          <section className="card p-6">
            <h2 className="font-display text-lg font-semibold">References</h2>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-navy-700">{c.references.map((r) => <li key={r}>{r}</li>)}</ol>
          </section>
          <ShareButtons title={c.title} path={`/cases/${c.slug}`} />
        </div>
      </div>
    </article>
  );
}
