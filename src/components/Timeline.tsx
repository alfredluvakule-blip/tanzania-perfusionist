"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookMarked, ExternalLink, List, Minus, Plus, Rows3, Users, X } from "lucide-react";
import type { Era, Milestone } from "@/lib/types";

const ERAS: Era[] = ["Foundations", "Extracorporeal pioneers", "Birth of CPB", "Refinement", "ECMO & life support", "Modern era"];
const REGIONS = ["All", "Global", "Africa", "Tanzania"] as const;
const START = 1600;
const BREAK = 1900; // years before this are compressed so the 20th century gets room
const END = 2030;
const CARD_W = 210;
const LEVEL_H = 84;
const PAD = 60;

export function Timeline({ milestones, compact = false }: { milestones: Milestone[]; compact?: boolean }) {
  const [zoom, setZoom] = useState(compact ? 12 : 16); // px per year after 1900
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");
  const [view, setView] = useState<"timeline" | "list">("timeline");
  const [selected, setSelected] = useState<Milestone | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const x = (year: number) =>
    PAD + (year < BREAK ? (year - START) * zoom * 0.22 : (BREAK - START) * zoom * 0.22 + (year - BREAK) * zoom);
  const width = x(END) + PAD;

  const items = useMemo(
    () => milestones.filter((m) => region === "All" || m.region === region).sort((a, b) => a.year - b.year),
    [milestones, region],
  );

  // Greedy lane packing: lanes alternate above (even) and below (odd) the axis.
  const placed = useMemo(() => {
    const laneEnds: number[] = [];
    return items.map((m) => {
      const px = x(m.year);
      let lane = laneEnds.findIndex((end) => end + 12 < px);
      if (lane === -1) { lane = laneEnds.length; laneEnds.push(0); }
      laneEnds[lane] = px + CARD_W;
      return { m, px, side: lane % 2 === 0 ? "up" : "down", level: Math.floor(lane / 2) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, zoom]);

  const upLevels = Math.max(1, ...placed.filter((p) => p.side === "up").map((p) => p.level + 1));
  const downLevels = Math.max(1, ...placed.filter((p) => p.side === "down").map((p) => p.level + 1));
  const axisY = upLevels * LEVEL_H + 24;
  const height = axisY + downLevels * LEVEL_H + 40;

  const step = zoom >= 24 ? 5 : zoom >= 10 ? 10 : 20;
  const ticks: number[] = [];
  for (let y = START; y < BREAK; y += 50) ticks.push(y);
  for (let y = BREAK; y <= END; y += step) ticks.push(y);

  const jumpTo = (year: number) => scroller.current?.scrollTo({ left: x(year) - 80, behavior: "smooth" });

  // Keep the view centred on the same year when zooming.
  const zoomBy = (factor: number) => {
    const el = scroller.current;
    const centreYear = el ? invert(el.scrollLeft + el.clientWidth / 2) : 1950;
    setZoom((z) => Math.min(48, Math.max(5, z * factor)));
    requestAnimationFrame(() => el && el.scrollTo({ left: x(centreYear) - el.clientWidth / 2 }));
  };
  const invert = (px: number) => {
    const breakX = x(BREAK);
    return px < breakX ? START + (px - PAD) / (zoom * 0.22) : BREAK + (px - breakX) / zoom;
  };

  // Drag to pan
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let down = false, sx = 0, sl = 0, moved = false;
    const onDown = (e: PointerEvent) => { if ((e.target as HTMLElement).closest("button")) return; down = true; moved = false; sx = e.clientX; sl = el.scrollLeft; };
    const onMove = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; el.scrollLeft = sl - dx; };
    const onUp = () => { down = false; };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { el.removeEventListener("pointerdown", onDown); window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); void moved; };
  }, [view]);

  useEffect(() => { if (view === "timeline") jumpTo(1930); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [view]);

  return (
    <div className="relative">
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {ERAS.map((era) => {
            const first = items.find((m) => m.era === era);
            return (
              <button
                key={era} disabled={!first || view === "list"} onClick={() => first && jumpTo(first.year)}
                className="whitespace-nowrap rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-navy-100 transition hover:border-teal-400 hover:text-white disabled:opacity-40"
              >
                {era}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-white/5 p-1 ring-1 ring-white/10" role="group" aria-label="Filter by region">
            {REGIONS.map((r) => (
              <button key={r} onClick={() => setRegion(r)} aria-pressed={region === r}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${region === r ? "bg-teal-500 text-navy-950" : "text-navy-100 hover:text-white"}`}>
                {r}
              </button>
            ))}
          </div>
          {view === "timeline" && (
            <div className="flex items-center rounded-full bg-white/5 p-1 ring-1 ring-white/10">
              <button onClick={() => zoomBy(1 / 1.4)} aria-label="Zoom out" className="rounded-full p-1.5 text-white hover:bg-white/10"><Minus className="h-4 w-4" /></button>
              <span className="w-12 text-center text-[11px] text-navy-200">{Math.round((zoom / 16) * 100)}%</span>
              <button onClick={() => zoomBy(1.4)} aria-label="Zoom in" className="rounded-full p-1.5 text-white hover:bg-white/10"><Plus className="h-4 w-4" /></button>
            </div>
          )}
          <button onClick={() => setView(view === "timeline" ? "list" : "timeline")}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/10 hover:bg-white/10">
            {view === "timeline" ? <><List className="h-4 w-4" /> List view</> : <><Rows3 className="h-4 w-4" /> Timeline view</>}
          </button>
        </div>
      </div>

      {view === "timeline" ? (
        <div
          ref={scroller}
          className="no-scrollbar relative mt-6 cursor-grab overflow-x-auto overflow-y-hidden rounded-2xl bg-navy-900/60 ring-1 ring-white/10 active:cursor-grabbing"
          onWheel={(e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15); } }}
          tabIndex={0} aria-label="Interactive history timeline. Scroll or drag horizontally; use the zoom buttons to zoom."
        >
          <div className="relative" style={{ width, height }}>
            {/* axis */}
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500/10 via-teal-400 to-pulse-500/70" style={{ top: axisY }} />
            <div className="absolute border-l border-dashed border-white/30" style={{ left: x(BREAK) - 6, top: axisY - 14, height: 28 }} title="Scale changes here" />
            {ticks.map((t) => (
              <div key={t} className="absolute select-none text-[10px] text-navy-300" style={{ left: x(t), top: axisY + 8, transform: "translateX(-50%)" }}>
                <div className="mx-auto mb-1 h-2 w-px bg-white/30" style={{ marginTop: -10 }} />
                {t}
              </div>
            ))}
            {placed.map(({ m, px, side, level }) => {
              const top = side === "up" ? axisY - (level + 1) * LEVEL_H + 8 : axisY + 30 + level * LEVEL_H;
              const lineTop = side === "up" ? top + 62 : axisY;
              const lineH = side === "up" ? axisY - (top + 62) : top - axisY;
              const colour = m.region === "Tanzania" ? "bg-pulse-500" : m.region === "Africa" ? "bg-amber-400" : "bg-teal-400";
              return (
                <div key={m.id}>
                  <div className="absolute w-px bg-white/20" style={{ left: px, top: lineTop, height: lineH }} />
                  <span className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-navy-900 ${colour}`} style={{ left: px, top: axisY + 1 }} />
                  <motion.button
                    layout
                    initial={{ opacity: 0, y: side === "up" ? 10 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: side === "up" ? -3 : 3 }}
                    onClick={() => setSelected(m)}
                    className={`absolute overflow-hidden rounded-xl border p-3 text-left backdrop-blur transition ${
                      selected?.id === m.id ? "border-teal-400 bg-teal-500/15" : "border-white/10 bg-navy-950/70 hover:border-teal-400/60"
                    } ${m.is_placeholder ? "border-dashed" : ""}`}
                    style={{ left: px, top, width: CARD_W - 10, height: 62 }}
                  >
                    <span className="block text-[11px] font-semibold text-teal-300">{m.year_label ?? m.year}{m.is_placeholder && " · placeholder"}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs font-medium leading-snug text-white">{m.title}</span>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <ol className="mt-6 space-y-3">
          {items.map((m) => (
            <li key={m.id}>
              <button onClick={() => setSelected(m)} className="flex w-full gap-4 rounded-xl border border-white/10 bg-navy-900/60 p-4 text-left hover:border-teal-400/60">
                <span className="w-24 shrink-0 font-display text-sm font-semibold text-teal-300">{m.year_label ?? m.year}</span>
                <span>
                  <span className="block font-medium text-white">{m.title}</span>
                  <span className="text-xs text-navy-300">{m.region} · {m.era}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-navy-300">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-400" /> Global</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Africa</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pulse-500" /> Tanzania</span>
        <span>Dashed cards are placeholders awaiting verified sources. Years before 1900 are compressed. Ctrl/⌘ + scroll to zoom.</span>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.aside
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className="relative mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-navy-900 to-navy-950 p-6 sm:p-8"
            aria-live="polite"
          >
            <button onClick={() => setSelected(null)} aria-label="Close details" className="absolute right-4 top-4 rounded-full p-1.5 text-navy-200 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-3xl font-semibold text-teal-300">{selected.year_label ?? selected.year}</span>
              <span className="chip !bg-white/10 !text-navy-100">{selected.era}</span>
              <span className="chip !bg-white/10 !text-navy-100">{selected.region}</span>
              {selected.is_placeholder ? <span className="badge-placeholder">Placeholder</span> : selected.verified && <span className="chip !bg-teal-500/20 !text-teal-200">Referenced</span>}
            </div>
            <h3 className="mt-3 font-display text-2xl font-semibold text-white">{selected.title}</h3>
            <p className="mt-3 max-w-3xl text-navy-100">{selected.description}</p>
            {selected.people && (
              <p className="mt-4 flex items-center gap-2 text-sm text-navy-200"><Users className="h-4 w-4 text-teal-300" /> {selected.people}</p>
            )}
            {selected.references.length > 0 && (
              <div className="mt-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-300"><BookMarked className="h-4 w-4" /> References</p>
                <ul className="mt-2 space-y-1.5 text-sm text-navy-100">
                  {selected.references.map((r) => (
                    <li key={r.label}>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 hover:text-teal-300">
                          {r.label} <ExternalLink className="mt-1 h-3 w-3 shrink-0" />
                        </a>
                      ) : r.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selected.is_placeholder && (
              <a href="/submit?type=timeline" className="btn-primary mt-6">Contribute verified information</a>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
