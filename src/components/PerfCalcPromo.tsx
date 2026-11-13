import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, WifiOff } from "lucide-react";
import { PERFCALC_URL } from "@/lib/site";
import { Reveal } from "./Reveal";

/**
 * Home-page invitation to the PerfCalc TZ app. On a phone the buttons lead;
 * on wider screens a QR code lets visitors open it on their phone instead.
 */
export function PerfCalcPromo() {
  return (
    <section className="container-x py-20 sm:py-24" aria-labelledby="perfcalc-promo">
      <Reveal className="relative overflow-hidden rounded-3xl bg-navy-950 p-8 text-white sm:p-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pulse-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex items-center gap-4">
              <Image src="/images/perfcalc-icon.svg" alt="" width={56} height={56} className="h-14 w-14 rounded-2xl" />
              <p className="eyebrow !text-teal-300">Free app for perfusionists</p>
            </div>
            <h2 id="perfcalc-promo" className="mt-4 font-display text-3xl font-semibold sm:text-4xl">PerfCalc TZ: the bypass calculator in your pocket</h2>
            <p className="mt-4 max-w-2xl text-navy-100">
              Pump flow, haemodilution, prime volume, heparin and protamine, cardioplegia, cannula sizes and a printable case sheet, for adults and
              children. Install it on your phone or computer.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-teal-300">
              <WifiOff className="h-4 w-4" /> Works offline in theatre after the first open
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={PERFCALC_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Open PerfCalc TZ <ExternalLink className="h-4 w-4" />
              </a>
              <Link href="/perfcalc" className="btn-ghost">
                How to install <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <figure className="hidden flex-col items-center md:flex">
            <div className="rounded-2xl bg-white p-3 shadow-glow">
              <Image src="/images/perfcalc-qr.svg" alt="QR code that opens the PerfCalc TZ app" width={200} height={200} className="h-48 w-48" unoptimized />
            </div>
            <figcaption className="mt-3 text-center text-sm text-navy-200">Scan with your phone camera</figcaption>
          </figure>
        </div>
      </Reveal>
    </section>
  );
}
