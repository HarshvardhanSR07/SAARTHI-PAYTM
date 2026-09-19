const fs = require('fs');

let code = fs.readFileSync('src/lib/mockData.ts', 'utf8');

const newFestivalEvents = `export const FESTIVAL_EVENTS: FestivalEvent[] = [
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
];`;

const startIndex = code.indexOf('export const FESTIVAL_EVENTS: FestivalEvent[] = [');
const endIndex = code.indexOf('\n];', startIndex) + 3;

code = code.substring(0, startIndex) + newFestivalEvents + code.substring(endIndex);

fs.writeFileSync('src/lib/mockData.ts', code, 'utf8');
console.log('mockData updated!');
