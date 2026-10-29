export type Language = 'bn' | 'en';

export interface MonthBillRecord {
  monthKey: string; // e.g. "2026-10"
  isPaid: boolean;
  paidAmount: number;
  dueAmount: number;
  discount: number;
  paidDate?: string;
  paymentMethod?: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other';
  transactionId?: string;
  collectedBy?: string;
  receiptNumber?: string;
  note?: string;
}

export interface Customer {
  id: string;
  pppoeId: string; // ISP PPPoE Username
  pppoePassword?: string; // ISP PPPoE Password
  name: string;
  phone: string;
  address: string;
  zoneId: string;
  zoneName: string;
  monthlyBill: number;
  packageSpeed: string;
  connectionDate: string; // YYYY-MM-DD
  status: 'active' | 'inactive' | 'suspended';
  ipAddress?: string;
  onuMac?: string;
  createdAt: string;
  deactivatedAt?: string; // Date when customer was deactivated
  reactivatedAt?: string; // Date when customer was reactivated
  bills: Record<string, MonthBillRecord>; // "YYYY-MM" -> Record
}

export interface Zone {
  id: string;
  name: string;
  code?: string;
  boxNumber?: string;
  description?: string;
  customerCount?: number;
}

export interface ISPSettings {
  companyNameBn: string;
  companyNameEn: string;
  taglineBn: string;
  taglineEn: string;
  proprietor: string;
  phone: string;
  email: string;
  addressBn: string;
  addressEn: string;
  bkashNumber: string;
  nagadNumber: string;
  billDueDeadlineDay: number; // e.g. 10th of every month
  currencySymbol: string;
  language: Language;
  googleDriveConnected: boolean;
  googleDriveEmail: string;
  lastBackupTime?: string;
  mikrotik?: MikrotikConfig;
  // Official ISP Billing Pad & Memo Configuration
  btrcRegNo?: string;
  padTitleBn?: string;
  padTermsBn?: string;
  cashierName?: string;
  // Automated SMS & WhatsApp Settings
  smsBalance: number;
  smsAutoSend: boolean;
  whatsappAutoSend: boolean;
  smsApiKey?: string;
  smsSenderId?: string;
  smsLogs?: SMSLogRecord[];
  smsRecharges?: SMSRechargeRecord[];
  // Admin Authentication & Login Portal
  adminUsername?: string;
  adminPassword?: string;
  adminPin?: string;
  adminLockEnabled?: boolean;
  lockOnStartup?: boolean;
  requireLoginOnStart?: boolean;
  // Multi-ISP Network Profiles
  activeProfileId?: string;
  ispProfiles?: ISPProfile[];
  // App Theme Mode (Light Off-White vs Dark)
  themeMode?: 'light' | 'dark';
}

export interface ISPProfile {
  id: string;
  name: string;
  phone: string;
  proprietor: string;
  address: string;
  bkashNumber: string;
  nagadNumber: string;
  packageCount?: number;
  customerCount?: number;
  isDefault?: boolean;
}

export interface SMSLogRecord {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  message: string;
  date: string;
  channel: 'sms' | 'whatsapp';
  status: 'sent' | 'failed';
  amount?: number;
}

export interface SMSRechargeRecord {
  id: string;
  date: string;
  packageTitle: string;
  smsCount: number;
  amount: number;
  paymentMethod: string;
  trxId: string;
  mobileNumber?: string; // Mobile number used for purchase
  status: 'completed';
}

export interface MikrotikConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  useSsl: boolean;
  isConnected: boolean;
  lastSyncTime?: string;
  autoDisconnectNonPaying: boolean;
  targetProfile?: string;
}

export interface BillingSummary {
  totalMonthlyBill: number;
  collectedAmount: number;
  currentMonthDueAmount: number;
  previousArrearsAmount: number;
  totalOutstandingDue: number; // current due + past arrears
  totalCustomers: number;
  paidCustomersCount: number;
  dueCustomersCount: number;
}

export interface DueCustomerPastMonths {
  monthKey: string;
  monthName: string;
  amount: number;
}
