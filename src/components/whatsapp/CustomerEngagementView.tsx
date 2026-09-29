import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { formatIndianCurrency, formatMaskedPhone, FREQUENT_COMBOS } from '../../data/mockData';
import {
  MessageSquare,
  Users,
  Sparkles,
  Send,
  Clock,
  HeartHandshake,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const CustomerEngagementView: React.FC = () => {
  const {
    customers,
    products,
    shopProfile,
    openWhatsAppComposer,
    openDirectWhatsAppModal,
    setActiveView,
    inactiveCustomersCount,
    regularCustomersCount,
  } = useDukaan();

  const inactiveList = customers.filter((c) => c.status === 'inactive');
  const regularList = customers.filter((c) => c.status === 'regular');

  // Top combo from catalog
  const topCombo = FREQUENT_COMBOS[0];

  // 1. Customers to Contact (Inactive)
  const handleContactInactive = (customer?: any) => {
    const target = customer || inactiveList[0];
    if (!target) return;

    openWhatsAppComposer({
      customerName: target.name,
      phone: target.phone,
      message: `Namaste {customer_name}! 🙏 We noticed it has been a little while since your last visit to {shop_name}. Fresh stock of your regular grocery staples arrived this morning. We would be happy to pack and deliver them to your doorstep. Reply anytime with your list!`,
    });
  };

  // 2. Regular Customers (Loyalty)
  const handleLoyaltyOffer = (customer?: any) => {
    const target = customer || regularList[0];
    if (!target) return;

    openWhatsAppComposer({
      customerName: target.name,
      phone: target.phone,
      message: `Namaste {customer_name}! Thank you for being one of our most valued regular shoppers at {shop_name}. As a token of our appreciation, please enjoy ₹25 OFF on your next purchase of ₹250 or more this weekend! See you soon.`,
    });
  };

  // 3. Product Promotion (Related Products)
  const handlePromoteProduct = () => {
    const target = regularList[1] || regularList[0];
    if (!target) return;

    openWhatsAppComposer({
      customerName: target.name,
      phone: target.phone,
      message: `Namaste {customer_name}! We know you regularly pick up ${topCombo.productA}. Fresh premium ${topCombo.productB} just arrived today at {shop_name}. Special combo savings: buy both together and save ₹15! Would you like us to hold a pack for you?`,
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Customer Engagement & WhatsApp
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Simple, respectful customer messages that drive repeat visits without feeling like spam
          </p>
        </div>

        <button
          onClick={() => openDirectWhatsAppModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <MessageSquare className="w-4 h-4 stroke-[2.5]" />
          <span>+ Message Any Contact</span>
        </button>
      </div>

      {/* Manual Contact Entry & Autonomous Outreach Quick Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              New Feature
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Manual Contact Outreach & Autonomous Pre-Written Messages
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Need to reach someone not in your catalog or send a quick note to a walk-in shopper?
            Manually enter any name and 10-digit mobile number, choose from ready-made templates
            (Win-Back 10%, Fresh Stock, Order Packed, Bill Reminder), and launch directly on WhatsApp!
          </p>
        </div>

        <button
          onClick={() => openDirectWhatsAppModal()}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
        >
          <Send className="w-3.5 h-3.5 text-emerald-800" />
          <span>Open Message Composer</span>
        </button>
      </div>

      {/* Trust & Transparency Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 text-sm">Direct Shopkeeper-to-Customer Messaging</span>
          <p className="mt-0.5 text-slate-600 leading-relaxed">
            DukaanBoost provides genuine, natural WhatsApp message templates with pre-filled wa.me links.
            Messages open directly in your WhatsApp app or WhatsApp Web, so you remain in 100% control of
            what gets sent to your customers.
          </p>
        </div>
      </div>

      {/* 3 Main Sections from User Brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Section 1: Customers to Contact */}
        <section className="bg-white rounded-xl border border-amber-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <Clock className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Retention
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Customers to Contact
            </h2>
            <p className="text-sm font-semibold text-amber-900 mb-2">
              {inactiveCustomersCount} customers haven't visited recently
            </p>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              These customers usually shop every 10–20 days and have exceeded their typical purchase
              cycle. A friendly reminder recovers lost repeat sales.
            </p>

            {/* Inactive sample list */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Ready to contact:
              </div>
              {inactiveList.slice(0, 3).map((cust) => (
                <div key={cust.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{cust.name}</span>
                  <span className="text-slate-500 text-[11px]">{cust.lastPurchaseRelative}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleContactInactive()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 active:bg-amber-900 rounded-lg shadow-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Create Message</span>
          </button>
        </section>

        {/* Section 2: Regular Customers */}
        <section className="bg-white rounded-xl border border-emerald-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Loyalty
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Regular Customers
            </h2>
            <p className="text-sm font-semibold text-emerald-900 mb-2">
              {regularCustomersCount} customers shop regularly
            </p>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              These loyal shoppers visit every 5–8 days. Reward them with exclusive weekend perks or
              express doorstep delivery appreciation notes.
            </p>

            {/* Regular sample list */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-4 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Top loyal shoppers:
              </div>
              {regularList.slice(0, 3).map((cust) => (
                <div key={cust.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{cust.name}</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {cust.totalOrders} orders
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleLoyaltyOffer()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Loyalty Offer</span>
          </button>
        </section>

        {/* Section 3: Product Promotion */}
        <section className="bg-white rounded-xl border border-blue-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Combo Upsell
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Product Promotion
            </h2>
            <p className="text-sm font-semibold text-blue-900 mb-2">
              8 customers frequently buy related items
            </p>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Target shoppers who regularly buy {topCombo.productA} with special combo savings when
              they also grab {topCombo.productB}.
            </p>

            {/* Product combo card */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-4 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Combo opportunity:
              </div>
              <div className="text-xs font-bold text-slate-800">
                {topCombo.productA} + {topCombo.productB}
              </div>
              <div className="text-[11px] text-slate-500">{topCombo.recommendation}</div>
            </div>
          </div>

          <button
            onClick={handlePromoteProduct}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Promote Product</span>
          </button>
        </section>
      </div>

      {/* Customer Quick Messaging Table */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Quick WhatsApp Outreach</h2>
            <p className="text-xs text-slate-500">Pick any customer to review & customize their message</p>
          </div>
          <button
            onClick={() => setActiveView('customers')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All {customers.length} Customers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {customers.slice(0, 8).map((cust) => (
            <div key={cust.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{cust.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      cust.status === 'regular'
                        ? 'bg-emerald-50 text-emerald-800'
                        : cust.status === 'inactive'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-blue-50 text-blue-800'
                    }`}
                  >
                    {cust.status}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {formatMaskedPhone(cust.phone)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Last purchase: {cust.lastPurchaseRelative} · Orders: {cust.totalOrders} · Favorite:{' '}
                  {cust.frequentlyPurchasedProducts.slice(0, 2).join(', ') || 'Staples'}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    if (cust.status === 'inactive') {
                      handleContactInactive(cust);
                    } else {
                      handleLoyaltyOffer(cust);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
