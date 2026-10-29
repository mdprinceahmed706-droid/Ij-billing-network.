import React, { useState, useMemo } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  Search, 
  Download, 
  CheckCircle2,
  CreditCard,
  Building,
  User,
  Phone,
  ArrowRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { Customer, ISPSettings, Language } from '../types/isp';
import { translations, formatCurrency, formatNumber, getMonthName } from '../i18n/translations';
import { IJLogo } from './IJLogo';

interface BillSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  monthKey: string;
  settings: ISPSettings;
  onSelectMonth?: (monthKey: string) => void;
}

interface DailyPaymentItem {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  pppoeId: string;
  zoneName: string;
  packageSpeed: string;
  paidAmount: number;
  paidDate: string; // YYYY-MM-DD
  paymentMethod: string;
  receiptNumber: string;
  monthKey: string;
  note?: string;
}

export const BillSheetModal: React.FC<BillSheetModalProps> = ({
  isOpen,
  onClose,
  customers,
  monthKey,
  settings
}) => {
  if (!isOpen) return null;

  const lang = settings.language;
  const t = translations[lang];
  const todayStr = new Date().toISOString().slice(0, 10);
  
  // Yesterday's date string
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // Selected date filter: 'all' (all dates grouped) or specific YYYY-MM-DD
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. EXTRACT ALL ACTUAL PAYMENTS (ONLY the actual money collected on each date)
  const allDailyPayments = useMemo<DailyPaymentItem[]>(() => {
    const list: DailyPaymentItem[] = [];

    for (const c of customers) {
      if (!c.bills) continue;

      for (const [mKey, bill] of Object.entries(c.bills)) {
        if (bill && bill.paidAmount > 0) {
          const dateStr = bill.paidDate || todayStr;
          list.push({
            id: `${c.id}-${mKey}-${dateStr}`,
            customerId: c.id,
            customerName: c.name || 'গ্রাহক',
            phone: c.phone || '',
            pppoeId: c.pppoeId || 'N/A',
            zoneName: c.zoneName || 'Main Zone',
            packageSpeed: c.packageSpeed || '10 Mbps',
            paidAmount: bill.paidAmount,
            paidDate: dateStr,
            paymentMethod: bill.paymentMethod || 'Cash',
            receiptNumber: bill.receiptNumber || `RCP-${dateStr.replace(/-/g, '')}-${c.id.slice(-4)}`,
            monthKey: mKey,
            note: bill.note
          });
        }
      }
    }

    // Sort by paidDate descending (newest first), then by receiptNumber
    list.sort((a, b) => b.paidDate.localeCompare(a.paidDate));
    return list;
  }, [customers, todayStr]);

  // 2. GROUP BY PAID DATE
  const dateGroups = useMemo(() => {
    const map = new Map<string, DailyPaymentItem[]>();
    for (const item of allDailyPayments) {
      const existing = map.get(item.paidDate) || [];
      existing.push(item);
      map.set(item.paidDate, existing);
    }
    return map;
  }, [allDailyPayments]);

  const uniqueDates = useMemo(() => {
    return Array.from(dateGroups.keys()).sort((a, b) => b.localeCompare(a));
  }, [dateGroups]);

  // If initial selectedDate is today but has no records, and there are other records, pick the most recent date
  const activeDate = selectedDate;

  // Filtered payments based on activeDate & searchQuery
  const filteredPayments = useMemo(() => {
    let result = allDailyPayments;

    if (activeDate !== 'all') {
      result = result.filter(p => p.paidDate === activeDate);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.customerName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.pppoeId.toLowerCase().includes(q) ||
        p.receiptNumber.toLowerCase().includes(q) ||
        p.paymentMethod.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allDailyPayments, activeDate, searchQuery]);

  // Totals for active view
  const currentTotalAmount = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0);
  }, [filteredPayments]);

  // Method breakdown for the active view
  const methodBreakdown = useMemo(() => {
    const acc = { cash: 0, bkash: 0, nagad: 0, bank: 0, other: 0 };
    for (const p of filteredPayments) {
      const m = (p.paymentMethod || '').toLowerCase();
      if (m.includes('bkash') || m.includes('বিকাশ')) acc.bkash += p.paidAmount;
      else if (m.includes('nagad') || m.includes('নগদ')) acc.nagad += p.paidAmount;
      else if (m.includes('bank') || m.includes('ব্যাংক')) acc.bank += p.paidAmount;
      else if (m.includes('cash') || m.includes('ক্যাশ') || m.includes('নগদ টাকা')) acc.cash += p.paidAmount;
      else acc.other += p.paidAmount;
    }
    return acc;
  }, [filteredPayments]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = ['ক্রম', 'তারিখ', 'গ্রাহকের নাম', 'ফোন নম্বর', 'PPPoE আইডি', 'প্যাকেজ', 'আদায়কৃত টাকা (টাকা)', 'পেমেন্ট মাধ্যম', 'রসিদ নম্বর'];
    const rows = filteredPayments.map((p, idx) => [
      idx + 1,
      p.paidDate,
      `"${p.customerName}"`,
      `"${p.phone}"`,
      `"${p.pppoeId}"`,
      `"${p.packageSpeed}"`,
      p.paidAmount,
      `"${p.paymentMethod}"`,
      `"${p.receiptNumber}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daily_Bill_Collection_${activeDate === 'all' ? 'All_Dates' : activeDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 print:p-0">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm print:hidden" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 sm:p-6 overflow-hidden z-10 max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200 print:max-h-none print:shadow-none print:border-none print:p-2">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-black text-slate-900">
                  {lang === 'bn' ? 'দৈনিক বিল কালেকশন শিট' : 'Daily Bill Collection Sheet'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {activeDate === 'all' 
                    ? (lang === 'bn' ? 'সকল দিনের মোট হিসাব' : 'All Dates') 
                    : activeDate === todayStr 
                      ? (lang === 'bn' ? 'আজকের কালেকশন' : "Today's") 
                      : activeDate}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'bn' 
                  ? `${settings.companyNameBn || 'আইজে নেটওয়ার্ক'} - শুধুমাত্র নির্দিষ্ট তারিখে আদায়কৃত বিল ও মোট টাকার সঠিক হিসাব` 
                  : `${settings.companyNameEn || 'IJ Network'} - Daily actual payment collections & exact totals only`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleExportCsv}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300 transition cursor-pointer shadow-xs active:scale-95"
              title="CSV / Excel ফাইল ডাউনলোড করুন"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">CSV ডাউনলোড</span>
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'প্রিন্ট শিট' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs pr-1">
          
          {/* Quick Date Switcher Bar (User Friendly) */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{lang === 'bn' ? 'তারিখ নির্বাচন করুন (যেই তারিখে বিল দেওয়া হয়েছে):' : 'Select Payment Date:'}</span>
              </span>

              {/* Quick Date Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    activeDate === todayStr
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{lang === 'bn' ? 'আজকের বিল' : "Today"}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeDate === todayStr ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {dateGroups.get(todayStr)?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDate(yesterdayStr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    activeDate === yesterdayStr
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{lang === 'bn' ? 'গতকাল' : 'Yesterday'}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeDate === yesterdayStr ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {dateGroups.get(yesterdayStr)?.length || 0}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDate('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    activeDate === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{lang === 'bn' ? 'সকল দিন আলাদাভাবে' : 'All Dates'}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeDate === 'all' ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {allDailyPayments.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Date Picker & Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-slate-200">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                  {lang === 'bn' ? 'ক্যালেন্ডার থেকে নির্দিষ্ট দিন:' : 'Specific Date:'}
                </span>
                <input
                  type="date"
                  value={activeDate === 'all' ? '' : activeDate}
                  onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs focus:border-blue-600 focus:outline-none cursor-pointer"
                />
              </div>

              {uniqueDates.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                    {lang === 'bn' ? 'পূর্বে আদায়কৃত তারিখসমূহ:' : 'Previous Dates:'}
                  </span>
                  <select
                    value={activeDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs focus:border-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="all">সব দিন একসাথে ({allDailyPayments.length} টি পেমেন্ট)</option>
                    {uniqueDates.map(d => {
                      const count = dateGroups.get(d)?.length || 0;
                      const sum = dateGroups.get(d)?.reduce((acc, curr) => acc + curr.paidAmount, 0) || 0;
                      return (
                        <option key={d} value={d}>
                          {d} : {count} জন গ্রাহক - {formatCurrency(sum, lang)}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative print:hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'bn' ? 'গ্রাহকের নাম, মোবাইল, PPPoE বা রসিদ নম্বর দিয়ে খুঁজুন...' : 'Search by name, phone, PPPoE or receipt...'}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:border-blue-600 focus:outline-none shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* MAIN DAILY HIGHLIGHT CARD (ওই দিনে টোটাল কত বিল উঠলো) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div>
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  <span>
                    {activeDate === 'all' 
                      ? (lang === 'bn' ? 'সর্বমোট আদায়কৃত কালেকশন' : 'Total Collection Across All Dates') 
                      : (lang === 'bn' ? `তারিখ: ${activeDate} (ওই দিনের টোটাল বিল)` : `Date: ${activeDate} (Daily Collection)`)}
                  </span>
                </span>
                <div className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                  <span>{formatCurrency(currentTotalAmount, lang)}</span>
                  <span className="text-xs sm:text-sm font-medium text-emerald-200">
                    ({formatNumber(filteredPayments.length, lang)} {lang === 'bn' ? 'জন গ্রাহক পরিশোধ করেছেন' : 'customers paid'})
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 mt-1">
                  {lang === 'bn' 
                    ? `যেই তারিখে যে গ্রাহক টাকা দিয়েছেন শুধু সেই গ্রাহক ও টাকার পরিমাণ এখানে অন্তর্ভুক্ত।` 
                    : `Only customers who paid on this exact date are listed below.`}
                </p>
              </div>

              {/* Payment Methods Breakdown Badge Cards */}
              <div className="flex flex-wrap items-center gap-2 bg-black/25 p-2.5 rounded-xl border border-white/15">
                <div className="text-center px-2">
                  <span className="text-[10px] text-emerald-200 block font-semibold">{lang === 'bn' ? 'নগদ/ক্যাশ' : 'Cash'}</span>
                  <span className="font-extrabold text-xs text-white">{formatCurrency(methodBreakdown.cash, lang)}</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="text-center px-2">
                  <span className="text-[10px] text-pink-200 block font-semibold">{lang === 'bn' ? 'বিকাশ' : 'bKash'}</span>
                  <span className="font-extrabold text-xs text-white">{formatCurrency(methodBreakdown.bkash, lang)}</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="text-center px-2">
                  <span className="text-[10px] text-amber-200 block font-semibold">{lang === 'bn' ? 'নগদ PGW' : 'Nagad'}</span>
                  <span className="font-extrabold text-xs text-white">{formatCurrency(methodBreakdown.nagad, lang)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PRINT-ONLY OFFICIAL HEADER */}
          <div className="hidden print:block pb-3 mb-3 border-b-2 border-slate-900 text-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black">{settings.companyNameBn || settings.companyNameEn || 'আইজে নেটওয়ার্ক'}</h1>
                <p className="text-xs font-semibold">{settings.addressBn || settings.addressEn}</p>
                <p className="text-xs font-mono">হেল্পলাইন: {settings.phone} | BTRC Reg: {settings.btrcRegNo || 'ISP-BTRC-2024'}</p>
              </div>
              <div className="text-right">
                <h2 className="text-base font-bold bg-slate-100 px-3 py-1 rounded border border-slate-300">
                  {lang === 'bn' ? 'দৈনিক বিল কালেকশন রেজিস্টার শিট' : 'Daily Bill Collection Register'}
                </h2>
                <p className="text-xs font-bold mt-1">
                  তারিখ: {activeDate === 'all' ? 'সকল দিন' : activeDate} | মোট আদায়: {formatCurrency(currentTotalAmount, lang)}
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* VIEW OPTION 1: SINGLE SPECIFIC DATE TABLE                */}
          {/* ======================================================== */}
          {activeDate !== 'all' ? (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>
                    {lang === 'bn' ? `${activeDate} তারিখের কালেকশন তালিকা` : `Collection List for ${activeDate}`}
                  </span>
                  <span className="text-slate-500 font-normal">
                    ({formatNumber(filteredPayments.length, lang)} {lang === 'bn' ? 'জন' : 'records'})
                  </span>
                </span>

                <span className="font-black text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {lang === 'bn' ? 'ওই দিনের মোট কালেকশন:' : 'Day Total:'} {formatCurrency(currentTotalAmount, lang)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-3 text-center w-12">{lang === 'bn' ? 'ক্রম' : 'SL'}</th>
                      <th className="py-2.5 px-3">{lang === 'bn' ? 'তারিখ' : 'Date'}</th>
                      <th className="py-2.5 px-3">{lang === 'bn' ? 'গ্রাহকের নাম ও ফোন' : 'Customer & Phone'}</th>
                      <th className="py-2.5 px-3">PPPoE ইউজারনেম</th>
                      <th className="py-2.5 px-3">{lang === 'bn' ? 'প্যাকেজ' : 'Package'}</th>
                      <th className="py-2.5 px-3 font-black text-emerald-800">{lang === 'bn' ? 'আদায়কৃত বিল (টাকা)' : 'Paid Amount'}</th>
                      <th className="py-2.5 px-3">{lang === 'bn' ? 'মাধ্যম' : 'Method'}</th>
                      <th className="py-2.5 px-3 text-right">{lang === 'bn' ? 'রসিদ নং' : 'Receipt No.'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Calendar className="w-8 h-8 text-slate-300" />
                            <h4 className="font-bold text-slate-800 text-sm">
                              {lang === 'bn' ? `এই তারিখে (${activeDate}) কোনো বিল আদায় হয়নি` : `No payments collected on ${activeDate}`}
                            </h4>
                            <p className="text-xs text-slate-400">
                              {lang === 'bn' ? 'অন্য কোনো তারিখ নির্বাচন করুন অথবা উপরে "সকল দিন" বাটনে চাপ দিন।' : 'Please choose another date or select "All Dates".'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition border-b border-slate-100">
                          <td className="py-2.5 px-3 text-center text-slate-500 font-mono font-bold">
                            {formatNumber(index + 1, lang)}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 font-semibold whitespace-nowrap">
                            {item.paidDate}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block">{item.customerName}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{item.phone}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-700 select-all">
                            {item.pppoeId}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap font-medium">
                            {item.packageSpeed}
                          </td>
                          <td className="py-2.5 px-3 font-black text-emerald-700 text-sm whitespace-nowrap">
                            {formatCurrency(item.paidAmount, lang)}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.paymentMethod.toLowerCase().includes('bkash') ? 'bg-pink-50 text-pink-700 border border-pink-200' :
                              item.paymentMethod.toLowerCase().includes('nagad') ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {item.paymentMethod}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-500 text-[11px] whitespace-nowrap">
                            {item.receiptNumber}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {/* Table Footer with Exact Total for that Date */}
                  {filteredPayments.length > 0 && (
                    <tfoot>
                      <tr className="bg-emerald-50/70 border-t-2 border-emerald-300 font-bold text-slate-900">
                        <td colSpan={5} className="py-3 px-3 text-right text-xs uppercase tracking-wider font-extrabold text-emerald-950">
                          {lang === 'bn' ? `👉 ${activeDate} তারিখে সর্বমোট আদায় হয়েছে:` : `Total Collected on ${activeDate}:`}
                        </td>
                        <td className="py-3 px-3 text-emerald-800 font-black text-base whitespace-nowrap">
                          {formatCurrency(currentTotalAmount, lang)}
                        </td>
                        <td colSpan={2} className="py-3 px-3 text-right text-xs text-slate-600 font-semibold">
                          ({formatNumber(filteredPayments.length, lang)} {lang === 'bn' ? 'জন গ্রাহকের মোট টাকা' : 'payments'})
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          ) : (
            
            /* ======================================================== */
            /* VIEW OPTION 2: ALL DATES SEPARATED DAY-BY-DAY            */
            /* ======================================================== */
            <div className="space-y-4">
              {uniqueDates.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500">
                  {lang === 'bn' ? 'কোনো আদায়কৃত বিলের রেকর্ড পাওয়া যায়নি।' : 'No bill payment records found.'}
                </div>
              ) : (
                uniqueDates.map(dateKey => {
                  const dayItems = dateGroups.get(dateKey) || [];
                  const dayTotal = dayItems.reduce((sum, item) => sum + item.paidAmount, 0);

                  return (
                    <div key={dateKey} className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                      {/* Day Header */}
                      <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-emerald-600" />
                          <h4 className="font-black text-sm text-slate-900">
                            📅 {lang === 'bn' ? `তারিখ: ${dateKey}` : `Date: ${dateKey}`}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                            {formatNumber(dayItems.length, lang)} {lang === 'bn' ? 'জন গ্রাহক' : 'customers'}
                          </span>
                        </div>

                        {/* Day Total Highlight */}
                        <div className="font-black text-xs text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                          {lang === 'bn' ? 'এই দিনের মোট কালেকশন:' : 'Day Total:'} {formatCurrency(dayTotal, lang)}
                        </div>
                      </div>

                      {/* Day Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              <th className="py-2 px-3 text-center w-12">{lang === 'bn' ? 'ক্রম' : 'SL'}</th>
                              <th className="py-2 px-3">{lang === 'bn' ? 'গ্রাহকের নাম ও ফোন' : 'Customer & Phone'}</th>
                              <th className="py-2 px-3">PPPoE আইডি</th>
                              <th className="py-2 px-3">{lang === 'bn' ? 'প্যাকেজ' : 'Speed'}</th>
                              <th className="py-2 px-3 font-bold text-emerald-800">{lang === 'bn' ? 'আদায়কৃত টাকা' : 'Paid Amount'}</th>
                              <th className="py-2 px-3">{lang === 'bn' ? 'মাধ্যম' : 'Method'}</th>
                              <th className="py-2 px-3 text-right">{lang === 'bn' ? 'রসিদ নং' : 'Receipt No.'}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {dayItems.map((item, idx) => (
                              <tr key={item.id} className="hover:bg-slate-50 transition">
                                <td className="py-2 px-3 text-center text-slate-400 font-mono">
                                  {formatNumber(idx + 1, lang)}
                                </td>
                                <td className="py-2 px-3">
                                  <span className="font-bold text-slate-900 block">{item.customerName}</span>
                                  <span className="text-[11px] text-slate-500 font-mono">{item.phone}</span>
                                </td>
                                <td className="py-2 px-3 font-mono font-bold text-blue-700">
                                  {item.pppoeId}
                                </td>
                                <td className="py-2 px-3 text-slate-600 font-medium">
                                  {item.packageSpeed}
                                </td>
                                <td className="py-2 px-3 font-black text-emerald-700 text-xs">
                                  {formatCurrency(item.paidAmount, lang)}
                                </td>
                                <td className="py-2 px-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    {item.paymentMethod}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-slate-500 text-[11px]">
                                  {item.receiptNumber}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-emerald-50/50 border-t border-emerald-200 font-bold text-slate-900">
                              <td colSpan={4} className="py-2 px-3 text-right text-xs font-bold text-emerald-900">
                                {lang === 'bn' ? `👉 ${dateKey} তারিখে মোট বিল আদায় হয়েছে:` : `Total for ${dateKey}:`}
                              </td>
                              <td className="py-2 px-3 text-emerald-800 font-black text-sm">
                                {formatCurrency(dayTotal, lang)}
                              </td>
                              <td colSpan={2} className="py-2 px-3 text-right text-xs text-slate-500">
                                ({formatNumber(dayItems.length, lang)} {lang === 'bn' ? 'জন' : 'payments'})
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* PRINT FOOTER SIGNATURES */}
          <div className="hidden print:flex pt-12 justify-between text-xs text-slate-700">
            <div className="text-center w-48 border-t border-slate-900 pt-1">
              {lang === 'bn' ? 'ক্যাশিয়ার / আদায়কারীর স্বাক্ষর' : 'Cashier Signature'}
            </div>
            <div className="text-center w-48 border-t border-slate-900 pt-1">
              {lang === 'bn' ? 'মালিক / পরিচালকের স্বাক্ষর' : 'Proprietor Signature'}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="text-xs text-slate-600 font-medium">
            {lang === 'bn' 
              ? `বর্তমান ভিউতে মোট আদায়: ${formatCurrency(currentTotalAmount, lang)} (${filteredPayments.length} জন)` 
              : `Total in View: ${formatCurrency(currentTotalAmount, lang)} (${filteredPayments.length} records)`}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer active:scale-95 shadow-xs"
          >
            {t.closeBtn || 'বন্ধ করুন'}
          </button>
        </div>

      </div>
    </div>
  );
};
