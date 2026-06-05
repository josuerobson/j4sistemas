import { Service, Testimonial, ProcessStep } from "./types";

export const OFFICE_STATS = [
  { value: "140+", label: "Sistemas Entregues" },
  { value: "4.9/5", label: "Avaliação Média dos Clientes" },
  { value: "+R$ 22M", label: "Retorno/Economia Gerada" },
  { value: "100%", label: "Livre de Licenças por Usuário" },
];

export const SERVICES: Service[] = [
  {
    id: "erps-crms",
    title: "ERPs & CRMs Inteligentes",
    description: "Sistemas corporativos robustos desenhados exatamente para reproduzir e otimizar os fluxos reais do seu negócio.",
    longDescription: "Esqueça softwares enlatados nos quais sua equipe precisa se adaptar. Criamos ERPs e CRMs construídos em torno da sua metodologia. Automatize finanças, controle faturamento em lote, lidere CRM de vendas inteligente e obtenha relatórios analíticos em tempo real.",
    icon: "LayoutDashboard",
    benefits: [
      "Sem custo por usuário: escala ilimitada para sua equipe.",
      "Campos e relatórios customizados na sua linguagem.",
      "Integração nativa com meios de pagamento e notas fiscais."
    ],
    features: [
      "Gestão de Contratos e Cobranças recorrentes",
      "Controle de Estoque e Compras inteligentes",
      "Módulos integrados com permissões refinadas de usuários",
      "Exportação nativa em XLS, PDF e relatórios dinâmicos"
    ]
  },
  {
    id: "automacoes-rpa",
    title: "Automação de Processos & RPA",
    description: "Substitua tarefas repetitivas e planilhas instáveis por robôs estruturados e automações de fluxos de trabalho.",
    longDescription: "Elimine o retrabalho manual. Desenvolvemos automações seguras que leem e-mails, processam documentos recebidos, disparam alertas inteligentes no WhatsApp de clientes e preenchem dados fiscais com precisão milimétrica.",
    icon: "Cpu",
    benefits: [
      "Redução drástica de erros humanos operacionais.",
      "Liberação de pessoal qualificado para tarefas estratégicas.",
      "Sistemas trabalhando 24h por dia, 7 dias por semana."
    ],
    features: [
      "Integração automática com APIs públicas e sistemas legados",
      "Processamento de OCR para leitura inteligente de documentos",
      "Formatador de relatórios e faturas consolidadas automaticamente",
      "Painel de logs centralizado de atividades automatizadas"
    ]
  },
  {
    id: "portais-saas",
    title: "Portais Web & Plataformas SaaS",
    description: "Aplicações web modernas, portais de clientes integrados ou produtos digitais prontos para comercialização (SaaS).",
    longDescription: "Erguemos plataformas escaláveis na nuvem perfeitas para atuar como portais de autoatendimento de clientes ou novas ideias de startups. Criadas com interfaces fluidas de altíssima performance para garantir engajamento total.",
    icon: "Globe",
    benefits: [
      "Carregamento em milissegundos e prontos para SEO.",
      "Painel específico e amigável para cliente final.",
      "Arquiteturas prontas para escala em milhares de sessões."
    ],
    features: [
      "Login seguro nativo ou integração com redes sociais",
      "Múltiplos níveis de assinatura e pagamento integrado",
      "Chatbot interno para rápido autoatendimento de suporte",
      "Configuração de marca branca (White-label) opcional"
    ]
  },
  {
    id: "integracoes-apis",
    title: "Integração Completa de APIs",
    description: "Conecte seus sistemas atuais com serviços de entrega, bancos, marketplaces e CRMs do mercado sem fricção.",
    longDescription: "Não jogue fora o que já funciona. Conectamos seu banco de dados atual com APIs complexas como Stripe, WhatsApp Business, Salesforce, SAP, correios, meios de cobrança Pix e cartões de maneira extremamente veloz e segura.",
    icon: "Shuffle",
    benefits: [
      "Fim do isolamento de dados entre ferramentas antigas.",
      "Fluxo em tempo real sem atrasos manuais de fechamento.",
      "Camada de barramento robusta que resiste a quedas de conexão."
    ],
    features: [
      "Desenvolvimento de webhooks de alta confiabilidade",
      "Sincronização bidirecional de estoques e cadastros",
      "Camada middleware protetora e anti-fraude",
      "Notificações instantâneas de falhas para sua equipe técnica"
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "dep-1",
    name: "Alexandre Gouveia",
    role: "Diretor de Operações",
    company: "Logical Logística Brasil",
    content: "A J4 Sistemas substituiu um ERP genérico que nos custava fortunas por um sistema focado puramente nas nossas entregas. Em 3 meses, reduzimos as falhas de faturamento a zero e o suporte ao cliente acelerou assustadoramente.",
    avatarSeed: "alexandre",
    metrics: {
      label: "Crescimento Operacional",
      value: "+45%"
    }
  },
  {
    id: "dep-2",
    name: "Carolina Vasconcellos",
    role: "Sócia-Fundadora",
    company: "Vasco & Associados Finanças",
    content: "O sistema de geração automática de propostas e controle de contratos sob medida revolucionou nossa rotina escriturária. O dashboard gerencial deles dá clareza total de faturamento em tempo real.",
    avatarSeed: "carolina",
    metrics: {
      label: "Tempo Economizado",
      value: "18h/semana"
    }
  },
  {
    id: "dep-3",
    name: "Ricardo Mendonça",
    role: "CEO & Co-fundador",
    company: "SaaSify Soluções",
    content: "Entregar o desenvolvimento de nossa nova plataforma web para a J4 Sistemas nos permitiu ir ao mercado 2 meses antes do previsto. O código é limpo, seguro e o design superou todas as expectativas da nossa equipe.",
    avatarSeed: "ricardo",
    metrics: {
      label: "Faturamento Adicional",
      value: "+R$120k/mês"
    }
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Diagnóstico & Discovery",
    description: "Estudamos minunciosamente seus gargalos diários e as planilhas que geram fricção.",
    duration: "Semana 1",
    details: [
      "Mapeamento detalhado dos processos manuais",
      "Análise das integrações com APIs necessárias",
      "Escopo técnico visual e claro"
    ]
  },
  {
    step: 2,
    title: "Arquitetura & Prototipagem",
    description: "Desenhamos as primeiras telas e toda a infraestrutura com foco máximo em usabilidade.",
    duration: "Semanas 2 a 3",
    details: [
      "Protótipos navegáveis detalhados de alta fidelidade",
      "Definição segura de banco de dados e fluxos de telas",
      "Validação total com o cliente antes de codificar"
    ]
  },
  {
    step: 3,
    title: "Desenvolvimento Ágil",
    description: "Nossa equipe codifica o sistema e realiza testes contínuos automatizados.",
    duration: "Semanas 4 a 8",
    details: [
      "Entregas incrementais com feedbacks constantes",
      "Foco total em segurança e velocidade de carregamento",
      "Código limpo, de alta performance e bem documentado"
    ]
  },
  {
    step: 4,
    title: "Implantação & Suporte",
    description: "Colocamos o sistema no ar de forma transparente e treinamos seu time sem impacto na operação.",
    duration: "Contínuo",
    details: [
      "Hospedagem em nuvens de alta performance autoescalável",
      "Suporte preventivo contínuo e monitoramento de logs",
      "Liberdade total para solicitar novas evoluções"
    ]
  }
];

export const FAQS = [
  {
    question: "Quanto custa um sistema personalizado na J4 Sistemas?",
    answer: "Os projetos são sob medida, ou seja, o investimento varia de acordo com os módulos exigidos e as integrações necessárias. Oferecemos um diagnóstico gratuito inicial para desenhar o escopo e entregar uma proposta de preço fixo transparente."
  },
  {
    question: "Eu terei que pagar licenças mensais por usuário?",
    answer: "Não! Esse é um dos principais benefícios da J4 Sistemas. O código desenvolvido é seu. Você pode escalar sua equipe para 10, 100 ou 1000 usuários sem pagar nenhum centavo adicional por licença de uso individual."
  },
  {
    question: "O código do sistema pertence a quem?",
    answer: "O código-fonte completo pertence 100% à sua empresa após a quitação do projeto. Você tem total independência e liberdade jurídica."
  },
  {
    question: "Quem cuidará do servidor e da manutenção do sistema?",
    answer: "Nós oferecemos planos completos de gerenciamento e suporte contínuo na nuvem, garantindo backups, atualizações de segurança e monitoramento de desempenho. Caso queira, também podemos configurar para rodar na nuvem própria de sua organização."
  },
  {
    question: "Qual o prazo médio de entrega de um sistema?",
    answer: "Sistemas em MVP ou com escopos focados costumam ir para o ar em cerca de 4 a 6 semanas. Projetos de ERPs extremamente robustos variam de 8 a 12 semanas, sempre com entregas parciais utilizáveis desde o primeiro mês."
  }
];
