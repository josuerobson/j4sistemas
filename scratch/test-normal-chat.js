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

async function testNormalChat() {
  const systemInstruction = "Você é o Arquiteto de Software Líder Virtual da J4 Sistemas...";
  const chatTools = [{
    functionDeclarations: [
      {
        name: "saveLeadContact",
        description: "Salva os dados de contato...",
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

  const messages = [
    { role: "model", content: "Olá! Sou a J4 AI..." }
  ];

  const chatHistory = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }]
  }));

  const currentInput = "Olá, tudo bem?";

  console.log("Testing normal chat...");
  let response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
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

  console.log("Normal Chat Reply:", response.text);
}

testNormalChat().catch(console.error);
