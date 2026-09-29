import React, { useState, useEffect } from 'react';
import { useDukaan } from '../../context/DukaanContext';
import { formatMaskedPhone } from '../../data/mockData';
import {
  X,
  MessageSquare,
  Send,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  Store,
  Info,
} from 'lucide-react';

export const WhatsAppPreviewModal: React.FC = () => {
  const { isWhatsAppModalOpen, whatsAppData, closeWhatsAppComposer, shopProfile } = useDukaan();

  const [editableMessage, setEditableMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (whatsAppData) {
      setEditableMessage(whatsAppData.message);
      setCopied(false);
    }
  }, [whatsAppData]);

  if (!isWhatsAppModalOpen || !whatsAppData) return null;

  // Clean phone number for wa.me link
  const digitsOnly = whatsAppData.phone.replace(/[^0-9]/g, '');
  const cleanPhone = digitsOnly.length >= 10 ? `91${digitsOnly.slice(-10)}` : '919800000000';

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(editableMessage);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">WhatsApp Direct Message</h3>
              <p className="text-xs text-emerald-100">
                To: {whatsAppData.customerName} ({formatMaskedPhone(whatsAppData.phone)})
              </p>
            </div>
          </div>
          <button
            onClick={closeWhatsAppComposer}
            className="p-1.5 text-emerald-100 hover:text-white bg-emerald-800/60 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* WhatsApp Chat Simulation Frame */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              WhatsApp Message Preview
            </div>
            <div className="bg-[#E5DDD5] p-4 rounded-xl border border-slate-300 relative overflow-hidden">
              {/* Background WhatsApp Doodle styling */}
              <div className="flex justify-end">
                <div className="bg-[#DCF8C6] rounded-xl rounded-tr-none p-3 shadow-xs max-w-[88%] text-xs text-slate-900 space-y-1.5 border border-[#c4eab0]">
                  <div className="font-semibold text-[11px] text-emerald-900 flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    <span>{shopProfile.shopName}</span>
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed">{editableMessage}</div>
                  <div className="text-right text-[10px] text-slate-400 font-mono">
                    10:30 AM · Read ✓✓
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editable text editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">Edit Message Before Sending</label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              value={editableMessage}
              onChange={(e) => setEditableMessage(e.target.value)}
              rows={4}
              className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
            />
          </div>

          {/* Privacy & Protocol Note */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Privacy & Consent: </span>
              DukaanBoost generates direct 1-to-1 wa.me links to the customer's phone number without
              spamming or exposing contact lists to third parties.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={closeWhatsAppComposer}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
