import React from 'react';
import { useDukaan } from '../../context/DukaanContext';
import {
  LayoutDashboard,
  Users,
  Package,
  Receipt,
  MessageSquare,
  Tag,
  BarChart3,
  TrendingUp,
  Settings,
  Store,
  RotateCcw,
} from 'lucide-react';
import { ActiveView } from '../../context/DukaanContext';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    shopProfile,
    inactiveCustomersCount,
    lowStockProducts,
    resetToDemoData,
  } = useDukaan();

  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      badge: inactiveCustomersCount > 0 ? inactiveCustomersCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: lowStockProducts.length > 0 ? lowStockProducts.length : undefined,
      badgeColor: 'bg-red-100 text-red-800',
    },
    { id: 'sales', label: 'Sales History', icon: Receipt },
    { id: 'engagement', label: 'Customer WhatsApp', icon: MessageSquare },
    { id: 'offers', label: 'Offers & Discounts', icon: Tag },
    { id: 'insights', label: 'Business Insights', icon: BarChart3 },
    { id: 'market', label: 'Market Insights', icon: TrendingUp },
    { id: 'settings', label: 'Shop Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Shop Profile Widget */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-slate-900 truncate">{shopProfile.shopName}</h2>
            <div className="text-xs text-slate-500 truncate flex items-center gap-1">
              <span>{shopProfile.category}</span>
              <span>·</span>
              <span>{shopProfile.location.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer helpers */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className="text-xs text-slate-500 px-2">
          <span>Active: </span>
          <span className="font-semibold text-slate-700">{shopProfile.ownerName}</span>
        </div>
        <button
          onClick={() => resetToDemoData(shopProfile.category)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Store</span>
        </button>
      </div>
    </aside>
  );
};
