"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getBrowserSupabase } from "./supabase";
import type { Role } from "./types";

export interface Profile { id: string; full_name: string | null; role: Role; }

/** Current user + profile (role). `ready` is false until the first check finishes. */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) { setReady(true); return; }
    const load = async (u: User | null) => {
      setUser(u);
      if (u) {
        const { data } = await sb.from("profiles").select("id, full_name, role").eq("id", u.id).single();
        setProfile((data as Profile) ?? null);
      } else setProfile(null);
      setReady(true);
    };
    sb.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => load(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, profile, role: profile?.role ?? null, ready };
}
