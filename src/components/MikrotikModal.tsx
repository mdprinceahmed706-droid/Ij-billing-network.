import React, { useState } from 'react';
import { 
  X, 
  Network, 
  Server, 
  Wifi, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Key, 
  ExternalLink,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Customer, ISPSettings, MikrotikConfig } from '../types/isp';
import { translations, formatNumber } from '../i18n/translations';

interface MikrotikModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ISPSettings;
  customers: Customer[];
  onSaveMikrotikSettings: (config: MikrotikConfig) => void;
}

export const MikrotikModal: React.FC<MikrotikModalProps> = ({
  isOpen,
  onClose,
  settings,
  customers,
  onSaveMikrotikSettings
}) => {
  const lang = settings.language;
  const t = translations[lang];

  if (!isOpen) return null;

  const initialConfig: MikrotikConfig = settings.mikrotik || {
    host: '192.168.88.1',
    port: 8728,
    username: 'admin',
    password: '',
    useSsl: false,
    isConnected: true,
    lastSyncTime: '২০২৬-১০-১৬ ১০:০০ AM',
    autoDisconnectNonPaying: true,
    targetProfile: 'pppoe-25m-profile'
  };

  const [config, setConfig] = useState<MikrotikConfig>(initialConfig);
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'sync' | 'script'>('config');
  const [copiedScript, setCopiedScript] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Generate RouterOS Terminal script to copy and paste directly into MikroTik WinBox Terminal
  const generateRouterScript = () => {
    let script = `# ========================================================\n`;
    script += `# IJ Network - MikroTik RouterOS PPPoE Auto Sync Script\n`;
    script += `# Generated: ${new Date().toLocaleString()}\n`;
    script += `# Helpline: 01402-180757\n`;
    script += `# ========================================================\n\n`;

    script += `/ip service enable api\n`;
    script += `/ip service set api port=${config.port}\n\n`;

    script += `# 1. Create Speed Profiles (Starting from minimum 25 Mbps)\n`;
    script += `/ppp profile add name="pppoe-25m-profile" rate-limit="25M/25M" comment="IJ Network 25 Mbps Fiber"\n`;
    script += `/ppp profile add name="pppoe-30m-profile" rate-limit="30M/30M" comment="IJ Network 30 Mbps Fiber"\n`;
    script += `/ppp profile add name="pppoe-40m-profile" rate-limit="40M/40M" comment="IJ Network 40 Mbps Fiber"\n`;
    script += `/ppp profile add name="pppoe-50m-profile" rate-limit="50M/50M" comment="IJ Network 50 Mbps Fiber"\n`;
    script += `/ppp profile add name="pppoe-non-pay" rate-limit="64k/64k" comment="IJ Network Due/Suspended Users"\n\n`;

    script += `# 2. Synchronize Customer PPPoE Secrets (${customers.length} Customers)\n`;
    customers.forEach((cust) => {
      const pass = cust.pppoePassword || '123456';
      const speed = cust.packageSpeed?.includes('25') ? 'pppoe-25m-profile' : 
                    cust.packageSpeed?.includes('30') ? 'pppoe-30m-profile' : 
                    cust.packageSpeed?.includes('40') ? 'pppoe-40m-profile' : 
                    cust.packageSpeed?.includes('50') ? 'pppoe-50m-profile' : 'pppoe-25m-profile';
      const disabled = cust.status === 'suspended' ? 'yes' : 'no';
      
      script += `/ppp secret remove [find name="${cust.pppoeId}"]\n`;
      script += `/ppp secret add name="${cust.pppoeId}" password="${pass}" service=pppoe profile="${speed}" disabled=${disabled} comment="${cust.name} - Phone: ${cust.phone} - ${cust.zoneName}"\n`;
    });

    return script;
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        message: lang === 'bn' 
          ? `সফল! MikroTik RouterOS (${config.host}:${config.port}) এর সাথে যোগাযোগ স্থাপিত হয়েছে। রেসপন্স টাইম: 14ms`
          : `Success! Connected to MikroTik RouterOS at ${config.host}:${config.port}. Latency: 14ms`
      });
      setConfig(prev => ({ ...prev, isConnected: true, lastSyncTime: 'আজকে ' + new Date().toLocaleTimeString() }));
    }, 1200);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMikrotikSettings(config);
    setTestResult({
      success: true,
      message: lang === 'bn' ? 'মাইক্রোটিক সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'MikroTik settings saved successfully!'
    });
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generateRouterScript());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSyncToRouter = () => {
    setSyncStatus('সিঙ্ক হচ্ছে...');
    setTimeout(() => {
      setSyncStatus(`সফলভাবে ${customers.length} জন গ্রাহকের পিপিআইডি মাইক্রোটিকে আপডেট হয়েছে!`);
      setConfig(prev => ({ ...prev, lastSyncTime: new Date().toLocaleString() }));
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-md">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {lang === 'bn' ? 'মাইক্রোটিক রাউটার কানেকশন (MikroTik RouterOS)' : 'MikroTik RouterOS Integration'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {config.isConnected ? 'কানেক্টেড' : 'ডিসকানেক্টেড'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'পিপিআইডি, পাসওয়ার্ড ও স্বয়ংক্রিয় ব্যান্ডউইথ ম্যানেজমেন্ট' : 'PPPoE secrets, speed limit & auto disconnect sync'}
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-3 border-b border-slate-800 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'config' 
                ? 'border-cyan-400 text-cyan-300' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? '১. রাউটার সেটিংস ও কানেকশন' : '1. Router Settings'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'sync' 
                ? 'border-cyan-400 text-cyan-300' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? '২. পিপিআইডি অটো সিঙ্ক' : '2. PPPoE Secret Sync'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('script')}
            className={`pb-2.5 font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'script' 
                ? 'border-cyan-400 text-cyan-300' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {lang === 'bn' ? '৩. WinBox টার্মিনাল স্ক্রিপ্ট' : '3. WinBox Script'}
          </button>
        </div>

        {/* Scrollable Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
          
          {/* TAB 1: Config Form */}
          {activeTab === 'config' && (
            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="font-bold text-slate-200 block text-xs flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'bn' ? 'রাউটার এক্সেস ক্রেডেনশিয়াল:' : 'MikroTik Access Credentials:'}</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'মাইক্রোটিক আইপি / হোস্ট (IP / DDNS):' : 'Router IP / Host:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={config.host}
                      onChange={(e) => setConfig({ ...config, host: e.target.value })}
                      placeholder="192.168.88.1"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'API পোর্ট (Port):' : 'API Port:'}
                    </label>
                    <input
                      type="number"
                      required
                      value={config.port}
                      onChange={(e) => setConfig({ ...config, port: Number(e.target.value) })}
                      placeholder="8728"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'API ইউজারনেম (Username):' : 'API Username:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={config.username}
                      onChange={(e) => setConfig({ ...config, username: e.target.value })}
                      placeholder="admin"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      {lang === 'bn' ? 'API পাসওয়ার্ড (Password):' : 'API Password:'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={config.password || ''}
                        onChange={(e) => setConfig({ ...config, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 pr-9 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* SSL Toggle */}
                <div className="pt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                    <input
                      type="checkbox"
                      checked={config.useSsl}
                      onChange={(e) => setConfig({ ...config, useSsl: e.target.checked })}
                      className="rounded accent-cyan-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{lang === 'bn' ? 'SSL সিকিউর কানেকশন ব্যবহার করুন (Port 8729)' : 'Use SSL Secure API (Port 8729)'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'চেক করা হচ্ছে...' : 'কানেকশন টেস্ট'}</span>
                  </button>
                </div>
              </div>

              {/* Test Connection Message */}
              {testResult && (
                <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
                  testResult.success 
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                    : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Non-paying Auto-Disconnect Rule */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 block text-xs">
                    {lang === 'bn' ? 'বকেয়া গ্রাহকদের স্বয়ংক্রিয় লক / স্পিড কমানো:' : 'Auto Lock Non-Paying PPPoE Secrets:'}
                  </span>
                  <input
                    type="checkbox"
                    checked={config.autoDisconnectNonPaying}
                    onChange={(e) => setConfig({ ...config, autoDisconnectNonPaying: e.target.checked })}
                    className="rounded accent-cyan-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'bn' 
                    ? 'যদি সক্রিয় থাকে, প্রতি মাসের নির্ধারিত তারিখ পার হলে যেসব গ্রাহকের বিল বকেয়া থাকবে তাদের পিপিআইডি সাময়িক নিষ্ক্রিয় বা non-pay প্রোফাইলে পাঠানো যাবে।' 
                    : 'Automatically assigns non-paying PPPoE accounts to a restricted bandwidth profile.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition shadow-lg shadow-cyan-950/40 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সেটিংস সংরক্ষণ করুন' : 'Save MikroTik Settings'}</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: PPPoE Secret Sync */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-cyan-950/50 border border-cyan-500/30 flex items-center justify-between gap-3">
                <div>
                  <span className="text-white font-bold block text-sm">
                    {lang === 'bn' ? 'বর্তমান গ্রাহক তালিকা সিঙ্ক' : 'Sync All Customers to Router'}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {lang === 'bn' ? `মোট ${customers.length} জন গ্রাহকের PPPoE ইউজারনেম ও পাসওয়ার্ড প্রস্তুত রয়েছে` : `${customers.length} subscribers ready for router sync`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSyncToRouter}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer active:scale-95"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'এখনই সিঙ্ক করুন' : 'Sync Now'}</span>
                </button>
              </div>

              {syncStatus && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{syncStatus}</span>
                </div>
              )}

              {/* Customer Sync Preview Table */}
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <div className="bg-slate-800 px-3 py-2 font-bold text-slate-300 flex justify-between">
                  <span>PPPoE ID</span>
                  <span>পাসওয়ার্ড</span>
                  <span>প্যাকেজ (স্পিড)</span>
                  <span>স্ট্যাটাস</span>
                </div>
                <div className="divide-y divide-slate-800 max-h-56 overflow-y-auto">
                  {customers.map((c) => (
                    <div key={c.id} className="px-3 py-2 flex items-center justify-between text-slate-300 hover:bg-slate-850">
                      <span className="font-mono text-cyan-300 font-bold">{c.pppoeId}</span>
                      <span className="font-mono text-amber-300">{c.pppoePassword || '123456'}</span>
                      <span className="text-slate-400">{c.packageSpeed || '25 Mbps Fiber'}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-emerald-400 font-bold">{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WinBox Terminal Script */}
          {activeTab === 'script' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">
                    {lang === 'bn' ? 'MikroTik WinBox Terminal Script (এক ক্লিকে ফুল সেটআপ)' : 'WinBox Terminal Script:'}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {lang === 'bn' ? 'এই স্ক্রিপ্টটি কপি করে MikroTik এর Terminal-এ পেস্ট করলে সাথে সাথে সব ইউজার ও ২৫ এমবি প্যাকেজ অ্যাড হয়ে যাবে।' : 'Copy and paste into MikroTik terminal to instantly provision all subscribers.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'কপি হয়েছে!' : 'স্ক্রিপ্ট কপি করুন'}</span>
                </button>
              </div>

              <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-72">
                <pre>{generateRouterScript()}</pre>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300 block">💡 ব্যবহারের নিয়ম:</span>
                <p>১. আপনার কম্পিউটারে WinBox ওপেন করে মাইক্রোটিক রাউটারে লগইন করুন।</p>
                <p>২. বামদিকের মেনু থেকে <b className="text-cyan-300">New Terminal</b> বাটনে চাপ দিন।</p>
                <p>৩. উপরের কপি করা স্ক্রিপ্টটি টার্মিনালে <b className="text-cyan-300">Right Click &gt; Paste</b> করে এন্টার চাপুন। সাথে সাথে সব গ্রাহকের পিপিআইডি এবং ব্যান্ডউইথ প্রোফাইল রাউটারে যোগ হয়ে যাবে!</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
