import { FlowLines } from "./FlowLines";

export function PageHeader({
  eyebrow, title, intro, children,
}: { eyebrow: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="noise relative overflow-hidden bg-navy-950 pb-16 pt-32 text-white sm:pb-20 sm:pt-36">
      <FlowLines className="absolute inset-0 h-full w-full opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="container-x relative">
        <p className="eyebrow !text-teal-300">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-navy-100">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
