import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { formatIndianCurrency } from '../../data/mockData';
import {
  X,
  CheckCircle2,
  Printer,
  MessageSquare,
  Copy,
  Check,
  Store,
  ExternalLink,
} from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const {
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    lastCompletedSale,
    shopProfile,
  } = useDukaan();

  const [copied, setCopied] = useState(false);

  if (!isReceiptModalOpen || !lastCompletedSale) return null;

  const sale = lastCompletedSale;

  // Format WhatsApp message for digital bill
  const generateWhatsAppBill = () => {
    const lines = [
      `*${(shopProfile.shopName || 'DUKAAN').toUpperCase()}*`,
      `${shopProfile.location || ''}`,
      `Phone: ${shopProfile.phone || ''}`,
      `---------------------------------`,
      `*Bill No:* ${sale.billNumber}`,
      `*Date:* ${new Date(sale.date).toLocaleDateString('en-IN')} ${new Date(sale.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      `*Customer:* ${sale.customerName || 'Customer'}`,
      `---------------------------------`,
      `*ITEMS:*`,
      ...(sale.items || []).map((it) => `• ${it.productName} x${it.quantity} = ₹${it.total}`),
      `---------------------------------`,
      `*GRAND TOTAL: ₹${sale.totalAmount}*`,
      `*Payment:* ${(sale.paymentMethod || 'paid_upi').replace('paid_', '').toUpperCase()}`,
      `---------------------------------`,
      `Thank you for shopping at ${shopProfile.shopName}! 🙏`,
      `Save this contact for quick home deliveries.`,
    ];

    return lines.join('\n');
  };

  const rawBillText = generateWhatsAppBill();
  const encodedText = encodeURIComponent(rawBillText);
  const cleanDigits = (sale.customerPhone || '').replace(/[^0-9]/g, '');
  const phoneParam = cleanDigits.length >= 10 ? `91${cleanDigits.slice(-10)}` : '';
  const waUrl = phoneParam
    ? `https://wa.me/${phoneParam}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  const handleCopyBill = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(rawBillText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print not supported in this frame', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Success Banner */}
        <div className="bg-emerald-600 p-4 text-white text-center shrink-0">
          <div className="inline-flex p-2 bg-emerald-500/50 rounded-full mb-1">
            <CheckCircle2 className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <h3 className="text-base font-bold">Sale Recorded Successfully!</h3>
          <p className="text-xs text-emerald-100">
            Inventory decremented & customer ledger updated.
          </p>
        </div>

        {/* Paper Bill Simulation */}
        <div className="p-4 sm:p-5 font-mono text-xs bg-slate-50 border-b border-dashed border-slate-300 space-y-3 flex-1 overflow-y-auto">
          <div className="text-center pb-2 border-b border-slate-200 font-sans">
            <div className="font-bold text-slate-900 text-sm">{shopProfile.shopName}</div>
            <div className="text-[11px] text-slate-500">{shopProfile.location}</div>
            <div className="text-[11px] text-slate-500">Ph: {shopProfile.phone}</div>
          </div>

          <div className="flex justify-between text-slate-600 text-[11px]">
            <span>Bill: {sale.billNumber}</span>
            <span>
              {new Date(sale.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="text-slate-700 font-semibold text-[11px]">
            Customer: {sale.customerName} ({sale.customerPhone || 'Walk-in'})
          </div>

          {/* Line items */}
          <div className="pt-2 border-t border-slate-200 space-y-1.5">
            {(sale.items || []).map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-800">
                <span className="truncate max-w-[200px]">
                  {it.productName} <span className="text-slate-500">x{it.quantity}</span>
                </span>
                <span className="font-bold tabular-nums">₹{it.total}</span>
              </div>
            ))}
          </div>

          {/* Total & Payment */}
          <div className="pt-2 border-t-2 border-slate-300 flex justify-between items-center text-sm font-bold text-slate-900 font-sans">
            <span>TOTAL AMOUNT:</span>
            <span className="text-emerald-800 font-mono text-base font-bold">
              {formatIndianCurrency(sale.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 font-sans">
            <span>Payment Mode:</span>
            <span className="uppercase font-semibold text-slate-800">
              {(sale.paymentMethod || 'paid_upi').replace('paid_', '')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white space-y-2.5 shrink-0">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl shadow-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Bill via WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyBill}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied!' : 'Copy Bill'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Slip</span>
            </button>
          </div>

          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="w-full py-2 px-3 text-xs font-bold text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors text-center"
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
};
