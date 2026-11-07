import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GraduationCap, Presentation, Upload } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { DownloadButton } from "@/components/DownloadButton";
import { getResources } from "@/lib/content";
import { COURSE_GROUPS, COURSES, type ResourceItem } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources: Presentations & Books",
  description:
    "Download perfusion presentations for CVP 1 to CVP 4 and books shared by perfusionists in Tanzania and beyond.",
};
export const revalidate = 60;

function ResourceCard({ r }: { r: ResourceItem }) {
  const Icon = r.kind === "book" ? BookOpen : Presentation;
  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-navy-900 text-teal-300">
          <Icon className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-snug">{r.title}</h3>
          <p className="mt-1 text-sm text-navy-600">
            {r.author}
            {r.year && <> · {r.year}</>}
          </p>
        </div>
      </div>
      {r.source && <p className="mt-4 text-sm font-medium text-navy-700">{r.source}</p>}
      {r.description && <p className="mt-2 text-sm text-navy-600">{r.description}</p>}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        {r.format && <span className="chip">{r.format}</span>}
        {r.licence && <span className="chip">{r.licence}</span>}
      </div>
      <DownloadButton resourceKey={r.key} title={r.title} href={r.href} isFile={r.isFile} />
    </article>
  );
}

function Grid({ items, empty }: { items: ResourceItem[]; empty: string }) {
  if (!items.length)
    return <p className="rounded-2xl border border-dashed border-navy-200 p-6 text-center text-sm text-navy-500">{empty}</p>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => <Reveal key={r.key}><ResourceCard r={r} /></Reveal>)}
    </div>
  );
}

export default async function ResourcesPage() {
  const all = await getResources();
  const presentations = all.filter((r) => r.kind === "presentation");
  const books = all.filter((r) => r.kind === "book");
  const other = presentations.filter((r) => !r.course || !(COURSES as readonly string[]).includes(r.course));

  const jump = [
    ...COURSE_GROUPS.map((g) => ({ id: g.year.toLowerCase().replace(" ", "-"), label: `${g.year} (${g.courses.join(", ")})` })),
    { id: "books", label: `Books (${books.length})` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Presentations & books"
        intro="Lecture slides for CVP 1 to CVP 4 and reading for perfusionists, students and cardiac-care teams. Free to download for education."
      >
        <nav aria-label="Resource sections" className="mt-8 flex flex-wrap gap-2">
          {jump.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-teal-500 hover:text-navy-950">
              {s.label}
            </a>
          ))}
        </nav>
      </PageHeader>

      <section id="presentations" className="scroll-mt-20 py-16 sm:py-20">
        <div className="container-x">
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="h-section">Presentations</h2>
            <p className="mt-3 text-navy-600">Lecture slides grouped by year of study and CVP course.</p>
          </Reveal>

          {COURSE_GROUPS.map((g) => (
            <div key={g.year} id={g.year.toLowerCase().replace(" ", "-")} className="scroll-mt-24 mb-14 last:mb-0">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500 text-navy-950"><GraduationCap className="h-5 w-5" /></span>
                <h3 className="font-display text-2xl font-semibold">{g.year}</h3>
              </div>
              <div className="space-y-10 border-l-2 border-teal-500/30 pl-5 sm:pl-8">
                {g.courses.map((c) => (
                  <div key={c} id={c.toLowerCase().replace(" ", "")} className="scroll-mt-24">
                    <h4 className="mb-4 font-display text-lg font-semibold text-navy-800">{c}</h4>
                    <Grid items={presentations.filter((r) => r.course === c)} empty={`${c} presentations will appear here soon.`} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {other.length > 0 && (
            <div className="mt-14">
              <h3 className="mb-6 font-display text-2xl font-semibold">Other presentations</h3>
              <Grid items={other} empty="" />
            </div>
          )}
        </div>
      </section>

      <section id="books" className="scroll-mt-20 bg-white py-16 sm:py-20">
        <div className="container-x">
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="h-section">Books</h2>
            <p className="mt-3 text-navy-600">Books and handbooks that are free to share, or links to where you can get them.</p>
          </Reveal>
          <Grid items={books} empty="Books will appear here soon." />
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <Reveal className="relative overflow-hidden rounded-3xl bg-navy-950 p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal-500/25 blur-3xl" />
          <h2 className="relative font-display text-2xl font-semibold sm:text-3xl">Have slides or a book to share?</h2>
          <p className="relative mt-3 max-w-2xl text-navy-100">
            Send your presentation or an open-access book and we will add it after review. Please only share material you wrote or have permission to share, with no patient-identifying details.
          </p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary"><Upload className="h-4 w-4" /> Send a resource</Link>
            <Link href="/research" className="btn-ghost">Browse research papers</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
