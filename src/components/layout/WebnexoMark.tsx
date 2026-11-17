import { cn } from "@/lib/utils";

/**
 * Símbolo "W" da Webnexo (traçado simples, provisório).
 * Troque pelo recorte oficial do W: basta substituir o <path>.
 */
export function WebnexoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Webnexo"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id="wnx-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <path
        d="M6 10 L14 38 L24 18 L34 38 L42 10"
        fill="none"
        stroke="url(#wnx-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
