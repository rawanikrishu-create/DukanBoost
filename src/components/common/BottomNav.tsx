import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import {
  Home,
  Users,
  Package,
  Plus,
  MoreHorizontal,
  MessageSquare,
  Tag,
  BarChart3,
  TrendingUp,
  Settings,
  X,
  RotateCcw,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setIsRecordSaleModalOpen,
    resetToDemoData,
    shopProfile,
  } = useDukaan();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const handleSelectView = (view: any) => {
    setActiveView(view);
    setIsMoreMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 safe-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {/* 1. Home */}
          <button
            onClick={() => handleSelectView('dashboard')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeView === 'dashboard' ? 'text-emerald-700 font-semibold' : 'text-slate-500'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Home</span>
          </button>

          {/* 2. Customers */}
          <button
            onClick={() => handleSelectView('customers')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeView === 'customers' ? 'text-emerald-700 font-semibold' : 'text-slate-500'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Customers</span>
          </button>

          {/* 3. Center CTA: + Sale */}
          <button
            onClick={() => setIsRecordSaleModalOpen(true)}
            className="flex flex-col items-center justify-center -mt-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-md active:scale-95 transition-all">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 mt-0.5">Record</span>
          </button>

          {/* 4. Products */}
          <button
            onClick={() => handleSelectView('products')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeView === 'products' ? 'text-emerald-700 font-semibold' : 'text-slate-500'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Products</span>
          </button>

          {/* 5. More */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              ['sales', 'engagement', 'offers', 'insights', 'market', 'settings'].includes(activeView)
                ? 'text-emerald-700 font-semibold'
                : 'text-slate-500'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">More</span>
          </button>
        </div>
      </nav>

      {/* More Options Bottom Drawer (Mobile) */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="relative bg-white rounded-t-2xl p-5 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">All DukaanBoost Features</h3>
                <p className="text-xs text-slate-500">{shopProfile.shopName}</p>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleSelectView('sales')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 text-left bg-slate-50/50"
              >
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Sales Ledger</div>
                  <div className="text-xs text-slate-500">History & Bills</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView('engagement')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 text-left bg-slate-50/50"
              >
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">WhatsApp</div>
                  <div className="text-xs text-slate-500">Reminders & Chat</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView('offers')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 text-left bg-slate-50/50"
              >
                <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Offers</div>
                  <div className="text-xs text-slate-500">Discounts & Combos</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView('insights')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 text-left bg-slate-50/50"
              >
                <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Insights</div>
                  <div className="text-xs text-slate-500">Customer & Stock</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView('market')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 text-left bg-slate-50/50 col-span-2"
              >
                <div className="p-2 bg-purple-50 rounded-lg text-purple-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    Market Insights <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">PRO</span>
                  </div>
                  <div className="text-xs text-slate-500">Nearby demand & local customer opportunities</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectView('settings')}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 text-left bg-slate-50/50 col-span-2"
              >
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">Shop Setup & Profile</div>
                  <div className="text-xs text-slate-500">Manage business details & category</div>
                </div>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  resetToDemoData(shopProfile.category);
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Fresh Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
