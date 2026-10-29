import React, { useState } from 'react';
import { 
  X, 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  Bookmark, 
  Smartphone, 
  Globe, 
  ShieldCheck,
  Share2,
  AlertTriangle,
  QrCode,
  CheckCircle2
} from 'lucide-react';
import { ISPSettings } from '../types/isp';
import { IJLogo } from './IJLogo';

interface PermanentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ISPSettings;
}

export const PermanentLinkModal: React.FC<PermanentLinkModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const [copied, setCopied] = useState(false);
  const lang = settings.language;

  if (!isOpen) return null;

  // The 100% Public Standalone URL that works on ANY mobile phone, tablet or PC without Google login:
  // ais-pre-... is the public production preview, whereas ais-dev-... is internal to the developer session
  const permanentUrl = 'https://ais-pre-ld66bch74xvymvreqt3hdh-720224144005.asia-northeast1.run.app';

  const handleCopy = () => {
    navigator.clipboard.writeText(permanentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenDirect = () => {
    window.open(permanentUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'bn' ? 'স্থায়ী পাবলিক ওয়েবসাইট লিংক' : 'Permanent Public App URL'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'যেকোনো মোবাইল বা কম্পিউটারে ঝামেলাহীনভাবে খোলার সরাসরি ঠিকানা' : 'Direct permanent URL to launch your billing software anywhere'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 space-y-4 overflow-y-auto text-xs">
          
          {/* Important Clarity Banner (Solving the user's issue permanently) */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-black text-xs text-emerald-900">
                {lang === 'bn' ? '✅ অন্য ফোনে অ্যাপ না খোলার পার্মানেন্ট সমাধান:' : 'Permanent Solution for External Devices:'}
              </h4>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                {lang === 'bn' 
                  ? 'পূর্বে আপনি "ais-dev" লিংক কপি করায় গুগল লগইন ও লোডিং স্ক্রিন দেখাচ্ছিল। নিচের এই "ais-pre" লিংকটি হলো আপনার পাবলিক পার্মানেন্ট ঠিকানা। এটি যেকোনো মোবাইল বা কম্পিউটারে দিলে কোনো গুগল একাউন্ট ছাড়াই সরাসরি অ্যাডমিন পাসওয়ার্ড দিয়ে ওপেন হবে।'
                  : 'The ais-pre URL below is fully public. It opens instantly on any phone or PC without requiring any Google login.'}
              </p>
            </div>
          </div>

          {/* Permanent URL Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-blue-200 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              {lang === 'bn' ? '🌐 আপনার মূল পাবলিক ওয়েবসাইট লিংক (কপি করে সেভ রাখুন):' : 'Your Permanent Public Web Address:'}
            </label>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={permanentUrl}
                className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-blue-700 font-mono text-xs select-all focus:outline-none focus:border-blue-500 font-bold"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer shrink-0 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (lang === 'bn' ? 'কপি হয়েছে!' : 'Copied!') : (lang === 'bn' ? 'কপি করুন' : 'Copy')}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              {lang === 'bn' 
                ? '💡 পরামর্শ: এই লিংকটি আপনার হোয়াটসঅ্যাপ বা ডায়েরিতে সেভ করে রাখুন। যেকোনো মোবাইল বা কম্পিউটারের ক্রোম ব্রাউজারে পেস্ট করলেই কোনো জিমেইল লগইন ছাড়াই বিলিং সফটওয়্যার চালু হবে।'
                : '💡 Tip: Save or bookmark this URL. You can paste it into Chrome on any device to open your billing system without Google login.'}
            </p>
          </div>

          {/* Action Buttons: WhatsApp Share & Open in Browser */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent('IJ Network Billing System লিংক:\n' + permanentUrl + '\n(পাসওয়ার্ড: 123 বা পিন: 1234)')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4 text-emerald-200" />
              <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে লিংক পাঠান' : 'Share via WhatsApp'}</span>
            </a>

            <a
              href={permanentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-white" />
              <span>{lang === 'bn' ? 'ব্রাউজারে খুলুন ↗' : 'Open in Browser ↗'}</span>
            </a>
          </div>

          {/* QR Code for Instant Mobile Scan */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl shrink-0 shadow-xs border border-slate-200">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(permanentUrl)}`}
                alt="Mobile QR Code"
                className="w-20 h-20"
                loading="lazy"
              />
            </div>
            <div className="space-y-1">
              <span className="font-extrabold text-slate-900 text-xs block">
                {lang === 'bn' ? '📱 অন্য ফোনে ক্যামেরা দিয়ে QR কোড স্ক্যান করুন:' : '📱 Scan with phone camera:'}
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {lang === 'bn' 
                  ? 'আপনার বা অন্য কারো ফোনের ক্যামেরা এই QR কোডের ওপর ধরলেই সরাসরি ওয়েবসাইট ওপেন হয়ে যাবে। কোনো গুগল লগইনের ঝামেলা নেই।'
                  : 'Point any phone camera at this QR code to launch the billing software immediately without Google login.'}
              </p>
            </div>
          </div>

          {/* 3 Steps to Save for Easy Access */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
            <span className="font-bold text-slate-900 block text-xs flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>{lang === 'bn' ? 'মোবাইলে সহজে চালানোর ৩টি নিয়ম:' : '3 Simple Steps to Access on Mobile:'}</span>
            </span>

            <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed text-[11px]">
              <li>
                <strong className="text-slate-900">{lang === 'bn' ? 'ক্রোম ব্রাউজারে খুলুন: ' : 'Open in Chrome: '}</strong>
                {lang === 'bn' ? 'লিংকটি ফোনে ক্রোম ব্রাউজারে পেস্ট করে গো (Go) দিন।' : 'Paste the link in Google Chrome.'}
              </li>
              <li>
                <strong className="text-slate-900">{lang === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড দিন: ' : 'Enter Password: '}</strong>
                {lang === 'bn' ? 'পাসওয়ার্ড হিসেবে 123 বা পিন 1234 দিয়ে লগইন করুন।' : 'Login with password 123 or PIN 1234.'}
              </li>
              <li>
                <strong className="text-slate-900">{lang === 'bn' ? 'হোমস্ক্রিনে যুক্ত করুন: ' : 'Add to Home screen: '}</strong>
                {lang === 'bn' 
                  ? 'ক্রোমের ৩-ডট মেনু থেকে "Add to Home screen" চাপলে ফোনে সরাসরি অ্যাপ আইকন চলে আসবে।' 
                  : 'Tap "Add to Home screen" to install as a native-like app.'}
              </li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            {lang === 'bn' ? 'ঠিক আছে' : 'Done'}
          </button>
        </div>

      </div>
    </div>
  );
};
