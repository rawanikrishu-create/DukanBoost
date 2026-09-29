import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { X, PackagePlus, Tag, IndianRupee, Layers } from 'lucide-react';

export const AddProductModal: React.FC = () => {
  const { isAddProductModalOpen, setIsAddProductModalOpen, addProduct, shopProfile } = useDukaan();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(
    shopProfile.category === 'Medical'
      ? 'Pain Relief'
      : shopProfile.category === 'Electronics'
      ? 'Cables & Accessories'
      : 'Dairy & Eggs',
  );
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('pack');
  const [error, setError] = useState('');

  if (!isAddProductModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a product name');
      return;
    }
    const numPrice = parseFloat(price);
    const numStock = parseInt(stock, 10);

    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please enter a valid selling price');
      return;
    }
    if (isNaN(numStock) || numStock < 0) {
      setError('Please enter initial stock quantity');
      return;
    }

    addProduct({
      name: name.trim(),
      category: category.trim(),
      price: numPrice,
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      stock: numStock,
      unit: unit.trim() || 'pack',
    });

    setName('');
    setPrice('');
    setCostPrice('');
    setStock('');
    setError('');
    setIsAddProductModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Add New Product</h3>
              <p className="text-xs text-slate-500">Track stock, sales velocity & reorder alerts</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddProductModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
          {error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Amul Taaza Milk 500ml or Dolo 650mg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Dairy, Snacks"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit of Measure
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="pack">pack</option>
                <option value="packet">packet</option>
                <option value="bottle">bottle</option>
                <option value="kg">kg</option>
                <option value="loaf">loaf</option>
                <option value="strip">strip</option>
                <option value="pcs">pcs</option>
                <option value="box">box</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selling Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-semibold text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="28"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.5"
                  required
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Stock *
              </label>
              <input
                type="number"
                placeholder="25"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Wholesale / Purchase Cost (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-semibold text-xs">
                ₹
              </span>
              <input
                type="number"
                placeholder="24"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                min="0"
                step="0.5"
                className="w-full pl-7 pr-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
