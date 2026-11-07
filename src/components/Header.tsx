"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, X, UserRound } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, NAV_MORE } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const overHero = pathname === "/" && !scrolled;

  // Slide away while reading down the page, glide back as soon as you scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); setHidden(false); }, [pathname]);

  return (
    <motion.header
      animate={{ y: hidden && !open ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        overHero ? "bg-transparent" : "bg-navy-950/90 shadow-lg shadow-navy-950/20 backdrop-blur-md"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Tanzania Perfusionists home">
          <Logo light />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3 py-2 text-sm font-medium transition ${
                  active ? "text-white" : "text-navy-100/80 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/10" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/search" aria-label="Search" className="rounded-full p-2 text-navy-100 hover:bg-white/10 hover:text-white">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/login" aria-label="Sign in" className="hidden rounded-full p-2 text-navy-100 hover:bg-white/10 hover:text-white sm:inline-flex">
            <UserRound className="h-5 w-5" />
          </Link>
          <Link href="/community#join" className="btn-primary ml-1 hidden !px-4 !py-2 sm:inline-flex">
            Join
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-white hover:bg-white/10 xl:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-navy-950 xl:hidden"
            aria-label="Mobile"
          >
            <ul className="container-x grid gap-1 py-4 sm:grid-cols-2">
              {[...NAV, ...NAV_MORE, { href: "/login", label: "Sign in" }].map((item, i) => (
                <motion.li key={item.href} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <Link href={item.href} className="block rounded-xl px-3 py-2.5 text-base text-navy-50 hover:bg-white/10">
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
