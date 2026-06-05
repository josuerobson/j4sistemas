import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, User, Send, Sparkles, Loader2, ArrowRight, MessageSquare, Briefcase } from "lucide-react";
import { ChatMessage } from "../types";

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "Olá! Sou a **J4 AI**, seu consultor de arquitetura de sistemas virtuais. Conte-me qual desafio operacional sua empresa enfrenta ou qual software você sonha em construir. Posso sugerir módulos, integrações e desenhar a proposta técnica ideal!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const presets = [
    {
      label: "Substituir planilhas financeiras",
      prompt: "Quero criar um sistema financeiro personalizado para substituir planilhas financeiras de fluxo de caixa e emitir notas automáticas baseadas em cobranças Pix e Cartão."
    },
    {
      label: "Portal de Clientes (SaaS)",
      prompt: "Preciso de um Portal Web do Cliente onde eles possam ver suas faturas, abrir tíquetes de suporte e baixar relatórios de atendimento."
    },
    {
      label: "Faturamento & Estoque integrado",
      prompt: "Preciso de um sistema para estoque com leitor de código de barras físico integrado que dispare relatórios automáticos de compras."
    }
  ];

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentInput: textToSend,
          leadId: leadId
        })
      });

      if (!response.ok) {
        throw new Error("Erro na comunicação com o servidor.");
      }

      const data = await response.json();
      
      if (data.leadId) {
        setLeadId(data.leadId);
      }
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "model",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        content: "Oops! Tive um leve soluço de conexão com a nave-mãe. Por favor, tente enviar novamente em alguns segundos.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-blue-100 shadow-xl overflow-hidden flex flex-col h-[600px] relative">
      {/* Dynamic consulting header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 backdrop-blur-md flex items-center justify-center border border-blue-400">
            <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <h4 className="font-semibold text-base leading-tight">J4 AI</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs text-blue-200">Arquiteto de Soluções Online</span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-blue-800/60 px-3 py-1.5 rounded-full text-xs text-blue-100 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          Powered by Gemini 2.5
        </div>
      </div>

      {/* Message space */}
      <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === "user" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
              }`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-sm"
                }`}>
                  {/* Simplistic MarkDown parser simulation for bold texts */}
                  {m.content.split("\n").map((line, linIdx) => (
                    <p key={linIdx} className={linIdx > 0 ? "mt-1.5" : ""}>
                      {line.split("**").map((chunk, chunkIdx) => (
                        chunkIdx % 2 === 1 ? <strong key={chunkIdx} className={m.role === "user" ? "text-cyan-200 font-bold" : "text-blue-900 font-bold"}>{chunk}</strong> : chunk
                      ))}
                    </p>
                  ))}
                </div>
                <span className={`text-[10px] mt-1 block px-1 text-slate-400 ${m.role === "user" ? "text-right" : "text-left"}`}>
                  {m.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-center mr-auto max-w-[80%]"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200/80 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-xs text-slate-500 font-medium font-sans">Analisando arquitetura e digitando...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggests / Presets */}
      {messages.length === 1 && !isLoading && (
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-wrap gap-2 justify-center">
          <p className="text-xs text-slate-400 w-full text-center mb-1.5 font-medium">Toque em uma ideia ou digite abaixo:</p>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.prompt)}
              className="text-xs font-medium text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/50 hover:border-blue-300 rounded-full px-3 py-2 transition-all duration-200 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: Como posso automatizar as faturas do meu provedor de internet?"
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-slate-100 focus:bg-white text-slate-700 placeholder-slate-400 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all border border-transparent disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="sm:px-5 p-3 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
        >
          <span className="hidden sm:inline">Analisar</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
