import Link from "next/link";
import { Logo } from "./Logo";
import { NAV, NAV_MORE } from "@/lib/nav";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-950 text-navy-100">
      <div className="pointer-events-none absolute -top-40 right-0 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
        <div>
          <Logo light large />
          <p className="mt-4 max-w-xs text-sm text-navy-200">
            Connecting Perfusionists. Preserving Our History. Advancing Cardiac Care.
          </p>
          <p className="mt-3 max-w-xs text-xs text-navy-300">Tanzania Cardiovascular Perfusion Association (TaCPA)</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}><Link className="hover:text-teal-300" href={n.href}>{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Platform</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_MORE.map((n) => (
              <li key={n.href}><Link className="hover:text-teal-300" href={n.href}>{n.label}</Link></li>
            ))}
            <li><Link className="hover:text-teal-300" href="/submit">Submit content</Link></li>
            <li><Link className="hover:text-teal-300" href="/guidelines">Conduct & publishing policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Newsletter</h3>
          <p className="mt-4 text-sm text-navy-200">News, research highlights and events, once a month.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-navy-300 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Tanzania Perfusionist.</p>
          <p className="max-w-2xl sm:text-right">
            Educational content for healthcare professionals. It does not replace institutional protocols or clinical judgement.
          </p>
        </div>
      </div>
    </footer>
  );
}
