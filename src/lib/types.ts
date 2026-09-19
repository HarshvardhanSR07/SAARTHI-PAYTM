export type TabType = 'home' | 'ledger' | 'festivals' | 'settings';
export type PeriodType = 'daily' | 'weekly' | 'monthly';
export type QueryCategory = 'sales' | 'inventory' | 'settlement' | 'general';

export interface FestivalEvent {
  id: string;
  name: string;
  dateString: string; // e.g. "Nov 1, 2026"
  dateKey: string; // "2026-11-01"
  day: number;
  month: number; // 0 for Jan, 10 for Nov
  year: number;
  bannerTitle: string;
  bannerSubtitle: string;
  badge: string;
  salesHike: {
    percentage: string;
    description: string;
    topItems: { name: string; surge: string }[];
  };
  stockHike: {
    multiplier: string;
    recommendedInventory: string[];
    reorderDeadline: string;
  };
  priceHike: {
    wholesaleSurge: string;
    marginAlert: string;
    savingsTip: string;
  };
  aiNudgeText: string;
  spokenText?: string;
}

export interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  type: 'received' | 'pending';
  paymentMode: 'paytm_qr' | 'soundbox' | 'upi' | 'cash';
  timestamp: string;
  timeAgo: string;
  note?: string;
  customerPhone?: string;
  soundboxVerified?: boolean;
}

export interface DailyStats {
  period: PeriodType;
  totalSales: number;
  totalTransactions: number;
  growthPercent: number;
  upiAmount: number;
  upiCount: number;
  cashAmount: number;
  cashCount: number;
  pendingUdhaar: number;
  pendingUdhaarCount: number;
  topItem: string;
  topItemSales: number;
}

export interface VoiceQueryItem {
  id: string;
  userQuery: string;
  aiResponse: string;
  spokenText: string;
  timestamp: string;
  category: QueryCategory;
  audioDurationSeconds: number;
  highlightMetric?: string;
  insight?: string;
}

export interface StoreProfile {
  storeName: string;
  merchantName: string;
  phone: string;
  address: string;
  merchantId: string;
  upiId: string;
  soundboxModel: string;
  soundboxBattery: number;
  soundboxSignal: 'Excellent' | 'Good' | 'Fair';
  soundboxVolume: number;
}
