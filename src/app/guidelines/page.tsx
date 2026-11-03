import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Conduct & publishing policy" };

const SECTIONS: [string, string, string[]][] = [
  ["conduct", "Professional conduct", [
    "Be respectful and constructive. Disagree with ideas, not people.",
    "Share knowledge, not patient data. Never post anything that could identify a patient.",
    "Declare conflicts of interest, including relationships with equipment manufacturers.",
    "Do not give individual patient-care advice. Discussions are for professional education.",
    "Moderators may edit, hide or remove posts that break these rules, and may suspend accounts.",
  ]],
  ["consent", "Consent for personal content", [
    "Profiles, interviews and photographs of identifiable people are published only with that person's permission.",
    "Tributes to late colleagues are published only with authorisation from their family.",
    "Contributors confirm permission when submitting; editors record it before publishing.",
    "Anyone featured can ask for content about them to be corrected or removed via the contact page.",
  ]],
  ["cases", "Case reports", [
    "Remove names, dates of birth, exact dates, hospital numbers and identifying images.",
    "Patient (or guardian) consent and any required institutional or ethics approval must be in place.",
    "Case reports are reviewed for anonymity and clinical accuracy before publication.",
  ]],
  ["research", "Research & references", [
    "Every publication links to its original source (DOI or publisher link).",
    "Publication details are checked against the original. Findings are reported as the authors reported them.",
    "Original research summaries and educational summaries are labelled differently.",
  ]],
  ["history", "Historical content", [
    "Milestones require sources. Tanzanian milestones are shown as placeholders until verified.",
    "Where accounts differ, we say so and cite each source.",
  ]],
  ["copyright", "Copyright", [
    "Images and videos are used only with permission or an appropriate licence, and credited.",
    "Videos are embedded from their original platform rather than re-uploaded.",
  ]],
];

export default function Guidelines() {
  return (
    <>
      <PageHeader eyebrow="Policies" title="Conduct & publishing policy" intro="How we keep Tanzania Perfusionist accurate, respectful and safe." />
      <section className="container-x max-w-3xl space-y-6 py-14">
        {SECTIONS.map(([id, title, items]) => (
          <div key={id} id={id} className="card scroll-mt-24 p-6">
            <h2 className="font-display text-xl font-semibold">{title}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-navy-700">{items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </section>
    </>
  );
}
