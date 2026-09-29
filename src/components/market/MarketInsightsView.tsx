import React, { useState } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { MARKET_INSIGHTS_DEMO } from '../../data/mockData';
import {
  TrendingUp,
  MapPin,
  Sparkles,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Store,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const MarketInsightsView: React.FC = () => {
  const { shopProfile } = useDukaan();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [trialToast, setTrialToast] = useState<string | null>(null);

  const demo = MARKET_INSIGHTS_DEMO;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {trialToast && (
        <div className="bg-purple-100 border border-purple-300 text-purple-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold">
          <span>{trialToast}</span>
          <button onClick={() => setTrialToast(null)} className="underline ml-2">Dismiss</button>
        </div>
      )}
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Local Market Insights
            </h1>
            <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
              PRO PREVIEW
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Neighborhood retail demand trends, high-margin category opportunities & local household reach
          </p>
        </div>

        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upgrade to DukaanBoost Pro</span>
        </button>
      </div>

      {/* Honest Data Disclosure Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3 text-xs text-purple-900">
        <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sm">Aggregated Sample Market Data</span>
          <p className="mt-0.5 text-purple-800 leading-relaxed">
            Market insights shown below represent sample aggregated neighborhood trends for{' '}
            <span className="font-semibold">{shopProfile.location}</span>. DukaanBoost does not use
            private personal browsing data. In production, this module connects to authorized public
            trade indexes, wholesale FMCG distributors, and aggregated regional pincode demand feeds.
          </p>
        </div>
      </div>

      {/* Local Pin / Area Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
            <MapPin className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Selected Trade Area</div>
            <div className="text-sm font-bold text-slate-900">{shopProfile.location}</div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400">Reach Radius: </span>
          <span className="text-xs font-bold text-slate-800">2.0 km</span>
        </div>
      </div>

      {/* 3 Main Sections from User Brief */}
      <div className="space-y-6">
        {/* 1. Nearby Demand */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Nearby Category Demand</h2>
              <p className="text-xs text-slate-500">Categories showing rapid search & buying growth in your area</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              High Neighborhood Interest
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {demo.nearbyDemand.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">{item.category}</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                      {item.growth}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.trendText}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-purple-900 bg-purple-50 p-2 rounded">
                  <span className="font-semibold">Action hint: </span>
                  {item.actionableHint}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Product Opportunities */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Product Opportunities</h2>
              <p className="text-xs text-slate-500">
                Products related to your {shopProfile.category} store with low local competitor stock
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {demo.productOpportunities.map((op, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
              >
                <div className="flex items-start justify-between gap-1">
                  <h3 className="font-bold text-sm text-slate-900">{op.name}</h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {op.demandLevel} Demand
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>
                    <span className="font-medium text-slate-700">Gross Margin: </span>
                    <span className="text-emerald-800 font-bold font-mono">{op.marginPotential}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700">Local Competition: </span>
                    <span>{op.competitorStock}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 pt-1 border-t border-slate-100">{op.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Local Promotion Reach */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Local Promotion & Audience Reach</h2>
              <p className="text-xs text-slate-500">Estimated households in your immediate catchment radius</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Estimated Households</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1">
                {demo.localReachStats.potentialHouseholdsNearby}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Within 2.0 km radius</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Avg Monthly Spend</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono mt-1">
                {demo.localReachStats.avgMonthlyGrocerySpend}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Per residential family</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">WhatsApp Reachable</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-800 font-mono mt-1">
                {demo.localReachStats.reachableViaWhatsApp}
              </div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Direct phone shoppers</div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-medium">Projected Revenue Lift</div>
              <div className="text-base sm:text-lg font-bold text-purple-900 font-mono mt-1">
                {demo.localReachStats.projectedMonthlyLift}
              </div>
              <div className="text-[10px] text-purple-700 mt-0.5">With repeat retention</div>
            </div>
          </div>
        </section>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-slate-900 text-lg">DukaanBoost Pro</h3>
              </div>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Unlock live aggregated FMCG distributor feeds, wholesale price comparisons, and
              verified residential pin-code buying trends for your retail shop.
            </p>

            <div className="space-y-2 text-xs text-slate-700 bg-purple-50 p-3.5 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Real-time wholesale stock price fluctuation alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Automated weekly WhatsApp catalog broadcasts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Full GST bill generation & multi-device sync</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <div className="text-2xl font-bold text-slate-900 font-mono">
                ₹399 <span className="text-xs font-normal text-slate-500">/ month</span>
              </div>
              <p className="text-[11px] text-slate-400">Cancel anytime. 14-day free trial included.</p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setTrialToast('🎉 DukaanBoost Pro 14-day free trial activated! All premium insights unlocked.');
                  setIsUpgradeModalOpen(false);
                  setTimeout(() => setTrialToast(null), 5000);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm"
              >
                Start 14-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
