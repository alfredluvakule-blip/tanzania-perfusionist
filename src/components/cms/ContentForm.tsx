"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase";
import { getPath, setPath, slugify, type Collection, type Field } from "@/lib/cms";

type Row = Record<string, unknown>;

function toInput(f: Field, v: unknown): string | boolean {
  if (f.type === "boolean") return Boolean(v);
  if (v == null) return "";
  if (f.type === "tags" && Array.isArray(v)) return v.join(", ");
  if (f.type === "lines" && Array.isArray(v)) return v.join("\n");
  if (f.type === "refs" && Array.isArray(v)) return (v as { label: string; url?: string }[]).map((r) => (r.url ? `${r.label} | ${r.url}` : r.label)).join("\n");
  return String(v);
}

function fromInput(f: Field, v: string | boolean): unknown {
  if (f.type === "boolean") return Boolean(v);
  const s = String(v).trim();
  if (f.type === "number") return s === "" ? null : Number(s);
  if (f.type === "tags") return s ? s.split(",").map((t) => t.trim()).filter(Boolean) : [];
  if (f.type === "lines") return s ? s.split("\n").map((t) => t.trim()).filter(Boolean) : [];
  if (f.type === "refs")
    return s ? s.split("\n").filter((l) => l.trim()).map((l) => { const [label, url] = l.split("|").map((x) => x.trim()); return url ? { label, url } : { label }; }) : [];
  return s === "" ? null : s;
}

export function ContentForm({
  collection, initial, mode, onSaved, hideFields = [],
}: {
  collection: Collection; initial?: Row; mode: "submit" | "admin";
  onSaved?: (row: Row) => void; hideFields?: string[];
}) {
  const fields = collection.fields.filter((f) => !hideFields.includes(f.name));
  const [values, setValues] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, toInput(f, initial ? getPath(initial, f.name) : undefined)])),
  );
  const [consents, setConsents] = useState<Record<string, boolean>>(
    (initial?.consent as Record<string, boolean>) ?? {},
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setValues((s) => ({ ...s, [k]: v }));

  async function upload(name: string, file: File) {
    const sb = getBrowserSupabase();
    if (!sb) return setError("Uploads need the database connected.");
    setUploading(name);
    const { data: u } = await sb.auth.getUser();
    const path = `${u.user?.id ?? "anon"}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error: e } = await sb.storage.from("media").upload(path, file, { upsert: false });
    setUploading(null);
    if (e) return setError(`Upload failed: ${e.message}`);
    set(name, sb.storage.from("media").getPublicUrl(path).data.publicUrl);
  }

  async function save(e: React.FormEvent, publish?: boolean) {
    e.preventDefault();
    setError("");
    const missing = (collection.consents ?? []).filter((c) => !consents[c.key]);
    if (mode === "submit" && missing.length) return setError("Please confirm all permissions and approvals below before submitting.");
    const sb = getBrowserSupabase();
    if (!sb) return setError("The database is not connected yet. Add your Supabase keys to enable submissions.");

    const row: Row = {};
    fields.forEach((f) => setPath(row, f.name, fromInput(f, values[f.name])));
    if ("slug" in row && !row.slug) row.slug = slugify(String(row[collection.titleField] ?? ""));
    row.consent = consents;
    if (mode === "submit") row.status = "pending_review";
    if (mode === "admin" && publish !== undefined) row.status = publish ? "published" : "draft";

    setBusy(true);
    const q = initial?.id
      ? sb.from(collection.table).update(row).eq("id", initial.id as string).select().single()
      : sb.from(collection.table).insert(row).select().single();
    const { data, error: err } = await q;
    setBusy(false);
    if (err) return setError(err.message);
    onSaved?.(data as Row);
  }

  return (
    <form onSubmit={(e) => save(e, mode === "admin" ? undefined : undefined)} className="space-y-5">
      {fields.map((f) => {
        const id = `f-${f.name}`;
        const v = values[f.name];
        return (
          <div key={f.name}>
            {f.type === "boolean" ? (
              <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
                <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(f.name, e.target.checked)} className="h-4 w-4 rounded accent-teal-600" />
                {f.label}
              </label>
            ) : (
              <>
                <label htmlFor={id} className="label">{f.label}{f.required && <span className="text-pulse-500"> *</span>}</label>
                {f.type === "select" ? (
                  <select id={id} required={f.required} value={String(v)} onChange={(e) => set(f.name, e.target.value)} className="input">
                    <option value="">Choose…</option>
                    {f.options!.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : ["textarea", "richtext", "lines", "refs"].includes(f.type) ? (
                  <textarea id={id} required={f.required} rows={f.type === "richtext" ? 10 : 4} value={String(v)} onChange={(e) => set(f.name, e.target.value)} className="input" />
                ) : f.type === "image" ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <input id={id} type="url" value={String(v)} onChange={(e) => set(f.name, e.target.value)} placeholder="https://… or upload" className="input flex-1" />
                    <label className="btn-outline cursor-pointer !py-2">
                      {uploading === f.name ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(f.name, e.target.files[0])} />
                    </label>
                  </div>
                ) : (
                  <input id={id} required={f.required}
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                    value={String(v)} onChange={(e) => set(f.name, e.target.value)} className="input" />
                )}
              </>
            )}
            {f.help && <p className="mt-1 text-xs text-navy-500">{f.help}</p>}
          </div>
        );
      })}

      {collection.consents && (
        <fieldset className="space-y-2 rounded-2xl bg-amber-50 p-4">
          <legend className="px-1 text-sm font-semibold text-amber-900">Permissions & approvals</legend>
          {collection.consents.map((c) => (
            <label key={c.key} className="flex items-start gap-2 text-sm text-amber-900">
              <input type="checkbox" checked={!!consents[c.key]} onChange={(e) => setConsents((s) => ({ ...s, [c.key]: e.target.checked }))} className="mt-0.5 h-4 w-4 accent-teal-600" />
              {c.label}
            </label>
          ))}
        </fieldset>
      )}

      {error && <p role="alert" className="rounded-xl bg-pulse-500/10 p-3 text-sm text-pulse-700">{error}</p>}

      <div className="flex flex-wrap gap-3">
        {mode === "submit" ? (
          <button disabled={busy} className="btn-primary">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit for review</button>
        ) : (
          <>
            <button type="button" disabled={busy} onClick={(e) => save(e as unknown as React.FormEvent, true)} className="btn-primary">Save & publish</button>
            <button type="button" disabled={busy} onClick={(e) => save(e as unknown as React.FormEvent, false)} className="btn-outline">Save as draft</button>
          </>
        )}
      </div>
    </form>
  );
}
