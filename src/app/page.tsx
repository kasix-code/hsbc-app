'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert, BookOpen, ArrowRight, CheckCircle,
  AlertTriangle, History, Layers, Settings, HelpCircle,
  FileText, Sun, Moon
} from 'lucide-react';

const MOCK_SOURCES: Record<string, {
  title: string;
  section: string;
  text: string;
  veracity: number;
  date: string;
}> = {
  aml: {
    title: "HSBC Global AML Policy v4.2",
    section: "Section 3.14: Transaction Monitoring",
    text: "All cross-border transfers exceeding €10,000 originating from high-risk jurisdictions require mandatory secondary compliance sign-off within 24 hours. Failure to log details results in automated operational holds.",
    veracity: 98,
    date: "Updated 3 months ago"
  },
  gdpr: {
    title: "EU GDPR Data Privacy Standard",
    section: "Article 6: Lawfulness of Processing",
    text: "Personal data storage of EU citizens within non-EU server clusters is strictly prohibited unless explicit end-user cryptographic anonymization keys are applied locally prior to transit.",
    veracity: 95,
    date: "Updated 1 month ago"
  },
  designer: {
    title: "Kasia_Rytel_CV_Lead_Designer.pdf",
    section: "Warsaw Digital Hub / Enterprise Talent Pool",
    text: "Kasia Rytel - Lead UX/UI Designer with 8+ years of enterprise B2B experience (DPDgroup, Posnet). Core Expertise: Design Systems scale, complex SaaS/IoT logic, and rapid prototyping workflows using Claude Code. Technical alignment: React, Tailwind CSS, WCAG 2.2 accessibility architectures.",
    veracity: 99,
    date: "Verified Candidate Profile"
  }
};

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  tags?: string[];
  sourceTag?: string;
}

interface ComplianceWarning {
  severity: 'high' | 'medium';
  text: string;
}

const SCOPE_TAGS = ['#AML', '#GDPR', '#KYC', '#Basel III'];

type Theme = 'dark' | 'light';

// All theme-aware class sets in one place
function t(theme: Theme, dark: string, light: string) {
  return theme === 'dark' ? dark : light;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [input, setInput] = useState('');
  const [complianceWarning, setComplianceWarning] = useState<ComplianceWarning | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'Welcome to IntellectAI. Select a compliance scope below or ask an internal policy question.',
      tags: ['#GlobalStandard', '#PolandHub']
    }
  ]);
  const [activeSource, setActiveSource] = useState<typeof MOCK_SOURCES[string] | null>(MOCK_SOURCES.aml);
  const [isTyping, setIsTyping] = useState(false);
  const [isSourceLoading, setIsSourceLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lower = input.toLowerCase();
    if (lower.includes('customer data') || lower.includes('credit card')) {
      setComplianceWarning({
        severity: 'high',
        text: 'CRITICAL WARNING: Request violates policy standard SEC-09. Do not feed Personally Identifiable Information (PII) into the LLM infrastructure.'
      });
    } else if (lower.includes('unencrypted')) {
      setComplianceWarning({
        severity: 'medium',
        text: 'Notice: Data transit discussions require secure tunnel definitions (TLS 1.3). Check documentation.'
      });
    } else {
      setComplianceWarning(null);
    }
  }, [input]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || complianceWarning?.severity === 'high') return;

    setIsSourceLoading(true);
    setActiveSource(null);

    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setIsSourceLoading(false);
      let aiText = "The policy query has been evaluated against current Polish and European financial frameworks. General operational guidelines permit standard execution paths.";
      let sourceKey = 'aml';

      if (currentInput.includes('designer') || currentInput.includes('claudecode') || currentInput.includes('kasia') || currentInput.includes('poland') || currentInput.includes('find a lead designer')) {
        aiText = "Found 1 matching candidate in the Warsaw Hub: Kasia Rytel. Over 8 years of enterprise B2B experience, expert in building scalable design systems, and deploying advanced AI workflows using Claude Code.";
        sourceKey = 'designer';
      } else if (currentInput.includes('aml') || currentInput.includes('transfer')) {
        aiText = "Based on HSBC Global AML Policy Section 3.14, any cross-border transaction over €10,000 requires strict secondary authorization. Ensure details are submitted to the regional compliance node within 24 hours.";
        sourceKey = 'aml';
      } else if (currentInput.includes('gdpr') || currentInput.includes('privacy') || currentInput.includes('data')) {
        aiText = "According to regional EU GDPR constraints, customer records processed out of Warsaw data storage loops must maintain complete end-to-end anonymization.";
        sourceKey = 'gdpr';
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        sourceTag: sourceKey
      }]);
      setActiveSource(MOCK_SOURCES[sourceKey]);
    }, 1200);
  };

  // ─── Derived theme classes ────────────────────────────────────────────────
  const bg       = t(theme, 'bg-slate-900',  'bg-white');
  const bgSide   = t(theme, 'bg-slate-950',  'bg-[#F5F7FA]');
  const border   = t(theme, 'border-slate-800', 'border-[#E2E8F0]');
  const textMain = t(theme, 'text-slate-100', 'text-[#1A1A1A]');
  const textMute = t(theme, 'text-slate-400', 'text-[#595959]');
  const textDim  = t(theme, 'text-slate-500', 'text-[#595959]');
  const navHover = t(theme, 'hover:bg-slate-900 hover:text-slate-200', 'hover:bg-slate-200 hover:text-[#1A1A1A]');
  const navActive= t(theme, 'bg-slate-900 text-white', 'bg-white text-[#1A1A1A] shadow-sm');
  const chatBg   = t(theme, 'bg-slate-900', 'bg-white');
  const msgAiBg  = t(theme, 'bg-slate-800/80 border border-slate-700/60 text-slate-200', 'bg-[#F5F7FA] border border-[#E2E8F0] text-[#1A1A1A]');
  const tagBg    = t(theme, 'bg-slate-900 text-slate-400 border-slate-700', 'bg-white text-[#595959] border-[#E2E8F0]');
  const inputBg  = t(theme, 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-red-500/70', 'bg-white border-[#E2E8F0] text-[#1A1A1A] placeholder:text-[#595959] focus:border-[#DB0011]/60');
  const footerBg = t(theme, 'bg-slate-950/40', 'bg-[#F5F7FA]');
  const srcCard  = t(theme, 'border-slate-700/60 bg-slate-800/50', 'border-[#E2E8F0] bg-white');
  const headerBg = t(theme, 'bg-slate-900/50', 'bg-white/80');
  const scopeBtn = t(theme, 'border-slate-700 bg-slate-800 hover:border-red-500/50 hover:text-red-400', 'border-[#E2E8F0] bg-white hover:border-[#DB0011]/50 hover:text-[#DB0011]');
  const nodeText = t(theme, 'text-slate-500', 'text-[#595959]');
  const disabledBtn = t(theme, 'disabled:bg-slate-700 disabled:text-slate-500', 'disabled:bg-slate-200 disabled:text-slate-400');
  const typingBg = t(theme, 'bg-slate-800/80 border-slate-700/60 text-slate-400', 'bg-[#F5F7FA] border-[#E2E8F0] text-[#595959]');
  const dotColor = t(theme, 'bg-slate-400', 'bg-[#595959]');
  const footerNote = t(theme, 'text-slate-600', 'text-[#595959]');
  const toggleBg = t(theme, 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700', 'bg-white border-[#E2E8F0] text-[#595959] hover:bg-slate-100');

  return (
    <div className={`flex h-screen w-screen ${bg} ${textMain} font-sans overflow-hidden transition-colors duration-300`}>

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className={`w-64 ${bgSide} border-r ${border} flex-col justify-between p-4 hidden md:flex transition-colors duration-300`}>
        <div>
          {/* Logo */}
          <div className={`flex items-center gap-2 px-2 py-3 mb-6 border-b ${border}`}>
            <div className="h-6 w-6 bg-red-600 rounded-sm transform rotate-45 flex items-center justify-center">
              <div className="h-2 w-2 bg-white transform -rotate-45" />
            </div>
            <span className="font-bold tracking-wider text-sm">
              HSBC <span className={`${textMute} font-normal`}>IntellectAI</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md ${navActive} text-sm font-medium transition-colors`}>
              <Layers size={18} className="text-red-600" /> AI Workspace
            </button>
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md ${textMute} ${navHover} text-sm font-medium transition-colors`}>
              <History size={18} /> Query Log
            </button>
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md ${textMute} ${navHover} text-sm font-medium transition-colors`}>
              <ShieldAlert size={18} /> Guardrail Rules
            </button>
          </nav>
        </div>

        {/* Bottom controls */}
        <div className={`space-y-1 border-t ${border} pt-4`}>
          <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${textMute} ${navHover} text-sm transition-colors`}>
            <Settings size={16} /> Config
          </button>
          <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${textMute} ${navHover} text-sm transition-colors`}>
            <HelpCircle size={16} /> Docs &amp; Help
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md ${toggleBg} border text-sm font-medium transition-colors duration-200`}
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <><Sun size={16} className="text-amber-400" /> Light Mode</>
              : <><Moon size={16} className="text-slate-500" /> Dark Mode</>
            }
          </button>

          <div className={`px-3 py-2 text-xs ${nodeText}`}>Node: PL-KRAKOW-PROD</div>
        </div>
      </aside>

      {/* ── CENTRAL CHAT ─────────────────────────────────────────────────── */}
      <main className={`flex-1 flex flex-col min-w-0 ${chatBg} transition-colors duration-300`}>
        <header className={`h-14 border-b ${border} flex items-center px-6 gap-3 ${headerBg} backdrop-blur-sm transition-colors duration-300`}>
          <h2 className="text-sm font-semibold tracking-wide">AIMS CENTRAL INTELLIGENCE</h2>
          <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Security Shield Active
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl rounded-lg px-4 py-3 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-[#DB0011] text-white font-medium rounded-tr-none'
                  : `${msgAiBg} rounded-tl-none`
              } transition-colors duration-300`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                {msg.tags && (
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {msg.tags.map(tag => (
                      <span key={tag} className={`text-xs px-1.5 py-0.5 rounded border ${tagBg}`}>{tag}</span>
                    ))}
                  </div>
                )}
                {msg.sourceTag && (
                  <button
                    onClick={() => setActiveSource(MOCK_SOURCES[msg.sourceTag!])}
                    className="mt-3 flex items-center gap-1.5 text-xs text-[#DB0011] font-semibold hover:opacity-75 transition-opacity"
                  >
                    <BookOpen size={12} /> Inspect Verified Regulatory Source
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className={`${typingBg} border rounded-lg rounded-tl-none px-4 py-3 text-sm flex items-center gap-2 transition-colors duration-300`}>
                <span className="flex gap-1">
                  <span className={`h-1.5 w-1.5 ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                  <span className={`h-1.5 w-1.5 ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                  <span className={`h-1.5 w-1.5 ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
                </span>
                Evaluating banking compliance framework...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className={`p-4 border-t ${border} ${footerBg} transition-colors duration-300`}>
          <form onSubmit={handleSend} className="max-w-4xl mx-auto space-y-3">

            {/* Scope quick-select */}
            <div className={`flex flex-wrap gap-1.5 items-center text-xs ${textDim}`}>
              <span>Scope:</span>
              {SCOPE_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setInput(prev => prev ? `${prev} ${tag}` : tag)}
                  className={`px-2 py-0.5 rounded border ${scopeBtn} transition-colors`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Compliance warning */}
            {complianceWarning && (
              <div className={`flex items-start gap-2 px-3 py-2 rounded-md text-xs border ${
                complianceWarning.severity === 'high'
                  ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-950/60 dark:border-red-700/60 dark:text-red-300'
                  : 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-700/60 dark:text-amber-300'
              }`}>
                {complianceWarning.severity === 'high'
                  ? <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                  : <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                }
                {complianceWarning.text}
              </div>
            )}

            {/* Text input + send */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Query internal banking policy or compliance framework..."
                className={`flex-1 border rounded-md px-4 py-2.5 text-sm focus:outline-none transition-colors ${inputBg}`}
              />
              <button
                type="submit"
                disabled={!input.trim() || complianceWarning?.severity === 'high'}
                className={`px-4 py-2.5 bg-[#DB0011] hover:bg-[#b8000e] text-white rounded-md text-sm font-semibold flex items-center transition-colors ${disabledBtn}`}
              >
                <ArrowRight size={16} />
              </button>
            </div>

            <p className={`text-xs ${footerNote} text-center`}>
              IntellectAI responses are AI-generated. Always verify against official HSBC policy documents before operational use.
            </p>
          </form>
        </div>
      </main>

      {/* ── RIGHT PANEL — SOURCE INSPECTOR ───────────────────────────────── */}
      <aside className={`w-80 ${bgSide} border-l ${border} flex-col hidden lg:flex transition-colors duration-300`}>
        <div className={`h-14 border-b ${border} flex items-center px-4 gap-2`}>
          <FileText size={16} className="text-[#DB0011]" />
          <span className="text-sm font-semibold tracking-wide">Source Inspector</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isSourceLoading ? (
            /* ── SKELETON LOADER ── */
            <div className="space-y-4">
              {/* Spinner + label */}
              <div className="flex flex-col items-center gap-3 py-4">
                <svg
                  className="animate-spin h-7 w-7 text-[#DB0011]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <p className="text-xs font-medium text-center text-red-500">
                  Indexing candidate repository…
                </p>
              </div>

              {/* Skeleton source card */}
              <div className={`rounded-md border ${srcCard} p-4 space-y-3 animate-pulse`}>
                <div className="flex items-start justify-between gap-2">
                  <div className={`h-3 w-3/4 rounded ${t(theme, 'bg-slate-700', 'bg-slate-200')}`} />
                  <div className={`h-3 w-8 rounded ${t(theme, 'bg-slate-700', 'bg-slate-200')}`} />
                </div>
                <div className={`h-2.5 w-1/2 rounded ${t(theme, 'bg-slate-700', 'bg-slate-200')}`} />
                <div className="space-y-1.5">
                  <div className={`h-2 w-full rounded ${t(theme, 'bg-slate-800', 'bg-slate-100')}`} />
                  <div className={`h-2 w-full rounded ${t(theme, 'bg-slate-800', 'bg-slate-100')}`} />
                  <div className={`h-2 w-5/6 rounded ${t(theme, 'bg-slate-800', 'bg-slate-100')}`} />
                  <div className={`h-2 w-4/6 rounded ${t(theme, 'bg-slate-800', 'bg-slate-100')}`} />
                </div>
                <div className={`h-2 w-1/3 rounded ${t(theme, 'bg-slate-700', 'bg-slate-200')}`} />
              </div>

              {/* Skeleton guardrails card */}
              <div className={`rounded-md border ${srcCard} p-4 space-y-3 animate-pulse`}>
                <div className={`h-3 w-2/5 rounded ${t(theme, 'bg-slate-700', 'bg-slate-200')}`} />
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between">
                    <div className={`h-2.5 w-1/3 rounded ${t(theme, 'bg-slate-800', 'bg-slate-100')}`} />
                    <div className={`h-2.5 w-8 rounded ${t(theme, 'bg-slate-800', 'bg-slate-100')}`} />
                  </div>
                ))}
              </div>
            </div>
          ) : activeSource ? (
            /* ── LOADED CONTENT ── */
            <>
              <div className={`rounded-md border ${srcCard} p-4 space-y-3 transition-colors duration-300`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold leading-snug">{activeSource.title}</h3>
                  <span className="shrink-0 text-xs bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle size={10} /> {activeSource.veracity}%
                  </span>
                </div>
                <p className="text-xs text-[#DB0011] font-medium">{activeSource.section}</p>
                <p className={`text-xs ${textMute} leading-relaxed`}>{activeSource.text}</p>
                <p className={`text-xs ${nodeText}`}>{activeSource.date}</p>
                {activeSource.title.includes('CV') && (
                  <a
                    href="https://myportfolio.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center justify-center gap-2 w-full px-3 py-2 bg-[#DB0011] hover:bg-[#b8000e] text-white text-xs font-semibold rounded-md transition-colors"
                  >
                    <FileText size={13} />
                    Open Original PDF Document
                  </a>
                )}
              </div>

              <div className={`rounded-md border ${srcCard} p-4 space-y-2 transition-colors duration-300`}>
                <h3 className="text-xs font-bold flex items-center gap-1.5">
                  <ShieldAlert size={13} className="text-[#DB0011]" /> Active Guardrails
                </h3>
                {[
                  { label: 'PII Detection',      active: true  },
                  { label: 'Jurisdiction Filter', active: true  },
                  { label: 'Data Residency',      active: true  },
                  { label: 'Output Redaction',    active: false },
                ].map(({ label, active }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className={textMute}>{label}</span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : t(theme, 'bg-slate-700 text-slate-500', 'bg-slate-200 text-slate-500')
                    }`}>
                      {active ? 'ON' : 'OFF'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* ── EMPTY STATE (przed pierwszym zapytaniem po resecie) ── */
            <div className={`flex flex-col items-center justify-center h-40 gap-2 ${textMute} text-xs text-center`}>
              <FileText size={28} className="opacity-30" />
              <p>Wyślij zapytanie, aby załadować źródło regulacyjne.</p>
            </div>
          )}
        </div>

        <div className={`p-4 border-t ${border} text-xs ${nodeText} text-center`}>
          AIMS v2.4.1 · EU Compliant Node
        </div>
      </aside>
    </div>
  );
}
