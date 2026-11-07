"use client";

import Link from "next/link";
import { Upload } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { can } from "@/lib/cms";

/** Shown on /resources only to editors and super admins: shortcut to the upload form. */
export function AdminUploadLink() {
  const { role } = useAuth();
  if (!can(role, "editor")) return null;
  return (
    <Link href="/admin?tab=resources" className="btn-primary mt-6">
      <Upload className="h-4 w-4" /> Upload a presentation or book
    </Link>
  );
}
