import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

// Primeiro número no formato brasileiro (1.234,56) dentro de um texto já formatado.
const NUMBER_RE = /-?\d{1,3}(?:\.\d{3})+(?:,\d+)?|-?\d+(?:,\d+)?/;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

type Parsed = { prefix: string; suffix: string; target: number; decimals: number } | null;

function parse(text: string): Parsed {
  const m = NUMBER_RE.exec(text);
  if (!m) return null;
  const raw = m[0];
  const target = Number(raw.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(target)) return null;
  const decimals = raw.includes(",") ? raw.split(",")[1]!.length : 0;
  return { prefix: text.slice(0, m.index), suffix: text.slice(m.index + raw.length), target, decimals };
}

function render(p: NonNullable<Parsed>, v: number) {
  return (
    p.prefix +
    v.toLocaleString("pt-BR", { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals }) +
    p.suffix
  );
}

/**
 * Número que "conta" até o valor final. Aceita número ou texto já formatado
 * ("R$ 1.234,56", "42%"), mantendo prefixo, sufixo e casas decimais.
 */
export function AnimatedNumber({
  value,
  duration = 1400,
  className,
}: {
  value: string | number;
  duration?: number;
  className?: string;
}) {
  const text = typeof value === "number" ? value.toLocaleString("pt-BR") : value;
  const [shown, setShown] = useState(text);
  const from = useRef(0);

  useEffect(() => {
    const p = parse(text);
    if (!p || prefersReducedMotion()) {
      setShown(text);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 4);
      const v = start + (p.target - start) * eased;
      setShown(render(p, v));
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = p.target;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      from.current = p.target;
    };
  }, [text, duration]);

  return <span className={cn("tabular-nums", className)}>{shown}</span>;
}

/** Barra de progresso com preenchimento animado e brilho. */
export function GlowBar({
  value,
  tone = "primary",
  className,
}: {
  value: number;
  tone?: "primary" | "accent" | "success" | "danger";
  className?: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(Math.max(0, Math.min(100, value))));
    return () => cancelAnimationFrame(id);
  }, [value]);
  const color = {
    primary: "bg-primary shadow-[0_0_14px_var(--primary)]",
    accent: "bg-accent shadow-[0_0_14px_var(--accent)]",
    success: "bg-success shadow-[0_0_14px_var(--success)]",
    danger: "bg-destructive shadow-[0_0_14px_var(--destructive)]",
  }[tone];
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-muted", className)} role="presentation">
      <div
        className={cn("h-full rounded-full transition-[width] duration-[1400ms] ease-out", color)}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/** Mini gráfico de linha que se desenha ao aparecer. */
export function Sparkline({
  data,
  className,
  color = "var(--primary)",
}: {
  data: number[];
  className?: string;
  color?: string;
}): ReactNode {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 200, 38 - ((v - min) / span) * 34] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 200 42" preserveAspectRatio="none" className={cn("h-10 w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.3" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} V42 H0Z`} fill="url(#spark-fill)" className="animate-[fadein_1.2s_0.8s_both]" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        className="animate-[draw_1.6s_0.3s_ease_both]"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}

/** Anel de status: os arcos se preenchem ao aparecer e o centro mostra o total. */
export function RingChart({
  segments,
  total,
  label,
  size = 150,
  className,
}: {
  segments: { value: number; color: string }[];
  total?: number;
  label?: string;
  size?: number;
  className?: string;
}) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const sum = segments.reduce((s, x) => s + x.value, 0);
  const r = 60;
  const C = 2 * Math.PI * r;
  const gap = segments.filter((s) => s.value > 0).length > 1 ? 6 : 0;
  let offset = 0;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 150 150" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--border)" strokeWidth="14" />
        {sum > 0 &&
          segments.map((s, i) => {
            const len = Math.max(0, (s.value / sum) * C - gap);
            const el = (
              <circle
                key={i}
                cx="75"
                cy="75"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${go ? len : 0} ${C}`}
                strokeDashoffset={-offset}
                style={{
                  transition: `stroke-dasharray 1.6s ${i * 0.15}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
                  filter: `drop-shadow(0 0 5px ${s.color})`,
                }}
              />
            );
            offset += (s.value / sum) * C;
            return el;
          })}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <b className="kpi-number text-3xl">
          <AnimatedNumber value={total ?? sum} />
        </b>
        {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}
