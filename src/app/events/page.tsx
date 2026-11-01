import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { getEvents } from "@/lib/content";

export const metadata: Metadata = { title: "Events & Conferences" };
export const revalidate = 300;

export default async function Events() {
  const events = await getEvents();
  return (
    <>
      <PageHeader eyebrow="Events & conferences" title="Conferences, workshops, webinars and surgical camps"
        intro="Upcoming opportunities to learn and meet colleagues in Tanzania, across Africa and internationally.">
        <div className="mt-8"><Link href="/submit?type=events" className="btn-primary">Submit an event</Link></div>
      </PageHeader>
      <section className="container-x max-w-4xl py-14">
        <ol className="relative space-y-6 border-l-2 border-teal-500/30 pl-8">
          {events.map((e, i) => {
            const d = new Date(e.starts_on);
            return (
              <Reveal key={e.id} delay={i * 0.05} className="relative">
                <span className="absolute -left-[41px] top-6 h-4 w-4 rounded-full border-4 border-[var(--bg)] bg-teal-500" />
                <article className="card flex flex-col gap-5 p-6 sm:flex-row">
                  <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-navy-900 text-white">
                    <span className="text-xs uppercase tracking-wider text-teal-300">{d.toLocaleString("en-GB", { month: "short" })}</span>
                    <span className="font-display text-2xl font-semibold">{d.getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2"><span className="chip">{e.kind}</span>{e.is_placeholder && <span className="badge-placeholder">Placeholder</span>}</div>
                    <h2 className="mt-2 font-display text-xl font-semibold">{e.title}</h2>
                    <p className="mt-1 flex flex-wrap gap-4 text-sm text-navy-500">
                      <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />{d.toLocaleDateString("en-GB", { dateStyle: "long" })}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{e.location}</span>
                    </p>
                    <p className="mt-3 text-sm text-navy-700">{e.description}</p>
                    {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">Event website <ExternalLink className="h-3.5 w-3.5" /></a>}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ol>
      </section>
    </>
  );
}
