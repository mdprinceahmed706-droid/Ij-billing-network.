import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  CreditCard, 
  Check, 
  Sparkles, 
  Zap, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  History,
  AlertCircle
} from 'lucide-react';
import { ISPSettings, Language, SMSLogRecord, SMSRechargeRecord } from '../types/isp';
import { translations, formatCurrency, formatNumber } from '../i18n/translations';

interface SMSRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ISPSettings;
  onUpdateSettings: (newSettings: ISPSettings) => void;
}

interface SMSPackage {
  id: string;
  smsCount: number;
  price: number;
  rate: string;
  rateEn: string;
  badge?: string;
  badgeBn?: string;
}

const SMS_PACKAGES: SMSPackage[] = [
  { id: 'pkg-500', smsCount: 500, price: 175, rate: '৳০.৩৫/এসএমএস', rateEn: '৳0.35/SMS' },
  { id: 'pkg-1000', smsCount: 1000, price: 330, rate: '৳০.৩৩/এসএমএস', rateEn: '৳0.33/SMS', badge: 'POPULAR', badgeBn: 'জনপ্রিয়' },
  { id: 'pkg-2500', smsCount: 2500, price: 750, rate: '৳০.৩০/এসএমএস', rateEn: '৳0.30/SMS', badge: 'BEST VALUE', badgeBn: 'সেরা অফার' },
  { id: 'pkg-5000', smsCount: 5000, price: 1400, rate: '৳০.২৮/এসএমএস', rateEn: '৳0.28/SMS', badge: 'SUPER SAVER', badgeBn: 'মেগা সেভার' }
];

export const SMSRechargeModal: React.FC<SMSRechargeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  const lang = settings.language;
  const [activeTab, setActiveTab] = useState<'buy' | 'logs' | 'recharges'>('buy');
  const [selectedPkg, setSelectedPkg] = useState<SMSPackage>(SMS_PACKAGES[1]);
  const [purchaserMobile, setPurchaserMobile] = useState<string>(settings.phone || '01402-180757');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(settings.smsAutoSend ?? true);
  const [autoWhatsAppEnabled, setAutoWhatsAppEnabled] = useState(settings.whatsappAutoSend ?? false);

  if (!isOpen) return null;

  const handleToggleAutoSms = () => {
    const nextVal = !autoSmsEnabled;
    setAutoSmsEnabled(nextVal);
    onUpdateSettings({ ...settings, smsAutoSend: nextVal });
  };

  const handleToggleAutoWhatsApp = () => {
    const nextVal = !autoWhatsAppEnabled;
    setAutoWhatsAppEnabled(nextVal);
    onUpdateSettings({ ...settings, whatsappAutoSend: nextVal });
  };

  const handleConfirmRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTrx = trxId.trim() || `TRX${Date.now().toString().slice(-8)}`;
    const cleanMobile = purchaserMobile.trim() || settings.phone || '01402-180757';
    
    const newRecord: SMSRechargeRecord = {
      id: `rcg-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      packageTitle: `${selectedPkg.smsCount} SMS Pack`,
      smsCount: selectedPkg.smsCount,
      amount: selectedPkg.price,
      paymentMethod,
      trxId: cleanTrx,
      mobileNumber: cleanMobile,
      status: 'completed'
    };

    const newBalance = (settings.smsBalance || 0) + selectedPkg.smsCount;
    const updatedRecharges = [newRecord, ...(settings.smsRecharges || [])];

    onUpdateSettings({
      ...settings,
      smsBalance: newBalance,
      phone: cleanMobile, // Keep primary phone in sync
      smsRecharges: updatedRecharges
    });

    setIsSuccess(true);
    setTrxId('');
    setTimeout(() => {
      setIsSuccess(false);
      setActiveTab('recharges');
    }, 1500);
  };

  const paymentNumber = paymentMethod === 'bKash' ? settings.bkashNumber : settings.nagadNumber;
  const smsLogs: SMSLogRecord[] = settings.smsLogs || [];
  const rechargeHistory: SMSRechargeRecord[] = settings.smsRecharges || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 sm:p-6 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {lang === 'bn' ? 'এসএমএস ব্যালেন্স ও প্যাকেজ রিচার্জ' : 'SMS Balance & Bundle Recharge'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {formatNumber(settings.smsBalance || 0, lang)} {lang === 'bn' ? 'টি অবশিষ্ট' : 'Remaining'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'bn' 
                  ? 'বিল পরিশোধের সাথে সাথে স্বয়ংক্রিয় SMS ও WhatsApp বার্তা পাঠানোর সিস্টেম' 
                  : 'Automated SMS & WhatsApp notifications on customer bill payments'}
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-3 border-b border-slate-800 shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('buy')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'buy'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{lang === 'bn' ? 'এসএমএস কিনুন' : 'Buy SMS'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logs'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{lang === 'bn' ? 'মেসেজ লগ' : 'Message Logs'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {smsLogs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recharges')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'recharges'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{lang === 'bn' ? 'রিচার্জ হিস্টোরি' : 'Recharge History'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {rechargeHistory.length}
            </span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs pr-1">

          {/* Automation Switch Controls (Always accessible) */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div>
                <span className="font-bold text-white text-xs block">
                  {lang === 'bn' ? 'স্বয়ংক্রিয় মোবাইল SMS' : 'Automated Mobile SMS'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'বিল পেড হলে অটোমেটিক SMS যাবে' : 'Send SMS automatically on payment'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleAutoSms}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoSmsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoSmsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div>
                <span className="font-bold text-white text-xs block">
                  {lang === 'bn' ? 'স্বয়ংক্রিয় WhatsApp রসিদ' : 'Automated WhatsApp Message'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'পেমেন্ট শেষে অটোমেটিক WhatsApp লিঙ্ক' : 'Prompt WhatsApp on payment'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleAutoWhatsApp}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoWhatsAppEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoWhatsAppEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* TAB 1: BUY PACKAGES */}
          {activeTab === 'buy' && (
            <div className="space-y-4">
              
              {/* Package Cards */}
              <div className="space-y-2">
                <span className="font-bold text-slate-200 block">
                  {lang === 'bn' ? 'পছন্দের এসএমএস প্যাকেজ নির্বাচন করুন:' : 'Select SMS Bundle Package:'}
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  {SMS_PACKAGES.map((pkg) => {
                    const isSelected = selectedPkg.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`relative p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-950/50 border-emerald-500 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded text-[9px] font-black bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 uppercase tracking-wide">
                            {lang === 'bn' ? pkg.badgeBn : pkg.badge}
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base sm:text-lg font-black text-white">
                              {formatNumber(pkg.smsCount, lang)} SMS
                            </span>
                            <span className="text-sm sm:text-base font-extrabold text-emerald-400">
                              {formatCurrency(pkg.price, lang)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {lang === 'bn' ? pkg.rate : pkg.rateEn} • {lang === 'bn' ? 'মেয়াদ আজীবন' : 'Lifetime Validity'}
                          </p>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className={isSelected ? 'text-emerald-300 font-bold' : 'text-slate-500'}>
                            {isSelected ? (lang === 'bn' ? '✓ নির্বাচিত' : '✓ Selected') : (lang === 'bn' ? 'নির্বাচন করুন' : 'Select')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Instant</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Instructions Form */}
              <form onSubmit={handleConfirmRecharge} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {lang === 'bn' ? 'পেমেন্ট সম্পন্ন করে এসএমএস ব্যালেন্স চালু করুন' : 'Make Payment to Activate SMS Balance'}
                  </span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {formatCurrency(selectedPkg.price, lang)} ({selectedPkg.smsCount} SMS)
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন:' : 'Select Payment Method:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bKash')}
                      className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        paymentMethod === 'bKash'
                          ? 'bg-pink-950/60 border-pink-500 text-pink-300 ring-1 ring-pink-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      <span>{lang === 'bn' ? 'বিকাশ (bKash)' : 'bKash'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Nagad')}
                      className={`p-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        paymentMethod === 'Nagad'
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{lang === 'bn' ? 'নগদ (Nagad)' : 'Nagad'}</span>
                    </button>
                  </div>
                </div>

                {/* Payment Steps Box */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 space-y-1 leading-relaxed">
                  <p className="font-bold text-white">
                    {lang === 'bn' ? '১. টাকা পাঠানোর নম্বর:' : '1. Send Money Number:'}{' '}
                    <span className="text-cyan-300 font-mono font-extrabold select-all">{paymentNumber}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'bn' 
                      ? `আপনার ${paymentMethod} অ্যাপ থেকে ৳${selectedPkg.price} টাকা Send Money করুন।` 
                      : `Send ৳${selectedPkg.price} via ${paymentMethod} Send Money.`}
                  </p>
                </div>

                {/* Mobile Number Input for SMS Recharge */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? '২. আপনার মোবাইল নম্বর (যে নাম্বারে SMS প্যাক কিনছেন):' : '2. Your Mobile Number (For SMS Purchase):'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={purchaserMobile}
                      onChange={(e) => setPurchaserMobile(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-1">
                    {lang === 'bn' 
                      ? '✓ এই মোবাইল নম্বরে কেনা এসএমএস দিয়ে আপনি সফটওয়্যারের সকল গ্রাহককে স্বয়ংক্রিয় মেসেজ পাঠাতে পারবেন।' 
                      : '✓ The purchased SMS will be assigned to this mobile number account for dispatch.'}
                  </span>
                </div>

                {/* TrxID Input */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {lang === 'bn' ? '৩. ট্রানজেকশন আইডি (TrxID) লিখুন:' : '3. Enter Transaction ID (TrxID):'}
                  </label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder={lang === 'bn' ? 'যেমন: BL89X12Q4' : 'e.g. BL89X12Q4'}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs uppercase focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {lang === 'bn' ? 'খালি রাখলে স্বয়ংক্রিয় ভেরিফিকেশন কোড ব্যবহৃত হবে' : 'Leave empty for instant auto-verification'}
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSuccess}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-95 transition"
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>{lang === 'bn' ? 'রিচার্জ সফল হয়েছে!' : 'Recharged Successfully!'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>
                        {lang === 'bn' 
                          ? `রিচার্জ নিশ্চিত করুন (${selectedPkg.smsCount} SMS সক্রিয়)` 
                          : `Confirm Recharge (${selectedPkg.smsCount} SMS)`}
                      </span>
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* TAB 2: SENT SMS LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">
                  {lang === 'bn' ? 'স্বয়ংক্রিয়ভাবে প্রেরিত সকল এসএমএস ও বার্তা:' : 'All Automated Sent Messages:'}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {smsLogs.length} {lang === 'bn' ? 'টি বার্তা' : 'messages'}
                </span>
              </div>

              {smsLogs.length === 0 ? (
                <div className="py-10 text-center text-slate-500 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p>{lang === 'bn' ? 'এখনও কোনো স্বয়ংক্রিয় এসএমএস পাঠানো হয়নি।' : 'No automated SMS sent yet.'}</p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {lang === 'bn' ? 'বিল কালেকশনে কোনো গ্রাহকের বিল গ্রহণ করলে স্বয়ংক্রিয়ভাবে এখানে লগ যুক্ত হবে।' : 'Whenever a bill is received, the sent receipt will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {smsLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.channel === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {log.channel.toUpperCase()}
                          </span>
                          <span className="font-bold text-white text-xs">{log.customerName}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{log.phone}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{log.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 whitespace-pre-line bg-slate-900 p-2 rounded-lg font-mono border border-slate-850">
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECHARGE HISTORY */}
          {activeTab === 'recharges' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">
                  {lang === 'bn' ? 'এসএমএস রিচার্জ হিস্টোরি:' : 'SMS Recharge History:'}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {rechargeHistory.length} {lang === 'bn' ? 'টি রিচার্জ' : 'recharges'}
                </span>
              </div>

              {rechargeHistory.length === 0 ? (
                <div className="py-10 text-center text-slate-500 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <CreditCard className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p>{lang === 'bn' ? 'এখনও কোনো রিচার্জের রেকর্ড নেই।' : 'No recharge history yet.'}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {rechargeHistory.map((rcg) => (
                    <div key={rcg.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{rcg.packageTitle}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                            +{formatNumber(rcg.smsCount, lang)} SMS
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {rcg.date} • {rcg.mobileNumber ? `${rcg.mobileNumber} • ` : ''}{rcg.paymentMethod} (TrxID: {rcg.trxId})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-emerald-400">
                          ৳{formatNumber(rcg.amount, lang)}
                        </span>
                        <span className="text-[10px] text-emerald-300 block">✓ Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            {lang === 'bn' 
              ? `বর্তমান ব্যালেন্স: ${formatNumber(settings.smsBalance || 0, lang)} টি SMS` 
              : `Current Balance: ${formatNumber(settings.smsBalance || 0, lang)} SMS`}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs transition cursor-pointer"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
