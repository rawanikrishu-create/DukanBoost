import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import {
  X,
  UserPlus,
  Phone,
  User,
  FileText,
  MessageSquare,
  CheckCircle,
  Tag,
  Send,
} from 'lucide-react';
import { CustomerStatus } from '../../types';

export const AddCustomerModal: React.FC = () => {
  const {
    isAddCustomerModalOpen,
    setIsAddCustomerModalOpen,
    addCustomer,
    openDirectWhatsAppModal,
  } = useDukaan();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('regular');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [sendWelcomeMsg, setSendWelcomeMsg] = useState(true);

  if (!isAddCustomerModalOpen) return null;

  const cleanDigits = phone.replace(/[^0-9]/g, '');
  const isValidPhone = cleanDigits.length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter customer full name');
      return;
    }
    if (!isValidPhone) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const created = addCustomer({
      name: name.trim(),
      phone: cleanDigits.slice(-10),
      status,
      notes: notes.trim(),
    });

    const savedName = name.trim();
    const savedPhone = cleanDigits.slice(-10);

    // Reset and close
    setName('');
    setPhone('');
    setStatus('regular');
    setNotes('');
    setError('');
    setIsAddCustomerModalOpen(false);

    // If send welcome message is selected, open WhatsApp direct composer immediately
    if (sendWelcomeMsg) {
      openDirectWhatsAppModal({
        name: savedName,
        phone: savedPhone,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base sm:text-lg">Add WhatsApp Contact</h3>
                <span className="text-[10px] font-semibold bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded">
                  Fast Save
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Save customer mobile to send receipts, offers & restock alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddCustomerModalOpen(false)}
            className="p-1.5 text-emerald-100 hover:text-white bg-emerald-800/60 hover:bg-emerald-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Customer Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Ramesh Chandra, Sunita Gupta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                WhatsApp / Mobile Number *
              </label>
              {isValidPhone && (
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>10 Digits Ready</span>
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600 text-xs sm:text-sm font-semibold">
                +91
              </div>
              <input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full pl-11 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Used for automatic WhatsApp billing and repeat visit reminders.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Customer Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('regular')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                  status === 'regular'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                🟢 Regular
              </button>
              <button
                type="button"
                onClick={() => setStatus('new')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                  status === 'new'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                🔵 New Buyer
              </button>
              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                  status === 'inactive'
                    ? 'border-amber-600 bg-amber-50 text-amber-800 ring-1 ring-amber-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                🟡 Inactive
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notes (Preferences / Colony Address)
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                placeholder="e.g. Near Shiv Mandir, prefers morning milk, pays via UPI"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={sendWelcomeMsg}
                onChange={(e) => setSendWelcomeMsg(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>Open WhatsApp welcome message after saving</span>
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddCustomerModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Save WhatsApp Contact</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
