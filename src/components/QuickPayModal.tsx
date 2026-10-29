import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check, Receipt, CheckCircle, Calculator, RotateCcw } from 'lucide-react';
import { Customer, ISPSettings } from '../types/isp';
import { translations, formatCurrency, getMonthName } from '../i18n/translations';
import { generateReceiptNumber } from '../utils/storage';
import { getCustomerCurrentMonthStatus, getCustomerPastDues } from '../utils/billingCalculations';

interface QuickPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  monthKey: string;
  settings: ISPSettings;
  onConfirmPayment: (
    customerId: string,
    monthKey: string,
    paidAmount: number,
    discount: number,
    paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other',
    transactionId?: string,
    note?: string,
    receiptNumber?: string,
    paidDate?: string
  ) => void;
}

export const QuickPayModal: React.FC<QuickPayModalProps> = ({
  isOpen,
  onClose,
  customer,
  monthKey,
  settings,
  onConfirmPayment
}) => {
  const lang = settings.language;
  const t = translations[lang];

  if (!isOpen || !customer) return null;

  // 1. Calculate Previous Due (বকেয়া) and Current Running Bill (রানিং মাস)
  const { currentMonthDue } = getCustomerCurrentMonthStatus(customer, monthKey);
  const { totalPastDue, pastDueList } = getCustomerPastDues(customer, monthKey, lang);

  const pastDueAmount = totalPastDue;
  const runningMonthBill = currentMonthDue;
  const totalCombinedDue = pastDueAmount + runningMonthBill;

  const todayStr = new Date().toISOString().slice(0, 10);

  // 2. Allow user to freely clear and type any amount
  const [paidAmountStr, setPaidAmountStr] = useState<string>(String(totalCombinedDue));
  const [discountStr, setDiscountStr] = useState<string>('0');
  const [paidDate, setPaidDate] = useState<string>(todayStr);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other'>('Cash');
  const [transactionId, setTransactionId] = useState<string>('');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    setPaidAmountStr(String(totalCombinedDue));
    setDiscountStr('0');
    setPaidDate(new Date().toISOString().slice(0, 10));
    setTransactionId('');
    setNote('');
  }, [customer.id, monthKey, totalCombinedDue]);

  const monthName = getMonthName(monthKey, lang);

  const numPaid = paidAmountStr === '' ? 0 : Number(paidAmountStr);
  const numDisc = discountStr === '' ? 0 : Number(discountStr);
  const remainingAfterPayment = Math.max(0, totalCombinedDue - numPaid - numDisc);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const receiptNum = generateReceiptNumber(monthKey, customer.id);

    // Save payment record in app state & local storage
    onConfirmPayment(
      customer.id,
      monthKey,
      numPaid,
      numDisc,
      paymentMethod,
      transactionId.trim() || undefined,
      note.trim() || undefined,
      receiptNum,
      paidDate || todayStr
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'bn' ? 'বিল আদায় ও পেমেন্ট রিসিভ' : t.quickPayTitle}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {customer.name} • {monthName} ({customer.pppoeId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Summary Box */}
        <div className="my-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block text-[11px] font-semibold">{t.pppoeIdLabel}</span>
            <span className="font-mono font-bold text-blue-700">{customer.pppoeId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-semibold">{t.monthlyRateLabel}</span>
            <span className="font-black text-slate-900">{formatCurrency(customer.monthlyBill, lang)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px] font-semibold">{t.zoneLabel}</span>
            <span className="font-bold text-slate-700">{customer.zoneName}</span>
          </div>
        </div>

        {/* Combined Due Breakdown */}
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'bn' ? 'বকেয়া ও রানিং বিলের হিসাব:' : 'Bill Breakdown:'}</span>
            </span>
            {pastDueList.length > 0 && (
              <span className="text-[10px] text-slate-500 font-medium">
                {lang === 'bn' ? `(বিগত ${pastDueList.length} মাসের বকেয়া)` : `(${pastDueList.length} past months)`}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* বকেয়া বিল */}
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block mb-0.5 font-semibold">বকেয়া বিল</span>
              <span className="text-xs sm:text-sm font-black text-rose-600 font-mono">
                {formatCurrency(pastDueAmount, lang)}
              </span>
            </div>

            {/* রানিং মাসের বিল */}
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block mb-0.5 font-semibold">রানিং মাসের বিল</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 font-mono">
                {formatCurrency(runningMonthBill, lang)}
              </span>
            </div>

            {/* বকেয়া ও রানিং একসাথে এড করা মোট বিল */}
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
              <span className="text-[10px] text-emerald-800 block mb-0.5 font-bold">সর্বমোট প্রদেয়</span>
              <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
                {formatCurrency(totalCombinedDue, lang)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Amount Input with quick presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>{lang === 'bn' ? 'আদায়কৃত টাকা (গ্রাহক যা দিবে লিখুন):' : t.payAmountLabel}</span>
              </label>
              <button
                type="button"
                onClick={() => setPaidAmountStr('')}
                className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition font-bold"
                title="মুছে নতুন সংখ্যা বসান"
              >
                <RotateCcw className="w-3 h-3" />
                <span>মুছুন</span>
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base">
                ৳
              </span>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={paidAmountStr}
                onChange={(e) => setPaidAmountStr(e.target.value)}
                placeholder={lang === 'bn' ? 'টাকার পরিমাণ লিখুন...' : 'Enter amount...'}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 text-slate-900 font-black text-lg focus:bg-white focus:border-emerald-600 focus:outline-none tracking-wide"
                autoFocus
              />
            </div>

            {/* Quick Fill Buttons for Quick Selection */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setPaidAmountStr(String(totalCombinedDue))}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
              >
                {lang === 'bn' ? `সর্বমোট: ৳${totalCombinedDue}` : `Total: ৳${totalCombinedDue}`}
              </button>

              {pastDueAmount > 0 && (
                <button
                  type="button"
                  onClick={() => setPaidAmountStr(String(pastDueAmount))}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
                >
                  {lang === 'bn' ? `শুধু বকেয়া: ৳${pastDueAmount}` : `Only Arrears: ৳${pastDueAmount}`}
                </button>
              )}

              {runningMonthBill > 0 && (
                <button
                  type="button"
                  onClick={() => setPaidAmountStr(String(runningMonthBill))}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
                >
                  {lang === 'bn' ? `শুধু রানিং: ৳${runningMonthBill}` : `Only Current: ৳${runningMonthBill}`}
                </button>
              )}
            </div>

            {/* Real-time Calculation Indicator */}
            <div className="mt-2 text-xs">
              {numPaid === totalCombinedDue && (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {lang === 'bn' 
                      ? 'সম্পূর্ণ বিল (বকেয়া ও চলতি মাস) একসাথে পরিশোধ হবে।' 
                      : 'Full bill (Arrears & Current Month) will be cleared.'}
                  </span>
                </span>
              )}
              {numPaid > 0 && numPaid < totalCombinedDue && (
                <span className="text-amber-700 font-semibold">
                  {lang === 'bn' 
                    ? `* আংশিক আদায়। অবশিষ্ট বকেয়া থাকবে: ৳${remainingAfterPayment}` 
                    : `* Partial payment. Remaining due: ৳${remainingAfterPayment}`}
                </span>
              )}
              {numPaid > totalCombinedDue && (
                <span className="text-blue-700 font-semibold">
                  {lang === 'bn' 
                    ? `* অতিরিক্ত / অগ্রিম আদায়: ৳${numPaid - totalCombinedDue}` 
                    : `* Overpayment / Advance: ৳${numPaid - totalCombinedDue}`}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Payment Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'বিল পরিশোধের তারিখ:' : 'Payment Date:'}
              </label>
              <input
                type="date"
                required
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.discountLabel}
              </label>
              <input
                type="number"
                min="0"
                value={discountStr}
                onChange={(e) => setDiscountStr(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-sm focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.payMethodLabel}
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['Cash', 'bKash', 'Nagad'] as const).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                      paymentMethod === method
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>
                      {method === 'Cash' 
                        ? (lang === 'bn' ? 'ক্যাশ' : 'Cash') 
                        : method === 'bKash' 
                          ? (lang === 'bn' ? 'বিকাশ' : 'bKash') 
                          : (lang === 'bn' ? 'নগদ' : 'Nagad')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction ID (if mobile banking) */}
          {(paymentMethod === 'bKash' || paymentMethod === 'Nagad' || paymentMethod === 'Bank') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.trxIdLabel}
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder={t.trxIdPlaceholder}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none font-mono"
              />
            </div>
          )}

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.noteLabel}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={lang === 'bn' ? 'যেমন: সম্পূর্ণ বা আংশিক পরিশোধ' : 'e.g. Full or partial payment'}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* In-app Instant Receipt & Auto-SMS Notice */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-left">
              <span className="text-[11px] text-emerald-800 font-bold block">
                {lang === 'bn' ? 'স্বয়ংক্রিয় SMS ও WhatsApp রসিদ' : 'Automated SMS & WhatsApp Notification'}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                {lang === 'bn' 
                  ? 'পেমেন্ট গ্রহণের পর কত টাকা পেড হলো ও কত টাকা বকেয়া আছে তা স্বয়ংক্রিয়ভাবে পাঠানো হবে।' 
                  : 'Customer receives automated notification showing amount paid and remaining dues.'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 text-xs font-bold transition cursor-pointer border border-slate-200"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>{lang === 'bn' ? '✅ পেমেন্ট সম্পন্ন করুন' : t.confirmPayBtn}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
