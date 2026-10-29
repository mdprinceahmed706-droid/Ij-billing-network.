import React, { useState } from 'react';
import { X, Check, Trash2, Calendar, CreditCard, Tag, FileText, AlertTriangle, RotateCcw } from 'lucide-react';
import { Customer, ISPSettings } from '../types/isp';
import { translations, formatCurrency, getMonthName } from '../i18n/translations';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  monthKey: string;
  settings: ISPSettings;
  onSavePayment: (
    customerId: string,
    monthKey: string,
    paidAmount: number,
    discount: number,
    paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other',
    paidDate: string,
    transactionId?: string,
    note?: string
  ) => void;
  onRevertPayment: (customerId: string, monthKey: string) => void;
}

export const EditPaymentModal: React.FC<EditPaymentModalProps> = ({
  isOpen,
  onClose,
  customer,
  monthKey,
  settings,
  onSavePayment,
  onRevertPayment
}) => {
  if (!isOpen || !customer) return null;

  const lang = settings.language;
  const t = translations[lang];
  const monthName = getMonthName(monthKey, lang);
  const existingBill = customer.bills?.[monthKey];

  const [paidAmount, setPaidAmount] = useState<string>(
    existingBill?.paidAmount !== undefined ? String(existingBill.paidAmount) : String(customer.monthlyBill)
  );
  const [discount, setDiscount] = useState<string>(
    existingBill?.discount !== undefined ? String(existingBill.discount) : '0'
  );
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other'>(
    existingBill?.paymentMethod || 'Cash'
  );
  const [paidDate, setPaidDate] = useState<string>(
    existingBill?.paidDate || new Date().toISOString().slice(0, 10)
  );
  const [transactionId, setTransactionId] = useState<string>(existingBill?.transactionId || '');
  const [note, setNote] = useState<string>(existingBill?.note || '');
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);

  const numPaid = Number(paidAmount) || 0;
  const numDisc = Number(discount) || 0;
  const remainingDue = Math.max(0, customer.monthlyBill - numPaid - numDisc);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePayment(
      customer.id,
      monthKey,
      numPaid,
      numDisc,
      paymentMethod,
      paidDate,
      transactionId.trim() || undefined,
      note.trim() || undefined
    );
    onClose();
  };

  const handleConfirmRevert = () => {
    onRevertPayment(customer.id, monthKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'পেমেন্ট এডিট ও সংশোধন' : 'Edit & Modify Payment'}
              </h3>
              <p className="text-xs text-slate-400">
                {customer.name} • {monthName} ({customer.pppoeId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Revert Confirmation Banner */}
        {showRevertConfirm ? (
          <div className="my-4 p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-300">
                  {lang === 'bn' ? 'বিল পরিশোধ বাতিল করে আনপেইড করবেন?' : 'Cancel Payment & Revert to Unpaid?'}
                </h4>
                <p className="text-xs text-rose-200/80 mt-1">
                  {lang === 'bn' 
                    ? 'এই বিলটি ভুলবশত পেইড হয়ে থাকলে বাতিল করুন। কাস্টমারের বিলটি পুনরায় বকেয়া অবস্থায় ফিরে আসবে।' 
                    : 'If this was paid mistakenly, revert it. The customer will return to the unpaid due list.'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-500/30">
              <button
                type="button"
                onClick={() => setShowRevertConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                {lang === 'bn' ? 'না, ফেরত যান' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmRevert}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'হ্যাঁ, বাতিল ও আনপেইড করুন' : 'Yes, Revert to Unpaid'}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-4">
            
            {/* Customer Rate Summary */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">{t.monthlyRateLabel}</span>
                <span className="font-extrabold text-white text-sm">{formatCurrency(customer.monthlyBill, lang)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{lang === 'bn' ? 'বর্তমান পরিশোধ' : 'Paid Amount'}</span>
                <span className="font-extrabold text-emerald-400 text-sm">{formatCurrency(numPaid, lang)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{lang === 'bn' ? 'বকেয়া থাকবে' : 'Remaining Due'}</span>
                <span className={`font-extrabold text-sm ${remainingDue > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                  {formatCurrency(remainingDue, lang)}
                </span>
              </div>
            </div>

            {/* Inputs: Paid Amount & Discount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'পরিশোধিত টাকা (৳)' : 'Paid Amount (৳)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={customer.monthlyBill}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'ছাড় / ডিসকাউন্ট (৳)' : 'Discount (৳)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method & Paid Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.payMethodLabel}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-semibold text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                >
                  <option value="Cash">{t.cash}</option>
                  <option value="bKash">{t.bkash}</option>
                  <option value="Nagad">{t.nagad}</option>
                  <option value="Bank">{t.bank}</option>
                  <option value="Other">{t.other}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'পরিশোধের তারিখ' : 'Payment Date'}
                </label>
                <input
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:border-cyan-500 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Transaction ID & Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.trxIdLabel}
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: TRXZ98234' : 'e.g. TRXZ98234'}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.noteLabel}
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={lang === 'bn' ? 'মন্তব্য লিখুন...' : 'Add a note...'}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Bottom Controls: Save vs Revert to Unpaid */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              
              {/* Revert / Delete Payment Button */}
              <button
                type="button"
                onClick={() => setShowRevertConfirm(true)}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title={lang === 'bn' ? 'ভুলবশত পেট হওয়া বিল বাতিল করে পুনরায় বকেয়া অবস্থায় ফিরিয়ে নিন' : 'Revert accidental payment back to due status'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'বিল বাতিল / আনপেইড করুন' : 'Revert to Unpaid'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition cursor-pointer"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/50 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}</span>
                </button>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
