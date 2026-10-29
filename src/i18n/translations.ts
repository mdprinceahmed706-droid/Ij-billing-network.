import { Language } from '../types/isp';

export const translations = {
  bn: {
    // Brand
    brandName: 'আইজে নেটওয়ার্ক',
    brandTagline: 'হাই স্পিড ব্রডব্যান্ড ইন্টারনেট',
    appTitle: 'আইজে নেটওয়ার্ক - ইন্টারনেট বিলিং সিস্টেম',
    
    // Front page - Billing Summary (বিলের হিসাব)
    billingSummaryTitle: 'চলতি মাসের বিলের হিসাব',
    totalMonthlyBill: 'মোট চলতি বিল',
    collectedBill: 'আদায়কৃত বিল',
    remainingDue: 'বকেয়া বিল',
    previousArrears: 'বিগত মাসের বকেয়া',
    totalOutstanding: 'সর্বমোট বকেয়া',
    dueCustomersCount: 'বকেয়া গ্রাহক',
    paidCustomersCount: 'পরিশোধিত',
    allCustomers: 'মোট গ্রাহক',

    // Front page Filters
    filterDueOnly: 'বকেয়া বিল',
    filterPaidOnly: 'পরিশোধিত',
    filterAll: 'সকল বিল',
    searchPlaceholder: 'গ্রাহকের নাম, পিপিও আইডি, মোবাইল বা এলাকা দিয়ে খুঁজুন...',
    allZones: 'সকল জোন',
    zonePrefix: 'জোন:',
    
    // Customer Card
    pppoeIdLabel: 'পিপিও আইডি (PPPoE ID):',
    phoneLabel: 'মোবাইল:',
    addressLabel: 'ঠিকানা:',
    zoneLabel: 'জোন / বক্স:',
    packageLabel: 'প্যাকেজ:',
    connectionDateLabel: 'সংযোগের তারিখ:',
    monthlyRateLabel: 'মাসিক বিল:',
    currentMonthBillStatus: 'চলতি মাসের বিল:',
    statusPaid: 'পরিশোধিত ✓',
    statusDue: 'বকেয়া',
    statusPending: 'অপেক্ষমাণ',
    payBillBtn: 'বিল নিন',
    receiptBtn: 'রসিদ',
    ledgerBtn: '১২ মাসের হিসাব',
    whatsappBtn: 'WhatsApp',
    callBtn: 'কল করুন',
    deleteCustomerBtn: 'মুছুন',
    confirmDelete: 'আপনি কি নিশ্চিত যে এই গ্রাহকটিকে মুছে ফেলতে চান? গ্রাহকের নাম:',
    pastDueWarning: 'বিগত মাসের বকেয়া:',
    pastDueTotal: 'বিগত বকেয়া:',
    beforeConnectionNote: 'সংযোগ শুরুর পূর্ববর্তী মাস',
    noDueGreeting: 'অভিনন্দন! চলতি মাসের সকল বিল আদায় সম্পন্ন হয়েছে।',
    noCustomersFound: 'কোনো গ্রাহক খুঁজে পাওয়া যায়নি।',
    nextMonthAutoNote: 'পেইড হওয়া গ্রাহক পরবর্তী মাসে আবার স্বয়ংক্রিয়ভাবে বকেয়া তালিকায় যুক্ত হবে।',

    // Drawer Menu (বাকি যত কার্যক্রম সব মেনুর ভিতর)
    menuTitle: 'আইজে নেটওয়ার্ক মেনু',
    menuSubtitle: 'গ্রাহক ও বিলিং কন্ট্রোল প্যানেল',
    menuSectionCustomer: 'গ্রাহক ব্যবস্থাপনা',
    addNewCustomer: 'নতুন গ্রাহক যোগ করুন',
    allCustomerList: 'সকল গ্রাহক ডাটাবেজ',
    menuSectionBilling: 'বিলিং ও তাগাদা কার্যক্রম',
    dueBillingList: 'বকেয়া বিলের তালিকা',
    paidBillingList: 'পরিশোধিত বিলের তালিকা',
    bulkReminder: 'একত্রে সকল বকেয়া তাগাদা (SMS / WhatsApp)',
    menuSectionZones: 'এলাকাভিত্তিক জোন ও বক্স',
    zoneBillingBreakdown: 'এলাকাভিত্তিক জোন বিলের হিসাব',
    zoneManager: 'জোন পরিচালনা ও তৈরি',
    menuSectionBackup: 'গুগল ড্রাইভ ও ব্যাকআপ',
    googleDriveSync: 'গুগল ড্রাইভ ক্লাউড ব্যাকআপ',
    offlineJsonExport: 'অফলাইন JSON ফাইল ডাউনলোড',
    offlineJsonImport: 'JSON ফাইল থেকে রিস্টোর',
    menuSectionSettings: 'সিস্টেম ও ব্যবসা সেটিংস',
    ispSettings: 'আইএসপি প্রোফাইল ও পেমেন্ট নম্বর',
    languageToggle: 'ভাষা নির্বাচন (Language)',
    installAppGuide: 'মোবাইলে IJ লোগো সহ অ্যাপ ইনস্টল',
    aiStudioChat: 'গুগল এআই স্টুডিওতে নতুন ফিচার চান',
    menuSectionReset: 'ডেটা রিসেট',
    clearAllData: 'সকল গ্রাহক মুছে ফ্রেশ শুরু করুন',
    loadDemoData: 'নমুনা (Demo) গ্রাহক লোড করুন',
    confirmClearAll: 'সতর্কতা! সকল গ্রাহক ও বিলের তথ্য মুছে যাবে। আপনি কি নিশ্চিত?',
    confirmLoadDemo: 'ডেমো ডেটা লোড করলে বর্তমান ডেটা প্রতিস্থাপিত হতে পারে। এগিয়ে যাবেন?',

    // Quick Pay Modal
    quickPayTitle: 'বিল আদায় ও পেমেন্ট রিসিভ',
    payAmountLabel: 'আদায়কৃত টাকার পরিমাণ (৳)',
    discountLabel: 'ছাড় / ডিসকাউন্ট (৳)',
    payMethodLabel: 'পেমেন্ট মাধ্যম',
    cash: 'ক্যাশ (নগদ টাকা)',
    bkash: 'বিকাশ (bKash)',
    nagad: 'নগদ (Nagad)',
    bank: 'ব্যাংক ট্রান্সফার',
    other: 'অন্যান্য',
    trxIdLabel: 'ট্রানজেকশন আইডি (ঐচ্ছিক)',
    trxIdPlaceholder: 'যেমন: 9JH76T12',
    noteLabel: 'বিশেষ নোট (ঐচ্ছিক)',
    confirmPayBtn: 'বিল গ্রহণ করুন ও রসিদ তৈরি করুন',
    cancelBtn: 'বাতিল',
    paymentSuccess: 'বিল সফলভাবে গ্রহণ করা হয়েছে!',

    // Receipt Modal
    receiptTitle: 'ডিজিটাল মানি রিসিট',
    receiptVoucherNo: 'রিসিট নং:',
    receivedFrom: 'গ্রাহকের নাম:',
    receivedAmount: 'আদায়কৃত টাকা:',
    amountInWords: 'কথায়:',
    billingMonth: 'বিলিং মাস:',
    paymentDate: 'পরিশোধের তারিখ:',
    authorizedSign: 'কর্তৃপক্ষের স্বাক্ষর',
    customerCopy: 'গ্রাহক কপি (ডিজিটাল ভাউচার)',
    printReceiptBtn: 'প্রিন্ট / PDF সেভ',
    shareWhatsappReceiptBtn: 'WhatsApp এ রসিদ পাঠান',
    closeBtn: 'বন্ধ করুন',

    // 12 Months Ledger Modal
    ledgerTitle: '১২ মাসের সম্পূর্ণ বিলিং হিস্টোরি',
    monthCol: 'মাস',
    amountCol: 'নির্ধারিত বিল',
    paidCol: 'পরিশোধ',
    dueCol: 'বকেয়া',
    dateCol: 'তারিখ ও মাধ্যম',
    statusCol: 'স্ট্যাটাস',
    actionCol: 'কার্যক্রম',

    // Add / Edit Customer Modal
    addCustomerTitle: 'নতুন গ্রাহক যুক্ত করুন',
    editCustomerTitle: 'গ্রাহকের তথ্য পরিবর্তন করুন',
    customerNameLabel: 'গ্রাহকের পুরো নাম *',
    customerPhoneLabel: 'মোবাইল নম্বর *',
    pppoeUsernameLabel: 'পিপিও ইউজারনেম (খালি রাখলে অটো তৈরি হবে)',
    pppoePasswordLabel: 'পিপিও পাসওয়ার্ড (PPPoE Password)',
    pppoePasswordPlaceholder: 'পাসওয়ার্ড লিখুন (যেমন: 123456)',
    selectZoneLabel: 'এলাকা ভিত্তিক জোন / বক্স নং *',
    addNewZoneOption: '+ নতুন জোন তৈরি করুন...',
    newZonePrompt: 'নতুন এলাকার নাম লিখুন:',
    packageSpeedLabel: 'ইন্টারনেট স্পিড / প্যাকেজ',
    monthlyBillAmountLabel: 'মাসিক বিলের পরিমাণ (৳) *',
    connectionDateInputLabel: 'সংযোগ শুরুর তারিখ *',
    ipAddressLabel: 'আইপি অ্যাড্রেস (ঐচ্ছিক)',
    saveCustomerBtn: 'গ্রাহক সংরক্ষণ করুন',

    // Bulk Reminder Modal
    bulkReminderTitle: 'বকেয়া বিলের সকল গ্রাহককে এক ক্লিকে তাগাদা',
    totalDueCustomers: 'মোট বকেয়া গ্রাহক:',
    totalDueSum: 'মোট বকেয়া টাকার পরিমাণ:',
    smsDraftTitle: 'মোবাইলের ডিফল্ট মেসেজে সকল নম্বরে SMS পাঠান',
    copyNumbersBtn: 'সকল মোবাইল নম্বর কপি করুন',
    openSmsAppBtn: 'মোবাইলে মেসেজ অ্যাপ চালু করুন',
    whatsappReminderNote: 'প্রতিটি গ্রাহকের পাশে থাকা বাটনে চাপ দিলে নির্ধারিত বকেয়া সহ সরাসরি তার WhatsApp ওপেন হবে:',

    // Zone Manager Modal
    zoneManagerTitle: 'এলাকা ভিত্তিক জোন ও ডিস্ট্রিবিউশন বক্স',
    addNewZoneTitle: 'নতুন জোন যুক্ত করুন',
    zoneNameLabel: 'জোনের নাম (যেমন: উত্তর পাড়া, বাজার রোড)',
    zoneCodeLabel: 'জোন কোড / বক্স নং (যেমন: BOX-04)',
    saveZoneBtn: 'জোন যুক্ত করুন',
    existingZonesTitle: 'বর্তমান জোন তালিকা',
    customerCountLabel: 'জন গ্রাহক',

    // Google Drive & Backup Modal
    googleDriveTitle: 'গুগল ড্রাইভ ক্লাউড ব্যাকআপ ও রিস্টোর',
    googleDriveDesc: 'আপনার জিমেইল অ্যাকাউন্টে নিরাপদ ব্যাকআপ রাখুন। মোবাইল হারালেও যেকোনো ডিভাইস থেকে তাৎক্ষণিক ডেটা ফিরে পাবেন।',
    driveEmailLabel: 'সংযুক্ত জিমেইল অ্যাকাউন্ট:',
    backupNowBtn: 'গুগল ড্রাইভে এখনই ব্যাকআপ নিন',
    restoreFromDriveBtn: 'গুগল ড্রাইভ থেকে রিস্টোর করুন',
    downloadJsonBtn: 'অফলাইন JSON ফাইল ডাউনলোড (ডাউনলোড ফোল্ডারে সেভ)',
    uploadJsonBtn: 'কম্পিউটার/মোবাইল থেকে JSON ফাইল আপলোড',
    lastBackupLabel: 'সর্বশেষ ব্যাকআপ:',
    backupSuccessMsg: 'গুগল ড্রাইভে ব্যাকআপ সফলভাবে সংরক্ষিত হয়েছে!',
    restoreSuccessMsg: 'ডেটা সফলভাবে রিস্টোর হয়েছে!',

    // Settings Modal
    settingsTitle: 'আইএসপি ব্যবসা ও সিস্টেম সেটিংস',
    companyDetailsTab: 'কোম্পানি তথ্য',
    paymentMethodsTab: 'পেমেন্ট নম্বর',
    languageTab: 'ভাষা (Language)',
    companyNameLabel: 'কোম্পানির নাম (বাংলা):',
    companyNameEnLabel: 'Company Name (English):',
    companyTaglineLabel: 'ট্যাগলাইন / স্লোগান:',
    proprietorLabel: 'প্রোপাইটর / পরিচালকের নাম:',
    officePhoneLabel: 'অফিস / হেল্পলাইন নম্বর:',
    officeAddressLabel: 'অফিসের ঠিকানা:',
    bkashPersonalLabel: 'বিকাশ পার্সোনাল নম্বর (গ্রাহকদের বিল পাঠানোর জন্য):',
    nagadPersonalLabel: 'নগদ পার্সোনাল নম্বর:',
    billDeadlineDayLabel: 'প্রতি মাসে বিল পরিশোধের শেষ দিন (যেমন: ১০ তারিখ):',
    saveSettingsBtn: 'সেটিংস সংরক্ষণ করুন',
    settingsSavedSuccess: 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!',

    // Install Modal
    installModalTitle: 'মোবাইলের হোমস্ক্রিনে IJ লোগো সহ অ্যাপ রাখুন',
    installStep1: '১. মোবাইলের Google Chrome ব্রাউজারে অ্যাপটি ওপেন করুন।',
    installStep2: '২. ব্রাউজারের উপরে ডানদিকের তিনটি ডট মেনু (⋮)-তে চাপ দিন।',
    installStep3: '৩. "Install app" অথবা "Add to Home screen" চাপুন।',
    installStep4: '৪. ডায়ালগে সুন্দর নীল 3D IJ লোগোটি ভেসে উঠবে। Install বাটনে চাপ দিলেই মোবাইলের স্ক্রিনে সরাসরি ফেসবুক/বিকাশের মতো অ্যাপ আইকন বসে যাবে!',

    // AI Studio Chat Modal
    aiStudioModalTitle: 'গুগল এআই স্টুডিও কানেক্ট',
    aiStudioDesc: 'আপনার আইজে নেটওয়ার্ক অ্যাপে যেকোনো নতুন ফিচার, বাটন বা রিপোর্ট প্রয়োজন হলে গুগল এআই স্টুডিওতে সরাসরি বার্তা পাঠান।',
    openAiStudioBtn: 'গুগল এআই স্টুডিও ওপেন করুন ↗',

    // Months
    months: {
      '01': 'জানুয়ারি',
      '02': 'ফেব্রুয়ারি',
      '03': 'মার্চ',
      '04': 'এপ্রিল',
      '05': 'মে',
      '06': 'জুন',
      '07': 'জুলাই',
      '08': 'আগস্ট',
      '09': 'সেপ্টেম্বর',
      '10': 'অক্টোবর',
      '11': 'নভেম্বর',
      '12': 'ডিসেম্বর'
    }
  },

  en: {
    // Brand
    brandName: 'IJ Network',
    brandTagline: 'High Speed Broadband Internet',
    appTitle: 'IJ Network - ISP Billing System',
    
    // Front page - Billing Summary
    billingSummaryTitle: "Current Month's Billing Overview",
    totalMonthlyBill: 'Total Monthly Bill',
    collectedBill: 'Collected Bill',
    remainingDue: 'Pending Due Bill',
    previousArrears: 'Previous Months Arrears',
    totalOutstanding: 'Total Outstanding Due',
    dueCustomersCount: 'Due Customers',
    paidCustomersCount: 'Paid',
    allCustomers: 'Total Customers',

    // Front page Filters
    filterDueOnly: 'Due Bills',
    filterPaidOnly: 'Paid Bills',
    filterAll: 'All Bills',
    searchPlaceholder: 'Search by customer name, PPPoE ID, mobile, or area...',
    allZones: 'All Zones',
    zonePrefix: 'Zone:',
    
    // Customer Card
    pppoeIdLabel: 'PPPoE ID:',
    phoneLabel: 'Mobile:',
    addressLabel: 'Address:',
    zoneLabel: 'Zone / Box:',
    packageLabel: 'Package:',
    connectionDateLabel: 'Connection Date:',
    monthlyRateLabel: 'Monthly Bill:',
    currentMonthBillStatus: 'Current Month Status:',
    statusPaid: 'PAID ✓',
    statusDue: 'DUE',
    statusPending: 'PENDING',
    payBillBtn: 'Receive Bill',
    receiptBtn: 'Receipt',
    ledgerBtn: '12-Month History',
    whatsappBtn: 'WhatsApp',
    callBtn: 'Call',
    deleteCustomerBtn: 'Delete',
    confirmDelete: 'Are you sure you want to delete this customer? Customer name:',
    pastDueWarning: 'Previous Months Arrears:',
    pastDueTotal: 'Previous Dues:',
    beforeConnectionNote: 'Month prior to connection',
    noDueGreeting: 'Congratulations! All bills for this month have been collected.',
    noCustomersFound: 'No customers found matching the criteria.',
    nextMonthAutoNote: 'Paid customers will automatically appear in the due list next month.',

    // Drawer Menu
    menuTitle: 'IJ Network Menu',
    menuSubtitle: 'Customer & Billing Control Center',
    menuSectionCustomer: 'Customer Management',
    addNewCustomer: 'Add New Customer',
    allCustomerList: 'All Customers Directory',
    menuSectionBilling: 'Billing & Reminders',
    dueBillingList: 'Due Bills List',
    paidBillingList: 'Paid Bills List',
    bulkReminder: 'Bulk Due Reminders (SMS / WhatsApp)',
    menuSectionZones: 'Area Zones & Distribution',
    zoneBillingBreakdown: 'Zone-wise Billing Breakdown',
    zoneManager: 'Zone & Box Management',
    menuSectionBackup: 'Google Drive & Backup',
    googleDriveSync: 'Google Drive Cloud Backup',
    offlineJsonExport: 'Download Offline JSON File',
    offlineJsonImport: 'Restore from JSON File',
    menuSectionSettings: 'System & Business Settings',
    ispSettings: 'ISP Profile & Payment Numbers',
    languageToggle: 'Language Selection (ভাষা)',
    installAppGuide: 'Install Mobile App with IJ Logo',
    aiStudioChat: 'Request New Features via AI Studio',
    menuSectionReset: 'Data Reset',
    clearAllData: 'Clear All Customers (Start Fresh)',
    loadDemoData: 'Load Demo Customer Records',
    confirmClearAll: 'Warning! All customer and billing records will be erased. Proceed?',
    confirmLoadDemo: 'Loading demo data may replace existing records. Proceed?',

    // Quick Pay Modal
    quickPayTitle: 'Receive Bill & Payment',
    payAmountLabel: 'Collected Amount (৳)',
    discountLabel: 'Discount / Waiver (৳)',
    payMethodLabel: 'Payment Method',
    cash: 'Cash',
    bkash: 'bKash',
    nagad: 'Nagad',
    bank: 'Bank Transfer',
    other: 'Other',
    trxIdLabel: 'Transaction ID (Optional)',
    trxIdPlaceholder: 'e.g., 9JH76T12',
    noteLabel: 'Remarks / Note (Optional)',
    confirmPayBtn: 'Collect Payment & Generate Receipt',
    cancelBtn: 'Cancel',
    paymentSuccess: 'Payment recorded successfully!',

    // Receipt Modal
    receiptTitle: 'Digital Money Receipt',
    receiptVoucherNo: 'Receipt No:',
    receivedFrom: 'Customer Name:',
    receivedAmount: 'Amount Received:',
    amountInWords: 'In Words:',
    billingMonth: 'Billing Month:',
    paymentDate: 'Payment Date:',
    authorizedSign: 'Authorized Signature',
    customerCopy: 'Customer Copy (Digital Voucher)',
    printReceiptBtn: 'Print / Save PDF',
    shareWhatsappReceiptBtn: 'Send Receipt via WhatsApp',
    closeBtn: 'Close',

    // 12 Months Ledger Modal
    ledgerTitle: '12-Month Complete Billing History',
    monthCol: 'Month',
    amountCol: 'Package Bill',
    paidCol: 'Paid',
    dueCol: 'Due',
    dateCol: 'Date & Method',
    statusCol: 'Status',
    actionCol: 'Action',

    // Add / Edit Customer Modal
    addCustomerTitle: 'Add New Customer',
    editCustomerTitle: 'Edit Customer Information',
    customerNameLabel: 'Customer Full Name *',
    customerPhoneLabel: 'Mobile Phone Number *',
    pppoeUsernameLabel: 'PPPoE Username (auto-generated if empty)',
    pppoePasswordLabel: 'PPPoE Password',
    pppoePasswordPlaceholder: 'Enter router password (e.g. 123456)',
    selectZoneLabel: 'Area Zone / Box No. *',
    addNewZoneOption: '+ Create New Zone...',
    newZonePrompt: 'Enter new area/zone name:',
    packageSpeedLabel: 'Internet Speed / Package',
    monthlyBillAmountLabel: 'Monthly Bill Rate (৳) *',
    connectionDateInputLabel: 'Connection Start Date *',
    ipAddressLabel: 'IP Address (Optional)',
    saveCustomerBtn: 'Save Customer',

    // Bulk Reminder Modal
    bulkReminderTitle: '1-Click Bulk Due Reminder to All Unpaid Customers',
    totalDueCustomers: 'Total Due Customers:',
    totalDueSum: 'Total Outstanding Amount:',
    smsDraftTitle: 'Send SMS to all numbers via phone messaging app',
    copyNumbersBtn: 'Copy All Mobile Numbers',
    openSmsAppBtn: 'Open Mobile SMS App',
    whatsappReminderNote: 'Click WhatsApp next to any customer to open a direct personalized billing message:',

    // Zone Manager Modal
    zoneManagerTitle: 'Area Zones & Fiber Distribution Boxes',
    addNewZoneTitle: 'Add New Zone',
    zoneNameLabel: 'Zone Name (e.g. North Para, Market Road)',
    zoneCodeLabel: 'Zone Code / Box No. (e.g. BOX-04)',
    saveZoneBtn: 'Add Zone',
    existingZonesTitle: 'Existing Zones',
    customerCountLabel: 'customers',

    // Google Drive & Backup Modal
    googleDriveTitle: 'Google Drive Cloud Backup & Restore',
    googleDriveDesc: 'Keep your ISP database secured in your Google Drive. Even if your phone is changed or lost, restore in one click.',
    driveEmailLabel: 'Connected Gmail Account:',
    backupNowBtn: 'Backup to Google Drive Now',
    restoreFromDriveBtn: 'Restore from Google Drive',
    downloadJsonBtn: 'Download Offline JSON File',
    uploadJsonBtn: 'Upload JSON File from Device',
    lastBackupLabel: 'Last Backup:',
    backupSuccessMsg: 'Backup saved to Google Drive successfully!',
    restoreSuccessMsg: 'Data restored successfully!',

    // Settings Modal
    settingsTitle: 'ISP Business & System Settings',
    companyDetailsTab: 'Company Info',
    paymentMethodsTab: 'Payment Numbers',
    languageTab: 'Language',
    companyNameLabel: 'Company Name (Bengali):',
    companyNameEnLabel: 'Company Name (English):',
    companyTaglineLabel: 'Tagline / Slogan:',
    proprietorLabel: 'Proprietor / Director Name:',
    officePhoneLabel: 'Office / Helpline Number:',
    officeAddressLabel: 'Office Address:',
    bkashPersonalLabel: 'bKash Personal No. (for customer payments):',
    nagadPersonalLabel: 'Nagad Personal No.:',
    billDeadlineDayLabel: 'Monthly Bill Deadline Day (e.g. 10th):',
    saveSettingsBtn: 'Save Settings',
    settingsSavedSuccess: 'Settings saved successfully!',

    // Install Modal
    installModalTitle: 'Install App on Mobile Home Screen with IJ Logo',
    installStep1: '1. Open the app link in Google Chrome on your phone.',
    installStep2: '2. Tap the three-dot menu (⋮) at top-right.',
    installStep3: '3. Select "Install app" or "Add to Home screen".',
    installStep4: '4. The beautiful blue 3D IJ logo will appear. Tap Install to place the app on your home screen like bKash/Facebook!',

    // AI Studio Chat Modal
    aiStudioModalTitle: 'Google AI Studio Connection',
    aiStudioDesc: 'Whenever you need new features, buttons, or custom reports for IJ Network, connect directly to Google AI Studio.',
    openAiStudioBtn: 'Open Google AI Studio ↗',

    // Months
    months: {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December'
    }
  }
};

export function formatNumber(num: number, lang: Language): string {
  if (lang === 'bn') {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toLocaleString('en-US').replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
  }
  return num.toLocaleString('en-US');
}

export function formatCurrency(amount: number, lang: Language): string {
  return `৳${formatNumber(amount, lang)}`;
}

export function getMonthName(monthKey: string, lang: Language): string {
  const parts = monthKey.split('-');
  const monthNum = parts[1] || '10';
  const year = parts[0] || '2026';
  const mName = translations[lang].months[monthNum as keyof typeof translations['bn']['months']] || monthNum;
  if (lang === 'bn') {
    const yearBn = formatNumber(parseInt(year, 10), 'bn');
    return `${mName} ${yearBn}`;
  }
  return `${mName} ${year}`;
}
