import Link from "next/link";
import { ArrowRight, Award, BookOpen, Camera, GraduationCap, HeartHandshake, MessagesSquare, PenLine } from "lucide-react";
import { Hero } from "@/components/Hero";
import { PhotoStory } from "@/components/PhotoStory";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CaseCard, LegacyCard, NewsCard, PublicationCard } from "@/components/Cards";
import { Timeline } from "@/components/Timeline";
import { MediaGallery } from "@/components/MediaGallery";
import { AnimatedStat } from "@/components/AnimatedStat";
import { Disclaimer } from "@/components/Disclaimer";
import { getCases, getLegacy, getMedia, getMilestones, getNews, getPublications } from "@/lib/content";
import { RESEARCH_CATEGORIES } from "@/lib/types";
import { SITE_URL, SWAHILI_NAME } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Tanzania Cardiovascular Perfusion Association",
      alternateName: ["TaCPA", "Tanzania Perfusionist", SWAHILI_NAME],
      url: SITE_URL,
      logo: `${SITE_URL}/images/tacpa-logo.webp`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Tanzania Perfusionist",
      alternateName: SWAHILI_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#org` },
      potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/search?q={search_term_string}`, "query-input": "required name=search_term_string" },
    },
  ],
};

export const revalidate = 300;

export default async function Home() {
  const [news, pubs, milestones, legacy, cases, media] = await Promise.all([
    getNews(), getPublications(), getMilestones(), getLegacy(), getCases(), getMedia(),
  ]);
  const yearsOfCpb = new Date().getFullYear() - 1953;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />

      {/* Stats band: every number is derived from verifiable facts or from the site's own content */}
      <section className="relative bg-navy-950 pb-16">
        <div className="container-x grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
          <AnimatedStat value={yearsOfCpb} label="Years since the first successful CPB operation (1953)" />
          <AnimatedStat value={milestones.filter((m) => !m.is_placeholder).length} label="Referenced history milestones" />
          <AnimatedStat value={RESEARCH_CATEGORIES.length} label="Research categories" />
          <AnimatedStat value={pubs.filter((p) => p.content_kind === "original").length} label="Linked original publications" />
        </div>
      </section>

      <PhotoStory />

      {/* B. Latest news */}
      <section id="latest" className="container-x scroll-mt-20 py-20 sm:py-24">
        <SectionHeading eyebrow="Latest perfusion news" title="What's happening in perfusion"
          intro="Tanzanian and international news, cardiac surgery updates, CPB technology, training and professional announcements."
          href="/news" cta="All news" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, 4).map((a, i) => (
            <Reveal key={a.id} delay={i * 0.06} className={i === 0 ? "lg:col-span-2" : ""}>
              <NewsCard a={a} i={i} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* C. Memories & legacy */}
      <section className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-24">
        <div className="pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-pulse-500/10 blur-3xl" />
        <div className="container-x relative">
          <SectionHeading dark eyebrow="Perfusionist memories & legacy" title="The people behind every bypass"
            intro="Profiles, interviews, photographs and tributes that preserve the journeys of Tanzanian perfusionists. Everything is published with permission."
            href="/legacy" cta="Explore the archive" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {legacy.slice(0, 4).map((s, i) => (
              <Reveal key={s.id} delay={i * 0.08}><LegacyCard s={s} i={i} /></Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <Link href="/submit?type=legacy" className="btn-ghost"><PenLine className="h-4 w-4" /> Share a story or photograph</Link>
          </Reveal>
        </div>
      </section>

      {/* D. Research */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow="Latest research & publications" title="Evidence, linked to the source"
          intro="Every entry links to the original article. Original publications and our own educational summaries are clearly labelled."
          href="/research" cta="Research library" />
        <Reveal className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4">
          {RESEARCH_CATEGORIES.map((c) => (
            <Link key={c} href={`/research?category=${encodeURIComponent(c)}`} className="chip whitespace-nowrap !px-3.5 !py-1.5 transition hover:!bg-teal-500 hover:!text-navy-950">{c}</Link>
          ))}
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pubs.filter((p) => p.content_kind === "original").slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}><PublicationCard p={p} /></Reveal>
          ))}
        </div>
      </section>

      {/* History timeline */}
      <section className="noise relative overflow-hidden bg-gradient-to-b from-navy-950 to-navy-900 py-20 text-white sm:py-24">
        <div className="container-x relative">
          <SectionHeading dark eyebrow="The history of perfusion" title="From the past to the future"
            intro="From Harvey's circulation to modern ECMO. Click any milestone for the story and its references; drag, scroll and zoom to travel through time."
            href="/history" cta="Full history experience" />
          <Reveal><Timeline milestones={milestones} compact /></Reveal>
        </div>
      </section>

      {/* E. Case reports */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow="Perfusion case reports" title="Learn from each other's cases"
          intro="Anonymised, consented case discussions covering setup, cannulation, CPB parameters, cardioplegia, monitoring and lessons learned."
          href="/cases" cta="Case library" />
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Reveal className="space-y-4">
            {cases.slice(0, 2).map((c) => <CaseCard key={c.id} c={c} />)}
            <Disclaimer />
          </Reveal>
          <Reveal delay={0.1} className="card grid content-start gap-3 p-6 sm:grid-cols-2">
            {["Perfusion setup", "Cannulation strategy", "CPB parameters", "Temperature management", "Cardioplegia strategy", "Blood gas & electrolytes", "Challenges & interventions", "Outcomes & lessons"].map((s, i) => (
              <div key={s} className="flex items-center gap-3 rounded-xl bg-navy-50/60 p-3 text-sm font-medium text-navy-800">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-xs text-teal-300">{i + 1}</span>{s}
              </div>
            ))}
            <Link href="/submit?type=case" className="btn-primary mt-2 sm:col-span-2">Submit a case report <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
        </div>
      </section>

      {/* Media hub */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Perfusion media hub" title="Watch, look, learn"
            intro="Educational videos, heart-lung machine demonstrations, interviews, conference recordings and historical photographs."
            href="/media" cta="Open the media hub" />
          <MediaGallery items={media} limit={6} />
        </div>
      </section>

      {/* Community */}
      <section className="container-x py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-8 text-white sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-500/25 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="eyebrow !text-teal-300">Perfusionist community</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">A professional home for perfusion in Tanzania and across Africa</h2>
              <p className="mt-4 text-navy-100">Create a profile, find collaborators, join moderated discussions and contribute to the archive.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/community#join" className="btn-primary">Join the community <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/events" className="btn-ghost">Events & conferences</Link>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Award, t: "Professional profiles", d: "Training, interests and achievements, with publication by consent." },
                { icon: MessagesSquare, t: "Moderated discussions", d: "Knowledge exchange under clear conduct guidelines." },
                { icon: GraduationCap, t: "Training & careers", d: "Courses, fellowships and job opportunities." },
                { icon: HeartHandshake, t: "Collaboration", d: "Research partners and mentorship." },
                { icon: Camera, t: "Contribute media", d: "Photos and videos, reviewed before publishing." },
                { icon: BookOpen, t: "Share research", d: "Add publications with their original links." },
              ].map(({ icon: Icon, t, d }, i) => (
                <Reveal key={t} delay={i * 0.05} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/10">
                  <Icon className="h-6 w-6 text-teal-300" />
                  <p className="mt-3 font-semibold">{t}</p>
                  <p className="mt-1 text-sm text-navy-200">{d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
