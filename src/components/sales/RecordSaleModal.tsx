import React, { useState, useEffect, useMemo } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { formatIndianCurrency } from '../../data/mockData';
import { PaymentMethod, CustomerStatus } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Package,
  CreditCard,
  Banknote,
  Smartphone,
  BookOpen,
  MessageSquare,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface FormItem {
  productId: string;
  quantity: number;
}

export const RecordSaleModal: React.FC = () => {
  const {
    isRecordSaleModalOpen,
    setIsRecordSaleModalOpen,
    customers,
    products,
    recordSale,
    addCustomer,
    resetToDemoData,
    shopProfile,
  } = useDukaan();

  // Mode: 'walk-in' | 'saved' | 'new_whatsapp'
  const [customerMode, setCustomerMode] = useState<'walk-in' | 'saved' | 'new_whatsapp'>('walk-in');

  // Customer form inputs
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [saveToContacts, setSaveToContacts] = useState<boolean>(true);
  const [shareBillWhatsApp, setShareBillWhatsApp] = useState<boolean>(true);

  // Items list
  const [items, setItems] = useState<FormItem[]>([]);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paid_upi');
  const [error, setError] = useState<string>('');

  // Synchronize and validate items whenever modal opens or products array updates
  useEffect(() => {
    if (isRecordSaleModalOpen) {
      setError('');

      // Ensure we have at least one valid item from current products list
      if (products && products.length > 0) {
        // Check if existing items have valid product IDs
        const validItems = items.filter((it) =>
          products.some((p) => p && p.id === it.productId),
        );
        if (validItems.length > 0) {
          setItems(validItems);
        } else {
          // Initialize with first available product
          setItems([{ productId: products[0].id, quantity: 1 }]);
        }
      } else {
        setItems([]);
      }

      // Default customer setup if walk-in
      if (customerMode === 'walk-in') {
        setCustomerName('Walk-in Customer');
        setCustomerPhone('');
      } else if (customerMode === 'saved' && customers && customers.length > 0) {
        if (!selectedCustomerId || !customers.some((c) => c.id === selectedCustomerId)) {
          const first = customers[0];
          setSelectedCustomerId(first.id);
          setCustomerName(first.name);
          setCustomerPhone(first.phone);
        }
      }
    }
  }, [isRecordSaleModalOpen, products]);

  // Handle customer mode switch
  const handleModeSwitch = (mode: 'walk-in' | 'saved' | 'new_whatsapp') => {
    setCustomerMode(mode);
    setError('');

    if (mode === 'walk-in') {
      setCustomerName('Walk-in Customer');
      setCustomerPhone('');
    } else if (mode === 'saved') {
      if (customers && customers.length > 0) {
        const found = customers.find((c) => c.id === selectedCustomerId) || customers[0];
        setSelectedCustomerId(found.id);
        setCustomerName(found.name);
        setCustomerPhone(found.phone);
      } else {
        // Fallback to new contact if no saved customers exist
        setCustomerMode('new_whatsapp');
        setCustomerName('');
        setCustomerPhone('');
      }
    } else if (mode === 'new_whatsapp') {
      setCustomerName('');
      setCustomerPhone('');
      setSaveToContacts(true);
      setShareBillWhatsApp(true);
    }
  };

  // Handle saved customer dropdown select
  const handleSelectSavedCustomer = (id: string) => {
    setSelectedCustomerId(id);
    const found = customers.find((c) => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
    }
  };

  // Add line item safely
  const handleAddItem = () => {
    if (!products || products.length === 0) return;
    const nextProd = products.find((p) => p && !items.some((it) => it.productId === p.id)) || products[0];
    if (nextProd) {
      setItems((prev) => [...prev, { productId: nextProd.id, quantity: 1 }]);
    }
  };

  // Remove line item
  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  // Update line item
  const handleUpdateItem = (index: number, field: 'productId' | 'quantity', value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  // Safe Grand total calculation
  const grandTotal = useMemo(() => {
    if (!items || !products) return 0;
    return items.reduce((acc, it) => {
      const prod = products.find((p) => p && p.id === it.productId);
      const price = prod && typeof prod.price === 'number' ? prod.price : 0;
      const qty = typeof it.quantity === 'number' && !isNaN(it.quantity) ? it.quantity : 1;
      return acc + price * qty;
    }, 0);
  }, [items, products]);

  // Submit sale
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!products || products.length === 0) {
      setError('Please add products to your dukaan catalog first.');
      return;
    }

    const trimmedName = customerName.trim();
    if (!trimmedName) {
      setError('Please enter a customer name.');
      return;
    }

    if (items.length === 0) {
      setError('Please add at least one product to the basket.');
      return;
    }

    // Validate quantities
    for (const it of items) {
      if (!it.productId || it.quantity <= 0) {
        setError('Please select valid products and positive quantities.');
        return;
      }
    }

    // Validate and clean phone number if WhatsApp customer
    let cleanPhone = customerPhone.trim();
    const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');

    if (customerMode === 'new_whatsapp') {
      if (cleanDigits.length < 10) {
        setError('Please enter a valid 10-digit WhatsApp mobile number.');
        return;
      }
      cleanPhone = `+91 ${cleanDigits.slice(-10)}`;

      // Save to customer directory if checked
      if (saveToContacts) {
        const existing = customers.find(
          (c) => c && c.phone && c.phone.replace(/[^0-9]/g, '').slice(-10) === cleanDigits.slice(-10),
        );
        if (!existing) {
          addCustomer({
            name: trimmedName,
            phone: cleanDigits.slice(-10),
            status: 'new',
            notes: 'Saved during sale billing',
          });
        }
      }
    } else if (customerMode === 'walk-in') {
      cleanPhone = cleanDigits.length >= 10 ? `+91 ${cleanDigits.slice(-10)}` : '+91 98000 00000';
    }

    // Execute record sale
    recordSale({
      customerId: customerMode === 'saved' ? selectedCustomerId : undefined,
      customerName: trimmedName,
      customerPhone: cleanPhone,
      items: items.map((it) => ({
        productId: it.productId,
        quantity: Math.max(1, Number(it.quantity) || 1),
      })),
      paymentMethod,
    });

    // Reset and close
    setIsRecordSaleModalOpen(false);
    setError('');
  };

  if (!isRecordSaleModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Record New Sale</h3>
                <span className="text-[11px] font-semibold bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded">
                  Quick Bill & WhatsApp
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Instant dukaan billing with automatic inventory decrement and WhatsApp bill sharing
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRecordSaleModalOpen(false)}
            className="p-1.5 text-emerald-100 hover:text-white bg-emerald-800/60 hover:bg-emerald-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          {error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Customer & WhatsApp Contact Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>1. Customer & WhatsApp Contact</span>
              </label>
              <span className="text-[11px] text-slate-500">Pick or type number</span>
            </div>

            {/* Segmented Mode Selector */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => handleModeSwitch('walk-in')}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all ${
                  customerMode === 'walk-in'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ Walk-in (Cash)
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('saved')}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all ${
                  customerMode === 'saved'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👥 Saved Contact
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('new_whatsapp')}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  customerMode === 'new_whatsapp'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-emerald-800 hover:text-emerald-900'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>+ Add WhatsApp</span>
              </button>
            </div>

            {/* Mode-specific Fields */}
            {customerMode === 'walk-in' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Walk-in Customer</span>
                  <p className="text-[11px] text-slate-500">No contact required. Quick checkout.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleModeSwitch('new_whatsapp')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach WhatsApp Number</span>
                </button>
              </div>
            )}

            {customerMode === 'saved' && (
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-xs font-semibold text-slate-700">
                  Choose from saved contacts ({customers?.length || 0})
                </label>
                {customers && customers.length > 0 ? (
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleSelectSavedCustomer(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.phone} ({c.status})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-slate-500 py-1">
                    No saved customers found.{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('new_whatsapp')}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Click here to add new WhatsApp contact
                    </button>
                  </div>
                )}
              </div>
            )}

            {customerMode === 'new_whatsapp' && (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Quick WhatsApp Contact Details</span>
                  </span>
                  <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded font-semibold">
                    Instant Auto-Save
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Customer Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar, Sunita Ji"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-600 font-semibold text-xs">
                        +91
                      </div>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-10 pr-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveToContacts}
                      onChange={(e) => setSaveToContacts(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700 font-medium">
                      Save to customer directory
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareBillWhatsApp}
                      onChange={(e) => setShareBillWhatsApp(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-900 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ready to share bill on WhatsApp</span>
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Items in Basket */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-700" />
                <span>2. Products in Basket</span>
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Add Item</span>
              </button>
            </div>

            {/* Check if catalog is empty */}
            {(!products || products.length === 0) ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                <p className="text-xs text-amber-800 font-medium">
                  Your product inventory is currently empty for this dukaan category.
                </p>
                <button
                  type="button"
                  onClick={() => resetToDemoData(shopProfile.category)}
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Load Sample Catalog Products
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => {
                  const prod = products.find((p) => p && p.id === item.productId) || products[0];
                  const unitPrice = prod && typeof prod.price === 'number' ? prod.price : 0;
                  const qty = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 1;
                  const lineTotal = unitPrice * qty;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      {/* Product Selector */}
                      <div className="flex-1 min-w-0">
                        <select
                          value={item.productId || (products[0]?.id || '')}
                          onChange={(e) => handleUpdateItem(index, 'productId', e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 truncate focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (₹{p.price} / {p.unit || 'unit'})
                              {p.stock !== undefined && p.stock <= 5 ? ` [Stock: ${p.stock}]` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white shrink-0 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleUpdateItem(index, 'quantity', Math.max(1, qty - 1))}
                          className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) =>
                            handleUpdateItem(
                              index,
                              'quantity',
                              Math.max(1, parseInt(e.target.value, 10) || 1),
                            )
                          }
                          className="w-9 text-center text-xs font-bold font-mono focus:outline-none py-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateItem(index, 'quantity', qty + 1)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="w-16 text-right font-mono font-bold text-xs text-slate-900 shrink-0">
                        ₹{lineTotal}
                      </div>

                      {/* Delete button */}
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md shrink-0 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Total Payable Callout */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                Total Bill Amount:
              </span>
              <span className="text-[11px] text-emerald-700">
                {items.length} {items.length === 1 ? 'item' : 'items'} in bill
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-emerald-950 font-mono tabular-nums">
              {formatIndianCurrency(grandTotal || 0)}
            </span>
          </div>

          {/* Section 4: Payment Method */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('paid_upi')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-bold transition-all ${
                  paymentMethod === 'paid_upi'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paid_cash')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-bold transition-all ${
                  paymentMethod === 'paid_cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paid_card')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-bold transition-all ${
                  paymentMethod === 'paid_card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('udhaar_due')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-bold transition-all ${
                  paymentMethod === 'udhaar_due'
                    ? 'border-amber-600 bg-amber-50 text-amber-800 ring-1 ring-amber-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Udhaar (Khata)</span>
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsRecordSaleModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Save Sale & Generate Bill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
