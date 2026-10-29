import React, { useState } from 'react';
import { 
  Phone, 
  Receipt, 
  FileText, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Edit,
  Clock,
  Wifi,
  UserX,
  RotateCcw
} from 'lucide-react';
import { Customer, ISPSettings } from '../types/isp';
import { translations, formatCurrency, getMonthName } from '../i18n/translations';
import { getCustomerCurrentMonthStatus, getCustomerPastDues } from '../utils/billingCalculations';
import { WhatsAppIcon } from './BillCollectionTable';

interface CustomerCardProps {
  customer: Customer;
  index?: number;
  currentMonthKey: string;
  settings: ISPSettings;
  onPayBill: (customer: Customer, monthKey: string) => void;
  onViewReceipt: (customer: Customer, monthKey: string) => void;
  onViewLedger: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeactivateCustomer?: (customer: Customer) => void;
  onReactivateCustomer?: (customer: Customer) => void;
  onToggleStatus?: (customerId: string) => void;
  onUpdateSettings?: (newSettings: ISPSettings) => void;
  onShowToast?: (message: string, type?: 'success' | 'revert' | 'edit' | 'status') => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  currentMonthKey,
  settings,
  onPayBill,
  onViewReceipt,
  onViewLedger,
  onDeleteCustomer,
  onEditCustomer,
  onDeactivateCustomer,
  onReactivateCustomer,
  onToggleStatus,
  onUpdateSettings,
  onShowToast
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const lang = settings.language;
  const t = translations[lang];

  const { isPaid, paidAmount, currentMonthDue, isPendingCycle } = getCustomerCurrentMonthStatus(customer, currentMonthKey);
  const { pastDueList, totalPastDue } = getCustomerPastDues(customer, currentMonthKey, lang);

  // Total payable right now = remaining current month due + previous arrears
  const totalOutstandingNow = currentMonthDue + totalPastDue;
  const isTrulyFullyPaid = !isPendingCycle && currentMonthDue === 0 && totalPastDue === 0;

  // Helpline phone
  const helplinePhone = settings.phone || '01402-180757';

  // Dedicated WhatsApp link generator
  const createWhatsAppLink = () => {
    const raw = customer.phone.replace(/[^0-9]/g, '');
    let cleanPhone = raw;
    if (raw.startsWith('0')) cleanPhone = `880${raw.slice(1)}`;
    else if (!raw.startsWith('88')) cleanPhone = `880${raw}`;

    const monthName = getMonthName(currentMonthKey, lang);
    const company = lang === 'bn' ? settings.companyNameBn : settings.companyNameEn;

    let msg = '';
    if (isTrulyFullyPaid) {
      msg = `সম্মানিত ${customer.name},\nধন্যবাদ! ${company}-এ ${monthName} মাসের আপনার ইন্টারনেট বিল পরিশোধ সফল হয়েছে।\nরসিদ দেখতে যোগাযোগ করুন।\nহেল্পলাইন: ${helplinePhone}`;
    } else {
      msg = `সম্মানিত ${customer.name},\n${company}-এ ${monthName} মাসের আপনার ইন্টারনেট বিল বাবদ ৳${totalOutstandingNow}/- বকেয়া রয়েছে।\nসংযোগ সচল রাখতে অনুগ্রহ করে দ্রুত পরিশোধ করুন।\nবিকাশ/নগদ: ${settings.bkashNumber || helplinePhone}\nহেল্পলাইন: ${helplinePhone}`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const isDeactive = customer.status !== 'active';

  return (
    <tr className={`border-b border-slate-100 transition-colors duration-150 hover:bg-blue-50/40 text-xs ${
      isDeactive
        ? 'bg-slate-50/70 text-slate-500' 
        : isTrulyFullyPaid 
          ? 'bg-emerald-50/20' 
          : 'bg-white'
    }`}>
      
      {/* 1. Actions: Edit, Deactivate / Reactivate, Delete */}
      <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          {/* Edit Button (Green) */}
          <button
            onClick={() => onEditCustomer(customer)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs"
            title={lang === 'bn' ? 'গ্রাহকের তথ্য এডিট করুন' : 'Edit customer info'}
          >
            <Edit className="w-3.5 h-3.5 text-emerald-600" />
          </button>

          {/* Deactivate / Reactivate Button */}
          {isDeactive ? (
            <button
              onClick={() => onReactivateCustomer && onReactivateCustomer(customer)}
              className="px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-xs text-[11px] font-bold"
              title={lang === 'bn' ? 'গ্রাহককে পুনরায় সক্রিয় করুন (আজকের তারিখ থেকে বিল শুরু হবে)' : 'Reactivate customer'}
            >
              <RotateCcw className="w-3 h-3 text-white" />
              <span>{lang === 'bn' ? 'সক্রিয়' : 'Active'}</span>
            </button>
          ) : (
            <button
              onClick={() => onDeactivateCustomer && onDeactivateCustomer(customer)}
              className="px-2 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-xs text-[11px] font-bold"
              title={lang === 'bn' ? 'কাস্টমার ডিঅ্যাক্টিভ করুন (বিল কালেকশন থেকে সরিয়ে ডিঅ্যাক্টিভ অপশনে নেওয়া হবে)' : 'Deactivate customer'}
            >
              <UserX className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'bn' ? 'ডিঅ্যাক্টিভ' : 'Deactive'}</span>
            </button>
          )}

          {/* Delete Button (Red) */}
          <button
            onClick={() => onDeleteCustomer(customer)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs"
            title={lang === 'bn' ? 'গ্রাহক মুছে ফেলুন' : 'Delete customer'}
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          </button>
        </div>
      </td>

      {/* 2. Message Options: Dedicated WhatsApp Option (SMS is restricted to Bill Collection only) */}
      <td className="py-2.5 px-2 text-center whitespace-nowrap">
        <div className="flex items-center justify-center">
          <a
            href={createWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition active:scale-95 shadow-2xs"
            title={lang === 'bn' ? 'WhatsApp এ তাগাদা / মেসেজ পাঠান' : 'Send message via WhatsApp'}
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-black tracking-tight">WhatsApp</span>
          </a>
        </div>
      </td>

      {/* 3. IP / PPPoE Username + Password */}
      <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 select-all tracking-tight">
            {customer.pppoeId}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
            <span className="text-[10px] text-slate-400">{lang === 'bn' ? 'পাস:' : 'Pass:'}</span>
            <span className="font-mono text-amber-700 select-all font-semibold">
              {showPassword ? (customer.pppoePassword || '123456') : '••••••'}
            </span>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-0.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              title={showPassword ? (lang === 'bn' ? 'পাসওয়ার্ড লুকান' : 'Hide password') : (lang === 'bn' ? 'পাসওয়ার্ড দেখুন' : 'Show password')}
            >
              {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </td>

      {/* 4. Name: Customer Name + Phone call link + Zone */}
      <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              {customer.name}
            </span>
            {isDeactive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 border border-rose-300">
                {lang === 'bn' ? 'ডিঅ্যাক্টিভ' : 'Deactive'}
                {customer.deactivatedAt ? ` (${customer.deactivatedAt})` : ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <a
              href={`tel:${customer.phone}`}
              className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 transition font-mono font-semibold"
              title={lang === 'bn' ? 'কল করুন' : 'Call'}
            >
              <Phone className="w-3 h-3 text-blue-500" />
              <span>{customer.phone}</span>
            </a>
            {customer.zoneName && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                {customer.zoneName}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* 5. বকেয়া (Previous Due / Arrears) */}
      <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
        {totalPastDue > 0 ? (
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <span>{formatCurrency(totalPastDue, lang)}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5">
              {lang === 'bn' ? `${pastDueList.map(p => p.monthName).join(', ')} বকেয়া` : `Due: ${pastDueList.map(p => p.monthName).join(', ')}`}
            </span>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>{formatCurrency(0, lang)}</span>
          </span>
        )}
      </td>

      {/* 6. চলতি মাস (Current Month Bill & Status) */}
      <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap">
        {isDeactive ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span>{lang === 'bn' ? 'ডিঅ্যাক্টিভ (বিল বন্ধ)' : 'Deactive (No Bill)'}</span>
          </span>
        ) : isPendingCycle ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>{lang === 'bn' ? 'বিল আগামী মাসে' : 'Bill Next Month'}</span>
          </span>
        ) : isPaid || currentMonthDue === 0 ? (
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{formatCurrency(customer.monthlyBill, lang)}</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-bold mt-0.5">
              {t.statusPaid}
            </span>
          </div>
        ) : paidAmount > 0 ? (
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>{lang === 'bn' ? `বাকি ${formatCurrency(currentMonthDue, lang)}` : `Due ${formatCurrency(currentMonthDue, lang)}`}</span>
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
              {lang === 'bn' ? `বিল ${formatCurrency(customer.monthlyBill, lang)} (আদায় ${formatCurrency(paidAmount, lang)})` : `Bill ${formatCurrency(customer.monthlyBill, lang)} (Paid ${formatCurrency(paidAmount, lang)})`}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-start">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              <span>{formatCurrency(customer.monthlyBill, lang)}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5">
              {lang === 'bn' ? 'চলতি বকেয়া' : 'Current Due'}
            </span>
          </div>
        )}
      </td>

      {/* 7. এমবিপিএস (Package Speed) */}
      <td className="py-2.5 px-2.5 sm:px-4 whitespace-nowrap text-center">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Wifi className="w-3 h-3 text-blue-600" />
          <span>{customer.packageSpeed || '25 Mbps'}</span>
        </span>
      </td>

      {/* 8. Actions (Receipt if paid, and 12-Month Ledger) */}
      <td className="py-2.5 px-2.5 sm:px-4 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          {isTrulyFullyPaid && (
            <button
              onClick={() => onViewReceipt(customer, currentMonthKey)}
              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition flex items-center gap-1 border border-blue-200 active:scale-95 cursor-pointer shadow-xs"
              title={t.receiptBtn}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{t.receiptBtn}</span>
            </button>
          )}

          {/* 12-Month Ledger Button */}
          <button
            onClick={() => onViewLedger(customer)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition active:scale-95 cursor-pointer"
            title={t.ledgerBtn}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>
      </td>

    </tr>
  );
};
