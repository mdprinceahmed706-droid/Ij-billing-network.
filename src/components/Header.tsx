import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Globe, 
  Calendar, 
  ExternalLink, 
  Wifi, 
  WifiOff, 
  Lock, 
  Link2, 
  LogOut, 
  KeyRound, 
  Sparkles 
} from 'lucide-react';
import { Language, ISPSettings } from '../types/isp';
import { translations, getMonthName } from '../i18n/translations';
import { IJLogo } from './IJLogo';

interface HeaderProps {
  settings: ISPSettings;
  currentMonthKey: string;
  onMonthChange: (monthKey: string) => void;
  onOpenDrawer: () => void;
  onToggleLanguage: () => void;
  onOpenInstallGuide: () => void;
  onOpenPermanentLink?: () => void;
  onLockApp?: () => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  onOpenAIChat?: () => void;
  dueCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentMonthKey,
  onMonthChange,
  onOpenDrawer,
  onToggleLanguage,
  onOpenInstallGuide,
  onOpenPermanentLink,
  onLockApp,
  onLogout,
  onOpenSettings,
  onOpenAIChat,
  dueCount
}) => {
  const lang = settings.language;
  const t = translations[lang];

  // Online / Offline state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // List of available months
  const months = [
    '2026-01', '2026-02', '2026-03', '2026-04',
    '2026-05', '2026-06', '2026-07', '2026-08',
    '2026-09', '2026-10', '2026-11', '2026-12'
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Left: Menu Drawer Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDrawer}
            aria-label="Open Menu Drawer"
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200 shadow-xs active:scale-95 cursor-pointer flex items-center gap-2 group"
          >
            <Menu className="w-5 h-5 text-blue-600 group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden md:inline font-bold text-xs tracking-wide uppercase text-slate-700">
              {lang === 'bn' ? 'মেনু' : 'Menu'}
            </span>
            {dueCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-sm">
                {dueCount}
              </span>
            )}
          </button>
        </div>

        {/* Center: IJ Network Logo & Brand with Month Selector */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative group cursor-pointer" onClick={onOpenDrawer} title={lang === 'bn' ? 'মেনু খুলুন' : 'Open Menu'}>
            <IJLogo size="sm" className="sm:hidden" showGlow={false} />
            <IJLogo size="md" className="hidden sm:inline-flex" showGlow={false} />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-slate-900">
                {lang === 'bn' ? settings.companyNameBn : settings.companyNameEn}
              </h1>
              
              {/* Online/Offline status badge */}
              {!isOnline ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                  <WifiOff className="w-3 h-3 text-amber-600" />
                  <span>{lang === 'bn' ? 'অফলাইন' : 'Offline'}</span>
                </span>
              ) : (
                <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-md border border-blue-200 uppercase">
                  ISP Billing
                </span>
              )}
            </div>
            
            {/* Month Selector dropdown */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <select
                value={currentMonthKey}
                onChange={(e) => onMonthChange(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 cursor-pointer focus:outline-none border-b border-dashed border-blue-400 pb-0.5 transition"
              >
                {months.map((m) => (
                  <option key={m} value={m} className="bg-white text-slate-900">
                    {getMonthName(m, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right: Actions (AI Copilot, Link, Lock, Settings, Language) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Prominent ISP AI Developer Copilot Button */}
          {onOpenAIChat && (
            <button
              onClick={onOpenAIChat}
              title={lang === 'bn' ? 'আইএসপি এআই ডেভেলপার ও ফ্রি কোডিং কোপাইলট' : 'ISP AI Developer & Free Copilot'}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer transition animate-pulse hover:animate-none"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'AI ডেভেলপার' : 'AI Copilot'}</span>
            </button>
          )}

          {/* Permanent URL Shortcut */}
          {onOpenPermanentLink && (
            <button
              onClick={onOpenPermanentLink}
              title={lang === 'bn' ? 'স্থায়ী ওয়েবসাইট লিংক দেখুন ও কপি করুন' : 'Permanent App URL'}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 border border-slate-200 transition active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-semibold shadow-xs"
            >
              <Link2 className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">{lang === 'bn' ? 'স্থায়ী লিংক' : 'App URL'}</span>
            </button>
          )}

          {/* Quick Admin Password & Settings Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title={lang === 'bn' ? `অ্যাডমিন সেটিংস ও পাসওয়ার্ড (${settings.adminUsername || 'admin'})` : 'Admin Credentials & Settings'}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-amber-700 border border-slate-200 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline font-mono">{settings.adminUsername || 'admin'}</span>
            </button>
          )}

          {/* Quick Lock / Logout Buttons */}
          {onLogout && (
            <button
              onClick={onLogout}
              title={lang === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট থেকে লগআউট করুন' : 'Sign Out / Lock Admin'}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          )}

          {onLockApp && !onLogout && (
            <button
              onClick={onLockApp}
              title={lang === 'bn' ? 'স্ক্রিন লক করুন' : 'Lock Screen'}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition active:scale-95 cursor-pointer flex items-center gap-1 text-xs font-semibold shadow-xs"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">{lang === 'bn' ? 'লক' : 'Lock'}</span>
            </button>
          )}

          {/* Direct Chrome / Standalone Open Button */}
          <button
            onClick={onOpenInstallGuide}
            title={lang === 'bn' ? 'সরাসরি ক্রোম ব্রাউজারে খুলুন বা ফোনে ইনস্টল করুন' : 'Open in Chrome / Install App'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs active:scale-95 cursor-pointer transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'bn' ? 'ইনস্টল' : 'Install'}</span>
          </button>

          {/* Quick Language Toggle (English ↔ বাংলা) */}
          <button
            onClick={onToggleLanguage}
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition font-bold text-xs active:scale-95 shadow-xs cursor-pointer"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-xs">
              {lang === 'bn' ? 'ENG' : 'বাংলা'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
