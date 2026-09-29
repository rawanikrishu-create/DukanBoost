import React from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { Plus, Store, MessageSquare, UserPlus, RotateCcw } from 'lucide-react';
import { BusinessCategory } from '../../types';

export const Header: React.FC<{
  onOpenLanding?: () => void;
  onOpenSetup?: () => void;
}> = ({ onOpenLanding, onOpenSetup }) => {
  const {
    shopProfile,
    switchCategory,
    setIsRecordSaleModalOpen,
    setIsAddCustomerModalOpen,
    openDirectWhatsAppModal,
    resetToDemoData,
    setActiveView,
  } = useDukaan();

  const categories: BusinessCategory[] = [
    'Grocery',
    'Medical',
    'Electronics',
    'Textile & Clothing',
    'General Store',
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-left group flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-emerald-700 transition-colors">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  DukaanBoost
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block leading-tight">
                  {shopProfile.shopName}
                </span>
              </div>
            </button>

            {/* Quick Category Switcher */}
            <div className="hidden sm:flex items-center ml-3 pl-3 border-l border-slate-200">
              <label htmlFor="cat-select" className="text-xs text-slate-500 mr-2 whitespace-nowrap">
                Store:
              </label>
              <select
                id="cat-select"
                value={shopProfile.category}
                onChange={(e) => switchCategory(e.target.value as BusinessCategory)}
                className="text-xs font-semibold bg-slate-50 border border-slate-300 text-slate-800 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action buttons (Clean, no redundant nav links) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onOpenLanding && (
              <button
                onClick={onOpenLanding}
                title="View product overview landing page"
                className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <span>Tour</span>
              </button>
            )}

            <button
              onClick={() => resetToDemoData(shopProfile.category)}
              title="Reset demo data"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>

            {/* Quick Add WhatsApp Contact */}
            <button
              onClick={() => setIsAddCustomerModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-colors whitespace-nowrap"
              title="Quickly save customer mobile and WhatsApp number"
            >
              <UserPlus className="w-4 h-4 text-emerald-700" />
              <span>+ Contact</span>
            </button>

            {/* Direct WhatsApp Outreach Action */}
            <button
              onClick={() => openDirectWhatsAppModal()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
              title="Send autonomous or pre-written WhatsApp message to any contact"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>+ WhatsApp Message</span>
            </button>

            {/* Record Sale Primary Action */}
            <button
              onClick={() => setIsRecordSaleModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Record Sale</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
