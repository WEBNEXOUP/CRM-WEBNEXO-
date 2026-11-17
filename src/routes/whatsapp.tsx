import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Paperclip, Search, Send, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { conversas, type Conversa, type Mensagem } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({ meta: [{ title: "Central de WhatsApp · Webnexo CRM" }] }),
  component: Whatsapp,
});

const iniciais = (nome: string) =>
  nome
    .split(" ")
    .map((p) => p[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Whatsapp() {
  const [lista, setLista] = useState<Conversa[]>(conversas);
  const [ativaId, setAtivaId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [texto, setTexto] = useState("");

  const ativa = lista.find((c) => c.id === ativaId) ?? null;

  const filtradas = useMemo(
    () =>
      lista.filter((c) =>
        `${c.nome} ${c.empresa}`.toLowerCase().includes(busca.trim().toLowerCase()),
      ),
    [lista, busca],
  );

  const abrir = (id: string) => {
    setAtivaId(id);
    setLista((prev) => prev.map((c) => (c.id === id ? { ...c, naoLidas: 0 } : c)));
  };

  const enviar = () => {
    const conteudo = texto.trim();
    if (!conteudo || !ativa) return;
    const msg: Mensagem = {
      id: `local-${ativa.mensagens.length + 1}-${ativa.id}`,
      de: "eu",
      texto: conteudo,
      hora: "agora",
    };
    setLista((prev) =>
      prev.map((c) =>
        c.id === ativa.id ? { ...c, mensagens: [...c.mensagens, msg], hora: "agora" } : c,
      ),
    );
    setTexto("");
    toast.info("Mensagem simulada. O envio real depende da API oficial do WhatsApp.");
  };

  return (
    <AppShell title="Central de WhatsApp" fullBleed>
      <div className="grid h-[calc(100dvh-8rem)] min-h-[28rem] gap-3 lg:grid-cols-[20rem_1fr_17rem] max-lg:px-3">
        {/* Lista de conversas */}
        <section
          className={cn("surface-panel flex min-h-0 flex-col p-3", ativa && "max-lg:hidden")}
        >
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar conversa..."
              className="pl-9"
              aria-label="Buscar conversa"
            />
          </div>
          <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
            {filtradas.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => abrir(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-muted/70",
                    ativaId === c.id && "bg-primary/15 ring-1 ring-primary/40",
                  )}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold">
                    {iniciais(c.nome)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <b className="truncate text-sm">{c.nome}</b>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{c.hora}</span>
                    </span>
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-muted-foreground">
                        {c.mensagens.at(-1)?.texto ?? ""}
                      </span>
                      {c.naoLidas > 0 && (
                        <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                          {c.naoLidas}
                        </Badge>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {filtradas.length === 0 && (
              <li className="p-4 text-center text-xs text-muted-foreground">Nenhuma conversa.</li>
            )}
          </ul>
        </section>

        {/* Chat */}
        <section
          className={cn("surface-panel flex min-h-0 flex-col p-0", !ativa && "max-lg:hidden")}
        >
          {ativa ? (
            <>
              <header className="flex items-center gap-3 border-b border-border p-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Voltar para a lista"
                  onClick={() => setAtivaId(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 text-xs font-bold">
                  {iniciais(ativa.nome)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{ativa.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">{ativa.empresa}</p>
                </div>
                <Badge variant={ativa.vinculo === "Cliente" ? "default" : "secondary"}>
                  {ativa.vinculo}
                </Badge>
              </header>

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
                {ativa.mensagens.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex", m.de === "eu" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                        m.de === "eu"
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md border border-border bg-card",
                      )}
                    >
                      <p>{m.texto}</p>
                      <p
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-[10px]",
                          m.de === "eu" ? "text-primary-foreground/75" : "text-muted-foreground",
                        )}
                      >
                        {m.hora}
                        {m.de === "eu" && <Check className="h-3 w-3" />}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="flex items-center gap-2 border-t border-border p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  enviar();
                }}
              >
                <Button type="button" variant="ghost" size="icon" aria-label="Anexar arquivo">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  aria-label="Mensagem"
                />
                <Button type="submit" size="icon" aria-label="Enviar">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-6 text-center text-sm text-muted-foreground">
              Selecione uma conversa para começar.
            </div>
          )}
        </section>

        {/* Contexto do contato */}
        <aside className="surface-panel hidden min-h-0 flex-col gap-3 overflow-y-auto p-4 lg:flex">
          {ativa ? (
            <>
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/20 text-lg font-bold">
                  {iniciais(ativa.nome)}
                </span>
                <div>
                  <p className="font-bold">{ativa.nome}</p>
                  <p className="text-xs text-muted-foreground">{ativa.empresa}</p>
                </div>
                <Badge variant={ativa.vinculo === "Cliente" ? "default" : "secondary"}>
                  {ativa.vinculo}
                </Badge>
              </div>
              <div className="space-y-2 text-xs">
                <p className="font-semibold uppercase tracking-wider text-muted-foreground">
                  Ações rápidas
                </p>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/clientes">
                    <UserRound /> Ver cadastro
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => toast.info("Criar tarefa: entra com o banco de dados.")}
                >
                  <Check /> Criar tarefa
                </Button>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Os dados do contato aparecem aqui.</p>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
