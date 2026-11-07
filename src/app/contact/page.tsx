import type { Metadata } from "next";
import { Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "./ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Contact Us" };

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact us" title="Get in touch" intro="Questions, partnerships, corrections, or a request to update or remove content about you." />
      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          <div className="card p-5">
            <p className="font-semibold">Email us directly</p>
            <a className="mt-3 flex items-center gap-3 text-sm font-medium text-teal-700 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
              <Mail className="h-5 w-5 shrink-0 text-teal-600" />{CONTACT_EMAIL}
            </a>
          </div>
          {[
            { icon: MessageSquare, t: "General enquiries & partnerships", d: "Collaborations with hospitals, training programmes, societies and sponsors." },
            { icon: ShieldCheck, t: "Corrections & removal requests", d: "If content about you or a family member needs correcting or removing, tell us and we will act promptly." },
            { icon: Mail, t: "Editorial team", d: "Story ideas, research to feature and historical sources." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="card flex gap-4 p-5"><Icon className="h-6 w-6 shrink-0 text-teal-600" /><div><p className="font-semibold">{t}</p><p className="text-sm text-navy-600">{d}</p></div></div>
          ))}
        </div>
        <div className="card p-6 sm:p-8"><ContactForm /></div>
      </section>
    </>
  );
}
