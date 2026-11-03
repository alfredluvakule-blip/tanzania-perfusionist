"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { ContentForm } from "@/components/cms/ContentForm";
import { getCollection } from "@/lib/cms";
import { fmtDate } from "@/components/Cards";

interface Thread { id: string; title: string; category: string; body: string; created_at: string; author_name?: string | null }

export function Discussions() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [composing, setComposing] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) { setThreads([]); return; }
    sb.from("discussions").select("id,title,category,body,created_at,author_name").eq("status", "published")
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setThreads((data as Thread[]) ?? []));
  }, []);

  return (
    <div className="space-y-4">
      {user ? (
        composing ? (
          <div className="card p-6"><ContentForm collection={getCollection("discussions")!} mode="submit" onSaved={() => { setComposing(false); setSent(true); }} /></div>
        ) : (
          <button onClick={() => setComposing(true)} className="btn-primary">Start a discussion</button>
        )
      ) : (
        <Link href="/login" className="btn-outline">Sign in to start a discussion</Link>
      )}
      {sent && <p className="rounded-xl bg-teal-50 p-3 text-sm text-teal-800">Thanks. Your topic will appear once a moderator approves it.</p>}
      {threads === null ? (
        <p className="text-navy-500">Loading…</p>
      ) : threads.length === 0 ? (
        <div className="card flex items-center gap-4 p-6 text-navy-600"><MessagesSquare className="h-8 w-8 text-teal-600" /> No discussions yet. Be the first to start one.</div>
      ) : (
        threads.map((t) => (
          <article key={t.id} className="card p-5">
            <div className="flex items-center gap-2 text-xs text-navy-500"><span className="chip">{t.category}</span>{t.author_name ?? "Member"} · {fmtDate(t.created_at)}</div>
            <h3 className="mt-2 font-display text-lg font-semibold">{t.title}</h3>
            <p className="mt-1 line-clamp-3 text-sm text-navy-700">{t.body}</p>
          </article>
        ))
      )}
    </div>
  );
}
