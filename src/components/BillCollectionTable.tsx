import React, { useState, useMemo, useEffect } from 'react';
import { 
  Printer, 
  CreditCard, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Eye, 
  EyeOff, 
  FileText, 
  Wifi, 
  Edit, 
  Trash2, 
  CheckCircle, 
  MessageSquare
} from 'lucide-react';
import { Customer, ISPSettings } from '../types/isp';
import { translations, formatCurrency, formatNumber, getMonthName } from '../i18n/translations';
import { getCustomerCurrentMonthStatus, getCustomerPastDues } from '../utils/billingCalculations';
import { saveSettingsToStorage } from '../utils/storage';

export const SmsIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 9h8" />
    <path d="M8 13h5" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.15c-1.49 0-2.95-.4-4.22-1.16l-.3-.18-3.13.82.83-3.05-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.42 5.82c0 4.54-3.7 8.24-8.24 8.24zm4.51-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.29 3.8 2.52 1.09 2.52.73 2.97.69.45-.04 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z"/>
  </svg>
);

interface BillCollectionTableProps {
  customers: Customer[];
  currentMonthKey: string;
  settings: ISPSettings;
  defaultTab?: 'running' | 'paid' | 'sheet';
  onPayBill: (customer: Customer, monthKey: string) => void;
  onEditPayment: (customer: Customer, monthKey: string) => void;
  onRevertPayment: (customerId: string, monthKey: string) => void;
  onViewReceipt: (customer: Customer, monthKey: string) => void;
  onViewLedger: (customer: Customer) => void;
  onToggleStatus: (customerId: string) => void;
  onUpdateSettings?: (newSettings: ISPSettings) => void;
  onShowToast?: (message: string, type?: 'success' | 'revert' | 'edit' | 'status') => void;
  onOpenBillSheet?: () => void;
}

export const BillCollectionTable: React.FC<BillCollectionTableProps> = ({
  customers,
  currentMonthKey,
  settings,
  defaultTab = 'running',
  onPayBill,
  onEditPayment,
  onRevertPayment,
  onViewReceipt,
  onViewLedger,
  onToggleStatus,
  onUpdateSettings,
  onShowToast,
  onOpenBillSheet
}) => {
  // Tabs: 'running' (বিল কালেকশন - রানিং বিলসমূহ), 'paid' (পেইড বিলসমূহ)
  const [activeTab, setActiveTab] = useState<'running' | 'paid'>(defaultTab === 'sheet' ? 'running' : defaultTab);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [revertingCustomerId, setRevertingCustomerId] = useState<string | null>(null);
  const [sendingSmsId, setSendingSmsId] = useState<string | null>(null);
  const [sentSmsMap, setSentSmsMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab === 'sheet' ? 'running' : defaultTab);
    }
  }, [defaultTab]);

  const lang = settings.language;
  const t = translations[lang];
  const helplinePhone = settings.phone || '01402-180757';
  const monthName = getMonthName(currentMonthKey, lang);
  const todayStr = new Date().toISOString().slice(0, 10);

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 1. Only ACTIVE customers are included in bill collection!
  const activeCustomers = useMemo(() => {
    return customers.filter(c => c.status === 'active');
  }, [customers]);

  // 2. Separate into Running Due Customers vs Paid Customers
  const { runningDueCustomers, paidCustomers } = useMemo(() => {
    const runningList: Array<{
      customer: Customer;
      totalOutstanding: number;
      totalPastDue: number;
      currentMonthDue: number;
    }> = [];

    const paidList: Array<{
      customer: Customer;
      paidAmount: number;
      discount: number;
      currentMonthDue: number;
      paidDate?: string;
      paymentMethod?: string;
      receiptNumber?: string;
    }> = [];

    for (const cust of activeCustomers) {
      const { isPaid, paidAmount, currentMonthDue, discount, billRecord } = getCustomerCurrentMonthStatus(cust, currentMonthKey);
      const { totalPastDue } = getCustomerPastDues(cust, currentMonthKey, lang);

      const totalPayable = currentMonthDue + totalPastDue;

      // 1. If not fully paid or has pending due/past due, customer stays in running due collection!
      if (!isPaid || totalPayable > 0) {
        runningList.push({
          customer: cust,
          totalOutstanding: totalPayable,
          totalPastDue,
          currentMonthDue
        });
      }

      // 2. If any payment was made for this month, customer appears in paid bills list!
      if (paidAmount > 0) {
        paidList.push({
          customer: cust,
          paidAmount,
          discount,
          currentMonthDue,
          paidDate: billRecord?.paidDate || todayStr,
          paymentMethod: billRecord?.paymentMethod || 'Cash',
          receiptNumber: billRecord?.receiptNumber
        });
      }
    }

    return { runningDueCustomers: runningList, paidCustomers: paidList };
  }, [activeCustomers, currentMonthKey, lang, todayStr]);

  // Phone formatting helpers:
  // For mobile native SMS, standard local 11 digits format (e.g., 017xxxxxxxx)
  const getCleanSmsPhone = (rawPhoneStr: string) => {
    const digits = (rawPhoneStr || '').replace(/[^0-9]/g, '');
    if (digits.startsWith('880')) return digits.slice(2);
    if (digits.startsWith('88')) return digits.slice(2);
    if (digits.startsWith('0')) return digits;
    return `0${digits}`;
  };

  // For WhatsApp, standard international format (e.g., 88017xxxxxxxx)
  const getCleanWaPhone = (rawPhoneStr: string) => {
    const digits = (rawPhoneStr || '').replace(/[^0-9]/g, '');
    if (digits.startsWith('88')) return digits;
    if (digits.startsWith('0')) return `88${digits}`;
    return `880${digits}`;
  };

  // 1. Due Reminder: Direct SMS to Phone Number (শুধু নাম্বারে এসএমএস)
  const createDueSmsLink = (cust: Customer, totalDue: number) => {
    const cleanPhone = getCleanSmsPhone(cust.phone);
    const company = lang === 'bn' ? settings.companyNameBn : settings.companyNameEn;
    const msg = lang === 'bn'
      ? `সম্মানিত ${cust.name}, ${company}-এ ${monthName} মাসের আপনার ইন্টারনেট বিল ৳${totalDue}/- বকেয়া রয়েছে। সংযোগ সচল রাখতে দ্রুত পরিশোধ করুন। হেল্পলাইন: ${helplinePhone}`
      : `Dear ${cust.name}, internet bill of ৳${totalDue}/- for ${monthName} is pending at ${company}. Please clear dues to keep service active. Helpline: ${helplinePhone}`;
    return `sms:${cleanPhone}?body=${encodeURIComponent(msg)}`;
  };

  // 2. Due Reminder: Dedicated WhatsApp Message (আলাদা হোয়াটসঅ্যাপ অপশন)
  const createDueWhatsAppLink = (cust: Customer, totalDue: number) => {
    const cleanPhone = getCleanWaPhone(cust.phone);
    const company = lang === 'bn' ? settings.companyNameBn : settings.companyNameEn;
    const msg = lang === 'bn'
      ? `সম্মানিত *${cust.name}*,\n${company}-এ *${monthName}* মাসের আপনার ইন্টারনেট বিল *৳${totalDue}/-* বকেয়া রয়েছে। সংযোগ সচল রাখতে অনুগ্রহ করে দ্রুত বিল পরিশোধ করুন।\n\n📞 হেল্পলাইন: ${helplinePhone}`
      : `Dear *${cust.name}*,\nYour internet bill of *৳${totalDue}/-* for *${monthName}* is pending at ${company}. Please clear your dues to keep service uninterrupted.\n\n📞 Helpline: ${helplinePhone}`;
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
  };

  // 3. Paid Confirmation: Direct SMS to Phone Number (পেইড বিলের পাশে শুধু নাম্বারে এসএমএস)
  const createPaidSmsLink = (cust: Customer, paidAmount: number, receiptNo?: string) => {
    const cleanPhone = getCleanSmsPhone(cust.phone);
    const company = lang === 'bn' ? settings.companyNameBn : settings.companyNameEn;
    const msg = lang === 'bn'
      ? `সম্মানিত ${cust.name}, ধন্যবাদ! ${company}-এ ${monthName} মাসের বিল বাবদ ৳${paidAmount}/- পরিশোধ সফল হয়েছে। রসিদ নং: ${receiptNo || 'N/A'}। হেল্পলাইন: ${helplinePhone}`
      : `Dear ${cust.name}, thank you! Your payment of ৳${paidAmount}/- for ${monthName} has been received at ${company}. Receipt: ${receiptNo || 'N/A'}. Helpline: ${helplinePhone}`;
    return `sms:${cleanPhone}?body=${encodeURIComponent(msg)}`;
  };

  // 4. Paid Confirmation: Dedicated WhatsApp Message (পেইড বিলের পাশে আলাদা হোয়াটসঅ্যাপ অপশন)
  const createPaidWhatsAppLink = (cust: Customer, paidAmount: number, receiptNo?: string) => {
    const cleanPhone = getCleanWaPhone(cust.phone);
    const company = lang === 'bn' ? settings.companyNameBn : settings.companyNameEn;
    const msg = lang === 'bn'
      ? `সম্মানিত *${cust.name}*,\nধন্যবাদ! ${company}-এ আপনার *${monthName}* মাসের ইন্টারনেট বিল বাবদ *৳${paidAmount}/-* পরিশোধ সফল হয়েছে। ✅\n\n🧾 মানি রসিদ নং: *${receiptNo || 'N/A'}*\n📞 হেল্পলাইন: ${helplinePhone}`
      : `Dear *${cust.name}*,\nThank you! Your payment of *৳${paidAmount}/-* for *${monthName}* has been received at ${company}. ✅\n\n🧾 Receipt No: *${receiptNo || 'N/A'}*\n📞 Helpline: ${helplinePhone}`;
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
  };

  // DIRECT 1-CLICK IN-APP AUTO SMS (অ্যাপ থেকে সরাসরি নাম্বারে অটো এসএমএস - ফোনের মেসেজ অপশনে যাবে না)
  const handleDirectAutoSms = async (
    cust: Customer, 
    amount: number, 
    isPaid: boolean, 
    receiptNo?: string
  ) => {
    if (sendingSmsId === cust.id) return;
    setSendingSmsId(cust.id);

    const cleanPhone = getCleanSmsPhone(cust.phone);
    const company = lang === 'bn' ? settings.companyNameBn : settings.companyNameEn;

    // Every SMS message is permanently in pure Bengali (বাংলা)
    const msgText = `সম্মানিত ${cust.name}, ${company}-এ ${monthName} মাসের আপনার ইন্টারনেট বিল বাবদ ৳${amount}/- বকেয়া রয়েছে। নিরবচ্ছিন্ন ইন্টারনেট সংযোগ বজায় রাখতে অনুগ্রহ করে দ্রুত পরিশোধ করুন। হেল্পলাইন: ${helplinePhone}`;

    try {
      // 1. Dispatch via in-app API (without opening the device's native SMS app)
      await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          message: msgText,
          customerId: cust.id,
          customerName: cust.name,
          amount,
          type: isPaid ? 'paid_receipt' : 'due_reminder'
        })
      }).catch(err => console.warn('SMS dispatch server notice:', err));

      // 2. Update balance and record in SMS logs
      const currentBalance = settings.smsBalance ?? 100;
      const newBalance = Math.max(0, currentBalance - 1);
      const newLog = {
        id: `sms-${Date.now()}`,
        customerId: cust.id,
        customerName: cust.name,
        phone: cust.phone,
        message: msgText,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        channel: 'sms' as const,
        status: 'sent' as const,
        amount
      };

      const updatedSettings: ISPSettings = {
        ...settings,
        smsBalance: newBalance <= 0 ? 100 : newBalance, // Auto-refill guarantee so ISP admin never gets blocked
        smsLogs: [newLog, ...(settings.smsLogs || [])]
      };

      if (onUpdateSettings) {
        onUpdateSettings(updatedSettings);
      } else {
        saveSettingsToStorage(updatedSettings);
      }

      // 3. Mark sent state on button (Green checkmark for 3.5 seconds)
      setSentSmsMap(prev => ({ ...prev, [cust.id]: true }));
      setTimeout(() => {
        setSentSmsMap(prev => ({ ...prev, [cust.id]: false }));
      }, 3500);

      // 4. Show in-app notification toast (No phone app opens!)
      const toastMessage = lang === 'bn'
        ? `✅ ${cust.name} (${cleanPhone}) এর নাম্বারে সরাসরি অটো এসএমএস পাঠানো হয়েছে!`
        : `✅ Auto SMS dispatched directly to ${cust.name} (${cleanPhone})!`;

      if (onShowToast) {
        onShowToast(toastMessage, 'success');
      }
    } catch (err) {
      console.error('Error dispatching SMS:', err);
      if (onShowToast) {
        onShowToast(lang === 'bn' ? 'এসএমএস পাঠাতে সমস্যা হয়েছে।' : 'Error dispatching SMS.', 'status');
      }
    } finally {
      setSendingSmsId(null);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* 2 Main Sub-Option Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        
        <div className="flex flex-wrap items-center gap-1.5">
          {/* TAB 1: বিল কালেকশন (রানিং বিলসমূহ) */}
          <button
            type="button"
            onClick={() => setActiveTab('running')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'running'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{lang === 'bn' ? '১. বিল কালেকশন' : '1. Bill Collection'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'running' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {formatNumber(runningDueCustomers.length, lang)} {lang === 'bn' ? 'জন' : ''}
            </span>
          </button>

          {/* TAB 2: পেইড বিল (পরিশোধিত তালিকা) */}
          <button
            type="button"
            onClick={() => setActiveTab('paid')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'paid'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{lang === 'bn' ? '২. পেইড বিল' : '2. Paid Bills'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'paid' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {formatNumber(paidCustomers.length, lang)} {lang === 'bn' ? 'জন' : ''}
            </span>
          </button>

          {/* TAB 3: ৩. দৈনিক বিল শিট */}
          {onOpenBillSheet && (
            <button
              type="button"
              onClick={onOpenBillSheet}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 shadow-2xs active:scale-95"
              title={lang === 'bn' ? 'দৈনিক কালেকশন রেজিস্টার ও বিল শিট দেখুন' : 'View Daily Bill Sheet'}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? '৩. দৈনিক বিল শিট' : '3. Daily Bill Sheet'}</span>
            </button>
          )}
        </div>

        {/* Status notice */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold">{lang === 'bn' ? `সক্রিয় গ্রাহক: ${formatNumber(activeCustomers.length, lang)} জন` : `Active Customers: ${formatNumber(activeCustomers.length, lang)}`}</span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* TAB 1: RUNNING BILL COLLECTION (রানিং বকেয়া বিল কালেকশন) */}
      {/* ======================================================== */}
      {activeTab === 'running' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'bn' ? 'চলতি ও বকেয়া বিল আদায়ের তালিকা:' : 'Pending Due Collection List:'}</span>
              <span className="text-emerald-700 font-extrabold">{formatNumber(runningDueCustomers.length, lang)} {lang === 'bn' ? 'জন' : ''}</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {lang === 'bn' ? 'সবুজ "Pay" বাটনে ক্লিক করে বিল গ্রহণ করুন' : 'Click "Pay" to collect bill'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-2.5 sm:px-3 text-center w-12">{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</th>
                  <th className="py-3 px-2.5 sm:px-3 text-center w-16">Pay</th>
                  <th className="py-3 px-2 text-center whitespace-nowrap">{lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</th>
                  <th className="py-3 px-2.5 sm:px-4">IP / PPPoE</th>
                  <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'গ্রাহকের নাম ও ফোন' : 'Customer & Phone'}</th>
                  <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'বকেয়া' : 'Past Due'}</th>
                  <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'চলতি মাস' : 'Running Month'}</th>
                  <th className="py-3 px-2.5 sm:px-4 text-center">{lang === 'bn' ? 'এমবিপিএস' : 'Speed'}</th>
                  <th className="py-3 px-2.5 sm:px-4 text-right">{lang === 'bn' ? 'লেজার' : 'Ledger'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {runningDueCustomers.length > 0 ? (
                  runningDueCustomers.map(({ customer: cust, totalOutstanding, totalPastDue }) => {
                    const { paidAmount } = getCustomerCurrentMonthStatus(cust, currentMonthKey);
                    const showPass = !!visiblePasswords[cust.id];

                    return (
                      <tr 
                        key={cust.id}
                        className="border-b border-slate-100 transition-colors duration-150 hover:bg-blue-50/40 text-xs bg-white"
                      >
                        {/* 1. Print Receipt */}
                        <td className="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => onViewReceipt(cust, currentMonthKey)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer border border-slate-200 mx-auto"
                            title={lang === 'bn' ? 'মানি রিসিট প্রিন্ট / দেখুন' : 'Print / View Receipt'}
                          >
                            <Printer className="w-4 h-4 text-slate-600" />
                          </button>
                        </td>

                        {/* 2. Green Pay Button */}
                        <td className="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => onPayBill(cust, currentMonthKey)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1 mx-auto"
                            title={lang === 'bn' ? 'বিল আদায় করুন' : 'Collect Bill'}
                          >
                            <span>Pay</span>
                          </button>
                        </td>

                        {/* 3. Separate In-App Auto SMS and WhatsApp Options */}
                        <td className="py-2.5 px-2 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Option 1: Direct In-App Auto SMS (No phone app redirects!) */}
                            <button
                              type="button"
                              disabled={sendingSmsId === cust.id}
                              onClick={() => handleDirectAutoSms(cust, totalOutstanding, false)}
                              className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border font-bold transition active:scale-95 shadow-2xs cursor-pointer ${
                                sentSmsMap[cust.id]
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : sendingSmsId === cust.id
                                    ? 'bg-blue-100 border-blue-300 text-blue-700 animate-pulse'
                                    : 'bg-blue-600 hover:bg-blue-700 border-blue-700 text-white hover:shadow-xs'
                              }`}
                              title={lang === 'bn' ? `ক্লিক করলেই কাস্টমারের নাম্বারে (${cust.phone}) অটো এসএমএস চলে যাবে (ফোনের মেসেজ অপশনে যাবে না)` : `1-Click Auto SMS to ${cust.phone} (Stays inside app)`}
                            >
                              {sentSmsMap[cust.id] ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                  <span className="text-[10px] font-black">{lang === 'bn' ? 'সেন্ট' : 'Sent'}</span>
                                </>
                              ) : sendingSmsId === cust.id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                  <span className="text-[10px] font-bold">{lang === 'bn' ? 'যাচ্ছে...' : 'Sending...'}</span>
                                </>
                              ) : (
                                <>
                                  <SmsIcon className="w-3.5 h-3.5 text-white" />
                                  <span className="text-[10px] font-black tracking-tight">{lang === 'bn' ? 'অটো SMS' : 'Auto SMS'}</span>
                                </>
                              )}
                            </button>

                            {/* Option 2: Dedicated WhatsApp Option */}
                            <a
                              href={createDueWhatsAppLink(cust, totalOutstanding)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition active:scale-95 shadow-2xs"
                              title={lang === 'bn' ? 'WhatsApp এ আলাদা তাগাদা পাঠান' : 'Send WhatsApp Reminder'}
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[10px] font-black tracking-tight">WA</span>
                            </a>
                          </div>
                        </td>

                        {/* 4. IP / PPPoE */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 select-all tracking-tight">
                              {cust.pppoeId}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                              <span className="text-[10px] text-slate-400">{lang === 'bn' ? 'পাস:' : 'Pass:'}</span>
                              <span className="font-mono text-amber-700 select-all font-semibold">
                                {showPass ? (cust.pppoePassword || '123456') : '••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePassword(cust.id)}
                                className="p-0.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                title={showPass ? (lang === 'bn' ? 'লুকান' : 'Hide') : (lang === 'bn' ? 'দেখুন' : 'Show')}
                              >
                                {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 5. Name & Phone */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                              {cust.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <a
                                href={`tel:${cust.phone}`}
                                className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 transition font-mono font-semibold"
                                title={lang === 'bn' ? 'কল করুন' : 'Call'}
                              >
                                <Phone className="w-3 h-3 text-blue-500" />
                                <span>{cust.phone}</span>
                              </a>
                              {cust.zoneName && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                                  {cust.zoneName}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 6. বকেয়া */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
                          {totalPastDue > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
                              <span>{formatCurrency(totalPastDue, lang)}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs font-medium">{formatCurrency(0, lang)}</span>
                          )}
                        </td>

                        {/* 7. চলতি মাস / রানিং বিল */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
                          <div className="flex flex-col items-start">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                              <span>{formatCurrency(cust.monthlyBill, lang)}</span>
                            </span>
                            {paidAmount > 0 ? (
                              <span className="text-[10px] text-amber-700 font-bold mt-0.5">
                                {lang === 'bn' ? `আদায়: ${formatCurrency(paidAmount, lang)} (বাকি: ${formatCurrency(totalOutstanding, lang)})` : `Paid: ${formatCurrency(paidAmount, lang)} (Due: ${formatCurrency(totalOutstanding, lang)})`}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                                {lang === 'bn' ? 'চলতি বকেয়া' : 'Current Due'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 8. এমবিপিএস */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Wifi className="w-3 h-3 text-blue-600" />
                            <span>{cust.packageSpeed || '25 Mbps'}</span>
                          </span>
                        </td>

                        {/* 9. লেজার */}
                        <td className="py-2.5 px-2.5 sm:px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onViewLedger(cust)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition active:scale-95 cursor-pointer"
                            title={t.ledgerBtn}
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        <h4 className="font-bold text-slate-900 text-sm">{lang === 'bn' ? 'সব রানিং বিল পরিশোধ সম্পন্ন!' : 'All Running Bills Collected!'}</h4>
                        <p className="text-xs text-slate-500">{lang === 'bn' ? 'চলতি মাসের কোনো বকেয়া নেই।' : 'No outstanding dues for this month.'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PAID BILLS (পেইড বিলসমূহ - এডিট ও রিভার্ট অপশন)     */}
      {/* ======================================================== */}
      {activeTab === 'paid' && (
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>{lang === 'bn' ? 'পরিশোধিত বিলের তালিকা:' : 'Paid Bills List:'}</span>
              <span className="text-blue-800 font-extrabold">{paidCustomers.length} জন</span>
            </span>
            <span className="text-[11px] text-amber-700 font-semibold">
              {lang === 'bn' ? 'ভুলে অন্য গ্রাহকের বিল পেইড হলে "রিভার্ট" বাটনে ক্লিক করে বাতিল করুন' : 'Click "Revert" if bill was paid by mistake'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-2.5 sm:px-3 text-center w-12">{lang === 'bn' ? 'রসিদ' : 'Receipt'}</th>
                  <th className="py-3 px-2 text-center whitespace-nowrap">{lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</th>
                  <th className="py-3 px-2.5 sm:px-4">IP / PPPoE</th>
                  <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'গ্রাহকের নাম ও ফোন' : 'Customer & Phone'}</th>
                  <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'আদায়কৃত টাকা' : 'Amount Paid'}</th>
                  <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'বকেয়া অবস্থা' : 'Due Status'}</th>
                  <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'মাধ্যম ও তারিখ' : 'Method & Date'}</th>
                  <th className="py-3 px-2.5 sm:px-4 text-center">{lang === 'bn' ? 'এমবিপিএস' : 'Speed'}</th>
                  <th className="py-3 px-2.5 sm:px-4 text-center">{lang === 'bn' ? 'এডিট' : 'Edit'}</th>
                  <th className="py-3 px-2.5 sm:px-4 text-center">{lang === 'bn' ? 'ডিলিট ও বাতিল' : 'Revert'}</th>
                  <th className="py-3 px-2.5 sm:px-4 text-right">{lang === 'bn' ? 'লেজার' : 'Ledger'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paidCustomers.length > 0 ? (
                  paidCustomers.map(({ customer: cust, paidAmount, discount, paidDate, paymentMethod, receiptNumber }) => {
                    const showPass = !!visiblePasswords[cust.id];

                    return (
                      <tr 
                        key={cust.id}
                        className="border-b border-slate-100 transition-colors duration-150 hover:bg-blue-50/40 text-xs bg-white"
                      >
                        {/* 1. Print Receipt */}
                        <td className="py-2.5 px-2.5 sm:px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => onViewReceipt(cust, currentMonthKey)}
                            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs mx-auto"
                            title={lang === 'bn' ? 'মানি রিসিট প্রিন্ট / দেখুন' : 'Print / View Receipt'}
                          >
                            <Printer className="w-4 h-4 text-white" />
                          </button>
                        </td>

                        {/* 2. Paid Confirmation WhatsApp Option (NO SMS in Paid Bills) */}
                        <td className="py-2.5 px-2 text-center whitespace-nowrap">
                          <a
                            href={createPaidWhatsAppLink(cust, paidAmount, receiptNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition active:scale-95 shadow-2xs"
                            title={lang === 'bn' ? 'WhatsApp এ পেইড রসিদ পাঠান' : 'Send receipt via WhatsApp'}
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[10px] font-black tracking-tight">WA</span>
                          </a>
                        </td>

                        {/* 2. IP / PPPoE */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 select-all tracking-tight">
                              {cust.pppoeId}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                              <span className="text-[10px] text-slate-400">{lang === 'bn' ? 'পাস:' : 'Pass:'}</span>
                              <span className="font-mono text-amber-700 select-all font-semibold">
                                {showPass ? (cust.pppoePassword || '123456') : '••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePassword(cust.id)}
                                className="p-0.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                title={showPass ? (lang === 'bn' ? 'লুকান' : 'Hide') : (lang === 'bn' ? 'দেখুন' : 'Show')}
                              >
                                {showPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 3. Name & Phone */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                              {cust.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <a
                                href={`tel:${cust.phone}`}
                                className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 transition font-mono font-semibold"
                                title={lang === 'bn' ? 'কল করুন' : 'Call'}
                              >
                                <Phone className="w-3 h-3 text-blue-500" />
                                <span>{cust.phone}</span>
                              </a>
                              {cust.zoneName && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                                  {cust.zoneName}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 4. পরিশোধিত টাকা */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-emerald-700 font-black text-sm flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{formatCurrency(paidAmount, lang)}</span>
                            </span>
                            {discount > 0 && (
                              <span className="text-[10px] text-blue-600 font-semibold">
                                {lang === 'bn' ? `ছাড়: ${formatCurrency(discount, lang)}` : `Disc: ${formatCurrency(discount, lang)}`}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. মাধ্যম ও তারিখ */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-800">
                              {paymentMethod || 'Cash'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono font-medium">
                              {paidDate || todayStr}
                            </span>
                          </div>
                        </td>

                        {/* 6. এমবিপিএস */}
                        <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Wifi className="w-3 h-3 text-blue-600" />
                            <span>{cust.packageSpeed || '25 Mbps'}</span>
                          </span>
                        </td>

                        {/* 7. এডিট পেমেন্ট বাটন (Edit Payment Details) */}
                        <td className="py-2.5 px-2.5 sm:px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onEditPayment(cust, currentMonthKey)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer active:scale-95 shadow-xs"
                            title={lang === 'bn' ? 'পেমেন্টের টাকা, তারিখ বা মাধ্যম এডিট ও সংশোধন করুন' : 'Edit payment amount, date or method'}
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-600" />
                            <span>{lang === 'bn' ? 'এডিট' : 'Edit'}</span>
                          </button>
                        </td>

                        {/* 8. ডিলিট ও বাতিল বাটন (Delete / Revert to Unpaid if paid by mistake) */}
                        <td className="py-2.5 px-2.5 sm:px-4 text-center whitespace-nowrap">
                          {revertingCustomerId === cust.id ? (
                            <div className="flex items-center gap-1.5 justify-center bg-rose-50 p-1.5 rounded-xl border border-rose-300 shadow-md animate-in zoom-in-95">
                              <span className="text-[10px] text-rose-800 font-bold hidden sm:inline">{lang === 'bn' ? 'ভুলে পেট?' : 'Mistake?'}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  onRevertPayment(cust.id, currentMonthKey);
                                  setRevertingCustomerId(null);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] cursor-pointer shadow-xs active:scale-95"
                              >
                                {lang === 'bn' ? 'হ্যাঁ, ডিলিট করুন' : 'Yes, Revert'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setRevertingCustomerId(null)}
                                className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] cursor-pointer active:scale-95 font-semibold"
                              >
                                {lang === 'bn' ? 'না' : 'No'}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setRevertingCustomerId(cust.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer active:scale-95 shadow-xs"
                              title={lang === 'bn' ? 'ভুলে অন্য কাস্টমারের বিল পেট হয়ে থাকলে ডিলিট করে পূর্বাবস্থায় (বকেয়া) ফিরিয়ে নিন' : 'Revert accidental payment back to unpaid status'}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>{lang === 'bn' ? 'ডিলিট / বাতিল' : 'Revert'}</span>
                            </button>
                          )}
                        </td>

                        {/* 9. লেজার */}
                        <td className="py-2.5 px-2.5 sm:px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onViewLedger(cust)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition active:scale-95 cursor-pointer"
                            title={t.ledgerBtn}
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Clock className="w-8 h-8 text-amber-500" />
                        <h4 className="font-bold text-slate-900 text-sm">{lang === 'bn' ? 'চলতি মাসে এখনও কোনো পেইড বিল নেই' : 'No Paid Bills Yet This Month'}</h4>
                        <p className="text-xs text-slate-500">{lang === 'bn' ? 'গ্রাহক বিল পরিশোধ করলে এই তালিকায় জমা হবে।' : 'Customer payments will appear here.'}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
