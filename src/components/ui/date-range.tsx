import { CalendarRange } from "lucide-react";

import { cn } from "@/lib/utils";

/** Período livre: data inicial e final (inclusive). Datas no formato AAAA-MM-DD. */
export function DateRangeInputs({
  from,
  to,
  onChange,
  active,
  className,
}: {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  active?: boolean;
  className?: string;
}) {
  const box =
    "h-9 rounded-full border bg-background px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary/40";
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <CalendarRange className="h-4 w-4" aria-hidden />
      <label className="flex items-center gap-1">
        De
        <input
          type="date"
          value={from}
          max={to || undefined}
          onChange={(e) => onChange(e.target.value, to && e.target.value > to ? e.target.value : to)}
          className={cn(box, active ? "border-primary" : "border-border")}
        />
      </label>
      <label className="flex items-center gap-1">
        até
        <input
          type="date"
          value={to}
          min={from || undefined}
          onChange={(e) => onChange(from && e.target.value < from ? e.target.value : from, e.target.value)}
          className={cn(box, active ? "border-primary" : "border-border")}
        />
      </label>
    </div>
  );
}
