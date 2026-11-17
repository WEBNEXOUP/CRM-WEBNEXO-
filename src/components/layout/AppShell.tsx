import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  CheckSquare,
  ChevronDown,
  Filter,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Search,
  FileText,
  Users,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { WebnexoMark } from "@/components/layout/WebnexoMark";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: string; icon: typeof Users };
type NavGroup = { group: string; items: NavItem[] };

const navigation: NavGroup[] = [
  {
    group: "Visão geral",
    items: [{ label: "Dashboard", to: "/painel", icon: LayoutDashboard }],
  },
  {
    group: "Comercial",
    items: [
      { label: "Funil de vendas", to: "/funil", icon: Filter },
      { label: "Clientes", to: "/clientes", icon: Users },
      { label: "Propostas", to: "/propostas", icon: FileText },
    ],
  },
  {
    group: "Relacionamento",
    items: [
      { label: "Central de WhatsApp", to: "/whatsapp", icon: MessageCircle },
      { label: "Tarefas", to: "/tarefas", icon: CheckSquare },
    ],
  },
  {
    group: "Gestão",
    items: [{ label: "Financeiro", to: "/financeiro", icon: Wallet }],
  },
];

function Sidebar({ onNavigate, mobile = false }: { onNavigate?: () => void; mobile?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [filter, setFilter] = useState("");
  const [closed, setClosed] = useState<string[]>([]);

  const groups = navigation
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => !filter.trim() || i.label.toLowerCase().includes(filter.trim().toLowerCase()),
      ),
    }))
    .filter((g) => g.items.length > 0);

  const toggle = (g: string) =>
    setClosed((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden bg-sidebar/85 text-sidebar-foreground backdrop-blur-xl",
        !mobile &&
          "rounded-3xl border border-sidebar-border shadow-panel ring-1 ring-sidebar-primary/10",
      )}
    >
      <div className="p-2.5">
        <div className="flex items-center gap-2.5 rounded-2xl bg-sidebar-accent/70 p-2.5 ring-1 ring-sidebar-primary/30">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_75%,transparent),0_0_26px_-4px_var(--primary)]">
            <WebnexoMark />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold leading-tight text-sidebar-accent-foreground">
              Webnexo
            </p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-sidebar-primary">
              CRM e financeiro
            </p>
          </div>
        </div>
        <div className="relative mt-2.5">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sidebar-foreground/50" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar menu..."
            aria-label="Filtrar itens do menu"
            className="h-8 w-full rounded-lg border border-sidebar-border bg-sidebar-accent/40 pl-8 pr-2 text-xs text-sidebar-accent-foreground placeholder:text-sidebar-foreground/50 focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {groups.map((group) => {
          const isClosed = !filter.trim() && closed.includes(group.group);
          return (
            <div key={group.group}>
              <button
                type="button"
                onClick={() => toggle(group.group)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/55 hover:text-sidebar-accent-foreground"
              >
                {group.group}
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", isClosed && "-rotate-90")}
                />
              </button>
              {!isClosed && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] transition-all duration-200",
                          active
                            ? "bg-primary/20 font-semibold text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_55%,transparent),0_0_20px_-8px_var(--primary)] before:absolute before:-left-1 before:inset-y-2 before:w-[3px] before:rounded-full before:bg-accent before:shadow-[0_0_10px_var(--accent)] before:content-['']"
                            : "text-sidebar-foreground/75 hover:translate-x-0.5 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0",
                            active && "text-sidebar-primary",
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {groups.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-sidebar-foreground/60">
            Nenhum item encontrado.
          </p>
        )}
      </nav>

      <div className="border-t border-sidebar-border p-2.5">
        <div className="flex items-center gap-2.5 rounded-xl bg-sidebar-accent/50 p-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/25 text-xs font-bold text-sidebar-accent-foreground">
            WN
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-sidebar-accent-foreground">
              Administrador
            </p>
            <p className="truncate text-[10px] text-sidebar-foreground/60">Dados de exemplo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  children,
  title,
  description,
  actions,
  fullBleed = false,
}: {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Ocupa a tela toda com margens mínimas (ex.: Central de WhatsApp). */
  fullBleed?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-10 min-h-dvh lg:flex lg:gap-4 lg:p-4">
      <aside className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-64 shrink-0 lg:block">
        <Sidebar />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Sidebar mobile onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className={cn(
            "surface-panel sticky top-0 z-20 flex items-center gap-3 px-4 py-3 max-lg:rounded-none max-lg:border-x-0 max-lg:border-t-0 lg:top-4",
            fullBleed && "py-2",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold leading-tight md:text-xl">{title}</h1>
            {description && !fullBleed && (
              <p className="truncate text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
          <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
          </Button>
          <ThemeToggle />
        </header>

        <main className={cn("min-w-0 flex-1", fullBleed ? "pt-3" : "space-y-4 py-4 max-lg:px-3")}>
          {children}
        </main>
      </div>
    </div>
  );
}
