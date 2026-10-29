import React, { useState } from 'react';
import { X, MapPin, Plus, Trash2, Users } from 'lucide-react';
import { Zone, Customer, ISPSettings } from '../types/isp';
import { translations } from '../i18n/translations';

interface ZoneManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: Zone[];
  customers: Customer[];
  settings: ISPSettings;
  onAddZone: (name: string, code?: string, boxNumber?: string) => void;
  onDeleteZone: (zoneId: string) => void;
}

export const ZoneManagerModal: React.FC<ZoneManagerModalProps> = ({
  isOpen,
  onClose,
  zones,
  customers,
  settings,
  onAddZone,
  onDeleteZone
}) => {
  const lang = settings.language;
  const t = translations[lang];

  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [boxNumber, setBoxNumber] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddZone(name.trim(), code.trim() || undefined, boxNumber.trim() || undefined);
    setName('');
    setCode('');
    setBoxNumber('');
  };

  // Calculate customer count per zone
  const getCustomerCount = (zoneId: string) => {
    return customers.filter(c => c.zoneId === zoneId).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {t.zoneManagerTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'এলাকাভিত্তিক জোন ও ফাইবার অপটিক ডিস্ট্রিবিউশন বক্স' : 'Area zones & fiber distribution boxes'}
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

        {/* Add Zone Form */}
        <form onSubmit={handleAdd} className="my-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 space-y-3 text-xs">
          <div className="font-bold text-slate-200">
            {t.addNewZoneTitle}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                placeholder={t.zoneNameLabel}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder={t.zoneCodeLabel}
                value={boxNumber}
                onChange={(e) => setBoxNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.saveZoneBtn}</span>
          </button>
        </form>

        {/* Existing Zones List */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800">
          <div className="p-2.5 bg-slate-950 text-slate-400 text-xs font-semibold sticky top-0 border-b border-slate-800">
            {t.existingZonesTitle} ({zones.length})
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {zones.map((zone) => {
              const count = getCustomerCount(zone.id);

              return (
                <div key={zone.id} className="p-3 flex items-center justify-between hover:bg-slate-800/40 transition">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 font-bold text-xs">
                      {zone.boxNumber || zone.code || 'ZN'}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {zone.name}
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-2">
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Users className="w-3 h-3" />
                          {count} {t.customerCountLabel}
                        </span>
                        {zone.description && <span>• {zone.description}</span>}
                      </div>
                    </div>
                  </div>

                  {count === 0 && (
                    <button
                      onClick={() => onDeleteZone(zone.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 transition"
                      title="Delete Zone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
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
