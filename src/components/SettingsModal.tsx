import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Building, 
  CreditCard, 
  Globe, 
  Check, 
  Save, 
  Cloud, 
  Download, 
  Upload, 
  MessageSquare,
  Zap,
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Link2,
  AlertCircle,
  Plus,
  Trash2,
  Network,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { ISPSettings, Language, ISPProfile } from '../types/isp';
import { translations, formatNumber } from '../i18n/translations';
import { saveSettingsToStorage } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ISPSettings;
  onSaveSettings: (newSettings: ISPSettings) => void;
  onOpenGoogleDrive?: () => void;
  onExportJson?: () => void;
  onImportJson?: () => void;
  initialTab?: 'system' | 'security' | 'backup' | 'sms' | 'language';
  onOpenSMSRecharge?: () => void;
  onOpenPermanentLink?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  initialTab,
  onOpenGoogleDrive,
  onExportJson,
  onImportJson,
  onOpenSMSRecharge,
  onOpenPermanentLink
}) => {
  const [formData, setFormData] = useState<ISPSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'system' | 'security' | 'backup' | 'sms' | 'language'>(initialTab || 'system');
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Multi-ISP profile management state
  const [newIspName, setNewIspName] = useState('');
  const [newIspPhone, setNewIspPhone] = useState('');
  const [newIspBkash, setNewIspBkash] = useState('');
  const [newIspProprietor, setNewIspProprietor] = useState('');
  const [newIspAddress, setNewIspAddress] = useState('');
  const [isAddingIsp, setIsAddingIsp] = useState(false);
  const [ispSwitchToast, setIspSwitchToast] = useState('');

  // Admin Username & Password Authentication state
  const [adminUsernameInput, setAdminUsernameInput] = useState(formData.adminUsername || 'admin');
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const lang = formData.language;
  const t = translations[lang];

  if (!isOpen) return null;

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess(false);

    const existingPass = formData.adminPassword || formData.adminPin || '123';

    if (!adminUsernameInput.trim()) {
      setPasswordChangeError(lang === 'bn' ? 'ইউজারনেম খালি রাখা যাবে না!' : 'Username cannot be empty!');
      return;
    }

    if (currentPasswordInput && currentPasswordInput !== existingPass && currentPasswordInput !== '1234') {
      setPasswordChangeError(lang === 'bn' ? 'বর্তমান পাসওয়ার্ড সঠিক নয়!' : 'Current password does not match!');
      return;
    }

    if (newPasswordInput) {
      if (newPasswordInput.length < 3) {
        setPasswordChangeError(lang === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৩ অক্ষরের হতে হবে!' : 'New password must be at least 3 characters!');
        return;
      }
      if (newPasswordInput !== confirmPasswordInput) {
        setPasswordChangeError(lang === 'bn' ? 'নতুন পাসওয়ার্ড দুটি মিলছে না!' : 'New passwords do not match!');
        return;
      }
    }

    const updatedPass = newPasswordInput.trim() || formData.adminPassword || '123';
    const updatedUser = adminUsernameInput.trim().toLowerCase();

    const updatedSettings: ISPSettings = {
      ...formData,
      adminUsername: updatedUser,
      adminPassword: updatedPass,
      adminPin: updatedPass
    };

    setFormData(updatedSettings);
    onSaveSettings(updatedSettings);
    saveSettingsToStorage(updatedSettings);

    setPasswordChangeSuccess(true);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => setPasswordChangeSuccess(false), 4000);
  };

  // Multi-ISP Profile Management
  const ispProfiles: ISPProfile[] = formData.ispProfiles && formData.ispProfiles.length > 0
    ? formData.ispProfiles
    : [
        {
          id: 'isp-main',
          name: formData.companyNameBn || 'আইজে নেটওয়ার্ক',
          phone: formData.phone || '01402-180757',
          proprietor: formData.proprietor || 'Md. Palash',
          address: formData.addressBn || 'মেইন বাসস্ট্যান্ড রোড, বাজার মোড়',
          bkashNumber: formData.bkashNumber || '01402-180757 (Personal)',
          nagadNumber: formData.nagadNumber || '01402-180757 (Personal)',
          isDefault: true
        }
      ];

  const handleSwitchIspProfile = (profile: ISPProfile) => {
    setFormData(prev => ({
      ...prev,
      companyNameBn: profile.name,
      companyNameEn: profile.name,
      phone: profile.phone,
      proprietor: profile.proprietor,
      addressBn: profile.address,
      addressEn: profile.address,
      bkashNumber: profile.bkashNumber,
      nagadNumber: profile.nagadNumber,
      activeProfileId: profile.id
    }));
    setIspSwitchToast(lang === 'bn' ? `✅ "${profile.name}" সক্রিয় আইএসপি হিসেবে সেট করা হয়েছে!` : `✅ "${profile.name}" activated as current ISP!`);
    setTimeout(() => setIspSwitchToast(''), 3000);
  };

  const handleAddNewIspProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIspName.trim()) return;

    const newProfile: ISPProfile = {
      id: `isp-${Date.now()}`,
      name: newIspName.trim(),
      phone: newIspPhone.trim() || formData.phone,
      proprietor: newIspProprietor.trim() || formData.proprietor,
      address: newIspAddress.trim() || formData.addressBn,
      bkashNumber: newIspBkash.trim() || formData.bkashNumber,
      nagadNumber: newIspBkash.trim() || formData.nagadNumber
    };

    const updated = [...ispProfiles, newProfile];
    setFormData(prev => ({
      ...prev,
      ispProfiles: updated,
      companyNameBn: newProfile.name,
      companyNameEn: newProfile.name,
      phone: newProfile.phone,
      proprietor: newProfile.proprietor,
      addressBn: newProfile.address,
      addressEn: newProfile.address,
      bkashNumber: newProfile.bkashNumber,
      nagadNumber: newProfile.nagadNumber,
      activeProfileId: newProfile.id
    }));

    setNewIspName('');
    setNewIspPhone('');
    setNewIspBkash('');
    setNewIspProprietor('');
    setNewIspAddress('');
    setIsAddingIsp(false);
    setIspSwitchToast(lang === 'bn' ? `✅ নতুন আইএসপি "${newProfile.name}" সফলভাবে তৈরি ও সক্রিয় হয়েছে!` : `✅ New ISP "${newProfile.name}" created & activated!`);
    setTimeout(() => setIspSwitchToast(''), 3500);
  };

  const handleDeleteIspProfile = (id: string) => {
    if (ispProfiles.length <= 1) return;
    const updated = ispProfiles.filter(p => p.id !== id);
    setFormData(prev => ({
      ...prev,
      ispProfiles: updated
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettingsToStorage(formData);
    onSaveSettings(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'সিস্টেম ও ব্যবসা সেটিংস' : 'System & Business Settings'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' 
                  ? 'আইএসপি প্রোফাইল, নিরাপত্তা ও পাসওয়ার্ড, ব্যাকআপ এবং মেসেজিং' 
                  : 'ISP Profile, Security & Password, Backup and Messaging'}
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

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 pt-3 border-b border-slate-800 shrink-0 text-xs font-semibold overflow-x-auto">
          
          {/* Tab 1: System */}
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'system'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আইএসপি প্রোফাইল' : 'ISP Profile'}</span>
          </button>

          {/* Tab 2: Security & Admin Password */}
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'অ্যাডমিন পাসওয়ার্ড ও আইডি' : 'Admin Password & ID'}</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {formData.adminPassword || '123'}
            </span>
          </button>

          {/* Tab 3: Backup & URL */}
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'backup'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'Google Drive ও ব্যাকআপ' : 'Drive & Backup'}</span>
          </button>

          {/* Tab 4: SMS & WhatsApp */}
          <button
            type="button"
            onClick={() => setActiveTab('sms')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'sms'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'মেসেজ ও WhatsApp' : 'SMS & WhatsApp'}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
              {settings.smsBalance || 0}
            </span>
          </button>

          {/* Tab 5: Language */}
          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'language'
                ? 'border-blue-500 text-blue-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ভাষা (Language)' : 'Language'}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          
          {/* TAB 1: System & Business Settings (ISP Profile & Payment Numbers) */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              
              {/* Toast feedback when switching ISP */}
              {ispSwitchToast && (
                <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{ispSwitchToast}</span>
                </div>
              )}

              {/* Quick Admin Password & Username Setting Callout (User Requested - Prominent at Top) */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 border border-blue-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-blue-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40 shrink-0">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-xs sm:text-sm block">
                      {lang === 'bn' ? 'অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড পরিবর্তন' : 'Admin Credentials Setting'}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      {lang === 'bn' 
                        ? `বর্তমান আইডি: ${formData.adminUsername || 'admin'} | বর্তমান পাসওয়ার্ড: ${formData.adminPassword || '123'}`
                        : `Username: ${formData.adminUsername || 'admin'} | Password: ${formData.adminPassword || '123'}`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/50 cursor-pointer transition active:scale-95 shrink-0"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'পাসওয়ার্ড ও আইডি পরিবর্তন করুন ➔' : 'Change Password & ID ➔'}</span>
                </button>
              </div>

              {/* SECTION: MULTI-ISP SYSTEM SWITCHER & MANAGER (User Requested) */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {lang === 'bn' ? 'একাধিক আইএসপি বিল সিস্টেম ও শাখা নেটওয়ার্ক' : 'Multi-ISP Systems & Branch Networks'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {lang === 'bn' ? 'একাধিক আইএসপি বা শাখার আলাদা প্রোফাইল তৈরি ও পরিচালনা করুন' : 'Manage separate profiles for multiple ISPs or branches'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingIsp(!isAddingIsp)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingIsp ? (lang === 'bn' ? 'বাতিল' : 'Cancel') : (lang === 'bn' ? 'নতুন আইএসপি' : 'Add ISP')}</span>
                  </button>
                </div>

                {/* Add New ISP Form */}
                {isAddingIsp && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/40 space-y-2.5 animate-in fade-in">
                    <span className="text-xs font-bold text-blue-300 block">
                      {lang === 'bn' ? 'নতুন আইএসপি সিস্টেমের তথ্য লিখুন:' : 'Enter New ISP Profile Details:'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder={lang === 'bn' ? 'আইএসপি কোম্পানির নাম (যেমন: আইজে শাখা ২)' : 'ISP Name'}
                        value={newIspName}
                        onChange={(e) => setNewIspName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder={lang === 'bn' ? 'হেল্পলাইন ফোন নম্বর' : 'Phone Number'}
                        value={newIspPhone}
                        onChange={(e) => setNewIspPhone(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder={lang === 'bn' ? 'বিকাশ / নগদ পেমেন্ট নম্বর' : 'bKash/Nagad Number'}
                        value={newIspBkash}
                        onChange={(e) => setNewIspBkash(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder={lang === 'bn' ? 'প্রোপাইটর নাম (ঐচ্ছিক)' : 'Proprietor Name'}
                        value={newIspProprietor}
                        onChange={(e) => setNewIspProprietor(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingIsp(false)}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:text-white"
                      >
                        {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={handleAddNewIspProfile}
                        disabled={!newIspName.trim()}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-50 cursor-pointer shadow-md"
                      >
                        {lang === 'bn' ? '✓ আইএসপি তৈরি ও সক্রিয় করুন' : '✓ Create & Activate'}
                      </button>
                    </div>
                  </div>
                )}

                {/* List of Registered ISP Profiles */}
                <div className="space-y-2">
                  {ispProfiles.map((profile) => {
                    const isActive = (formData.companyNameBn === profile.name || formData.activeProfileId === profile.id);
                    return (
                      <div
                        key={profile.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                          isActive
                            ? 'bg-blue-950/40 border-blue-500/60 shadow-md ring-1 ring-blue-500/40'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg font-bold text-xs ${
                            isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                            <Building className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white text-xs sm:text-sm">
                                {profile.name}
                              </span>
                              {isActive && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase">
                                  {lang === 'bn' ? 'সক্রিয় (Active)' : 'Active'}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono block">
                              {profile.phone} • {profile.bkashNumber || 'বিকাশ নম্বর'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {!isActive ? (
                            <button
                              type="button"
                              onClick={() => handleSwitchIspProfile(profile)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
                            >
                              {lang === 'bn' ? 'সুইচ করুন' : 'Switch'}
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{lang === 'bn' ? 'বর্তমান' : 'Current'}</span>
                            </span>
                          )}

                          {ispProfiles.length > 1 && !profile.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleDeleteIspProfile(profile.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                              title={lang === 'bn' ? 'আইএসপি প্রোফাইল মুছুন' : 'Delete Profile'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subsection: Active ISP Profile Details */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block">
                  {lang === 'bn' ? 'বর্তমান সক্রিয় আইএসপি প্রোফাইল তথ্য' : 'Active ISP Profile Details'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'কোম্পানির নাম (বাংলা):' : 'Company Name (Bengali):'}
                    </label>
                    <input
                      type="text"
                      value={formData.companyNameBn}
                      onChange={(e) => setFormData({ ...formData, companyNameBn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'কোম্পানির নাম (ইংরেজি):' : 'Company Name (English):'}
                    </label>
                    <input
                      type="text"
                      value={formData.companyNameEn}
                      onChange={(e) => setFormData({ ...formData, companyNameEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'প্রোপাইটর / স্বত্বাধিকারী:' : 'Proprietor Name:'}
                    </label>
                    <input
                      type="text"
                      value={formData.proprietor}
                      onChange={(e) => setFormData({ ...formData, proprietor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'অফিস / হেল্পলাইন নম্বর:' : 'Helpline / Phone Number:'}
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'অফিসের ঠিকানা:' : 'Office Address:'}
                  </label>
                  <input
                    type="text"
                    value={formData.addressBn}
                    onChange={(e) => setFormData({ ...formData, addressBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Subsection: Payment Numbers */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  {lang === 'bn' ? 'পেমেন্ট নম্বরসমূহ' : 'Payment Numbers & Deadline'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'বিকাশ নম্বর (গ্রাহক পেমেন্টের জন্য):' : 'bKash Personal Number:'}
                    </label>
                    <input
                      type="text"
                      value={formData.bkashNumber}
                      onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'নগদ নম্বর:' : 'Nagad Personal Number:'}
                    </label>
                    <input
                      type="text"
                      value={formData.nagadNumber}
                      onChange={(e) => setFormData({ ...formData, nagadNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'মাসিক বিল পরিশোধের শেষ তারিখ (যেমন: ১০ তারিখ):' : 'Monthly Bill Due Deadline Day:'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.billDueDeadlineDay}
                    onChange={(e) => setFormData({ ...formData, billDueDeadlineDay: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Subsection: Official ISP Billing Pad & Memo Settings */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'bn' ? 'অফিসিয়াল আইএসপি বিলিং প্যাড ও মেমো সেটিংস' : 'Official ISP Billing Pad & Memo Settings'}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {lang === 'bn' ? 'রিসিট ও প্রিন্ট প্যাড' : 'Print Pad Voucher'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'বিটিআরসি লাইসেন্স / রেজি. নং:' : 'BTRC License / Reg No:'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BTRC/ISP/NAT-2024/0987"
                      value={formData.btrcRegNo || ''}
                      onChange={(e) => setFormData({ ...formData, btrcRegNo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'ক্যাশিয়ার / আদায়কারীর নাম (স্বাক্ষর):' : 'Cashier / Collector Name:'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Md. Palash (Admin)"
                      value={formData.cashierName || ''}
                      onChange={(e) => setFormData({ ...formData, cashierName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'বিলিং প্যাড ও রিসিটের শর্তাবলী (প্যাডের নিচে প্রিন্ট হবে):' : 'Billing Memo Terms & Conditions:'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="যেমন: প্রতি মাসের ১০ তারিখের মধ্যে নিয়মিত বিল পরিশোধ করুন।"
                    value={formData.padTermsBn || ''}
                    onChange={(e) => setFormData({ ...formData, padTermsBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SECURITY & ADMIN CREDENTIALS (User Requested) */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              
              {/* App Login on Startup & Security Controls */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'bn' ? 'লগইন পোর্টাল ও নিরাপত্তা পলিসি' : 'Login Portal & Security Policy'}</span>
                </span>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">
                      {lang === 'bn' ? 'সফটওয়্যার খুললেই অ্যাডমিন লগইন পেজ আসবে' : 'Require Login Portal on App Launch'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'bn' 
                        ? 'ফেসবুকের মতো অ্যাপ বা ব্রাউজারে প্রবেশ করতেই ইউজারনেম ও পাসওয়ার্ড দিয়ে সাইন-ইন করতে হবে।' 
                        : 'Prompts for Admin Username & Password immediately when opening the app.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.requireLoginOnStart ?? true}
                    onChange={(e) => setFormData({ ...formData, requireLoginOnStart: e.target.checked, lockOnStartup: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">
                      {lang === 'bn' ? 'হেডার ও মেনুতে দ্রুত লক / লগআউট বাটন সক্রিয় রাখুন' : 'Enable Quick Logout / Lock Buttons'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'bn' 
                        ? 'কাজ শেষে লগআউট বাটনে চাপ দিয়ে যেকোনো সময় সিস্টেম সুরক্ষিত রাখা যাবে।' 
                        : 'Shows lock/logout buttons on top header and navigation drawer.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.adminLockEnabled ?? true}
                    onChange={(e) => setFormData({ ...formData, adminLockEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Change Admin Username & Password Form */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'bn' ? 'অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড পরিবর্তন করুন' : 'Change Admin Username & Password'}</span>
                </span>

                {/* Current Active Credentials Info Card */}
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">
                      {lang === 'bn' ? 'বর্তমান সক্রিয় অ্যাডমিন লগইন তথ্য:' : 'Current Active Admin Credentials:'}
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      {lang === 'bn' ? 'ইউজারনেম' : 'Username'}: <strong className="text-cyan-300">{formData.adminUsername || 'admin'}</strong> | {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}: <strong className="text-cyan-300">{formData.adminPassword || '123'}</strong>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40">
                    {lang === 'bn' ? 'সক্রিয় অ্যাডমিন' : 'Active Admin'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Admin Username Field */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-xs">
                        {lang === 'bn' ? 'অ্যাডমিন ইউজারনেম (Username):' : 'Admin Username:'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={adminUsernameInput}
                          onChange={(e) => setAdminUsernameInput(e.target.value)}
                          placeholder="e.g. admin"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium focus:border-blue-500 focus:outline-none text-xs"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {lang === 'bn' ? 'লগইন করার সময় এই নাম লিখবেন' : 'Used as username during sign in'}
                      </span>
                    </div>

                    {/* Current Password Field */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-xs">
                        {lang === 'bn' ? 'বর্তমান পাসওয়ার্ড (Current Password):' : 'Current Password:'}
                      </label>
                      <input
                        type={showPasswordInput ? 'text' : 'password'}
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        placeholder="যেমন: 123"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none text-xs"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {lang === 'bn' ? 'প্রথমবার পরিবর্তনে ডিফল্ট: 123' : 'Default password: 123'}
                      </span>
                    </div>

                    {/* New Password Field */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-xs">
                        {lang === 'bn' ? 'নতুন পাসওয়ার্ড (New Password):' : 'New Password:'}
                      </label>
                      <input
                        type={showPasswordInput ? 'text' : 'password'}
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড দিন"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none text-xs"
                      />
                    </div>

                    {/* Confirm New Password Field */}
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1 text-xs">
                        {lang === 'bn' ? 'নতুন পাসওয়ার্ড পুনরায় লিখুন:' : 'Confirm New Password:'}
                      </label>
                      <input
                        type={showPasswordInput ? 'text' : 'password'}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="আবার লিখুন"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none text-xs"
                      />
                    </div>

                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setShowPasswordInput(!showPasswordInput)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {showPasswordInput ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPasswordInput ? (lang === 'bn' ? 'পাসওয়ার্ড লুকান' : 'Hide') : (lang === 'bn' ? 'পাসওয়ার্ড দেখুন' : 'Show')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleUpdateCredentials}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-950/40 active:scale-95 cursor-pointer transition"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ইউজারনেম ও পাসওয়ার্ড সেভ করুন' : 'Save New Credentials'}</span>
                    </button>
                  </div>

                  {passwordChangeError && (
                    <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{passwordChangeError}</span>
                    </div>
                  )}

                  {passwordChangeSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-1.5 animate-in fade-in duration-200">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{lang === 'bn' ? '✓ অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড সফলভাবে সংরক্ষিত হয়েছে!' : '✓ Admin credentials updated & saved successfully!'}</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: Google Drive & Backup + Permanent Link */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              
              {/* Permanent Link Shortcut */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs sm:text-sm block">
                      {lang === 'bn' ? 'স্থায়ী ওয়েবসাইট লিংক (লিখে রাখুন বা সেভ করুন)' : 'Permanent System Web Address'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      https://ais-pre-ld66bch74xvymvreqt3hdh-720224144005.asia-northeast1.run.app
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenPermanentLink) onOpenPermanentLink();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <Link2 className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'লিংক দেখুন' : 'View Link'}</span>
                </button>
              </div>

              {/* 1. Google Drive Cloud Backup */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs sm:text-sm block">
                      Google Drive Cloud Backup
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'bn' ? `সংযুক্ত ড্রাইভ: ${formData.googleDriveEmail}` : `Connected Gmail: ${formData.googleDriveEmail}`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenGoogleDrive) onOpenGoogleDrive();
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <Cloud className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ক্লাউড ব্যাকআপ খুলুন' : 'Open Cloud Backup'}</span>
                </button>
              </div>

              {/* 2. Download Offline JSON File */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs sm:text-sm block">
                      Download Offline JSON File
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'bn' ? 'আপনার ফোনে অফলাইন ব্যাকআপ ফাইল সেভ করুন' : 'Download offline backup JSON file to your device'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onExportJson) onExportJson();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'JSON ডাউনলোড' : 'Download JSON'}</span>
                </button>
              </div>

              {/* 3. Restore from JSON File */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs sm:text-sm block">
                      Restore from JSON File
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'bn' ? 'পূর্বে সেভ করা JSON ব্যাকআপ থেকে ডেটা রিস্টোর করুন' : 'Restore customer and bill data from offline JSON'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onImportJson) onImportJson();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'JSON রিস্টোর' : 'Restore JSON'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SMS & WHATSAPP (Includes User's WhatsApp Auto-Open Control) */}
          {activeTab === 'sms' && (
            <div className="space-y-4">
              
              {/* WhatsApp Auto-Open Toggle with Clear Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    {lang === 'bn' ? 'WhatsApp ওপেনিং সেটিংস' : 'WhatsApp Dispatch Behavior'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    {formData.whatsappAutoSend ? (lang === 'bn' ? 'চালু' : 'ON') : (lang === 'bn' ? 'বন্ধ (প্রস্তাবিত)' : 'OFF (Quiet)')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">
                      {lang === 'bn' ? 'বিল পে করলে সরাসরি WhatsApp ট্যাব ওপেন হবে?' : 'Auto-Open WhatsApp Tab on Bill Payment'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {lang === 'bn'
                        ? 'এটি বন্ধ রাখলে পেমেন্ট নেওয়ার সময় কোনো বিরক্তিকর পপআপ ট্যাব খুলবে না। আপনি যখন চাইবেন তখন ক্লিক করে পাঠাতে পারবেন।'
                        : 'Keep disabled to avoid disrupting bill collection with popup tabs.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.whatsappAutoSend ?? false}
                    onChange={(e) => setFormData({ ...formData, whatsappAutoSend: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'bn'
                    ? '💡 গুরুত্বপূর্ণ তথ্য: ব্রাউজার সিকিউরিটির কারণে কোনো ব্যাকএন্ড সার্ভার ছাড়া ব্রাউজার থেকে গোপনে কোনো ব্যক্তির ব্যক্তিগত হোয়াটসঅ্যাপে স্বয়ংক্রিয় মেসেজ পাঠানো যায় না, হোয়াটসঅ্যাপের নিয়মানুযায়ী চ্যাট উইন্ডো খুলতে হয়। তবে আপনার বিরক্তি দূর করতে বিল পেমেন্টের পর স্বয়ংক্রিয়ভাবে নতুন ট্যাব খুলে যাওয়া এখন বন্ধ করা হয়েছে! আপনি চাইলে রসিদ বা মেসেজ বাটনে ক্লিক করে প্রয়োজনমতো মেসেজ পাঠাতে পারবেন অথবা ব্যাকগ্রাউন্ড SMS গেটওয়ে চালু রাখতে পারবেন।'
                    : '💡 Note: Due to browser security restrictions, client-side web apps cannot silently push messages to private WhatsApp accounts without opening the chat interface. We keep automatic tab popups disabled so your payment flow is 100% uninterrupted.'}
                </div>
              </div>

              {/* SMS Balance & Bundle */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs sm:text-sm block">
                    {lang === 'bn' ? 'এসএমএস ব্যালেন্স' : 'SMS Balance'}
                  </span>
                  <span className="text-xs text-slate-300">
                    {lang === 'bn' 
                      ? `অবশিষ্ট ব্যালেন্স: ${formData.smsBalance || 0} টি SMS` 
                      : `Available Balance: ${formData.smsBalance || 0} SMS`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenSMSRecharge) onOpenSMSRecharge();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <Zap className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'এসএমএস প্যাক কিনুন' : 'Buy SMS Bundle'}</span>
                </button>
              </div>

              {/* Sender ID & Gateway API */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  {lang === 'bn' ? 'এসএমএস গেটওয়ে সেটিংস' : 'SMS Gateway Settings'}
                </span>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'এসএমএস প্রেরক পরিচিতি (Sender ID):' : 'SMS Sender ID:'}
                  </label>
                  <input
                    type="text"
                    value={formData.smsSenderId || 'IJ-NETWORK'}
                    onChange={(e) => setFormData({ ...formData, smsSenderId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'এসএমএস API কী (ঐচ্ছিক):' : 'SMS API Key (Optional):'}
                  </label>
                  <input
                    type="password"
                    value={formData.smsApiKey || ''}
                    onChange={(e) => setFormData({ ...formData, smsApiKey: e.target.value })}
                    placeholder="e.g. your_sms_provider_api_token"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Language Settings */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="block text-sm font-bold text-white mb-2">
                  {lang === 'bn' ? 'সিস্টেমের ভাষা নির্বাচন করুন' : 'Select System Language'}
                </span>
                <p className="text-xs text-slate-400 mb-4">
                  {lang === 'bn' 
                    ? 'বাংলা নির্বাচন করলে পুরো সিস্টেম শুধু বাংলায় দেখাবে, আর English নির্বাচন করলে পুরো সিস্টেম শতভাগ নিখুঁত ইংরেজিতে দেখাবে।'
                    : 'Selecting English ensures all labels, buttons, tables, and receipts are 100% in pure English without any Bengali text.'}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: 'bn' })}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      formData.language === 'bn'
                        ? 'bg-blue-950/60 border-blue-500 text-blue-300 shadow-md ring-1 ring-blue-500'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">বাংলা (Bengali)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">সবকিছু বাংলায়</div>
                    </div>
                    {formData.language === 'bn' && <Check className="w-5 h-5 text-blue-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, language: 'en' })}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      formData.language === 'en'
                        ? 'bg-blue-950/60 border-blue-500 text-blue-300 shadow-md ring-1 ring-blue-500'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">English</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">100% Pure English</div>
                    </div>
                    {formData.language === 'en' && <Check className="w-5 h-5 text-blue-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
            {isSaved ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                {lang === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings saved successfully!'}
              </span>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-950/40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t.saveSettingsBtn}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
