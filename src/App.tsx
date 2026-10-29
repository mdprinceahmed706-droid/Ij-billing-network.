import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { BillingSummaryCards } from './components/BillingSummaryCards';
import { PaymentMethodSummary } from './components/PaymentMethodSummary';
import { CustomerCard } from './components/CustomerCard';
import { BillCollectionTable } from './components/BillCollectionTable';
import { SideMenuDrawer } from './components/SideMenuDrawer';

// Heavy modals lazy-loaded for high performance and fast initial loading
const QuickPayModal = lazy(() => import('./components/QuickPayModal').then(m => ({ default: m.QuickPayModal })));
const ReceiptModal = lazy(() => import('./components/ReceiptModal').then(m => ({ default: m.ReceiptModal })));
const CustomerLedgerModal = lazy(() => import('./components/CustomerLedgerModal').then(m => ({ default: m.CustomerLedgerModal })));
const AddEditCustomerModal = lazy(() => import('./components/AddEditCustomerModal').then(m => ({ default: m.AddEditCustomerModal })));
const BulkDueReminderModal = lazy(() => import('./components/BulkDueReminderModal').then(m => ({ default: m.BulkDueReminderModal })));
const BroadcastMessageModal = lazy(() => import('./components/BroadcastMessageModal').then(m => ({ default: m.BroadcastMessageModal })));
const ZoneManagerModal = lazy(() => import('./components/ZoneManagerModal').then(m => ({ default: m.ZoneManagerModal })));
const ZoneBillingBreakdownModal = lazy(() => import('./components/ZoneBillingBreakdownModal').then(m => ({ default: m.ZoneBillingBreakdownModal })));
const SettingsModal = lazy(() => import('./components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const GoogleDriveModal = lazy(() => import('./components/GoogleDriveModal').then(m => ({ default: m.GoogleDriveModal })));
const InstallModal = lazy(() => import('./components/InstallModal').then(m => ({ default: m.InstallModal })));
const AIChatModal = lazy(() => import('./components/AIChatModal').then(m => ({ default: m.AIChatModal })));
const MikrotikModal = lazy(() => import('./components/MikrotikModal').then(m => ({ default: m.MikrotikModal })));
const EditPaymentModal = lazy(() => import('./components/EditPaymentModal').then(m => ({ default: m.EditPaymentModal })));
const BillSheetModal = lazy(() => import('./components/BillSheetModal').then(m => ({ default: m.BillSheetModal })));
const SMSRechargeModal = lazy(() => import('./components/SMSRechargeModal').then(m => ({ default: m.SMSRechargeModal })));
const PermanentLinkModal = lazy(() => import('./components/PermanentLinkModal').then(m => ({ default: m.PermanentLinkModal })));

import { AdminLoginPortal } from './components/AdminLoginPortal';
import { SuccessToast, ToastInfo } from './components/SuccessToast';

import { 
  Customer, 
  Zone, 
  ISPSettings, 
  Language, 
  MikrotikConfig 
} from './types/isp';
import { 
  translations, 
  formatCurrency, 
  formatNumber 
} from './i18n/translations';
import { 
  calculateBillingSummary, 
  getCustomerCurrentMonthStatus, 
  getCustomerPastDues,
  getFirstBillingMonthKey
} from './utils/billingCalculations';
import { 
  loadCustomersFromStorage, 
  saveCustomersToStorage, 
  loadZonesFromStorage, 
  saveZonesToStorage, 
  loadSettingsFromStorage, 
  saveSettingsToStorage, 
  exportDataAsJsonFile, 
  INITIAL_CUSTOMERS, 
  DEFAULT_ZONES 
} from './utils/storage';

import { 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  UserPlus, 
  UserCheck,
  UserX,
  Send,
  ArrowLeft,
  ChevronRight,
  Receipt,
  CreditCard,
  Clock,
  Sparkles,
  Layers,
  Network,
  Phone,
  MessageSquare,
  ShieldCheck,
  Edit,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Core persistent state
  const [settings, setSettings] = useState<ISPSettings>(() => loadSettingsFromStorage());
  const [zones, setZones] = useState<Zone[]>(() => loadZonesFromStorage());
  const [customers, setCustomers] = useState<Customer[]>(() => loadCustomersFromStorage());

  // Current active month for billing (defaults to 2026-10)
  const [currentMonthKey, setCurrentMonthKey] = useState<string>('2026-10');

  // VIEW MODE: 'dashboard' (billing accounts) | 'customers' (directory with edit) | 'bill_collection' (pay bills table)
  const [currentView, setCurrentView] = useState<'dashboard' | 'customers' | 'bill_collection'>('dashboard');
  const [billCollectionTab, setBillCollectionTab] = useState<'running' | 'paid' | 'sheet'>('running');

  // Customer List Filters (Active when currentView === 'customers')
  const [filterMode, setFilterMode] = useState<'due' | 'paid' | 'all' | 'inactive'>('due');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('ALL');

  // Modals state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quickPayCustomer, setQuickPayCustomer] = useState<{ customer: Customer; monthKey: string } | null>(null);
  const [editPaymentCustomer, setEditPaymentCustomer] = useState<{ customer: Customer; monthKey: string } | null>(null);
  const [receiptCustomer, setReceiptCustomer] = useState<{ customer: Customer; monthKey: string } | null>(null);
  const [ledgerCustomer, setLedgerCustomer] = useState<Customer | null>(null);
  const [successToast, setSuccessToast] = useState<ToastInfo | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false);
  const [isBroadcastMessageOpen, setIsBroadcastMessageOpen] = useState(false);
  const [isZoneManagerOpen, setIsZoneManagerOpen] = useState(false);
  const [isZoneBillingModalOpen, setIsZoneBillingModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'system' | 'security' | 'backup' | 'sms' | 'language'>('system');

  const handleOpenSettings = (tab: 'system' | 'security' | 'backup' | 'sms' | 'language' = 'system') => {
    setSettingsInitialTab(tab);
    setIsSettingsOpen(true);
  };
  const [isGoogleDriveOpen, setIsGoogleDriveOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isMikrotikOpen, setIsMikrotikOpen] = useState(false);
  const [isBillSheetOpen, setIsBillSheetOpen] = useState(false);
  const [isSMSRechargeOpen, setIsSMSRechargeOpen] = useState(false);
  const [isPermanentLinkOpen, setIsPermanentLinkOpen] = useState(false);
  // Admin Authentication Session: Persisted in localStorage/sessionStorage so browser reload keeps user logged in
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ij_admin_auth_active') === 'true' || 
             sessionStorage.getItem('ij_admin_auth_active') === 'true';
    } catch {
      return false;
    }
  });

  const handleLoginSuccess = (_rememberMe: boolean) => {
    try {
      localStorage.setItem('ij_admin_auth_active', 'true');
      sessionStorage.setItem('ij_admin_auth_active', 'true');
    } catch (e) {
      console.warn('Storage save error', e);
    }
    setIsAuthenticated(true);
    // User requested NO toast on login ("পাসওয়ার্ড দিয়ে ঢোকার পরে উপরে একটা লেখা আছে বিল সম্পূর্ণ হয়েছে একটি শুধু বিল পেমেন্ট করলেই আসবে আর কোথাও না")
    setSuccessToast(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('ij_admin_auth_active');
      sessionStorage.removeItem('ij_admin_auth_active');
      localStorage.removeItem('ij_admin_auth_token');
      sessionStorage.removeItem('ij_admin_auth_token');
    } catch (e) {
      console.warn('Storage error on logout', e);
    }
    setSuccessToast({
      message: settings.language === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট থেকে সফলভাবে লগআউট করা হয়েছে।' : 'Signed out successfully.',
      type: 'status'
    });
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const lang = settings.language;
  const t = translations[lang];

  // Capture PWA Mobile Install Event (Chrome / Edge / Android)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // Save changes to storage whenever modified
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  useEffect(() => {
    saveZonesToStorage(zones);
  }, [zones]);

  useEffect(() => {
    saveCustomersToStorage(customers);
  }, [customers]);

  // Language Toggle helper
  const handleToggleLanguage = () => {
    const nextLang: Language = settings.language === 'bn' ? 'en' : 'bn';
    setSettings(prev => ({ ...prev, language: nextLang }));
  };

  // Billing summary calculation
  const billingSummary = useMemo(() => {
    return calculateBillingSummary(customers, currentMonthKey, lang);
  }, [customers, currentMonthKey, lang]);

  // Count active vs inactive customers
  const activeCount = useMemo(() => customers.filter(c => c.status === 'active').length, [customers]);
  const inactiveCount = useMemo(() => customers.filter(c => c.status !== 'active').length, [customers]);

  // Filtered customer list for Customer Directory Page
  const filteredCustomers = useMemo(() => {
    return customers.filter(cust => {
      // Zone filter
      if (selectedZoneFilter !== 'ALL' && cust.zoneId !== selectedZoneFilter) {
        return false;
      }

      // Search query (search by name, pppoeId, phone, address, zone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = cust.name?.toLowerCase().includes(q);
        const matchPppoe = cust.pppoeId?.toLowerCase().includes(q);
        const matchPhone = cust.phone?.includes(q);
        const matchAddress = cust.address?.toLowerCase().includes(q);
        const matchZone = cust.zoneName?.toLowerCase().includes(q);

        if (!matchName && !matchPppoe && !matchPhone && !matchAddress && !matchZone) {
          return false;
        }
      }

      // Filter Mode: Inactive vs Due vs Paid vs All
      if (filterMode === 'inactive') {
        return cust.status !== 'active';
      }

      // STRICT ISOLATION: Deactivated customers are completely excluded from active directory & dues!
      if (cust.status !== 'active') {
        return false;
      }

      const { isPaid, currentMonthDue, isPendingCycle } = getCustomerCurrentMonthStatus(cust, currentMonthKey);
      const { totalPastDue } = getCustomerPastDues(cust, currentMonthKey, lang);
      const totalOutstanding = currentMonthDue + totalPastDue;

      if (filterMode === 'due') {
        if (cust.status !== 'active') return false;
        if (isPendingCycle) return false;
        return totalOutstanding > 0;
      } else if (filterMode === 'paid') {
        if (cust.status !== 'active') return false;
        return !isPendingCycle && totalOutstanding === 0;
      }

      return true; // 'all'
    });
  }, [customers, selectedZoneFilter, searchQuery, filterMode, currentMonthKey, lang]);

  // Quick Pay confirm handler with partial payment accumulation
  // Quick Pay confirm handler with automatic past due + running bill allocation
  const handleConfirmPayment = (
    customerId: string,
    monthKey: string,
    paidAmount: number,
    discount: number,
    paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other',
    transactionId?: string,
    note?: string,
    receiptNumber?: string,
    paidDate?: string
  ) => {
    const todayDate = paidDate || new Date().toISOString().slice(0, 10);

    setCustomers(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;

        const updatedBills = { ...(c.bills || {}) };
        const { pastDueList } = getCustomerPastDues(c, monthKey, lang);

        let remainingToApply = paidAmount;

        // 1. Clear or reduce past due bills first (oldest to newest)
        if (pastDueList && pastDueList.length > 0) {
          for (const pastMonth of pastDueList) {
            if (remainingToApply <= 0) break;
            const pastPay = Math.min(remainingToApply, pastMonth.amount);
            const oldBill = updatedBills[pastMonth.monthKey] || {};
            const oldPaid = oldBill.paidAmount || 0;
            const newPastDue = Math.max(0, pastMonth.amount - pastPay);

            updatedBills[pastMonth.monthKey] = {
              ...oldBill,
              monthKey: pastMonth.monthKey,
              isPaid: newPastDue === 0,
              paidAmount: oldPaid + pastPay,
              dueAmount: newPastDue,
              discount: oldBill.discount || 0,
              paidDate: todayDate,
              paymentMethod
            };

            remainingToApply -= pastPay;
          }
        }

        // 2. Apply remaining payment to current month
        const previousPaid = c.bills?.[monthKey]?.paidAmount || 0;
        const previousDiscount = c.bills?.[monthKey]?.discount || 0;
        const totalPaidCurrentSoFar = previousPaid + remainingToApply;
        const totalDiscountSoFar = previousDiscount + discount;
        const newDueCurrentMonth = Math.max(0, c.monthlyBill - totalPaidCurrentSoFar - totalDiscountSoFar);

        // Store total paid today on current month's voucher/record for clear receipt & audit
        updatedBills[monthKey] = {
          monthKey,
          isPaid: newDueCurrentMonth === 0,
          paidAmount: previousPaid + paidAmount,
          dueAmount: newDueCurrentMonth,
          discount: totalDiscountSoFar,
          paidDate: todayDate,
          paymentMethod,
          transactionId,
          note,
          receiptNumber
        };

        return {
          ...c,
          bills: updatedBills
        };
      })
    );

    const target = customers.find(c => c.id === customerId);

    // Calculate remaining dues after this payment (কত টাকা বকেয়া আছে)
    const { totalPastDue } = getCustomerPastDues(target || ({} as any), monthKey, lang);
    const prevCurrentDue = Math.max(0, (target?.monthlyBill || 0) - (target?.bills?.[monthKey]?.paidAmount || 0));
    const remainingDue = Math.max(0, (totalPastDue + prevCurrentDue) - paidAmount - discount);

    // Generate automated notification text
    const company = settings.companyNameBn || settings.companyNameEn || 'আইজে নেটওয়ার্ক';
    const cleanReceiptNo = receiptNumber || `IJ-${monthKey.replace('-', '')}-${customerId.slice(-4)}`;

    // Every SMS message is permanently in pure Bengali (বাংলা)
    const finalMessage = `সম্মানিত ${target?.name || 'গ্রাহক'},\n${company}-এ আপনার ইন্টারনেট বিল ৳${paidAmount}/- সফলভাবে গ্রহণ করা হয়েছে।\nরশিদ নং: ${cleanReceiptNo}\nবর্তমান বকেয়া: ৳${remainingDue}/-।\nনিয়মিত বিল পরিশোধের জন্য ধন্যবাদ!\nহেল্পলাইন: ${settings.phone}`;

    // Deduct 1 SMS & save to SMS logs if automated SMS is active
    let updatedBalance = settings.smsBalance || 0;
    const currentLogs = [...(settings.smsLogs || [])];

    if (settings.smsAutoSend !== false && updatedBalance > 0 && target?.phone) {
      updatedBalance -= 1;
      currentLogs.unshift({
        id: `sms-${Date.now()}`,
        customerId,
        customerName: target?.name || '',
        phone: target?.phone || '',
        message: finalMessage,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        channel: 'sms',
        status: 'sent',
        amount: paidAmount
      });

      setSettings(prev => ({
        ...prev,
        smsBalance: updatedBalance,
        smsLogs: currentLogs
      }));
    }

    // Prepare WhatsApp URL for on-demand 1-click sending
    let waUrl: string | undefined = undefined;
    if (target?.phone) {
      const rawPhone = target.phone.replace(/[^0-9]/g, '');
      const cleanPhone = rawPhone.startsWith('88') ? rawPhone : (rawPhone.startsWith('0') ? `88${rawPhone}` : `880${rawPhone}`);
      waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(finalMessage)}`;

      // ONLY forcefully open WhatsApp if the operator explicitly enabled auto-popup in settings
      if (settings.whatsappAutoSend === true) {
        try {
          window.open(waUrl, '_blank');
        } catch (e) {
          console.warn('Auto WhatsApp open failed:', e);
        }
      }
    }

    setSuccessToast({
      message: lang === 'bn' 
        ? `গ্রাহক ${target?.name || ''}-এর বিল পরিশোধ সফল হয়েছে। স্বয়ংক্রিয় SMS রেকর্ড হয়েছে।`
        : `Payment successful for ${target?.name || 'customer'}.`,
      type: 'payment_success',
      customerName: target?.name,
      amount: paidAmount,
      dueAmount: remainingDue,
      paidDate: paidDate,
      whatsappUrl: waUrl,
      whatsappLabel: lang === 'bn' ? 'WhatsApp এ রসিদ পাঠান' : 'Send WhatsApp Receipt'
    });
  };

  // Revert payment handler (Revert accidentally paid bill back to unpaid)
  const handleRevertPayment = (customerId: string, monthKey: string) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        const updatedBills = { ...(c.bills || {}) };
        delete updatedBills[monthKey];
        return {
          ...c,
          bills: updatedBills
        };
      })
    );

    const target = customers.find(c => c.id === customerId);
    setSuccessToast({
      message: lang === 'bn'
        ? `গ্রাহক ${target?.name || ''}-এর বিল পরিশোধ বাতিল করা হয়েছে এবং গ্রাহক পুনরায় বকেয়া তালিকায় ফিরে এসেছে!`
        : `Payment for ${target?.name || 'customer'} reverted! Customer is back in the due list.`,
      type: 'revert'
    });
  };

  // Save edited payment
  const handleSaveEditPayment = (
    customerId: string,
    monthKey: string,
    paidAmount: number,
    discount: number,
    paymentMethod: 'Cash' | 'bKash' | 'Nagad' | 'Bank' | 'Other',
    paidDate: string,
    transactionId?: string,
    note?: string
  ) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        const newDue = Math.max(0, c.monthlyBill - paidAmount - discount);
        const updatedBills = { ...(c.bills || {}) };
        const existing = updatedBills[monthKey];
        updatedBills[monthKey] = {
          ...existing,
          monthKey,
          isPaid: newDue === 0,
          paidAmount,
          discount,
          dueAmount: newDue,
          paymentMethod,
          paidDate,
          transactionId,
          note
        };
        return {
          ...c,
          bills: updatedBills
        };
      })
    );

    setSuccessToast({
      message: 'পেমেন্টের তথ্য সফলভাবে আপডেট ও সংশোধন করা হয়েছে!',
      type: 'edit'
    });
  };

  // Toggle active/deactive customer status
  const handleToggleCustomerStatus = (customerId: string) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        const nextStatus = c.status === 'active' ? 'inactive' : 'active';
        return {
          ...c,
          status: nextStatus
        };
      })
    );

    const target = customers.find(c => c.id === customerId);
    const nextStatusText = target?.status === 'active' 
      ? 'ডিঅ্যাক্টিভ (লাইন বন্ধ) করা হয়েছে এবং বিল কালেকশন থেকে সরিয়ে রাখা হয়েছে!' 
      : 'অ্যাক্টিভ (লাইন চালু) করা হয়েছে এবং পুনরায় বিল কালেকশনে যুক্ত হয়েছে!';
    setSuccessToast({
      message: `গ্রাহক ${target?.name || ''} সফলভাবে ${nextStatusText}`,
      type: 'status'
    });
  };

  // Dedicated Deactivate Customer Handler (Removes customer from active directory & bill collection)
  const handleDeactivateCustomer = (customer: Customer) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (window.confirm(`গ্রাহক "${customer.name}"-কে কি ডিঅ্যাক্টিভ (লাইন বন্ধ) করতে চান? গ্রাহকের লাইন বন্ধ হবে এবং তিনি ডিঅ্যাক্টিভ গ্রাহক তালিকায় স্থানান্তর হবেন।`)) {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id !== customer.id) return c;
          return {
            ...c,
            status: 'inactive' as const,
            deactivatedAt: todayStr
          };
        })
      );
      setSuccessToast({
        message: `গ্রাহক ${customer.name}-কে সফলভাবে ডিঅ্যাক্টিভ করা হয়েছে এবং ডিঅ্যাক্টিভ তালিকায় রাখা হয়েছে।`,
        type: 'status'
      });
    }
  };

  // Dedicated Reactivate Customer Handler (Restarts billing from reactivation date as requested)
  const handleReactivateCustomer = (customer: Customer) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (window.confirm(`গ্রাহক "${customer.name}"-কে কি পুনরায় সক্রিয় করতে চান? আজকের তারিখ (${todayStr}) থেকে নতুন বিলিং শুরু হবে।`)) {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id !== customer.id) return c;
          return {
            ...c,
            status: 'active' as const,
            reactivatedAt: todayStr,
            connectionDate: todayStr // Billing restarts from reactivation date!
          };
        })
      );
      setSuccessToast({
        message: `গ্রাহক ${customer.name} সফলভাবে সক্রিয় করা হয়েছে! আজকের তারিখ (${todayStr}) থেকে বিল শুরু হয়েছে।`,
        type: 'status'
      });
    }
  };

  // Add / Edit customer handler
  const handleSaveCustomer = (savedCustomer: Customer) => {
    setCustomers(prev => {
      const existingIndex = prev.findIndex(c => c.id === savedCustomer.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = savedCustomer;
        return next;
      }
      return [savedCustomer, ...prev];
    });
    setCustomerToEdit(null);
  };

  // Trigger customer edit
  const handleOpenEditCustomer = (cust: Customer) => {
    setCustomerToEdit(cust);
    setIsAddCustomerOpen(true);
  };

  // Trigger add new customer
  const handleOpenNewCustomer = () => {
    setCustomerToEdit(null);
    setIsAddCustomerOpen(true);
  };

  // Add inline zone handler
  const handleAddNewZone = (zoneName: string): Zone => {
    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name: zoneName,
      code: `Z-${zones.length + 1}`,
      boxNumber: `BOX-0${zones.length + 1}`
    };
    setZones(prev => [...prev, newZone]);
    return newZone;
  };

  // Delete single customer
  const handleDeleteCustomer = (customer: Customer) => {
    const msg = `${t.confirmDelete} ${customer.name}?`;
    if (window.confirm(msg)) {
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
    }
  };

  // Reset / Clear all customers
  const handleClearAllCustomers = () => {
    if (window.confirm(t.confirmClearAll)) {
      setCustomers([]);
    }
  };

  // Load demo data
  const handleLoadDemoData = () => {
    if (window.confirm(t.confirmLoadDemo)) {
      setCustomers(INITIAL_CUSTOMERS);
      setZones(DEFAULT_ZONES);
    }
  };

  // Save MikroTik settings
  const handleSaveMikrotik = (mikrotikConfig: MikrotikConfig) => {
    setSettings(prev => ({
      ...prev,
      mikrotik: mikrotikConfig
    }));
  };

  // If user is not authenticated, display Facebook/SaaS style Admin Login Portal immediately
  if (!isAuthenticated) {
    return (
      <>
        <AdminLoginPortal
          settings={settings}
          onLoginSuccess={handleLoginSuccess}
          onToggleLanguage={handleToggleLanguage}
        />
        {successToast && (
          <SuccessToast
            toast={successToast}
            onDismiss={() => setSuccessToast(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        settings={settings}
        currentMonthKey={currentMonthKey}
        onMonthChange={setCurrentMonthKey}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onToggleLanguage={handleToggleLanguage}
        onOpenInstallGuide={() => setIsInstallModalOpen(true)}
        onOpenPermanentLink={() => setIsPermanentLinkOpen(true)}
        onLogout={handleLogout}
        onOpenSettings={() => handleOpenSettings('security')}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        dueCount={billingSummary.dueCustomersCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        
        {/* ========================================================== */}
        {/* VIEW 1: DASHBOARD (বিলের হিসাব ও আয়-ব্যয় ড্যাশবোর্ড)       */}
        {/* ========================================================== */}
        {currentView === 'dashboard' ? (
          <div className="space-y-4 sm:space-y-6">

            {/* 1. বিলের প্রধান হিসাব কার্ডসমূহ (Billing Summary Cards) */}
            <BillingSummaryCards
              summary={billingSummary}
              activeCount={activeCount}
              inactiveCount={inactiveCount}
              lang={lang}
              onSelectActive={() => {
                setFilterMode('all');
                setCurrentView('customers');
              }}
              onSelectInactive={() => {
                setFilterMode('inactive');
                setCurrentView('customers');
              }}
            />

            {/* 2. পেমেন্ট মাধ্যম অনুযায়ী আদায়ের হিসাব (Cash, bKash, Nagad) */}
            <PaymentMethodSummary
              customers={customers}
              currentMonthKey={currentMonthKey}
              lang={lang}
            />

            {/* Group SMS & WhatsApp Broadcast Bar */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {lang === 'bn' ? 'সকল গ্রাহকের নম্বরে একসাথে SMS ও WhatsApp পাঠান' : 'Broadcast SMS & WhatsApp to All Numbers'}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {lang === 'bn' ? `নোটিশ বা জরুরি বার্তা পাঠান (হেল্পলাইন: ${settings.phone})` : 'Send notices or notifications to all customers'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBroadcastMessageOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer transition shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'bn' ? 'মেসেজ পাঠান' : 'Broadcast'}</span>
              </button>
            </div>

          </div>
        ) : currentView === 'bill_collection' ? (
          
          /* ========================================================== */
          /* VIEW 2: BILL COLLECTION COUNTER */
          /* ========================================================== */
          <div className="space-y-4">
            
            {/* Top Navigation Bar for Bill Collection */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              
              {/* Left: Back to Dashboard & Counter Label */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                  <span>{lang === 'bn' ? '← ড্যাশবোর্ড' : '← Dashboard'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                    <span>💵 {lang === 'bn' ? 'বিল কালেকশন কাউন্টার' : 'Bill Collection Counter'}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wide">
                    PAY BILL
                  </span>
                </div>
              </div>

              {/* Right: Active vs Inactive Count indicator */}
              <div className="flex flex-wrap items-center gap-2 self-center sm:self-auto text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{lang === 'bn' ? `সক্রিয় লাইন: ${formatNumber(activeCount, lang)} জন` : `Active Lines: ${formatNumber(activeCount, lang)}`}</span>
                </span>
                <button
                  type="button"
                  onClick={() => { setCurrentView('customers'); setFilterMode('inactive'); }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition active:scale-95"
                  title={lang === 'bn' ? 'ক্লিক করে শুধুমাত্র ডিঅ্যাক্টিভ গ্রাহকদের তালিকা দেখুন' : 'Click to view deactivated customers'}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>{lang === 'bn' ? `বন্ধ লাইন: ${formatNumber(inactiveCount, lang)} জন (দেখুন)` : `Inactive: ${formatNumber(inactiveCount, lang)}`}</span>
                </button>
              </div>

            </div>

            {/* Search & Zone Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'bn' ? 'গ্রাহকের নাম, মোবাইল, PPPoE বা CUS আইডি দিয়ে খুঁজুন...' : 'Search by customer name, mobile, PPPoE or CUS ID...'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:border-blue-600 focus:outline-none transition shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="shrink-0 sm:w-56">
                <select
                  value={selectedZoneFilter}
                  onChange={(e) => setSelectedZoneFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs focus:border-blue-600 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">{t.allZones}</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} {z.boxNumber ? `(${z.boxNumber})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bill Collection Component (Contains: 1. বিল কালেকশন, 2. পেইড বিল, 3. বিল শিট) */}
            <BillCollectionTable
              customers={customers.filter(c => {
                if (selectedZoneFilter !== 'ALL' && c.zoneId !== selectedZoneFilter) return false;
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase().trim();
                  return c.name?.toLowerCase().includes(q) || c.pppoeId?.toLowerCase().includes(q) || c.phone?.includes(q);
                }
                return true;
              })}
              currentMonthKey={currentMonthKey}
              settings={settings}
              defaultTab={billCollectionTab}
              onPayBill={(c, mKey) => setQuickPayCustomer({ customer: c, monthKey: mKey })}
              onEditPayment={(c, mKey) => setEditPaymentCustomer({ customer: c, monthKey: mKey })}
              onRevertPayment={handleRevertPayment}
              onViewReceipt={(c, mKey) => setReceiptCustomer({ customer: c, monthKey: mKey })}
              onViewLedger={(c) => setLedgerCustomer(c)}
              onToggleStatus={handleToggleCustomerStatus}
              onUpdateSettings={setSettings}
              onShowToast={(msg, type) => setSuccessToast({ message: msg, type: type || 'success' })}
              onOpenBillSheet={() => setIsBillSheetOpen(true)}
            />

          </div>

        ) : (
          
          /* ========================================================== */
          /* VIEW 3: ALL CUSTOMER DIRECTORY (কাস্টমার এডিট ও পরিচালনা) */
          /* ========================================================== */
          <div className="space-y-4">
            
            {/* Top Navigation Bar: Back to Dashboard & Edit Directory Title */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              
              {/* Left: Back to Dashboard Button & Directory Title */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600" />
                  <span>{lang === 'bn' ? '← ড্যাশবোর্ডে ফিরে যান' : '← Back to Dashboard'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {lang === 'bn' ? '👥 সকল কাস্টমার ডিরেক্টরি' : '👥 All Customer Directory'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    এডিট ও পরিচালনা
                  </span>
                </div>
              </div>

              {/* Filter Tabs: Due vs Paid vs All */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-center sm:self-auto">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সক্রিয় গ্রাহক' : 'Active'}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterMode === 'all' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {activeCount}
                  </span>
                </button>

                <button
                  onClick={() => setFilterMode('due')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    filterMode === 'due'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t.filterDueOnly}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterMode === 'due' ? 'bg-amber-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {billingSummary.dueCustomersCount}
                  </span>
                </button>

                <button
                  onClick={() => setFilterMode('paid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    filterMode === 'paid'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{t.filterPaidOnly}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterMode === 'paid' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {billingSummary.paidCustomersCount}
                  </span>
                </button>

                {/* 4. ডিঅ্যাক্টিভ কাস্টমার বাটন (Inactive / Disconnected Lines Only) */}
                <button
                  onClick={() => setFilterMode('inactive')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    filterMode === 'inactive'
                      ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs'
                  }`}
                  title={lang === 'bn' ? 'সকল বন্ধ ও সংযোগ বিচ্ছিন্ন গ্রাহকের তালিকা দেখুন' : 'View deactivated customers'}
                >
                  <UserX className="w-3.5 h-3.5 text-rose-600" />
                  <span>{lang === 'bn' ? 'ডিঅ্যাক্টিভ লাইনসমূহ' : 'Deactive Lines'}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${filterMode === 'inactive' ? 'bg-rose-900 text-white' : 'bg-rose-200 text-rose-900'}`}>
                    {inactiveCount}
                  </span>
                </button>
              </div>

              {/* Add New Customer Button */}
              <button
                onClick={handleOpenNewCustomer}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer transition shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.addNewCustomer}</span>
              </button>

            </div>

            {/* Search & Zone Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              
              {/* Search input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:border-blue-600 focus:outline-none transition shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Zone Filter Dropdown */}
              <div className="shrink-0 sm:w-56">
                <select
                  value={selectedZoneFilter}
                  onChange={(e) => setSelectedZoneFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs focus:border-blue-600 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">{t.allZones}</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} {z.boxNumber ? `(${z.boxNumber})` : ''}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Customer List Header & Summary Count */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <div>
                <span>{lang === 'bn' ? 'ডিরেক্টরি গ্রাহক সংখ্যা:' : 'Total Directory Matching:'} </span>
                <span className="font-extrabold text-slate-900">{filteredCustomers.length}</span>
                <span className="ml-2 text-[11px] text-blue-600 font-semibold">
                  ({lang === 'bn' ? 'প্রতিটি কাস্টমারের পাশে সবুজ "এডিট" বাটন রয়েছে, যা দিয়ে নাম, ফোন বা তথ্য পরিবর্তন করতে পারেন' : 'Click the green Edit button on any customer to edit details'})
                </span>
              </div>

              {filterMode === 'due' && filteredCustomers.length > 0 && (
                <button
                  onClick={() => setIsBulkReminderOpen(true)}
                  className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সকল বকেয়া গ্রাহককে তাগাদা পাঠান' : 'Send Bulk Due Reminders'}</span>
                </button>
              )}
            </div>

            {/* Deactive Customer Notice Banner */}
            {filterMode === 'inactive' && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                    <UserX className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-rose-950">
                      {lang === 'bn' ? '🔴 ডিঅ্যাক্টিভ লাইনসমূহ (সংযোগ বিচ্ছিন্ন গ্রাহক তালিকা)' : '🔴 Deactivated Customers'}
                    </h4>
                    <p className="text-xs text-rose-700 mt-0.5">
                      {lang === 'bn' 
                        ? 'এই গ্রাহকদের লাইন সাময়িকভাবে বন্ধ আছে এবং মূল কাস্টমার ডিরেক্টরি ও বিল কালেকশন থেকে সরিয়ে রাখা হয়েছে। লাইন পুনরায় চালু করতে প্রতিটি কাস্টমারের পাশের "সক্রিয়" বাটনে চাপ দিন। যে তারিখে সক্রিয় করবেন সেই তারিখ থেকে স্বয়ংক্রিয়ভাবে বিলিং শুরু হবে।'
                        : 'These customers are disconnected. Click "Active" to reactivate them and resume billing from that date.'}
                    </p>
                  </div>
                </div>
                <div className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 shrink-0">
                  {lang === 'bn' ? `মোট বন্ধ লাইন: ${formatNumber(inactiveCount, lang)} জন` : `Total Inactive: ${formatNumber(inactiveCount, lang)}`}
                </div>
              </div>
            )}

            {/* Customer Table List */}
            {filteredCustomers.length > 0 ? (
              <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                        <th className="py-3 px-2 text-center whitespace-nowrap">{lang === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</th>
                        <th className="py-3 px-2.5 sm:px-4">IP / PPPoE</th>
                        <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'গ্রাহকের নাম ও ফোন' : 'Name & Phone'}</th>
                        <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'বকেয়া' : 'Arrears'}</th>
                        <th className="py-3 px-2.5 sm:px-4">{lang === 'bn' ? 'চলতি মাস' : 'Current Month'}</th>
                        <th className="py-3 px-2.5 sm:px-4 text-center">{lang === 'bn' ? 'এমবিপিএস' : 'Speed'}</th>
                        <th className="py-3 px-2.5 sm:px-4 text-right">{lang === 'bn' ? 'বিলিং অ্যাকশন' : 'Billing Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.map((cust, idx) => (
                        <CustomerCard
                          key={cust.id}
                          index={idx}
                          customer={cust}
                          currentMonthKey={currentMonthKey}
                          settings={settings}
                          onPayBill={(c, mKey) => setQuickPayCustomer({ customer: c, monthKey: mKey })}
                          onViewReceipt={(c, mKey) => setReceiptCustomer({ customer: c, monthKey: mKey })}
                          onViewLedger={(c) => setLedgerCustomer(c)}
                          onDeleteCustomer={handleDeleteCustomer}
                          onEditCustomer={handleOpenEditCustomer}
                          onDeactivateCustomer={handleDeactivateCustomer}
                          onReactivateCustomer={handleReactivateCustomer}
                          onToggleStatus={handleToggleCustomerStatus}
                          onUpdateSettings={setSettings}
                          onShowToast={(msg, type) => setSuccessToast({ message: msg, type: type || 'success' })}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center space-y-3">
                <div className="p-3 rounded-full bg-slate-100 text-slate-400">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {filterMode === 'due' ? t.noDueGreeting : t.noCustomersFound}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  {filterMode === 'due'
                    ? (lang === 'bn' ? 'কোনো বকেয়া বাকি নেই! সকল গ্রাহক বিল পরিশোধ সম্পন্ন করেছেন।' : 'All active customers have cleared their dues.')
                    : (lang === 'bn' ? 'কোনো গ্রাহক পাওয়া যায়নি। নতুন গ্রাহক যোগ করতে পারেন।' : 'No customers matched your filter.')}
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleOpenNewCustomer}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{t.addNewCustomer}</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold transition cursor-pointer border border-slate-200"
                  >
                    ড্যাশবোর্ড দেখুন
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ============================================================ */}
      {/* SIDE DRAWER MENU (সরাসরি মেনু অপশন)                          */}
      {/* ============================================================ */}
      <SideMenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onOpenBillCollection={() => {
          setBillCollectionTab('running');
          setCurrentView('bill_collection');
        }}
        onOpenPaidBills={() => {
          setBillCollectionTab('paid');
          setCurrentView('bill_collection');
        }}
        onOpenBillSheet={() => setIsBillSheetOpen(true)}
        onOpenSMSRecharge={() => setIsSMSRechargeOpen(true)}
        onOpenPermanentLink={() => setIsPermanentLinkOpen(true)}
        onLogout={handleLogout}
        settings={settings}
        onToggleLanguage={handleToggleLanguage}
        onOpenAddCustomer={handleOpenNewCustomer}
        onFilterDueOnly={() => {
          setFilterMode('due');
          setCurrentView('customers');
        }}
        onFilterPaidOnly={() => {
          setBillCollectionTab('paid');
          setCurrentView('bill_collection');
        }}
        onFilterAll={() => {
          setFilterMode('all');
          setCurrentView('customers');
        }}
        onOpenBulkReminder={() => setIsBulkReminderOpen(true)}
        onOpenBroadcastMessage={() => setIsBroadcastMessageOpen(true)}
        onOpenZoneBillingBreakdown={() => setIsZoneBillingModalOpen(true)}
        onOpenZoneManager={() => setIsZoneManagerOpen(true)}
        onOpenMikrotik={() => setIsMikrotikOpen(true)}
        onOpenGoogleDrive={() => setIsGoogleDriveOpen(true)}
        onExportJson={() => exportDataAsJsonFile(customers, zones, settings)}
        onImportJson={() => setIsGoogleDriveOpen(true)}
        onOpenSettings={(tab) => handleOpenSettings(tab || 'system')}
        onOpenInstallGuide={() => setIsInstallModalOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onClearAllData={handleClearAllCustomers}
        onLoadDemoData={handleLoadDemoData}
        dueCount={billingSummary.dueCustomersCount}
        paidCount={billingSummary.paidCustomersCount}
        totalCount={billingSummary.totalCustomers}
        inactiveCount={inactiveCount}
        onFilterInactive={() => {
          setFilterMode('inactive');
          setCurrentView('customers');
        }}
      />

      {/* TOP FLOATING SUCCESS TOAST (সাকসেসফুল নোটিফিকেশন) */}
      <SuccessToast toast={successToast} onDismiss={() => setSuccessToast(null)} />

      {/* ============================================================ */}
      {/* LAZY LOADED MODALS (Suspense to keep initial load lightweight)*/}
      {/* ============================================================ */}
      <Suspense fallback={null}>
        
        {/* QUICK PAY MODAL */}
        {quickPayCustomer && (
          <QuickPayModal
            isOpen={!!quickPayCustomer}
            onClose={() => setQuickPayCustomer(null)}
            customer={quickPayCustomer.customer}
            monthKey={quickPayCustomer.monthKey || currentMonthKey}
            settings={settings}
            onConfirmPayment={handleConfirmPayment}
          />
        )}

        {/* EDIT PAYMENT MODAL (ভুলবশত পেইড হলে সংশোধন বা রিভার্ট) */}
        {editPaymentCustomer && (
          <EditPaymentModal
            isOpen={!!editPaymentCustomer}
            onClose={() => setEditPaymentCustomer(null)}
            customer={editPaymentCustomer.customer}
            monthKey={editPaymentCustomer.monthKey || currentMonthKey}
            settings={settings}
            onSavePayment={handleSaveEditPayment}
            onRevertPayment={handleRevertPayment}
          />
        )}

        {/* MONEY RECEIPT VOUCHER MODAL */}
        {receiptCustomer && (
          <ReceiptModal
            isOpen={!!receiptCustomer}
            onClose={() => setReceiptCustomer(null)}
            customer={receiptCustomer.customer}
            monthKey={receiptCustomer.monthKey || currentMonthKey}
            settings={settings}
          />
        )}

        {/* 12 MONTHS LEDGER MODAL */}
        {ledgerCustomer && (
          <CustomerLedgerModal
            isOpen={!!ledgerCustomer}
            onClose={() => setLedgerCustomer(null)}
            customer={ledgerCustomer}
            settings={settings}
            onPayMonth={(cust, mKey) => {
              setLedgerCustomer(null);
              setQuickPayCustomer({ customer: cust, monthKey: mKey });
            }}
            onViewReceipt={(cust, mKey) => {
              setLedgerCustomer(null);
              setReceiptCustomer({ customer: cust, monthKey: mKey });
            }}
          />
        )}

        {/* ADD / EDIT CUSTOMER MODAL */}
        {isAddCustomerOpen && (
          <AddEditCustomerModal
            isOpen={isAddCustomerOpen}
            onClose={() => {
              setIsAddCustomerOpen(false);
              setCustomerToEdit(null);
            }}
            zones={zones}
            settings={settings}
            onSaveCustomer={handleSaveCustomer}
            onAddNewZone={handleAddNewZone}
            customerToEdit={customerToEdit}
          />
        )}

        {/* MIKROTIK ROUTEROS MODAL */}
        {isMikrotikOpen && (
          <MikrotikModal
            isOpen={isMikrotikOpen}
            onClose={() => setIsMikrotikOpen(false)}
            settings={settings}
            customers={customers}
            onSaveMikrotikSettings={handleSaveMikrotik}
          />
        )}

        {/* BULK DUE REMINDER (SMS & WHATSAPP) MODAL */}
        {isBulkReminderOpen && (
          <BulkDueReminderModal
            isOpen={isBulkReminderOpen}
            onClose={() => setIsBulkReminderOpen(false)}
            customers={customers}
            currentMonthKey={currentMonthKey}
            settings={settings}
          />
        )}

        {/* ALL CUSTOMERS BROADCAST SMS & WHATSAPP MODAL */}
        {isBroadcastMessageOpen && (
          <BroadcastMessageModal
            isOpen={isBroadcastMessageOpen}
            onClose={() => setIsBroadcastMessageOpen(false)}
            customers={customers}
            zones={zones}
            settings={settings}
            currentMonthKey={currentMonthKey}
          />
        )}

        {/* ZONE & BOX MANAGER MODAL */}
        {isZoneManagerOpen && (
          <ZoneManagerModal
            isOpen={isZoneManagerOpen}
            onClose={() => setIsZoneManagerOpen(false)}
            zones={zones}
            customers={customers}
            settings={settings}
            onAddZone={(name, code, boxNumber) => {
              const newZ: Zone = {
                id: `zone-${Date.now()}`,
                name,
                code,
                boxNumber
              };
              setZones(prev => [...prev, newZ]);
            }}
            onDeleteZone={(zoneId) => {
              setZones(prev => prev.filter(z => z.id !== zoneId));
            }}
          />
        )}

        {/* ZONE-WISE BILLING BREAKDOWN MODAL */}
        {isZoneBillingModalOpen && (
          <ZoneBillingBreakdownModal
            isOpen={isZoneBillingModalOpen}
            onClose={() => setIsZoneBillingModalOpen(false)}
            zones={zones}
            customers={customers}
            currentMonthKey={currentMonthKey}
            lang={lang}
            onSelectZoneCustomers={(zoneId) => {
              setSelectedZoneFilter(zoneId);
              setFilterMode('due');
              setCurrentView('customers');
            }}
          />
        )}

        {/* SETTINGS MODAL */}
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            initialTab={settingsInitialTab}
            onSaveSettings={(newSettings) => setSettings(newSettings)}
          />
        )}

        {/* GOOGLE DRIVE & JSON BACKUP MODAL */}
        {isGoogleDriveOpen && (
          <GoogleDriveModal
            isOpen={isGoogleDriveOpen}
            onClose={() => setIsGoogleDriveOpen(false)}
            settings={settings}
            customers={customers}
            zones={zones}
            onRestoreData={(restoredCustomers, restoredZones, restoredSettings) => {
              if (restoredCustomers) setCustomers(restoredCustomers);
              if (restoredZones) setZones(restoredZones);
              if (restoredSettings) setSettings(restoredSettings);
            }}
            onUpdateBackupTime={(timeStr) => {
              setSettings(prev => ({ ...prev, lastBackupTime: timeStr }));
            }}
          />
        )}

        {/* DEDICATED BILL SHEET MODAL */}
        {isBillSheetOpen && (
          <BillSheetModal
            isOpen={isBillSheetOpen}
            onClose={() => setIsBillSheetOpen(false)}
            customers={customers}
            monthKey={currentMonthKey}
            settings={settings}
            onSelectMonth={(m) => setCurrentMonthKey(m)}
          />
        )}

        {/* SMS RECHARGE & BALANCE MODAL */}
        {isSMSRechargeOpen && (
          <SMSRechargeModal
            isOpen={isSMSRechargeOpen}
            onClose={() => setIsSMSRechargeOpen(false)}
            settings={settings}
            onUpdateSettings={(newSettings) => setSettings(newSettings)}
          />
        )}

        {/* INSTALL MOBILE APP (IJ LOGO) MODAL */}
        {isInstallModalOpen && (
          <InstallModal
            isOpen={isInstallModalOpen}
            onClose={() => setIsInstallModalOpen(false)}
            settings={settings}
            deferredPrompt={deferredPrompt}
            onNativeInstall={handleNativeInstall}
          />
        )}

        {/* GOOGLE AI STUDIO CONNECT MODAL */}
        {isAIChatOpen && (
          <AIChatModal
            isOpen={isAIChatOpen}
            onClose={() => setIsAIChatOpen(false)}
            settings={settings}
          />
        )}

        {/* PERMANENT APP URL & MOBILE BOOKMARK MODAL */}
        {isPermanentLinkOpen && (
          <PermanentLinkModal
            isOpen={isPermanentLinkOpen}
            onClose={() => setIsPermanentLinkOpen(false)}
            settings={settings}
          />
        )}

      </Suspense>

    </div>
  );
}
