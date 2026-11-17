import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PillTabs, StatStrip } from "@/components/ui/stat-strip";
import { brl, propostas, type PropostaStatus } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/propostas")({
  head: () => ({ meta: [{ title: "Propostas · Webnexo CRM" }] }),
  component: Propostas,
});

type Filtro = "Todas" | PropostaStatus;

const corStatus: Record<PropostaStatus, string> = {
  Rascunho: "bg-muted text-muted-foreground",
  Enviada: "bg-primary/15 text-primary",
  Aceita: "bg-success/20 text-success",
  Recusada: "bg-destructive/15 text-destructive",
};

function Propostas() {
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const lista = useMemo(
    () => propostas.filter((p) => filtro === "Todas" || p.status === filtro),
    [filtro],
  );

  const soma = (s: PropostaStatus) =>
    propostas.filter((p) => p.status === s).reduce((t, p) => t + p.valor, 0);
  const qtd = (s: PropostaStatus) => propostas.filter((p) => p.status === s).length;
  const decididas = qtd("Aceita") + qtd("Recusada");
  const conversao = decididas === 0 ? 0 : Math.round((qtd("Aceita") / decididas) * 100);

  const filtros: Filtro[] = ["Todas", "Rascunho", "Enviada", "Aceita", "Recusada"];

  return (
    <AppShell
      title="Propostas"
      description="Orçamentos de sites, SaaS e motion design"
      actions={
        <Button
          size="sm"
          onClick={() => toast.info("Nova proposta: editor entra com o banco de dados.")}
        >
          <Plus /> Nova proposta
        </Button>
      }
    >
      <StatStrip
        stats={[
          {
            label: "Em aberto",
            value: brl(soma("Enviada") + soma("Rascunho")),
            sub: `${qtd("Enviada") + qtd("Rascunho")} proposta(s)`,
            tone: "accent",
          },
          {
            label: "Aceitas",
            value: brl(soma("Aceita")),
            sub: `${qtd("Aceita")} proposta(s)`,
            tone: "success",
          },
          {
            label: "Conversão",
            value: `${conversao}%`,
            sub: "aceitas entre as decididas",
            pct: conversao,
          },
        ]}
      />

      <Section title="Todas as propostas">
        <PillTabs
          className="mb-3"
          items={filtros.map((f) => ({
            value: f,
            label: f,
            count:
              f === "Todas" ? propostas.length : propostas.filter((p) => p.status === f).length,
          }))}
          value={filtro}
          onChange={setFiltro}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Nº</th>
                <th className="py-2 pr-3 font-semibold">Cliente</th>
                <th className="py-2 pr-3 font-semibold">Serviço</th>
                <th className="py-2 pr-3 font-semibold">Validade</th>
                <th className="py-2 pr-3 font-semibold">Status</th>
                <th className="py-2 text-right font-semibold">Valor</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id} className="border-b border-border/60 transition hover:bg-muted/50">
                  <td className="py-2.5 pr-3 font-mono text-xs">{p.id}</td>
                  <td className="py-2.5 pr-3 font-semibold">{p.cliente}</td>
                  <td className="py-2.5 pr-3">{p.servico}</td>
                  <td className="py-2.5 pr-3">{p.validade}</td>
                  <td className="py-2.5 pr-3">
                    <Badge
                      variant="outline"
                      className={cn("border-transparent", corStatus[p.status])}
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-right font-semibold">{brl(p.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </AppShell>
  );
}
