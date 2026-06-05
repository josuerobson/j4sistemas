import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, Users, Zap, CheckCircle, Smartphone, Database, DollarSign, Activity, FileText } from "lucide-react";

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState<"faturamento" | "clientes" | "automacao" | "integracoes">("faturamento");
  const [simulatedTime, setSimulatedTime] = useState("");
  const [activeClients, setActiveClients] = useState(128);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSimulatedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Randomize live metrics mildly to look extremely dynamic
    const clientInterval = setInterval(() => {
      setActiveClients((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(clientInterval);
    };
  }, []);

  const faturamentoItems = [
    { title: "Faturamento Mensal", val: "R$ 142.840", scale: "w-[85%]", color: "bg-blue-600", tag: "+12.4% este mês" },
    { title: "Margem de Lucro", val: "72.4%", scale: "w-[72%]", color: "bg-teal-500", tag: "Meta anual: 75%" },
    { title: "Cobranças Pendentes", val: "R$ 8.920", scale: "w-[15%]", color: "bg-amber-500", tag: "Dedução automática ativa" }
  ];

  const automacaoLogs = [
    { text: "Webhook: Pagamento Pix confirmado - NF-e #1084 emitida", time: "Há 2 mins", color: "text-emerald-500" },
    { text: "RPA: Sincronização de estoque fiscal finalizada", time: "Há 5 mins", color: "text-blue-500" },
    { text: "ZapBot: Alerta de vencimento de contrato enviado no WhatsApp", time: "Há 12 mins", color: "text-purple-500" },
    { text: "Sistema: Inteligência Artificial gerou relatório financeiro", time: "Há 32 mins", color: "text-amber-500" }
  ];

  const integracoesList = [
    { name: "ERP Senior & SAP", desc: "Sincronização bidirecional", status: "Instalado", active: true },
    { name: "Stripe & ASAAS API", desc: "Cobranças Pix e Boleto", status: "Instalado", active: true },
    { name: "WhatsApp Cloud API", desc: "Mensagens proativas no checkout", status: "Instalado", active: true },
    { name: "Google Analytics & BigQuery", desc: "Extração analítica diária", status: "Em conexão", active: false }
  ];

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-5 overflow-hidden flex flex-col font-sans h-[480px]">
      {/* Top dashboard browser bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-400 block"></span>
          <span className="ml-3 text-xs bg-slate-800/80 px-3 py-1 rounded-md text-slate-400 select-none">
            logical-logistica.j4sistemas.com.br
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-slate-500 font-mono tracking-wider">{simulatedTime}</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full bg-blue-400 ${pulse ? 'scale-150 animate-ping' : ''}`} />
            SISTEMA ATIVO
          </span>
        </div>
      </div>

      {/* Main body of mockup split internally */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
        {/* Navigation panel */}
        <div className="md:col-span-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveTab("faturamento")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "faturamento" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            <DollarSign className="w-4 h-4 shrink-0" />
            <span>Painel Financeiro</span>
          </button>
          <button
            onClick={() => setActiveTab("clientes")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "clientes" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Gestão Clientes</span>
          </button>
          <button
            onClick={() => setActiveTab("automacao")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "automacao" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span>Automações</span>
          </button>
          <button
            onClick={() => setActiveTab("integracoes")}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "integracoes" ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span>Integrações</span>
          </button>
        </div>

        {/* Content detail visualization */}
        <div className="md:col-span-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4 overflow-y-auto flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeTab === "faturamento" && (
              <motion.div
                key="faturamento"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex-1 flex flex-col justify-center"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faturamento & Caixa</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Livre de Taxas</span>
                </div>
                <div className="space-y-3.5">
                  {faturamentoItems.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-300 font-sans">{item.title}</span>
                        <span className="text-slate-100 font-mono font-semibold">{item.val}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: item.scale.slice(3, -2) + "%" }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">{item.tag}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "clientes" && (
              <motion.div
                key="clientes"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 flex-1 flex flex-col justify-center"
              >
                <div className="text-center py-2 space-y-2">
                  <div className="text-sm font-semibold text-slate-400">Usuários Ativos Simulados na Plataforma</div>
                  <motion.div
                    key={activeClients}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-4xl sm:text-5xl font-mono font-bold text-blue-400 drop-shadow-md"
                  >
                    {activeClients}
                  </motion.div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Conexões simultâneas monitoradas através da infraestrutura de microsserviços sob medida da J4 Sistemas.
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
                    <span className="text-xs font-medium text-slate-300">Tempo de Resposta de API</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-semibold">41ms (0.0% Perda)</span>
                </div>
              </motion.div>
            )}

            {activeTab === "automacao" && (
              <motion.div
                key="automacao"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 flex-1 flex flex-col justify-center"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Histórico de Robôs (RPA)</span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full font-semibold">100% Autônomo</span>
                </div>
                <div className="space-y-2.5">
                  {automacaoLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start bg-slate-900/50 p-2 rounded-lg border border-slate-900/80">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 truncate font-sans">{log.text}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "integracoes" && (
              <motion.div
                key="integracoes"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 flex-1 flex flex-col justify-center"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conexões Ativas de APIs</span>
                  <span className="text-[10px] text-teal-400 font-semibold font-mono">Restful / Webhooks</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {integracoesList.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-200">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-medium leading-tight">{item.desc}</div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span className="text-[9px] text-slate-400 uppercase font-semibold font-mono">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-3 text-center border-t border-slate-800/50 pt-2 text-[10px] text-slate-500">
            Painel demonstrativo simulado em tempo real e responsivo.
          </div>
        </div>
      </div>
    </div>
  );
}
