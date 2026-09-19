'use client';

import React from 'react';
import { STORE_PROFILE } from '@/lib/mockData';
import { useLanguage, LanguageCode } from '@/contexts/LanguageContext';
import {
  Phone,
  QrCode,
  ShieldCheck,
  Globe,
} from 'lucide-react';

interface SettingsTabProps {
  onOpenQR: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onOpenQR }) => {
  const { appLanguage, setAppLanguage, speechLanguage, setSpeechLanguage } = useLanguage();

  return (
    <div className="flex flex-col w-full pb-8">
      {/* 1. Header */}
      <div className="mb-4">
        <h2 className="text-[20px] font-extrabold text-[#0043cf] tracking-tight">
          {appLanguage === 'hi-IN' ? 'स्टोर और सेटिंग्स' : 'Store & Devices'}
        </h2>
        <p className="text-[13px] text-[#3d484f]">
          {appLanguage === 'hi-IN' ? 'मर्चेंट विवरण और भाषा सेटिंग्स' : 'Merchant details and Language settings'}
        </p>
      </div>

      {/* 2. Language & Localization Module */}
      <div className="bg-white p-4 rounded-2xl border border-[#e0e3e6] shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-[#0043cf]" />
          <h3 className="text-[16px] font-extrabold text-[#191c1e]">
            {appLanguage === 'hi-IN' ? 'भाषा और स्थानीयकरण' : 'Language & Localization'}
          </h3>
        </div>

        <div className="pt-2 border-t border-[#e0e3e6]/60 flex flex-col gap-4 text-[13px] text-[#3d484f]">          {/* Application UI Language */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="font-bold text-[#191c1e]">
              {appLanguage === 'hi-IN' ? 'एप्लिकेशन इंटरफेस भाषा (Text)' : 'Application Interface Language (Text)'}
            </label>
            <select
              value={appLanguage}
              onChange={(e) => setAppLanguage(e.target.value as LanguageCode)}
              className="w-full bg-[#f2f4f7] border border-[#bcc8d0]/60 text-[#191c1e] text-[13px] font-semibold rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0043cf]"
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (India)</option>
              <option value="bn-IN">Bengali (India)</option>
              <option value="ta-IN">Tamil (India)</option>
              <option value="te-IN">Telugu (India)</option>
              <option value="kn-IN">Kannada (India)</option>
              <option value="ml-IN">Malayalam (India)</option>
              <option value="mr-IN">Marathi (India)</option>
              <option value="gu-IN">Gujarati (India)</option>
              <option value="pa-IN">Punjabi (India)</option>
              <option value="od-IN">Odia (India)</option>
            </select>
          </div>

          {/* Speech Synthesis Configuration */}
          <div>
            <label className="block text-[13px] font-bold text-[#191c1e] mb-1.5">
              {appLanguage === 'hi-IN' ? 'आवाज़ की भाषा (स्पीच)' : 'Speech Synthesis Language (Voice)'}
            </label>
            <select
              value={speechLanguage}
              onChange={(e) => setSpeechLanguage(e.target.value as LanguageCode)}
              className="w-full bg-[#f2f4f7] border border-[#bcc8d0] text-[#191c1e] text-[13px] font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0043cf]"
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (India)</option>
              <option value="bn-IN">Bengali (India)</option>
              <option value="ta-IN">Tamil (India)</option>
              <option value="te-IN">Telugu (India)</option>
              <option value="kn-IN">Kannada (India)</option>
              <option value="ml-IN">Malayalam (India)</option>
              <option value="mr-IN">Marathi (India)</option>
              <option value="gu-IN">Gujarati (India)</option>
              <option value="pa-IN">Punjabi (India)</option>
              <option value="od-IN">Odia (India)</option>
            </select>
            <p className="text-[11px] text-[#6d7980] mt-1.5">
              {appLanguage === 'hi-IN' ? <>यह सेटिंग <span className="text-[#012b72]">सारथी</span> वॉइस असिस्टेंट के बोलने की भाषा बदलती है।</> : <>Controls the language spoken by the <span className="text-[#012b72]">Saarthi</span> Voice Assistant.</>}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Merchant Store Profile Card */}
      <div className="bg-white p-4 rounded-2xl border border-[#e0e3e6] shadow-sm mb-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0043cf] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
            RS
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-extrabold text-[#191c1e] truncate">
              {STORE_PROFILE.storeName}
            </h3>
            <p className="text-[13px] font-semibold text-[#0043cf]">
              {STORE_PROFILE.merchantName}
            </p>
            <p className="text-[11px] text-[#6d7980] flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3" /> {STORE_PROFILE.phone}
            </p>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eafaf1] text-[10px] font-bold text-[#006b47]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        </div>

        <div className="pt-3 border-t border-[#e0e3e6]/60 flex flex-col gap-1.5 text-[12px] text-[#3d484f]">
          <div className="flex items-center justify-between">
            <span className="text-[#6d7980]">Merchant ID:</span>
            <span className="font-mono font-bold text-[#191c1e]">{STORE_PROFILE.merchantId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6d7980]">UPI ID:</span>
            <span className="font-mono font-bold text-[#0043cf]">{STORE_PROFILE.upiId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6d7980]">Store Address:</span>
            <span className="truncate max-w-[200px] text-right font-medium text-[#191c1e]">
              {STORE_PROFILE.address}
            </span>
          </div>
        </div>
      </div>

      {/* 5. View QR Code Card */}
      <button
        onClick={onOpenQR}
        className="w-full bg-[#0043cf] hover:bg-[#0043cf] active:scale-98 text-white p-4 rounded-2xl flex items-center justify-between shadow-md transition-all mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-[#00b9f1]" />
          </div>
          <div className="text-left">
            <h4 className="text-[14px] font-bold">Display Paytm All-In-One QR</h4>
            <p className="text-[11px] text-white/80">Tap to show customer payment QR</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[20px] text-[#00b9f1]">
          arrow_forward_ios
        </span>
      </button>

      {/* 6. Footer branding */}
      <div className="text-center text-[11px] text-[#6d7980] space-y-1">
        <p className="font-semibold text-[#0043cf]">Paytm <span className="text-[#012b72]">Saarthi</span> Voice Assistant</p>
        <p>Merchant Fintech Edition • Version 1.2.0</p>
      </div>
    </div>
  );
};
