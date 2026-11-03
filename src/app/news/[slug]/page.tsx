import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CoverArt } from "@/components/CoverArt";
import { ShareButtons } from "@/components/ShareButtons";
import { fmtDate } from "@/components/Cards";
import { getNews, getNewsBySlug } from "@/lib/content";

export const revalidate = 300;
type P = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getNews()).map((n) => ({ slug: n.slug }));
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const a = await getNewsBySlug((await params).slug);
  return a ? { title: a.title, description: a.summary, openGraph: { title: a.title, description: a.summary, type: "article" } } : {};
}

export default async function Article({ params }: P) {
  const a = await getNewsBySlug((await params).slug);
  if (!a) notFound();
  return (
    <article className="pb-10 pt-24">
      <div className="container-x max-w-3xl">
        <Link href="/news" className="inline-flex items-center gap-1 text-sm text-teal-700 hover:underline"><ArrowLeft className="h-4 w-4" /> All news</Link>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="chip !bg-teal-50 !text-teal-700">{a.category}</span>
          {a.is_sample && <span className="badge-placeholder">Sample article</span>}
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl">{a.title}</h1>
        <p className="mt-4 text-lg text-navy-600">{a.summary}</p>
        <p className="mt-4 text-sm text-navy-500">By {a.author} · <time dateTime={a.published_at}>{fmtDate(a.published_at)}</time></p>
      </div>
      <div className="container-x mt-10 max-w-5xl">
        <CoverArt src={a.image_url} alt={a.title} kind={a.category} className="aspect-[21/9] rounded-3xl" />
      </div>
      <div className="container-x mt-10 max-w-3xl">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-teal-700">
          {a.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-10 border-t border-navy-100 pt-6"><ShareButtons title={a.title} path={`/news/${a.slug}`} /></div>
      </div>
    </article>
  );
}
