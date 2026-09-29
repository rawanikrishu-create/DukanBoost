import React from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { formatIndianCurrency, FREQUENT_COMBOS } from '../../data/mockData';
import {
  Users,
  Package,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const {
    customers,
    products,
    sales,
    todaySalesTotal,
    weeklySalesTotal,
    monthlySalesTotal,
    regularCustomersCount,
    inactiveCustomersCount,
    newCustomersCount,
    fastMovingProducts,
    slowMovingProducts,
    lowStockProducts,
    setSelectedProductId,
    setSelectedCustomerId,
    setActiveView,
  } = useDukaan();

  // Customer retention rate %
  const totalCust = customers.length;
  const regularPct = totalCust > 0 ? Math.round((regularCustomersCount / totalCust) * 100) : 0;
  const inactivePct = totalCust > 0 ? Math.round((inactiveCustomersCount / totalCust) * 100) : 0;
  const newPct = totalCust > 0 ? Math.round((newCustomersCount / totalCust) * 100) : 0;

  // Payment breakdown
  const upiTotal = sales
    .filter((s) => s.paymentMethod === 'paid_upi')
    .reduce((acc, s) => acc + s.totalAmount, 0);
  const cashTotal = sales
    .filter((s) => s.paymentMethod === 'paid_cash')
    .reduce((acc, s) => acc + s.totalAmount, 0);
  const otherTotal = sales
    .filter((s) => s.paymentMethod !== 'paid_upi' && s.paymentMethod !== 'paid_cash')
    .reduce((acc, s) => acc + s.totalAmount, 0);
  const allSalesTotal = upiTotal + cashTotal + otherTotal;
  const upiPct = allSalesTotal > 0 ? Math.round((upiTotal / allSalesTotal) * 100) : 55;
  const cashPct = allSalesTotal > 0 ? Math.round((cashTotal / allSalesTotal) * 100) : 40;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Business Insights
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Simple, practical numbers designed for small business shopkeepers — no complicated charts
        </p>
      </div>

      {/* 1. Customer Insights Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Customer Insights</h2>
              <p className="text-xs text-slate-500">Visit frequency & repeat loyalty health</p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('customers')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Manage Customers →
          </button>
        </div>

        {/* Breakdown bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Customer Retention Breakdown ({totalCust} Total)</span>
            <span className="font-semibold text-emerald-800">{regularPct}% Regular Habitual</span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${regularPct}%` }}
              className="bg-emerald-600 h-full"
              title={`Regular: ${regularCustomersCount}`}
            />
            <div
              style={{ width: `${inactivePct}%` }}
              className="bg-amber-500 h-full"
              title={`Inactive: ${inactiveCustomersCount}`}
            />
            <div
              style={{ width: `${newPct}%` }}
              className="bg-blue-500 h-full"
              title={`New: ${newCustomersCount}`}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-slate-700 font-medium">Regular: {regularCustomersCount} ({regularPct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-700 font-medium">Inactive: {inactiveCustomersCount} ({inactivePct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-700 font-medium">New: {newCustomersCount} ({newPct}%)</span>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500">Returning Customers</div>
            <div className="text-xl font-bold text-emerald-800 font-mono tabular-nums">
              {regularCustomersCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Shop every 5–8 days</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500">New This Month</div>
            <div className="text-xl font-bold text-blue-800 font-mono tabular-nums">
              {newCustomersCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Welcomed with note</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500">Inactive Overdue</div>
            <div className="text-xl font-bold text-amber-700 font-mono tabular-nums">
              {inactiveCustomersCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">&gt; 15 days without visit</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500">Avg. Store Visit Cycle</div>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              7.4 days
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Routine household refills</div>
          </div>
        </div>
      </section>

      {/* 2. Product & Inventory Insights Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Product Insights</h2>
              <p className="text-xs text-slate-500">Velocity, dead stock alerts & popular combinations</p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('products')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Inventory Table →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Best-selling */}
          <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200">
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
              Top Best-Selling Items
            </div>
            <div className="space-y-2">
              {fastMovingProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-900 truncate max-w-[140px]">
                    {p.name}
                  </span>
                  <span className="font-mono text-emerald-800 font-bold">{p.unitsSold} sold</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low-stock warnings */}
          <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200">
            <div className="text-xs font-bold text-red-900 uppercase tracking-wider mb-2">
              Low-Stock Warnings
            </div>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-900 truncate max-w-[140px]">
                    {p.name}
                  </span>
                  <span className="font-mono text-red-700 font-bold">
                    {p.stock} {p.unit} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Slow-moving items */}
          <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Slow-Moving Products
            </div>
            <div className="space-y-2">
              {slowMovingProducts.slice(0, 3).map((p) => (
                <div key={p.id} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-900 truncate max-w-[140px]">
                    {p.name}
                  </span>
                  <span className="font-mono text-amber-800 font-bold">{p.unitsSold} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frequently Purchased Combinations (Affinity) */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Frequently Purchased Together (Combo Opportunities)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FREQUENT_COMBOS.map((combo, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>{combo.productA} + {combo.productB}</span>
                  <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {combo.frequency} orders
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{combo.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sales Insights Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Sales & Payment Insights</h2>
              <p className="text-xs text-slate-500">Revenue periods & cash vs UPI ratio</p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('sales')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Sales Ledger →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Today's Sales (Live)</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {formatIndianCurrency(todaySalesTotal)}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1">Daily target: ₹2,500</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Weekly Sales (Past 7 Days)</div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {formatIndianCurrency(weeklySalesTotal)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Consistent weekly rhythm</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Projected Monthly Sales</div>
            <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums mt-1">
              {formatIndianCurrency(monthlySalesTotal)}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1">+12% estimated growth</div>
          </div>
        </div>

        {/* UPI vs Cash Breakdown */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between text-xs text-slate-700 font-medium">
            <span>Payment Modes: UPI vs Cash Breakdown</span>
            <span>UPI: {upiPct}% · Cash: {cashPct}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
            <div style={{ width: `${upiPct}%` }} className="bg-emerald-600 h-full" />
            <div style={{ width: `${cashPct}%` }} className="bg-blue-600 h-full" />
          </div>
          <div className="text-[11px] text-slate-500">
            62% of customers paying via UPI also accept WhatsApp digital bills and repeat offers
            readily.
          </div>
        </div>
      </section>
    </div>
  );
};
