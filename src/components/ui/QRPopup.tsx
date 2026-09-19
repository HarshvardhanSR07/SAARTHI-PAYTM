'use client';

import React from 'react';
import { X, Download, Share2, Volume2, CheckCircle } from 'lucide-react';
import { STORE_PROFILE } from '@/lib/mockData';
import { soundService } from '@/lib/soundEffects';

interface QRPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRPopup: React.FC<QRPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSimulatePayment = (amount: number) => {
    soundService.playPaytmSoundboxChime();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-[#bcc8d0]/40 relative">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#0043cf] via-[#0043cf] to-[#0043cf] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 mb-1">
            <span className="text-[12px] font-black tracking-widest text-white uppercase">
              PAYTM
            </span>
            <span className="text-[12px] font-extrabold text-[#00b9f1]">
              ALL-IN-ONE QR
            </span>
          </div>

          <h3 className="text-lg font-bold truncate">{STORE_PROFILE.storeName}</h3>
          <p className="text-xs text-white/80 font-mono mt-0.5">{STORE_PROFILE.upiId}</p>
        </div>

        {/* QR Code Container */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* QR Graphic with Paytm center logo */}
          <div className="p-4 bg-white border-2 border-[#0043cf]/30 rounded-2xl shadow-md relative group">
            {/* Simulated Clean SVG QR Code */}
            <svg
              className="w-52 h-52"
              viewBox="0 0 100 100"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Top-Left Finder */}
              <rect x="5" y="5" width="28" height="28" rx="4" fill="#0043cf" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
              <rect x="13" y="13" width="12" height="12" rx="2" fill="#0043cf" />

              {/* Outer Top-Right Finder */}
              <rect x="67" y="5" width="28" height="28" rx="4" fill="#0043cf" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
              <rect x="75" y="13" width="12" height="12" rx="2" fill="#0043cf" />

              {/* Outer Bottom-Left Finder */}
              <rect x="5" y="67" width="28" height="28" rx="4" fill="#0043cf" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
              <rect x="13" y="75" width="12" height="12" rx="2" fill="#0043cf" />

              {/* QR Data Matrix Patterns */}
              <rect x="38" y="8" width="5" height="5" fill="#191c1e" />
              <rect x="48" y="8" width="5" height="5" fill="#191c1e" />
              <rect x="58" y="8" width="5" height="5" fill="#191c1e" />

              <rect x="38" y="18" width="5" height="5" fill="#191c1e" />
              <rect x="48" y="18" width="5" height="5" fill="#191c1e" />

              <rect x="38" y="28" width="5" height="5" fill="#191c1e" />
              <rect x="58" y="28" width="5" height="5" fill="#191c1e" />

              <rect x="8" y="38" width="5" height="5" fill="#191c1e" />
              <rect x="18" y="38" width="5" height="5" fill="#191c1e" />
              <rect x="28" y="38" width="5" height="5" fill="#191c1e" />
              <rect x="38" y="38" width="24" height="24" rx="4" fill="#00b9f1" />
              <rect x="68" y="38" width="5" height="5" fill="#191c1e" />
              <rect x="78" y="38" width="5" height="5" fill="#191c1e" />
              <rect x="88" y="38" width="5" height="5" fill="#191c1e" />

              <rect x="8" y="48" width="5" height="5" fill="#191c1e" />
              <rect x="28" y="48" width="5" height="5" fill="#191c1e" />
              <rect x="68" y="48" width="5" height="5" fill="#191c1e" />
              <rect x="88" y="48" width="5" height="5" fill="#191c1e" />

              <rect x="8" y="58" width="5" height="5" fill="#191c1e" />
              <rect x="18" y="58" width="5" height="5" fill="#191c1e" />
              <rect x="68" y="58" width="5" height="5" fill="#191c1e" />
              <rect x="78" y="58" width="5" height="5" fill="#191c1e" />

              <rect x="38" y="68" width="5" height="5" fill="#191c1e" />
              <rect x="48" y="68" width="5" height="5" fill="#191c1e" />
              <rect x="58" y="68" width="5" height="5" fill="#191c1e" />
              <rect x="68" y="68" width="5" height="5" fill="#191c1e" />
              <rect x="88" y="68" width="5" height="5" fill="#191c1e" />

              <rect x="38" y="78" width="5" height="5" fill="#191c1e" />
              <rect x="58" y="78" width="5" height="5" fill="#191c1e" />
              <rect x="78" y="78" width="5" height="5" fill="#191c1e" />

              <rect x="38" y="88" width="5" height="5" fill="#191c1e" />
              <rect x="48" y="88" width="5" height="5" fill="#191c1e" />
              <rect x="68" y="88" width="5" height="5" fill="#191c1e" />
              <rect x="88" y="88" width="5" height="5" fill="#191c1e" />
            </svg>

            {/* Center Logo Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center border border-[#bcc8d0]">
                <span className="text-[11px] font-black text-[#0043cf]">PAYTM</span>
              </div>
            </div>
          </div>

          {/* Supported UPI Apps */}
          <div className="flex items-center justify-center gap-2 mt-4 text-[12px] font-medium text-[#3d484f]">
            <span>Accepted Here:</span>
            <span className="font-bold text-[#0043cf]">Paytm</span> •
            <span className="font-bold text-[#0043cf]">GPay</span> •
            <span className="font-bold text-[#425ba4]">PhonePe</span> •
            <span className="font-bold text-[#191c1e]">BHIM</span>
          </div>

          {/* Soundbox Test Trigger */}
          <div className="w-full mt-4 p-3 bg-[#eafaf1] border border-[#c4f0db] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#006b47]" />
              <span className="text-xs font-semibold text-[#006b47]">Test Soundbox Alert</span>
            </div>
            <button
              onClick={() => handleSimulatePayment(150)}
              className="px-2.5 py-1 bg-[#006b47] hover:bg-[#005e3e] text-white text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1 shadow-sm"
            >
              Play Chime
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            <button
              onClick={() => soundService.playSuccessChime()}
              className="py-2.5 px-4 rounded-xl border border-[#bcc8d0] text-sm font-semibold text-[#191c1e] hover:bg-[#f2f4f7] active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download
            </button>
            <button
              onClick={() => soundService.playSuccessChime()}
              className="py-2.5 px-4 rounded-xl bg-[#0043cf] hover:bg-[#0043cf] text-white text-sm font-semibold active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-4 h-4" /> Share QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
