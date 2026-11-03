import { ShieldAlert } from "lucide-react";

export function Disclaimer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
      <p>
        {children ??
          "Case discussions are for professional education only. They do not replace institutional protocols, local guidelines or clinical judgement, and are not instructions for the care of individual patients."}
      </p>
    </div>
  );
}
