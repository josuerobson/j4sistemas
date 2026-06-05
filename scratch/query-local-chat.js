

async function queryLocalServer() {
  console.log("Sending query to local server at http://localhost:3000/api/gemini/chat...");
  try {
    const response = await fetch("http://localhost:3000/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            id: "welcome",
            role: "model",
            content: "Olá! Sou a J4 AI...",
            timestamp: "18:00"
          }
        ],
        currentInput: "Olá, gostaria de um orçamento para um sistema."
      })
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Query failed:", error.message);
  }
}

queryLocalServer();
