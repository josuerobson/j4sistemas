import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { Inquiry } from "../types";

interface AdminPanelProps {
  onClose: () => void;
}

interface DBStatus {
  engine: string;
  isPostgres: boolean;
  credentialsConfigured: {
    user: string;
    database: string;
  };
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Stats / Leads
  const [leads, setLeads] = useState<Inquiry[]>([]);
  const [dbStatus, setDbStatus] = useState<DBStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filtering & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  // Selected Lead for Detailed view
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Sidebar navigation in Admin
  const [activeTab, setActiveTab] = useState<"leads" | "settings" | "extensibility">("leads");

  // Load session from localStorage if existing
  useEffect(() => {
    const savedToken = localStorage.getItem("j4sistemas_admin_token");
    const savedUser = localStorage.getItem("j4sistemas_admin_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchAdminData(savedToken);
    }
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch("/api/admin/db-status");
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.error("Erro ao obter status do banco:", err);
    }
  };

  const fetchAdminData = async (activeToken: string) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/inquiries", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (res.ok) {
        const resJson = await res.json();
        setLeads(resJson.data || []);
      } else {
        const errJson = await res.json();
        setFetchError(errJson.error || "Sessão expirada. Faça login novamente.");
        handleLogout();
      }
    } catch (err) {
      setFetchError("Não foi possível conectar ao servidor para obter dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("j4sistemas_admin_token", data.token);
        localStorage.setItem("j4sistemas_admin_user", JSON.stringify(data.user));
        setToken(data.token);
        setIsAuthenticated(true);
        fetchAdminData(data.token);
      } else {
        const errData = await res.json();
        setAuthError(errData.error || "Falha na autenticação.");
      }
    } catch (err) {
      setAuthError("Erro na conexão com servidor HTTP backend.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("j4sistemas_admin_token");
    localStorage.removeItem("j4sistemas_admin_user");
    setToken(null);
    setIsAuthenticated(false);
    setLeads([]);
  };

  const handleUpdateStatus = async (id: string, newStatus: Inquiry["status"]) => {
    if (!token) return;
    setIsUpdatingStatus(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Local update in states
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
        );
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert("Falha ao atualizar o status do lead.");
      }
    } catch (err) {
      alert("Erro de rede ao atualizar status.");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Tem certeza absoluta que deseja remover este lead do sistema?")) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
      } else {
        alert("Falha ao remover o lead.");
      }
    } catch (err) {
      alert("Erro de rede ao deletar lead.");
    }
  };

  // Status mapping
  const statusLabels: Record<Inquiry["status"], string> = {
    under_review: "Em Análise Humana",
    architecture_design: "Desenhando Arquitetura",
    proposal_generation: "Proposta Pronta",
    ready_for_meeting: "Reunião Agendada",
  };

  const statusColors: Record<Inquiry["status"], string> = {
    under_review: "bg-amber-100 text-amber-800 border-amber-200",
    architecture_design: "bg-indigo-100 text-indigo-800 border-indigo-200",
    proposal_generation: "bg-emerald-100 text-emerald-800 border-emerald-200",
    ready_for_meeting: "bg-blue-100 text-blue-800 border-blue-200",
  };

  // Urgency mapping
  const urgencyLabels: Record<Inquiry["urgency"], { text: string; color: string }> = {
    low: { text: "Baixa Urgência", color: "bg-slate-100 text-slate-700 border-slate-200" },
    medium: { text: "Média Urgência", color: "bg-blue-50 text-blue-700 border-blue-200" },
    high: { text: "Urgência Crítica", color: "bg-rose-100 text-rose-800 border-rose-300 animate-pulse" },
  };

  // Filter list
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.companyName && lead.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.aiAnalysis?.suggestedCategory &&
        lead.aiAnalysis.suggestedCategory.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesUrgency = urgencyFilter === "all" || lead.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  // Calculate stats values
  const totalCount = leads.length;
  const criticalCount = leads.filter((l) => l.urgency === "high").length;
  const designCount = leads.filter((l) => l.status === "architecture_design").length;
  const readyCount = leads.filter((l) => l.status === "ready_for_meeting").length;

  const handleRenderIcon = (name: string, className = "w-5 h-5") => {
    const Icon = (LucideIcons as any)[name];
    if (!Icon) return <LucideIcons.Folder className={className} />;
    return <Icon className={className} />;
  };

  // Simple inline Markdown renderer for AI structured blueprint description
  const renderMarkdown = (mdText?: string) => {
    if (!mdText) return null;
    return mdText.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-900 mt-4 mb-2 flex items-center gap-2 border-b border-slate-100 pb-1">
            <span className="w-1.5 h-3 bg-blue-600 rounded-xs" />
            {trimmed.replace("###", "")}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-blue-950 mt-5 mb-2.5">
            {trimmed.replace("##", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <li key={idx} className="text-xs text-slate-600 ml-4 list-disc mb-1 leading-relaxed">
            {trimmed.substring(1).trim()}
          </li>
        );
      }
      if (trimmed === "") return <div key={idx} className="h-2" />;
      return (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2.5">
          {line}
        </p>
      );
    });
  };

  return (
    <div id="j4sistemas-admin" className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl relative overflow-hidden border border-slate-200">
        
        {/* TOP STATUS CONTROL BAR */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <LucideIcons.Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm uppercase tracking-wider block">
                ADMINISTRATIVO <span className="text-blue-400">J4 SISTEMAS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                Painel Geral de Prospecções
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Real DB connection status with exact database details */}
            {dbStatus && (
              <div
                className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                  dbStatus.isPostgres
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
                    : "bg-blue-950/80 text-blue-300 border-blue-800/80"
                }`}
                title={`Host PostgreSQL default monitor. Configurado: ${dbStatus.credentialsConfigured.user}@${dbStatus.credentialsConfigured.database}`}
              >
                <span className={`w-2 h-2 rounded-full ${dbStatus.isPostgres ? "bg-emerald-400 animate-pulse" : "bg-blue-400"}`} />
                <span>{dbStatus.engine}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              aria-label="Minimizar Administrativo"
            >
              <LucideIcons.X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTROLLER RENDER ACCORDING TO AUTH STATE */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-4 bg-slate-50 relative">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
              <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-xl border border-slate-200/85 relative z-10 space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <LucideIcons.Lock className="w-6 h-6" />
                </div>
                <h2 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                  Acesso Restrito J4 Sistemas
                </h2>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Insira o login e a senha definidos na configuração do PostgreSQL para gerenciar as prospecções do site.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {authError && (
                  <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <LucideIcons.AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="login-username" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                    Nome de Usuário (Database Login)
                  </label>
                  <div className="relative">
                    <LucideIcons.User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      id="login-username"
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold text-slate-800 bg-slate-50/50"
                      placeholder="spacevip_react"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 ">
                  <label htmlFor="login-password" className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                    Senha de Segurança
                  </label>
                  <div className="relative">
                    <LucideIcons.Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      id="login-password"
                      type="password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold text-slate-800 bg-slate-50/50"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-blue-600/15 cursor-pointer hover:shadow-lg active:scale-98"
                >
                  Entrar no Painel de Controle
                </button>
              </form>

              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 items-center text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  <LucideIcons.Info className="w-3.5 h-3.5 text-blue-500" /> Credenciais informadas na sua solicitação aplicadas.
                </span>
                {dbStatus && (
                  <span className="text-slate-500">
                    Banco de Dados Monitorado: <span className="text-blue-600 font-extrabold">{dbStatus.engine}</span>
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden bg-slate-50">
            {/* VERTICAL SLATE SIDEBAR NAVIGATION */}
            <aside className="w-16 sm:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
              <div className="py-6 space-y-7">
                {/* Profile Widget */}
                <div className="hidden sm:block px-4 pb-4 border-b border-slate-800 space-y-1">
                  <p className="text-[10px] font-extrabold text-blue-400 tracking-wider uppercase">Operador Atual</p>
                  <h3 className="text-sm font-bold text-white truncate">Diretoria J4 Sistemas</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold pt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Sessão Encriptada</span>
                  </div>
                </div>

                <nav className="px-2 space-y-1">
                  <button
                    onClick={() => setActiveTab("leads")}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer ${
                      activeTab === "leads"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <LucideIcons.Inbox className="w-5 h-5 shrink-0" />
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Leads Recebidos</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("extensibility")}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer ${
                      activeTab === "extensibility"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <LucideIcons.Boxes className="w-5 h-5 shrink-0" />
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Config Sincronia</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer ${
                      activeTab === "settings"
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/15"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <LucideIcons.Fingerprint className="w-5 h-5 shrink-0" />
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Configuração Admin</span>
                  </button>
                </nav>
              </div>

              {/* Logout at bottom */}
              <div className="p-3 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center sm:justify-start gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-955/20 transition cursor-pointer"
                >
                  <LucideIcons.LogOut className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-rose-500">Sair do Painel</span>
                </button>
              </div>
            </aside>

            {/* TAB CONTAINER FLOWS */}
            <main className="flex-1 flex flex-col overflow-hidden">
              
              {/* TAB 1: Leads list view */}
              {activeTab === "leads" && (
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                  
                  {/* Left Column: Leads list and general statistics */}
                  <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-5">
                    
                    {/* Minimal Statistics Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 shrink-0">
                      
                      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <LucideIcons.Users className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-extrabold tracking-wider">Leads Totais</span>
                          <span className="text-xl font-black text-slate-900 font-display">{totalCount}</span>
                        </div>
                      </div>

                      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                          <LucideIcons.Flame className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-extrabold tracking-wider">Urgência Alta</span>
                          <span className="text-xl font-black text-rose-600 font-display">{criticalCount}</span>
                        </div>
                      </div>

                      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <LucideIcons.LayoutGrid className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-extrabold tracking-wider">Em Análise</span>
                          <span className="text-xl font-black text-indigo-600 font-display">{designCount}</span>
                        </div>
                      </div>

                      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <LucideIcons.CalendarCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-extrabold tracking-wider">Prontos p/ Agenda</span>
                          <span className="text-xl font-black text-emerald-600 font-display">{readyCount}</span>
                        </div>
                      </div>

                    </div>

                    {/* Filter and search tool bar */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
                      <div className="relative w-full md:max-w-xs">
                        <LucideIcons.Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="text"
                          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 placeholder:text-slate-400 bg-slate-55/40"
                          placeholder="Buscar por lead, empresa, e-mail..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 w-full md:w-auto items-center">
                        <select
                          className="px-2.5 py-2.5 border border-slate-200 bg-white text-[11px] font-bold rounded-xl text-slate-600 focus:border-blue-500 focus:ring-1 cursor-pointer outline-hidden flex-1 md:flex-initial"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">Todos os Status</option>
                          <option value="under_review">Em Análise Humana</option>
                          <option value="architecture_design">Desenhando Arquitetura</option>
                          <option value="proposal_generation">Proposta Pronta</option>
                          <option value="ready_for_meeting">Reunião Agendada</option>
                        </select>

                        <select
                          className="px-2.5 py-2.5 border border-slate-200 bg-white text-[11px] font-bold rounded-xl text-slate-600 focus:border-blue-500 focus:ring-1 cursor-pointer outline-hidden flex-1 md:flex-initial"
                          value={urgencyFilter}
                          onChange={(e) => setUrgencyFilter(e.target.value)}
                        >
                          <option value="all">Todas Urgências</option>
                          <option value="low">Baixa Urgência</option>
                          <option value="medium">Média Urgência</option>
                          <option value="high">Urgência Crítica</option>
                        </select>
                      </div>
                    </div>

                    {/* Leads dataset collection */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex-1 min-h-[300px]">
                      {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400">
                          <LucideIcons.Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                          <p className="text-xs font-semibold uppercase tracking-wider">Acessando banco de dados...</p>
                        </div>
                      ) : fetchError ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
                          <LucideIcons.AlertCircle className="w-8 h-8 text-rose-500" />
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-wilder">{fetchError}</p>
                          <button
                            onClick={() => fetchAdminData(token || "")}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-bold uppercase transition"
                          >
                            Tentar Novamente
                          </button>
                        </div>
                      ) : filteredLeads.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-1">
                          <LucideIcons.FolderOpen className="w-10 h-10 text-slate-300" />
                          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-600">Nenhum Lead Encontrado</p>
                          <p className="text-[10px] text-slate-400 max-w-xs">
                            A prospecção está vazia para estes filtros. Cadastre novos orçamentos a partir do formulário inteligente na página inicial!
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black uppercase tracking-wider text-slate-500">
                                <th className="py-3 px-4">Empresa / Lead</th>
                                <th className="py-3 px-4">Sugestão de Sistema</th>
                                <th className="py-3 px-4">Nível de Urgência</th>
                                <th className="py-3 px-4">Status Interno</th>
                                <th className="py-3 px-4">Data Envio</th>
                                <th className="py-3 px-4 text-right">Ação</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                              {filteredLeads.map((lead) => {
                                const matchedUrgency = urgencyLabels[lead.urgency] || urgencyLabels.medium;
                                return (
                                  <tr
                                    key={lead.id}
                                    className={`hover:bg-slate-50/70 transition cursor-pointer ${
                                      selectedLead?.id === lead.id ? "bg-blue-50/50 border-l-2 border-l-blue-600" : ""
                                    }`}
                                    onClick={() => setSelectedLead(lead)}
                                  >
                                    <td className="py-3.5 px-4 space-y-1">
                                      <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                        <LucideIcons.Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span>{lead.companyName || "Pessoa Física"}</span>
                                      </div>
                                      <div className="text-[11px] text-slate-500 pl-5 leading-normal">
                                        {lead.name} • {lead.email}
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-4 max-w-[200px] truncate">
                                      {lead.aiAnalysis ? (
                                        <div className="space-y-0.5">
                                          <div className="font-extrabold text-blue-900 flex items-center gap-1">
                                            <LucideIcons.Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                                            <span className="truncate">{lead.aiAnalysis.suggestedCategory}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-500 truncate pl-4">
                                            ROI: {lead.aiAnalysis.roiEstimate}
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-slate-400">Processamento Manual</span>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${matchedUrgency.color}`}>
                                        {matchedUrgency.text}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[lead.status]}`}>
                                        {statusLabels[lead.status]}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-500 text-[10px]">
                                      {new Date(lead.createdAt).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </td>
                                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          onClick={() => setSelectedLead(lead)}
                                          className="p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition shrink-0"
                                          title="Inspecionar Lead por completo"
                                        >
                                          <LucideIcons.Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteLead(lead.id)}
                                          className="p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition shrink-0"
                                          title="Deletar este lead definitivamente"
                                        >
                                          <LucideIcons.Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column / Panel: Side inspector for selected Lead */}
                  <AnimatePresence>
                    {selectedLead && (
                      <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="w-full md:w-[480px] border-l border-slate-200 bg-white h-full flex flex-col shrink-0 relative z-20 shadow-xl overflow-hidden"
                      >
                        {/* Header of Inspector */}
                        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <LucideIcons.FolderHeart className="w-5 h-5 text-blue-600" />
                            <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase">
                              Dossiê Técnico do Lead
                            </h3>
                          </div>
                          <button
                            onClick={() => setSelectedLead(null)}
                            className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer"
                          >
                            <LucideIcons.ChevronRight className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Scroller Content of Inspector */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                          
                          {/* Section: Leads Principal coordinates */}
                          <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                              
                              <div className="space-y-1">
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Lead Principal / Solicitante</span>
                                <div className="text-sm font-black text-slate-900">{selectedLead.name}</div>
                                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                                  <LucideIcons.Mail className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{selectedLead.email}</span>
                                </div>
                                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                                  <LucideIcons.Phone className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{selectedLead.phone}</span>
                                </div>
                              </div>

                              <div className="border-t border-slate-150 pt-3 flex justify-between items-center text-xs">
                                <div>
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Empresa</span>
                                  <span className="font-extrabold text-slate-800">{selectedLead.companyName || "Não Informada"}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Orçamento Declarado</span>
                                  <span className="font-extrabold text-slate-800">{selectedLead.estimatedBudget}</span>
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Section: Status controllers / pipeline */}
                          <div className="space-y-2.5">
                            <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Estágio Comercial do Lead</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {(["under_review", "architecture_design", "proposal_generation", "ready_for_meeting"] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateStatus(selectedLead.id, st)}
                                  disabled={isUpdatingStatus === selectedLead.id}
                                  className={`p-2.5 rounded-xl border text-[10px] font-extrabold uppercase text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 hover:scale-102 ${
                                    selectedLead.status === st
                                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {isUpdatingStatus === selectedLead.id && selectedLead.status === st ? (
                                    <LucideIcons.Loader2 className="w-4 h-4 animate-spin text-white mb-0.5" />
                                  ) : (
                                    <span>{statusLabels[st].split(" ")[0]} {statusLabels[st].split(" ")[1] || ""}</span>
                                  )}
                                  <span className={`text-[8px] font-medium opacity-80 ${selectedLead.status === st ? "text-blue-100" : "text-slate-400"}`}>
                                    {statusLabels[st]}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Section: Original custom client description */}
                          <div className="space-y-2.5">
                            <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Demanda Inicial Descrevida</h4>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 text-xs text-slate-700 italic max-h-56 overflow-y-auto leading-relaxed">
                              &ldquo;{selectedLead.projectDescription}&rdquo;
                            </div>
                          </div>

                          {/* Section: Real Intelligent Gemini generated Blueprint proposal */}
                          {selectedLead.aiAnalysis && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-1.5 border-t border-slate-150 pt-5">
                                <LucideIcons.Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                                <h4 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-widest">
                                  Prposta Proposta por Inteligência Artificial
                                </h4>
                              </div>

                              <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
                                <div>
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-500 block">Sugerido Tipo Sistema</span>
                                  <div className="text-sm font-black text-slate-900">{selectedLead.aiAnalysis.suggestedCategory}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Complexidade</span>
                                    <span className={`font-extrabold inline-block px-1.5 py-0.5 rounded-sm text-[10px] ${
                                      selectedLead.aiAnalysis.complexity === "Alta" || selectedLead.aiAnalysis.complexity === "Altíssima"
                                        ? "bg-rose-50 text-rose-700 font-black"
                                        : "bg-blue-50 text-blue-700"
                                    }`}>
                                      {selectedLead.aiAnalysis.complexity}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Estimativa ROI</span>
                                    <span className="font-extrabold text-slate-800 text-[10px] line-clamp-2 leading-tight">
                                      {selectedLead.aiAnalysis.roiEstimate}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Módulos Recomendados</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {selectedLead.aiAnalysis.modules.map((mod, idx) => (
                                      <span key={idx} className="bg-slate-150 text-slate-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                                        {mod}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Stack Tecnológico Recomandada</span>
                                  <div className="space-y-1">
                                    {selectedLead.aiAnalysis.techStack.map((tech, idx) => (
                                        <div key={idx} className="text-[10px] text-slate-600 flex items-center gap-1.5 font-bold">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                                        <span>{tech}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-1 border-t border-slate-150 pt-3">
                                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Especificação Detalhada</span>
                                  <div className="text-xs text-slate-600 space-y-1">
                                    {renderMarkdown(selectedLead.aiAnalysis.detailedBlueprint)}
                                  </div>
                                </div>

                                {selectedLead.aiAnalysis.chatHistory && selectedLead.aiAnalysis.chatHistory.length > 0 && (
                                  <div className="space-y-2 border-t border-slate-150 pt-3">
                                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Histórico da Conversa no Chat</span>
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 space-y-2 max-h-52 overflow-y-auto font-sans">
                                      {selectedLead.aiAnalysis.chatHistory.map((msg: any, mIdx: number) => (
                                        <div key={msg.id || mIdx} className="text-[11px] leading-relaxed">
                                          <span className={`font-bold ${msg.role === "user" ? "text-blue-700" : "text-emerald-700"}`}>
                                            {msg.role === "user" ? "Cliente" : "J4 AI"}:
                                          </span>{" "}
                                          <span className="text-slate-700 whitespace-pre-wrap">{msg.content}</span>
                                          <span className="text-[9px] text-slate-400 ml-1.5 block sm:inline-block">({msg.timestamp})</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              </div>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              )}

              {/* TAB 2: Sync and Extensibility documentation */}
              {activeTab === "extensibility" && (
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-4xl">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                      <LucideIcons.FolderCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Estrutura Totalmente Pronta e Expansiva
                    </span>
                    <h2 className="font-display font-extrabold text-2xl text-slate-950">
                      Sincronização & Expansibilidade de Recursos
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Este painel administrativo foi projetado no padrão hexagonal de camadas, suportando adição de novos módulos sem impacto na integridade do site principal.
                    </p>
                  </div>

                  {/* Visual Blueprint card flow */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    <div className="bg-white p-5 rounded-2xl border border-slate-250/80 shadow-xs space-y-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <LucideIcons.Globe className="w-5.5 h-5.5" />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Configuração PostgreSQL Definida</h4>
                      <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[10px] space-y-1">
                        <p className="text-slate-400">// Configurações ativas fornecidas pelo Usuário</p>
                        <p><span className="text-blue-400">DB_NAME:</span> spacevip_site</p>
                        <p><span className="text-blue-400">DB_USER:</span> spacevip_react</p>
                        <p><span className="text-blue-400">DB_PASS:</span> Jo159357*</p>
                        <p><span className="text-blue-400">STATUS:</span> Ativo em caso de rede local/remota</p>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        Adicionamos persistência dupla inteligente: se houver conexão PostgreSQL o dado é salvo lá. Do contrário, ele recorre a um banco local failover sem quebrar o site para o cliente.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-250/80 shadow-xs space-y-3.5">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <LucideIcons.Code2 className="w-5.5 h-5.5" />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Próximos Módulos Disponíveis para Integração</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <LucideIcons.MessageSquareQuote className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">Notificador de Whatsapp</span>
                          </div>
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold uppercase px-1.5 py-0.5 rounded-sm">Pendente API</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <LucideIcons.FileSpreadsheet className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">Exportador Inteligente PDF / XLS</span>
                          </div>
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold uppercase px-1.5 py-0.5 rounded-sm">Pendente API</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <LucideIcons.FolderGit2 className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">Agenda Integrada de Clientes</span>
                          </div>
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-extrabold uppercase px-1.5 py-0.5 rounded-sm">Pendente API</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        O backend do sistema Express em `server.ts` já se comunica diretamente com o módulo de dados exportado. Qualquer nova tabela SQL pode ser adicionada ao pool facilmente.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 3: Admin configuration settings */}
              {activeTab === "settings" && (
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-2xl">
                  <div className="space-y-1">
                    <h2 className="font-display font-extrabold text-xl text-slate-950">Configurações Gerais de Operação</h2>
                    <p className="text-slate-500 text-xs leading-normal">
                      Gerencie as credenciais e as chaves de controle do site J4 Sistemas.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <LucideIcons.ShieldAlert className="w-4.5 h-4.5 text-blue-600" />
                      Acesso das Credenciais Administrativas
                    </h4>
                    
                    <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                      <p>
                        Para a segurança operacional dos leads, os acessos são validados por login e senha a partir dos dados do cabeçalho da sua requisição:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-[9px] text-slate-400 font-black block uppercase">Usuário Configurado</span>
                          <span className="font-extrabold text-slate-900">spacevip_react</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-black block uppercase">Senha Configurada</span>
                          <span className="font-extrabold text-slate-900">Jo159357*</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-blue-50 text-blue-800 border border-blue-150 p-3.5 flex items-start gap-2.5 font-medium leading-relaxed">
                        <LucideIcons.Info className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-blue-900">Quer trocar a senha?</span>
                          Para redefinir o usuário ou a senha operacional de segurança, atualize a validação na rota `POST /api/admin/login` em `server.ts` de forma direta e ágil.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <LucideIcons.HardDrive className="w-4.5 h-4.5 text-blue-600" />
                      Status de Conexão Física de Dados
                    </h4>
                    
                    {dbStatus && (
                      <div className="text-xs space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-bold">Mecanismo Conectado:</span>
                          <span className="font-black text-blue-700 uppercase">{dbStatus.engine}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-slate-500 font-bold">Bando de Dados Alvo:</span>
                          <span className="text-slate-900 font-mono font-bold">spacevip_site</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-bold">Usuário DB PostgreSQL:</span>
                          <span className="text-slate-900 font-mono font-bold">spacevip_react</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>
    </div>
  );
}
