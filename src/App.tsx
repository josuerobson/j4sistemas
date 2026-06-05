import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import {
  SERVICES,
  TESTIMONIALS,
  PROCESS_STEPS,
  FAQS,
  OFFICE_STATS
} from "./data";
import { AIAssistant } from "./components/AIAssistant";
import { DashboardMockup } from "./components/DashboardMockup";
import { ContactForm } from "./components/ContactForm";
import { AdminPanel } from "./components/AdminPanel";

// Helper component to dynamically render Lucide icons with solid safety fallback
function RenderIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    return <LucideIcons.HelpCircle className={className} />;
  }
  return <IconComponent className={className} />;
}

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>("erps-crms");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="j4sistemas-app" className="bg-slate-50 text-slate-800 min-h-screen font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP NAV BAR (Sticky, glassmorphic white-blue feel) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Futuristic scalable J4 Sistemas Logo in SVG */}
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-all duration-300">
              <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="font-display font-extrabold text-lg sm:text-xl text-blue-950 uppercase tracking-tight">
                J4<span className="text-blue-600 font-medium text-xs tracking-widest block font-sans -mt-1 uppercase">SISTEMAS</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-7">
            <button onClick={() => handleScrollTo("solucoes")} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all cursor-pointer">
              Soluções
            </button>
            <button onClick={() => handleScrollTo("ia-consultor")} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all cursor-pointer">
              IA Diagnóstico
            </button>
            <button onClick={() => handleScrollTo("como-funciona")} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all cursor-pointer">
              Metodologia
            </button>
            <button onClick={() => handleScrollTo("depoimentos")} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all cursor-pointer">
              Casos Reais
            </button>
            <button onClick={() => handleScrollTo("faq-accordion")} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all cursor-pointer">
              Faq
            </button>
          </nav>

          {/* Direct CTA action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 hover:text-blue-600 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs text-xs sm:text-sm font-semibold"
              title="Painel Administrativo de Leads"
            >
              <LucideIcons.Lock className="w-4 h-4 text-blue-600" />
              <span>Acesso Admin</span>
            </button>

            <button
              onClick={() => handleScrollTo("contato-modulo")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4.5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-600/15 group flex items-center gap-1.5 cursor-pointer max-w-xs capitalize hover:scale-105 active:scale-95"
            >
              <span>Gerar Blueprint</span>
              <LucideIcons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO FOLD SECTION */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        
        {/* Soft background decor grids */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-200 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Value Proposition text (Left column) */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase tracking-wider">
                <LucideIcons.Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Livre de Custos por Usuário
              </span>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-[1.1] tracking-tight">
                Sistemas Únicos.<br />
                Para Empresas <span className="text-blue-600">Extraordinárias</span>
              </h1>
              
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
                Pare de adaptar sua lucrativa metodologia comercial a softwares engessados. Desenvolvemos ERPs, CRMs e automações personalizadas de alta performance com código 100% livre de mensalidade individual.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => handleScrollTo("contato-modulo")}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-7 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 text-center transition-all cursor-pointer hover:scale-[1.03]"
                >
                  Criar Projeto de Software
                </button>
                <button
                  onClick={() => handleScrollTo("ia-consultor")}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-3.5 px-7 rounded-xl font-bold text-sm text-center shadow-xs transition-all cursor-pointer hover:scale-[1.03] flex items-center justify-center gap-1.5"
                >
                  <LucideIcons.Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  Testar Diagnóstico de IA
                </button>
              </div>

              {/* Minimalist social proof metrics */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-950 font-display">140+</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Softwares Ativos</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-950 font-display">99.4%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Satisfação Geral</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-600 font-display">Zero</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Taxa por usuário</div>
                </div>
              </div>
            </div>

            {/* Interactive Systems Mockup Visual showcase (Right column) */}
            <div className="lg:col-span-7">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* 3. COHESIVE SYSTEM STATS BANNER */}
      <section className="bg-gradient-to-r from-blue-950 to-blue-900 text-white py-8 border-y border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {OFFICE_STATS.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs text-blue-200 uppercase font-bold tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICES EXPLORER MODULE (Core request) */}
      <section id="solucoes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Soluções Personalizadas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              Sistemas Especializados de Alta Performance
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Mapeamos os processos burocráticos de faturamento, controle operacional e vendas da sua empresa e traduzimos em código limpo, estável e autoescalável.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Service Grid Selectors list (Left Column - Column Span 5) */}
            <div className="lg:col-span-5 space-y-3.5">
              {SERVICES.map((serv) => (
                <button
                  key={serv.id}
                  onClick={() => setExpandedService(serv.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex gap-4 cursor-pointer relative overflow-hidden group ${
                    expandedService === serv.id
                      ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/10 scale-[1.01]"
                      : "bg-slate-50 border-slate-200/60 hover:bg-white hover:border-blue-200 text-slate-800"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    expandedService === serv.id ? "bg-white/10 text-cyan-300" : "bg-blue-50 text-blue-600"
                  }`}>
                    <RenderIcon name={serv.icon} className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm sm:text-base ${expandedService === serv.id ? 'text-white' : 'text-blue-950'}`}>
                      {serv.title}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${expandedService === serv.id ? 'text-blue-100' : 'text-slate-500'}`}>
                      {serv.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Interactive Dynamic Expanded Service display values (Right Column - Column Span 7) */}
            <div className="lg:col-span-7 bg-slate-50 rounded-3xl border border-slate-200/60 p-6 sm:p-9 relative min-h-[440px]">
              <AnimatePresence mode="wait">
                {SERVICES.map((s) => s.id === expandedService && (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-600/10">
                        <RenderIcon name={s.icon} className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-blue-950 tracking-tight">{s.title}</h3>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-sans">{s.longDescription}</p>

                    {/* Features block */}
                    <div className="space-y-3.5 pt-4">
                      <h4 className="text-xs uppercase font-extrabold text-blue-950 tracking-widest block font-sans">
                        O que entregamos de fábrica:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {s.features.map((feat, i) => (
                          <div key={i} className="flex gap-2.5 items-start">
                            <LucideIcons.CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-700 font-medium leading-tight">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Value Statement alert */}
                    <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4.5 mt-6">
                      <h4 className="text-xs font-bold text-blue-900 border-b border-blue-100 pb-2 mb-2 flex items-center gap-1.5">
                        <LucideIcons.Award className="w-4 h-4 text-blue-600" />
                        Ganho Estratégico com a J4 Sistemas:
                      </h4>
                      <ul className="space-y-2">
                        {s.benefits.map((ben, i) => (
                          <li key={i} className="text-xs text-slate-600 font-medium leading-relaxed flex items-start gap-1.5">
                            <span className="text-blue-500 font-bold shrink-0">•</span> {ben}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE GEMINI CONSULTATION TOOL (Objections buster) */}
      <section id="ia-consultor" className="py-20 bg-slate-50 border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* AI Explanatory copy block (Column span 5) */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-extrabold uppercase tracking-wide rounded-full border border-cyan-200">
                <LucideIcons.Cpu className="w-3.5 h-3.5" />
                Inovação Comercial
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
                Simule sua Ideia de Software Agora
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
                Fale livremente com o nosso assistente inteligente baseado em inteligência artificial líder. Ele foi treinado com nossas metodologias de escopo técnico para diagnosticar sua operação e formular sugestões de software em tempo real!
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start bg-white p-4.5 rounded-2xl shadow-xs border border-blue-50">
                  <div className="p-2 bg-blue-100 text-blue-800 rounded-xl shrink-0">
                    <LucideIcons.MessageSquare className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-blue-950">Consulta Segura 100% Online</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-normal">Seu descritivo é analisado individualmente para estimar impacto de custos.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Chat view (Column span 7) */}
            <div className="lg:col-span-7">
              <AIAssistant />
            </div>
          </div>
        </div>
      </section>

      {/* 6. SYSTEM ENGINEERING TIMELINE METHODOLOGY */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Método J4 Sistemas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              Processo Organizado de Ponta a Ponta
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Damos previsibilidade total ao seu projeto de software. Nada de escopos ocultos ou surpresas no meio do caminho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {PROCESS_STEPS.map((proc, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 relative hover:shadow-lg transition-transform hover:-translate-y-1 group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center font-display">
                      {proc.step}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">{proc.duration}</span>
                  </div>

                  <h3 className="font-bold text-blue-950 text-base mb-2 font-display">{proc.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{proc.description}</p>
                </div>

                <div className="border-t border-slate-200/60 pt-3.5 space-y-2">
                  {proc.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex gap-2 items-start text-[11px] text-slate-600 font-medium leading-tight">
                      <span className="text-blue-500 font-bold shrink-0">›</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 bg-blue-50/50 rounded-2xl border border-blue-100 p-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="flex gap-3 items-center text-left">
              <div className="p-3 bg-white text-blue-600 rounded-xl shrink-0 hidden sm:block border border-blue-100">
                <LucideIcons.Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-950 text-sm">Quer agilizar o prazo de entrega?</h4>
                <p className="text-xs text-slate-500 leading-normal">Módulos com escopos bem delimitados podem ir ao ar em até 30 dias corridos.</p>
              </div>
            </div>
            <button
              onClick={() => handleScrollTo("contato-modulo")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-lg shadow-sm shrink-0 uppercase tracking-wider cursor-pointer"
            >
              Consultar Desenhos Teclados
            </button>
          </div>
        </div>
      </section>

      {/* 7. REAL CLIENT TESTIMONIALS (Conversion trust) */}
      <section id="depoimentos" className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Depoimentos De Clientes
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              A Opinião de Quem Cresce Conosco
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Veja depoimentos reais consolidados e métricas comprovadas de empresas de logística, finanças e serviços.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test) => (
              <div key={test.id} className="bg-white rounded-3xl p-6.5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative">
                
                {/* Visual quote icon decor */}
                <div className="absolute top-5 right-6 text-slate-100 font-extrabold italic font-display text-5xl leading-none select-none select-none">
                  “
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Performance metric highlight */}
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-extrabold font-mono">{test.metrics.value}</span>
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">{test.metrics.label}</span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 italic">
                    "{test.content}"
                  </p>
                </div>

                {/* Client biological profile card */}
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center border border-blue-200">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-blue-950 leading-tight">{test.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{test.role} • <strong>{test.company}</strong></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE DYNAMIC PROPOSAL CALCULATOR FORM */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Orçamento & Requisitos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              Desenhe sua Solução Sob Medida
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Preencha os dados do seu sistema. Nossa inteligência artificial avaliará a melhor infraestrutura tecnológica e sugerirá módulos imediatamente na tela!
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* 9. NATIVE FAQ OBJECTIONS BUSTER */}
      <section id="faq-accordion" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-14">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Dúvidas Frequentes FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
              Perguntas e Respostas sobre Sistemas Customizados
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-xs transition-all">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-sm sm:text-base text-blue-950 hover:text-blue-600 cursor-pointer transition-colors font-sans"
                >
                  <span className="pr-4">{faq.question}</span>
                  <span className="shrink-0 p-1 bg-slate-100 rounded-lg">
                    {activeFaq === idx ? (
                      <LucideIcons.ChevronUp className="w-4.5 h-4.5 text-blue-600" />
                    ) : (
                      <LucideIcons.ChevronDown className="w-4.5 h-4.5 text-slate-500" />
                    )}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed font-sans bg-slate-50/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. ELITE CORPORATE FOOTER (Matching shades of blue) */}
      <footer className="bg-gradient-to-br from-blue-950 to-slate-950 text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-blue-900/40">
            
            {/* Column 1 - Brand Info */}
            <div className="md:col-span-5 space-y-5">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                <span className="font-display font-extrabold text-lg uppercase tracking-tight text-white">
                  J4 Sistemas - Sistemas Personalizados
                </span>
              </div>
              <p className="text-xs text-blue-200/80 leading-relaxed max-w-sm">
                Especialistas em desenvolvimento ágil de sistemas legados, ERPs corporativos sob medida, CRMs inteligentes e conexões robustas de APIs. Elevamos sua produtividade eliminando aluguéis mensais por usuário.
              </p>
              <div className="flex gap-3 text-xs text-blue-300 font-semibold pt-1">
                <span className="flex items-center gap-1"><LucideIcons.ShieldCheck className="w-4 h-4 text-cyan-400" /> Criptografia SSL</span>
                <span className="flex items-center gap-1"><LucideIcons.Award className="w-4 h-4 text-cyan-400" /> Código 100% Proprietário</span>
              </div>
            </div>

            {/* Column 2 - Contacts */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Contato & Atendimento</h4>
              <ul className="text-xs text-blue-200/80 space-y-3 font-medium">
                <li className="flex items-center gap-2">
                  <LucideIcons.Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>contato@j4sistemas.com.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <LucideIcons.Building className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Atendimento corporativo para todo o Brasil.</span>
                </li>
              </ul>
            </div>

            {/* Column 3 - Fast navigation links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Atalhos</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-blue-200/80">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left hover:text-white transition">Início</button>
                <button onClick={() => handleScrollTo("solucoes")} className="text-left hover:text-white transition">Soluções</button>
                <button onClick={() => handleScrollTo("ia-consultor")} className="text-left hover:text-white transition">Conselhos IA</button>
                <button onClick={() => handleScrollTo("como-funciona")} className="text-left hover:text-white transition">Processo</button>
                <button onClick={() => handleScrollTo("depoimentos")} className="text-left hover:text-white transition">Depoimentos</button>
                <button onClick={() => handleScrollTo("contato-modulo")} className="text-left hover:text-white transition">Diagnóstico</button>
                <button onClick={() => setIsAdminOpen(true)} className="text-left text-cyan-400 hover:text-white transition font-bold">Painel Admin ↗</button>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-blue-300 gap-4">
            <p className="font-medium">
              &copy; {new Date().getFullYear()} J4 Sistemas Ltda. CNPJ sob consulta. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 font-semibold">
              <span className="text-cyan-400">Desenvolvido em alta performance</span>
              <span>•</span>
              <span>Proteção LGPD ativa</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Modern Administrative Modal Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel onClose={() => setIsAdminOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
