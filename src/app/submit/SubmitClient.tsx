"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { COLLECTIONS, can, ROLE_LABEL } from "@/lib/cms";
import { useAuth } from "@/lib/useAuth";
import { ContentForm } from "@/components/cms/ContentForm";
import { isSupabaseConfigured } from "@/lib/supabase";

export function SubmitClient() {
  const params = useSearchParams();
  const { user, role, ready } = useAuth();
  const [type, setType] = useState(params.get("type") ?? "legacy");
  const [done, setDone] = useState(false);
  const collection = COLLECTIONS.find((c) => c.key === type) ?? COLLECTIONS[0];

  if (!ready) return <p className="text-navy-500">Loading…</p>;
  if (isSupabaseConfigured && !user)
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-xl font-semibold">Sign in to contribute</p>
        <p className="mt-2 text-navy-600">Submissions come from registered members so editors can follow up on sources and permissions.</p>
        <Link href="/login" className="btn-primary mt-6">Sign in or create an account</Link>
      </div>
    );
  if (done)
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-teal-600" />
        <p className="mt-4 font-display text-xl font-semibold">Thank you. Your {collection.singular} is waiting for review.</p>
        <p className="mt-2 text-navy-600">An editor will check it and may contact you about sources or permissions.</p>
        <button onClick={() => setDone(false)} className="btn-outline mt-6">Submit something else</button>
      </div>
    );

  const allowed = COLLECTIONS.filter((c) => !isSupabaseConfigured || can(role, c.submitRole));
  return (
    <div className="card p-6 sm:p-8">
      <label className="label" htmlFor="type">What would you like to submit?</label>
      <select id="type" className="input" value={collection.key} onChange={(e) => setType(e.target.value)}>
        {allowed.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
      </select>
      {isSupabaseConfigured && !can(role, collection.submitRole) && (
        <p className="mt-3 text-sm text-amber-700">Submitting {collection.label.toLowerCase()} requires the {ROLE_LABEL[collection.submitRole]} role. Ask an editor to upgrade your account.</p>
      )}
      <hr className="my-6 border-navy-100" />
      <ContentForm key={collection.key} collection={collection} mode="submit" hideFields={["verified", "slug"]} onSaved={() => setDone(true)} />
    </div>
  );
}
