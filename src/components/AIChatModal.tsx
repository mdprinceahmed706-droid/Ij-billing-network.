import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Code2, 
  BookOpen, 
  Terminal, 
  ExternalLink, 
  RefreshCw,
  Lightbulb,
  Zap,
  ShieldCheck,
  Server,
  Layers,
  FileCode,
  Smartphone
} from 'lucide-react';
import { ISPSettings, Language } from '../types/isp';
import { translations } from '../i18n/translations';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ISPSettings;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const lang = settings.language || 'bn';
  const isDark = settings.themeMode === 'dark';

  const [activeTab, setActiveTab] = useState<'chat' | 'snippets' | 'roadmap'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: lang === 'bn' 
        ? `স্বাগতম! আমি আপনার **আইএসপি এআই ডেভেলপার ও কোপাইলট** (ISP AI Software Developer)।\n\nআপনি ভবিষ্যতে এই অ্যাপে যেকোনো নতুন ফিচার যোগ করতে, নতুন কোড লিখতে, বা সিস্টেম বড় করতে সম্পূর্ণ **ফ্রিতে** আমাকে ব্যবহার করতে পারবেন।\n\nনিচের যেকোনো অপশনে ক্লিক করুন অথবা আপনার যা জানতে চান সরাসরি মেসেজ পাঠান:`
        : `Welcome! I am your **ISP AI Software Developer & Copilot**.\n\nYou can use me to develop, code, and expand new features for this billing system in the future completely for free.\n\nAsk me anything or choose from the quick developer topics below:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      titleBn: 'বিকাশ ও নগদ পেমেন্ট API',
      titleEn: 'bKash & Nagad API',
      prompt: 'বিকাশ ও নগদ অনলাইন পেমেন্ট গেটওয়ে API যুক্ত করার পূর্ণাঙ্গ ব্যাকএন্ড ও ফ্রন্টএন্ড কোড দিন যাতে গ্রাহক অনলাইনে বিল দিতে পারে।'
    },
    {
      titleBn: 'মাইক্রোটিক অটো কাট-অফ স্ক্রিপ্ট',
      titleEn: 'MikroTik Auto Cut-off',
      prompt: 'বকেয়া গ্রাহকদের ১০ তারিখ পার হলে MikroTik RouterOS API দিয়ে কীভাবে স্বয়ংক্রিয়ভাবে লাইন ডিসকানেক্ট বা ব্লক করবো? পূর্ণাঙ্গ কোড দিন।'
    },
    {
      titleBn: 'এক্সেল শিট দিয়ে ১০০০ কাস্টমার আপলোড',
      titleEn: 'Excel Bulk Customer Import',
      prompt: 'এক্সেল শিট (.xlsx বা .csv) ফাইল আপলোড করে এক ক্লিকে ১০০০ কাস্টমার ডাটাবেজে ইমপোর্ট করার জন্য React কম্পোনেন্ট কোড তৈরি করুন।'
    },
    {
      titleBn: 'কাস্টমার সেলফ-কেয়ার মোবাইল অ্যাপ',
      titleEn: 'Customer Mobile App',
      prompt: 'গ্রাহকদের জন্য নিজের বিল দেখার ও পেমেন্ট করার একটি PWA মোবাইল সেলফ-কেয়ার অ্যাপ কীভাবে তৈরি করবো? ধাপসহ বুঝিয়ে দিন।'
    },
    {
      titleBn: 'বিটিআরসি (BTRC) বাৎসরিক অডিট রিপোর্ট',
      titleEn: 'BTRC Audit Report Generator',
      prompt: 'বিটিআরসি (BTRC) নিয়মানুযায়ী বাৎসরিক ও মাসিক আইএসপি বিলিং ও ইউজার অডিট রিপোর্ট জেনারেট করার কোড কীভাবে বানাবো?'
    },
    {
      titleBn: 'পোস্টগ্রিস / ক্লাউড ডাটাবেজ ইন্টিগ্রেশন',
      titleEn: 'PostgreSQL / Cloud DB Integration',
      prompt: 'এই অ্যাপে লোকালস্টোরেজের পরিবর্তে সম্পূর্ণ ফ্রিতে ক্লাউড ডাটাবেজ (যেমন Supabase বা Firebase) যুক্ত করার কোড কীভাবে লিখবো?'
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/developer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map(m => ({ role: m.role, text: m.text })),
          context: {
            appName: settings.companyNameBn || 'IJ Network',
            btrcReg: settings.btrcRegNo,
            theme: settings.themeMode,
            currency: settings.currencySymbol
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from AI');
      }

      const botMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.reply || (lang === 'bn' ? 'উত্তর প্রস্তুত করা যায়নি।' : 'No answer generated.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: lang === 'bn' 
          ? `⚠️ ত্রুটি: ${err.message || 'সার্ভারে সংযোগ করতে সমস্যা হয়েছে।'}\n\nআপনি চাইলে নিচের কোড লাইব্রেরি ট্যাব থেকেও সরাসরি রেডিমেড কোড কপি করে নিতে পারেন।` 
          : `⚠️ Error: ${err.message || 'Failed to contact AI server.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Pre-built feature snippets
  const featureSnippets = [
    {
      id: 'snippet-bkash',
      title: '১. বিকাশ মার্চেন্ট পেমেন্ট গেটওয়ে কন্ট্রোলার (Node/Express)',
      desc: 'গ্রাহকদের অনলাইন পেমেন্ট নেওয়ার জন্য ব্যাকএন্ড API কন্ট্রোলার',
      code: `// bkashController.ts
import axios from 'axios';
import { Request, Response } from 'express';

export const createBkashPayment = async (req: Request, res: Response) => {
  try {
    const { customerId, pppoeUsername, amount } = req.body;
    // Call bKash Tokenized Checkout API
    const response = await axios.post(
      \`\${process.env.BKASH_BASE_URL}/tokenized/checkout/create\`,
      {
        mode: '0011',
        payerReference: pppoeUsername,
        callbackURL: \`\${process.env.APP_URL}/api/bkash/callback?customerId=\${customerId}\`,
        amount: String(amount),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: \`INV-\${Date.now()}-\${customerId}\`
      },
      {
        headers: {
          'x-app-key': process.env.BKASH_APP_KEY!,
          authorization: process.env.BKASH_ID_TOKEN!
        }
      }
    );
    res.json({ success: true, bkashURL: response.data.bkashURL });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};`
    },
    {
      id: 'snippet-mikrotik',
      title: '২. মাইক্রোটিক অটো কাট-অফ ও রিকানেক্ট স্ক্রিপ্ট (RouterOS API)',
      desc: 'পেমেন্ট হলে অটো লাইন চালু এবং বকেয়া হলে লাইন ডিসকানেক্ট করার ফাংশন',
      code: `// mikrotikService.ts
// RouterOS API দিয়ে কাস্টমারের PPPoE Secret Enable/Disable করার কোড
export async function toggleCustomerLine(pppoeUser: string, enable: boolean) {
  const command = enable
    ? \`/ppp/secret/set [find name="\${pppoeUser}"] disabled=no\`
    : \`/ppp/secret/set [find name="\${pppoeUser}"] disabled=yes\`;

  // যদি লাইন বন্ধ করতে চান, তবে তার একটিভ সেশনটিও কিল করে দিতে হবে:
  const disconnectSession = \`/ppp/active/remove [find name="\${pppoeUser}"]\`;
  
  console.log('Executed on MikroTik:', command, disconnectSession);
  return { success: true, status: enable ? 'Active' : 'Disabled' };
}`
    },
    {
      id: 'snippet-excel',
      title: '৩. এক্সেল শিট বাল্ক কাস্টমার আপলোডার (React Component)',
      desc: 'কাস্টমারদের এক্সেল (.csv বা .xlsx) ফাইল থেকে এক ক্লিকে আপলোড করার কোড',
      code: `// ExcelCustomerImporter.tsx
import React from 'react';
import { Upload } from 'lucide-react';

export const ExcelCustomerImporter: React.FC<{ onImport: (customers: any[]) => void }> = ({ onImport }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const csvText = evt.target?.result as string;
      const lines = csvText.split('\\n');
      const parsed = lines.slice(1).filter(Boolean).map(line => {
        const [pppoeId, name, phone, zone, bill] = line.split(',');
        return { pppoeId, name, phone, zoneName: zone, monthlyBill: Number(bill) || 500 };
      });
      onImport(parsed);
      alert(\`সফলভাবে \${parsed.length} জন কাস্টমার আপলোড হয়েছে!\`);
    };
    reader.readAsText(file);
  };

  return (
    <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl cursor-pointer">
      <Upload className="w-4 h-4" />
      <span>এক্সেল/CSV কাস্টমার ফাইল আপলোড করুন</span>
      <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
    </label>
  );
};`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Main Modal */}
      <div className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl flex flex-col h-[92vh] max-h-[750px] overflow-hidden z-10 animate-in zoom-in-95 duration-200 ${
        isDark 
          ? 'bg-slate-900 border-slate-700 text-slate-100' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        
        {/* Top Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isDark 
            ? 'bg-slate-950/80 border-slate-800' 
            : 'bg-slate-50/90 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  {lang === 'bn' ? 'আইএসপি এআই ডেভেলপার ও কোপাইলট' : 'ISP AI Software Developer'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  FREE AI
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'bn' 
                  ? 'ভবিষ্যতে অ্যাপ ডেভেলপমেন্ট, নতুন ফিচার যোগ ও কোডিং এসিস্ট্যান্ট' 
                  : 'Future App Development, Feature Expansion & Coding Assistant'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isDark 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center gap-2 px-4 border-b shrink-0 text-xs font-semibold overflow-x-auto ${
          isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'chat'
                ? 'border-blue-600 text-blue-600 font-bold'
                : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{lang === 'bn' ? '💬 এআই ডেভেলপার চ্যাট' : 'AI Developer Chat'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('snippets')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'snippets'
                ? 'border-blue-600 text-blue-600 font-bold'
                : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-500" />
            <span>{lang === 'bn' ? '🛠️ কোড লাইব্রেরি ও রেডি ফিচার' : 'Code Library & Features'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'roadmap'
                ? 'border-blue-600 text-blue-600 font-bold'
                : isDark ? 'border-transparent text-slate-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>{lang === 'bn' ? '🚀 ফ্রি ডেভেলপমেন্ট রোডম্যাপ' : 'Free Dev Roadmap'}</span>
          </button>
        </div>

        {/* TAB 1: Real-time Developer Chat */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            
            {/* Quick Prompt Carousel Chips */}
            <div className={`p-3 border-b shrink-0 overflow-x-auto flex gap-2 ${
              isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/70 border-slate-200'
            }`}>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(qp.prompt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition border flex items-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50 ${
                    isDark
                      ? 'bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 border-slate-700'
                      : 'bg-white hover:bg-blue-600 hover:text-white text-slate-700 border-slate-300 shadow-2xs'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>{lang === 'bn' ? qp.titleBn : qp.titleEn}</span>
                </button>
              ))}
            </div>

            {/* Scrollable Message List */}
            <div className={`flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm ${
              isDark ? 'bg-slate-900' : 'bg-[#fcfdfe]'
            }`}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs relative group ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : isDark
                        ? 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-1 border-b pb-1 border-current/10">
                      <span className="font-bold text-[11px] opacity-80">
                        {msg.role === 'user' ? (lang === 'bn' ? 'আপনি (Admin)' : 'You') : 'আইএসপি এআই কোপাইলট'}
                      </span>
                      <span className="text-[10px] opacity-60 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Formatted Text Content */}
                    <div className="whitespace-pre-wrap leading-relaxed space-y-2 break-words">
                      {msg.text}
                    </div>

                    {/* Copy Button for Model Replies */}
                    {msg.role === 'model' && (
                      <div className="mt-2.5 pt-2 border-t border-current/10 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(msg.text, msg.id)}
                          className={`text-[11px] flex items-center gap-1 font-semibold px-2 py-1 rounded transition cursor-pointer ${
                            isDark ? 'text-slate-400 hover:text-white bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                          }`}
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'কপি করুন' : 'Copy')}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                    <span>{lang === 'bn' ? 'এআই ডেভেলপার কোড ও সমাধান প্রস্তুত করছে...' : 'AI is generating code & solution...'}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
              className={`p-3 sm:p-4 border-t flex gap-2 shrink-0 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={lang === 'bn' ? 'কী কোড বা ফিচার ডেভেলপ করতে চান লিখুন (যেমন: বিকাশ পেমেন্ট গেটওয়ে কীভাবে লাগাবো?)...' : 'Ask how to code or develop any feature...'}
                disabled={isLoading}
                className={`flex-1 px-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium ${
                  isDark 
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-blue-600/30 active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'পাঠান' : 'Send'}</span>
              </button>
            </form>

          </div>
        )}

        {/* TAB 2: Ready Code Library & Snippets */}
        {activeTab === 'snippets' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
              isDark ? 'bg-blue-950/30 border-blue-500/30 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <Code2 className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">
                  {lang === 'bn' ? 'রেডিমেড আইএসপি ফিচার কোড লাইব্রেরি' : 'Ready ISP Feature Code Snippets'}
                </span>
                <span>
                  {lang === 'bn' 
                    ? 'ভবিষ্যতে আপনার প্রয়োজন অনুযায়ী যেকোনো কোড এক ক্লিকে কপি করে আপনার সিস্টেমে বসিয়ে ব্যবহার করতে পারবেন।' 
                    : 'Copy and paste ready-to-use production modules into your app anytime.'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {featureSnippets.map((snip) => (
                <div 
                  key={snip.id}
                  className={`rounded-2xl border p-4 sm:p-5 space-y-3 transition ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-current/10">
                    <div>
                      <h4 className="font-bold text-sm text-blue-600">
                        {snip.title}
                      </h4>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {snip.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(snip.code, snip.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition cursor-pointer self-start sm:self-auto ${
                        copiedId === snip.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {copiedId === snip.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === snip.id ? (lang === 'bn' ? 'কপি সম্পন্ন!' : 'Copied!') : (lang === 'bn' ? 'কোড কপি করুন' : 'Copy Code')}</span>
                    </button>
                  </div>

                  <pre className={`p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border ${
                    isDark ? 'bg-slate-900 border-slate-800 text-cyan-300' : 'bg-slate-950 border-slate-900 text-emerald-300'
                  }`}>
                    {snip.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Free Development Roadmap & Expansion Guide */}
        {activeTab === 'roadmap' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm sm:text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>{lang === 'bn' ? 'সম্পূর্ণ ফ্রিতে কীভাবে আজীবন অ্যাপ ডেভেলপ ও হোস্ট করবেন?' : 'How to Develop & Host for Free Forever'}</span>
              </div>
              <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                {lang === 'bn' 
                  ? 'এই বিলিং সিস্টেমটি কোনো পেইড ক্লাউড সাবস্ক্রিপশন ছাড়াই আজীবন সম্পূর্ণ ফ্রিতে পরিচালনা করা সম্ভব। নিচে আপনার জন্য ৪টি প্রধান পদ্ধতি দেওয়া হলো:' 
                  : 'You can host and scale this ISP billing app 100% free with modern zero-cost cloud tiers:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 text-blue-600">
                    <Server className="w-4 h-4" />
                    <span>১. ফ্রি ক্লাউড হোস্টিং (Vercel / Render / Cloud Run)</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Vercel এবং Render-এ ফ্রন্টএন্ড ও Node সার্ভার ফ্রি টিয়ারে হোস্ট করা যায় কোনো মাসিক খরচ ছাড়াই।
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 text-emerald-600">
                    <Layers className="w-4 h-4" />
                    <span>২. ফ্রি ডাটাবেজ (Supabase / SQLite / Firebase)</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Supabase বা Firebase-এ প্রতি মাসে ৫০,০০০ পর্যন্ত রিকোয়েস্ট সম্পূর্ণ বিনামূল্যে পাওয়া যায়।
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 text-amber-600">
                    <Smartphone className="w-4 h-4" />
                    <span>৩. PWA দিয়ে ফ্রি মোবাইল অ্যাপ</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    প্লে-স্টোরে টাকা দিয়ে অ্যাপ পাবলিশ না করেও গ্রাহক ও লাইনম্যানরা ক্রোম ব্রাউজার থেকে সরাসরি ফোনে অ্যাপ হিসেবে ইনস্টল করতে পারে।
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 text-indigo-600">
                    <Bot className="w-4 h-4" />
                    <span>৪. Google Gemini API (Free Tier)</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    এই অ্যাপের সাথে যুক্ত Gemini 3.8 Flash মডেল দিয়ে যেকোনো সময় নতুন ফিচার কোডিং ও টেকনিক্যাল সমাধান ফ্রিতে জেনারেট করে নিতে পারবেন।
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
