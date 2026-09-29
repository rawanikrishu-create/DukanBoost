import React, { useState, useEffect, useMemo } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { formatMaskedPhone } from '../../data/mockData';
import {
  X,
  MessageSquare,
  Send,
  Copy,
  Check,
  UserPlus,
  Users,
  Search,
  Sparkles,
  Phone,
  User,
  Tag,
  CheckCircle,
  Clock,
  HeartHandshake,
  Store,
  ExternalLink,
  ChevronRight,
  ListOrdered,
  AlertCircle,
} from 'lucide-react';
import { CustomerStatus } from '../../types';

interface MessageTemplate {
  id: string;
  title: string;
  category: 'offer' | 'stock' | 'order' | 'khata' | 'welcome' | 'custom';
  badge: string;
  text: string;
}

const PRE_WRITTEN_TEMPLATES: MessageTemplate[] = [
  {
    id: 'winback-10',
    title: '10% Win-Back Discount',
    category: 'offer',
    badge: 'High Response',
    text: 'Namaste {customer_name}! 🙏 We noticed it has been a little while since your last visit to {shop_name}. Fresh stock has arrived this week, and we would love to offer you 10% OFF on your grocery basket. Reply anytime with your list for doorstep delivery!',
  },
  {
    id: 'stock-alert',
    title: 'Fresh Stock Arrival',
    category: 'stock',
    badge: 'Daily Staples',
    text: 'Namaste {customer_name}! Fresh daily stock of dairy, groceries, and household staples just arrived today at {shop_name}. Reply to hold your order or have it delivered to your door!',
  },
  {
    id: 'order-ready',
    title: 'Order Packed & Ready',
    category: 'order',
    badge: 'Pickup & Delivery',
    text: 'Namaste {customer_name}! Your order from {shop_name} is packed and ready for pickup or immediate delivery. Please let us know if you need anything else added. Thank you!',
  },
  {
    id: 'khata-reminder',
    title: 'Gentle Khata / Bill Reminder',
    category: 'khata',
    badge: 'Payment',
    text: 'Namaste {customer_name}! 🙏 Hope you are having a pleasant day. A polite reminder from {shop_name} regarding your pending bill balance. You can conveniently pay via UPI or during your next visit. Thank you for your support!',
  },
  {
    id: 'welcome-new',
    title: 'Welcome New Customer',
    category: 'welcome',
    badge: 'First Purchase',
    text: 'Namaste {customer_name}! Thank you for visiting {shop_name}. It was our pleasure to serve you! Please save our WhatsApp number so you can conveniently message us your grocery list anytime.',
  },
  {
    id: 'weekend-special',
    title: 'Weekend Special Savings',
    category: 'offer',
    badge: 'Loyalty',
    text: 'Namaste {customer_name}! Special weekend savings are live at {shop_name}! Get bonus discounts on all household essentials this Saturday and Sunday. Reply with your list to reserve!',
  },
];

export const DirectWhatsAppModal: React.FC = () => {
  const {
    isDirectWhatsAppModalOpen,
    closeDirectWhatsAppModal,
    directWhatsAppInitialData,
    shopProfile,
    customers,
    addCustomer,
  } = useDukaan();

  // Mode: 'manual' (enter new contact) or 'select' (choose from saved directory)
  const [activeTab, setActiveTab] = useState<'manual' | 'select'>('manual');

  // Manual Contact Form States
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualStatus, setManualStatus] = useState<CustomerStatus>('regular');
  const [saveToDirectory, setSaveToDirectory] = useState(true);
  const [manualNotes, setManualNotes] = useState('');

  // Select Saved Contacts States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | CustomerStatus>('all');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // Message & Template States
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('winback-10');
  const [messageTemplate, setMessageTemplate] = useState<string>(PRE_WRITTEN_TEMPLATES[0].text);
  const [copied, setCopied] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Multi-contact autonomous dispatch queue state
  const [multiQueueIndex, setMultiQueueIndex] = useState(0);
  const [sentCustomerIds, setSentCustomerIds] = useState<Set<string>>(new Set());

  // Initialize data when modal opens
  useEffect(() => {
    if (isDirectWhatsAppModalOpen) {
      if (directWhatsAppInitialData?.name || directWhatsAppInitialData?.phone) {
        setManualName(directWhatsAppInitialData.name || '');
        setManualPhone(directWhatsAppInitialData.phone || '');
        setActiveTab('manual');
        if (directWhatsAppInitialData.message) {
          setMessageTemplate(directWhatsAppInitialData.message);
        } else {
          const welcomeTmpl = PRE_WRITTEN_TEMPLATES.find((t) => t.id === 'welcome-new');
          if (welcomeTmpl) {
            setSelectedTemplateId(welcomeTmpl.id);
            setMessageTemplate(welcomeTmpl.text);
          }
        }
      } else {
        // Reset defaults
        setManualName('');
        setManualPhone('');
      }
      setSelectedCustomerIds([]);
      setSentCustomerIds(new Set());
      setMultiQueueIndex(0);
      setSuccessToast(null);
    }
  }, [isDirectWhatsAppModalOpen, directWhatsAppInitialData]);

  // Filtered saved customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.frequentlyPurchasedProducts.some((p) =>
          p.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesCategory = filterCategory === 'all' || c.status === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [customers, searchQuery, filterCategory]);

  // Active target details for live preview
  const currentRecipient = useMemo(() => {
    if (activeTab === 'manual') {
      const name = manualName.trim() || 'Valued Customer';
      const cleanDigits = manualPhone.replace(/[^0-9]/g, '');
      const phone = cleanDigits.length >= 10 ? `+91 ${cleanDigits.slice(-10)}` : '+91 98000 00000';
      const waNumber = cleanDigits.length >= 10 ? `91${cleanDigits.slice(-10)}` : '919800000000';
      return {
        id: 'manual-target',
        name,
        phone,
        waNumber,
        isManual: true,
      };
    } else {
      if (selectedCustomerIds.length === 0) {
        return {
          id: 'placeholder',
          name: 'Select a Customer',
          phone: '+91 XXXXX XXXXX',
          waNumber: '',
          isManual: false,
        };
      }
      const targetId = selectedCustomerIds[multiQueueIndex] || selectedCustomerIds[0];
      const found = customers.find((c) => c.id === targetId);
      if (!found) {
        return {
          id: 'placeholder',
          name: 'Selected Customer',
          phone: '+91 XXXXX XXXXX',
          waNumber: '',
          isManual: false,
        };
      }
      const cleanDigits = found.phone.replace(/[^0-9]/g, '');
      const waNumber = cleanDigits.length >= 10 ? `91${cleanDigits.slice(-10)}` : '919800000000';
      return {
        id: found.id,
        name: found.name,
        phone: found.phone,
        waNumber,
        isManual: false,
      };
    }
  }, [activeTab, manualName, manualPhone, selectedCustomerIds, multiQueueIndex, customers]);

  // Personalized preview text
  const personalizedPreview = useMemo(() => {
    const custName = activeTab === 'manual' ? (manualName.trim() || 'Customer') : currentRecipient.name;
    return messageTemplate
      .replace(/{customer_name}/g, custName)
      .replace(/{shop_name}/g, shopProfile.shopName);
  }, [messageTemplate, activeTab, manualName, currentRecipient.name, shopProfile.shopName]);

  // Insert variable tag into template
  const insertVariable = (variable: string) => {
    setMessageTemplate((prev) => `${prev} ${variable}`);
  };

  // Copy message
  const handleCopy = () => {
    navigator.clipboard.writeText(personalizedPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle single send
  const handleSendSingle = () => {
    setErrorToast(null);
    if (activeTab === 'manual') {
      const cleanDigits = manualPhone.replace(/[^0-9]/g, '');
      if (cleanDigits.length < 10) {
        setErrorToast('Please enter a valid 10-digit mobile number.');
        return;
      }

      // Save to customer directory if checked
      if (saveToDirectory && manualName.trim()) {
        const existing = customers.find(
          (c) => c && c.phone && c.phone.replace(/[^0-9]/g, '').slice(-10) === cleanDigits.slice(-10),
        );
        if (!existing) {
          addCustomer({
            name: manualName.trim(),
            phone: cleanDigits.slice(-10),
            status: manualStatus,
            notes: manualNotes.trim() || 'Added via WhatsApp Direct outreach',
          });
        }
      }
    }

    const cleanNumber = currentRecipient.waNumber;
    if (!cleanNumber) {
      setErrorToast('Please select or enter a contact first.');
      return;
    }

    const encoded = encodeURIComponent(personalizedPreview);
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Popup blocked, click the direct link', e);
    }

    setSuccessToast(`Message prepared for ${currentRecipient.name}!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Handle multi-dispatch next
  const handleSendNextInQueue = () => {
    setErrorToast(null);
    if (selectedCustomerIds.length === 0) return;

    const currentId = selectedCustomerIds[multiQueueIndex];
    const customer = customers.find((c) => c.id === currentId);
    if (!customer) return;

    const cleanDigits = (customer.phone || '').replace(/[^0-9]/g, '');
    const cleanNumber = cleanDigits.length >= 10 ? `91${cleanDigits.slice(-10)}` : '919800000000';

    const customMsg = messageTemplate
      .replace(/{customer_name}/g, customer.name)
      .replace(/{shop_name}/g, shopProfile.shopName);

    const encoded = encodeURIComponent(customMsg);
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Popup blocked', e);
    }

    // Mark as sent
    setSentCustomerIds((prev) => new Set([...prev, currentId]));

    // Advance queue
    if (multiQueueIndex < selectedCustomerIds.length - 1) {
      setMultiQueueIndex((prev) => prev + 1);
    } else {
      setSuccessToast(`Batch completed! All ${selectedCustomerIds.length} messages prepared.`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  // Toggle selection for multiple customers
  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomerIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllFiltered = () => {
    const ids = filteredCustomers.map((c) => c.id);
    setSelectedCustomerIds(ids);
  };

  const handleClearSelection = () => {
    setSelectedCustomerIds([]);
    setMultiQueueIndex(0);
  };

  if (!isDirectWhatsAppModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Direct WhatsApp Outreach</h3>
                <span className="text-[11px] font-semibold bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded">
                  Autonomous & Pre-written
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Manually enter any contact number or pick existing customers to dispatch instant messages
              </p>
            </div>
          </div>
          <button
            onClick={closeDirectWhatsAppModal}
            className="p-1.5 text-emerald-100 hover:text-white bg-emerald-800/60 hover:bg-emerald-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success / Error Toast Banners */}
        {errorToast && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 flex items-center justify-between text-xs text-red-900 shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-semibold">{errorToast}</span>
            </div>
            <button
              onClick={() => setErrorToast(null)}
              className="text-red-700 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {successToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-900 shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-700 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Area (Two Columns on Desktop) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Contact Entry & Selection (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col">
            {/* Contact Mode Segmented Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'manual'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Manual New Contact</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('select')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'select'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Select Saved ({customers.length})</span>
              </button>
            </div>

            {/* TAB 1: Manual Contact Input Form */}
            {activeTab === 'manual' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5 flex-1">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Enter Contact Details</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Direct Send
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer / Person Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Chandra, Sunita Ji"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-semibold text-xs">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      className="w-full pl-11 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enter 10-digit number. DukaanBoost creates direct wa.me link.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Type / Tag
                  </label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as CustomerStatus)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="regular">🟢 Regular Customer (Frequent)</option>
                    <option value="new">🔵 New Customer</option>
                    <option value="inactive">🟡 Inactive / Win-back</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notes / Location (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Block C resident, morning delivery"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveToDirectory}
                      onChange={(e) => setSaveToDirectory(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      Save to customer directory for future repeat sales
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              /* TAB 2: Select From Saved Customers */
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 flex-1 flex flex-col min-h-[340px]">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search name, phone, item..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Filter tags & quick select */}
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setFilterCategory('all')}
                      className={`px-2 py-0.5 rounded font-medium ${
                        filterCategory === 'all'
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterCategory('inactive')}
                      className={`px-2 py-0.5 rounded font-medium ${
                        filterCategory === 'inactive'
                          ? 'bg-amber-700 text-white'
                          : 'bg-white text-amber-800 hover:bg-amber-100'
                      }`}
                    >
                      Inactive
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterCategory('regular')}
                      className={`px-2 py-0.5 rounded font-medium ${
                        filterCategory === 'regular'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      Regular
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleSelectAllFiltered}
                      className="text-emerald-700 hover:underline font-semibold"
                    >
                      Select All
                    </button>
                    {selectedCustomerIds.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearSelection}
                        className="text-slate-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Selected Count Indicator */}
                <div className="text-[11px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200 flex items-center justify-between">
                  <span>
                    Selected:{' '}
                    <strong className="text-emerald-800">{selectedCustomerIds.length}</strong>{' '}
                    contacts
                  </span>
                  {selectedCustomerIds.length > 1 && (
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Queue Mode Ready
                    </span>
                  )}
                </div>

                {/* Customer List checkboxes */}
                <div className="flex-1 overflow-y-auto max-h-56 space-y-1.5 divide-y divide-slate-100 bg-white rounded-lg border border-slate-200 p-2">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((cust) => {
                      const isSelected = selectedCustomerIds.includes(cust.id);
                      const isSent = sentCustomerIds.has(cust.id);
                      return (
                        <label
                          key={cust.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors pt-2 ${
                            isSelected ? 'bg-emerald-50/70 border border-emerald-200' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectCustomer(cust.id)}
                              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {cust.name}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500">
                                {formatMaskedPhone(cust.phone)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isSent ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Check className="w-3 h-3" />
                                <span>Sent</span>
                              </span>
                            ) : (
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                  cust.status === 'regular'
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : cust.status === 'inactive'
                                    ? 'bg-amber-50 text-amber-800'
                                    : 'bg-blue-50 text-blue-800'
                                }`}
                              >
                                {cust.status}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No matching contacts found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pre-written Message Templates & Autonomous Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col">
            {/* Pre-written templates quick picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Select Pre-Written Message Template</span>
                </span>
                <span className="text-[11px] text-slate-500">Click to load</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRE_WRITTEN_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setMessageTemplate(tmpl.text);
                      }}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 truncate">{tmpl.title}</div>
                      <div className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                        {tmpl.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editable Template Textarea & Variable Tags */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Message Content & Variables
                </label>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Dynamic tag inserters */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-medium">Insert:</span>
                <button
                  type="button"
                  onClick={() => insertVariable('{customer_name}')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium rounded border border-slate-200"
                >
                  + {'{customer_name}'}
                </button>
                <button
                  type="button"
                  onClick={() => insertVariable('{shop_name}')}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-medium rounded border border-slate-200"
                >
                  + {'{shop_name}'}
                </button>
              </div>

              <textarea
                rows={3}
                value={messageTemplate}
                onChange={(e) => setMessageTemplate(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
                placeholder="Type your message..."
              />
            </div>

            {/* Live WhatsApp Preview Frame */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Live WhatsApp Message Preview
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  To: {currentRecipient.name} ({currentRecipient.phone})
                </span>
              </div>

              {/* WhatsApp Chat simulation bubble */}
              <div className="bg-[#E5DDD5] p-3.5 rounded-xl border border-slate-300 relative flex-1 flex flex-col justify-end min-h-[140px]">
                <div className="flex justify-end">
                  <div className="bg-[#DCF8C6] rounded-xl rounded-tr-none p-3 shadow-2xs max-w-[92%] sm:max-w-[85%] text-xs text-slate-900 space-y-1.5 border border-[#c4eab0]">
                    <div className="font-semibold text-[11px] text-emerald-900 flex items-center gap-1">
                      <Store className="w-3 h-3 text-emerald-700" />
                      <span>{shopProfile.shopName}</span>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed text-xs">
                      {personalizedPreview}
                    </div>
                    <div className="text-right text-[10px] text-slate-400 font-mono">
                      10:45 AM · Read ✓✓
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Autonomous Queue Controller (if multiple contacts selected) */}
            {activeTab === 'select' && selectedCustomerIds.length > 1 && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-emerald-900">
                    Autonomous Dispatch Queue: Contact {multiQueueIndex + 1} of{' '}
                    {selectedCustomerIds.length}
                  </div>
                  <div className="text-emerald-700 text-[11px]">
                    Next up: <strong>{currentRecipient.name}</strong> ({currentRecipient.phone}) ·{' '}
                    {sentCustomerIds.size} sent
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setMultiQueueIndex((prev) =>
                        Math.min(selectedCustomerIds.length - 1, prev + 1),
                      )
                    }
                    className="px-2.5 py-1 bg-white text-slate-700 border border-slate-300 rounded font-medium hover:bg-slate-50"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={handleSendNextInQueue}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send to {currentRecipient.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={closeDirectWhatsAppModal}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Message'}</span>
            </button>

            {activeTab === 'select' && selectedCustomerIds.length > 1 ? (
              <button
                type="button"
                onClick={handleSendNextInQueue}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>
                  Start Queue ({multiQueueIndex + 1}/{selectedCustomerIds.length})
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendSingle}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
