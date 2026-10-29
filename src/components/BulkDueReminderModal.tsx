import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, Phone, AlertCircle } from 'lucide-react';
import { Customer, ISPSettings } from '../types/isp';
import { translations, formatCurrency, getMonthName } from '../i18n/translations';
import { getCustomerCurrentMonthStatus, getCustomerPastDues } from '../utils/billingCalculations';

interface BulkDueReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  currentMonthKey: string;
  settings: ISPSettings;
}

export const BulkDueReminderModal: React.FC<BulkDueReminderModalProps> = ({
  isOpen,
  onClose,
  customers,
  currentMonthKey,
  settings
}) => {
  const lang = settings.language;
  const t = translations[lang];

  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const monthName = getMonthName(currentMonthKey, lang);

  // Filter only due customers
  const dueCustomers = customers.filter(c => {
    if (c.status !== 'active') return false;
    const { isPaid } = getCustomerCurrentMonthStatus(c, currentMonthKey);
    const { totalPastDue } = getCustomerPastDues(c, currentMonthKey, lang);
    return !isPaid || totalPastDue > 0;
  });

  const totalDueSum = dueCustomers.reduce((sum, c) => {
    const { currentMonthDue } = getCustomerCurrentMonthStatus(c, currentMonthKey);
    const { totalPastDue } = getCustomerPastDues(c, currentMonthKey, lang);
    return sum + currentMonthDue + totalPastDue;
  }, 0);

  // Comma-separated phone numbers
  const phoneList = dueCustomers.map(c => c.phone.trim()).filter(Boolean);
  const phoneNumbersString = phoneList.join(',');

  // Default broadcast message
  const broadcastMessage = lang === 'bn'
    ? `সম্মানিত গ্রাহক, আইজে নেটওয়ার্ক (${settings.companyNameBn}) থেকে আপনার বকেয়া ইন্টারনেট বিল পরিশোধের জন্য অনুরোধ করা যাচ্ছে। বিকাশ/নগদ: ০১৪০২-১৮০ ৭৫৭। হেল্পলাইন: ০১৪০২-১৮০ ৭৫৭। ধন্যবাদ।`
    : `Dear subscriber, please pay your pending internet bill for ${settings.companyNameEn}. Payment via bKash/Nagad: 01402-180757. Helpline: 01402-180757. Thank you.`;

  const handleCopyNumbers = () => {
    navigator.clipboard.writeText(phoneNumbersString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenSmsApp = () => {
    const smsUrl = `sms:${phoneNumbersString}?body=${encodeURIComponent(broadcastMessage)}`;
    window.location.href = smsUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {t.bulkReminderTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.totalDueCustomers} <span className="font-bold text-rose-400">{dueCustomers.length} জন</span> • {t.totalDueSum} <span className="font-bold text-white">{formatCurrency(totalDueSum, lang)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SMS Action Bar */}
        <div className="my-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shrink-0">
          <div className="text-xs font-semibold text-slate-300">
            {t.smsDraftTitle}
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 italic">
            "{broadcastMessage}"
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleCopyNumbers}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copied ? 'নম্বরগুলো কপি হয়েছে!' : t.copyNumbersBtn}</span>
            </button>

            <button
              onClick={handleOpenSmsApp}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-950/40 active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{t.openSmsAppBtn}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Individual List */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 text-xs">
          <div className="p-2 bg-slate-950 text-slate-400 font-semibold sticky top-0 border-b border-slate-800">
            {t.whatsappReminderNote}
          </div>

          <div className="divide-y divide-slate-800">
            {dueCustomers.map((cust) => {
              const { currentMonthDue } = getCustomerCurrentMonthStatus(cust, currentMonthKey);
              const { totalPastDue } = getCustomerPastDues(cust, currentMonthKey, lang);
              const totalCustDue = currentMonthDue + totalPastDue;

              const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
              const waPhone = cleanPhone.startsWith('88') ? cleanPhone : (cleanPhone.startsWith('0') ? `88${cleanPhone}` : `880${cleanPhone}`);
              const waText = encodeURIComponent(
                `সম্মানিত ${cust.name} (PPPoE: ${cust.pppoeId}), আপনার ${monthName} মাসের বকেয়া ইন্টারনেট বিল ৳${totalCustDue}/- অনুগ্রহ করে বিকাশ/নগদ: ${settings.bkashNumber} এ পাঠিয়ে দিন। ধন্যবাদ, ${settings.companyNameBn}।`
              );

              return (
                <div key={cust.id} className="p-3 flex items-center justify-between hover:bg-slate-800/50 transition">
                  <div>
                    <div className="font-bold text-white text-sm">
                      {cust.name}
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      PPPoE: {cust.pppoeId} • {cust.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-rose-400 text-sm">
                      {formatCurrency(totalCustDue, lang)}
                    </span>
                    <a
                      href={`https://wa.me/${waPhone}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            {t.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
