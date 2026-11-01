import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getCases, getMilestones, getNews, getPublications, getLegacy, getEvents } from "@/lib/content";

export const metadata: Metadata = { title: "Search" };

type Hit = { type: string; title: string; snippet: string; href: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim().toLowerCase();
  let hits: Hit[] = [];
  if (term) {
    const [news, pubs, cases, ms, legacy, events] = await Promise.all([getNews(), getPublications(), getCases(), getMilestones(), getLegacy(), getEvents()]);
    const has = (...s: (string | undefined | null)[]) => s.join(" ").toLowerCase().includes(term);
    hits = [
      ...news.filter((n) => has(n.title, n.summary, n.body)).map((n) => ({ type: "News", title: n.title, snippet: n.summary, href: `/news/${n.slug}` })),
      ...pubs.filter((p) => has(p.title, p.authors, p.journal, p.summary)).map((p) => ({ type: "Research", title: p.title, snippet: `${p.authors} ${p.journal}, ${p.year}`, href: `/research?q=${encodeURIComponent(q)}` })),
      ...cases.filter((c) => has(c.title, c.procedure, ...Object.values(c.sections))).map((c) => ({ type: "Case report", title: c.title, snippet: c.procedure, href: `/cases/${c.slug}` })),
      ...ms.filter((m) => has(m.title, m.description, m.people)).map((m) => ({ type: "History", title: `${m.year_label ?? m.year}: ${m.title}`, snippet: m.description, href: "/history" })),
      ...legacy.filter((l) => has(l.name, l.excerpt)).map((l) => ({ type: "Legacy", title: l.name, snippet: l.excerpt, href: "/legacy" })),
      ...events.filter((e) => has(e.title, e.description, e.location)).map((e) => ({ type: "Event", title: e.title, snippet: e.location, href: "/events" })),
    ];
  }
  return (
    <>
      <PageHeader eyebrow="Search" title="Search the platform" intro="News, research, case reports, history, legacy stories and events.">
        <form action="/search" className="mt-8 flex max-w-2xl gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/15">
          <SearchIcon className="ml-3 mt-2.5 h-5 w-5 text-navy-200" />
          <input name="q" defaultValue={q} autoFocus placeholder="e.g. ECMO, cardioplegia, Gibbon" className="min-w-0 flex-1 bg-transparent text-white placeholder:text-navy-300 focus:outline-none" />
          <button className="btn-primary !py-2">Search</button>
        </form>
      </PageHeader>
      <section className="container-x max-w-3xl py-12">
        {term && <p className="mb-6 text-sm text-navy-500">{hits.length} results for &ldquo;{q}&rdquo;</p>}
        <ul className="space-y-3">
          {hits.map((h, i) => (
            <li key={i}><Link href={h.href} className="card block p-5 transition hover:shadow-xl"><span className="chip">{h.type}</span><p className="mt-2 font-display font-semibold">{h.title}</p><p className="mt-1 line-clamp-2 text-sm text-navy-600">{h.snippet}</p></Link></li>
          ))}
        </ul>
      </section>
    </>
  );
}
