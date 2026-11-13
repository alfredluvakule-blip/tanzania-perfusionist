import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Activity, Beaker, BookOpen, ClipboardList, Download, Droplets, ExternalLink, GitBranch, Monitor, Pill,
  Smartphone, Stethoscope, WifiOff, Wrench, Zap,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { Disclaimer } from "@/components/Disclaimer";
import { ShareButtons } from "@/components/ShareButtons";
import { PERFCALC_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "PerfCalc TZ: CPB Calculator App",
  description:
    "Free cardiopulmonary bypass calculator and reference for perfusionists in Tanzania. Install it on Android, iPhone or Windows; it works offline in theatre.",
  openGraph: {
    title: "PerfCalc TZ: CPB calculator app for perfusionists",
    description: "Pump flow, haemodilution, prime, drugs, cannula sizes and a printable case sheet. Works offline.",
    images: [{ url: "/downloads/perfcalc-tz-poster.png", width: 1240, height: 1754, alt: "PerfCalc TZ poster with a QR code to install the app" }],
  },
};

const INSTALL = [
  {
    icon: Smartphone,
    device: "Android",
    steps: ["Open the app link in Chrome.", "Tap Install app (or ⋮ menu › Install app).", "PerfCalc TZ appears on your home screen."],
  },
  {
    icon: Smartphone,
    device: "iPhone or iPad",
    steps: ["Open the app link in Safari.", "Tap the Share button (square with an arrow).", "Choose Add to Home Screen, then Add."],
  },
  {
    icon: Monitor,
    device: "Windows or Mac",
    steps: ["Open the app link in Microsoft Edge or Google Chrome.", "Click Install app, or the install icon in the address bar.", "It opens from the Start menu or desktop like any program."],
  },
];

const FEATURES = [
  { icon: Activity, t: "Flow & BSA", d: "Full flow by body surface area or weight, and oxygen delivery (DO₂i) on bypass." },
  { icon: Droplets, t: "Haemodilution", d: "Predicted haematocrit on bypass, red cells to add, and ultrafiltration volume." },
  { icon: Beaker, t: "Prime volume", d: "Prime from the circuit in use, tubing by length, and prime additives." },
  { icon: Pill, t: "Drug dosages", d: "Heparin and protamine, tranexamic acid, cardioplegia volumes and bypass drugs." },
  { icon: Zap, t: "Electrolytes", d: "Potassium, bicarbonate, calcium, magnesium and glucose corrections." },
  { icon: Stethoscope, t: "Anaesthesia", d: "Weight-based bolus doses, infusion rates and paediatric airway sizes." },
  { icon: Wrench, t: "Equipment", d: "Oxygenator class, tubing pack and cannula sizes for the calculated flow." },
  { icon: GitBranch, t: "CPB techniques", d: "MUF, cerebral perfusion, DHCA, checklists and emergency prompts." },
  { icon: BookOpen, t: "Quick reference", d: "Targets on bypass, temperature limits, formulas and a unit converter." },
  { icon: ClipboardList, t: "Case sheet", d: "A one-page summary of the calculated values to print or copy." },
];

export default function PerfCalcPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free app for perfusionists"
        title="PerfCalc TZ: the bypass calculator in your pocket"
        intro="Enter the patient once and every calculation follows: adult and paediatric. Install it on your phone or computer and use it in theatre with no internet."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={PERFCALC_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Open PerfCalc TZ <ExternalLink className="h-4 w-4" />
          </a>
          <a href="/downloads/perfcalc-tz-poster.png" download className="btn-ghost">
            <Download className="h-4 w-4" /> Download poster
          </a>
        </div>
      </PageHeader>

      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <Reveal className="card flex flex-col items-center p-8 text-center">
            <Image src="/images/perfcalc-qr.svg" alt="QR code that opens the PerfCalc TZ app" width={256} height={256} className="h-64 w-64" unoptimized priority />
            <h2 className="mt-4 font-display text-xl font-semibold">Scan to open and install</h2>
            <p className="mt-1 text-sm text-navy-600">Point your phone camera at the code.</p>
            <p className="mt-4 break-all rounded-xl bg-navy-50 px-3 py-2 font-mono text-xs text-navy-700">{PERFCALC_URL}</p>
            <div className="mt-5 flex w-full flex-col gap-2">
              <a href="/downloads/perfcalc-tz-qr.png" download className="btn-outline !py-2">
                <Download className="h-4 w-4" /> QR code (PNG)
              </a>
              <a href="/downloads/perfcalc-tz-poster.png" download className="btn-outline !py-2">
                <Download className="h-4 w-4" /> A4 poster for the theatre wall
              </a>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="h-section">Install it in three taps</h2>
              <p className="mt-3 max-w-2xl text-navy-600">
                Open the app once with internet and it is saved on the device. After that it opens from the home screen or Start menu and
                calculates with no signal.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {INSTALL.map(({ icon: Icon, device, steps }, i) => (
                <Reveal key={device} delay={i * 0.06} className="card p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-900 text-teal-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{device}</h3>
                  <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-navy-700">
                    {steps.map((s) => <li key={s}>{s}</li>)}
                  </ol>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-6 flex items-start gap-3 rounded-2xl bg-teal-50 p-4 text-sm text-teal-900 ring-1 ring-teal-500/20">
              <WifiOff className="mt-0.5 h-5 w-5 shrink-0" />
              <p>When a new version is published, the installed app asks before updating, so it never reloads in the middle of a case.</p>
            </Reveal>
            <Reveal className="mt-6">
              <ShareButtons title="PerfCalc TZ: free CPB calculator app for perfusionists" path={PERFCALC_URL} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <Reveal className="mb-10 max-w-3xl">
            <p className="eyebrow">Ten tools, one patient</p>
            <h2 className="h-section mt-2">What PerfCalc TZ calculates</h2>
            <p className="mt-3 text-navy-600">Every result shows its formula, so it can be checked by hand.</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FEATURES.map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={(i % 5) * 0.04} className="rounded-2xl bg-navy-50/60 p-5 ring-1 ring-navy-900/5">
                <Icon className="h-6 w-6 text-teal-600" />
                <p className="mt-3 font-semibold text-navy-900">{t}</p>
                <p className="mt-1 text-sm text-navy-600">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <Reveal className="mx-auto max-w-3xl space-y-6">
          <Disclaimer>
            PerfCalc TZ is decision support for trained clinicians. Its default values are textbook and guideline starting points, not an
            institutional protocol. Check every figure against your hospital&apos;s protocols and the equipment in use, and apply clinical judgement.
          </Disclaimer>
          <p className="text-center text-sm text-navy-600">
            Suggestions or corrections for the app? <Link href="/contact" className="font-semibold text-teal-700 hover:underline">Contact us</Link>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
