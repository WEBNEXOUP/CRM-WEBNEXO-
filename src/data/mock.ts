// Dados de EXEMPLO (fictícios) usados enquanto o banco não está ligado.
// Quando o Supabase entrar, estas listas viram consultas e este arquivo sai.

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ---------------------------------- Funil ---------------------------------- */

export const funnelStages = [
  { id: "novo", label: "Novo lead" },
  { id: "contato", label: "Em contato" },
  { id: "proposta", label: "Proposta enviada" },
  { id: "negociacao", label: "Negociação" },
  { id: "ganho", label: "Ganho" },
] as const;

export type StageId = (typeof funnelStages)[number]["id"];

export type Lead = {
  id: string;
  nome: string;
  empresa: string;
  origem: "WhatsApp" | "Instagram" | "Indicação" | "Site";
  servico: string;
  valor: number;
  etapa: StageId;
  diasParado: number;
};

export const leadsIniciais: Lead[] = [
  {
    id: "l1",
    nome: "Marcos Tavares",
    empresa: "Tavares Móveis",
    origem: "Instagram",
    servico: "Site institucional",
    valor: 3200,
    etapa: "novo",
    diasParado: 1,
  },
  {
    id: "l2",
    nome: "Aline Cardoso",
    empresa: "Clínica Sorriso Vivo",
    origem: "WhatsApp",
    servico: "Vídeo motion",
    valor: 1800,
    etapa: "novo",
    diasParado: 0,
  },
  {
    id: "l3",
    nome: "Rogério Lima",
    empresa: "Lima Auto Peças",
    origem: "Site",
    servico: "SaaS de estoque",
    valor: 650,
    etapa: "contato",
    diasParado: 3,
  },
  {
    id: "l4",
    nome: "Patrícia Souza",
    empresa: "Studio Pelo & Cia",
    origem: "Indicação",
    servico: "Agenda online",
    valor: 290,
    etapa: "contato",
    diasParado: 5,
  },
  {
    id: "l5",
    nome: "Fábio Mendes",
    empresa: "Mendes Contabilidade",
    origem: "WhatsApp",
    servico: "Site + SEO",
    valor: 4500,
    etapa: "proposta",
    diasParado: 2,
  },
  {
    id: "l6",
    nome: "Juliana Prado",
    empresa: "Prado Gastronomia",
    origem: "Instagram",
    servico: "Cardápio e PDV",
    valor: 890,
    etapa: "proposta",
    diasParado: 7,
  },
  {
    id: "l7",
    nome: "Carlos Nogueira",
    empresa: "Nogueira Farma",
    origem: "Indicação",
    servico: "SaaS farmacêutico",
    valor: 1200,
    etapa: "negociacao",
    diasParado: 1,
  },
  {
    id: "l8",
    nome: "Denise Rocha",
    empresa: "Rocha Pet Shop",
    origem: "WhatsApp",
    servico: "Vídeo motion",
    valor: 2400,
    etapa: "negociacao",
    diasParado: 4,
  },
  {
    id: "l9",
    nome: "Tiago Barros",
    empresa: "Barros Engenharia",
    origem: "Site",
    servico: "Sistema de obras",
    valor: 7800,
    etapa: "ganho",
    diasParado: 0,
  },
];

/* --------------------------------- Clientes -------------------------------- */

export type Cliente = {
  id: string;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  cidade: string;
  status: "ativo" | "prospect" | "inativo";
  mrr: number;
  desde: string;
  servicos: string[];
};

export const clientes: Cliente[] = [
  {
    id: "c1",
    nome: "Barros Engenharia",
    contato: "Tiago Barros",
    telefone: "(88) 99999-0101",
    email: "tiago@exemplo.com.br",
    cidade: "Fortaleza",
    status: "ativo",
    mrr: 890,
    desde: "Mar/2026",
    servicos: ["Sistema de obras"],
  },
  {
    id: "c2",
    nome: "Clínica Sorriso Vivo",
    contato: "Aline Cardoso",
    telefone: "(88) 99999-0102",
    email: "aline@exemplo.com.br",
    cidade: "Sobral",
    status: "ativo",
    mrr: 290,
    desde: "Jun/2026",
    servicos: ["Agenda online", "Vídeo motion"],
  },
  {
    id: "c3",
    nome: "Prado Gastronomia",
    contato: "Juliana Prado",
    telefone: "(88) 99999-0103",
    email: "juliana@exemplo.com.br",
    cidade: "Fortaleza",
    status: "ativo",
    mrr: 450,
    desde: "Ago/2026",
    servicos: ["Cardápio e PDV"],
  },
  {
    id: "c4",
    nome: "Mendes Contabilidade",
    contato: "Fábio Mendes",
    telefone: "(88) 99999-0104",
    email: "fabio@exemplo.com.br",
    cidade: "Caucaia",
    status: "prospect",
    mrr: 0,
    desde: "Nov/2026",
    servicos: [],
  },
  {
    id: "c5",
    nome: "Nogueira Farma",
    contato: "Carlos Nogueira",
    telefone: "(88) 99999-0105",
    email: "carlos@exemplo.com.br",
    cidade: "Maracanaú",
    status: "prospect",
    mrr: 0,
    desde: "Nov/2026",
    servicos: [],
  },
  {
    id: "c6",
    nome: "Tavares Móveis",
    contato: "Marcos Tavares",
    telefone: "(88) 99999-0106",
    email: "marcos@exemplo.com.br",
    cidade: "Fortaleza",
    status: "inativo",
    mrr: 0,
    desde: "Jan/2026",
    servicos: ["Site institucional"],
  },
];

export type Contrato = {
  servico: string;
  valor: number;
  tipo: "Recorrente" | "Único";
  status: "Ativo" | "Encerrado";
  vigencia: string;
};

export const contratosPorCliente: Record<string, Contrato[]> = {
  c1: [
    {
      servico: "Sistema de obras",
      valor: 890,
      tipo: "Recorrente",
      status: "Ativo",
      vigencia: "Mar/2026 em diante",
    },
  ],
  c2: [
    {
      servico: "Agenda online",
      valor: 290,
      tipo: "Recorrente",
      status: "Ativo",
      vigencia: "Jun/2026 em diante",
    },
    {
      servico: "Vídeo motion (pacote)",
      valor: 1800,
      tipo: "Único",
      status: "Encerrado",
      vigencia: "Jul/2026",
    },
  ],
  c3: [
    {
      servico: "Cardápio e PDV",
      valor: 450,
      tipo: "Recorrente",
      status: "Ativo",
      vigencia: "Ago/2026 em diante",
    },
  ],
  c6: [
    {
      servico: "Site institucional",
      valor: 3200,
      tipo: "Único",
      status: "Encerrado",
      vigencia: "Jan/2026",
    },
  ],
};

export type Interacao = {
  quando: string;
  canal: "WhatsApp" | "Reunião" | "E-mail" | "Proposta";
  resumo: string;
};

export const interacoesPorCliente: Record<string, Interacao[]> = {
  c1: [
    {
      quando: "12/11",
      canal: "WhatsApp",
      resumo: "Pediu ajuste no relatório de materiais por obra.",
    },
    { quando: "28/10", canal: "Reunião", resumo: "Apresentação do novo painel de almoxarifado." },
    {
      quando: "03/03",
      canal: "Proposta",
      resumo: "Proposta aceita: sistema de obras, mensalidade recorrente.",
    },
  ],
  c2: [
    {
      quando: "10/11",
      canal: "WhatsApp",
      resumo: "Perguntou sobre lembrete automático de consulta.",
    },
    { quando: "02/07", canal: "E-mail", resumo: "Entrega do pacote de vídeos motion." },
  ],
  c3: [
    { quando: "05/11", canal: "WhatsApp", resumo: "Dúvida sobre impressão do pedido no balcão." },
  ],
};

/* -------------------------------- Propostas -------------------------------- */

export type PropostaStatus = "Rascunho" | "Enviada" | "Aceita" | "Recusada";

export type Proposta = {
  id: string;
  cliente: string;
  servico: string;
  valor: number;
  status: PropostaStatus;
  criada: string;
  validade: string;
};

export const propostas: Proposta[] = [
  {
    id: "P-0012",
    cliente: "Mendes Contabilidade",
    servico: "Site + SEO",
    valor: 4500,
    status: "Enviada",
    criada: "08/11",
    validade: "22/11",
  },
  {
    id: "P-0011",
    cliente: "Prado Gastronomia",
    servico: "Cardápio e PDV",
    valor: 890,
    status: "Enviada",
    criada: "04/11",
    validade: "18/11",
  },
  {
    id: "P-0010",
    cliente: "Nogueira Farma",
    servico: "SaaS farmacêutico",
    valor: 1200,
    status: "Rascunho",
    criada: "13/11",
    validade: "27/11",
  },
  {
    id: "P-0009",
    cliente: "Rocha Pet Shop",
    servico: "Vídeo motion",
    valor: 2400,
    status: "Enviada",
    criada: "29/10",
    validade: "12/11",
  },
  {
    id: "P-0008",
    cliente: "Barros Engenharia",
    servico: "Sistema de obras",
    valor: 7800,
    status: "Aceita",
    criada: "20/10",
    validade: "03/11",
  },
  {
    id: "P-0007",
    cliente: "Lima Auto Peças",
    servico: "SaaS de estoque",
    valor: 650,
    status: "Recusada",
    criada: "15/10",
    validade: "29/10",
  },
];

/* --------------------------------- Tarefas --------------------------------- */

export type Prioridade = "Alta" | "Média" | "Baixa";

export type Tarefa = {
  id: string;
  titulo: string;
  vinculo: string;
  prazo: string;
  prioridade: Prioridade;
  responsavel: string;
  feita: boolean;
};

export const tarefasIniciais: Tarefa[] = [
  {
    id: "t1",
    titulo: "Retornar proposta do site + SEO",
    vinculo: "Mendes Contabilidade",
    prazo: "Hoje",
    prioridade: "Alta",
    responsavel: "Você",
    feita: false,
  },
  {
    id: "t2",
    titulo: "Enviar contrato para assinatura",
    vinculo: "Nogueira Farma",
    prazo: "Hoje",
    prioridade: "Alta",
    responsavel: "Você",
    feita: false,
  },
  {
    id: "t3",
    titulo: "Follow-up de orçamento de cardápio",
    vinculo: "Prado Gastronomia",
    prazo: "Amanhã",
    prioridade: "Média",
    responsavel: "Você",
    feita: false,
  },
  {
    id: "t4",
    titulo: "Mostrar exemplos de vídeo motion",
    vinculo: "Rocha Pet Shop",
    prazo: "Qui",
    prioridade: "Média",
    responsavel: "Você",
    feita: false,
  },
  {
    id: "t5",
    titulo: "Atualizar portfólio no Instagram",
    vinculo: "Interno",
    prazo: "Sex",
    prioridade: "Baixa",
    responsavel: "Você",
    feita: false,
  },
  {
    id: "t6",
    titulo: "Cobrar mensalidade em atraso",
    vinculo: "Tavares Móveis",
    prazo: "Ontem",
    prioridade: "Alta",
    responsavel: "Você",
    feita: true,
  },
];

/* --------------------------------- WhatsApp -------------------------------- */

export type Mensagem = { id: string; de: "cliente" | "eu"; texto: string; hora: string };

export type Conversa = {
  id: string;
  nome: string;
  empresa: string;
  vinculo: "Lead" | "Cliente";
  naoLidas: number;
  hora: string;
  mensagens: Mensagem[];
};

export const conversas: Conversa[] = [
  {
    id: "w1",
    nome: "Aline Cardoso",
    empresa: "Clínica Sorriso Vivo",
    vinculo: "Cliente",
    naoLidas: 2,
    hora: "09:12",
    mensagens: [
      {
        id: "m1",
        de: "cliente",
        texto: "Bom dia! Consegue deixar a agenda mandando lembrete por WhatsApp?",
        hora: "09:05",
      },
      {
        id: "m2",
        de: "eu",
        texto: "Bom dia, Aline! Consigo sim. Vou te passar como fica e o prazo.",
        hora: "09:08",
      },
      { id: "m3", de: "cliente", texto: "Perfeito, e quanto fica a mais por mês?", hora: "09:12" },
    ],
  },
  {
    id: "w2",
    nome: "Fábio Mendes",
    empresa: "Mendes Contabilidade",
    vinculo: "Lead",
    naoLidas: 0,
    hora: "Ontem",
    mensagens: [
      {
        id: "m4",
        de: "eu",
        texto: "Fábio, enviei a proposta do site com SEO. Qualquer dúvida me chama.",
        hora: "16:40",
      },
      {
        id: "m5",
        de: "cliente",
        texto: "Recebi, vou analisar com meu sócio e te retorno.",
        hora: "17:02",
      },
    ],
  },
  {
    id: "w3",
    nome: "Denise Rocha",
    empresa: "Rocha Pet Shop",
    vinculo: "Lead",
    naoLidas: 1,
    hora: "Ontem",
    mensagens: [
      {
        id: "m6",
        de: "cliente",
        texto: "Vi seus vídeos no Instagram, queria um para o meu pet shop.",
        hora: "11:20",
      },
    ],
  },
  {
    id: "w4",
    nome: "Juliana Prado",
    empresa: "Prado Gastronomia",
    vinculo: "Cliente",
    naoLidas: 0,
    hora: "Seg",
    mensagens: [
      {
        id: "m7",
        de: "cliente",
        texto: "O pedido do balcão já imprime certinho, obrigada!",
        hora: "14:10",
      },
      { id: "m8", de: "eu", texto: "Que bom! Qualquer ajuste é só chamar.", hora: "14:15" },
    ],
  },
];

/* -------------------------------- Financeiro ------------------------------- */

export type CobrancaStatus = "Paga" | "Pendente" | "Atrasada";

export type Cobranca = {
  id: string;
  cliente: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: CobrancaStatus;
};

export const cobrancas: Cobranca[] = [
  {
    id: "r1",
    cliente: "Barros Engenharia",
    descricao: "Mensalidade sistema de obras",
    valor: 890,
    vencimento: "10/11",
    status: "Paga",
  },
  {
    id: "r2",
    cliente: "Clínica Sorriso Vivo",
    descricao: "Mensalidade agenda online",
    valor: 290,
    vencimento: "12/11",
    status: "Paga",
  },
  {
    id: "r3",
    cliente: "Prado Gastronomia",
    descricao: "Mensalidade cardápio e PDV",
    valor: 450,
    vencimento: "15/11",
    status: "Atrasada",
  },
  {
    id: "r4",
    cliente: "Barros Engenharia",
    descricao: "Parcela 2/3 implantação",
    valor: 2600,
    vencimento: "20/11",
    status: "Pendente",
  },
  {
    id: "r5",
    cliente: "Rocha Pet Shop",
    descricao: "Entrada vídeo motion",
    valor: 1200,
    vencimento: "25/11",
    status: "Pendente",
  },
  {
    id: "r6",
    cliente: "Clínica Sorriso Vivo",
    descricao: "Mensalidade agenda online",
    valor: 290,
    vencimento: "12/12",
    status: "Pendente",
  },
];

export type Despesa = {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  vencimento: string;
  status: "Paga" | "Pendente";
};

export const despesas: Despesa[] = [
  {
    id: "d1",
    descricao: "Supabase Pro",
    categoria: "Ferramentas",
    valor: 140,
    vencimento: "05/11",
    status: "Paga",
  },
  {
    id: "d2",
    descricao: "Domínios e hospedagem",
    categoria: "Ferramentas",
    valor: 85,
    vencimento: "08/11",
    status: "Paga",
  },
  {
    id: "d3",
    descricao: "Anúncios no Instagram",
    categoria: "Marketing",
    valor: 300,
    vencimento: "18/11",
    status: "Pendente",
  },
  {
    id: "d4",
    descricao: "Contador",
    categoria: "Serviços",
    valor: 250,
    vencimento: "20/11",
    status: "Pendente",
  },
];

export const fluxoMensal = [
  { mes: "Jun", entradas: 3100, saidas: 1250 },
  { mes: "Jul", entradas: 5400, saidas: 1400 },
  { mes: "Ago", entradas: 4300, saidas: 1380 },
  { mes: "Set", entradas: 5100, saidas: 1520 },
  { mes: "Out", entradas: 6200, saidas: 1600 },
  { mes: "Nov", entradas: 4800, saidas: 1450 },
];

export const mrrSerie = [980, 1170, 1170, 1460, 1630, 1630];

/* --------------------------------- Dashboard ------------------------------- */

export const origemLeads = [
  { label: "WhatsApp", value: 38, color: "var(--chart-1)" },
  { label: "Instagram", value: 27, color: "var(--chart-2)" },
  { label: "Indicação", value: 20, color: "var(--chart-4)" },
  { label: "Site", value: 15, color: "var(--chart-3)" },
];

export const agendaHoje = [
  { hora: "10:00", titulo: "Reunião de proposta", com: "Mendes Contabilidade" },
  { hora: "14:30", titulo: "Demonstração do SaaS", com: "Nogueira Farma" },
  { hora: "16:00", titulo: "Revisar vídeo motion", com: "Rocha Pet Shop" },
];
