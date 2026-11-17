import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatStrip } from "@/components/ui/stat-strip";
import { brl, clientes, contratosPorCliente, interacoesPorCliente, propostas } from "@/data/mock";

export const Route = createFileRoute("/clientes/$clienteId")({
  loader: ({ params }) => {
    const cliente = clientes.find((c) => c.id === params.clienteId);
    if (!cliente) throw notFound();
    return { cliente };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.cliente.nome ?? "Cliente"} · Webnexo CRM` }],
  }),
  component: FichaCliente,
  notFoundComponent: () => (
    <AppShell title="Cliente não encontrado">
      <Section title="Não encontramos este cliente">
        <Button asChild variant="outline" size="sm">
          <Link to="/clientes">
            <ArrowLeft /> Voltar para a lista
          </Link>
        </Button>
      </Section>
    </AppShell>
  ),
});

function FichaCliente() {
  const { cliente } = Route.useLoaderData();
  const contratos = contratosPorCliente[cliente.id] ?? [];
  const interacoes = interacoesPorCliente[cliente.id] ?? [];
  const props = propostas.filter((p) => p.cliente === cliente.nome);

  return (
    <AppShell
      title={cliente.nome}
      description={`${cliente.contato} · cliente desde ${cliente.desde}`}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/clientes">
            <ArrowLeft /> Clientes
          </Link>
        </Button>
      }
    >
      <StatStrip
        stats={[
          {
            label: "Mensalidade",
            value: cliente.mrr > 0 ? brl(cliente.mrr) : "—",
            tone: "success",
          },
          { label: "Contratos", value: contratos.length },
          { label: "Propostas", value: props.length },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Section title="Contato">
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> {cliente.telefone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> {cliente.email}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {cliente.cidade}
            </li>
          </ul>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/whatsapp">
              <MessageCircle /> Abrir conversa
            </Link>
          </Button>
        </Section>

        <Section title="Contratos" className="lg:col-span-2">
          {contratos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum contrato ainda.</p>
          ) : (
            <ul className="space-y-2">
              {contratos.map((c) => (
                <li
                  key={`${c.servico}-${c.vigencia}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/50 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{c.servico}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.tipo} · {c.vigencia}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <b>{brl(c.valor)}</b>
                    <Badge variant={c.status === "Ativo" ? "default" : "secondary"}>
                      {c.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section title="Histórico de interações">
        {interacoes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem interações registradas.</p>
        ) : (
          <ol className="relative space-y-4 border-l border-border pl-5">
            {interacoes.map((i) => (
              <li key={`${i.quando}-${i.canal}`} className="relative">
                <span className="absolute -left-[1.6rem] top-1 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                <p className="text-xs text-muted-foreground">
                  {i.quando} · {i.canal}
                </p>
                <p className="text-sm">{i.resumo}</p>
              </li>
            ))}
          </ol>
        )}
      </Section>
    </AppShell>
  );
}
