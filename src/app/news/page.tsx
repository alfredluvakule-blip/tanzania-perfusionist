import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { NewsCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { getNews } from "@/lib/content";

export const metadata: Metadata = { title: "Perfusion News", description: "Perfusion news from Tanzania and around the world." };
export const revalidate = 300;

const CATS = ["All", "Tanzania", "International", "Cardiac Surgery", "Technology", "Training & Conferences", "Announcements"];

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category = "All" } = await searchParams;
  const all = await getNews();
  const items = category === "All" ? all : all.filter((n) => n.category === category);
  return (
    <>
      <PageHeader eyebrow="Perfusion news" title="News & announcements"
        intro="Local Tanzanian news, international updates, cardiac surgery, CPB technology, training and professional announcements." />
      <section className="container-x py-14">
        <nav className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4" aria-label="News categories">
          {CATS.map((c) => (
            <Link key={c} href={c === "All" ? "/news" : `/news?category=${encodeURIComponent(c)}`} aria-current={c === category ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${c === category ? "bg-navy-900 text-white" : "bg-white text-navy-700 ring-1 ring-navy-100 hover:ring-teal-400"}`}>
              {c}
            </Link>
          ))}
        </nav>
        {items.length === 0 ? (
          <p className="text-navy-500">No articles in this category yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a, i) => <Reveal key={a.id} delay={(i % 3) * 0.05}><NewsCard a={a} i={i} /></Reveal>)}
          </div>
        )}
      </section>
    </>
  );
}
