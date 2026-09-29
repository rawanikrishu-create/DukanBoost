import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { formatIndianCurrency } from '../../data/mockData';
import {
  X,
  Package,
  TrendingUp,
  Clock,
  Sparkles,
  Plus,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Tag,
} from 'lucide-react';

export const ProductInsightModal: React.FC = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    products,
    updateProductStock,
    quickAddStock,
    setActiveView,
  } = useDukaan();

  const [customStock, setCustomStock] = useState<string>('');
  const [showStockSuccess, setShowStockSuccess] = useState(false);

  if (!selectedProductId) return null;

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const totalRevenue = product.unitsSold * product.price;

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'fast_moving':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Fast Moving
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Normal Velocity
          </span>
        );
      case 'slow_moving':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Slow Moving
          </span>
        );
      default:
        return null;
    }
  };

  // Grounded realistic recommendation as requested in Section 9
  const getRecommendation = () => {
    if (product.status === 'fast_moving') {
      const daysLeft = typeof product.estimatedDaysRemaining === 'number' ? product.estimatedDaysRemaining : 2;
      const dailyAvg = typeof product.dailyAverageSales === 'number' ? product.dailyAverageSales : 1.5;
      if (daysLeft <= 2) {
        return {
          title: 'Critical Restock Needed',
          body: `Based on recent sales velocity, ${product.name} is one of your fastest-selling products with an average of ${dailyAvg.toFixed(1)} ${product.unit} sold daily. Stock may run out in ~${daysLeft.toFixed(1)} days. Consider increasing your next wholesale order by 25–40% to prevent stockouts.`,
          alertType: 'warning',
        };
      }
      return {
        title: 'Strong Performer',
        body: `Based on sales records, ${product.name} has consistent high repeat turnover (${product.unitsSold} units sold). Consider featuring it near checkout or pairing it in a combo offer with related items.`,
        alertType: 'positive',
      };
    }

    if (product.status === 'slow_moving') {
      return {
        title: 'Possible Promotion Opportunity',
        body: `This product has had low sales recently (${product.unitsSold} units total) with ${product.stock} ${product.unit} occupying store shelf space. Consider a small 10% promotional offer or bundling with a fast-moving item to clear stock faster.`,
        alertType: 'neutral',
      };
    }

    const estDays = typeof product.estimatedDaysRemaining === 'number' ? product.estimatedDaysRemaining : 10;
    return {
      title: 'Stable Inventory',
      body: `Based on recent sales, ${product.name} maintains a steady sales cycle with approximately ${estDays.toFixed(0)} days of remaining inventory. Current stock levels appear balanced.`,
      alertType: 'neutral',
    };
  };

  const recommendation = getRecommendation();

  const handleCustomRestock = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(customStock, 10);
    if (!isNaN(qty) && qty > 0) {
      quickAddStock(product.id, qty);
      setCustomStock('');
      setShowStockSuccess(true);
      setTimeout(() => setShowStockSuccess(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{product.category}</span>
              <span>·</span>
              <span>Selling Price: ₹{product.price} / {product.unit}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedProductId(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Status and Performance Metric Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Product Performance
              </h3>
              {getStatusBadge(product.status)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Units Sold</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {product.unitsSold}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Revenue Generated</div>
                <div className="text-lg font-bold text-emerald-800 font-mono tabular-nums">
                  {formatIndianCurrency(totalRevenue)}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Current Stock</div>
                <div
                  className={`text-lg font-bold font-mono tabular-nums ${
                    product.stock <= product.minStockThreshold ? 'text-red-700' : 'text-slate-900'
                  }`}
                >
                  {product.stock} {product.unit}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Avg. Daily Sales</div>
                <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {(product.dailyAverageSales ?? 1.5).toFixed(1)} / day
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 col-span-2 sm:col-span-2">
                <div className="text-[11px] text-slate-500">Est. Days of Stock Remaining</div>
                <div
                  className={`text-lg font-bold font-mono tabular-nums ${
                    (product.estimatedDaysRemaining ?? 10) <= 3 ? 'text-red-700' : 'text-slate-900'
                  }`}
                >
                  {(product.estimatedDaysRemaining ?? 10).toFixed(1)} days
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Box */}
          <div
            className={`p-4 rounded-xl border ${
              recommendation.alertType === 'warning'
                ? 'bg-red-50/50 border-red-200 text-red-900'
                : recommendation.alertType === 'positive'
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Recommendation: {recommendation.title}
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{recommendation.body}</p>
          </div>

          {/* Quick Restock Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quick Restock Quantity
              </h4>
              {showStockSuccess && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Stock updated!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  quickAddStock(product.id, 10);
                  setShowStockSuccess(true);
                  setTimeout(() => setShowStockSuccess(false), 2000);
                }}
                className="flex-1 py-1.5 px-3 text-xs font-semibold bg-white border border-slate-300 hover:border-emerald-500 rounded-lg shadow-2xs"
              >
                +10 {product.unit}
              </button>
              <button
                type="button"
                onClick={() => {
                  quickAddStock(product.id, 25);
                  setShowStockSuccess(true);
                  setTimeout(() => setShowStockSuccess(false), 2000);
                }}
                className="flex-1 py-1.5 px-3 text-xs font-semibold bg-white border border-slate-300 hover:border-emerald-500 rounded-lg shadow-2xs"
              >
                +25 {product.unit}
              </button>
              <button
                type="button"
                onClick={() => {
                  quickAddStock(product.id, 50);
                  setShowStockSuccess(true);
                  setTimeout(() => setShowStockSuccess(false), 2000);
                }}
                className="flex-1 py-1.5 px-3 text-xs font-semibold bg-white border border-slate-300 hover:border-emerald-500 rounded-lg shadow-2xs"
              >
                +50 {product.unit}
              </button>
            </div>

            <form onSubmit={handleCustomRestock} className="flex items-center gap-2 pt-1">
              <input
                type="number"
                placeholder="Custom quantity..."
                value={customStock}
                onChange={(e) => setCustomStock(e.target.value)}
                min="1"
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
              >
                Add Units
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedProductId(null);
              setActiveView('offers');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white border border-slate-300 rounded-lg"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Create Offer for this Product</span>
          </button>

          <button
            onClick={() => setSelectedProductId(null)}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
