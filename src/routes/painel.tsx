import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, CircleDollarSign, Flame, Target, TrendingUp } from "lucide-react";

import { MonthlyBars } from "@/components/charts/MonthlyBars";
import { AppShell } from "@/components/layout/AppShell";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { GlowBar, RingChart, Sparkline } from "@/components/ui/animated-number";
import { StatStrip } from "@/components/ui/stat-strip";
import {
  agendaHoje,
  brl,
  cobrancas,
  fluxoMensal,
  funnelStages,
  leadsIniciais,
  mrrSerie,
  origemLeads,
} from "@/data/mock";

export const Route = createFileRoute("/painel")({
  head: () => ({ meta: [{ title: "Dashboard · Webnexo CRM" }] }),
  component: Painel,
});

function Painel() {
  const abertos = leadsIniciais.filter((l) => l.etapa !== "ganho");
  const pipeline = abertos.reduce((s, l) => s + l.valor, 0);
  const atrasadas = cobrancas.filter((c) => c.status === "Atrasada");
  const totalAtrasado = atrasadas.reduce((s, c) => s + c.valor, 0);
  const aReceber = cobrancas.filter((c) => c.status !== "Paga").reduce((s, c) => s + c.valor, 0);
  const mrrAtual = mrrSerie.at(-1) ?? 0;
  const maxEtapa = Math.max(
    1,
    ...funnelStages.map((s) => leadsIniciais.filter((l) => l.etapa === s.id).length),
  );

  return (
    <AppShell title="Dashboard" description="Visão geral de vendas e financeiro (dados de exemplo)">
      <StatStrip
        stats={[
          {
            label: "MRR",
            value: brl(mrrAtual),
            sub: "receita recorrente do mês",
            pct: 72,
            tone: "primary",
            icon: <TrendingUp className="h-4 w-4" />,
          },
          {
            label: "Pipeline aberto",
            value: brl(pipeline),
            sub: `${abertos.length} oportunidades`,
            pct: 58,
            tone: "accent",
            icon: <Target className="h-4 w-4" />,
          },
          {
            label: "A receber",
            value: brl(aReceber),
            sub: "cobranças pendentes e atrasadas",
            pct: 44,
            tone: "success",
            icon: <CircleDollarSign className="h-4 w-4" />,
          },
          {
            label: "Em atraso",
            value: brl(totalAtrasado),
            sub: `${atrasadas.length} cobrança(s)`,
            pct: 15,
            tone: "danger",
            icon: <Flame className="h-4 w-4" />,
          },
          {
            label: "Reuniões hoje",
            value: agendaHoje.length,
            sub: "na agenda",
            icon: <CalendarClock className="h-4 w-4" />,
          },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Section title="Entradas x saídas" description="Últimos 6 meses" className="lg:col-span-2">
          <MonthlyBars rows={fluxoMensal} />
        </Section>

        <Section title="Origem dos leads" description="Últimos 90 dias">
          <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col">
            <RingChart
              segments={origemLeads.map((o) => ({ value: o.value, color: o.color }))}
              label="leads"
            />
            <ul className="w-full space-y-1.5 text-sm">
              {origemLeads.map((o) => (
                <li key={o.label} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <i
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: o.color }}
                    />
                    {o.label}
                  </span>
                  <b>{o.value}</b>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Section
          title="Funil de vendas"
          description="Oportunidades por etapa"
          actions={
            <Link to="/funil" className="text-xs font-semibold text-primary hover:underline">
              Abrir funil
            </Link>
          }
        >
          <ul className="space-y-3">
            {funnelStages.map((s) => {
              const qtd = leadsIniciais.filter((l) => l.etapa === s.id).length;
              return (
                <li key={s.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{s.label}</span>
                    <b>{qtd}</b>
                  </div>
                  <GlowBar
                    value={(qtd / maxEtapa) * 100}
                    tone={s.id === "ganho" ? "success" : "primary"}
                  />
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Evolução do MRR" description="Mensalidades ativas">
          <p className="kpi-number text-3xl">{brl(mrrAtual)}</p>
          <Sparkline data={mrrSerie} className="mt-3 h-20" />
        </Section>

        <Section title="Agenda de hoje">
          <ul className="space-y-2.5">
            {agendaHoje.map((a) => (
              <li key={a.hora} className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5">
                <Badge variant="secondary">{a.hora}</Badge>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{a.titulo}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.com}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </AppShell>
  );
}
