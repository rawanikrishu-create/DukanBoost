import React from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { AttentionActions } from './AttentionActions';
import { formatIndianCurrency } from '../../data/mockData';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  UserPlus,
  ArrowUpRight,
  Plus,
  Package,
  MessageSquare,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    shopProfile,
    todaySalesTotal,
    todayOrdersCount,
    todayReturningCount,
    todayNewCount,
    sales,
    products,
    setActiveView,
    setIsRecordSaleModalOpen,
    setIsAddCustomerModalOpen,
    setSelectedProductId,
    setSelectedCustomerId,
    quickAddStock,
  } = useDukaan();

  // Recent 5 sales
  const recentSales = sales.slice(0, 5);

  // Fast moving and low stock items
  const fastItems = products.filter((p) => p.status === 'fast_moving').slice(0, 4);
  const lowStockItems = products
    .filter((p) => p.stock <= p.minStockThreshold || p.estimatedDaysRemaining <= 3)
    .slice(0, 4);

  // Category specific tip
  const getCategoryTip = () => {
    switch (shopProfile.category) {
      case 'Grocery':
        return 'Tip for Grocery Dukaan: Perishable staples (milk, bread, eggs) bring customers in every 2-3 days. Pair them with high-margin tea, spices & snacks at checkout.';
      case 'Medical':
        return 'Tip for Medical Store: Monthly chronic prescription customers (blood pressure, diabetes) have an average 28-day refill cycle. Contact them 3 days before their refill date.';
      case 'Electronics':
        return 'Tip for Electronics: Every smartphone buyer is a high-probability customer for tempered glass, back cover, and fast-charging cables within 30 days.';
      case 'Textile & Clothing':
        return 'Tip for Textile: Repeat customers love personalized style and festival alerts. A simple WhatsApp preview of fresh festive arrivals drives 4x higher footfall.';
      default:
        return 'Tip for General Retail: 20% of your loyal regular customers generate over 60% of your monthly store revenue. Keep them engaged with simple WhatsApp reminders.';
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Greeting Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Good morning, {shopProfile.ownerName} 👋
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">{shopProfile.shopName}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">{shopProfile.location}</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-700 font-medium">{shopProfile.category} Dukaan</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsRecordSaleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Record New Sale</span>
            </button>
          </div>
        </div>

        {/* Category Knowledge Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{getCategoryTip()}</span>
        </div>
      </div>

      {/* Today's Overview Metrics Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Today's Overview (26 Sep 2026)
          </h2>
          <span className="text-xs text-slate-500">Live Store Pulse</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Today's Sales */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Today's Sales</span>
              <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {formatIndianCurrency(todaySalesTotal)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <span>+14% vs yesterday morning</span>
            </div>
          </div>

          {/* Card 2: Orders Count */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Orders Count</span>
              <div className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {todayOrdersCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Average bill: ₹{todayOrdersCount > 0 ? Math.round(todaySalesTotal / todayOrdersCount) : 0}</div>
          </div>

          {/* Card 3: Returning Customers */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Returning Customers</span>
              <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-md">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {todayReturningCount}
            </div>
            <div className="text-[11px] text-indigo-700 font-medium mt-1">
              Loyal repeat visits
            </div>
          </div>

          {/* Card 4: New Customers */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">New Customers</span>
              <div className="p-1.5 bg-amber-50 text-amber-700 rounded-md">
                <UserPlus className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {todayNewCount}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              First time buyers
            </div>
          </div>
        </div>
      </section>

      {/* Core Section: What needs your attention? */}
      <AttentionActions />

      {/* Quick Action Shortcuts */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Shopkeeper Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => setIsRecordSaleModalOpen(true)}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 transition-all text-left"
          >
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-md">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Record Sale</div>
              <div className="text-[11px] text-slate-500">Quick bill entry</div>
            </div>
          </button>

          <button
            onClick={() => setIsAddCustomerModalOpen(true)}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 transition-all text-left"
          >
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-md">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">+ WhatsApp Contact</div>
              <div className="text-[11px] text-slate-500">Fast phone & billing</div>
            </div>
          </button>

          <button
            onClick={() => setActiveView('offers')}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 transition-all text-left"
          >
            <div className="p-2 bg-amber-100 text-amber-800 rounded-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Create Offer</div>
              <div className="text-[11px] text-slate-500">Discount or combo</div>
            </div>
          </button>

          <button
            onClick={() => setActiveView('engagement')}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 transition-all text-left"
          >
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-md">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">WhatsApp List</div>
              <div className="text-[11px] text-slate-500">Reminders & news</div>
            </div>
          </button>
        </div>
      </section>

      {/* Two Column Section: Recent Sales & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Recent Sales */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Sales</h3>
              <p className="text-xs text-slate-500">Today & yesterday's transactions</p>
            </div>
            <button
              onClick={() => setActiveView('sales')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSales.map((sale) => (
              <div key={sale.id} className="py-2.5 flex items-center justify-between">
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCustomerId(sale.customerId)}
                      className="font-semibold text-sm text-slate-900 hover:text-emerald-700 transition-colors truncate text-left"
                    >
                      {sale.customerName}
                    </button>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {sale.paymentMethod.replace('paid_', '')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {sale.items.map((it) => `${it.productName} (${it.quantity})`).join(', ')}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-sm text-slate-900 font-mono tabular-nums">
                    {formatIndianCurrency(sale.totalAmount)}
                  </div>
                  <div className="text-[11px] text-slate-400">{sale.billNumber}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsRecordSaleModalOpen(true)}
            className="w-full mt-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            + Record Another Sale
          </button>
        </section>

        {/* Right: Fast Moving & Low Stock Items */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Inventory Monitor</h3>
              <p className="text-xs text-slate-500">Fast moving items & reorder warnings</p>
            </div>
            <button
              onClick={() => setActiveView('products')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>All Products</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-red-200/80 bg-red-50/30"
                >
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                      <span>{prod.name}</span>
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.2 rounded">
                        Low Stock
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      <span>Stock: </span>
                      <span className="font-bold text-slate-800 font-mono">
                        {prod.stock} {prod.unit}
                      </span>
                      <span> · Est. {(prod.estimatedDaysRemaining ?? 0).toFixed(1)} days remaining</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => quickAddStock(prod.id, 20)}
                      title="Quick restock +20 units"
                      className="px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors whitespace-nowrap"
                    >
                      +20
                    </button>
                    <button
                      onClick={() => setSelectedProductId(prod.id)}
                      className="p-1 text-slate-500 hover:text-slate-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 py-3 text-center">
                All inventory levels are currently healthy!
              </div>
            )}

            {/* Fast moving snippet */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Top Fast Moving Items
              </div>
              <div className="grid grid-cols-2 gap-2">
                {fastItems.slice(0, 4).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedProductId(f.id)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 text-left"
                  >
                    <div className="text-xs font-semibold text-slate-900 truncate">{f.name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                      <span>{f.unitsSold} sold</span>
                      <span className="text-emerald-700 font-bold">₹{f.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
