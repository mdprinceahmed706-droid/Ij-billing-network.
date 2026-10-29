import React, { useEffect } from 'react';
import { CheckCircle2, X, RotateCcw, Edit, MessageSquare, Check } from 'lucide-react';

export interface ToastInfo {
  message: string;
  type?: 'payment_success' | 'success' | 'revert' | 'edit' | 'status' | 'info';
  customerName?: string;
  phone?: string;
  amount?: number;
  dueAmount?: number;
  paidDate?: string;
  whatsappUrl?: string;
  whatsappLabel?: string;
}

interface SuccessToastProps {
  toast: ToastInfo | null;
  onDismiss: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    // Keep toast open slightly longer if payment success or WhatsApp action
    const duration = toast.type === 'payment_success' ? 7000 : (toast.whatsappUrl ? 6000 : 4000);
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isPayment = toast.type === 'payment_success';
  const isRevert = toast.type === 'revert';
  const isEdit = toast.type === 'edit';
  const isStatus = toast.type === 'status';

  return (
    // Positioned strictly at bottom-center / middle-bottom of the phone screen as requested
    <div className="fixed bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[95%] sm:w-auto animate-in slide-in-from-bottom-6 duration-300 pointer-events-auto">
      <div className={`p-4 sm:p-5 rounded-2xl shadow-2xl border flex flex-col gap-3 backdrop-blur-xl ${
        isPayment
          ? 'bg-slate-900/98 border-emerald-500 text-white shadow-emerald-950/80 ring-2 ring-emerald-500/30'
          : isRevert
            ? 'bg-slate-900/98 border-rose-500/70 text-white shadow-rose-950/70'
            : isEdit
              ? 'bg-slate-900/98 border-cyan-500/70 text-white shadow-cyan-950/70'
              : 'bg-slate-900/98 border-blue-500/70 text-white shadow-slate-950/70'
      }`}>
        <div className="flex items-start gap-3 w-full">
          {/* Status Icon */}
          <div className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
            isPayment 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20' 
              : isRevert 
                ? 'bg-rose-500/20 text-rose-300' 
                : isEdit 
                  ? 'bg-cyan-500/20 text-cyan-300' 
                  : 'bg-blue-500/20 text-blue-300'
          }`}>
            {isPayment ? (
              <Check className="w-6 h-6 stroke-[3]" />
            ) : isRevert ? (
              <RotateCcw className="w-5 h-5 text-rose-400" />
            ) : isEdit ? (
              <Edit className="w-5 h-5 text-cyan-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between gap-2">
              <div className="font-black text-sm sm:text-base flex items-center gap-1.5 tracking-tight">
                {isPayment ? (
                  <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                    পেমেন্ট সম্পন্ন হয়েছে
                  </span>
                ) : isRevert ? (
                  <span className="text-rose-400">বিল বাতিল সম্পন্ন</span>
                ) : isEdit ? (
                  <span className="text-cyan-400">পেমেন্ট আপডেট সফল</span>
                ) : isStatus ? (
                  <span className="text-amber-400">গ্রাহক স্ট্যাটাস পরিবর্তন</span>
                ) : (
                  <span className="text-blue-400">সফলভাবে সম্পন্ন</span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onDismiss}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0 -mt-1 -mr-1"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Payment, show highlight badge with exact amount */}
            {isPayment && toast.amount !== undefined && (
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-sm">
                  ৳{toast.amount} পরিশোধিত
                </span>
                {toast.customerName && (
                  <span className="text-xs text-slate-300 font-medium truncate max-w-[180px]">
                    গ্রাহক: <strong className="text-white">{toast.customerName}</strong>
                  </span>
                )}
                {toast.dueAmount !== undefined && (
                  <span className="text-[11px] text-slate-400">
                    বকেয়া: ৳{toast.dueAmount}
                  </span>
                )}
              </div>
            )}

            <p className="text-xs text-slate-300 mt-1 leading-snug font-medium">
              {toast.message}
            </p>
          </div>
        </div>

        {/* Action Button: WhatsApp Receipt */}
        {toast.whatsappUrl && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 w-full justify-between">
            <span className="text-[11px] text-slate-400">রশিদ পাঠাতে চান?</span>
            <div className="flex items-center gap-2">
              <a
                href={toast.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onDismiss}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/50 active:scale-95 transition cursor-pointer shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{toast.whatsappLabel || 'WhatsApp এ পাঠান'}</span>
              </a>
              <button
                onClick={onDismiss}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
