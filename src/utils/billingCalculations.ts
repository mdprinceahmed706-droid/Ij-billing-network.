import { Customer, BillingSummary, DueCustomerPastMonths, Language } from '../types/isp';
import { getMonthName } from '../i18n/translations';

// Helper to get array of "YYYY-MM" between startMonth and endMonth inclusive
export function getMonthRange(startMonthKey: string, endMonthKey: string): string[] {
  const result: string[] = [];
  const [startYear, startMonth] = startMonthKey.split('-').map(Number);
  const [endYear, endMonth] = endMonthKey.split('-').map(Number);

  let curYear = startYear;
  let curMonth = startMonth;

  while (curYear < endYear || (curYear === endYear && curMonth <= endMonth)) {
    const mStr = curMonth.toString().padStart(2, '0');
    result.push(`${curYear}-${mStr}`);
    curMonth++;
    if (curMonth > 12) {
      curMonth = 1;
      curYear++;
    }
  }

  return result;
}

// Get the previous month key for a given monthKey (e.g. "2026-10" -> "2026-09")
export function getPreviousMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  if (month === 1) {
    return `${year - 1}-12`;
  }
  return `${year}-${(month - 1).toString().padStart(2, '0')}`;
}

// Calculate the first active billing month for a customer
// Rule: Line activates on connection date, and the bill activates in the next month on the same date/time
export function getFirstBillingMonthKey(connectionDate: string): string {
  if (!connectionDate) return '2026-01';
  const parts = connectionDate.split('-');
  let year = parseInt(parts[0], 10) || 2026;
  let month = parseInt(parts[1], 10) || 1;

  // Next month same date cycle
  month += 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  return `${year}-${month.toString().padStart(2, '0')}`;
}

// Calculate past dues for a customer up to previous month
export function getCustomerPastDues(
  customer: Customer,
  currentMonthKey: string,
  lang: Language
): { pastDueList: DueCustomerPastMonths[]; totalPastDue: number } {
  const firstBillingMonth = getFirstBillingMonthKey(customer.connectionDate);
  
  // If first billing month is on or after current month, no past dues possible
  if (firstBillingMonth >= currentMonthKey) {
    return { pastDueList: [], totalPastDue: 0 };
  }

  const prevMonthKey = getPreviousMonthKey(currentMonthKey);
  const range = getMonthRange(firstBillingMonth, prevMonthKey);

  const pastDueList: DueCustomerPastMonths[] = [];
  let totalPastDue = 0;

  for (const mKey of range) {
    const bill = customer.bills?.[mKey];
    if (!bill || !bill.isPaid || bill.dueAmount > 0) {
      const due = bill 
        ? (bill.dueAmount !== undefined ? bill.dueAmount : Math.max(0, customer.monthlyBill - (bill.paidAmount || 0) - (bill.discount || 0)))
        : customer.monthlyBill;
      
      if (due > 0) {
        pastDueList.push({
          monthKey: mKey,
          monthName: getMonthName(mKey, lang),
          amount: due
        });
        totalPastDue += due;
      }
    }
  }

  return { pastDueList, totalPastDue };
}

// Calculate current month bill info for customer with partial payment & cycle detection
export function getCustomerCurrentMonthStatus(customer: Customer, currentMonthKey: string) {
  const bill = customer.bills?.[currentMonthKey];
  const firstBillingMonth = getFirstBillingMonthKey(customer.connectionDate);

  // If customer line activated recently, bill activates on next month same date
  const isBeforeBillingCycle = currentMonthKey < firstBillingMonth;

  if (isBeforeBillingCycle) {
    return {
      isPaid: true,
      paidAmount: 0,
      currentMonthDue: 0,
      discount: 0,
      billRecord: bill,
      isPendingCycle: true,
      firstBillingMonth
    };
  }

  const paidAmount = bill?.paidAmount || 0;
  const discount = bill?.discount || 0;

  let currentMonthDue = 0;
  if (bill) {
    currentMonthDue = bill.dueAmount !== undefined 
      ? bill.dueAmount 
      : (bill.isPaid ? 0 : Math.max(0, customer.monthlyBill - paidAmount - discount));
  } else {
    currentMonthDue = customer.monthlyBill;
  }

  // Only consider paid if remaining due is 0
  const isPaid = (bill?.isPaid && currentMonthDue === 0) || currentMonthDue === 0;

  return {
    isPaid,
    paidAmount,
    currentMonthDue,
    discount,
    billRecord: bill,
    isPendingCycle: false,
    firstBillingMonth
  };
}

// Calculate comprehensive billing summary for active month
export function calculateBillingSummary(customers: Customer[], currentMonthKey: string, lang: Language): BillingSummary {
  let totalMonthlyBill = 0;
  let collectedAmount = 0;
  let currentMonthDueAmount = 0;
  let previousArrearsAmount = 0;
  let paidCustomersCount = 0;
  let dueCustomersCount = 0;

  for (const cust of customers) {
    if (cust.status !== 'active') continue;

    const firstBillingMonth = getFirstBillingMonthKey(cust.connectionDate);
    if (firstBillingMonth > currentMonthKey) {
      // Future billing cycle customer
      continue;
    }

    totalMonthlyBill += cust.monthlyBill;

    const { isPaid, paidAmount, currentMonthDue } = getCustomerCurrentMonthStatus(cust, currentMonthKey);
    const { totalPastDue } = getCustomerPastDues(cust, currentMonthKey, lang);

    collectedAmount += paidAmount;
    currentMonthDueAmount += currentMonthDue;
    previousArrearsAmount += totalPastDue;

    // Customer is counted as paid ONLY if both current month and past arrears are 0
    if (currentMonthDue === 0 && totalPastDue === 0) {
      paidCustomersCount++;
    } else {
      dueCustomersCount++;
    }
  }

  return {
    totalMonthlyBill,
    collectedAmount,
    currentMonthDueAmount,
    previousArrearsAmount,
    totalOutstandingDue: currentMonthDueAmount + previousArrearsAmount,
    totalCustomers: customers.filter(c => c.status === 'active').length,
    paidCustomersCount,
    dueCustomersCount
  };
}
