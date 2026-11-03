import type { Metadata } from "next";
import Link from "next/link";
import { Building2, GraduationCap, Handshake } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Discussions } from "./Discussions";
import { getMembers } from "@/lib/content";

export const metadata: Metadata = { title: "Perfusionist Community" };
export const revalidate = 300;

export default async function Community() {
  const members = await getMembers();
  return (
    <>
      <PageHeader eyebrow="Perfusionist community" title="Meet, collaborate and learn together"
        intro="Profiles, professional biographies, training backgrounds, interests and achievements of perfusionists and cardiac-care professionals. Members choose what is public.">
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="btn-primary">Create your profile</Link>
          <Link href="#discussions" className="btn-ghost">Go to discussions</Link>
        </div>
      </PageHeader>

      <section className="container-x py-14">
        <h2 className="h-section">Member directory</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={(i % 3) * 0.05} className="card group p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-navy-800 to-teal-600 font-display text-lg font-semibold text-white">
                  {m.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-display font-semibold">{m.full_name} {m.is_placeholder && <span className="badge-placeholder ml-1">Placeholder</span>}</p>
                  <p className="text-sm text-teal-700">{m.title}</p>
                </div>
              </div>
              {m.bio && <p className="mt-4 text-sm text-navy-600">{m.bio}</p>}
              <ul className="mt-4 space-y-1.5 text-xs text-navy-600">
                {m.show_institution && m.institution && <li className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" />{m.institution}</li>}
                {m.training && <li className="flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5" />{m.training}</li>}
                {m.open_to_collaboration && <li className="flex items-center gap-2 text-teal-700"><Handshake className="h-3.5 w-3.5" />Open to collaboration</li>}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">{m.interests.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="discussions" className="container-x scroll-mt-20 py-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="h-section">Community discussions</h2>
            <p className="mt-2 text-navy-600">Professional knowledge exchange. New topics are reviewed by moderators before they appear.</p>
            <div className="mt-6"><Discussions /></div>
          </div>
          <aside className="card h-fit p-6 text-sm">
            <p className="font-display text-lg font-semibold">Conduct guidelines</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-navy-700">
              <li>No patient-identifiable information.</li>
              <li>Respectful, evidence-based discussion.</li>
              <li>Declare conflicts of interest.</li>
              <li>No individual patient-care advice.</li>
            </ul>
            <Link href="/guidelines#conduct" className="btn-outline mt-5 w-full">Full guidelines</Link>
          </aside>
        </div>
      </section>

      <section id="join" className="container-x scroll-mt-20 py-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 to-navy-950 p-10 text-center text-white">
          <h2 className="font-display text-3xl font-semibold">Join Tanzania Perfusionists</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">Perfusionists, cardiac surgeons, anaesthetists, nurses, students and researchers are all welcome.</p>
          <Link href="/login" className="btn-primary mt-8">Create a free account</Link>
        </div>
      </section>
    </>
  );
}
