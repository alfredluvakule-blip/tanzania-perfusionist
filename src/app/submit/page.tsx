import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { SubmitClient } from "./SubmitClient";

export const metadata: Metadata = { title: "Submit content" };

export default function SubmitPage() {
  return (
    <>
      <PageHeader eyebrow="Contribute" title="Submit content for review"
        intro="Stories, photographs, case reports, research, media, events and verified history. Every submission is reviewed by an editor before it is published." />
      <section className="container-x max-w-3xl py-14">
        <Suspense><SubmitClient /></Suspense>
      </section>
    </>
  );
}
