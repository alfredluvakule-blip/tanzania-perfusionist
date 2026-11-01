"use client";

import { useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) { setState("err"); setMsg("Newsletter sign-up will work once the database is connected."); return; }
    setState("busy");
    const { error } = await sb.from("newsletter_subscribers").insert({ email });
    if (error && !error.message.includes("duplicate")) { setState("err"); setMsg("Could not subscribe. Please try again."); return; }
    setState("ok"); setMsg("Thank you. You're subscribed."); setEmail("");
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="flex gap-2 rounded-full bg-white/5 p-1 ring-1 ring-white/10 focus-within:ring-teal-400">
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@hospital.org"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-navy-300 focus:outline-none"
        />
        <button disabled={state === "busy"} className="btn-primary !py-2">Subscribe</button>
      </div>
      {msg && <p role="status" className={`mt-2 text-xs ${state === "ok" ? "text-teal-300" : "text-amber-300"}`}>{msg}</p>}
    </form>
  );
}
