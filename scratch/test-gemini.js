import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function run() {
  const systemInstruction = "Você é o Arquiteto de Software Líder Virtual da J4 Sistemas...";
  
  const chatTools = [{
    functionDeclarations: [
      {
        name: "saveLeadContact",
        description: "Salva os dados de contato do lead...",
        parameters: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            phone: { type: Type.STRING },
            projectDescription: { type: Type.STRING }
          },
          required: ["phone", "projectDescription"]
        }
      }
    ]
  }];

  // Mock messages:
  // 1. Model welcome message
  // 2. User says: "Meu nome é Carlos, whats (41) 99631-8959, quero um ERP"
  const messages = [
    { role: "model", content: "Olá! Sou a J4 AI..." },
    { role: "user", content: "Meu nome é Carlos, whats (41) 99631-8959, quero um ERP" }
  ];

  const chatHistory = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }]
  }));

  const currentInput = "Meu nome é Carlos, whats (41) 99631-8959, quero um ERP";

  console.log("Calling first generateContent...");
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
      tools: chatTools
    }
  });

  console.log("Full first response:", JSON.stringify(response, null, 2));
  console.log("First response function calls:", JSON.stringify(response.functionCalls));

  if (response.functionCalls && response.functionCalls.length > 0) {
    const call = response.functionCalls[0];
    console.log("Function call details:", call);

    const contents = [
      { role: "user", parts: [{ text: "Iniciar conversa de consulta" }] },
      ...chatHistory,
      { role: "user", parts: [{ text: currentInput }] },
      response.candidates[0].content,
      {
        role: "user",
        parts: [{
          functionResponse: {
            name: call.name,
            response: { success: true, message: "Lead salvo com sucesso no banco de dados administrativo da J4 Sistemas." },
            id: call.id
          }
        }]
      }
    ];

    console.log("Calling second generateContent with function response...");
    try {
      const secondResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
          tools: chatTools
        }
      });
      console.log("Success! Reply:", secondResponse.text);
    } catch (e) {
      console.error("Second call failed:", e);
    }
  }
}

run().catch(console.error);
