import Image from "next/image";

/** Brand mark: the Tanzania Cardiovascular Perfusion Association (TaCPA) badge. */
export function LogoMark({ className = "h-10 w-10", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden rounded-full ring-2 ring-white/20 ${className}`}>
      <Image
        src="/images/tacpa-logo.webp"
        alt="Tanzania Cardiovascular Perfusion Association (TaCPA) logo"
        fill
        sizes="96px"
        priority={priority}
        className="object-contain"
      />
    </span>
  );
}

export function Logo({ light = false, large = false }: { light?: boolean; large?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className={large ? "h-16 w-16" : "h-11 w-11"} priority={!large} />
      <span className="leading-none">
        <span className={`block font-display text-[15px] font-bold tracking-[0.14em] ${light ? "text-white" : "text-navy-900"}`}>
          TANZANIA
        </span>
        <span className="block text-[10.5px] font-semibold tracking-[0.32em] text-teal-500">PERFUSIONISTS</span>
      </span>
    </span>
  );
}
