import React from 'react';
import { X, Calendar, FileText, CheckCircle2, AlertCircle, CreditCard, Receipt } from 'lucide-react';
import { Customer, ISPSettings } from '../types/isp';
import { translations, formatCurrency, getMonthName } from '../i18n/translations';

interface CustomerLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  settings: ISPSettings;
  onPayMonth: (customer: Customer, monthKey: string) => void;
  onViewReceipt: (customer: Customer, monthKey: string) => void;
}

export const CustomerLedgerModal: React.FC<CustomerLedgerModalProps> = ({
  isOpen,
  onClose,
  customer,
  settings,
  onPayMonth,
  onViewReceipt
}) => {
  const lang = settings.language;
  const t = translations[lang];

  if (!isOpen || !customer) return null;

  const allMonths = [
    '2026-01', '2026-02', '2026-03', '2026-04',
    '2026-05', '2026-06', '2026-07', '2026-08',
    '2026-09', '2026-10', '2026-11', '2026-12'
  ];

  const connectionMonthKey = customer.connectionDate ? customer.connectionDate.substring(0, 7) : '2026-01';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {t.ledgerTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {customer.name} (PPPoE: <span className="text-cyan-300 font-mono font-bold">{customer.pppoeId}</span> • Pass: <span className="text-amber-300 font-mono font-bold">{customer.pppoePassword || '123456'}</span>)
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

        {/* Info strip */}
        <div className="my-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div>
            <span className="text-slate-400 block">{t.connectionDateLabel}</span>
            <span className="font-semibold text-slate-200">{customer.connectionDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.monthlyRateLabel}</span>
            <span className="font-bold text-white">{formatCurrency(customer.monthlyBill, lang)}/মাস</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.zoneLabel}</span>
            <span className="font-medium text-slate-300">{customer.zoneName}</span>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{t.monthCol}</th>
                <th className="py-2.5 px-3">{t.amountCol}</th>
                <th className="py-2.5 px-3">{t.statusCol}</th>
                <th className="py-2.5 px-3">{t.dateCol}</th>
                <th className="py-2.5 px-3 text-right">{t.actionCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {allMonths.map((mKey) => {
                const isPrior = mKey < connectionMonthKey;
                const bill = customer.bills?.[mKey];
                const isPaid = !!bill?.isPaid;
                const monthName = getMonthName(mKey, lang);

                return (
                  <tr key={mKey} className={`hover:bg-slate-800/40 transition ${isPaid ? 'bg-emerald-950/10' : ''}`}>
                    <td className="py-3 px-3 font-semibold text-white">
                      {monthName}
                    </td>

                    <td className="py-3 px-3">
                      {isPrior ? (
                        <span className="text-slate-500 italic">-</span>
                      ) : (
                        <span className="font-bold">{formatCurrency(customer.monthlyBill, lang)}</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {isPrior ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {t.beforeConnectionNote}
                        </span>
                      ) : isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          {t.statusPaid}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                          <AlertCircle className="w-3 h-3" />
                          {t.statusDue}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-400">
                      {isPaid && bill?.paidDate ? (
                        <span>
                          {bill.paidDate} <span className="text-slate-500">({bill.paymentMethod || 'Cash'})</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      {!isPrior && (
                        isPaid ? (
                          <button
                            onClick={() => onViewReceipt(customer, mKey)}
                            className="p-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600 hover:text-white transition cursor-pointer"
                            title={t.receiptBtn}
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onPayMonth(customer, mKey)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 transition cursor-pointer"
                          >
                            {t.payBillBtn}
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
