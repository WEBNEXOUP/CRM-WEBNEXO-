import { createFileRoute } from "@tanstack/react-router";
import { Clock, GripVertical, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PillTabs } from "@/components/ui/stat-strip";
import { brl, funnelStages, leadsIniciais, type Lead, type StageId } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/funil")({
  head: () => ({ meta: [{ title: "Funil de vendas · Webnexo CRM" }] }),
  component: Funil,
});

type Filtro = "Todas" | Lead["origem"];

function Funil() {
  const [leads, setLeads] = useState<Lead[]>(leadsIniciais);
  const [filtro, setFiltro] = useState<Filtro>("Todas");
  const [arrastando, setArrastando] = useState<string | null>(null);
  const [sobre, setSobre] = useState<StageId | null>(null);

  const visiveis = useMemo(
    () => leads.filter((l) => filtro === "Todas" || l.origem === filtro),
    [leads, filtro],
  );

  const mover = (id: string, etapa: StageId) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.etapa === etapa) return;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, etapa, diasParado: 0 } : l)));
    const nome = funnelStages.find((s) => s.id === etapa)?.label ?? etapa;
    toast.success(`${lead.empresa} movido para "${nome}"`);
  };

  const origens: Filtro[] = ["Todas", "WhatsApp", "Instagram", "Indicação", "Site"];

  return (
    <AppShell
      title="Funil de vendas"
      description="Arraste os cartões entre as etapas"
      actions={
        <Button
          size="sm"
          onClick={() => toast.info("Novo lead: formulário entra com o banco de dados.")}
        >
          <Plus /> Novo lead
        </Button>
      }
    >
      <PillTabs
        items={origens.map((o) => ({
          value: o,
          label: o,
          count: o === "Todas" ? leads.length : leads.filter((l) => l.origem === o).length,
        }))}
        value={filtro}
        onChange={setFiltro}
      />

      <div className="-mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-3 lg:mx-0 lg:px-0">
        {funnelStages.map((stage) => {
          const cards = visiveis.filter((l) => l.etapa === stage.id);
          const total = cards.reduce((s, l) => s + l.valor, 0);
          const ativo = sobre === stage.id;
          return (
            <div
              key={stage.id}
              onDragOver={(e) => {
                e.preventDefault();
                setSobre(stage.id);
              }}
              onDragLeave={() => setSobre((cur) => (cur === stage.id ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain") || arrastando;
                if (id) mover(id, stage.id);
                setArrastando(null);
                setSobre(null);
              }}
              className={cn(
                "surface-panel flex w-72 shrink-0 snap-start flex-col p-3 transition",
                ativo && "ring-2 ring-primary/60",
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold">{stage.label}</h3>
                  <p className="text-[11px] text-muted-foreground">{brl(total)}</p>
                </div>
                <Badge variant="secondary">{cards.length}</Badge>
              </div>

              <div className="flex min-h-24 flex-1 flex-col gap-2">
                {cards.map((l) => (
                  <article
                    key={l.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", l.id);
                      e.dataTransfer.effectAllowed = "move";
                      setArrastando(l.id);
                    }}
                    onDragEnd={() => {
                      setArrastando(null);
                      setSobre(null);
                    }}
                    className={cn(
                      "cursor-grab rounded-xl border border-border bg-card/80 p-3 shadow-sm transition hover:border-primary/50 active:cursor-grabbing",
                      arrastando === l.id && "opacity-40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{l.empresa}</p>
                        <p className="truncate text-xs text-muted-foreground">{l.nome}</p>
                      </div>
                      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    </div>
                    <p className="mt-2 text-xs">{l.servico}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <b className="kpi-number text-sm">{brl(l.valor)}</b>
                      <Badge variant="outline" className="text-[10px]">
                        {l.origem}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "flex items-center gap-1 text-[11px]",
                          l.diasParado >= 5 ? "text-destructive" : "text-muted-foreground",
                        )}
                      >
                        <Clock className="h-3 w-3" />
                        {l.diasParado === 0 ? "movido hoje" : `${l.diasParado} dia(s) parado`}
                      </span>
                      <select
                        aria-label={`Mover ${l.empresa} para outra etapa`}
                        value={l.etapa}
                        onChange={(e) => mover(l.id, e.target.value as StageId)}
                        className="rounded-md border border-input bg-background px-1.5 py-1 text-[11px]"
                      >
                        {funnelStages.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </article>
                ))}
                {cards.length === 0 && (
                  <p className="grid flex-1 place-items-center rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    Solte um cartão aqui
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
