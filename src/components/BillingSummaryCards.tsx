import React from 'react';
import { Wallet, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { BillingSummary, Language } from '../types/isp';
import { translations, formatCurrency, formatNumber } from '../i18n/translations';

interface BillingSummaryCardsProps {
  summary: BillingSummary;
  activeCount: number;
  inactiveCount: number;
  lang: Language;
  onSelectActive?: () => void;
  onSelectInactive?: () => void;
}

export const BillingSummaryCards: React.FC<BillingSummaryCardsProps> = ({ 
  summary, 
  activeCount,
  inactiveCount,
  lang,
  onSelectActive,
  onSelectInactive
}) => {
  const t = translations[lang];

  // Calculate percentage of bill collected this month
  const collectionPercentage = summary.totalMonthlyBill > 0
    ? Math.round((summary.collectedAmount / summary.totalMonthlyBill) * 100)
    : 0;

  return (
    <section className="mb-6 space-y-4">
      {/* 0. Top Row: Active Customers & Deactivated Customers with Logos */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        
        {/* Active Customers Card */}
        <div 
          onClick={onSelectActive}
          className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'bn' ? 'সক্রিয় গ্রাহক (অ্যাক্টিভ)' : 'Active Customers'}</span>
            </span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs group-hover:scale-105 transition">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {formatNumber(activeCount, lang)}
            <span className="text-xs sm:text-sm font-bold text-emerald-600 ml-1.5">
              {lang === 'bn' ? 'জন' : 'active'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
            <span className="text-emerald-700 font-semibold">
              {lang === 'bn' ? '✓ ইন্টারনেট সংযোগ চালু' : '✓ Connected & Active'}
            </span>
            <span className="text-blue-600 group-hover:text-emerald-600 transition text-[10px] uppercase font-bold">
              {lang === 'bn' ? 'তালিকা দেখুন →' : 'View List →'}
            </span>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Deactivated Customers Card */}
        <div 
          onClick={onSelectInactive}
          className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-rose-500 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{lang === 'bn' ? 'ডিঅ্যাক্টিভ গ্রাহক (বন্ধ লাইন)' : 'Deactivated Customers'}</span>
            </span>
            <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs group-hover:scale-105 transition">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {formatNumber(inactiveCount, lang)}
            <span className="text-xs sm:text-sm font-bold text-rose-600 ml-1.5">
              {lang === 'bn' ? 'জন' : 'inactive'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
            <span className="text-rose-600 font-semibold">
              {lang === 'bn' ? '✕ লাইন সাময়িক বন্ধ' : '✕ Disconnected'}
            </span>
            <span className="text-rose-600 group-hover:text-rose-700 transition text-[10px] uppercase font-bold">
              {lang === 'bn' ? 'তালিকা দেখুন →' : 'View List →'}
            </span>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
        </div>

      </div>

      {/* 1. Main 4 Financial Billing Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. মোট চলতি বিল (Total Monthly Bill) */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 p-4 sm:p-5 shadow-xs group transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold text-slate-600">
              {t.totalMonthlyBill}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            {formatCurrency(summary.totalMonthlyBill, lang)}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500 font-medium">
            <span>{lang === 'bn' ? 'সক্রিয় গ্রাহক:' : 'Active Lines:'}</span>
            <span className="ml-1 text-slate-800 font-bold">
              {formatNumber(activeCount, lang)} {lang === 'bn' ? 'জন' : ''}
            </span>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
        </div>

        {/* 2. আদায়কৃত বিল (Collected Bill) */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 p-4 sm:p-5 shadow-xs group transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold text-emerald-700">
              {t.collectedBill}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-600 tracking-tight">
            {formatCurrency(summary.collectedAmount, lang)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span className="text-emerald-700 font-bold">
              {formatNumber(summary.paidCustomersCount, lang)} {t.paidCustomersCount}
            </span>
            <span className="text-slate-700 font-extrabold">{collectionPercentage}%</span>
          </div>
          <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(collectionPercentage, 100)}%` }} 
            />
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* 3. চলতি বকেয়া বিল (Remaining Current Due) */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-amber-500 p-4 sm:p-5 shadow-xs group transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold text-amber-700">
              {t.remainingDue}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-600 tracking-tight">
            {formatCurrency(summary.currentMonthDueAmount, lang)}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500 font-medium">
            <span>{t.dueCustomersCount}:</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px]">
              {formatNumber(summary.dueCustomersCount, lang)}
            </span>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
        </div>

        {/* 4. বিগত মাসের বকেয়া ও সর্বমোট বকেয়া (Previous Arrears & Total Outstanding) */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 hover:border-rose-500 p-4 sm:p-5 shadow-xs group transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold text-rose-700">
              {t.previousArrears}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-rose-600 tracking-tight">
            {formatCurrency(summary.previousArrearsAmount, lang)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
            <span className="text-slate-500 font-medium">{t.totalOutstanding}:</span>
            <span className="text-rose-700 font-black">
              {formatCurrency(summary.totalOutstandingDue, lang)}
            </span>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
        </div>

      </div>
    </section>
  );
};
