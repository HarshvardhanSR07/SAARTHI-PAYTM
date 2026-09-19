import { DailyStats, StoreProfile, Transaction, VoiceQueryItem, FestivalEvent } from './types';

export const STORE_PROFILE: StoreProfile = {
  storeName: 'Sharma Kirana & General Store',
  merchantName: 'Ramesh Sharma',
  phone: '+91 98765 43210',
  address: 'Shop No. 14, Main Market, Sector 62, Noida, UP',
  merchantId: 'PTM88291048',
  upiId: 'paytm-sharmastore@paytm',
  soundboxModel: 'Paytm Soundbox 4.0 4G',
  soundboxBattery: 82,
  soundboxSignal: 'Excellent',
  soundboxVolume: 80,
};

export const STATS_BY_PERIOD: Record<'daily' | 'weekly' | 'monthly', DailyStats> = {
  daily: {
    period: 'daily',
    totalSales: 8450,
    totalTransactions: 42,
    growthPercent: 18,
    upiAmount: 7100,
    upiCount: 35,
    cashAmount: 1350,
    cashCount: 7,
    pendingUdhaar: 1200,
    pendingUdhaarCount: 3,
    topItem: 'Amul Taaza Milk (500ml)',
    topItemSales: 1650,
  },
  weekly: {
    period: 'weekly',
    totalSales: 54320,
    totalTransactions: 286,
    growthPercent: 12.5,
    upiAmount: 46800,
    upiCount: 242,
    cashAmount: 7520,
    cashCount: 44,
    pendingUdhaar: 3850,
    pendingUdhaarCount: 9,
    topItem: 'Fortune Sunflower Oil (1L)',
    topItemSales: 9400,
  },
  monthly: {
    period: 'monthly',
    totalSales: 218500,
    totalTransactions: 1140,
    growthPercent: 15.2,
    upiAmount: 189000,
    upiCount: 978,
    cashAmount: 29500,
    cashCount: 162,
    pendingUdhaar: 7400,
    pendingUdhaarCount: 14,
    topItem: 'Aashirvaad Shudh Chakki Atta (5kg)',
    topItemSales: 34200,
  },
};

export const INITIAL_QUERIES: VoiceQueryItem[] = [
  {
    id: 'query-1',
    userQuery: 'Aaj meri sales kaisi rahi?',
    aiResponse: 'Aaj aapki total sales ₹8,450 rahi — kal se 18% zyada. Aaj UPI payments sabse strong rahe hain.',
    spokenText: 'Aaj aapki total sales aath hazaar char sau pachaas rupaye rahi, jo kal se 18 percent zyada hai. Aaj UPI payments sabse strong rahe.',
    timestamp: '7:42 PM',
    category: 'sales',
    audioDurationSeconds: 7,
    highlightMetric: '₹8,450',
    insight: 'Evening sales (6 PM - 9 PM) contributed 48% of total daily revenue.',
  },
  {
    id: 'query-2',
    userQuery: 'Aaj ki sales kitni hui?',
    aiResponse: 'Aaj kul 42 transactions mein ₹8,450 ki bikri hui hai. UPI se ₹7,100 aur Cash se ₹1,350 receive hue.',
    spokenText: 'Aaj kul byaalees transactions mein aath hazaar char sau pachaas rupaye ki bikri hui hai.',
    timestamp: '6:15 PM',
    category: 'sales',
    audioDurationSeconds: 6,
    highlightMetric: '42 Orders',
  },
  {
    id: 'query-3',
    userQuery: 'Sabse zyada kya bik raha hai?',
    aiResponse: 'Aaj sabse zyada "Amul Taaza Milk (500ml)" bika — 55 packets (₹1,650). Stock mein sirf 8 packets bache hain!',
    spokenText: 'Aaj sabse zyada Amul Taaza Milk bika, kul pachpan packet, solah sau pachaas rupaye ke.',
    timestamp: '5:02 PM',
    category: 'inventory',
    audioDurationSeconds: 8,
    highlightMetric: '55 Packets',
    insight: 'Consider ordering 30 more crates before tomorrow 7 AM.',
  },
  {
    id: 'query-4',
    userQuery: 'Kal ke liye kya suggest karoge?',
    aiResponse: 'Kal Saturday hai! Pichle weekend par Dahi, Bread aur Snacks ki 35% extra demand thi. Shaam 6 baje se pehle stock ready rakhein.',
    spokenText: 'Kal Saturday hai. Pichle weekend par Dahi, Bread aur Snacks ki 35 percent extra demand thi. Shaam ko stock ready rakhein.',
    timestamp: '3:30 PM',
    category: 'general',
    audioDurationSeconds: 8,
    insight: 'Weekend morning footfall increases by 40% between 8 AM and 11 AM.',
  },
  {
    id: 'query-5',
    userQuery: 'Kal ki payment settle kab hogi?',
    aiResponse: 'Aapka kal ka total settlement ₹7,100 kal subah 7:00 AM tak aapke HDFC Bank account mein credit ho jayega.',
    spokenText: 'Aapka settlement saat hazaar ek sau rupaye kal subah saat baje credit ho jayega.',
    timestamp: '2:10 PM',
    category: 'settlement',
    audioDurationSeconds: 6,
    highlightMetric: '₹7,100 at 7:00 AM',
  },
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    customerName: 'Rahul Verma',
    amount: 150,
    type: 'received',
    paymentMode: 'soundbox',
    timestamp: '7:38 PM',
    timeAgo: '4 mins ago',
    note: 'Bread & Amul Butter',
    customerPhone: '+91 98111 22334',
    soundboxVerified: true,
  },
  {
    id: 'tx-102',
    customerName: 'Ananya Iyer',
    amount: 520,
    type: 'received',
    paymentMode: 'paytm_qr',
    timestamp: '7:15 PM',
    timeAgo: '27 mins ago',
    note: 'Grocery & Spices',
    customerPhone: '+91 98222 33445',
    soundboxVerified: true,
  },
  {
    id: 'tx-103',
    customerName: 'Manoj Tiwari (Sharma Ji)',
    amount: 450,
    type: 'pending',
    paymentMode: 'cash',
    timestamp: '6:50 PM',
    timeAgo: '52 mins ago',
    note: 'Monthly Ration Khata (Udhaar)',
    customerPhone: '+91 98333 44556',
  },
  {
    id: 'tx-104',
    customerName: 'Pooja Singh',
    amount: 980,
    type: 'received',
    paymentMode: 'soundbox',
    timestamp: '6:12 PM',
    timeAgo: '1 hr ago',
    note: 'Fortune Oil 1L + Basmati Rice',
    customerPhone: '+91 98444 55667',
    soundboxVerified: true,
  },
  {
    id: 'tx-105',
    customerName: 'Vikram Patel',
    amount: 250,
    type: 'pending',
    paymentMode: 'cash',
    timestamp: '5:40 PM',
    timeAgo: '2 hrs ago',
    note: 'Cold drinks & chips (Udhaar)',
    customerPhone: '+91 98555 66778',
  },
  {
    id: 'tx-106',
    customerName: 'Deepak Chopra',
    amount: 1250,
    type: 'received',
    paymentMode: 'soundbox',
    timestamp: '4:25 PM',
    timeAgo: '3 hrs ago',
    note: 'Aashirvaad Atta 10kg',
    customerPhone: '+91 98666 77889',
    soundboxVerified: true,
  },
  {
    id: 'tx-107',
    customerName: 'Sunita Devi',
    amount: 500,
    type: 'pending',
    paymentMode: 'cash',
    timestamp: '3:10 PM',
    timeAgo: '4 hrs ago',
    note: 'Dry fruits & sugar (Udhaar)',
    customerPhone: '+91 98777 88990',
  },
  {
    id: 'tx-108',
    customerName: 'Sanjay Kumar',
    amount: 75,
    type: 'received',
    paymentMode: 'upi',
    timestamp: '2:15 PM',
    timeAgo: '5 hrs ago',
    note: 'Milk packet',
    customerPhone: '+91 98888 99001',
    soundboxVerified: true,
  },
];

export const SUGGESTED_QUESTIONS = [
  'Aaj ki sales kitni hui?',
  'Meri sales kaisi chal rahi hai?',
  'Sabse zyada kya bik raha hai?',
  'Kal ke liye kya suggest karoge?',
  'Soundbox volume test karo',
  'Kal ki payment settle kab hogi?',
];

export const FESTIVAL_EVENTS: FestivalEvent[] = [
  {
    id: 'fest-republic-day',
    name: 'Republic Day',
    dateString: 'Jan 26, 2026',
    dateKey: '2026-01-26',
    day: 26,
    month: 0,
    year: 2026,
    bannerTitle: 'National Holiday Spikes',
    bannerSubtitle: 'Sweets and snacks demand jumps by 30%',
    badge: 'National',
    salesHike: {
      percentage: '+30%',
      description: 'Morning rush for Jalebi, snacks and cold drinks.',
      topItems: [
        { name: 'Jalebi/Sweets', surge: '+150%' },
        { name: 'Namkeen/Snacks', surge: '+45%' },
        { name: 'Cold Drinks', surge: '+25%' }
      ],
    },
    stockHike: {
      multiplier: '1.5x',
      recommendedInventory: [
        'Stock up on readymade sweets and local snacks',
        'Keep cold drinks chilled for morning rush'
      ],
      reorderDeadline: 'Jan 22, 2026',
    },
    priceHike: {
      wholesaleSurge: '+2%',
      marginAlert: 'Minimal wholesale changes.',
      savingsTip: 'Pre-order bulk sweets for better margins.',
    },
    aiNudgeText: 'Republic Day aa raha hai! Sweets aur snacks ki demand subah subah bahut badhegi. Apna stock 22 Jan tak ready rakhein.',
    spokenText: 'Republic day par sweets aur snacks ki extra demand hoti hai. Apna stock 22 Jan tak ready kar lein.'
  },
  {
    id: 'fest-holi',
    name: 'Holi',
    dateString: 'Mar 25, 2026',
    dateKey: '2026-03-25',
    day: 25,
    month: 2,
    year: 2026,
    bannerTitle: 'Festival of Colors Rush',
    bannerSubtitle: 'Colors, Sweets, and Dairy demand surges +80%',
    badge: 'Peak Demand',
    salesHike: {
      percentage: '+80%',
      description: 'High demand for Gulal, Gujiya essentials, and Milk/Ghee.',
      topItems: [
        { name: 'Gulal/Colors', surge: '+300%' },
        { name: 'Milk & Mawa', surge: '+120%' },
        { name: 'Cooking Oil & Ghee', surge: '+70%' }
      ],
    },
    stockHike: {
      multiplier: '2.5x',
      recommendedInventory: [
        'Stock 50kg extra Mawa and Dairy products',
        'Bulk display Gulal and Water guns at storefront'
      ],
      reorderDeadline: 'Mar 20, 2026',
    },
    priceHike: {
      wholesaleSurge: '+10%',
      marginAlert: 'Dairy and Ghee wholesale rates rise steeply before Holi.',
      savingsTip: 'Lock in dairy contracts by March 15.',
    },
    aiNudgeText: 'Holi ke liye Gulal, Mawa aur Ghee ka stock badha lijiye. Phele se order karke wholesale margin bachayein.',
    spokenText: 'Holi ke liye gulal, mawa, aur ghee ka stock double kar lijiye. Demand achanak se badhegi.'
  },
  {
    id: 'fest-eid-fitr',
    name: 'Eid-ul-Fitr',
    dateString: 'Apr 10, 2026',
    dateKey: '2026-04-10',
    day: 10,
    month: 3,
    year: 2026,
    bannerTitle: 'Eid Festive Demand',
    bannerSubtitle: 'Dry fruits, Sewaiyan, and Milk sales jump +65%',
    badge: 'High Demand',
    salesHike: {
      percentage: '+65%',
      description: 'End of Ramadan brings massive surge in sweet preparation ingredients.',
      topItems: [
        { name: 'Sewaiyan (Vermicelli)', surge: '+200%' },
        { name: 'Dry Fruits (Almonds/Cashews)', surge: '+110%' },
        { name: 'Milk & Ghee', surge: '+85%' }
      ],
    },
    stockHike: {
      multiplier: '2.0x',
      recommendedInventory: [
        'Premium quality dry fruits and dates',
        'Large quantities of packaged Sewaiyan'
      ],
      reorderDeadline: 'Apr 05, 2026',
    },
    priceHike: {
      wholesaleSurge: '+12%',
      marginAlert: 'Dry fruit prices peak during Ramadan.',
      savingsTip: 'Source dry fruits well in advance.',
    },
    aiNudgeText: 'Eid-ul-Fitr aa rahi hai. Sewaiyan aur Dry fruits ki demand peak par hogi. Stock abhi se ensure karein.',
    spokenText: 'Eid par sewaiyan aur dry fruits ki demand peak par hogi. Stock abhi se ensure karein.'
  },
  {
    id: 'fest-raksha-bandhan',
    name: 'Raksha Bandhan',
    dateString: 'Aug 19, 2026',
    dateKey: '2026-08-19',
    day: 19,
    month: 7,
    year: 2026,
    bannerTitle: 'Rakhi & Gift Rush',
    bannerSubtitle: 'Chocolates, Rakhis, and Sweets demand up by +50%',
    badge: 'High Demand',
    salesHike: {
      percentage: '+50%',
      description: 'Strong sales in gifting items, especially chocolates.',
      topItems: [
        { name: 'Rakhis', surge: '+400%' },
        { name: 'Chocolate Gift Packs', surge: '+150%' },
        { name: 'Sweets', surge: '+80%' }
      ],
    },
    stockHike: {
      multiplier: '1.8x',
      recommendedInventory: [
        'Display Rakhis prominently near checkout',
        'Keep branded chocolate gift boxes in stock'
      ],
      reorderDeadline: 'Aug 10, 2026',
    },
    priceHike: {
      wholesaleSurge: '+5%',
      marginAlert: 'Chocolate boxes have stable wholesale prices but high retail margin.',
      savingsTip: 'Buy assorted gift packs for bundle margins.',
    },
    aiNudgeText: 'Raksha Bandhan ke liye Chocolate gift packs aur Rakhis ka stock counter ke paas lagayein.',
    spokenText: 'Raksha Bandhan ke liye rakhis aur chocolate gift packs ko counter ke paas display karein.'
  },
  {
    id: 'fest-diwali',
    name: 'Diwali (Deepavali)',
    dateString: 'Nov 8, 2026',
    dateKey: '2026-10-08',
    day: 8,
    month: 10,
    year: 2026,
    bannerTitle: 'Biggest Retail Surge of the Year',
    bannerSubtitle: 'Overall sales projected to double (+110%)',
    badge: 'Peak Demand',
    salesHike: {
      percentage: '+110%',
      description: 'Massive volume across Dry Fruits, Ghee, Sugar, Snacks and Puja Samagri.',
      topItems: [
        { name: 'Dry Fruit Gift Boxes', surge: '+250%' },
        { name: 'Puja Samagri & Diyas', surge: '+300%' },
        { name: 'Edible Oil & Ghee', surge: '+120%' },
      ],
    },
    stockHike: {
      multiplier: '3.0x',
      recommendedInventory: [
        'Stock 3x normal volume of Ghee and Oil',
        'Create a dedicated section for Puja items and Diyas'
      ],
      reorderDeadline: 'Oct 25, 2026',
    },
    priceHike: {
      wholesaleSurge: '+15% to +20%',
      marginAlert: 'Dry fruit and ghee wholesale rates skyrocket 2 weeks before.',
      savingsTip: 'Secure stock by Oct 20 to avoid wholesale hikes.',
    },
    aiNudgeText: 'Diwali is the biggest shopping day! Gift hampers, Diyas, aur Dry Fruits 3x speed se bikenge. Advance stock ready rakhein.',
    spokenText: 'Diwali saal ka sabse bada tyohar hai. Puja samagri aur dry fruits 3x speed se bikenge. Advance order zaroor karein.'
  },
  {
    id: 'fest-christmas',
    name: 'Christmas',
    dateString: 'Dec 25, 2026',
    dateKey: '2026-12-25',
    day: 25,
    month: 11,
    year: 2026,
    bannerTitle: 'Winter & Christmas Demand',
    bannerSubtitle: 'Baking ingredients and cakes demand surges +40%',
    badge: 'Moderate Surge',
    salesHike: {
      percentage: '+40%',
      description: 'Plum cakes, baking supplies, and winter snacks sell fast.',
      topItems: [
        { name: 'Packaged Cakes', surge: '+150%' },
        { name: 'Baking Flour & Cocoa', surge: '+80%' },
        { name: 'Chocolates & Candies', surge: '+60%' }
      ],
    },
    stockHike: {
      multiplier: '1.4x',
      recommendedInventory: [
        'Stock up on packaged cakes and chocolates',
        'Keep baking essentials at the front'
      ],
      reorderDeadline: 'Dec 18, 2026',
    },
    priceHike: {
      wholesaleSurge: '+3%',
      marginAlert: 'Stable prices, high turnover.',
      savingsTip: 'Buy assorted cakes in bulk.',
    },
    aiNudgeText: 'Christmas ke liye cakes aur baking items ka display aage rakhein.',
    spokenText: 'Christmas ke liye cakes, chocolates, aur baking items ko front mein display karein.'
  }
];
