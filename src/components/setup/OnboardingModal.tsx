import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { BusinessCategory } from '../../types';
import {
  Store,
  User,
  Phone,
  MapPin,
  Tag,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { updateShopProfile, switchCategory, resetToDemoData } = useDukaan();

  const [shopName, setShopName] = useState('Sharma General Store');
  const [ownerName, setOwnerName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 98450 12345');
  const [location, setLocation] = useState('Sadar Bazar, Delhi');
  const [category, setCategory] = useState<BusinessCategory>('Grocery');
  const [approxCustomers, setApproxCustomers] = useState('100-300');
  const [hasDigitalRecords, setHasDigitalRecords] = useState<'yes' | 'no'>('no');
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleComplete = () => {
    updateShopProfile({
      shopName: shopName.trim() || 'Sharma General Store',
      ownerName: ownerName.trim() || 'Rahul Sharma',
      phone: phone.trim() || '+91 98450 12345',
      location: location.trim() || 'Sadar Bazar, Delhi',
      category,
      approxCustomers,
      hasDigitalRecords: hasDigitalRecords === 'yes',
      isSetupComplete: true,
    });
    switchCategory(category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-emerald-800 p-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-emerald-300" />
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
              DukaanBoost Business Setup
            </span>
          </div>
          <h2 className="text-xl font-bold">
            {step === 1 ? 'Tell us about your shop' : 'Store Scale & Privacy'}
          </h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Step {step} of 2 · Tailors recommendations and demo products to your business
          </p>
        </div>

        {/* Step 1 Form */}
        {step === 1 && (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Shop Name *</label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Sharma General Store"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner Phone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Shop Location *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sadar Bazar, Delhi or Indiranagar, Bengaluru"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="Grocery">🛒 Grocery / Kirana</option>
                <option value="Medical">💊 Medical Store / Chemist</option>
                <option value="Electronics">📱 Electronics & Mobiles</option>
                <option value="Textile & Clothing">👕 Textile & Clothing</option>
                <option value="General Store">🏬 General Store / Provisions</option>
                <option value="Other">📦 Other Retail</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 Form */}
        {step === 2 && (
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                How many customers do you approximately serve?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['50-100', '100-300', '300-1000', '1000+'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setApproxCustomers(opt)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      approxCustomers === opt
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt} customers
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Do you already have digital sales records?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHasDigitalRecords('yes')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    hasDigitalRecords === 'yes'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Yes (Khatabook / Vyapar / Tally)
                </button>
                <button
                  type="button"
                  onClick={() => setHasDigitalRecords('no')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    hasDigitalRecords === 'no'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  No (Pen & Paper ledger)
                </button>
              </div>
            </div>

            {/* Privacy notice banner as requested in Section 23 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Customer Privacy & Data Protection Notice</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                • Your customer phone numbers and purchase histories remain strictly private to your shop.
                <br />
                • DukaanBoost does NOT sell, expose, or share customer information.
                <br />
                • WhatsApp communication requires customer consent and sends through direct 1-to-1 links.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="flex items-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch My DukaanBoost Prototype</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
