import React, { useState, useMemo } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { ProductStatus } from '../../types';
import { formatIndianCurrency } from '../../data/mockData';
import {
  Package,
  Plus,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const {
    products,
    setSelectedProductId,
    setIsAddProductModalOpen,
    quickAddStock,
    lowStockProducts,
    fastMovingProducts,
    slowMovingProducts,
  } = useDukaan();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus | 'low_stock'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Categories list from current catalog
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === 'low_stock') {
        matchesStatus = prod.stock <= prod.minStockThreshold || prod.estimatedDaysRemaining <= 3;
      } else if (statusFilter !== 'all') {
        matchesStatus = prod.status === statusFilter;
      }

      const matchesCategory = categoryFilter === 'all' || prod.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchQuery, statusFilter, categoryFilter]);

  const getStatusBadge = (status: ProductStatus, stock: number, minStock: number) => {
    if (stock <= minStock) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Low Stock
        </span>
      );
    }
    switch (status) {
      case 'fast_moving':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Fast Moving
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Normal
          </span>
        );
      case 'slow_moving':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Slow Moving
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Inventory & Products
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify fast-moving staples, track units sold & avoid morning stockouts
          </p>
        </div>

        <button
          onClick={() => setIsAddProductModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-500">Total Catalog Items</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {products.length}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('fast_moving')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'fast_moving'
              ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-emerald-800">🟢 Fast Moving</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {fastMovingProducts.length}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('low_stock')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'low_stock'
              ? 'border-red-600 bg-red-50/50 shadow-2xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-red-800">⚠️ Low Stock Alerts</div>
          <div className="text-xl font-bold text-red-700 font-mono tabular-nums">
            {lowStockProducts.length}
          </div>
        </button>

        <button
          onClick={() => setStatusFilter('slow_moving')}
          className={`p-3 rounded-xl border text-left transition-all ${
            statusFilter === 'slow_moving'
              ? 'border-amber-600 bg-amber-50/50 shadow-2xs'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div className="text-[11px] font-medium text-amber-800">🔴 Slow Moving</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {slowMovingProducts.length}
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Category selector */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs font-medium bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-3 py-2 w-full sm:w-auto"
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto shrink-0 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('fast_moving')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'fast_moving'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fast
          </button>
          <button
            onClick={() => setStatusFilter('low_stock')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'low_stock' ? 'bg-white text-red-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setStatusFilter('slow_moving')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              statusFilter === 'slow_moving'
                ? 'bg-white text-amber-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Slow
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Selling Price</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Units Sold</th>
              <th className="py-3 px-4">Sales Status</th>
              <th className="py-3 px-4">Days Left</th>
              <th className="py-3 px-4 text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedProductId(prod.id)}
                >
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                      {prod.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{prod.category}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    ₹{prod.price} <span className="text-slate-400 font-normal">/ {prod.unit}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold ${
                        prod.stock <= prod.minStockThreshold ? 'text-red-700' : 'text-slate-800'
                      }`}
                    >
                      {prod.stock} {prod.unit}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    {prod.unitsSold}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(prod.status, prod.stock, prod.minStockThreshold)}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {(prod.estimatedDaysRemaining ?? 10).toFixed(1)} days
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => quickAddStock(prod.id, 10)}
                        title="Add 10 units"
                        className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => quickAddStock(prod.id, 25)}
                        title="Add 25 units"
                        className="px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded"
                      >
                        +25
                      </button>
                      <button
                        onClick={() => setSelectedProductId(prod.id)}
                        className="p-1 text-slate-400 hover:text-slate-700"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No products found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => setSelectedProductId(prod.id)}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2.5 active:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{prod.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {prod.category} · ₹{prod.price} / {prod.unit}
                  </div>
                </div>
                {getStatusBadge(prod.status, prod.stock, prod.minStockThreshold)}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>
                  <div className="text-slate-400 text-[10px]">Stock</div>
                  <div
                    className={`font-mono font-bold ${
                      prod.stock <= prod.minStockThreshold ? 'text-red-700' : 'text-slate-800'
                    }`}
                  >
                    {prod.stock} {prod.unit}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Sold</div>
                  <div className="font-mono font-bold text-slate-800">{prod.unitsSold}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Remaining</div>
                  <div className="font-mono font-bold text-slate-800">
                    ~{(prod.estimatedDaysRemaining ?? 10).toFixed(0)} days
                  </div>
                </div>
              </div>

              <div
                className="flex items-center justify-between pt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProductId(prod.id)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  View Performance Insights →
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">Restock:</span>
                  <button
                    onClick={() => quickAddStock(prod.id, 10)}
                    className="px-2 py-1 text-xs font-semibold bg-slate-100 rounded"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => quickAddStock(prod.id, 25)}
                    className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded"
                  >
                    +25
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
};
