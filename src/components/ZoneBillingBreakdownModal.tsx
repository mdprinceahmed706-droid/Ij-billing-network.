import React from 'react';
import { X, MapPin, Users, CheckCircle, Clock } from 'lucide-react';
import { Customer, Zone, Language } from '../types/isp';
import { translations, formatCurrency, formatNumber } from '../i18n/translations';
import { getCustomerCurrentMonthStatus, getCustomerPastDues } from '../utils/billingCalculations';

interface ZoneBillingBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: Zone[];
  customers: Customer[];
  currentMonthKey: string;
  lang: Language;
  onSelectZoneCustomers: (zoneId: string) => void;
}

export const ZoneBillingBreakdownModal: React.FC<ZoneBillingBreakdownModalProps> = ({
  isOpen,
  onClose,
  zones,
  customers,
  currentMonthKey,
  lang,
  onSelectZoneCustomers
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'এলাকাভিত্তিক জোন বিলের হিসাব' : 'Zone-wise Billing Breakdown'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'কোন এলাকায় কত টাকা বিল, আদায় ও বকেয়ার সম্পূর্ণ হিসাব' : 'Complete billed, collected, and due amounts per zone'}
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

        {/* Scrollable Zones Grid */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {zones.map((zone) => {
              const zoneCustomers = customers.filter(c => c.zoneId === zone.id && c.status === 'active');
              let zoneTotalBill = 0;
              let zoneCollected = 0;
              let zoneDue = 0;
              let dueCount = 0;

              for (const cust of zoneCustomers) {
                zoneTotalBill += cust.monthlyBill;
                const { isPaid, paidAmount, currentMonthDue } = getCustomerCurrentMonthStatus(cust, currentMonthKey);
                const { totalPastDue } = getCustomerPastDues(cust, currentMonthKey, lang);

                if (isPaid) {
                  zoneCollected += paidAmount || cust.monthlyBill;
                } else {
                  zoneDue += currentMonthDue;
                  dueCount++;
                }
                zoneDue += totalPastDue;
              }

              const percent = zoneTotalBill > 0 ? Math.round((zoneCollected / zoneTotalBill) * 100) : 0;

              return (
                <div 
                  key={zone.id}
                  onClick={() => {
                    onSelectZoneCustomers(zone.id);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 transition cursor-pointer group shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition">
                        {zone.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-700">
                        {zone.boxNumber || zone.code || 'ZONE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatNumber(zoneCustomers.length, lang)} {t.customerCountLabel}</span>
                      {dueCount > 0 && (
                        <span className="text-amber-400 font-bold ml-1">
                          ({formatNumber(dueCount, lang)} {lang === 'bn' ? 'বকেয়া' : 'due'})
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{lang === 'bn' ? 'মোট বিল:' : 'Total Bill:'}</span>
                        <span className="font-bold text-white">{formatCurrency(zoneTotalBill, lang)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-400">{lang === 'bn' ? 'আদায়কৃত:' : 'Collected:'}</span>
                        <span className="font-bold text-emerald-400">{formatCurrency(zoneCollected, lang)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-rose-400">{lang === 'bn' ? 'বকেয়া বিল:' : 'Due Bill:'}</span>
                        <span className="font-extrabold text-rose-400">{formatCurrency(zoneDue, lang)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>{lang === 'bn' ? 'আদায়ের অগ্রগতি' : 'Collection Rate'}</span>
                      <span className="font-bold text-cyan-300">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>

                    <div className="mt-2 text-right">
                      <span className="text-[11px] text-cyan-400 group-hover:underline font-semibold">
                        {lang === 'bn' ? 'এই জোনের কাস্টমার দেখুন →' : 'View Zone Customers →'}
                      </span>
                    </div>
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
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            {t.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
