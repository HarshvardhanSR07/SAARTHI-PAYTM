import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { PeriodType, DailyStats } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get('period') as PeriodType) || 'daily';

  // 1. Get the single simulated merchant ID
  const { data: merchants, error: mErr } = await supabaseServer
    .from('merchant')
    .select('user_id')
    .limit(1);

  if (mErr || !merchants || merchants.length === 0) {
    return NextResponse.json({ error: 'No merchant found' }, { status: 404 });
  }

  const merchantId = merchants[0].user_id;

  // 2. Determine date ranges based on period
  const now = new Date();
  const currentRangeStart = new Date(now);
  const prevRangeStart = new Date(now);
  const prevRangeEnd = new Date(now);

  if (period === 'daily') {
    // Current day vs Previous day
    currentRangeStart.setHours(0, 0, 0, 0);
    prevRangeStart.setDate(now.getDate() - 1);
    prevRangeStart.setHours(0, 0, 0, 0);
    prevRangeEnd.setDate(now.getDate() - 1);
    prevRangeEnd.setHours(23, 59, 59, 999);
  } else if (period === 'weekly') {
    currentRangeStart.setDate(now.getDate() - 7);
    prevRangeStart.setDate(now.getDate() - 14);
    prevRangeEnd.setDate(now.getDate() - 7);
  } else {
    // monthly
    currentRangeStart.setDate(now.getDate() - 30);
    prevRangeStart.setDate(now.getDate() - 60);
    prevRangeEnd.setDate(now.getDate() - 30);
  }

  // 3. Fetch all transactions for this merchant within the total range
  const { data: txns, error: tErr } = await supabaseServer
    .from('canonical_txn')
    .select('*')
    .eq('merchant_id', merchantId)
    .gte('booked_at', prevRangeStart.toISOString())
    .lte('booked_at', now.toISOString());

  if (tErr || !txns) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }

  // 4. Aggregate data
  let totalSales = 0;
  let totalTransactions = 0;
  let upiAmount = 0;
  let upiCount = 0;
  let cashAmount = 0;
  let cashCount = 0;
  let pendingUdhaar = 0;
  
  // Track unique counterparties who have pending udhaar in current period
  const pendingCounterparties = new Set<string>();

  // Item tracking for top item
  const itemSalesCount: Record<string, number> = {};

  let prevTotalSales = 0;

  for (const txn of txns) {
    const txnDate = new Date(txn.booked_at);
    const isCurrentPeriod = txnDate >= currentRangeStart;
    
    if (!isCurrentPeriod) {
      if (txn.classification === 'sale') {
        prevTotalSales += Number(txn.amount);
      }
      continue;
    }

    // Current period aggregations
    if (txn.classification === 'sale') {
      const amount = Number(txn.amount);
      totalSales += amount;
      totalTransactions += 1;

      if (txn.channel === 'upi' || txn.channel === 'soundbox') {
        upiAmount += amount;
        upiCount += 1;
      } else if (txn.channel === 'cash') {
        cashAmount += amount;
        cashCount += 1;
      }

      // Track item volume
      if (txn.item_id) {
        itemSalesCount[txn.item_id] = (itemSalesCount[txn.item_id] || 0) + Number(txn.quantity || 1);
      }
    } else if (txn.classification === 'uddhar_lend' && Number(txn.due_amount) > 0) {
      pendingUdhaar += Number(txn.due_amount);
      if (txn.counterparty_id) {
        pendingCounterparties.add(txn.counterparty_id);
      }
    }
  }

  // 5. Compute growth %
  let growthPercent = 0;
  if (prevTotalSales > 0) {
    growthPercent = Math.round(((totalSales - prevTotalSales) / prevTotalSales) * 100);
  } else if (totalSales > 0) {
    growthPercent = 100;
  }

  // 6. Find top item name
  let topItemId = '';
  let topItemVolume = 0;
  for (const [id, vol] of Object.entries(itemSalesCount)) {
    if (vol > topItemVolume) {
      topItemVolume = vol;
      topItemId = id;
    }
  }

  let topItemName = 'Assorted Groceries';
  if (topItemId) {
    const { data: item } = await supabaseServer
      .from('catalog_item')
      .select('name')
      .eq('item_id', topItemId)
      .single();
    if (item) {
      topItemName = item.name;
    }
  }

  const result: DailyStats = {
    period,
    totalSales,
    totalTransactions,
    growthPercent,
    upiAmount,
    upiCount,
    cashAmount,
    cashCount,
    pendingUdhaar,
    pendingUdhaarCount: pendingCounterparties.size,
    topItem: topItemName,
    topItemSales: topItemVolume
  };

  return NextResponse.json(result);
}
