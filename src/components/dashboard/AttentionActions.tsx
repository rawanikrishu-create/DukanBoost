import React from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { AttentionAction } from '../../types';
import {
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Info,
  UserCheck,
} from 'lucide-react';

export const AttentionActions: React.FC = () => {
  const {
    attentionActions,
    setActiveView,
    setSelectedProductId,
    openWhatsAppComposer,
    customers,
  } = useDukaan();

  const handleAction = (action: AttentionAction) => {
    switch (action.actionType) {
      case 'view_inactive_customers':
        setActiveView('customers');
        break;
      case 'check_stock':
        if (action.targetId) {
          setSelectedProductId(action.targetId);
        } else {
          setActiveView('products');
        }
        break;
      case 'create_offer':
      case 'promote_combo':
        setActiveView('offers');
        break;
      case 'welcome_new':
        const recentNew = customers.find((c) => c.status === 'new');
        if (recentNew) {
          openWhatsAppComposer({
            customerName: recentNew.name,
            phone: recentNew.phone,
            message:
              'Namaste {customer_name}! 🙏 Thank you for visiting {shop_name}. We hope you had a good shopping experience. Please save our number for easy WhatsApp orders & free home delivery!',
          });
        } else {
          setActiveView('customers');
        }
        break;
      default:
        setActiveView('customers');
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'view_inactive_customers':
        return <Users className="w-5 h-5 text-amber-700" />;
      case 'check_stock':
        return <AlertTriangle className="w-5 h-5 text-red-700" />;
      case 'promote_combo':
      case 'create_offer':
        return <Sparkles className="w-5 h-5 text-emerald-700" />;
      case 'welcome_new':
        return <UserCheck className="w-5 h-5 text-blue-700" />;
      default:
        return <Info className="w-5 h-5 text-slate-700" />;
    }
  };

  const getActionStyle = (type: string) => {
    switch (type) {
      case 'view_inactive_customers':
        return 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70';
      case 'check_stock':
        return 'border-red-200 bg-red-50/40 hover:bg-red-50/70';
      case 'promote_combo':
      case 'create_offer':
        return 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70';
      case 'welcome_new':
        return 'border-blue-200 bg-blue-50/40 hover:bg-blue-50/70';
      default:
        return 'border-slate-200 bg-white hover:bg-slate-50';
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">What needs your attention?</h2>
          <p className="text-xs text-slate-500">
            Smart actions calculated directly from your recent sales & customer frequency
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {attentionActions.map((action) => {
          return (
            <div
              key={action.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all shadow-xs ${getActionStyle(
                action.actionType,
              )}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white shadow-2xs">
                      {getActionIcon(action.actionType)}
                    </div>
                    {action.badgeLabel && (
                      <span className="text-[11px] font-semibold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                        {action.badgeLabel}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-600 mb-3">{action.subtitle}</p>

                {/* Grounded Why Section */}
                <div className="bg-white/85 rounded-lg p-2.5 mb-3 border border-slate-200/60">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                    Why take action?
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">{action.why}</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAction(action)}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 rounded-lg shadow-2xs transition-colors"
              >
                <span>{action.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
