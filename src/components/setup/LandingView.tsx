import React from 'react';
import { useDukaan } from '../../context/DukaanContext';
import {
  Store,
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface LandingViewProps {
  onEnterApp: () => void;
  onOpenSetup: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterApp, onOpenSetup }) => {
  const { resetToDemoData } = useDukaan();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar following Top Bar Contract */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">DukaanBoost</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#benefits" className="hover:text-slate-900 transition-colors">
              Why DukaanBoost
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#categories" className="hover:text-slate-900 transition-colors">
              Supported Retailers
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                resetToDemoData('Grocery');
                onEnterApp();
              }}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Demo Store
            </button>
            <button
              onClick={onOpenSetup}
              className="px-4 py-1.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
            >
              Setup Shop
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Simple Digital Growth Assistant for Indian Retailers</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          Turn everyday shop sales into repeat customers & higher profits.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          No complicated data analytics or AI tech talk. Just clear daily answers to:
          <span className="font-semibold text-slate-800"> "What should I do today to improve my dukaan?"</span>
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              resetToDemoData('Grocery');
              onEnterApp();
            }}
            className="w-full sm:w-auto px-7 py-3 text-sm sm:text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Open Demo Dukaan (Instant)</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={onOpenSetup}
            className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs transition-colors"
          >
            Register My Shop (Free)
          </button>
        </div>

        {/* Honest Trust Indicator */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pre-loaded with 25 Indian customers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Direct WhatsApp 1-to-1 links</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% private customer data</span>
          </div>
        </div>
      </section>

      {/* 3 Core Value Pillars */}
      <section id="benefits" className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Designed for Busy Indian Shopkeepers
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Practical growth tools without sitting in front of a computer for hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Understand Repeat Customers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Know who visits every 7 days and who has stopped coming. Reach out right when they are
                due for their routine staples before they go to a supermarket.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Stop Morning Stockouts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates daily sales velocity and alerts you when fast-moving butter, milk or medicine
                has only 2 days of inventory remaining.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Personalized WhatsApp Outreach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send respectful, pre-filled WhatsApp bills and combo discounts to your shoppers with one
                tap. No technical setup required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Business Categories */}
      <section id="categories" className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Works for Every Neighborhood Business
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Switch effortlessly between retail formats to test tailored recommendations
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { name: 'Grocery & Kirana', icon: '🛒', desc: 'Perishables, daily staples & combos' },
            { name: 'Medical Store', icon: '💊', desc: 'Repeat refills & healthcare products' },
            { name: 'Electronics', icon: '📱', desc: 'Accessories, chargers & warranty upsells' },
            { name: 'Textile & Clothing', icon: '👕', desc: 'Festive collections & repeat buyers' },
            { name: 'General Store', icon: '🏬', desc: 'FMCG, household supplies & snacks' },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-white text-center space-y-1.5 shadow-2xs"
            >
              <div className="text-2xl">{cat.icon}</div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">{cat.name}</h4>
              <p className="text-[11px] text-slate-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-10 bg-emerald-800 text-white text-center px-4">
        <h3 className="text-xl sm:text-2xl font-bold">Ready to see how DukaanBoost works?</h3>
        <p className="text-xs text-emerald-100 mt-1 max-w-md mx-auto">
          Explore Sharma General Store's live demo dataset with realistic customers, orders and WhatsApp tools.
        </p>
        <button
          onClick={() => {
            resetToDemoData('Grocery');
            onEnterApp();
          }}
          className="mt-5 px-6 py-2.5 text-xs sm:text-sm font-bold text-emerald-900 bg-white hover:bg-emerald-50 rounded-xl shadow-md transition-colors"
        >
          Launch Full Working Prototype →
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
        DukaanBoost Prototype · Simple Growth Assistant for Indian Small Businesses
      </footer>
    </div>
  );
};
