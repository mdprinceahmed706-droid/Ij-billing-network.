import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Phone, 
  Copy, 
  Check, 
  Users, 
  AlertCircle, 
  Sparkles, 
  Wrench, 
  Heart, 
  ExternalLink 
} from 'lucide-react';
import { Customer, Zone, ISPSettings } from '../types/isp';
import { translations, getMonthName } from '../i18n/translations';
import { getCustomerCurrentMonthStatus, getCustomerPastDues } from '../utils/billingCalculations';

interface BroadcastMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  zones: Zone[];
  settings: ISPSettings;
  currentMonthKey: string;
}

export const BroadcastMessageModal: React.FC<BroadcastMessageModalProps> = ({
  isOpen,
  onClose,
  customers,
  zones,
  settings,
  currentMonthKey
}) => {
  const lang = settings.language;
  const t = translations[lang];

  if (!isOpen) return null;

  // Filter Target Group: 'all' | 'due' | 'zone'
  const [targetGroup, setTargetGroup] = useState<'all' | 'due' | 'zone'>('all');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp'>('sms');
  const [copiedNumbers, setCopiedNumbers] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const monthName = getMonthName(currentMonthKey, lang);

  // Default Template Messages
  const templates = {
    due: lang === 'bn' 
      ? `সম্মানিত গ্রাহক, আইজে নেটওয়ার্ক (${settings.companyNameBn}) থেকে আপনার ${monthName} মাসের বকেয়া ইন্টারনেট বিল পরিশোধের জন্য বিনীত অনুরোধ করা যাচ্ছে। বিকাশ/নগদ পার্সোনাল: ০১৪০২-১৮০ ৭৫৭। হেল্পলাইন: ০১৪০২-১৮০ ৭৫৭। ধন্যবাদ।`
      : `Dear subscriber, please settle your pending broadband bill for ${monthName} (${settings.companyNameEn}). Pay via bKash/Nagad: 01402-180757. Helpline: 01402-180757. Thank you.`,
    maintenance: lang === 'bn'
      ? `সম্মানিত গ্রাহক, আইজে নেটওয়ার্কের ফাইবার অপটিক মেইনটেন্যান্স ও স্পিড আপগ্রেড কাজের জন্য আজ সাময়িক ইন্টারনেট সমস্যা হতে পারে। দ্রুততম সময়ে কাজ শেষ হবে। সাময়িক অসুবিধার জন্য আমরা আন্তরিকভাবে দুঃখিত।`
      : `Dear subscriber, internet service may experience brief maintenance for optical fiber line upgrades today. We apologize for the temporary inconvenience.`,
    eid: lang === 'bn'
      ? `সম্মানিত গ্রাহক, আইজে নেটওয়ার্কের (${settings.companyNameBn}) পক্ষ থেকে আপনাকে ও আপনার পরিবারকে জানাই পবিত্র ঈদের আন্তরিক শুভেচ্ছা ও মোবারকবাদ। ঈদ মোবারক!`
      : `Warm greetings and best wishes to you and your family on this festive occasion from ${settings.companyNameEn}!`,
    custom: lang === 'bn'
      ? `সম্মানিত গ্রাহক, আইজে নেটওয়ার্কের জরুরি নোটিশ:`
      : `Dear subscriber, important notice from ${settings.companyNameEn}:`
  };

  const [messageText, setMessageText] = useState<string>(templates.due);

  // Compute selected recipients based on target group
  const recipientCustomers = customers.filter((c) => {
    if (c.status !== 'active') return false;
    if (targetGroup === 'all') return true;
    if (targetGroup === 'zone') return c.zoneId === selectedZoneId;
    if (targetGroup === 'due') {
      const { isPaid } = getCustomerCurrentMonthStatus(c, currentMonthKey);
      const { totalPastDue } = getCustomerPastDues(c, currentMonthKey, lang);
      return !isPaid || totalPastDue > 0;
    }
    return true;
  });

  const phoneNumbersList = recipientCustomers.map(c => c.phone.trim()).filter(Boolean);
  const commaSeparatedPhones = phoneNumbersList.join(',');

  const handleCopyNumbers = () => {
    navigator.clipboard.writeText(commaSeparatedPhones);
    setCopiedNumbers(true);
    setTimeout(() => setCopiedNumbers(false), 2500);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Launch phone's default group SMS app with all recipients pre-filled
  const handleOpenMobileSms = () => {
    const smsUrl = `sms:${commaSeparatedPhones}?body=${encodeURIComponent(messageText)}`;
    window.location.href = smsUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'সকল কাস্টমারকে একসাথে মেসেজ ও WhatsApp পাঠান' : 'Bulk SMS & WhatsApp Broadcast'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'মোবাইলে একসাথে SMS অথবা WhatsApp ব্রডকাস্ট করুন' : 'Broadcast to all customer phone numbers & WhatsApp'}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs pr-1">
          
          {/* Step 1: Target Selection */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200">
                {lang === 'bn' ? '১. কাদের কাছে মেসেজ পাঠাবেন?' : '1. Select Target Recipients'}
              </label>
              <span className="text-[11px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">
                {recipientCustomers.length} জন গ্রাহক নির্বাচিত
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetGroup('all')}
                className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                  targetGroup === 'all'
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সকল গ্রাহক' : 'All'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetGroup('due')}
                className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                  targetGroup === 'due'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'বকেয়া গ্রাহক' : 'Due Only'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetGroup('zone')}
                className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                  targetGroup === 'zone'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span>{lang === 'bn' ? 'নির্দিষ্ট জোন' : 'By Zone'}</span>
              </button>
            </div>

            {targetGroup === 'zone' && (
              <div className="pt-2">
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({customers.filter(c => c.zoneId === z.id && c.status === 'active').length} জন)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Step 2: Message Template Selector */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 block">
              {lang === 'bn' ? '২. বার্তার ধরন / দ্রুত টেমপ্লেট নির্বাচন করুন:' : '2. Select Message Template:'}
            </label>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setMessageText(templates.due)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1 cursor-pointer"
              >
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>{lang === 'bn' ? 'বকেয়া বিল তাগাদা' : 'Due Reminder'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMessageText(templates.maintenance)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-cyan-300 font-semibold border border-cyan-500/30 flex items-center gap-1 cursor-pointer"
              >
                <Wrench className="w-3 h-3 text-cyan-400" />
                <span>{lang === 'bn' ? 'লাইন মেইনটেন্যান্স' : 'Maintenance'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMessageText(templates.eid)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1 cursor-pointer"
              >
                <Heart className="w-3 h-3 text-rose-400" />
                <span>{lang === 'bn' ? 'ঈদ ও শুভেচ্ছা' : 'Greetings'}</span>
              </button>
            </div>

            {/* Editable Textarea */}
            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs font-sans leading-relaxed"
              placeholder="আপনার বার্তা এখানে লিখুন..."
            />
          </div>

          {/* Step 3: Channels Tab (Mobile SMS vs WhatsApp Broadcast) */}
          <div className="space-y-3">
            <div className="flex border-b border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('sms')}
                className={`py-2 px-4 font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'sms'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{lang === 'bn' ? 'মোবাইলে গ্রুপ SMS পাঠান' : 'Mobile Group SMS'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className={`py-2 px-4 font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'whatsapp'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{lang === 'bn' ? 'WhatsApp এ ব্রডকাস্ট পাঠান' : 'WhatsApp Broadcast'}</span>
              </button>
            </div>

            {/* TAB A: MOBILE GROUP SMS */}
            {activeTab === 'sms' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    {lang === 'bn' ? 'এক ক্লিকে সকল নম্বরে মেসেজ পাঠান:' : 'Send SMS to all numbers in 1-click:'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {phoneNumbersList.length} টি নম্বর
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenMobileSms}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer active:scale-95 transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'মোবাইল মেসেজ অ্যাপে চালু করুন (সব নম্বর একসাথে)' : 'Launch Mobile SMS App (All Numbers)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyNumbers}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition active:scale-95"
                  >
                    {copiedNumbers ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                    <span>{copiedNumbers ? 'সব নম্বর কপি হয়েছে!' : 'সব নম্বর কপি করুন'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  💡 <b>টিপস:</b> "মোবাইল মেসেজ অ্যাপে চালু করুন" চাপলে আপনার ফোনের ডিফল্ট মেসেজ অ্যাপ খুলে যাবে এবং সকল নম্বর প্রাপক হিসেবে স্বয়ংক্রিয়ভাবে বসে যাবে।
                </p>
              </div>
            )}

            {/* TAB B: WHATSAPP BROADCAST */}
            {activeTab === 'whatsapp' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">
                    {lang === 'bn' ? 'হোয়াটসঅ্যাপ ব্রডকাস্ট তালিকা:' : 'WhatsApp Broadcast Queue:'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText ? 'মেসেজ কপি হয়েছে' : 'বার্তা কপি করুন'}</span>
                  </button>
                </div>

                {/* Individual 1-Click WhatsApp list */}
                <div className="max-h-52 overflow-y-auto divide-y divide-slate-800/80 rounded-lg border border-slate-800">
                  {recipientCustomers.map((c) => {
                    const rawPhone = c.phone.replace(/[^0-9]/g, '');
                    const cleanPhone = rawPhone.startsWith('88') ? rawPhone : (rawPhone.startsWith('0') ? `88${rawPhone}` : `880${rawPhone}`);
                    const personalizedMessage = `সম্মানিত ${c.name},\n${messageText}`;
                    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(personalizedMessage)}`;

                    return (
                      <div key={c.id} className="p-2.5 flex items-center justify-between hover:bg-slate-900/60 transition">
                        <div>
                          <div className="font-bold text-white text-xs">{c.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{c.phone} • {c.zoneName}</div>
                        </div>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>পাঠান</span>
                        </a>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300">
                  📱 <b>হোয়াটসঅ্যাপ গ্রুপ/ব্রডকাস্ট সুবিধা:</b> মেসেজটি কপি করে আপনার হোয়াটসঅ্যাপে তৈরি করা ব্রডকাস্ট লিস্টে দিলে মুহূর্তেই সকল গ্রাহক একা একা এই বার্তা পেয়ে যাবেন।
                </div>
              </div>
            )}

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
