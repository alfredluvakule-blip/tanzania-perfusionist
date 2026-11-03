import { Clapperboard } from "lucide-react";
import { PROMO_FILM, SWAHILI_NAME } from "@/lib/site";

/** The shareable film, with sound and native controls. Loads nothing until played. */
export function FilmFeature({ dark = false }: { dark?: boolean }) {
  return (
    <figure className="relative">
      <div className={`absolute -inset-4 rounded-[2.25rem] blur-3xl ${dark ? "bg-teal-500/15" : "bg-teal-500/10"}`} aria-hidden="true" />
      <div className="relative overflow-hidden rounded-3xl bg-navy-950 shadow-2xl ring-1 ring-white/10">
        <video
          className="aspect-video w-full bg-navy-950"
          src={PROMO_FILM.src}
          poster={PROMO_FILM.poster}
          controls playsInline preload="none"
          aria-label={`${PROMO_FILM.title}. ${SWAHILI_NAME}.`}
        />
      </div>
      <figcaption className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${dark ? "text-navy-200" : "text-navy-600"}`}>
        <Clapperboard className={`h-4 w-4 ${dark ? "text-teal-300" : "text-teal-700"}`} />
        <span className={`font-medium ${dark ? "text-white" : "text-navy-900"}`}>{PROMO_FILM.title}</span>
        <span>· about one minute, with sound · {PROMO_FILM.credit}</span>
      </figcaption>
    </figure>
  );
}
