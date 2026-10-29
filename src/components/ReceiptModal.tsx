import React from 'react';
import { X, Printer, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { Customer, ISPSettings } from '../types/isp';
import { translations, formatCurrency, getMonthName } from '../i18n/translations';
import { IJLogo } from './IJLogo';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  monthKey: string;
  settings: ISPSettings;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  customer,
  monthKey,
  settings
}) => {
  const lang = settings.language;
  const t = translations[lang];

  if (!isOpen || !customer) return null;

  const bill = customer.bills?.[monthKey];
  const receiptNo = bill?.receiptNumber || `IJ-${monthKey.replace('-', '')}-${customer.id.slice(-4)}`;
  const paidDate = bill?.paidDate || new Date().toISOString().slice(0, 10);
  const paidAmount = bill?.paidAmount || customer.monthlyBill;
  const monthName = getMonthName(monthKey, lang);

  const handlePrint = () => {
    window.print();
  };

  const company = lang === 'bn' ? settings.companyNameBn : settings.companyNameEn;
  const helpline = settings.phone || '01402-180757';
  const rawPhone = customer.phone?.replace(/[^0-9]/g, '') || '';
  const cleanPhone = rawPhone.startsWith('88') ? rawPhone : (rawPhone.startsWith('0') ? `88${rawPhone}` : `880${rawPhone}`);
  
  const receiptText = lang === 'bn' 
    ? `🧾 *${company} - মানি রিসিট*\nরিসিট নং: ${receiptNo}\nগ্রাহক: ${customer.name}\nপিপিও আইডি: ${customer.pppoeId}\nবিলিং মাস: ${monthName}\nপরিশোধিত টাকা: ৳${paidAmount}/-\nমাধ্যম: ${bill?.paymentMethod || 'Cash'}\nতারিখ: ${paidDate}\n\nআপনার পেমেন্ট সফলভাবে গৃহীত হয়েছে। ধন্যবাদ!\nহেল্পলাইন: ${helpline}`
    : `🧾 *${company} - Payment Receipt*\nReceipt No: ${receiptNo}\nCustomer: ${customer.name}\nPPPoE ID: ${customer.pppoeId}\nBilling Month: ${monthName}\nAmount Paid: ৳${paidAmount}/-\nMethod: ${bill?.paymentMethod || 'Cash'}\nDate: ${paidDate}\n\nThank you for your payment!\nHelpline: ${helpline}`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(receiptText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 print:p-0 print:static">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs print:hidden" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 print:border-none print:shadow-none print:w-full print:max-w-full print:bg-white print:text-black text-slate-800">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {t.receiptTitle}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Voucher Container */}
        <div className="my-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 print:bg-white print:text-black print:border-slate-300 shadow-xs">
          
          {/* Receipt Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:border-slate-300">
            <div className="flex items-center gap-3">
              <IJLogo size="sm" showGlow={false} />
              <div>
                <h4 className="font-black text-base sm:text-lg text-slate-900 print:text-black tracking-tight">
                  {lang === 'bn' ? settings.companyNameBn : settings.companyNameEn}
                </h4>
                <p className="text-[10px] text-blue-600 print:text-slate-600 font-bold tracking-wide uppercase">
                  {lang === 'bn' ? (settings.taglineBn || 'হাই স্পিড ব্রডব্যান্ড ইন্টারনেট') : settings.taglineEn}
                </p>
                <p className="text-[10px] text-slate-500 print:text-slate-600 font-medium">
                  {settings.addressBn} • হেল্পলাইন: {settings.phone}
                </p>
                {settings.btrcRegNo && (
                  <p className="text-[9px] text-slate-400 print:text-slate-500 font-mono">
                    লাইসেন্স / রেজি: {settings.btrcRegNo}
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 print:border print:border-emerald-600 text-[10px] font-bold block mb-1">
                {lang === 'bn' ? 'পরিশোধিত ✓' : 'PAID'}
              </span>
              <span className="font-mono text-[10px] text-slate-500 print:text-slate-600 block">
                {receiptNo}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="py-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200 print:border-slate-200">
              <span className="text-slate-500 print:text-slate-600 font-medium">{t.receivedFrom}</span>
              <span className="font-bold text-slate-900 print:text-black">{customer.name}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 print:border-slate-200">
              <span className="text-slate-500 print:text-slate-600 font-medium">{t.pppoeIdLabel}</span>
              <span className="font-mono font-bold text-blue-700 print:text-slate-900">{customer.pppoeId}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 print:border-slate-200">
              <span className="text-slate-500 print:text-slate-600 font-medium">{t.phoneLabel}</span>
              <span className="font-semibold text-slate-800 print:text-black">{customer.phone}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 print:border-slate-200">
              <span className="text-slate-500 print:text-slate-600 font-medium">{t.zoneLabel}</span>
              <span className="font-semibold text-slate-800 print:text-black">{customer.zoneName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 print:border-slate-200">
              <span className="text-slate-500 print:text-slate-600 font-medium">{t.billingMonth}</span>
              <span className="font-bold text-blue-700 print:text-slate-900">{monthName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 print:border-slate-200">
              <span className="text-slate-500 print:text-slate-600 font-medium">{t.paymentDate}</span>
              <span className="text-slate-800 print:text-black">{paidDate}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 print:border-slate-200">
              <span className="text-slate-500 print:text-slate-600 font-medium">{t.payMethodLabel}</span>
              <span className="font-bold text-slate-800 print:text-black">
                {bill?.paymentMethod || 'Cash'}
                {bill?.transactionId ? ` (Trx: ${bill.transactionId})` : ''}
              </span>
            </div>

            {/* Total Paid Highlighting */}
            <div className="pt-2 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-700 print:text-black">{t.receivedAmount}</span>
              <span className="text-lg font-black text-emerald-600 print:text-black">
                {formatCurrency(paidAmount, lang)}
              </span>
            </div>

            {/* Billing Pad Terms & Notice */}
            {settings.padTermsBn && (
              <div className="pt-2 text-[10px] text-slate-500 print:text-slate-600 italic border-t border-slate-200 print:border-slate-200">
                * {settings.padTermsBn}
              </div>
            )}
          </div>

          {/* Footer Dual Signatures: Customer & Cashier */}
          <div className="pt-5 mt-2 border-t border-dashed border-slate-300 print:border-slate-300 flex justify-between items-end text-[10px] text-slate-500 print:text-slate-600">
            <div className="text-left">
              <div className="w-24 border-b border-slate-400 print:border-black mb-1" />
              <p>{lang === 'bn' ? 'গ্রাহকের স্বাক্ষর' : 'Customer Sign'}</p>
            </div>
            
            <div className="text-center hidden sm:block">
              <p className="flex items-center gap-1 font-bold text-emerald-700 print:text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.customerCopy}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                IJ Network ISP System
              </p>
            </div>

            <div className="text-right">
              <div className="w-28 border-b border-slate-400 print:border-black mb-1 ml-auto" />
              <p className="font-semibold text-slate-700">{settings.cashierName || t.authorizedSign}</p>
            </div>
          </div>

        </div>

        {/* Action Buttons (Print / Share) */}
        <div className="pt-2 flex items-center justify-between gap-2 print:hidden">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-center"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.shareWhatsappReceiptBtn}</span>
          </a>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printReceiptBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
