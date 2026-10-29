import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogIn, 
  AlertCircle, 
  HelpCircle, 
  Sparkles,
  PhoneCall,
  Globe
} from 'lucide-react';
import { ISPSettings } from '../types/isp';
import { IJLogo } from './IJLogo';

interface AdminLoginPortalProps {
  settings: ISPSettings;
  onLoginSuccess: (rememberMe: boolean) => void;
  onToggleLanguage?: () => void;
}

export const AdminLoginPortal: React.FC<AdminLoginPortalProps> = ({
  settings,
  onLoginSuccess,
  onToggleLanguage
}) => {
  const configuredUsername = (settings.adminUsername || 'admin').trim().toLowerCase();
  const configuredPassword = (settings.adminPassword || '123').trim();
  const adminPhone = settings.phone ? settings.phone.replace(/[^0-9]/g, '') : '01402180757';
  const adminEmail = (settings.email || 'mdprinceahmed706@gmail.com').toLowerCase().trim();

  const [username, setUsername] = useState(settings.adminUsername || 'admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // Default true so page refresh / reload preserves session
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotHelper, setShowForgotHelper] = useState(false);

  const lang = settings.language || 'bn';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const inputUser = (username || configuredUsername).trim().toLowerCase();
    const inputPass = password.trim();

    if (!inputPass) {
      setErrorMessage(lang === 'bn' ? 'অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড লিখুন।' : 'Please enter admin password.');
      return;
    }

    setIsLoading(true);

    // Smooth auth check simulation
    setTimeout(() => {
      const isUserValid = 
        inputUser === configuredUsername ||
        inputUser === 'admin' ||
        inputUser === adminPhone ||
        inputUser.replace(/[^0-9]/g, '') === adminPhone ||
        inputUser === adminEmail;

      const isPassValid = 
        inputPass === configuredPassword ||
        (settings.adminPin && inputPass === settings.adminPin);

      if (isUserValid && isPassValid) {
        setIsLoading(false);
        onLoginSuccess(rememberMe);
      } else {
        setIsLoading(false);
        if (!isUserValid && isPassValid) {
          setErrorMessage(lang === 'bn' ? 'ইউজারনেম সঠিক নয়! ডিফল্ট ইউজারনেম: admin' : 'Invalid username! Default: admin');
        } else if (isUserValid && !isPassValid) {
          setErrorMessage(lang === 'bn' ? 'পাসওয়ার্ড সঠিক নয়! ডিফল্ট পাসওয়ার্ড: 123' : 'Incorrect password! Default: 123');
        } else {
          setErrorMessage(lang === 'bn' ? 'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়! অনুগ্রহ করে চেক করে পুনরায় লিখুন।' : 'Invalid username or password! Please try again.');
        }
      }
    }, 150);
  };

  const handleAutoFillDefault = () => {
    setUsername(settings.adminUsername || 'admin');
    setPassword(settings.adminPassword || '123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* Background Soft Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[450px] h-[450px] bg-sky-100/60 rounded-full blur-[140px]" />
      </div>

      {/* Top Bar with Language Toggle & Support Helpline */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <IJLogo size="sm" showGlow={false} />
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 block">
              {lang === 'bn' ? settings.companyNameBn || 'আইজে নেটওয়ার্ক' : settings.companyNameEn || 'IJ Network'}
            </span>
            <span className="text-[11px] text-blue-600 font-semibold block">
              {lang === 'bn' ? 'বিলিং ম্যানেজমেন্ট সিস্টেম' : 'Billing Management System'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleLanguage && (
            <button
              type="button"
              onClick={onToggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">{settings.phone || '01402-180757'}</span>
          </div>
        </div>
      </header>

      {/* Center Main Login Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-[430px]">
          
          {/* Main Card */}
          <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 backdrop-blur-xl relative">
            
            {/* Top Badge & Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs mb-1">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {lang === 'bn' ? 'অ্যাডমিন প্রবেশদ্বার' : 'Admin Sign In'}
              </h1>
              
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {lang === 'bn' 
                  ? 'বিলিং সফটওয়্যারে প্রবেশ করতে আপনার অ্যাডমিন আইডি ও পাসওয়ার্ড দিন' 
                  : 'Enter your admin credentials to access the billing dashboard'}
              </p>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-snug font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === 'bn' ? 'অ্যাডমিন ইউজারনেম (Username)' : 'Admin Username'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    autoComplete="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder={lang === 'bn' ? 'ইউজারনেম লিখুন (যেমন: admin)' : 'Enter username (e.g. admin)'}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    {lang === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড (Password)' : 'Admin Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotHelper(!showForgotHelper)}
                    className="text-[11px] text-blue-600 hover:text-blue-700 transition font-bold cursor-pointer"
                  >
                    {lang === 'bn' ? 'পাসওয়ার্ড মনে নেই?' : 'Need Help?'}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder={lang === 'bn' ? 'পাসওয়ার্ড লিখুন' : 'Enter password'}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>{lang === 'bn' ? 'এই ডিভাইসে লগইন মনে রাখুন' : 'Remember this device'}</span>
                </label>
              </div>

              {/* Forgot Password Helper Card */}
              {showForgotHelper && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 font-bold text-blue-800 text-xs">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>{lang === 'bn' ? 'লগইন তথ্য ও প্রাথমিক পাসওয়ার্ড' : 'Default Credentials'}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {lang === 'bn' 
                      ? 'প্রাথমিক ডিফল্ট ইউজারনেম: admin এবং পাসওয়ার্ড: 123 (সফটওয়্যারে ঢোকার পর আপনি সেটিংসে গিয়ে যেকোনো সময় পরিবর্তন করতে পারবেন)।' 
                      : 'Default username: admin and password: 123. You can change them anytime in Settings.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleAutoFillDefault}
                    className="mt-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                  >
                    {lang === 'bn' ? '➔ এই বক্সে অটো-পূরণ করুন' : '➔ Auto fill credentials'}
                  </button>
                </div>
              )}

              {/* Sign In Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 active:scale-[0.98] transition cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'অ্যাডমিন অ্যাকাউন্টে প্রবেশ করুন' : 'Sign In to Admin Panel'}</span>
                  </>
                )}
              </button>

            </form>

            {/* Quick Auto-Fill Default Chip */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'bn' ? 'ডিফল্ট আইডি: admin | পাসওয়ার্ড: 123' : 'Default: admin / 123'}</span>
              </span>
              <button
                type="button"
                onClick={handleAutoFillDefault}
                className="font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
              >
                {lang === 'bn' ? 'অটো-ফিল' : 'Auto Fill'}
              </button>
            </div>

          </div>

          {/* Security Guarantee Note */}
          <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'bn' ? 'নিরাপদ এনক্রিপ্টেড ব্রডব্যান্ড বিলিং সিস্টেম' : 'Encrypted ISP Billing Gateway'}</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/60">
        <span>© {new Date().getFullYear()} {settings.companyNameEn || 'IJ Network'}. All Rights Reserved.</span>
      </footer>

    </div>
  );
};
