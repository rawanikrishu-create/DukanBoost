import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { formatIndianCurrency, formatMaskedPhone } from '../../data/mockData';
import {
  X,
  Phone,
  Calendar,
  ShoppingBag,
  MessageSquare,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Receipt,
  Eye,
  EyeOff,
} from 'lucide-react';

export const CustomerProfileModal: React.FC = () => {
  const {
    selectedCustomerId,
    setSelectedCustomerId,
    customers,
    sales,
    openWhatsAppComposer,
    shopProfile,
  } = useDukaan();

  const [revealPhone, setRevealPhone] = useState(false);

  if (!selectedCustomerId) return null;

  const customer = customers.find((c) => c.id === selectedCustomerId);
  if (!customer) return null;

  // Filter sales for this customer
  const customerSales = sales.filter((s) => s.customerId === customer.id);

  // Average Order Value
  const aov =
    customer.totalOrders > 0
      ? Math.round(customer.totalSpending / customer.totalOrders)
      : 0;

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'regular':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Regular Customer
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Inactive (Needs Follow-up)
          </span>
        );
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            New Customer
          </span>
        );
      default:
        return null;
    }
  };

  // Generate grounded Customer Insight text
  const generateInsightText = () => {
    const favoriteItems = (customer.frequentlyPurchasedProducts || []).join(', ');
    const interval = customer.averagePurchaseIntervalDays || 8;

    if (customer.status === 'inactive') {
      return `${customer.name} usually visits every ${interval}–${interval + 4} days and regularly buys ${favoriteItems || 'daily staples'}. Their last visit was ${customer.lastPurchaseRelative}, which is longer than their normal buying cycle.`;
    }

    if (customer.status === 'new') {
      return `${customer.name} joined recently in ${customer.joiningDate}. They purchased ${favoriteItems || 'store products'}. Welcoming them helps build a habit of shopping at your dukaan.`;
    }

    return `${customer.name} visits frequently every ${interval}–${interval + 3} days and regularly buys ${favoriteItems || 'dairy and groceries'}. An ideal candidate for combo offers and loyalty perks.`;
  };

  // Suggested Action Text
  const generateSuggestedAction = () => {
    if (customer.status === 'inactive') {
      return {
        text: 'Customer may be due for their next purchase or restock.',
        buttonText: 'Send WhatsApp Reminder',
        message: `Namaste ${customer.name}! 🙏 Your regular grocery staples are ready at ${shopProfile.shopName}. Would you like us to keep your basket packed or send them over to your home? Reply with your list anytime!`,
      };
    }
    if (customer.status === 'new') {
      return {
        text: 'Follow up to convert this first-time buyer into a regular.',
        buttonText: 'Send Welcome Note',
        message: `Namaste ${customer.name}! 🙏 Thank you for choosing ${shopProfile.shopName}. Save our WhatsApp number for easy orders, stock inquiries, and free delivery in the neighborhood!`,
      };
    }
    return {
      text: 'Show appreciation for repeat loyalty with a weekend offer.',
      buttonText: 'Send Loyalty WhatsApp',
      message: `Namaste ${customer.name}! Thank you for shopping with us at ${shopProfile.shopName}. We appreciate your trust! Let us know if you need anything delivered today.`,
    };
  };

  const actionDetails = generateSuggestedAction();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
              {getStatusBadge(customer.status)}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">
                  {revealPhone ? customer.phone : formatMaskedPhone(customer.phone)}
                </span>
                <button
                  onClick={() => setRevealPhone(!revealPhone)}
                  className="p-0.5 text-slate-400 hover:text-slate-700"
                  title={revealPhone ? 'Mask phone number' : 'Show full number'}
                >
                  {revealPhone ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Customer since: {customer.joiningDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedCustomerId(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Purchase Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Purchase Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Total Orders</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {customer.totalOrders}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Total Spending</div>
                <div className="text-lg font-bold text-emerald-800 font-mono tabular-nums">
                  {formatIndianCurrency(customer.totalSpending)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Avg. Order Value</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  ₹{aov}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Visit Interval</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {customer.averagePurchaseIntervalDays || 7} days
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Bought Products */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Frequently Bought
            </h3>
            {customer.frequentlyPurchasedProducts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {customer.frequentlyPurchasedProducts.map((prod, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium border border-slate-200"
                  >
                    <span>{prod}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No repeat product pattern recorded yet.</p>
            )}
          </div>

          {/* Customer Insight Card */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Customer Insight
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{generateInsightText()}</p>

            <div className="mt-3 pt-3 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-bold text-slate-700 uppercase">Suggested Action</div>
                <div className="text-xs text-slate-600">{actionDetails.text}</div>
              </div>
              <button
                onClick={() => {
                  openWhatsAppComposer({
                    customerName: customer.name,
                    phone: customer.phone,
                    message: actionDetails.message,
                  });
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{actionDetails.buttonText}</span>
              </button>
            </div>
          </div>

          {/* Recent Purchases Timeline / Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Recent Purchases
            </h3>
            {customerSales.length > 0 ? (
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {customerSales.map((s) => (
                  <div key={s.id} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {s.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(s.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        · {s.billNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 font-mono">
                        {formatIndianCurrency(s.totalAmount)}
                      </div>
                      <span className="text-[10px] text-emerald-700 uppercase font-semibold">
                        {s.paymentMethod.replace('paid_', '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                Last recorded purchase was {customer.lastPurchaseRelative}.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-2">
          <button
            onClick={() => setSelectedCustomerId(null)}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg"
          >
            Close
          </button>
          <button
            onClick={() => {
              openWhatsAppComposer({
                customerName: customer.name,
                phone: customer.phone,
                message: actionDetails.message,
              });
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Send WhatsApp Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};
