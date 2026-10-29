import React from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Customer, Language } from '../types/isp';
import { translations, formatCurrency } from '../i18n/translations';

interface PaymentMethodSummaryProps {
  customers: Customer[];
  currentMonthKey: string;
  lang: Language;
}

export const PaymentMethodSummary: React.FC<PaymentMethodSummaryProps> = ({
  customers,
  currentMonthKey,
  lang
}) => {
  let cashTotal = 0;
  let bkashTotal = 0;
  let nagadTotal = 0;
  let otherTotal = 0;

  for (const c of customers) {
    const bill = c.bills?.[currentMonthKey];
    if (bill && bill.isPaid) {
      const amount = bill.paidAmount || c.monthlyBill;
      if (bill.paymentMethod === 'Cash' || !bill.paymentMethod) {
        cashTotal += amount;
      } else if (bill.paymentMethod === 'bKash') {
        bkashTotal += amount;
      } else if (bill.paymentMethod === 'Nagad') {
        nagadTotal += amount;
      } else {
        otherTotal += amount;
      }
    }
  }

  const grandTotal = cashTotal + bkashTotal + nagadTotal + otherTotal;

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              {lang === 'bn' ? 'পেমেন্ট মাধ্যম অনুযায়ী আদায়কৃত হিসাব' : 'Collection by Payment Method'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {lang === 'bn' ? 'ক্যাশ, বিকাশ ও নগদে কত টাকা জমা হয়েছে' : 'Breakdown of payments received via Cash, bKash & Nagad'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            {lang === 'bn' ? 'মোট আদায়' : 'Total Collected'}
          </span>
          <span className="text-sm sm:text-base font-black text-emerald-600">
            {formatCurrency(grandTotal, lang)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Cash */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block">{lang === 'bn' ? 'ক্যাশ (নগদ টাকা)' : 'Cash'}</span>
              <span className="text-base font-extrabold text-slate-900">{formatCurrency(cashTotal, lang)}</span>
            </div>
          </div>
        </div>

        {/* bKash */}
        <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pink-100 text-pink-700">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-pink-700 font-semibold block">বিকাশ (bKash)</span>
              <span className="text-base font-extrabold text-pink-900">{formatCurrency(bkashTotal, lang)}</span>
            </div>
          </div>
        </div>

        {/* Nagad */}
        <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-700">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-orange-700 font-semibold block">নগদ (Nagad)</span>
              <span className="text-base font-extrabold text-orange-900">{formatCurrency(nagadTotal, lang)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
