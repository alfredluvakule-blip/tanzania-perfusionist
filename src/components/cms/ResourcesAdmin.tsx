"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Loader2, Trash2, Upload } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase";
import { COURSES, fileFormat } from "@/lib/resources";

type Row = {
  id: string; kind: "presentation" | "book"; course: string | null; title: string; author: string; year: string | null;
  file_path: string | null; file_name: string | null; file_size: number | null; external_url: string | null; created_at: string;
};

const ACCEPT = ".pdf,.ppt,.pptx,.doc,.docx,.epub";
const MAX_BYTES = 50 * 1024 * 1024;
const EMPTY = { kind: "presentation", course: "CVP 1", title: "", author: "", year: String(new Date().getFullYear()), description: "", source: "", licence: "", external_url: "" };

function slug(name: string) {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  return `${base || "file"}${dot > 0 ? name.slice(dot).toLowerCase() : ""}`;
}

/** Admin: upload presentations and books, and remove them. Editors and super admins only. */
export function ResourcesManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const load = useCallback(async () => {
    const sb = getBrowserSupabase()!;
    const [{ data }, { data: stats }] = await Promise.all([
      sb.from("resources").select("id, kind, course, title, author, year, file_path, file_name, file_size, external_url, created_at").order("created_at", { ascending: false }),
      sb.from("resource_download_stats").select("resource_key, downloads"),
    ]);
    setRows((data as Row[]) ?? []);
    setCounts(Object.fromEntries(((stats as { resource_key: string; downloads: number }[]) ?? []).map((s) => [s.resource_key, s.downloads])));
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!file && !form.external_url) return setMsg({ ok: false, text: "Choose a file to upload, or paste a link." });
    if (file && file.size > MAX_BYTES) return setMsg({ ok: false, text: "That file is over 50 MB. Upload it to Google Drive and paste the share link instead." });
    setBusy(true);
    const sb = getBrowserSupabase()!;
    let file_path: string | null = null;
    if (file) {
      file_path = `${form.kind === "book" ? "books" : "presentations"}/${Date.now()}-${slug(file.name)}`;
      const { error } = await sb.storage.from("resources").upload(file_path, file, { upsert: false, contentType: file.type || undefined });
      if (error) { setBusy(false); return setMsg({ ok: false, text: `Upload failed: ${error.message}` }); }
    }
    const { error } = await sb.from("resources").insert({
      kind: form.kind,
      course: form.kind === "presentation" ? form.course : null,
      title: form.title.trim(),
      author: form.author.trim(),
      year: form.year.trim() || null,
      description: form.description.trim() || null,
      source: form.source.trim() || null,
      licence: form.licence.trim() || null,
      external_url: file ? null : form.external_url.trim(),
      file_path,
      file_name: file?.name ?? null,
      file_size: file?.size ?? null,
      status: "published",
    });
    if (error) {
      if (file_path) await sb.storage.from("resources").remove([file_path]);
      setBusy(false);
      return setMsg({ ok: false, text: `Could not save: ${error.message}` });
    }
    setBusy(false);
    setMsg({ ok: true, text: `"${form.title}" is now on the Resources page.` });
    setForm({ ...EMPTY, kind: form.kind, course: form.course, author: form.author });
    setFile(null);
    setFileKey((k) => k + 1);
    load();
  }

  async function remove(r: Row) {
    const sb = getBrowserSupabase()!;
    if (r.file_path) await sb.storage.from("resources").remove([r.file_path]);
    await sb.from("resources").delete().eq("id", r.id);
    setConfirmDel(null);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Resources</h1>
      <p className="mt-1 text-sm text-navy-600">Upload presentations and books. They appear on the public <a className="text-teal-700 underline" href="/resources" target="_blank">Resources page</a> straight away. PDF, PowerPoint, Word or EPUB, up to 50 MB.</p>

      <form onSubmit={submit} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
        <label className="text-sm font-medium">Type
          <select className="input mt-1" value={form.kind} onChange={(e) => set("kind", e.target.value)}>
            <option value="presentation">Presentation</option>
            <option value="book">Book</option>
          </select>
        </label>
        {form.kind === "presentation" ? (
          <label className="text-sm font-medium">Course
            <select className="input mt-1" value={form.course} onChange={(e) => set("course", e.target.value)}>
              <optgroup label="Year 1"><option>CVP 1</option><option>CVP 2</option></optgroup>
              <optgroup label="Year 2"><option>CVP 3</option><option>CVP 4</option></optgroup>
              <option value="Other">Other (no course)</option>
            </select>
          </label>
        ) : <div className="hidden sm:block" />}
        <label className="text-sm font-medium sm:col-span-2">Title
          <input required maxLength={300} className="input mt-1" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </label>
        <label className="text-sm font-medium">{form.kind === "book" ? "Author(s)" : "Presenter"}
          <input required maxLength={300} className="input mt-1" value={form.author} onChange={(e) => set("author", e.target.value)} />
        </label>
        <label className="text-sm font-medium">Year
          <input maxLength={20} className="input mt-1" value={form.year} onChange={(e) => set("year", e.target.value)} />
        </label>
        <label className="text-sm font-medium sm:col-span-2">Short description <span className="font-normal text-navy-500">(optional)</span>
          <textarea maxLength={2000} rows={2} className="input mt-1" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </label>
        <label className="text-sm font-medium">{form.kind === "book" ? "Publisher" : "Event or lecture"} <span className="font-normal text-navy-500">(optional)</span>
          <input maxLength={300} className="input mt-1" value={form.source} onChange={(e) => set("source", e.target.value)} />
        </label>
        <label className="text-sm font-medium">Licence or permission <span className="font-normal text-navy-500">(optional)</span>
          <input maxLength={200} placeholder="e.g. Open access, CC BY 4.0" className="input mt-1" value={form.licence} onChange={(e) => set("licence", e.target.value)} />
        </label>
        <label className="text-sm font-medium">File
          <input key={fileKey} type="file" accept={ACCEPT} className="input mt-1 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-900 file:px-3 file:py-1 file:text-white" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <label className="text-sm font-medium">…or a link <span className="font-normal text-navy-500">(Google Drive, publisher)</span>
          <input type="url" disabled={Boolean(file)} placeholder="https://" className="input mt-1" value={form.external_url} onChange={(e) => set("external_url", e.target.value)} />
        </label>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button disabled={busy} className="btn-primary">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {busy ? "Uploading…" : "Upload and publish"}</button>
          {msg && <p className={`text-sm ${msg.ok ? "text-teal-700" : "text-pulse-700"}`}>{msg.text}</p>}
        </div>
        <p className="text-xs text-navy-500 sm:col-span-2">Only upload material you wrote or have permission to share, with no patient-identifying details.</p>
      </form>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-navy-100 text-left text-xs uppercase tracking-wider text-navy-500">
            <tr><th className="p-4">Title</th><th className="p-4">Category</th><th className="p-4">File</th><th className="p-4 text-right">Downloads</th><th className="p-4" /></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="p-4 text-navy-500">Nothing uploaded yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-navy-50 last:border-0">
                <td className="p-4"><p className="font-medium">{r.title}</p><p className="text-xs text-navy-500">{r.author}{r.year && ` · ${r.year}`}</p></td>
                <td className="p-4">{r.kind === "book" ? "Book" : r.course ?? "Presentation"}</td>
                <td className="p-4 text-navy-600">{r.file_path ? fileFormat(r.file_name, r.file_size) : "Link"}</td>
                <td className="p-4 text-right tabular-nums">{counts[r.id] ?? 0}</td>
                <td className="p-4 text-right">
                  {confirmDel === r.id ? (
                    <button onClick={() => remove(r)} className="rounded-lg bg-pulse-600 px-2 py-1 text-xs font-semibold text-white">Confirm delete</button>
                  ) : (
                    <button onClick={() => setConfirmDel(r.id)} className="rounded-lg p-2 text-pulse-600 hover:bg-pulse-500/10" aria-label={`Delete ${r.title}`}><Trash2 className="h-4 w-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-navy-500">Course list: {COURSES.join(", ")}.</p>
    </div>
  );
}

type Dl = { created_at: string; name: string; email: string; workplace: string | null; resource_title: string };
type Stat = { resource_key: string; resource_title: string; downloads: number; people: number; last_download: string };

/** Admin: who downloaded which file, with totals per file and CSV export. */
export function DownloadsPanel() {
  const [log, setLog] = useState<Dl[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    const sb = getBrowserSupabase()!;
    sb.from("resource_downloads").select("created_at, name, email, workplace, resource_title").order("created_at", { ascending: false }).limit(1000)
      .then(({ data }) => setLog((data as Dl[]) ?? []));
    sb.from("resource_download_stats").select("*").then(({ data }) => setStats((data as Stat[]) ?? []));
  }, []);

  const shown = log.filter((d) => !q || [d.name, d.email, d.workplace, d.resource_title].join(" ").toLowerCase().includes(q.toLowerCase()));
  const people = new Set(log.map((d) => d.email.toLowerCase())).size;

  function csv() {
    const cols = ["created_at", "name", "email", "workplace", "resource_title"] as const;
    const body = [cols.join(","), ...shown.map((r) => cols.map((c) => JSON.stringify(r[c] ?? "")).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = "downloads.csv";
    a.click();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Downloads</h1>
        <button onClick={csv} className="btn-outline"><Download className="h-4 w-4" /> Export CSV</button>
      </div>
      <p className="mt-1 text-sm text-navy-600">Everyone who downloaded a presentation or book, with the name and email they gave.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[["Downloads", log.length], ["People", people], ["Files downloaded", stats.length]].map(([l, v]) => (
          <div key={l} className="card p-5"><p className="text-sm text-navy-500">{l}</p><p className="font-display text-3xl font-semibold tabular-nums">{Number(v).toLocaleString()}</p></div>
        ))}
      </div>

      <h2 className="mt-8 font-display text-xl font-semibold">By file</h2>
      <div className="card mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="border-b border-navy-100 text-left text-xs uppercase tracking-wider text-navy-500"><tr><th className="p-4">File</th><th className="p-4 text-right">Downloads</th><th className="p-4 text-right">People</th><th className="p-4">Last</th></tr></thead>
          <tbody>
            {stats.length === 0 && <tr><td colSpan={4} className="p-4 text-navy-500">No downloads yet.</td></tr>}
            {stats.map((s) => (
              <tr key={s.resource_key} className="border-b border-navy-50 last:border-0">
                <td className="p-4 font-medium">{s.resource_title}</td>
                <td className="p-4 text-right tabular-nums">{s.downloads}</td>
                <td className="p-4 text-right tabular-nums">{s.people}</td>
                <td className="p-4 text-navy-500">{new Date(s.last_download).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Who downloaded</h2>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, file…" className="input !w-64" />
      </div>
      <div className="card mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-navy-100 text-left text-xs uppercase tracking-wider text-navy-500"><tr><th className="p-4">When</th><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Hospital or school</th><th className="p-4">File</th></tr></thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={5} className="p-4 text-navy-500">Nothing yet.</td></tr>}
            {shown.map((d, i) => (
              <tr key={i} className="border-b border-navy-50 align-top last:border-0">
                <td className="whitespace-nowrap p-4 text-navy-500">{new Date(d.created_at).toLocaleString("en-GB")}</td>
                <td className="p-4 font-medium">{d.name}</td>
                <td className="p-4"><a className="text-teal-700 hover:underline" href={`mailto:${d.email}`}>{d.email}</a></td>
                <td className="p-4 text-navy-600">{d.workplace ?? "–"}</td>
                <td className="p-4">{d.resource_title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
