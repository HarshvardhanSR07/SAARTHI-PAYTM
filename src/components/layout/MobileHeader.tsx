'use client';

import React, { useState, useEffect } from 'react';
import { Store, Wifi, BatteryCharging, Sparkles } from 'lucide-react';
import { STORE_PROFILE } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';

interface MobileHeaderProps {
  onOpenStoreModal?: () => void;
  onOpenQR?: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenStoreModal, onOpenQR, onNavigateToTab }) => {
  const { appLanguage, setAppLanguage } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#f7f9fc]/90 dark:bg-[#1a1c1e]/90 backdrop-blur-md border-b border-[#e0e3e6]/50 dark:border-gray-800/50 transition-all">
      {/* Top App Bar */}
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-black tracking-tight leading-none">
              <span className="text-[#012b72] dark:text-white">pay</span>
              <span className="text-[#00b9f1]">tm</span>
            </span>
            <span className="text-[10px] font-extrabold text-[#00b9f1] tracking-wide">
              BUSINESS
            </span>
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="text-[20px] font-extrabold tracking-tight text-[#012b72] dark:text-white leading-none"
              style={{ fontFamily: 'var(--font-roboto), Roboto, sans-serif' }}
            >
              <span className="text-[#FFB800]">SAARTHI</span>
            </span>
            <Sparkles className="w-4 h-4 text-[#98a6b5] fill-[#98a6b5] mb-0.5" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notification Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-[#bcc8d0]/40 dark:border-gray-700 flex items-center justify-center text-[#0043cf] dark:text-gray-200 hover:bg-[#f2f4f7] dark:hover:bg-gray-700 active:scale-95 transition-all shadow-sm relative"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#ba1a1a] border-2 border-white dark:border-gray-800 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 z-50 origin-top-right animate-in fade-in zoom-in-95">
                <NotificationDropdown 
                  onDismiss={() => setShowNotifications(false)} 
                  onNavigateToTab={(tab) => {
                    setShowNotifications(false);
                    if (onNavigateToTab) onNavigateToTab(tab);
                  }}
                />
              </div>
            )}
          </div>

          {/* Storefront Button (Integrated with QR) */}
          <button
            onClick={() => {
              if (onOpenStoreModal) onOpenStoreModal();
              // Alternatively, trigger both if needed, but StoreModal should contain the QR now
            }}
            aria-label="Store Profile"
            className="w-9 h-9 rounded-full bg-[#0043cf] dark:bg-[#0088b3] hover:bg-[#0043cf] dark:hover:bg-[#0043cf] active:scale-95 transition-all flex items-center justify-center text-white shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
          </button>
        </div>
      </div>

    </header>
  );
};
