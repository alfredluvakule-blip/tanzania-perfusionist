"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3, Check, ChevronLeft, ClipboardCheck, FileText, Inbox, LayoutDashboard, Loader2, LogOut,
  Mail, Pencil, Plus, Search, Trash2, Users, X,
} from "lucide-react";
import { getBrowserSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { COLLECTIONS, ROLE_LABEL, can, getCollection, type Collection } from "@/lib/cms";
import { ContentForm } from "@/components/cms/ContentForm";
import type { Role, Status } from "@/lib/types";
import { LogoMark } from "@/components/Logo";

type Row = Record<string, unknown> & { id: string; status?: Status; created_at?: string };
type Tab = "overview" | "review" | "users" | "messages" | "newsletter" | "analytics" | `c:${string}`;

const STATUS_STYLE: Record<string, string> = {
  published: "bg-teal-50 text-teal-700", pending_review: "bg-amber-100 text-amber-800", draft: "bg-navy-50 text-navy-600",
  rejected: "bg-pulse-500/10 text-pulse-700", archived: "bg-navy-100 text-navy-500",
};

export default function Admin() {
  const { user, profile, role, ready } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  if (!isSupabaseConfigured) return <Shell><SetupNotice /></Shell>;
  if (!ready) return <Shell><p className="flex items-center gap-2 text-navy-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p></Shell>;
  if (!user) return <Shell><Gate title="Sign in required" text="Sign in with an editor or contributor account to manage content." href="/login" cta="Sign in" /></Shell>;
  if (!can(role, "contributor"))
    return <Shell><Gate title="Member account" text="Registered members can submit stories and discussions for review. Ask an administrator if you need contributor or editor access." href="/submit" cta="Submit content" /></Shell>;

  const isEditor = can(role, "editor");
  const nav: { id: Tab; label: string; icon: typeof FileText; show: boolean }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, show: true },
    { id: "review", label: "Review queue", icon: ClipboardCheck, show: isEditor },
    ...COLLECTIONS.map((c) => ({ id: `c:${c.key}` as Tab, label: c.label, icon: FileText, show: true })),
    { id: "users", label: "Users & roles", icon: Users, show: role === "super_admin" },
    { id: "messages", label: "Contact messages", icon: Inbox, show: isEditor },
    { id: "newsletter", label: "Newsletter", icon: Mail, show: isEditor },
    { id: "analytics", label: "Analytics", icon: BarChart3, show: isEditor },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-16">
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-navy-100 bg-white p-4 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center gap-3 px-2">
            <LogoMark className="h-8 w-8" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{profile?.full_name ?? user.email}</p>
              <p className="text-xs text-teal-700">{role && ROLE_LABEL[role]}</p>
            </div>
          </div>
          <nav className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
            {nav.filter((n) => n.show).map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${tab === id ? "bg-navy-900 text-white" : "text-navy-700 hover:bg-navy-50"}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
            <button onClick={async () => { await getBrowserSupabase()?.auth.signOut(); location.href = "/"; }}
              className="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-navy-500 hover:bg-navy-50 lg:mt-4">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
        </aside>
        <main className="min-w-0 p-4 sm:p-8">
          {tab === "overview" && <Overview isEditor={isEditor} go={setTab} />}
          {tab === "review" && <ReviewQueue />}
          {tab.startsWith("c:") && <CollectionManager key={tab} collection={getCollection(tab.slice(2))!} role={role!} userId={user.id} />}
          {tab === "users" && <UsersPanel />}
          {tab === "messages" && <SimpleTable table="contact_messages" cols={["created_at", "name", "email", "topic", "message"]} title="Contact messages" />}
          {tab === "newsletter" && <SimpleTable table="newsletter_subscribers" cols={["created_at", "email"]} title="Newsletter subscribers" exportCsv />}
          {tab === "analytics" && <Analytics />}
        </main>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="container-x flex min-h-[70vh] items-center justify-center pt-24">{children}</div>;
}
function Gate({ title, text, href, cta }: { title: string; text: string; href: string; cta: string }) {
  return (
    <div className="card max-w-md p-8 text-center">
      <LogoMark className="mx-auto h-12 w-12" />
      <h1 className="mt-4 font-display text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-navy-600">{text}</p>
      <Link href={href} className="btn-primary mt-6">{cta}</Link>
    </div>
  );
}
function SetupNotice() {
  return (
    <div className="card max-w-2xl p-8">
      <h1 className="font-display text-2xl font-semibold">Connect Supabase to enable the dashboard</h1>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-navy-700">
        <li>Create a project at supabase.com.</li>
        <li>Open the SQL editor and run <code className="rounded bg-navy-50 px-1">supabase/schema.sql</code> from this repository.</li>
        <li>Copy the project URL and anon key into <code className="rounded bg-navy-50 px-1">.env.local</code> (see <code>.env.example</code>) or your hosting provider&apos;s environment variables.</li>
        <li>Sign up on the site, then promote your account: <code className="rounded bg-navy-50 px-1">update profiles set role = &apos;super_admin&apos; where id = (select id from auth.users where email = &apos;you@example.com&apos;);</code></li>
      </ol>
      <p className="mt-4 text-sm text-navy-500">Until then the public site shows the built-in sample and reference content.</p>
    </div>
  );
}

function Overview({ isEditor, go }: { isEditor: boolean; go: (t: Tab) => void }) {
  const [counts, setCounts] = useState<Record<string, { total: number; pending: number }>>({});
  useEffect(() => {
    const sb = getBrowserSupabase()!;
    COLLECTIONS.forEach(async (c) => {
      const [{ count: total }, { count: pending }] = await Promise.all([
        sb.from(c.table).select("id", { count: "exact", head: true }),
        sb.from(c.table).select("id", { count: "exact", head: true }).eq("status", "pending_review"),
      ]);
      setCounts((s) => ({ ...s, [c.key]: { total: total ?? 0, pending: pending ?? 0 } }));
    });
  }, []);
  const pending = Object.values(counts).reduce((a, c) => a + c.pending, 0);
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      {isEditor && (
        <button onClick={() => go("review")} className="mt-6 flex w-full items-center justify-between rounded-2xl bg-navy-900 p-6 text-left text-white">
          <span><span className="block text-sm text-navy-200">Awaiting review</span><span className="font-display text-4xl font-semibold">{pending}</span></span>
          <span className="btn-primary">Open review queue</span>
        </button>
      )}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {COLLECTIONS.map((c) => (
          <button key={c.key} onClick={() => go(`c:${c.key}`)} className="card p-5 text-left transition hover:shadow-xl">
            <p className="text-sm text-navy-500">{c.label}</p>
            <p className="mt-1 font-display text-3xl font-semibold">{counts[c.key]?.total ?? "–"}</p>
            {!!counts[c.key]?.pending && <p className="mt-1 text-xs font-semibold text-amber-700">{counts[c.key].pending} pending</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewQueue() {
  const [items, setItems] = useState<{ c: Collection; row: Row }[] | null>(null);
  const [editing, setEditing] = useState<{ c: Collection; row: Row } | null>(null);
  const [note, setNote] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const sb = getBrowserSupabase()!;
    const all = await Promise.all(
      COLLECTIONS.map(async (c) => {
        const { data } = await sb.from(c.table).select("*").eq("status", "pending_review").order("created_at");
        return ((data as Row[]) ?? []).map((row) => ({ c, row }));
      }),
    );
    setItems(all.flat());
  }, []);
  useEffect(() => { load(); }, [load]);

  async function decide(c: Collection, row: Row, status: Status) {
    const sb = getBrowserSupabase()!;
    await sb.from(c.table).update({ status, review_note: note[row.id] ?? null }).eq("id", row.id);
    load();
  }

  if (editing)
    return (
      <div>
        <button onClick={() => setEditing(null)} className="mb-4 inline-flex items-center gap-1 text-sm text-teal-700"><ChevronLeft className="h-4 w-4" /> Back to queue</button>
        <div className="card p-6"><ContentForm collection={editing.c} initial={editing.row} mode="admin" onSaved={() => { setEditing(null); load(); }} /></div>
      </div>
    );

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Review queue</h1>
      <p className="mt-1 text-navy-600">Check accuracy, sources, anonymisation and permissions before publishing.</p>
      {items === null ? <p className="mt-6 text-navy-500">Loading…</p> : items.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-navy-600">Nothing waiting for review.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map(({ c, row }) => {
            const consent = (row.consent as Record<string, boolean>) ?? {};
            return (
              <article key={`${c.key}-${row.id}`} className="card p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs"><span className="chip">{c.label}</span><span className="text-navy-500">{row.created_at && new Date(row.created_at).toLocaleString("en-GB")}</span></div>
                <h2 className="mt-2 font-display text-lg font-semibold">{String(row[c.titleField] ?? "Untitled")}</h2>
                {c.consents && (
                  <ul className="mt-3 space-y-1 text-xs">
                    {c.consents.map((k) => (
                      <li key={k.key} className={`flex items-center gap-1.5 ${consent[k.key] ? "text-teal-700" : "text-pulse-600"}`}>
                        {consent[k.key] ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}{k.label}
                      </li>
                    ))}
                  </ul>
                )}
                <input placeholder="Note to contributor (optional)" className="input mt-3" value={note[row.id] ?? ""} onChange={(e) => setNote((s) => ({ ...s, [row.id]: e.target.value }))} />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => decide(c, row, "published")} className="btn-primary !py-2"><Check className="h-4 w-4" /> Approve & publish</button>
                  <button onClick={() => setEditing({ c, row })} className="btn-outline !py-2"><Pencil className="h-4 w-4" /> Review & edit</button>
                  <button onClick={() => decide(c, row, "rejected")} className="btn-outline !py-2 !text-pulse-600"><X className="h-4 w-4" /> Reject</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CollectionManager({ collection: c, role, userId }: { collection: Collection; role: Role; userId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const isEditor = can(role, "editor");

  const load = useCallback(async () => {
    const { data } = await getBrowserSupabase()!.from(c.table).select("*").order("created_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  }, [c.table]);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(
    () => (rows ?? []).filter((r) => (status === "all" || r.status === status) && String(r[c.titleField] ?? "").toLowerCase().includes(q.toLowerCase())),
    [rows, q, status, c.titleField],
  );

  async function setRowStatus(r: Row, s: Status) { await getBrowserSupabase()!.from(c.table).update({ status: s }).eq("id", r.id); load(); }
  async function remove(r: Row) { await getBrowserSupabase()!.from(c.table).delete().eq("id", r.id); setConfirmDel(null); load(); }

  if (editing)
    return (
      <div>
        <button onClick={() => setEditing(null)} className="mb-4 inline-flex items-center gap-1 text-sm text-teal-700"><ChevronLeft className="h-4 w-4" /> {c.label}</button>
        <h1 className="mb-6 font-display text-2xl font-semibold">{editing === "new" ? `New ${c.singular}` : `Edit ${c.singular}`}</h1>
        <div className="card p-6">
          <ContentForm collection={c} initial={editing === "new" ? undefined : editing} mode={isEditor ? "admin" : "submit"}
            hideFields={isEditor ? [] : ["verified"]} onSaved={() => { setEditing(null); load(); }} />
        </div>
      </div>
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">{c.label}</h1>
        <button onClick={() => setEditing("new")} className="btn-primary"><Plus className="h-4 w-4" /> New {c.singular}</button>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-navy-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="input !pl-9" /></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !w-auto">
          {["all", "published", "pending_review", "draft", "rejected", "archived"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
      </div>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-navy-100 text-left text-xs uppercase tracking-wider text-navy-500">
            <tr><th className="p-4">Title</th><th className="p-4">Status</th><th className="p-4">Updated</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {rows === null && <tr><td className="p-4 text-navy-500" colSpan={4}>Loading…</td></tr>}
            {rows && shown.length === 0 && <tr><td className="p-4 text-navy-500" colSpan={4}>No {c.label.toLowerCase()} yet.</td></tr>}
            {shown.map((r) => {
              const own = r.created_by === userId;
              return (
                <tr key={r.id} className="border-b border-navy-50 last:border-0">
                  <td className="p-4 font-medium">{String(r[c.titleField] ?? "Untitled")}</td>
                  <td className="p-4"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[r.status ?? "draft"]}`}>{(r.status ?? "draft").replace("_", " ")}</span></td>
                  <td className="p-4 text-navy-500">{r.updated_at ? new Date(String(r.updated_at)).toLocaleDateString("en-GB") : ""}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      {(isEditor || own) && <button onClick={() => setEditing(r)} className="rounded-lg p-2 hover:bg-navy-50" aria-label="Edit"><Pencil className="h-4 w-4" /></button>}
                      {isEditor && r.status !== "published" && <button onClick={() => setRowStatus(r, "published")} className="rounded-lg p-2 text-teal-700 hover:bg-teal-50" aria-label="Publish"><Check className="h-4 w-4" /></button>}
                      {isEditor && r.status === "published" && <button onClick={() => setRowStatus(r, "archived")} className="rounded-lg px-2 text-xs hover:bg-navy-50">Unpublish</button>}
                      {isEditor && (confirmDel === r.id ? (
                        <button onClick={() => remove(r)} className="rounded-lg bg-pulse-600 px-2 text-xs font-semibold text-white">Confirm delete</button>
                      ) : (
                        <button onClick={() => setConfirmDel(r.id)} className="rounded-lg p-2 text-pulse-600 hover:bg-pulse-500/10" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState<{ id: string; full_name: string | null; email: string | null; role: Role; created_at: string }[]>([]);
  const load = useCallback(async () => {
    const { data } = await getBrowserSupabase()!.from("profiles").select("id, full_name, email, role, created_at").order("created_at", { ascending: false });
    setUsers((data as typeof users) ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);
  async function setRole(id: string, role: Role) { await getBrowserSupabase()!.from("profiles").update({ role }).eq("id", id); load(); }
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Users & roles</h1>
      <p className="mt-1 text-sm text-navy-600">General visitors need no account. Registered members can submit stories and discussions; contributors can submit all content types; editors review and publish; super administrators also manage roles.</p>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-navy-100 text-left text-xs uppercase tracking-wider text-navy-500"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Joined</th><th className="p-4">Role</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-navy-50 last:border-0">
                <td className="p-4 font-medium">{u.full_name ?? "–"}</td>
                <td className="p-4 text-navy-600">{u.email}</td>
                <td className="p-4 text-navy-500">{new Date(u.created_at).toLocaleDateString("en-GB")}</td>
                <td className="p-4">
                  <select value={u.role} onChange={(e) => setRole(u.id, e.target.value as Role)} className="input !w-auto !py-1.5">
                    {(Object.keys(ROLE_LABEL) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SimpleTable({ table, cols, title, exportCsv }: { table: string; cols: string[]; title: string; exportCsv?: boolean }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    getBrowserSupabase()!.from(table).select(cols.join(",")).order("created_at", { ascending: false }).limit(500)
      .then(({ data }) => setRows((data as unknown as Record<string, unknown>[]) ?? []));
  }, [table, cols]);
  const csv = () => {
    const body = [cols.join(","), ...rows.map((r) => cols.map((c) => JSON.stringify(r[c] ?? "")).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" }));
    a.download = `${table}.csv`; a.click();
  };
  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="font-display text-3xl font-semibold">{title}</h1>{exportCsv && <button onClick={csv} className="btn-outline">Export CSV</button>}</div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-navy-100 text-left text-xs uppercase tracking-wider text-navy-500"><tr>{cols.map((c) => <th key={c} className="p-4">{c.replace("_", " ")}</th>)}</tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td className="p-4 text-navy-500" colSpan={cols.length}>Nothing yet.</td></tr>}
            {rows.map((r, i) => <tr key={i} className="border-b border-navy-50 align-top last:border-0">{cols.map((c) => <td key={c} className="max-w-md p-4">{c === "created_at" ? new Date(String(r[c])).toLocaleString("en-GB") : String(r[c] ?? "")}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Analytics() {
  const [stats, setStats] = useState<{ path: string; views: number }[]>([]);
  const [daily, setDaily] = useState<{ day: string; views: number }[]>([]);
  useEffect(() => {
    const sb = getBrowserSupabase()!;
    sb.from("page_view_stats").select("*").then(({ data }) => setStats((data as typeof stats) ?? []));
    sb.from("page_view_daily").select("*").then(({ data }) => setDaily((data as typeof daily) ?? []));
  }, []);
  const total = daily.reduce((a, d) => a + d.views, 0);
  const max = Math.max(1, ...daily.map((d) => d.views));
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Analytics</h1>
      <p className="mt-1 text-sm text-navy-600">Anonymous page views for the last 30 days (no personal data stored).</p>
      <div className="card mt-6 p-6">
        <p className="text-sm text-navy-500">Total views</p>
        <p className="font-display text-4xl font-semibold">{total.toLocaleString()}</p>
        <div className="mt-6 flex h-40 items-end gap-1" role="img" aria-label="Daily page views, last 30 days">
          {daily.map((d) => (
            <div key={d.day} title={`${d.day}: ${d.views}`} className="flex-1 rounded-t bg-teal-500/80 hover:bg-teal-600" style={{ height: `${(d.views / max) * 100}%` }} />
          ))}
        </div>
      </div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-navy-100 text-left text-xs uppercase tracking-wider text-navy-500"><tr><th className="p-4">Page</th><th className="p-4 text-right">Views</th></tr></thead>
          <tbody>{stats.map((s) => <tr key={s.path} className="border-b border-navy-50 last:border-0"><td className="p-4">{s.path}</td><td className="p-4 text-right tabular-nums">{s.views}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
