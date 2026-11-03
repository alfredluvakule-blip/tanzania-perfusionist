import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PublicationCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { getPublications } from "@/lib/content";
import { RESEARCH_CATEGORIES } from "@/lib/types";

export const metadata: Metadata = { title: "Research & Publications" };
export const revalidate = 300;

type SP = { category?: string; kind?: string; q?: string };

export default async function ResearchPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const all = await getPublications();
  const q = (sp.q ?? "").toLowerCase();
  const items = all
    .filter((p) => !sp.category || p.category === sp.category)
    .filter((p) => !sp.kind || p.content_kind === sp.kind)
    .filter((p) => !q || [p.title, p.authors, p.journal, p.summary].join(" ").toLowerCase().includes(q))
    .sort((a, b) => b.year - a.year);

  const href = (patch: Partial<SP>) => {
    const next = { ...sp, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]);
    return `/research${qs.size ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHeader eyebrow="Research & publications" title="The perfusion research library"
        intro="Journal articles, trials, systematic reviews, case reports, protocols and guidelines. Every publication links to its original source.">
        <form className="mt-8 flex max-w-xl gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/15" action="/research">
          {sp.category && <input type="hidden" name="category" value={sp.category} />}
          <Search className="ml-3 mt-2.5 h-5 w-5 text-navy-200" />
          <input name="q" defaultValue={sp.q} placeholder="Search title, author, journal…" className="min-w-0 flex-1 bg-transparent text-white placeholder:text-navy-300 focus:outline-none" />
          <button className="btn-primary !py-2">Search</button>
        </form>
      </PageHeader>
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">Category</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li><Link href={href({ category: undefined })} className={`block rounded-lg px-3 py-1.5 ${!sp.category ? "bg-navy-900 text-white" : "hover:bg-navy-50"}`}>All categories</Link></li>
              {RESEARCH_CATEGORIES.map((c, i) => (
                <li key={c}><Link href={href({ category: c })} className={`block rounded-lg px-3 py-1.5 ${sp.category === c ? "bg-navy-900 text-white" : "hover:bg-navy-50"}`}>{i + 1}. {c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">Content type</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {[["", "All"], ["original", "Original publications"], ["educational", "Educational summaries"]].map(([k, l]) => (
                <Link key={k} href={href({ kind: k || undefined })} className={`rounded-full px-3 py-1.5 ring-1 ${(sp.kind ?? "") === k ? "bg-teal-500 text-navy-950 ring-teal-500" : "ring-navy-100 hover:ring-teal-400"}`}>{l}</Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-navy-50 p-4 text-xs text-navy-700">
            <strong>How to read this library.</strong> &ldquo;Original publication&rdquo; entries summarise a published paper and link to it; always read the original before applying findings. &ldquo;Educational summary&rdquo; entries are written by our editors for learning.
          </div>
        </aside>
        <div>
          <p className="mb-4 text-sm text-navy-500">{items.length} {items.length === 1 ? "publication" : "publications"}</p>
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((p, i) => <Reveal key={p.id} delay={(i % 2) * 0.05}><PublicationCard p={p} /></Reveal>)}
          </div>
          {items.length === 0 && <p className="text-navy-500">No publications match these filters yet.</p>}
        </div>
      </section>
    </>
  );
}
