import type { ReactNode } from "react";

import { AnimatedNumber, GlowBar } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";

export type Stat = {
  label: string;
  value: string | number;
  sub?: string;
  /** 0–100: preenche a barra com brilho. Omitido = sem barra. */
  pct?: number;
  tone?: "primary" | "accent" | "success" | "danger";
  icon?: ReactNode;
  onClick?: () => void;
  active?: boolean;
};

/** Faixa de indicadores no padrão do novo design (vidro, número animado, barra com brilho). */
export function StatStrip({ stats, className }: { stats: Stat[]; className?: string }) {
  const cols =
    stats.length >= 5
      ? "md:grid-cols-5"
      : stats.length === 4
        ? "md:grid-cols-4"
        : stats.length === 3
          ? "md:grid-cols-3"
          : "md:grid-cols-2";
  return (
    <div className={cn("grid grid-cols-2 gap-3", cols, className)}>
      {stats.map((k) => {
        const Tag = k.onClick ? "button" : "div";
        return (
          <Tag
            key={k.label}
            type={k.onClick ? "button" : undefined}
            onClick={k.onClick}
            className={cn(
              "surface-panel p-4 text-left transition hover:-translate-y-0.5",
              k.active && "ring-2 ring-primary/50",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {k.label}
              </p>
              {k.icon && <span className="text-primary">{k.icon}</span>}
            </div>
            <p className="kpi-number mt-1 text-2xl font-bold tracking-tight md:text-3xl">
              <AnimatedNumber value={k.value} />
            </p>
            {k.sub && <p className="mt-0.5 text-xs text-muted-foreground">{k.sub}</p>}
            {k.pct != null && <GlowBar value={k.pct} tone={k.tone ?? "primary"} className="mt-3" />}
          </Tag>
        );
      })}
    </div>
  );
}

/** Botões em pílula para filtros/abas (visual do novo design). */
export function PillTabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((i) => {
        const on = i.value === value;
        return (
          <button
            key={i.value}
            type="button"
            data-compact
            onClick={() => onChange(i.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              on
                ? "border-primary bg-primary text-primary-foreground shadow-[0_0_18px_-4px_var(--color-primary)]"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {i.label}
            {i.count != null && (
              <span className={cn("rounded-full px-1.5 text-[10px]", on ? "bg-white/25" : "bg-muted")}>
                {i.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
