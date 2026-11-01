"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase";

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const sb = getBrowserSupabase();
    if (!sb) return setMsg({ ok: false, text: "The contact form will work once the database is connected." });
    setBusy(true);
    const { error } = await sb.from("contact_messages").insert(data);
    setBusy(false);
    if (error) return setMsg({ ok: false, text: "Sorry, your message could not be sent. Please try again." });
    form.reset();
    setMsg({ ok: true, text: "Thank you. We'll get back to you soon." });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="c-name">Name</label><input id="c-name" name="name" required className="input" /></div>
        <div><label className="label" htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" required className="input" /></div>
      </div>
      <div>
        <label className="label" htmlFor="c-topic">Topic</label>
        <select id="c-topic" name="topic" className="input" required>
          <option>General enquiry</option><option>Partnership</option><option>Correction or removal request</option><option>Editorial / story idea</option><option>Technical problem</option>
        </select>
      </div>
      <div><label className="label" htmlFor="c-msg">Message</label><textarea id="c-msg" name="message" rows={6} required className="input" /></div>
      {msg && <p role="status" className={`rounded-xl p-3 text-sm ${msg.ok ? "bg-teal-50 text-teal-800" : "bg-pulse-500/10 text-pulse-700"}`}>{msg.text}</p>}
      <button disabled={busy} className="btn-primary">{busy && <Loader2 className="h-4 w-4 animate-spin" />}Send message</button>
    </form>
  );
}
