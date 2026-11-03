import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Timeline } from "@/components/Timeline";
import { Reveal } from "@/components/Reveal";
import { getMilestones } from "@/lib/content";

export const metadata: Metadata = { title: "History of Perfusion", description: "An interactive timeline of perfusion and cardiopulmonary bypass, worldwide, in Africa and in Tanzania." };
export const revalidate = 300;

export default async function HistoryPage() {
  const milestones = await getMilestones();
  const placeholders = milestones.filter((m) => m.is_placeholder).length;
  return (
    <>
      <PageHeader eyebrow="Interactive experience" title="The history of perfusion: from the past to the future"
        intro="From the discovery of blood circulation to the heart-lung machine, membrane oxygenators, ECMO and the growth of perfusion in Africa and Tanzania." />
      <section className="bg-navy-950 pb-20 text-white">
        <div className="container-x">
          <Timeline milestones={milestones} />
        </div>
      </section>
      <section className="container-x py-16">
        <Reveal className="card grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold">Help us write Tanzania&apos;s chapter</h2>
            <p className="mt-2 max-w-2xl text-navy-600">
              {placeholders} milestones for Africa and Tanzania are placeholders. We will not publish dates or names until they are confirmed by documents, publications or first-hand accounts. If you can help, please contribute with your sources.
            </p>
          </div>
          <Link href="/submit?type=timeline" className="btn-primary">Contribute a verified milestone</Link>
        </Reveal>
      </section>
    </>
  );
}
