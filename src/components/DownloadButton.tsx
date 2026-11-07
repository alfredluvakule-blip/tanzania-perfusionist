"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, Loader2, X } from "lucide-react";
import { getBrowserSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";

type Visitor = { name: string; email: string; workplace: string };
const STORE = "tp-downloader";

function loadVisitor(): Visitor | null {
  try {
    const v = JSON.parse(localStorage.getItem(STORE) ?? "null");
    return v?.name && v?.email ? v : null;
  } catch {
    return null;
  }
}

function saveVisitor(v: Visitor) {
  try { localStorage.setItem(STORE, JSON.stringify(v)); } catch { /* private mode */ }
}

/** Supabase Storage serves a file as an attachment when ?download is added. */
function downloadHref(href: string) {
  return href.includes("/storage/v1/object/public/") ? `${href}${href.includes("?") ? "&" : "?"}download=` : href;
}

/**
 * Download (or Open, for external links) button. Before the first download a visitor
 * gives their name and email, which is saved in the download log editors see in /admin.
 * The details are remembered on this device so later downloads are one click.
 */
export function DownloadButton({ resourceKey, title, href, isFile }: { resourceKey: string; title: string; href: string; isFile: boolean }) {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Visitor>({ name: "", email: "", workplace: "" });
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const saved = loadVisitor();
    setForm({
      name: saved?.name ?? profile?.full_name ?? "",
      email: saved?.email ?? user?.email ?? "",
      workplace: saved?.workplace ?? "",
    });
  }, [user, profile]);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  function deliver() {
    const a = document.createElement("a");
    a.href = isFile ? downloadHref(href) : href;
    // Files are served as attachments, so they download without leaving the page.
    // External links open in a new tab.
    if (isFile) a.download = "";
    else { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function record(v: Visitor) {
    const sb = getBrowserSupabase();
    if (!sb) return;
    await sb.from("resource_downloads").insert({
      resource_key: resourceKey,
      resource_title: title.slice(0, 300),
      name: v.name.trim(),
      email: v.email.trim(),
      workplace: v.workplace.trim() || null,
    });
  }

  function onClick() {
    if (!isSupabaseConfigured) return deliver();
    const saved = loadVisitor();
    if (saved) {
      deliver();
      record(saved);
      return;
    }
    setOpen(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) { setError("Please enter a valid email address."); return; }
    setError(null);
    saveVisitor(form);
    // Deliver inside the click so browsers do not block the new tab, then log it.
    deliver();
    setBusy(true);
    await record(form);
    setBusy(false);
    setOpen(false);
  }

  return (
    <>
      <button type="button" onClick={onClick} className="btn-primary mt-4 w-full justify-center">
        {isFile ? <><Download className="h-4 w-4" /> Download</> : <><ExternalLink className="h-4 w-4" /> Open</>}
      </button>
      <dialog ref={dialog} onClose={() => setOpen(false)} className="w-[min(92vw,28rem)] rounded-2xl p-0 backdrop:bg-navy-950/60">
        <form onSubmit={onSubmit} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-xl font-semibold">Before you download</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1 text-navy-500 hover:bg-navy-50"><X className="h-5 w-5" /></button>
          </div>
          <p className="mt-2 text-sm text-navy-600">Tell us who you are so we know who uses these resources. We ask only once on this device.</p>
          <p className="mt-3 rounded-xl bg-navy-50 p-3 text-sm font-medium text-navy-800">{title}</p>
          <label className="mt-4 block text-sm font-medium" htmlFor={`n-${resourceKey}`}>Full name</label>
          <input id={`n-${resourceKey}`} required maxLength={200} className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label className="mt-3 block text-sm font-medium" htmlFor={`e-${resourceKey}`}>Email</label>
          <input id={`e-${resourceKey}`} required type="email" maxLength={320} className="input mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label className="mt-3 block text-sm font-medium" htmlFor={`w-${resourceKey}`}>Hospital or school <span className="font-normal text-navy-500">(optional)</span></label>
          <input id={`w-${resourceKey}`} maxLength={200} className="input mt-1" value={form.workplace} onChange={(e) => setForm({ ...form, workplace: e.target.value })} />
          {error && <p className="mt-3 text-sm text-pulse-700">{error}</p>}
          <button disabled={busy} className="btn-primary mt-5 w-full justify-center">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {isFile ? "Download" : "Open"}
          </button>
          <p className="mt-3 text-xs text-navy-500">Only the site administrators can see these details. They are not shared or used for marketing.</p>
        </form>
      </dialog>
    </>
  );
}
