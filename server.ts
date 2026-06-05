import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { initDb, saveInquiry, getAllInquiries, updateInquiryStatus, deleteInquiry } from "./server-db";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI securely on the server-side with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// 1. API: AI Consulting chat proxy to Gemini
app.post("/api/gemini/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, currentInput } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Parâmetro 'messages' inválido ou ausente." });
      return;
    }

    const systemInstruction = `Você é o Arquiteto de Software Líder Virtual da J4 Sistemas - Sistemas Personalizados, uma consultoria de elite especializada em desenvolvimento de sistemas corporativos, ERPs, CRM de alta performance, e dashboards.
SEU OBJETIVO: Ajudar o cliente em potencial (lead) a entender e amadurecer a ideia do sistema personalizado que ele precisa.
TOM DE VOZ: Amigável, extremamente profissional, focado em negócios, consultivo e focado em converter o interesse em uma solicitação de orçamento.
RESPIRAÇÃO DO NEGÓCIO: Mostre que o desenvolvimento sob medida (J4 Sistemas) elimina planilhas confusas, processos manuais lentos e software engessado que cobra por usuário.
DICAS IMPORTANTES:
1. Sempre responda em Português do Brasil.
2. Seja objetivo e ofereça valor imediato explicando qual tipo de sistema/módulo resolveria o problema do cliente.
3. Estimule ele a enviar o formulário de proposta ou a agendar uma reunião em menos de 3 mensagens, propondo uma sugestão prática de ação.
4. REGISTRO AUTOMÁTICO DE LEADS (MUITO IMPORTANTE): Sempre que o cliente fornecer dados de contato (como Telefone, WhatsApp, E-mail ou Nome) e descrever o problema ou sistema que ele quer construir, você DEVE chamar imediatamente a função 'saveLeadContact' com os dados extraídos para salvar no banco de dados. Nunca diga que salvou ou registrou o contato se não tiver executado essa função com sucesso.`;

    const chatHistory = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    // Generate content with function calling tool enabled
    let response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: "Iniciar conversa de consulta" }] },
        ...chatHistory,
        { role: "user", parts: [{ text: currentInput }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [{
          functionDeclarations: [
            {
              name: "saveLeadContact",
              description: "Salva os dados de contato do lead e a descrição do projeto no banco de dados administrativo da J4 Sistemas.",
              parameters: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Nome do cliente/lead (se fornecido)." },
                  email: { type: Type.STRING, description: "E-mail do lead (se fornecido)." },
                  phone: { type: Type.STRING, description: "Telefone ou WhatsApp de contato do lead." },
                  companyName: { type: Type.STRING, description: "Nome da empresa (se fornecido)." },
                  projectDescription: { type: Type.STRING, description: "Ideia do sistema, aplicativo, ERP, CRM ou desafio operacional conversado no chat." }
                },
                required: ["phone", "projectDescription"]
              }
            }
          ]
        }]
      }
    });

    // Check if the model decided to call the saveLeadContact tool
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === "saveLeadContact") {
        const args = call.args as {
          name?: string;
          email?: string;
          phone: string;
          companyName?: string;
          projectDescription: string;
        };

        const uniqueId = `lead_chat_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const suggestedCategory = args.projectDescription.length > 40
          ? args.projectDescription.substring(0, 37) + "..."
          : args.projectDescription;

        const inquiry = {
          id: uniqueId,
          name: args.name || "Lead Capturado via Chat",
          email: args.email || "contato_chat@j4sistemas.com.br",
          phone: args.phone,
          companyName: args.companyName || "",
          projectDescription: args.projectDescription,
          estimatedBudget: "Sob consulta (Via Chat)",
          urgency: "medium" as const,
          createdAt: new Date().toISOString(),
          status: "under_review" as const,
          aiAnalysis: {
            suggestedCategory,
            modules: ["Contato via Chat", "Análise de Requisitos Pendente"],
            techStack: ["A definir em reunião"],
            complexity: "Média" as const,
            roiEstimate: "A ser calculado após detalhamento do projeto.",
            detailedBlueprint: `### Pré-proposta gerada via Chat\n\nEste lead enviou seus dados através da conversa com o assistente virtual da J4 Sistemas.\n\n**Descrição do Projeto fornecida no chat:**\n${args.projectDescription}\n\n**Dados de Contato:**\n- **Nome:** ${args.name || "Não informado"}\n- **E-mail:** ${args.email || "Não informado"}\n- **WhatsApp/Telefone:** ${args.phone}`
          }
        };

        // Save into DB (PostgreSQL or local JSON file fallback)
        await saveInquiry(inquiry);

        // Feed function response back to Gemini to generate the final conversational text reply
        const contents = [
          { role: "user", parts: [{ text: "Iniciar conversa de consulta" }] },
          ...chatHistory,
          { role: "user", parts: [{ text: currentInput }] },
          {
            role: "model",
            parts: [{ functionCall: { name: call.name, args: call.args } }]
          },
          {
            role: "user",
            parts: [{
              functionResponse: {
                name: call.name,
                response: { success: true, message: "Lead salvo com sucesso no banco de dados administrativo da J4 Sistemas." }
              }
            }]
          }
        ];

        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });
      }
    }

    const replyText = response.text || "Desculpe, não consegui processar a resposta no momento. Como posso ajudar com seu sistema sob medida?";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Erro no chat do Gemini:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor ao consultar a inteligência artificial." });
  }
});

// 2. API: Generate personalized Software Blueprint JSON for structural feedback and save contact
app.post("/api/gemini/blueprint", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, companyName, projectDescription, estimatedBudget, urgency } = req.body;

    if (!projectDescription) {
      res.status(400).json({ error: "Falta a descrição do projeto para gerar o blueprint." });
      return;
    }

    const prompt = `Gere uma proposta de arquitetura técnica de software para o lead com as seguintes informações:
Nome do Lead: ${name}
Empresa: ${companyName || 'Não fornecida'}
Descrição do projeto: ${projectDescription}
Orçamento estimado: ${estimatedBudget || 'Sob consulta'}
Urgência do projeto: ${urgency}

A J4 Sistemas - Sistemas Personalizados precisa propor uma solução robusta e madura. Retorne as informações estruturadas em JSON detalhando a melhor solução personalizada.`;

    const systemInstruction = `Você é o Arquiteto de Software Chefe da J4 Sistemas - Sistemas Personalizados. Sua tarefa é desenhar as especificações iniciais de um sistema e retornar em JSON.
A resposta deve conter:
- suggestedCategory: Nome limpo e claro do sistema (ex: ERP de Operações Logísticas, Portal SaaS de Aluguéis, CRM Integrado de Vendas).
- modules: Array de exatamente 3 ou 4 módulos chaves (ex: ["Módulo de Rastreamento Real-time", "Dashboard Geral de Produtividade", "Gateway de Cobrança Automatizada"]).
- techStack: Array com principais tecnologias recomendadas com as justificativas (ex: ["React + Tailwind para interface veloz", "Node.js (NestJS) para microsserviços escaláveis", "PostgreSQL para dados complexos e transacionais"]).
- complexity: Uma string dizendo explicitamente 'Baixa' ou 'Média' ou 'Alta' ou 'Altíssima'.
- roiEstimate: Estimativa textual realista de retorno sobre investimento ou melhora (ex: "Economia estimada de 15 a 20 horas por funcionário/mês através de automações de faturamento").
- detailedBlueprint: Um texto em markdown descrevendo a visão arquitetural para convencer o cliente de que o desenvolvimento sob medida com a J4 Sistemas - Sistemas Personalizados é robustamente superior a qualquer software pronto.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedCategory: { type: Type.STRING, description: "Categoria do sistema personalizado sugerido." },
            modules: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Módulos de software principais sugeridos."
            },
            techStack: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Principais tecnologias recomendadas para o projeto."
            },
            complexity: { type: Type.STRING, description: "Nível de complexidade tecnológica (Baixa, Média, Alta, Altíssima)." },
            roiEstimate: { type: Type.STRING, description: "Estudo textual de ROI/Impacto Comercial estimado." },
            detailedBlueprint: { type: Type.STRING, description: "Análise profunda técnica em Markdown de como o projeto será erguido pela J4 Sistemas." }
          },
          required: ["suggestedCategory", "modules", "techStack", "complexity", "roiEstimate", "detailedBlueprint"]
        }
      }
    });

    const blueprintJson = JSON.parse(response.text || "{}");

    // Persist as a formal contact inquiry in our dual PostgreSQL/fallback storage
    const uniqueId = `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const inquiry = {
      id: uniqueId,
      name: name || "Visitante Anônimo",
      email: email || "sem_email@exemplo.com",
      phone: phone || "Sem telefone",
      companyName: companyName || "",
      projectDescription: projectDescription,
      estimatedBudget: estimatedBudget || "Sob consulta",
      urgency: urgency || "medium",
      createdAt: new Date().toISOString(),
      status: "under_review" as const,
      aiAnalysis: blueprintJson,
    };

    await saveInquiry(inquiry);

    res.json({ ...blueprintJson, id: uniqueId });
  } catch (error: any) {
    console.error("Erro na geração do Blueprint de Software:", error);
    res.status(500).json({ error: error.message || "Falha técnica ao estruturar proposta inteligente." });
  }
});

// 3. API: Check database engine connection status
app.get("/api/admin/db-status", async (req: Request, res: Response) => {
  const status = await initDb();
  res.json({
    engine: status.isPostgres ? "PostgreSQL (Produção Ativa)" : "JSON Local Failover (Backup Seguro)",
    isPostgres: status.isPostgres,
    credentialsConfigured: {
      user: "spacevip_react",
      database: "spacevip_site",
    }
  });
});

// Simple Secure admin authentication middleware
const checkAdminAuth = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer spacevip-token-success-987") {
    next();
  } else {
    res.status(401).json({ error: "Sua sessão administrativa expirou. Faça login novamente." });
  }
};

// 4. API: Admin authentication handler
app.post("/api/admin/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Exact credentials specified by user:
  // Login: spacevip_react, Senha: Jo159357*
  if (username === "spacevip_react" && password === "Jo159357*") {
    res.json({
      success: true,
      token: "spacevip-token-success-987",
      user: {
        username: "spacevip_react",
        role: "Diretor de Projetos",
        fullName: "Administrador J4 Sistemas"
      }
    });
  } else {
    res.status(401).json({ error: "Credenciais incorretas. Verifique o usuário e a senha." });
  }
});

// 5. API: Get all inquiries/leads of J4 Sistemas
app.get("/api/admin/inquiries", checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const list = await getAllInquiries();
    res.json({ count: list.length, data: list });
  } catch (error: any) {
    res.status(500).json({ error: "Falha ao recuperar os contatos." });
  }
});

// 6. API: Update lead status
app.post("/api/admin/inquiries/:id/status", checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await updateInquiryStatus(id, status);
    res.json({ success: true, message: "Status atualizado com sucesso." });
  } catch (error: any) {
    res.status(500).json({ error: "Falha ao atualizar status do lead." });
  }
});

// 7. API: Delete lead
app.delete("/api/admin/inquiries/:id", checkAdminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteInquiry(id);
    res.json({ success: true, message: "Lead removido com sucesso do sistema." });
  } catch (error: any) {
    res.status(500).json({ error: "Falha ao remover lead." });
  }
});

// Configure Vite middleware and static serving
async function setupServer() {
  // Boot database driver gracefully
  await initDb().catch((err) => {
    console.error("Database connection warning at startup:", err.message);
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Iniciando Vite em modo desenvolvimento...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Servindo arquivos estáticos em produção de /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[J4 Sistemas Server] Rodando no endereço http://localhost:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error("Falha ao configurar servidor:", err);
});
