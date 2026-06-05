import { initDb, saveInquiry, updateInquiryAnalysis } from "../server-db.js";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  console.log("Initializing DB...");
  const status = await initDb();
  console.log("DB connection status:", status);

  const inquiry = {
    id: "test_lead_123",
    name: "Carlos Test",
    email: "carlos@test.com",
    phone: "41996318959",
    companyName: "J4 Test",
    projectDescription: "ERP",
    estimatedBudget: "Sob consulta",
    urgency: "medium" as const,
    createdAt: new Date().toISOString(),
    status: "under_review" as const,
    aiAnalysis: {
      suggestedCategory: "ERP",
      modules: ["Financeiro"],
      techStack: ["React"],
      complexity: "Média" as const,
      roiEstimate: "100%",
      detailedBlueprint: "Blueprint details",
      chatHistory: [
        { id: "msg-1", role: "user" as const, content: "Olá", timestamp: "18:00" }
      ]
    }
  };

  console.log("Saving mock inquiry...");
  await saveInquiry(inquiry);
  console.log("Saved inquiry successfully!");

  console.log("Updating inquiry analysis...");
  inquiry.aiAnalysis.chatHistory.push({
    id: "msg-2",
    role: "model" as const,
    content: "Olá Carlos! Como posso ajudar?",
    timestamp: "18:01"
  });

  await updateInquiryAnalysis(inquiry.id, inquiry.aiAnalysis);
  console.log("Updated inquiry analysis successfully!");
}

run().catch(console.error);
