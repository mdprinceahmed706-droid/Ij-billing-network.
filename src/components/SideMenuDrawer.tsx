import React from 'react';
import { 
  X, 
  UserPlus, 
  Users, 
  Clock, 
  CheckCircle, 
  Send, 
  MapPin, 
  Cloud, 
  Download, 
  Upload, 
  Settings, 
  Smartphone, 
  Sparkles, 
  Trash2, 
  RotateCcw, 
  Globe, 
  ChevronRight, 
  CreditCard, 
  Network, 
  FileSpreadsheet, 
  Zap, 
  Link2, 
  Lock, 
  LogOut, 
  KeyRound,
  UserX
} from 'lucide-react';
import { ISPSettings, Language } from '../types/isp';
import { translations, formatNumber } from '../i18n/translations';
import { IJLogo } from './IJLogo';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard: () => void;
  onOpenBillCollection: () => void;
  onOpenPaidBills?: () => void;
  onOpenBillSheet: () => void;
  onOpenSMSRecharge?: () => void;
  onOpenPermanentLink?: () => void;
  onLockApp?: () => void;
  onLogout?: () => void;
  settings: ISPSettings;
  onToggleLanguage: () => void;
  onOpenAddCustomer: () => void;
  onFilterDueOnly: () => void;
  onFilterPaidOnly: () => void;
  onFilterAll: () => void;
  onOpenBulkReminder: () => void;
  onOpenBroadcastMessage: () => void;
  onOpenZoneBillingBreakdown: () => void;
  onOpenZoneManager: () => void;
  onOpenMikrotik: () => void;
  onOpenGoogleDrive: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onOpenSettings: (tab?: 'system' | 'security' | 'backup' | 'sms' | 'language') => void;
  onOpenInstallGuide: () => void;
  onOpenAIChat: () => void;
  onClearAllData: () => void;
  onLoadDemoData: () => void;
  dueCount: number;
  paidCount: number;
  totalCount: number;
  inactiveCount?: number;
  onFilterInactive?: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenDashboard,
  onOpenBillCollection,
  onOpenPaidBills,
  onOpenBillSheet,
  onOpenSMSRecharge,
  onOpenPermanentLink,
  onLockApp,
  onLogout,
  settings,
  onToggleLanguage,
  onOpenAddCustomer,
  onFilterDueOnly,
  onFilterPaidOnly,
  onFilterAll,
  onOpenBulkReminder,
  onOpenBroadcastMessage,
  onOpenZoneBillingBreakdown,
  onOpenZoneManager,
  onOpenMikrotik,
  onOpenGoogleDrive,
  onExportJson,
  onImportJson,
  onOpenSettings,
  onOpenInstallGuide,
  onOpenAIChat,
  onClearAllData,
  onLoadDemoData,
  dueCount,
  paidCount,
  totalCount,
  inactiveCount,
  onFilterInactive
}) => {
  if (!isOpen) return null;

  const lang = settings.language;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer Container */}
      <aside className="relative w-full max-w-xs sm:max-w-sm bg-white border-r border-slate-200 shadow-2xl flex flex-col h-full z-10 overflow-hidden animate-in slide-in-from-left duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <IJLogo size="sm" showGlow={false} />
              <div>
                <h2 className="font-black text-base text-slate-900 tracking-tight">
                  {lang === 'bn' ? settings.companyNameBn : settings.companyNameEn}
                </h2>
                <p className="text-[11px] text-blue-600 font-bold">
                  {lang === 'bn' ? 'গ্রাহক ও বিলিং কন্ট্রোল প্যানেল' : 'Billing & Customer Control'}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition active:scale-95 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Switch Bar inside Drawer */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{lang === 'bn' ? 'ভাষা নির্বাচন:' : 'Language:'}</span>
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={onToggleLanguage}
                className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  lang === 'bn' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={onToggleLanguage}
                className={`px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  lang === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 text-sm">

          {/* AI Developer Copilot Button (Top Featured) */}
          <div>
            <button
              onClick={() => { onOpenAIChat(); onClose(); }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold transition shadow-md text-left active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/20 text-yellow-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black block leading-tight">
                    {lang === 'bn' ? '✨ আইএসপি এআই ডেভেলপার' : '✨ ISP AI Developer'}
                  </span>
                  <span className="text-[10px] text-blue-100 font-medium">
                    {lang === 'bn' ? 'ভবিষ্যতে অ্যাপ ডেভেলপ করুন সম্পূর্ণ ফ্রিতে' : 'Develop & expand new features for free'}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-yellow-400 text-slate-900 shadow-xs uppercase">
                FREE
              </span>
            </button>
          </div>

          {/* Quick Dashboard Link */}
          <div>
            <button
              onClick={() => { onOpenDashboard(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 font-bold transition border border-slate-200 text-left active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📊</span>
                <span>{lang === 'bn' ? 'বিলের হিসাব ড্যাশবোর্ড' : 'Billing Accounts Dashboard'}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Core Control Menu */}
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 shadow-xs">
            <div className="px-2 pt-1 pb-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center justify-between">
              <span>{lang === 'bn' ? 'প্রধান কন্ট্রোল মেনু' : 'Main Control Menu'}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded font-bold">CORE</span>
            </div>

            {/* 1. Bills collection */}
            <button
              onClick={() => { onOpenBillCollection(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold transition shadow-xs text-left active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-emerald-100 shrink-0" />
                <span className="text-xs font-bold">{lang === 'bn' ? 'বিল কালেকশন (কাউন্টার)' : 'Bills Collection'}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-white text-emerald-700 shadow-xs uppercase tracking-wide">
                PAY
              </span>
            </button>

            {/* 2. Customer directory */}
            <button
              onClick={() => { onFilterAll(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition text-left active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">{lang === 'bn' ? 'কাস্টমার ডিরেক্টরি' : 'Customer Directory'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{lang === 'bn' ? 'এডিট ও গ্রাহকের তথ্য পরিচালনা' : 'Edit & manage all customers'}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-blue-700 border border-slate-200">
                {formatNumber(totalCount, lang)}
              </span>
            </button>

            {/* 3. Paid bill list */}
            <button
              onClick={() => { 
                if (onOpenPaidBills) {
                  onOpenPaidBills();
                } else {
                  onFilterPaidOnly();
                }
                onClose(); 
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-700 border border-slate-200 transition text-left active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold">{lang === 'bn' ? 'পরিশোধিত তালিকা (পেইড বিল)' : 'Paid Bills List'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {formatNumber(paidCount, lang)}
              </span>
            </button>

            {/* 4. Deactive Customers List */}
            <button
              onClick={() => { 
                if (onFilterInactive) {
                  onFilterInactive();
                }
                onClose(); 
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 hover:border-rose-300 transition text-left active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <UserX className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">{lang === 'bn' ? 'ডিঅ্যাক্টিভ গ্রাহক তালিকা' : 'Deactive Customers'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{lang === 'bn' ? 'লাইন বন্ধ ও সক্রিয় করার অপশন' : 'Line cut-off & reactivation'}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                {formatNumber(inactiveCount || 0, lang)}
              </span>
            </button>

            {/* 4. Dedicated Bill Sheet Button */}
            <button
              onClick={() => { onOpenBillSheet(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 transition text-left active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">{lang === 'bn' ? 'বিল শিট (দৈনিক ও মাসিক আদায়)' : 'Bill Sheet (Daily & Monthly)'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{lang === 'bn' ? 'প্রতিদিনের কালেকশন রেজিস্টার ও প্রিন্ট' : 'Daily collection sheet & print'}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                SHEET
              </span>
            </button>

            {/* 5. SMS Recharge & Pack Purchase Button */}
            <button
              onClick={() => { 
                if (onOpenSMSRecharge) onOpenSMSRecharge();
                onClose(); 
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-emerald-700 border border-slate-200 transition text-left active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold block">{lang === 'bn' ? 'এসএমএস কিনুন ও রিচার্জ' : 'Buy SMS & Recharge'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{lang === 'bn' ? 'স্বয়ংক্রিয় মেসেজ প্যাক' : 'Auto SMS on Payment'}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {formatNumber(settings.smsBalance || 0, lang)} SMS
              </span>
            </button>

            {/* 6. MikroTik sync */}
            <button
              onClick={() => { onOpenMikrotik(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition text-left active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <Network className="w-4 h-4 text-cyan-600 shrink-0" />
                <span className="text-xs font-bold">{lang === 'bn' ? 'মাইক্রোটিক রাউটার সিঙ্ক' : 'MikroTik Sync'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                RouterOS
              </span>
            </button>
          </div>

          {/* Dedicated Settings Group */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'bn' ? 'সেটিংস মেনু (Settings)' : 'Settings'}</span>
              </span>
              <button
                onClick={() => { onOpenSettings(); onClose(); }}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                {lang === 'bn' ? 'সব দেখুন →' : 'All →'}
              </button>
            </div>

            {/* Google Drive & Backup Subgroup */}
            <div className="space-y-1 pt-1 border-t border-slate-200">
              <div className="px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Google Drive & Backup
              </div>

              {/* Google Drive Cloud Backup */}
              <button
                onClick={() => { onOpenGoogleDrive(); onClose(); }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-white transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Cloud className="w-3.5 h-3.5 text-blue-500" />
                  <span>Google Drive ব্যাকআপ</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {settings.googleDriveConnected ? 'সংযুক্ত' : 'অফলাইন'}
                </span>
              </button>

              {/* JSON Backup Download */}
              <button
                onClick={() => { onExportJson(); onClose(); }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-white transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.offlineJsonExport}</span>
                </div>
                <span className="text-[10px] text-slate-400">JSON</span>
              </button>

              {/* JSON Restore / Upload */}
              <button
                onClick={() => { onImportJson(); onClose(); }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-white transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.offlineJsonImport}</span>
                </div>
                <span className="text-[10px] text-slate-400">JSON</span>
              </button>
            </div>

            {/* Admin Password & Lock Subgroup */}
            <div className="space-y-1 pt-1 border-t border-slate-200">
              <div className="px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Admin Security
              </div>

              <button
                onClick={() => { onOpenSettings('security'); onClose(); }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition text-left cursor-pointer text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>{lang === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড ও আইডি পরিবর্তন' : 'Change Admin Password'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">
                  {settings.adminPassword || '123'}
                </span>
              </button>
            </div>
          </div>

          {/* Customer Quick Add & Due List */}
          <div>
            <div className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {lang === 'bn' ? 'গ্রাহক ও তাগাদা' : 'Customers & Reminders'}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { onOpenAddCustomer(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold transition text-left active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  <span>{t.addNewCustomer}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-75" />
              </button>

              <button
                onClick={() => { onFilterDueOnly(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{t.dueBillingList}</span>
                </div>
                {dueCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {formatNumber(dueCount, lang)}
                  </span>
                )}
              </button>

              <button
                onClick={() => { onOpenBulkReminder(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-rose-600" />
                  <span>{t.bulkReminder}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                  {lang === 'bn' ? 'বকেয়া' : 'Due'}
                </span>
              </button>

              <button
                onClick={() => { onOpenBroadcastMessage(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'bn' ? 'সকলকে একসাথে SMS ও WhatsApp' : 'Bulk SMS & WhatsApp to All'}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  ALL
                </span>
              </button>
            </div>
          </div>

          {/* Zones */}
          <div>
            <div className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {lang === 'bn' ? 'এলাকা ও বক্স জোন' : 'Zones & Boxes'}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => { onOpenZoneBillingBreakdown(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{t.zoneBillingBreakdown}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => { onOpenZoneManager(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{t.zoneManager}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Install & Session */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <button
              onClick={() => { onOpenInstallGuide(); onClose(); }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 transition text-left cursor-pointer font-semibold"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>{t.installAppGuide}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-200 text-blue-900 font-bold">PWA</span>
            </button>

            {onOpenPermanentLink && (
              <button
                onClick={() => { onOpenPermanentLink(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition text-left cursor-pointer border border-slate-200 bg-white"
              >
                <div className="flex items-center gap-2.5">
                  <Link2 className="w-4 h-4 text-blue-600" />
                  <span>{lang === 'bn' ? 'স্থায়ী ওয়েবসাইট লিংক ও সংরক্ষণ' : 'Permanent App URL & Web Address'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            {onLogout && (
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-rose-700 hover:text-rose-800 hover:bg-rose-100 transition text-left cursor-pointer border border-rose-200 bg-rose-50 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span className="font-bold text-xs">{lang === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট থেকে লগআউট' : 'Sign Out / Logout'}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">
                  {lang === 'bn' ? 'লগআউট' : 'Logout'}
                </span>
              </button>
            )}

            {onLockApp && !onLogout && (
              <button
                onClick={() => { onLockApp(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-amber-800 hover:bg-amber-100 transition text-left cursor-pointer border border-amber-200 bg-amber-50"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>{lang === 'bn' ? 'স্ক্রিন লক করুন' : 'Lock Screen'}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                  PIN
                </span>
              </button>
            )}
          </div>

          {/* Danger Zone */}
          <div className="pt-2 border-t border-slate-200">
            <div className="space-y-1">
              <button
                onClick={() => { onClearAllData(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition text-left cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 text-rose-500" />
                  <span>{t.clearAllData}</span>
                </div>
              </button>

              <button
                onClick={() => { onLoadDemoData(); onClose(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition text-left cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>{t.loadDemoData}</span>
                </div>
              </button>
            </div>
          </div>

        </div>

      </aside>
    </div>
  );
};
