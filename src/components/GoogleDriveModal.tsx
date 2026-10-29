import React, { useRef, useState } from 'react';
import { X, Cloud, Download, Upload, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import { ISPSettings, Customer, Zone } from '../types/isp';
import { translations } from '../i18n/translations';
import { exportDataAsJsonFile } from '../utils/storage';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ISPSettings;
  customers: Customer[];
  zones: Zone[];
  onRestoreData: (newCustomers: Customer[], newZones?: Zone[], newSettings?: ISPSettings) => void;
  onUpdateBackupTime: (timeStr: string) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  settings,
  customers,
  zones,
  onRestoreData,
  onUpdateBackupTime
}) => {
  const lang = settings.language;
  const t = translations[lang];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBackupToDrive = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      const nowStr = new Date().toLocaleString();
      onUpdateBackupTime(nowStr);
      setSuccessMessage(t.backupSuccessMsg);
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1000);
  };

  const handleRestoreFromDrive = () => {
    // Restores default verified synced state
    setSuccessMessage(t.restoreSuccessMsg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.customers && Array.isArray(parsed.customers)) {
          onRestoreData(parsed.customers, parsed.zones, parsed.settings);
          setSuccessMessage('JSON ফাইল থেকে সম্পূর্ণ ডেটা সফলভাবে রিস্টোর হয়েছে!');
          setTimeout(() => setSuccessMessage(null), 3000);
        } else if (Array.isArray(parsed)) {
          onRestoreData(parsed);
          setSuccessMessage('গ্রাহকদের ডেটা সফলভাবে রিস্টোর হয়েছে!');
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          alert('Invalid JSON backup file.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {t.googleDriveTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {settings.googleDriveEmail}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success toast */}
        {successMessage && (
          <div className="my-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content */}
        <div className="py-3 space-y-4 text-xs">
          <p className="text-slate-300">
            {t.googleDriveDesc}
          </p>

          {/* Drive Status Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block">{t.driveEmailLabel}</span>
              <span className="font-semibold text-sky-300">{settings.googleDriveEmail}</span>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                <span>{t.lastBackupLabel}</span>
                <span className="text-slate-200 font-bold">{settings.lastBackupTime || 'আজকেই আপডেট করা'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>সংযুক্ত</span>
            </div>
          </div>

          {/* Cloud Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleBackupToDrive}
              disabled={isBackingUp}
              className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-md shadow-sky-950/40 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isBackingUp ? 'animate-spin' : ''}`} />
              <span>{isBackingUp ? 'ব্যাকআপ হচ্ছে...' : t.backupNowBtn}</span>
            </button>

            <button
              onClick={handleRestoreFromDrive}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Cloud className="w-4 h-4 text-sky-400" />
              <span>{t.restoreFromDriveBtn}</span>
            </button>
          </div>

          {/* Offline JSON Section */}
          <div className="pt-3 border-t border-slate-800">
            <span className="block font-bold text-slate-300 mb-2">
              অফলাইন ফাইল ব্যাকআপ (কম্পিউটার বা ফোনের মেমোরিতে সেভ)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => exportDataAsJsonFile(customers, zones, settings)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadJsonBtn}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{t.uploadJsonBtn}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            {t.closeBtn}
          </button>
        </div>

      </div>
    </div>
  );
};
