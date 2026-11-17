import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillTabs, StatStrip } from "@/components/ui/stat-strip";
import { brl, clientes, type Cliente } from "@/data/mock";

export const Route = createFileRoute("/clientes/")({
  head: () => ({ meta: [{ title: "Clientes · Webnexo CRM" }] }),
  component: Clientes,
});

type Filtro = "todos" | Cliente["status"];

const rotulo: Record<Cliente["status"], string> = {
  ativo: "Ativo",
  prospect: "Prospect",
  inativo: "Inativo",
};

function Clientes() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");

  const lista = useMemo(
    () =>
      clientes.filter(
        (c) =>
          (filtro === "todos" || c.status === filtro) &&
          `${c.nome} ${c.contato} ${c.cidade}`.toLowerCase().includes(busca.trim().toLowerCase()),
      ),
    [filtro, busca],
  );

  const ativos = clientes.filter((c) => c.status === "ativo");
  const mrr = ativos.reduce((s, c) => s + c.mrr, 0);

  return (
    <AppShell
      title="Clientes"
      description="Cadastro e histórico de cada cliente"
      actions={
        <Button
          size="sm"
          onClick={() => toast.info("Novo cliente: formulário entra com o banco de dados.")}
        >
          <Plus /> Novo cliente
        </Button>
      }
    >
      <StatStrip
        stats={[
          { label: "Clientes ativos", value: ativos.length },
          { label: "Prospects", value: clientes.filter((c) => c.status === "prospect").length },
          { label: "MRR dos ativos", value: brl(mrr), tone: "success" },
        ]}
      />

      <Section title="Lista de clientes">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <PillTabs
            items={[
              { value: "todos", label: "Todos", count: clientes.length },
              { value: "ativo", label: "Ativos", count: ativos.length },
              {
                value: "prospect",
                label: "Prospects",
                count: clientes.filter((c) => c.status === "prospect").length,
              },
              {
                value: "inativo",
                label: "Inativos",
                count: clientes.filter((c) => c.status === "inativo").length,
              },
            ]}
            value={filtro}
            onChange={setFiltro}
          />
          <div className="relative md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, contato ou cidade"
              className="pl-9"
              aria-label="Buscar cliente"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Cliente</th>
                <th className="py-2 pr-3 font-semibold">Contato</th>
                <th className="py-2 pr-3 font-semibold">Cidade</th>
                <th className="py-2 pr-3 font-semibold">Status</th>
                <th className="py-2 text-right font-semibold">Mensalidade</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((c) => (
                <tr key={c.id} className="border-b border-border/60 transition hover:bg-muted/50">
                  <td className="py-2.5 pr-3">
                    <Link
                      to="/clientes/$clienteId"
                      params={{ clienteId: c.id }}
                      className="font-semibold text-primary hover:underline"
                    >
                      {c.nome}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-3">{c.contato}</td>
                  <td className="py-2.5 pr-3">{c.cidade}</td>
                  <td className="py-2.5 pr-3">
                    <Badge variant={c.status === "ativo" ? "default" : "secondary"}>
                      {rotulo[c.status]}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-right font-semibold">
                    {c.mrr > 0 ? brl(c.mrr) : "—"}
                  </td>
                </tr>
              ))}
              {lista.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-xs text-muted-foreground">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </AppShell>
  );
}
