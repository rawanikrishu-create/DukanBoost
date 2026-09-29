import React, { useState, useMemo } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { PaymentMethod } from '../../types';
import { formatIndianCurrency } from '../../data/mockData';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Calendar,
  Smartphone,
  Banknote,
  CreditCard,
  BookOpen,
  ArrowUpRight,
  Eye,
} from 'lucide-react';

export const SalesView: React.FC = () => {
  const {
    sales,
    setIsRecordSaleModalOpen,
    setSelectedCustomerId,
    todaySalesTotal,
    weeklySalesTotal,
    todayOrdersCount,
  } = useDukaan();

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentMethod>('all');

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.items.some((it) => it.productName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPayment = paymentFilter === 'all' || s.paymentMethod === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [sales, searchQuery, paymentFilter]);

  const getPaymentBadge = (method: PaymentMethod) => {
    switch (method) {
      case 'paid_upi':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <Smartphone className="w-3 h-3 text-emerald-600" />
            UPI
          </span>
        );
      case 'paid_cash':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <Banknote className="w-3 h-3 text-blue-600" />
            Cash
          </span>
        );
      case 'paid_card':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            <CreditCard className="w-3 h-3 text-purple-600" />
            Card
          </span>
        );
      case 'udhaar_due':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <BookOpen className="w-3 h-3 text-amber-600" />
            Udhaar (Due)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Title & Prominent Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sales & Transactions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time sales ledger, digital receipts & payment breakdown
          </p>
        </div>

        <button
          onClick={() => setIsRecordSaleModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Record Sale</span>
        </button>
      </div>

      {/* Top Sales KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Today's Total Sales</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
            {formatIndianCurrency(todaySalesTotal)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{todayOrdersCount} bills generated</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">This Week's Revenue</div>
          <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums mt-0.5">
            {formatIndianCurrency(weeklySalesTotal)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">On track vs last week</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-xs text-slate-500 font-medium">Total Recorded Bills</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
            {sales.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">All customer transactions</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by customer name, bill number (INV-...) or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Payment filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto shrink-0 overflow-x-auto">
          <button
            onClick={() => setPaymentFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              paymentFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setPaymentFilter('paid_upi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              paymentFilter === 'paid_upi'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            UPI
          </button>
          <button
            onClick={() => setPaymentFilter('paid_cash')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              paymentFilter === 'paid_cash'
                ? 'bg-white text-blue-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentFilter('udhaar_due')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              paymentFilter === 'udhaar_due'
                ? 'bg-white text-amber-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Udhaar
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Bill No</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Products Purchased</th>
              <th className="py-3 px-4">Payment Status</th>
              <th className="py-3 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-medium text-slate-800">
                      {new Date(sale.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="text-slate-400 ml-1.5">
                      {new Date(sale.date).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                    {sale.billNumber}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => sale.customerId && setSelectedCustomerId(sale.customerId)}
                      className="font-bold text-slate-900 hover:text-emerald-700 transition-colors text-left"
                    >
                      {sale.customerName}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-sm">
                    <div className="truncate">
                      {sale.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-4">{getPaymentBadge(sale.paymentMethod)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    {formatIndianCurrency(sale.totalAmount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No sales found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {filteredSales.length > 0 ? (
          filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button
                    onClick={() => sale.customerId && setSelectedCustomerId(sale.customerId)}
                    className="font-bold text-sm text-slate-900 hover:text-emerald-700 text-left"
                  >
                    {sale.customerName}
                  </button>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {sale.billNumber} ·{' '}
                    {new Date(sale.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}{' '}
                    {new Date(sale.date).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base text-slate-900 font-mono">
                    {formatIndianCurrency(sale.totalAmount)}
                  </div>
                  <div className="mt-0.5">{getPaymentBadge(sale.paymentMethod)}</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Items: </span>
                {sale.items.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No sales records found.
          </div>
        )}
      </div>
    </div>
  );
};
