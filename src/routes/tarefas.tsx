import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PillTabs, StatStrip } from "@/components/ui/stat-strip";
import { tarefasIniciais, type Prioridade, type Tarefa } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tarefas")({
  head: () => ({ meta: [{ title: "Tarefas · Webnexo CRM" }] }),
  component: Tarefas,
});

type Filtro = "Todas" | Prioridade;

const corPrioridade: Record<Prioridade, string> = {
  Alta: "bg-destructive/15 text-destructive",
  Média: "bg-warning/25 text-warning-foreground",
  Baixa: "bg-muted text-muted-foreground",
};

function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasIniciais);
  const [filtro, setFiltro] = useState<Filtro>("Todas");

  const alternar = (id: string, feita: boolean) =>
    setTarefas((prev) => prev.map((t) => (t.id === id ? { ...t, feita } : t)));

  const visiveis = useMemo(
    () => tarefas.filter((t) => filtro === "Todas" || t.prioridade === filtro),
    [tarefas, filtro],
  );
  const pendentes = visiveis.filter((t) => !t.feita);
  const concluidas = visiveis.filter((t) => t.feita);

  const filtros: Filtro[] = ["Todas", "Alta", "Média", "Baixa"];

  const linha = (t: Tarefa) => (
    <li
      key={t.id}
      className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 transition hover:bg-muted"
    >
      <Checkbox
        checked={t.feita}
        onCheckedChange={(v) => alternar(t.id, v === true)}
        aria-label={`Concluir: ${t.titulo}`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            t.feita && "text-muted-foreground line-through",
          )}
        >
          {t.titulo}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {t.vinculo} · {t.responsavel}
        </p>
      </div>
      <span className="hidden text-xs text-muted-foreground sm:inline">{t.prazo}</span>
      <Badge variant="outline" className={cn("border-transparent", corPrioridade[t.prioridade])}>
        {t.prioridade}
      </Badge>
    </li>
  );

  return (
    <AppShell
      title="Tarefas"
      description="Follow-ups e pendências da equipe"
      actions={
        <Button
          size="sm"
          onClick={() => toast.info("Nova tarefa: formulário entra com o banco de dados.")}
        >
          <Plus /> Nova tarefa
        </Button>
      }
    >
      <StatStrip
        stats={[
          { label: "Pendentes", value: tarefas.filter((t) => !t.feita).length, tone: "accent" },
          {
            label: "Alta prioridade",
            value: tarefas.filter((t) => !t.feita && t.prioridade === "Alta").length,
            tone: "danger",
          },
          { label: "Concluídas", value: tarefas.filter((t) => t.feita).length, tone: "success" },
        ]}
      />

      <Section title="Lista de tarefas">
        <PillTabs
          className="mb-3"
          items={filtros.map((f) => ({ value: f, label: f }))}
          value={filtro}
          onChange={setFiltro}
        />
        <ul className="space-y-2">{pendentes.map(linha)}</ul>
        {pendentes.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">Nenhuma tarefa pendente.</p>
        )}
        {concluidas.length > 0 && (
          <>
            <h3 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Concluídas
            </h3>
            <ul className="space-y-2">{concluidas.map(linha)}</ul>
          </>
        )}
      </Section>
    </AppShell>
  );
}
