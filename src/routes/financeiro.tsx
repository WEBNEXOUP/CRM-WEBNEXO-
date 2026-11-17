import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { MonthlyBars } from "@/components/charts/MonthlyBars";
import { AppShell } from "@/components/layout/AppShell";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/ui/animated-number";
import { PillTabs, StatStrip } from "@/components/ui/stat-strip";
import { brl, cobrancas, despesas, fluxoMensal, mrrSerie, type CobrancaStatus } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro · Webnexo CRM" }] }),
  component: Financeiro,
});

type Aba = "receber" | "pagar" | "fluxo";

const corStatus: Record<CobrancaStatus | "Paga", string> = {
  Paga: "bg-success/20 text-success",
  Pendente: "bg-primary/15 text-primary",
  Atrasada: "bg-destructive/15 text-destructive",
};

function Financeiro() {
  const [aba, setAba] = useState<Aba>("receber");

  const recebido = cobrancas.filter((c) => c.status === "Paga").reduce((s, c) => s + c.valor, 0);
  const aReceber = cobrancas
    .filter((c) => c.status === "Pendente")
    .reduce((s, c) => s + c.valor, 0);
  const atrasado = cobrancas
    .filter((c) => c.status === "Atrasada")
    .reduce((s, c) => s + c.valor, 0);
  const totalDespesas = despesas.reduce((s, d) => s + d.valor, 0);
  const saldo =
    recebido - despesas.filter((d) => d.status === "Paga").reduce((s, d) => s + d.valor, 0);

  return (
    <AppShell
      title="Financeiro"
      description="Visual de exemplo: contas a receber, a pagar e fluxo de caixa"
    >
      <StatStrip
        stats={[
          { label: "Recebido no mês", value: brl(recebido), tone: "success" },
          { label: "A receber", value: brl(aReceber), tone: "primary" },
          { label: "Em atraso", value: brl(atrasado), tone: "danger" },
          { label: "Despesas do mês", value: brl(totalDespesas), tone: "accent" },
          { label: "Saldo realizado", value: brl(saldo) },
        ]}
      />

      <PillTabs
        items={[
          { value: "receber", label: "Contas a receber" },
          { value: "pagar", label: "Contas a pagar" },
          { value: "fluxo", label: "Fluxo de caixa" },
        ]}
        value={aba}
        onChange={setAba}
      />

      {aba === "receber" && (
        <Section
          title="Contas a receber"
          description="Mensalidades e parcelas ligadas aos contratos"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">Cliente</th>
                  <th className="py-2 pr-3 font-semibold">Descrição</th>
                  <th className="py-2 pr-3 font-semibold">Vencimento</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {cobrancas.map((c) => (
                  <tr key={c.id} className="border-b border-border/60 transition hover:bg-muted/50">
                    <td className="py-2.5 pr-3 font-semibold">{c.cliente}</td>
                    <td className="py-2.5 pr-3">{c.descricao}</td>
                    <td className="py-2.5 pr-3">{c.vencimento}</td>
                    <td className="py-2.5 pr-3">
                      <Badge
                        variant="outline"
                        className={cn("border-transparent", corStatus[c.status])}
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right font-semibold">{brl(c.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {aba === "pagar" && (
        <Section title="Contas a pagar" description="Ferramentas, marketing e serviços">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">Descrição</th>
                  <th className="py-2 pr-3 font-semibold">Categoria</th>
                  <th className="py-2 pr-3 font-semibold">Vencimento</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {despesas.map((d) => (
                  <tr key={d.id} className="border-b border-border/60 transition hover:bg-muted/50">
                    <td className="py-2.5 pr-3 font-semibold">{d.descricao}</td>
                    <td className="py-2.5 pr-3">{d.categoria}</td>
                    <td className="py-2.5 pr-3">{d.vencimento}</td>
                    <td className="py-2.5 pr-3">
                      <Badge
                        variant="outline"
                        className={cn("border-transparent", corStatus[d.status])}
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right font-semibold">{brl(d.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {aba === "fluxo" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Section
            title="Entradas x saídas"
            description="Últimos 6 meses"
            className="lg:col-span-2"
          >
            <MonthlyBars rows={fluxoMensal} />
          </Section>
          <Section title="MRR" description="Mensalidades recorrentes">
            <p className="kpi-number text-3xl">{brl(mrrSerie.at(-1) ?? 0)}</p>
            <Sparkline data={mrrSerie} className="mt-3 h-20" />
          </Section>
        </div>
      )}
    </AppShell>
  );
}
