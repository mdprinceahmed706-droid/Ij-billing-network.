import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Check, 
  Copy, 
  ExternalLink, 
  Download, 
  AlertTriangle, 
  ShieldCheck,
  Globe,
  Sparkles,
  Layers,
  Compass,
  Share2
} from 'lucide-react';
import { ISPSettings } from '../types/isp';
import { translations } from '../i18n/translations';
import { IJLogo } from './IJLogo';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ISPSettings;
  deferredPrompt?: any;
  onNativeInstall?: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  settings,
  deferredPrompt,
  onNativeInstall
}) => {
  const lang = settings.language;
  const t = translations[lang];

  const [copied, setCopied] = useState(false);
  const [selectedBrowserTab, setSelectedBrowserTab] = useState<'chrome' | 'samsung' | 'safari' | 'other'>('chrome');

  if (!isOpen) return null;

  // Standalone Public App URL (Accessible to anyone on any device with any Gmail or without Google login)
  const appUrl = 'https://ais-pre-ld66bch74xvymvreqt3hdh-720224144005.asia-northeast1.run.app';

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenInBrowser = () => {
    window.open(appUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'আলাদা অ্যাপ ও ব্রাউজারে চালানোর পদ্ধতি' : 'Standalone App & Browser Setup'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ক্রোম ছাড়াই একদম নিজস্ব ফুলস্ক্রিন অ্যাপ হিসেবে চালান' : 'Run as independent app without browser frames'}
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs pr-1">
          
          {/* Key Solution: How to stop opening in Chrome and make it a real app */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-500/40 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'bn' ? 'ব্রাউজার ছাড়াই আসল অ্যাপের মতো চালানোর নিয়ম:' : 'How to run as an independent App:'}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {lang === 'bn'
                ? 'পূর্বে সাধারণ শর্টকাট তৈরির কারণে অ্যাপটি ক্রোমের ট্যাবে চালু হতো। এখন অ্যাপটিতে স্বয়ংক্রিয় WebAPK ও স্ট্যান্ডঅ্যালোন সিস্টেম যুক্ত করা হয়েছে। নিচে দেওয়া নিয়মে একবার ইনস্টল করলেই এটি বিকাশ বা ফেসবুকের মতো ক্রোমের কোনো অ্যাড্রেস বার বা ফ্রেম ছাড়াই আলাদা ফুলস্ক্রিন অ্যাপ হয়ে কাজ করবে।'
                : 'Now upgraded with standalone PWA support. Once installed, it launches directly on your phone home screen without any browser navigation bars or tabs, just like a native app.'}
            </p>
          </div>

          {/* Iframe notice if app is loaded inside preview/iframe */}
          {typeof window !== 'undefined' && window.self !== window.top && (
            <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{lang === 'bn' ? 'প্রিভিউ উইন্ডো নোটিশ' : 'Preview Window Notice'}</span>
              </div>
              <p>
                {lang === 'bn'
                  ? 'আপনি বর্তমানে প্রিভিউ ফ্রেমের ভেতরে আছেন। অ্যান্ড্রয়েড/আইওএস সিকিউরিটির কারণে ফ্রেমের ভেতর ইনস্টল ব্লক থাকে। অ্যাপ ইনস্টল করতে নিচে "সরাসরি ব্রাউজারে খুলুন" চাপুন অথবা লিঙ্কটি মোবাইল ক্রোমে পেস্ট করুন।'
                  : 'You are currently inside a preview frame. Mobile OS security restricts installing apps directly from within an iframe. Please click "Open in Browser Directly" below or open the URL in Chrome.'}
              </p>
            </div>
          )}

          {/* Direct 1-Click Native Install Button (if browser triggered beforeinstallprompt) */}
          {deferredPrompt && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-emerald-300 text-sm block">
                  {lang === 'bn' ? 'সরাসরি ইনস্টল প্রস্তুত রয়েছে!' : 'Ready for 1-Click Install!'}
                </span>
                <span className="text-[11px] text-slate-300">
                  {lang === 'bn' ? 'এক ক্লিকেই আপনার মোবাইলে ইনস্টল করে নিন' : 'Install to your phone home screen directly'}
                </span>
              </div>
              <button
                type="button"
                onClick={onNativeInstall}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer transition shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'bn' ? 'ইনস্টল চাপুন' : 'Install Now'}</span>
              </button>
            </div>
          )}

          {/* 3D IJ Logo Icon Preview */}
          <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-slate-950 border border-slate-800">
            <IJLogo size="xl" showGlow={true} />
            <span className="mt-2 text-sm font-extrabold text-white">
              {lang === 'bn' ? settings.companyNameBn : settings.companyNameEn}
            </span>
            <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">
              {lang === 'bn' ? 'হাই স্পিড ব্রডব্যান্ড অ্যাপ (স্ট্যান্ডঅ্যালোন)' : 'High Speed Broadband App (Standalone)'}
            </span>
          </div>

          {/* Browser Specific Guides Tabs */}
          <div className="space-y-3">
            <span className="font-bold text-slate-200 block text-xs">
              {lang === 'bn' ? 'আপনার ব্যবহৃত ব্রাউজার অনুযায়ী আলাদা আলাদা নিয়ম:' : 'Instructions by Browser:'}
            </span>

            {/* Browser Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedBrowserTab('chrome')}
                className={`py-2 px-2 rounded-lg font-bold text-center transition cursor-pointer ${
                  selectedBrowserTab === 'chrome'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chrome
              </button>

              <button
                type="button"
                onClick={() => setSelectedBrowserTab('samsung')}
                className={`py-2 px-2 rounded-lg font-bold text-center transition cursor-pointer ${
                  selectedBrowserTab === 'samsung'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Samsung
              </button>

              <button
                type="button"
                onClick={() => setSelectedBrowserTab('safari')}
                className={`py-2 px-2 rounded-lg font-bold text-center transition cursor-pointer ${
                  selectedBrowserTab === 'safari'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Safari
              </button>

              <button
                type="button"
                onClick={() => setSelectedBrowserTab('other')}
                className={`py-2 px-2 rounded-lg font-bold text-center transition cursor-pointer ${
                  selectedBrowserTab === 'other'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'অন্যান্য' : 'Others'}
              </button>
            </div>

            {/* Tab 1: Chrome Guide */}
            {selectedBrowserTab === 'chrome' && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'bn' ? 'Google Chrome-এ আসল অ্যাপ হিসেবে যুক্ত করার নিয়ম:' : 'How to install in Google Chrome:'}</span>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                  <li>{lang === 'bn' ? 'নিচে থাকা "সরাসরি ব্রাউজারে খুলুন ↗" বাটনে চাপ দিন।' : 'Tap "Open in Browser Directly ↗" below.'}</li>
                  <li>{lang === 'bn' ? 'ক্রোম ব্রাউজারের উপরে ডানদিকের তিনটি ডট মেনু (⋮)-তে চাপ দিন।' : 'Tap the three dots menu (⋮) in the top-right corner.'}</li>
                  <li>{lang === 'bn' ? 'মেনু থেকে "Install app" (অথবা "Add to Home screen") নির্বাচন করুন।' : 'Select "Install app" (or "Add to Home screen").'}</li>
                  <li>{lang === 'bn' ? 'পপআপে "Install" চাপলেই হোম স্ক্রিনে ক্রোম ছাড়াই আলাদা নিজস্ব অ্যাপ হিসেবে যুক্ত হবে।' : 'Confirm by tapping "Install" to place the standalone app on your home screen.'}</li>
                </ol>
              </div>
            )}

            {/* Tab 2: Samsung Internet Guide */}
            {selectedBrowserTab === 'samsung' && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'bn' ? 'Samsung Internet ব্রাউজারে আলাদা অ্যাপ তৈরির নিয়ম:' : 'Instructions for Samsung Internet:'}</span>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                  <li>{lang === 'bn' ? 'স্যামসাং ইন্টারনেট ব্রাউজারে লিংকটি খুলুন।' : 'Open the link in Samsung Internet.'}</li>
                  <li>{lang === 'bn' ? 'নিচে ডানপাশের তিনটি দাগ মেনু (≡)-তে চাপ দিন।' : 'Tap the bottom-right hamburger menu (≡).'}</li>
                  <li>{lang === 'bn' ? '"+ Add page to" (বা "+ পৃষ্ঠা যোগ করুন") চাপুন।' : 'Tap "+ Add page to".'}</li>
                  <li>{lang === 'bn' ? '"App screen" (বা "হোম স্ক্রীন") নির্বাচন করুন।' : 'Select "App screen" or "Home screen".'}</li>
                </ol>
              </div>
            )}

            {/* Tab 3: iPhone / Safari Guide */}
            {selectedBrowserTab === 'safari' && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>{lang === 'bn' ? 'iPhone / iPad (Safari ব্রাউজার)-এ আসল অ্যাপ তৈরির নিয়ম:' : 'Instructions for iPhone / iPad (Safari):'}</span>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                  <li>{lang === 'bn' ? 'আইফোনের Safari ব্রাউজারে লিংকটি খুলুন।' : 'Open the link in Safari on your iPhone.'}</li>
                  <li>{lang === 'bn' ? 'স্ক্রিনের নিচে থাকা শেয়ার বাটন (⎋ Share icon)-এ চাপ দিন।' : 'Tap the Share icon at the bottom of the screen.'}</li>
                  <li>{lang === 'bn' ? 'একটু নিচে স্ক্রল করে "Add to Home Screen" চাপুন।' : 'Scroll down and tap "Add to Home Screen".'}</li>
                  <li>{lang === 'bn' ? 'উপরে ডানে "Add" চাপলেই আইফোনের স্ক্রিনে আসল অ্যাপের মতো IJ আইকন বসে যাবে।' : 'Tap "Add" in the top-right corner to finish.'}</li>
                </ol>
              </div>
            )}

            {/* Tab 4: Other Browsers (Edge / Firefox) */}
            {selectedBrowserTab === 'other' && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'bn' ? 'Microsoft Edge / Firefox / Opera-তে নিয়ম:' : 'Instructions for Edge / Firefox:'}</span>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                  <li>{lang === 'bn' ? 'ব্রাউজারের ৩-ডট মেনুতে চাপ দিন।' : 'Tap the browser three-dot menu.'}</li>
                  <li>{lang === 'bn' ? '"Install as app" অথবা "Add to Home screen" নির্বাচন করুন।' : 'Select "Install as app" or "Add to Home screen".'}</li>
                  <li>{lang === 'bn' ? 'কনফার্ম করলেই এটি একটি স্বতন্ত্র অ্যাপ হিসেবে ডিভাইসে ইনস্টল হয়ে যাবে।' : 'Confirm installation.'}</li>
                </ol>
              </div>
            )}
          </div>

          {/* Action Buttons: WhatsApp Share & Browser Launch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('IJ Network Billing System লিংক:\n' + appUrl + '\n(পাসওয়ার্ড: 123 বা পিন: 1234)')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition text-center"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে লিংক পাঠান' : 'Share via WhatsApp'}</span>
            </a>

            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition text-center"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{lang === 'bn' ? 'সরাসরি ব্রাউজারে খুলুন ↗' : 'Open in Browser ↗'}</span>
            </a>
          </div>

          {/* Copy Direct Link */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold text-[11px]">
              {lang === 'bn' ? '🌐 যেকোনো ফোন বা জিমেইলে খোলার সরাসরি পাবলিক লিঙ্ক:' : 'Direct Public URL for any phone or Google account:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 text-xs font-mono select-all focus:outline-none font-bold"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-400 hover:text-cyan-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition active:scale-95 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>
                  {copied 
                    ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') 
                    : (lang === 'bn' ? 'লিংক কপি' : 'Copy Link')}
                </span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {lang === 'bn' 
                ? '✅ এটি পাবলিক লিংক। যেকোনো ফোনের ক্রোম ব্রাউজারে পেস্ট করলে কোনো গুগল একাউন্ট ছাড়াই অ্যাপ সরাসরি চালু হবে।'
                : '✅ Public URL. Opens in any Chrome browser without Google account authentication.'}
            </p>
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
