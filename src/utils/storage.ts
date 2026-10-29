import { Customer, Zone, ISPSettings } from '../types/isp';

const STORAGE_KEY_CUSTOMERS = 'ij_network_customers_v4';
const STORAGE_KEY_ZONES = 'ij_network_zones_v2';
const STORAGE_KEY_SETTINGS = 'ij_network_settings_v2';

export function formatCustomerId(id?: string, index: number = 0): string {
  if (id && /^CUST-\d+$/i.test(id)) {
    return id.toUpperCase();
  }
  if (id) {
    const match = id.match(/\d+/);
    if (match) {
      return `CUST-${String(parseInt(match[0], 10)).padStart(5, '0')}`;
    }
  }
  return `CUST-${String(index + 1).padStart(5, '0')}`;
}

export function formatBillCollectionId(id?: string, index: number = 0): string {
  if (id && /^CUS\d+$/i.test(id)) {
    return id.toUpperCase();
  }
  if (id) {
    const match = id.match(/\d+/);
    if (match) {
      return `CUS${String(parseInt(match[0], 10)).padStart(5, '0')}`;
    }
  }
  return `CUS${String(index + 1).padStart(5, '0')}`;
}

export const DEFAULT_ZONES: Zone[] = [
  { id: 'zone-1', name: 'উত্তর পাড়া', code: 'Z-01', boxNumber: 'BOX-01', description: 'মেইন রোড ও কলেজ সংলগ্ন এলাকা' },
  { id: 'zone-2', name: 'দক্ষিণ পাড়া', code: 'Z-02', boxNumber: 'BOX-02', description: 'মসজিদ রোড ও পুরাতন বাজার' },
  { id: 'zone-3', name: 'বাজার রোড', code: 'Z-03', boxNumber: 'BOX-03', description: 'সেন্ট্রাল শপিং কমপ্লেক্স ও দোকানসমূহ' },
  { id: 'zone-4', name: 'পূর্বপাড়া', code: 'Z-04', boxNumber: 'BOX-04', description: 'নতুন হাউজিং ও আবাসিক এলাকা' }
];

export const DEFAULT_SETTINGS: ISPSettings = {
  companyNameBn: 'আইজে নেটওয়ার্ক',
  companyNameEn: 'IJ Network',
  taglineBn: 'হাই স্পিড ব্রডব্যান্ড ইন্টারনেট',
  taglineEn: 'High Speed Broadband Internet',
  proprietor: 'Md. Palash',
  phone: '01402-180757',
  email: 'mdprinceahmed706@gmail.com',
  addressBn: 'মেইন বাসস্ট্যান্ড রোড, বাজার মোড়',
  addressEn: 'Main Bus Stand Road, Bazar Mor',
  bkashNumber: '01402-180757 (Personal)',
  nagadNumber: '01402-180757 (Personal)',
  billDueDeadlineDay: 10,
  currencySymbol: '৳',
  language: 'bn',
  googleDriveConnected: true,
  googleDriveEmail: 'mdprinceahmed706@gmail.com',
  lastBackupTime: '2026-10-16 10:00 AM',
  // Official ISP Billing Pad & Memo Defaults
  btrcRegNo: 'BTRC/ISP/NAT-2024/0987',
  padTitleBn: 'আইজে নেটওয়ার্ক - হাই স্পিড ব্রডব্যান্ড বিলিং মেমো প্যাড',
  padTermsBn: 'প্রতি মাসের ১০ তারিখের মধ্যে নিয়মিত বিল পরিশোধ করুন। বিল পরিশোধের পর অনলাইন মানি রিসিট ও এসএমএস নিশ্চিত করুন।',
  cashierName: 'Md. Palash (Admin)',
  // Automated SMS & WhatsApp Defaults
  smsBalance: 100,
  smsAutoSend: true,
  whatsappAutoSend: false, // Default to FALSE so WhatsApp does not pop open upon every payment!
  smsSenderId: 'IJ-NETWORK',
  smsLogs: [],
  smsRecharges: [],
  // Admin Authentication & Login Portal (Facebook / Enterprise style)
  adminUsername: 'admin',
  adminPassword: '123',
  adminPin: '1234',
  adminLockEnabled: true,
  lockOnStartup: true,
  requireLoginOnStart: true,
  themeMode: 'light',
  mikrotik: {
    host: '192.168.88.1',
    port: 8728,
    username: 'admin',
    password: '',
    useSsl: false,
    isConnected: true,
    lastSyncTime: '২০২৬-১০-১৬ ১০:০০ AM',
    autoDisconnectNonPaying: true,
    targetProfile: 'pppoe-25m-profile'
  }
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-00001',
    pppoeId: 'ghoreano',
    pppoePassword: '123456',
    name: 'office',
    phone: '01711223344',
    address: 'মেইন অফিস রোড, উত্তর পাড়া',
    zoneId: 'zone-1',
    zoneName: 'উত্তর পাড়া',
    monthlyBill: 500,
    packageSpeed: '25 Mbps Fiber',
    connectionDate: '2026-06-01',
    status: 'active',
    createdAt: '2026-06-01',
    bills: {
      '2026-08': { monthKey: '2026-08', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-08-05', paymentMethod: 'Cash', receiptNumber: 'RCP-2608-001' },
      '2026-09': { monthKey: '2026-09', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-09-06', paymentMethod: 'bKash', receiptNumber: 'RCP-2609-001' },
      '2026-10': { monthKey: '2026-10', isPaid: false, paidAmount: 0, dueAmount: 500, discount: 0 }
    }
  },
  {
    id: 'CUST-00002',
    pppoeId: '0086sohel@mo',
    pppoePassword: '123456',
    name: 'MD sohel',
    phone: '01822334455',
    address: 'বাজার রোড মার্কেট, দোকান নং ৪',
    zoneId: 'zone-3',
    zoneName: 'বাজার রোড',
    monthlyBill: 500,
    packageSpeed: '25 Mbps Fiber',
    connectionDate: '2026-06-15',
    status: 'active',
    createdAt: '2026-06-15',
    bills: {
      '2026-08': { monthKey: '2026-08', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-08-09', paymentMethod: 'bKash' },
      '2026-09': { monthKey: '2026-09', isPaid: false, paidAmount: 0, dueAmount: 500, discount: 0 },
      '2026-10': { monthKey: '2026-10', isPaid: false, paidAmount: 0, dueAmount: 500, discount: 0 }
    }
  },
  {
    id: 'CUST-00003',
    pppoeId: '0121saifultal@mo',
    pppoePassword: '123456',
    name: 'sinful',
    phone: '01933445566',
    address: 'রোড ২, দক্ষিণ পাড়া',
    zoneId: 'zone-2',
    zoneName: 'দক্ষিণ পাড়া',
    monthlyBill: 500,
    packageSpeed: '25 Mbps Fiber',
    connectionDate: '2026-07-01',
    status: 'active',
    createdAt: '2026-07-01',
    bills: {
      '2026-09': { monthKey: '2026-09', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-09-08', paymentMethod: 'Cash' },
      '2026-10': { monthKey: '2026-10', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-10-05', paymentMethod: 'Nagad', receiptNumber: 'RCP-2610-003' }
    }
  },
  {
    id: 'CUST-00004',
    pppoeId: '0168saiful@mo',
    pppoePassword: '123456',
    name: 'MD sinful',
    phone: '01644556677',
    address: 'ব্লক সি, পূর্বপাড়া হাউজিং',
    zoneId: 'zone-4',
    zoneName: 'পূর্বপাড়া',
    monthlyBill: 600,
    packageSpeed: '25 Mbps Fiber',
    connectionDate: '2026-07-10',
    status: 'active',
    createdAt: '2026-07-10',
    bills: {
      '2026-09': { monthKey: '2026-09', isPaid: true, paidAmount: 600, dueAmount: 0, discount: 0, paidDate: '2026-09-10', paymentMethod: 'bKash' },
      '2026-10': { monthKey: '2026-10', isPaid: false, paidAmount: 200, dueAmount: 400, discount: 0, paymentMethod: 'bKash', paidDate: '2026-10-07' }
    }
  },
  {
    id: 'CUST-00005',
    pppoeId: '0013md@mo',
    pppoePassword: '123456',
    name: 'md',
    phone: '01755667788',
    address: 'হাসপাতাল রোড, উত্তর পাড়া',
    zoneId: 'zone-1',
    zoneName: 'উত্তর পাড়া',
    monthlyBill: 500,
    packageSpeed: '25 Mbps Fiber',
    connectionDate: '2026-08-01',
    status: 'active',
    createdAt: '2026-08-01',
    bills: {
      '2026-09': { monthKey: '2026-09', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-09-05', paymentMethod: 'Cash' },
      '2026-10': { monthKey: '2026-10', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-10-06', paymentMethod: 'Cash', receiptNumber: 'RCP-2610-005' }
    }
  },
  {
    id: 'CUST-00006',
    pppoeId: '0038sajib@mo',
    pppoePassword: '123456',
    name: 'md pintu kaka',
    phone: '01866778899',
    address: 'পুরাতন বাজার গলি, দক্ষিণ পাড়া',
    zoneId: 'zone-2',
    zoneName: 'দক্ষিণ পাড়া',
    monthlyBill: 600,
    packageSpeed: '25 Mbps Fiber',
    connectionDate: '2026-08-15',
    status: 'active',
    createdAt: '2026-08-15',
    bills: {
      '2026-09': { monthKey: '2026-09', isPaid: true, paidAmount: 600, dueAmount: 0, discount: 0, paidDate: '2026-09-12', paymentMethod: 'Cash' },
      '2026-10': { monthKey: '2026-10', isPaid: false, paidAmount: 0, dueAmount: 600, discount: 0 }
    }
  },
  {
    id: 'CUST-00007',
    pppoeId: '0054nijam@mo',
    pppoePassword: '123456',
    name: 'md nijam guls',
    phone: '01977889900',
    address: 'সেন্ট্রাল মোড়, বাজার রোড',
    zoneId: 'zone-3',
    zoneName: 'বাজার রোড',
    monthlyBill: 700,
    packageSpeed: '30 Mbps Fiber',
    connectionDate: '2026-08-20',
    status: 'active',
    createdAt: '2026-08-20',
    bills: {
      '2026-09': { monthKey: '2026-09', isPaid: true, paidAmount: 700, dueAmount: 0, discount: 0, paidDate: '2026-09-08', paymentMethod: 'bKash' },
      '2026-10': { monthKey: '2026-10', isPaid: false, paidAmount: 0, dueAmount: 700, discount: 0 }
    }
  },
  {
    id: 'CUST-00008',
    pppoeId: '0118alamin@mo',
    pppoePassword: '123456',
    name: 'md alamin sak',
    phone: '01588990011',
    address: 'রোড ৪, পূর্বপাড়া',
    zoneId: 'zone-4',
    zoneName: 'পূর্বপাড়া',
    monthlyBill: 500,
    packageSpeed: '25 Mbps Fiber',
    connectionDate: '2026-09-01',
    status: 'active',
    createdAt: '2026-09-01',
    bills: {
      '2026-09': { monthKey: '2026-09', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-09-09', paymentMethod: 'Nagad' },
      '2026-10': { monthKey: '2026-10', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-10-04', paymentMethod: 'Nagad', receiptNumber: 'RCP-2610-008' }
    }
  },
  {
    id: 'CUST-00009',
    pppoeId: '0317foysal@mo',
    pppoePassword: '123456',
    name: 'Md foysal',
    phone: '01399001122',
    address: 'কলেজ গলি, উত্তর পাড়া',
    zoneId: 'zone-1',
    zoneName: 'উত্তর পাড়া',
    monthlyBill: 500,
    packageSpeed: '25 Mbps Fiber',
    connectionDate: '2026-09-10',
    status: 'active',
    createdAt: '2026-09-10',
    bills: {
      '2026-09': { monthKey: '2026-09', isPaid: true, paidAmount: 500, dueAmount: 0, discount: 0, paidDate: '2026-09-15', paymentMethod: 'Cash' },
      '2026-10': { monthKey: '2026-10', isPaid: false, paidAmount: 0, dueAmount: 500, discount: 0 }
    }
  },
  {
    id: 'CUST-00010',
    pppoeId: '0318masum@mo',
    pppoePassword: '123456',
    name: 'md masum',
    phone: '01402180757',
    address: 'মেইন রোড, দক্ষিণ পাড়া',
    zoneId: 'zone-2',
    zoneName: 'দক্ষিণ পাড়া',
    monthlyBill: 800,
    packageSpeed: '30 Mbps Fiber',
    connectionDate: '2026-09-15',
    status: 'active',
    createdAt: '2026-09-15',
    bills: {
      '2026-09': { monthKey: '2026-09', isPaid: true, paidAmount: 800, dueAmount: 0, discount: 0, paidDate: '2026-09-20', paymentMethod: 'bKash' },
      '2026-10': { monthKey: '2026-10', isPaid: true, paidAmount: 800, dueAmount: 0, discount: 0, paidDate: '2026-10-09', paymentMethod: 'bKash', receiptNumber: 'RCP-2610-010' }
    }
  }
];

export function loadCustomersFromStorage(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
    if (!raw) {
      saveCustomersToStorage(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all loaded customers have standard CUST-XXXXX format
      const normalized = parsed.map((c: Customer, idx: number) => ({
        ...c,
        id: formatCustomerId(c.id, idx)
      }));
      return normalized;
    }
    saveCustomersToStorage(INITIAL_CUSTOMERS);
    return INITIAL_CUSTOMERS;
  } catch (e) {
    console.error('Failed to load customers from storage', e);
    return INITIAL_CUSTOMERS;
  }
}

export function saveCustomersToStorage(customers: Customer[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    console.error('Failed to save customers to storage', e);
  }
}

export function loadZonesFromStorage(): Zone[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ZONES);
    if (!raw) {
      saveZonesToStorage(DEFAULT_ZONES);
      return DEFAULT_ZONES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ZONES;
  } catch (e) {
    console.error('Failed to load zones from storage', e);
    return DEFAULT_ZONES;
  }
}

export function saveZonesToStorage(zones: Zone[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ZONES, JSON.stringify(zones));
  } catch (e) {
    console.error('Failed to save zones to storage', e);
  }
}

export function loadSettingsFromStorage(): ISPSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      saveSettingsToStorage(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    const merged: ISPSettings = { ...DEFAULT_SETTINGS, ...parsed };
    if (!merged.phone || merged.phone === '01712-345678') {
      merged.phone = '01402-180757';
    }
    if (!merged.bkashNumber || merged.bkashNumber.includes('01712')) {
      merged.bkashNumber = '01402-180757 (Personal)';
    }
    if (!merged.nagadNumber || merged.nagadNumber.includes('01912')) {
      merged.nagadNumber = '01402-180757 (Personal)';
    }
    if (!merged.mikrotik) {
      merged.mikrotik = DEFAULT_SETTINGS.mikrotik;
    }
    if (typeof merged.smsBalance !== 'number') {
      merged.smsBalance = 100;
    }
    if (typeof merged.smsAutoSend !== 'boolean') {
      merged.smsAutoSend = true;
    }
    if (typeof merged.whatsappAutoSend !== 'boolean') {
      merged.whatsappAutoSend = false;
    }
    if (!merged.btrcRegNo) {
      merged.btrcRegNo = 'BTRC/ISP/NAT-2024/0987';
    }
    if (!merged.padTitleBn) {
      merged.padTitleBn = 'আইজে নেটওয়ার্ক - হাই স্পিড ব্রডব্যান্ড বিলিং মেমো প্যাড';
    }
    if (!merged.padTermsBn) {
      merged.padTermsBn = 'প্রতি মাসের ১০ তারিখের মধ্যে নিয়মিত বিল পরিশোধ করুন। বিল পরিশোধের পর অনলাইন মানি রিসিট ও এসএমএস নিশ্চিত করুন।';
    }
    if (!merged.cashierName) {
      merged.cashierName = 'Md. Palash (Admin)';
    }
    if (!merged.adminUsername) {
      merged.adminUsername = 'admin';
    }
    if (!merged.adminPassword) {
      merged.adminPassword = '123';
    }
    if (!merged.adminPin) {
      merged.adminPin = '1234';
    }
    if (typeof merged.adminLockEnabled !== 'boolean') {
      merged.adminLockEnabled = true;
    }
    if (typeof merged.lockOnStartup !== 'boolean') {
      merged.lockOnStartup = true;
    }
    if (typeof merged.requireLoginOnStart !== 'boolean') {
      merged.requireLoginOnStart = true;
    }
    if (!Array.isArray(merged.smsLogs)) {
      merged.smsLogs = [];
    }
    if (!Array.isArray(merged.smsRecharges)) {
      merged.smsRecharges = [];
    }
    if (!merged.themeMode || merged.themeMode === 'dark') {
      merged.themeMode = 'light';
    }
    return merged;
  } catch (e) {
    console.error('Failed to load settings from storage', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: ISPSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to storage', e);
  }
}

// Export all ISP data as JSON file for download
export function exportDataAsJsonFile(customers: Customer[], zones: Zone[], settings: ISPSettings): void {
  const exportPayload = {
    appName: 'IJ Network - ISP Billing System',
    exportDate: new Date().toISOString(),
    version: '2.0',
    settings,
    zones,
    customers
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('download', `ij_network_billing_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Generate receipt number
export function generateReceiptNumber(monthKey: string, custId: string): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const cleanMonth = monthKey.replace('-', '');
  return `IJ-${cleanMonth}-${randomSuffix}`;
}
