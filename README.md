# Webnexo CRM

CRM e financeiro internos da Webnexo. Visual baseado no CRM Avant (vidro, brilho sutil, tema claro e escuro).

**Estado atual:** só interface, com dados de exemplo em `src/data/mock.ts`. Não há banco nem login ainda.

## Telas

- `/painel`: dashboard com indicadores, gráficos e agenda
- `/funil`: Kanban de leads (arrastar e soltar)
- `/whatsapp`: central de conversas (simulada)
- `/clientes` e `/clientes/:id`: lista e ficha do cliente
- `/propostas`, `/tarefas`, `/financeiro`

## Rodar

```sh
npm install   # ou bun install
npm run dev
```

O arquivo `src/routeTree.gen.ts` é gerado sozinho pelo TanStack Router no primeiro `dev` ou `build`.

## Pendências conhecidas

- Este código **ainda não foi compilado**: foi escrito sem acesso a `npm install`. Se o primeiro `npm run dev` der erro, ele deve ser corrigido antes de seguir.
- O símbolo "W" em `src/components/layout/WebnexoMark.tsx` é provisório; trocar pelo recorte oficial.
- Banco (Supabase), login com papéis e RLS, Asaas e WhatsApp oficial entram nas próximas etapas (ver plano técnico).

## Segurança

- Nunca commitar `.env` ou chaves. Use `.env.example` como modelo.
- Chaves de API (Asaas etc.) ficam só em segredos de função de backend.
