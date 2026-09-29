import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import {
  Tag,
  Plus,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Users,
  ShieldAlert,
  Send,
  Eye,
} from 'lucide-react';

export const OffersView: React.FC = () => {
  const {
    products,
    customers,
    offers,
    createOffer,
    openWhatsAppComposer,
    shopProfile,
  } = useDukaan();

  // Form states
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [discountType, setDiscountType] = useState<string>('10% OFF');
  const [targetAudience, setTargetAudience] = useState<'regular' | 'inactive' | 'related' | 'all'>('regular');
  const [customTitle, setCustomTitle] = useState('Special Festive Savings');
  const [validDays, setValidDays] = useState('7');
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Dynamically generate message preview
  const generatePreviewMessage = () => {
    const prodName = selectedProduct ? selectedProduct.name : 'grocery items';
    if (targetAudience === 'inactive') {
      return `Namaste {customer_name}! 🙏 We missed seeing you at ${shopProfile.shopName}. As a welcome-back gift, enjoy ${discountType} on ${prodName} this week! Reply to reserve your order with free doorstep delivery.`;
    }
    if (targetAudience === 'related') {
      return `Namaste {customer_name}! 🍞 Special combo savings at ${shopProfile.shopName}: Grab ${discountType} on ${prodName} when you order your daily staples today. Fresh batch ready!`;
    }
    return `Namaste {customer_name}! Thank you for being a valued shopper at ${shopProfile.shopName}. Enjoy an exclusive ${discountType} on ${prodName} valid for the next ${validDays} days!`;
  };

  const currentPreview = generatePreviewMessage();

  // Handle offer creation with shopkeeper approval
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(validDays, 10));

    createOffer({
      title: customTitle,
      productId: selectedProductId,
      discountValue: discountType,
      targetAudience,
      message: currentPreview,
      validUntil: expiryDate.toISOString().split('T')[0],
    });

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleLaunchCampaign = (offer: any) => {
    const targetCust =
      offer.targetAudience === 'inactive'
        ? customers.find((c) => c.status === 'inactive') || customers[0]
        : customers[0];

    openWhatsAppComposer({
      customerName: targetCust.name,
      phone: targetCust.phone,
      message: offer.message,
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Offers & WhatsApp Discounts
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate targeted promotional campaigns with mandatory shopkeeper approval
        </p>
      </div>

      {/* Shopkeeper Control Principle Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sm">Strict Shopkeeper Approval Required</span>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            DukaanBoost never gives automatic discounts or deducts margins without your explicit review
            and approval. You decide which products, discount amounts, and customer groups receive each
            offer.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Offer Generator & Active Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Offer Generator Form */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Create New Promotional Offer</span>
            </h2>
            <p className="text-xs text-slate-500">Pick product, discount rate & target audience</p>
          </div>

          <form onSubmit={handleCreateOffer} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campaign Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Weekend Dairy Combo or Welcome Back Savings"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Discount Amount
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value="10% OFF">10% OFF</option>
                  <option value="15% OFF">15% OFF</option>
                  <option value="₹20 OFF">₹20 OFF</option>
                  <option value="₹50 OFF on orders > ₹500">₹50 OFF on orders &gt; ₹500</option>
                  <option value="Buy 2 Get 1 Free">Buy 2 Get 1 Free</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value="regular">🟢 Regular Loyal Customers</option>
                  <option value="inactive">🟡 Inactive Customers (Win-back)</option>
                  <option value="related">🔵 Customers Buying Related Items</option>
                  <option value="all">👥 All Customers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valid Duration
                </label>
                <select
                  value={validDays}
                  onChange={(e) => setValidDays(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
                >
                  <option value="3">3 Days (Weekend Special)</option>
                  <option value="7">7 Days (Full Week)</option>
                  <option value="15">15 Days</option>
                </select>
              </div>
            </div>

            {/* Generated WhatsApp Message Preview */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Generated WhatsApp Message Preview:
              </div>
              <p className="text-xs text-slate-800 italic bg-white p-2.5 rounded border border-slate-200">
                "{currentPreview}"
              </p>
            </div>

            {isSuccess && (
              <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Offer approved & saved! Ready to send to customers.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors"
            >
              Approve & Create Offer Campaign
            </button>
          </form>
        </section>

        {/* Right: Active & Past Campaigns */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-slate-900">Active Offer Campaigns</h2>
              <p className="text-xs text-slate-500">Approved campaigns ready to dispatch via WhatsApp</p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {offers.length} active
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{offer.title}</h3>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span className="font-semibold text-emerald-700">{offer.discountValue}</span>
                      <span>·</span>
                      <span>Product: {offer.productName}</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {offer.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 italic bg-white p-2 rounded border border-slate-200/80">
                  "{offer.message}"
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Valid until: {offer.validUntil}</span>
                  </div>

                  <button
                    onClick={() => handleLaunchCampaign(offer)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
