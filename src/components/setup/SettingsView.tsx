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
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { shopProfile, updateShopProfile, switchCategory, resetToDemoData } = useDukaan();

  const [shopName, setShopName] = useState(shopProfile.shopName);
  const [ownerName, setOwnerName] = useState(shopProfile.ownerName);
  const [phone, setPhone] = useState(shopProfile.phone);
  const [location, setLocation] = useState(shopProfile.location);
  const [category, setCategory] = useState<BusinessCategory>(shopProfile.category);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopProfile({
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      category,
    });
    if (category !== shopProfile.category) {
      switchCategory(category);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-3xl">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Shop Setup & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your business information, retail category and demo dataset
        </p>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Shop Name *
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner / Shopkeeper Name *
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Store Category
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
            <p className="text-[11px] text-slate-500 mt-1">
              Switching categories updates your catalog and smart recommendations to match that
              business type.
            </p>
          </div>

          {isSaved && (
            <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Shop details saved successfully!</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Reset to Demo Data Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">Prototype Demo Data Control</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Need to test the app again from a clean baseline? You can reset the prototype to a fresh
          dataset of 25 realistic customers, 20 products, and 50+ sales.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => resetToDemoData('Grocery')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset as Grocery Store</span>
          </button>
          <button
            onClick={() => resetToDemoData('Medical')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset as Medical Store</span>
          </button>
          <button
            onClick={() => resetToDemoData('Electronics')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset as Electronics</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy & Security Assurances</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Customer numbers and bills are stored securely in your browser session/storage. No customer
          PII is transmitted to third-party ad networks or public AI systems.
        </p>
      </div>
    </div>
  );
};
