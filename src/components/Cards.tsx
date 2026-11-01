import Link from "next/link";
import { ArrowUpRight, ExternalLink, User } from "lucide-react";
import type { CaseReport, LegacyStory, NewsArticle, Publication } from "@/lib/types";
import { CoverArt } from "./CoverArt";
import { ShareButtons } from "./ShareButtons";

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function NewsCard({ a, i = 0, featured = false }: { a: NewsArticle; i?: number; featured?: boolean }) {
  return (
    <article className={`card group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl ${featured ? "lg:col-span-2 lg:flex-row" : ""}`}>
      <CoverArt src={a.image_url} alt="" kind={a.category} seed={i} className={featured ? "aspect-[16/9] lg:aspect-auto lg:w-1/2" : "aspect-[16/9]"} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="chip !bg-teal-50 !text-teal-700">{a.category}</span>
          {a.is_sample && <span className="badge-placeholder">Sample</span>}
        </div>
        <h3 className={`mt-3 font-display font-semibold text-navy-900 ${featured ? "text-2xl" : "text-lg"}`}>
          <Link href={`/news/${a.slug}`} className="after:absolute after:inset-0 focus:outline-none">{a.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-navy-600">{a.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-navy-500">
          <span>{a.author} · <time dateTime={a.published_at}>{fmtDate(a.published_at)}</time></span>
          <span className="inline-flex items-center gap-1 font-semibold text-teal-600">Read more <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
        </div>
      </div>
    </article>
  );
}

export function PublicationCard({ p }: { p: Publication }) {
  const link = p.doi ? `https://doi.org/${p.doi}` : p.url;
  return (
    <article className="card group flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`chip ${p.content_kind === "original" ? "!bg-navy-900 !text-white" : "!bg-amber-100 !text-amber-800"}`}>
          {p.content_kind === "original" ? "Original publication" : "Educational summary"}
        </span>
        <span className="chip">{p.publication_type}</span>
        {p.open_access && <span className="chip !bg-teal-50 !text-teal-700">Open access</span>}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-navy-900">{p.title}</h3>
      <p className="mt-2 text-sm text-navy-600">{p.authors}</p>
      <p className="text-sm italic text-navy-500">{p.journal}, {p.year}</p>
      <p className="mt-4 text-sm text-navy-700">{p.summary}</p>
      {p.key_findings.length > 0 && (
        <div className="mt-4 rounded-xl bg-navy-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Main findings</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-navy-700">
            {p.key_findings.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <span className="text-xs text-teal-700">{p.category}</span>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="btn-outline !px-4 !py-2 !text-xs">
            Read original article <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      {p.doi && <p className="mt-2 text-[11px] text-navy-400">DOI: {p.doi}</p>}
    </article>
  );
}

export function LegacyCard({ s, i = 0 }: { s: LegacyStory; i?: number }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-navy-900 text-white ring-1 ring-white/10">
      <CoverArt src={s.image_url} alt="" kind="case" seed={i + 2} className="aspect-[4/5] opacity-70 transition group-hover:opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="flex gap-2">
          <span className="chip !bg-white/10 !text-teal-200">{s.kind}</span>
          {s.is_placeholder && <span className="badge-placeholder">Placeholder</span>}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold">{s.name}</h3>
        <p className="text-sm text-teal-200">{s.role}</p>
        <p className="mt-2 line-clamp-3 text-sm text-navy-100 opacity-90">{s.excerpt}</p>
      </div>
    </article>
  );
}

export function CaseCard({ c }: { c: CaseReport }) {
  return (
    <article className="card group relative flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap gap-2">
        <span className="chip !bg-pulse-500/10 !text-pulse-600">{c.age_group}</span>
        <span className="chip">{c.procedure}</span>
        {c.is_template && <span className="badge-placeholder">Template</span>}
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold text-navy-900">
        <Link href={`/cases/${c.slug}`} className="after:absolute after:inset-0">{c.title}</Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-navy-600">{c.sections.clinical_background}</p>
      <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-navy-500"><User className="h-3.5 w-3.5" />{c.author} · {fmtDate(c.published_at)}</p>
    </article>
  );
}

export { ShareButtons };
