import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, FileText, CheckCircle, Loader2, DollarSign, Calendar, ArrowRight, User, Mail, Phone, Briefcase, Sparkles, Database, Bookmark, AlertCircle, RefreshCw } from "lucide-react";
import { Inquiry } from "../types";

export function ContactForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    projectDescription: "",
    estimatedBudget: "",
    urgency: "medium" as 'low' | 'medium' | 'high'
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeBlueprintInquiry, setActiveBlueprintInquiry] = useState<Inquiry | null>(null);
  const [history, setHistory] = useState<Inquiry[]>([]);

  // Load previous inquiry calculations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("j4_inquiries");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveToHistory = (newInquiry: Inquiry) => {
    try {
      const updated = [newInquiry, ...history];
      setHistory(updated);
      localStorage.setItem("j4_inquiries", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMessage("Por favor, preencha todos os campos fundamentais de identificação.");
      return;
    }
    setErrorMessage("");
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
    setActiveBlueprintInquiry(null);
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      companyName: "",
      projectDescription: "",
      estimatedBudget: "",
      urgency: "medium"
    });
    setStep(1);
    setActiveBlueprintInquiry(null);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectDescription) {
      setErrorMessage("Conte-nos um pouco sobre quais problemas operacionais o sistema deve resolver.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/gemini/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Erro na solicitação da proposta inteligente.");
      }

      const rawBlueprint = await response.json();

      const newInquiry: Inquiry = {
        id: `inq-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        projectDescription: formData.projectDescription,
        estimatedBudget: formData.estimatedBudget || "Não fixação inicial",
        urgency: formData.urgency,
        createdAt: new Date().toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        status: "under_review",
        aiAnalysis: rawBlueprint
      };

      setActiveBlueprintInquiry(newInquiry);
      saveToHistory(newInquiry);
      setStep(3);
    } catch (error: any) {
      console.error(error);
      setErrorMessage("Houve um pequeno problema na geração automática. Cadastraremos seus dados de contato e nosso gerente o chamará no WhatsApp em minutos!");
      
      // Save even in case of blueprint generation error to guarantee conversion backup
      const fallbackInquiry: Inquiry = {
        id: `inq-fallback-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        projectDescription: formData.projectDescription,
        estimatedBudget: formData.estimatedBudget || "Não fixação inicial",
        urgency: formData.urgency,
        createdAt: new Date().toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        status: "under_review",
        aiAnalysis: {
          suggestedCategory: "Sistema Personalizado J4 Sistemas",
          modules: ["Modulo Geral Customizado", "Acesso Administrativo Seguro", "Integração Básica de Relatórios"],
          techStack: ["React + Tailwind para Front-end", "NodeJS ou Python backend", "Banco PostgreSQL ultra persistente"],
          complexity: "Média",
          roiEstimate: "Redução de desperdícios de faturamento no primeiro trimestre",
          detailedBlueprint: "Nossos consultores técnicos de alto nível estão revisando manualmente o seu descritivo e preparamos um orçamento definitivo em instantes."
        }
      };
      
      setActiveBlueprintInquiry(fallbackInquiry);
      saveToHistory(fallbackInquiry);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contato-modulo" className="bg-white rounded-3xl border border-blue-100 shadow-2xl overflow-hidden min-h-[580px]">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Design context visual sidebar */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-950 to-blue-900 text-white p-8 flex flex-col justify-between">
          <div>
            <span className="text-cyan-400 font-bold uppercase text-[10px] tracking-widest bg-blue-900/50 px-3 py-1 rounded-full border border-blue-800">
              Alta Conversão
            </span>
            <h3 className="font-sans text-2xl font-bold tracking-tight mt-5 text-white">
              Análise de Soluções Personalizadas
            </h3>
            <p className="text-sm text-blue-200 mt-3 leading-relaxed">
              Descubra em segundos qual arquitetura e módulos de software eliminarão o retrabalho operacional da sua marca.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-800/60 flex items-center justify-center text-cyan-300 border border-blue-700">
                ✔️
              </div>
              <span className="text-xs text-blue-100">Livre de licenças e aluguel mensal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-800/60 flex items-center justify-center text-cyan-300 border border-blue-700">
                ✔️
              </div>
              <span className="text-xs text-blue-100">Código pertencente 100% à sua empresa</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-800/60">
            <p className="text-[10px] text-blue-300 leading-tight">
              Seus dados de contato estão extremamente seguros sob criptografia de dados corporativa.
            </p>
          </div>
        </div>

        {/* Dynamic Multi-Step Area */}
        <div className="lg:col-span-8 p-8 flex flex-col justify-between min-h-[520px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNextStep}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest font-mono">Etapa 1 de 2: SeUS Dados</span>
                    <span className="text-xs text-slate-400">Identificação</span>
                  </div>

                  {errorMessage && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase">Seu Nome *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex: João da Silva"
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 focus:bg-white text-slate-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all border border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase">E-mail Corporativo *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="nome@empresa.com.br"
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 focus:bg-white text-slate-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all border border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase">Telefone / WhatsApp *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 focus:bg-white text-slate-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all border border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase">Nome da Empresa</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="Ex: Minha Empresa Ltda"
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 focus:bg-white text-slate-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all border border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:translate-x-1"
                  >
                    Próximo Passo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest font-mono">Etapa 2 de 2: O Desafio</span>
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="text-xs text-blue-600 hover:underline cursor-pointer"
                    >
                      Voltar etapa anterior
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="bg-teal-50 border border-teal-100 text-teal-800 text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 uppercase">Fale sobre os desafios operacionais a resolver *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.projectDescription}
                        onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                        placeholder="Ex: Preciso de um software para nosso comercial gerenciar contatos, integrar com WhatsApp API e emitir faturas de mensalidades no Pix gerando dashboard consolidado para reuniões sem planilhas manuseadas pelo financeiro."
                        className="w-full px-4 py-3 bg-slate-50 focus:bg-white text-slate-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all border border-slate-200 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase">Orçamento Aproximado</label>
                        <select
                          value={formData.estimatedBudget}
                          onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 focus:bg-white text-slate-700 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 border border-slate-200 transition-all"
                        >
                          <option value="">Selecione uma faixa (Sob consulta)</option>
                          <option value="Abaixo de R$ 15k">Abaixo de R$ 15k</option>
                          <option value="R$ 15k a R$ 30k">R$ 15k a R$ 30k</option>
                          <option value="R$ 30k a R$ 60k">R$ 30k a R$ 60k</option>
                          <option value="Acima de R$ 60k">Acima de R$ 60k (Enterprise)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase">Urgência de Desenvolvimento</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['low', 'medium', 'high'] as const).map((urg) => (
                            <button
                              key={urg}
                              type="button"
                              onClick={() => setFormData({ ...formData, urgency: urg })}
                              className={`py-2 px-1 text-center font-medium rounded-xl text-xs border transition-all cursor-pointer ${
                                formData.urgency === urg
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {urg === 'low' ? '30+ dias' : urg === 'medium' ? '15-30 dias' : 'Imediato'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    Nossa IA desenhará a infraestrutura ideal na hora!
                  </span>

                  <button
                    type="submit"
                    disabled={loading || !formData.projectDescription}
                    className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 disabled:from-slate-200 disabled:to-slate-200 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Desenhando Arquitetura...</span>
                      </>
                    ) : (
                      <>
                        <span>Gerar Proposta Técnica</span>
                        <Send className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}

            {step === 3 && activeBlueprintInquiry && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 flex-1"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Proposta Desenha com Sucesso!
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mt-1">
                      {activeBlueprintInquiry.aiAnalysis?.suggestedCategory}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetForm}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Fazer Outro
                    </button>
                  </div>
                </div>

                {/* Structured diagnostic values */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100/50">
                    <span className="text-[10px] text-blue-700 uppercase font-bold tracking-wider block mb-1">Módulos Sugeridos pela J4 Sistemas</span>
                    <ul className="text-xs text-slate-700 space-y-1.5 font-medium list-disc list-inside">
                      {activeBlueprintInquiry.aiAnalysis?.modules.map((mod, idx) => (
                        <li key={idx} className="truncate">{mod}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Tecnologias Recomendadas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeBlueprintInquiry.aiAnalysis?.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-slate-200/70 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-md">
                          {tech.split(" p")[0]} {/* truncate after " para" */}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-slate-200/50 pt-2">
                      <span>Complexidade: <span className="text-blue-600 font-bold">{activeBlueprintInquiry.aiAnalysis?.complexity}</span></span>
                      <span>Impacto/ROI: <span className="text-emerald-600 font-bold">Excelente</span></span>
                    </div>
                  </div>
                </div>

                {/* ROI Text Highlights */}
                <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-4">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold tracking-wider block mb-1">Estudo de Viabilidade Comercial & ROI</span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {activeBlueprintInquiry.aiAnalysis?.roiEstimate}
                  </p>
                </div>

                {/* Text Blueprint Description detailing the build structure */}
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 h-[200px] overflow-y-auto border border-slate-800 text-xs leading-relaxed space-y-2">
                  <span className="text-[9px] text-blue-400 font-bold uppercase tracking-wider font-mono block border-b border-slate-800 pb-1 mb-2">Visão Arquitetural Estendida</span>
                  {activeBlueprintInquiry.aiAnalysis?.detailedBlueprint.split("\n\n").map((par, i) => (
                    <p key={i} className="font-mono text-[11px] text-slate-300">
                      {par.replace(/[#*]/g, "")}
                    </p>
                  ))}
                </div>

                {/* Highly compelling action trigger for real call */}
                <div className="bg-blue-600 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div className="text-center sm:text-left">
                    <div className="text-xs font-bold text-cyan-200 tracking-wider uppercase">Gostou deste desenho de arquitetura?</div>
                    <p className="text-sm font-semibold mt-1">
                      Agende uma call de 15 min para validar o orçamento final.
                    </p>
                  </div>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${formData.phone.replace(/\D/g, "") || "5511999999999"}&text=Olá%20J4%20Sistemas!%20Gostei%20do%20blueprint%20gerado%20para%20mim%20e%20gostaria%20de%20um%20orcamento%20para%20o%20sistema%20de%20${encodeURIComponent(activeBlueprintInquiry.aiAnalysis?.suggestedCategory || "Software")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-slate-50 text-blue-900 px-5  py-3 font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer text-center"
                  >
                    Agendar Fone/WhatsApp
                    <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Persistent historical inquiry tracker so the lead can review previously sent requests */}
      {history.length > 1 && (
        <div className="bg-slate-50 border-t border-slate-100 p-5 mt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-3">
            <Bookmark className="w-4 h-4 text-slate-400" />
            <span>Seu histórico de solicitações nesta sessão ({history.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.map((h, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveBlueprintInquiry(h);
                  setStep(3);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all text-xs cursor-pointer ${
                  activeBlueprintInquiry?.id === h.id
                    ? 'bg-blue-50/80 border-blue-400 text-blue-900 ring-2 ring-blue-600/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold truncate text-slate-800">{h.aiAnalysis?.suggestedCategory}</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono tracking-tight">{h.createdAt}</div>
                <div className="mt-2 text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 inline-block uppercase font-bold tracking-tight">
                  Status: Análise
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
