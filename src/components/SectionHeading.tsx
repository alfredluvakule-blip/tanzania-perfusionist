import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

export function SectionHeading({
  eyebrow, title, intro, href, cta, dark = false,
}: { eyebrow: string; title: string; intro?: string; href?: string; cta?: string; dark?: boolean }) {
  return (
    <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className={`eyebrow ${dark ? "!text-teal-300" : ""}`}>{eyebrow}</p>
        <h2 className={`h-section mt-2 ${dark ? "!text-white" : ""}`}><SplitText text={title} inView delay={0.1} stagger={0.05} /></h2>
        {intro && <p className={`mt-3 ${dark ? "text-navy-200" : "text-navy-600"}`}>{intro}</p>}
      </div>
      {href && (
        <Link href={href} className={`group inline-flex items-center gap-1.5 text-sm font-semibold ${dark ? "text-teal-300" : "text-teal-700"}`}>
          {cta ?? "View all"} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
