'use client';

import React, { useState } from 'react';
import { TabType } from '@/lib/types';
import { DeviceFrame } from '@/components/layout/DeviceFrame';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { HomeTab } from '@/components/tabs/HomeTab';
import { LedgerTab } from '@/components/tabs/LedgerTab';
import { FestivalTab } from '@/components/tabs/FestivalTab';
import { SettingsTab } from '@/components/tabs/SettingsTab';
import { QRPopup } from '@/components/ui/QRPopup';
import { StoreProfileModal } from '@/components/ui/StoreProfileModal';
import { RECENT_TRANSACTIONS } from '@/lib/mockData';

export default function SaarthiMobileApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  // Count pending Udhaar transactions for bottom nav badge
  const [pendingCount, setPendingCount] = useState(0);

  React.useEffect(() => {
    // 1. Load from localStorage if present
    const saved = localStorage.getItem('saarthi_ledger');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        RECENT_TRANSACTIONS.length = 0;
        RECENT_TRANSACTIONS.push(...parsed);
      } catch (e) {}
    }
    // 2. Initial count set
    setPendingCount(RECENT_TRANSACTIONS.filter((t) => t.type === 'pending').length);
    
    // 3. Listen for future updates
    const updateBadge = () => setPendingCount(RECENT_TRANSACTIONS.filter((t) => t.type === 'pending').length);
    window.addEventListener('LEDGER_UPDATED', updateBadge);
    return () => window.removeEventListener('LEDGER_UPDATED', updateBadge);
  }, []);

  return (
    <DeviceFrame>
      {/* 1. Mobile Header with Paytm Branding & Status */}
      <MobileHeader
        onOpenStoreModal={() => setIsStoreModalOpen(true)}
        onOpenQR={() => setIsQRModalOpen(true)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* 2. Scrollable Body Content per Active Tab */}
      <main className="flex-1 px-4 pt-3 pb-6 overflow-y-auto overflow-x-hidden">
        {activeTab === 'home' && (
          <HomeTab
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'ledger' && <LedgerTab />}

        {activeTab === 'festivals' && <FestivalTab />}

        {activeTab === 'settings' && (
          <SettingsTab onOpenQR={() => setIsQRModalOpen(true)} />
        )}
      </main>

      {/* 3. Bottom Docked Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        unreadCount={pendingCount}
      />

      {/* 4. Paytm All-in-One QR Code Modal */}
      <QRPopup
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      {/* 5. Merchant Store Profile Modal */}
      <StoreProfileModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        onOpenQR={() => setIsQRModalOpen(true)}
      />

    </DeviceFrame>
  );
}
