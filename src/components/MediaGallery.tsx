"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, Image as ImageIcon, Play, X } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { CoverArt } from "./CoverArt";

/** Turn a YouTube/Vimeo URL into an embeddable URL. Returns null for anything else. */
export function toEmbed(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch { /* not a URL */ }
  return null;
}

function youtubeThumb(url?: string | null) {
  const e = toEmbed(url);
  const m = e?.match(/youtube-nocookie\.com\/embed\/([\w-]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

export function MediaGallery({ items, limit, initialCategory = "All" }: { items: MediaItem[]; limit?: number; initialCategory?: string }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category)))], [items]);
  const years = useMemo(() => ["All", ...Array.from(new Set(items.filter((i) => i.year).map((i) => String(i.year)))).sort().reverse()], [items]);
  const [cat, setCat] = useState(initialCategory);
  const [year, setYear] = useState("All");
  const [open, setOpen] = useState<MediaItem | null>(null);

  const shown = items
    .filter((i) => (cat === "All" || i.category === cat) && (year === "All" || String(i.year) === year))
    .slice(0, limit);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      {!limit && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${cat === c ? "bg-navy-900 text-white" : "bg-white text-navy-700 ring-1 ring-navy-100 hover:ring-teal-400"}`}>
              {c}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-sm text-navy-600">
            Year
            <select value={year} onChange={(e) => setYear(e.target.value)} className="input !w-auto !py-1.5">
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
        </div>
      )}

      <motion.div layout className="grid grid-flow-dense grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {shown.map((m, i) => {
            const thumb = m.thumbnail_url ?? (m.kind === "video" ? youtubeThumb(m.url) : m.url);
            return (
              <motion.button
                layout key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setOpen(m)}
                className={`group relative overflow-hidden rounded-2xl text-left ring-1 ring-navy-900/10 ${i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                {thumb ? (
                  <div className="relative aspect-square">
                    <Image src={thumb} alt={m.title} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                ) : (
                  <CoverArt alt={m.title} kind={m.kind === "video" ? "default" : "research"} seed={i} className="aspect-square" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent opacity-80 transition group-hover:opacity-100" />
                <span className="absolute left-3 top-3 flex gap-1.5">
                  <span className="chip !bg-white/15 !text-white backdrop-blur">{m.category}</span>
                  {m.is_placeholder && <span className="badge-placeholder">Placeholder</span>}
                </span>
                <span className="absolute inset-0 m-auto flex h-14 w-14 scale-90 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition group-hover:scale-100 group-hover:opacity-100">
                  {m.kind === "video" ? <Play className="h-6 w-6" /> : <Expand className="h-6 w-6" />}
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block font-medium text-white">{m.title}</span>
                  <span className="text-xs text-navy-200">{m.topic}{m.year ? ` · ${m.year}` : ""}</span>
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.title}
          >
            <button className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/10" aria-label="Close" onClick={() => setOpen(null)}>
              <X className="h-6 w-6" />
            </button>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-900">
                {open.kind === "video" && toEmbed(open.url) ? (
                  <iframe src={toEmbed(open.url)!} title={open.title} className="h-full w-full" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
                ) : open.url ? (
                  <Image src={open.url} alt={open.title} fill className="object-contain" sizes="100vw" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-navy-200">
                    <ImageIcon className="h-10 w-10" />
                    <p className="max-w-md px-6">Placeholder. Authorised contributors upload photos or add YouTube / Vimeo links from the admin dashboard.</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 text-white">
                <p className="font-display text-xl">{open.title}</p>
                <p className="text-sm text-navy-300">{[open.category, open.topic, open.year, open.credit].filter(Boolean).join(" · ")}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
