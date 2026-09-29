import React, { useState, useMemo } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { CustomerStatus } from '../../types';
import { formatIndianCurrency, formatMaskedPhone } from '../../data/mockData';
import {
  Search,
  UserPlus,
  MessageSquare,
  Users,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  ChevronRight,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const {
    customers,
    addCustomer,
    setSelectedCustomerId,
    setIsAddCustomerModalOpen,
    openWhatsAppComposer,
    openDirectWhatsAppModal,
    inactiveCustomersCount,
    regularCustomersCount,
    newCustomersCount,
    shopProfile,
  } = useDukaan();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all');

  // Quick inline add contact states
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickToast, setQuickToast] = useState<string | null>(null);
  const [quickError, setQuickError] = useState<string | null>(null);

  const handleQuickAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError(null);
    const cleanDigits = quickPhone.replace(/[^0-9]/g, '');
    if (!quickName.trim()) {
      setQuickError('Please enter customer name');
      return;
    }
    if (cleanDigits.length < 10) {
      setQuickError('Please enter a valid 10-digit mobile number');
      return;
    }

    addCustomer({
      name: quickName.trim(),
      phone: cleanDigits.slice(-10),
      status: 'regular',
      notes: 'Added via Quick WhatsApp Bar',
    });

    setQuickToast(`✓ Saved ${quickName.trim()} (+91 ${cleanDigits.slice(-10)}) to WhatsApp directory!`);
    setQuickName('');
    setQuickPhone('');
    setQuickError(null);
    setTimeout(() => setQuickToast(null), 4000);
  };

  // Filtered customers list
  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      if (!cust) return false;
      const matchesSearch =
        (cust.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cust.phone || '').includes(searchQuery) ||
        (cust.frequentlyPurchasedProducts || []).some((p) =>
          p && p.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus = statusFilter === 'all' || cust.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case 'regular':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Regular
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Inactive
          </span>
        );
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            New
          </span>
        );
      default:
        return null;
    }
  };

  const handleQuickWhatsApp = (customer: any) => {
    let msg = `Namaste ${customer.name}! 🙏 Your regular grocery staples are in stock at ${shopProfile.shopName}. Reply to reserve your order or get doorstep delivery!`;
    if (customer.status === 'inactive') {
      msg = `Namaste ${customer.name}! We missed you at ${shopProfile.shopName}. As a valued regular, get 10% OFF on your grocery basket this week. Reply anytime to order!`;
    } else if (customer.status === 'new') {
      msg = `Namaste ${customer.name}! Thank you for shopping with ${shopProfile.shopName}. Save this number for quick orders on WhatsApp!`;
    }

    openWhatsAppComposer({
      customerName: customer.name,
      phone: customer.phone,
      message: msg,
    });
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Page Title & Add Customer Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand buying cycles, track favorite products & re-engage customers via WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => openDirectWhatsAppModal()}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>+ WhatsApp Outreach</span>
          </button>

          <button
            onClick={() => setIsAddCustomerModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add WhatsApp Contact</span>
          </button>
        </div>
      </div>

      {/* Quick Add WhatsApp Contact Inline Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-xl p-3.5 shadow-2xs">
        <form onSubmit={handleQuickAddContact} className="flex flex-col md:flex-row md:items-center gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-emerald-950 whitespace-nowrap">
              Quick Save WhatsApp Contact:
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Customer Full Name (e.g. Anand Ji)"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              className="px-3 py-1.5 text-xs sm:text-sm bg-white border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-slate-500 font-semibold pointer-events-none">
                +91
              </span>
              <input
                type="tel"
                placeholder="10-digit mobile (e.g. 9876543210)"
                value={quickPhone}
                onChange={(e) => setQuickPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors shrink-0 whitespace-nowrap"
          >
            Save Contact
          </button>
        </form>

        {quickError && (
          <div className="mt-2 text-xs font-semibold text-red-800 bg-red-100/90 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <span>{quickError}</span>
          </div>
        )}

        {quickToast && (
          <div className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <span>{quickToast}</span>
          </div>
        )}
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-500">All Customers</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {customers.length}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('regular')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'regular'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-emerald-800">🟢 Regular Buyers</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {regularCustomersCount}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('inactive')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'inactive'
              ? 'border-amber-600 bg-amber-50/50 shadow-2xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-amber-800">🟡 Inactive (Needs Follow-up)</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {inactiveCustomersCount}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('new')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'new'
              ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-blue-800">🔵 New Customers</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {newCustomersCount}
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by customer name, phone or favorite items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto shrink-0 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setStatusFilter('regular')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'regular' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Regular
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'inactive' ? 'bg-white text-amber-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inactive
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'new' ? 'bg-white text-blue-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New
          </button>
        </div>
      </div>

      {/* Inactive notice if inactive filter is active */}
      {statusFilter === 'inactive' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Why are these customers inactive?</span>
            <p className="mt-0.5 text-amber-800">
              These {inactiveCustomersCount} customers have not made a purchase within their normal visit interval
              (usually 10–20 days). Sending a polite WhatsApp reminder or a small 10% welcome-back offer brings
              back 30–40% of dormant dukaan shoppers.
            </p>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Purchase</th>
              <th className="py-3 px-4">Orders</th>
              <th className="py-3 px-4">Total Spending</th>
              <th className="py-3 px-4">Frequently Purchased</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedCustomerId(cust.id)}
                      className="font-bold text-slate-900 hover:text-emerald-700 transition-colors text-left"
                    >
                      {cust.name}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {formatMaskedPhone(cust.phone)}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(cust.status)}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-medium text-slate-800">{cust.lastPurchaseRelative}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">
                    {cust.totalOrders}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {formatIndianCurrency(cust.totalSpending)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {cust.frequentlyPurchasedProducts.slice(0, 2).join(' + ') || 'General Staples'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedCustomerId(cust.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleQuickWhatsApp(cust)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No customers found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="lg:hidden space-y-3">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className="font-bold text-base text-slate-900 hover:text-emerald-700 text-left"
                  >
                    {cust.name}
                  </button>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">
                    {formatMaskedPhone(cust.phone)}
                  </div>
                </div>
                {getStatusBadge(cust.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-500">Last purchase: </span>
                  <span className="font-semibold text-slate-800">{cust.lastPurchaseRelative}</span>
                </div>
                <div>
                  <span className="text-slate-500">Orders: </span>
                  <span className="font-semibold text-slate-800 font-mono">{cust.totalOrders}</span>
                </div>
                <div>
                  <span className="text-slate-500">Total spent: </span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {formatIndianCurrency(cust.totalSpending)}
                  </span>
                </div>
                <div className="truncate">
                  <span className="text-slate-500">Favorite: </span>
                  <span className="font-medium text-slate-800">
                    {cust.frequentlyPurchasedProducts[0] || 'Staples'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className="flex-1 py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleQuickWhatsApp(cust)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg text-center"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No customers found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
