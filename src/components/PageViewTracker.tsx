"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase";

/** Records an anonymous page view (path only, no cookies or personal data). */
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    getBrowserSupabase()?.from("page_views").insert({ path: pathname }).then(() => {});
  }, [pathname]);
  return null;
}
