import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  MapPin, 
  Wifi, 
  DollarSign, 
  Calendar, 
  Phone, 
  Plus, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Edit3,
  Check,
  CheckCircle2
} from 'lucide-react';
import { Customer, Zone, ISPSettings } from '../types/isp';
import { translations } from '../i18n/translations';

interface AddEditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: Zone[];
  settings: ISPSettings;
  onSaveCustomer: (customer: Customer) => void;
  onAddNewZone: (zoneName: string) => Zone;
  customerToEdit?: Customer | null;
}

export const AddEditCustomerModal: React.FC<AddEditCustomerModalProps> = ({
  isOpen,
  onClose,
  zones,
  settings,
  onSaveCustomer,
  onAddNewZone,
  customerToEdit
}) => {
  const lang = settings.language;
  const t = translations[lang];

  const isEditing = !!customerToEdit;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pppoeId, setPppoeId] = useState('');
  const [pppoePassword, setPppoePassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || '');
  const [isCreatingNewZone, setIsCreatingNewZone] = useState(false);
  const [newZoneNameInput, setNewZoneNameInput] = useState('');
  const [packageSpeed, setPackageSpeed] = useState('25 Mbps Fiber');
  const [monthlyBill, setMonthlyBill] = useState<number>(600);
  const [connectionDate, setConnectionDate] = useState('2026-10-01');
  const [ipAddress, setIpAddress] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Whenever customerToEdit changes or modal opens, pre-fill values
  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name || '');
      setPhone(customerToEdit.phone || '');
      setAddress(customerToEdit.address || '');
      setPppoeId(customerToEdit.pppoeId || '');
      setPppoePassword(customerToEdit.pppoePassword || '123456');
      setSelectedZoneId(customerToEdit.zoneId || zones[0]?.id || '');
      setPackageSpeed(customerToEdit.packageSpeed || '25 Mbps Fiber');
      setMonthlyBill(customerToEdit.monthlyBill || 600);
      setConnectionDate(customerToEdit.connectionDate || new Date().toISOString().slice(0, 10));
      setIpAddress(customerToEdit.ipAddress || '');
      setStatus(customerToEdit.status === 'inactive' ? 'inactive' : 'active');
    } else {
      setName('');
      setPhone('');
      setAddress('');
      setPppoeId('');
      setPppoePassword('123456');
      setSelectedZoneId(zones[0]?.id || '');
      setPackageSpeed('25 Mbps Fiber');
      setMonthlyBill(600);
      setConnectionDate(new Date().toISOString().slice(0, 10));
      setIpAddress('');
      setStatus('active');
    }
    setIsCreatingNewZone(false);
    setNewZoneNameInput('');
  }, [customerToEdit, isOpen, zones]);

  if (!isOpen) return null;

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalZoneId = selectedZoneId;
    let finalZoneName = zones.find(z => z.id === selectedZoneId)?.name || 'Default Zone';

    // If inline new zone created
    if (isCreatingNewZone && newZoneNameInput.trim()) {
      const created = onAddNewZone(newZoneNameInput.trim());
      finalZoneId = created.id;
      finalZoneName = created.name;
    }

    // Auto-generate PPPoE username if not provided
    let finalPppoe = pppoeId.trim();
    if (!finalPppoe) {
      const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'user';
      const randomSuffix = Math.floor(10 + Math.random() * 90);
      finalPppoe = `ij_${cleanName}_${randomSuffix}`;
    }

    // PPPoE Password
    const finalPassword = pppoePassword.trim() || '123456';

    const finalCust: Customer = {
      id: customerToEdit?.id || `CUST-${String(Math.floor(Date.now() % 100000)).padStart(5, '0')}`,
      pppoeId: finalPppoe,
      pppoePassword: finalPassword,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim() || finalZoneName,
      zoneId: finalZoneId,
      zoneName: finalZoneName,
      monthlyBill: Number(monthlyBill),
      packageSpeed,
      connectionDate,
      status,
      ipAddress: ipAddress.trim() || undefined,
      createdAt: customerToEdit?.createdAt || new Date().toISOString(),
      bills: customerToEdit?.bills || {}
    };

    onSaveCustomer(finalCust);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-cyan-400 border ${
              isEditing ? 'bg-blue-500/10 border-blue-500/20' : 'bg-cyan-500/10 border-cyan-500/20'
            }`}>
              {isEditing ? <Edit3 className="w-5 h-5 text-blue-400" /> : <UserPlus className="w-5 h-5 text-cyan-400" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isEditing 
                  ? (lang === 'bn' ? 'গ্রাহকের তথ্য এডিট / পরিবর্তন করুন' : 'Edit Customer Information')
                  : t.addCustomerTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? (lang === 'bn' ? 'নাম, মোবাইল নম্বর, বিল বা প্যাকেজ পরিবর্তন করুন' : 'Update subscriber name, phone, bill or package')
                  : (lang === 'bn' ? 'নতুন ইন্টারনেট গ্রাহকের প্রোফাইল সংরক্ষণ করুন' : 'Register new broadband subscriber profile')}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-4 text-xs pr-1">
          
          {/* Customer Full Name */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {t.customerNameLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: মোঃ কামরুল হাসান"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Mobile Phone Number */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {t.customerPhoneLabel}
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2 pl-9 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* PPPoE Username & Password (With Show/Hide & Auto) */}
          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <span className="font-bold text-cyan-300 block text-xs flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'bn' ? 'PPPoE ইউজারনেম ও পাসওয়ার্ড সেটিংস' : 'PPPoE Username & Password'}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* PPPoE Username */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'PPPoE ইউজারনেম (আইডি):' : 'PPPoE Username:'}
                </label>
                <input
                  type="text"
                  value={pppoeId}
                  onChange={(e) => setPppoeId(e.target.value)}
                  placeholder="যেমন: ij_kamrul_01 (খালি রাখলে অটো হবে)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* PPPoE Password */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {lang === 'bn' ? 'PPPoE পাসওয়ার্ড:' : 'PPPoE Password:'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pppoePassword}
                    onChange={(e) => setPppoePassword(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 pr-9 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Zone / Area Selection with inline Add Zone */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {t.selectZoneLabel}
            </label>
            
            {!isCreatingNewZone ? (
              <div className="flex gap-2">
                <select
                  value={selectedZoneId}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsCreatingNewZone(true);
                    } else {
                      setSelectedZoneId(e.target.value);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} {z.boxNumber ? `(${z.boxNumber})` : ''}
                    </option>
                  ))}
                  <option value="__NEW__" className="text-cyan-400 font-bold">
                    + নতুন জোন যোগ করুন...
                  </option>
                </select>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewZone(true)}
                  className="p-2 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-slate-700"
                  title="নতুন জোন যোগ করুন"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="নতুন এলাকার নাম লিখুন (যেমন: কলেজ রোড)..."
                  value={newZoneNameInput}
                  onChange={(e) => setNewZoneNameInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-cyan-500 text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsCreatingNewZone(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  বাতিল
                </button>
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              {t.addressLabel}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="বাড়ি নং, রোড নং বা নির্দিষ্ট ঠিকানা..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Monthly Bill & Package Speed (Starts from minimum 25 Mbps!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                {t.monthlyBillAmountLabel}
              </label>
              <input
                type="number"
                min="0"
                step="50"
                required
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                {t.packageSpeedLabel} <span className="text-cyan-400 text-[10px]">(সর্বনিম্ন ২৫ এমবি)</span>
              </label>
              <select
                value={packageSpeed}
                onChange={(e) => setPackageSpeed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="25 Mbps Fiber">25 Mbps Fiber (সর্বনিম্ন প্যাকেজ)</option>
                <option value="30 Mbps Fiber">30 Mbps Fiber</option>
                <option value="40 Mbps Fiber">40 Mbps Fiber</option>
                <option value="50 Mbps Fiber">50 Mbps Fiber</option>
                <option value="60 Mbps Fiber">60 Mbps Fiber</option>
                <option value="80 Mbps Fiber">80 Mbps Fiber</option>
                <option value="100 Mbps Fiber">100 Mbps Fiber</option>
                <option value="120 Mbps Fiber">120 Mbps Fiber</option>
                <option value="150 Mbps Fiber">150 Mbps Fiber</option>
                <option value="200 Mbps Dedicated">200 Mbps Dedicated</option>
              </select>
            </div>
          </div>

          {/* Connection Date & IP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                {t.connectionDateInputLabel}
              </label>
              <input
                type="date"
                required
                value={connectionDate}
                onChange={(e) => setConnectionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {lang === 'bn' ? '* সংযোগ তারিখের পরের মাসের সেম তারিখে বিল সাইকেল কার্যকর হবে' : '* Bill cycle activates next month same day'}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                {t.ipAddressLabel}
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.100"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Line Status: Active vs Deactive */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="block font-semibold text-slate-300 text-xs mb-2">
              {lang === 'bn' ? 'সংযোগ ও লাইন স্ট্যাটাস:' : 'Connection & Line Status:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                  status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{lang === 'bn' ? 'সক্রিয় (Active)' : 'Active'}</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                  status === 'inactive'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>{lang === 'bn' ? 'ডিঅ্যাক্টিভ (Inactive)' : 'Inactive'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {status === 'active'
                ? (lang === 'bn' ? '✓ গ্রাহকের লাইন চালু থাকবে এবং বিল কালেকশনে যুক্ত থাকবে।' : 'Line is active and included in bill collection.')
                : (lang === 'bn' ? '✕ গ্রাহকের লাইন বন্ধ থাকবে এবং বিল কালেকশন থেকে সাময়িকভাবে সরে থাকবে।' : 'Line is disconnected and excluded from bill collection.')}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition shadow-lg shadow-cyan-950/40 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {isEditing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{isEditing ? (lang === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes') : t.saveCustomerBtn}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
