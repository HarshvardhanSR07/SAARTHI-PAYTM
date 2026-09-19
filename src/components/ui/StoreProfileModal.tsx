'use client';

import React from 'react';
import { STORE_PROFILE } from '@/lib/mockData';
import { X, Store, Phone, MapPin, QrCode, ShieldCheck, Copy, Check } from 'lucide-react';
import { soundService } from '@/lib/soundEffects';

interface StoreProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQR: () => void;
}

export const StoreProfileModal: React.FC<StoreProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenQR,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(STORE_PROFILE.upiId);
    setCopied(true);
    soundService.playSuccessChime();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-[#bcc8d0]/40 relative">
        {/* Header */}
        <div className="bg-[#0043cf] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00b9f1] text-[#0043cf] flex items-center justify-center font-black text-xl shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold leading-tight truncate">
                  {STORE_PROFILE.storeName}
                </h3>
              </div>
              <span className="text-xs text-[#00b9f1] font-semibold">
                Paytm Merchant Verified
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Details */}
          <div className="bg-[#f7f9fc] p-3.5 rounded-2xl border border-[#e0e3e6] flex flex-col gap-2.5 text-xs text-[#3d484f]">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0043cf]" />
              <span className="font-semibold text-[#191c1e]">{STORE_PROFILE.phone}</span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#0043cf] shrink-0 mt-0.5" />
              <span>{STORE_PROFILE.address}</span>
            </div>

            <div className="flex items-center justify-between border-t border-[#e0e3e6] pt-2">
              <span className="text-[#6d7980]">UPI ID:</span>
              <button
                onClick={handleCopyUPI}
                className="flex items-center gap-1 font-mono font-bold text-[#0043cf] hover:text-[#0043cf]"
              >
                {STORE_PROFILE.upiId}
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#00a86b]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#6d7980]" />
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenQR();
              }}
              className="py-2.5 px-3 rounded-xl bg-[#0043cf] hover:bg-[#0043cf] text-white text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-4 h-4" /> Open Shop QR
            </button>

            <button
              onClick={() => {
                soundService.playPaytmSoundboxChime();
              }}
              className="py-2.5 px-3 rounded-xl bg-[#eafaf1] border border-[#c4f0db] text-[#006b47] hover:bg-[#c4f0db]/50 text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              Soundbox Chime
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
