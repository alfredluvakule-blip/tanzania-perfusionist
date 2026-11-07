"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getBrowserSupabase } from "@/lib/supabase";
import { LogoMark } from "@/components/Logo";
import { FlowLines } from "@/components/FlowLines";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Load the dashboard code in the background so it opens instantly after sign-in.
  useEffect(() => { router.prefetch("/admin"); }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) return setMsg({ ok: false, text: "Sign-in is available once Supabase keys are added (see README)." });
    setBusy(true); setMsg(null);
    if (mode === "signin") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg({ ok: false, text: error.message });
      router.push("/admin");
    } else {
      const { data, error } = await sb.auth.signUp({
        email, password,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) return setMsg({ ok: false, text: error.message });
      // When email confirmation is off in Supabase, the account is ready at once: go straight in.
      if (data.session) return router.push("/admin");
      setMsg({ ok: true, text: "Almost done: open the email we just sent and tap the link to confirm your account. Check your spam folder if it isn't there in a minute." });
    }
  }

  return (
    <section className="noise relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-4 py-28">
      <FlowLines className="absolute inset-0 h-full w-full opacity-40" />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <LogoMark className="h-12 w-12" />
        <h1 className="mt-4 font-display text-2xl font-semibold">{mode === "signin" ? "Welcome back" : "Join the community"}</h1>
        <p className="mt-1 text-sm text-navy-600">{mode === "signin" ? "Sign in to your Tanzania Perfusionists account." : "Create a member account to build your profile and submit content."}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div><label className="label" htmlFor="name">Full name</label><input id="name" autoComplete="name" required className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          )}
          <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} required className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {msg && <p role="status" className={`rounded-xl p-3 text-sm ${msg.ok ? "bg-teal-50 text-teal-800" : "bg-pulse-500/10 text-pulse-700"}`}>{msg.text}</p>}
          <button disabled={busy} className="btn-primary w-full">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{busy ? (mode === "signin" ? "Signing in…" : "Creating your account…") : mode === "signin" ? "Sign in" : "Create account"}</button>
        </form>
        <p className="mt-5 text-center text-sm text-navy-600">
          {mode === "signin" ? "New here? " : "Already a member? "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-semibold text-teal-700 hover:underline">
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
        <p className="mt-3 text-center text-xs text-navy-400">By joining you agree to the <Link href="/guidelines" className="underline">conduct & publishing policy</Link>.</p>
      </div>
    </section>
  );
}
