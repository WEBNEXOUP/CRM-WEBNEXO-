import { brl } from "@/data/mock";

type Row = { mes: string; entradas: number; saidas: number };

/** Barras de entradas x saídas por mês (HTML/CSS, sem biblioteca de gráficos). */
export function MonthlyBars({ rows }: { rows: Row[] }) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.entradas, r.saidas]));
  return (
    <div>
      <div className="flex h-44 items-end gap-3">
        {rows.map((r) => (
          <div key={r.mes} className="flex h-full flex-1 flex-col justify-end gap-1">
            <div className="flex flex-1 items-end justify-center gap-1">
              <div
                className="w-full max-w-5 rounded-t-md bg-primary shadow-[0_0_14px_-2px_var(--primary)] transition-[height] duration-700"
                style={{ height: `${(r.entradas / max) * 100}%` }}
                title={`Entradas: ${brl(r.entradas)}`}
              />
              <div
                className="w-full max-w-5 rounded-t-md bg-accent shadow-[0_0_14px_-2px_var(--accent)] transition-[height] duration-700"
                style={{ height: `${(r.saidas / max) * 100}%` }}
                title={`Saídas: ${brl(r.saidas)}`}
              />
            </div>
            <span className="text-center text-[11px] text-muted-foreground">{r.mes}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 rounded-full bg-primary" /> Entradas
        </span>
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-2 w-2 rounded-full bg-accent" /> Saídas
        </span>
      </div>
    </div>
  );
}
