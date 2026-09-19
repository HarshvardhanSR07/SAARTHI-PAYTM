import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), './.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Mulberry32 PRNG for deterministic generation
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Helper: Poisson distribution
function poisson(rng: () => number, lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return k - 1;
}

// 2. Data Generators
async function generateSyntheticData() {
  console.log("Starting Synthetic Data Generation...");
  const SEED = 42;
  const DAYS = 30;
  const rng = mulberry32(SEED);

  // A. Profile
  const merchantData = {
    shop_name: "Gupta General Store (Simulated)",
    category: "general_store",
    city_tier: "tier_2",
    language_pref: "hi-IN",
  };

  const { data: merchant, error: mErr } = await supabase
    .from('merchant')
    .insert([merchantData])
    .select()
    .single();

  if (mErr || !merchant) {
    console.error("Failed to create merchant", mErr);
    return;
  }
  console.log("Merchant created:", merchant.user_id);

  // Mark as SIM
  await supabase.from('data_source_marker').insert([{
    merchant_id: merchant.user_id,
    mode: 'sim',
    sim_seed: SEED
  }]);

  // B. Catalog
  const categories = ['staples', 'dairy', 'personal_care', 'impulse'];
  const velocities = ['fast', 'medium', 'slow'];
  
  const catalogData = Array.from({ length: 30 }).map((_, i) => ({
    merchant_id: merchant.user_id,
    name: `SKU Item ${i + 1}`,
    cost_price: Math.floor(rng() * 50) + 10,
    sell_price: Math.floor(rng() * 50) + 70,
    category: categories[Math.floor(rng() * categories.length)],
    velocity_class: velocities[Math.floor(rng() * velocities.length)]
  }));

  const { data: catalog, error: cErr } = await supabase
    .from('catalog_item')
    .insert(catalogData)
    .select();

  if (cErr || !catalog) {
    console.error("Failed to create catalog", cErr);
    return;
  }

  // C. Counterparties
  const peopleData = Array.from({ length: 15 }).map((_, i) => ({
    merchant_id: merchant.user_id,
    name: `Customer ${i + 1}`,
    type: i === 0 ? 'walk_in' : 'customer',
    credit_limit: i > 0 ? (Math.floor(rng() * 5) + 1) * 1000 : 0
  }));

  const { data: people, error: pErr } = await supabase
    .from('counterparty')
    .insert(peopleData)
    .select();

  if (pErr || !people) {
    console.error("Failed to create counterparties", pErr);
    return;
  }

  // D. Timeline Synthesis
  const txns = [];
  const now = new Date();
  let baseLambda = 20; // Avg 20 txns per day

  for (let d = DAYS; d >= 0; d--) {
    const currentDay = new Date(now);
    currentDay.setDate(now.getDate() - d);
    const dayOfWeek = currentDay.getDay();

    // Weekend multiplier
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const lambda = isWeekend ? baseLambda * 1.3 : baseLambda;
    
    const txn_count = poisson(rng, lambda);
    
    for (let t = 0; t < txn_count; t++) {
      // Pick random hour between 8 and 21
      const hour = Math.floor(rng() * 13) + 8;
      const txnDate = new Date(currentDay);
      txnDate.setHours(hour, Math.floor(rng() * 60));

      const customer = people[Math.floor(rng() * people.length)];
      const item = catalog[Math.floor(rng() * catalog.length)];
      const qty = Math.floor(rng() * 3) + 1;
      const amount = item.sell_price * qty;

      const isUdhaar = customer.type !== 'walk_in' && rng() < 0.15;
      
      txns.push({
        merchant_id: merchant.user_id,
        counterparty_id: customer.id,
        booked_at: txnDate.toISOString(),
        channel: rng() > 0.3 ? 'upi' : 'cash',
        classification: isUdhaar ? 'uddhar_lend' : 'sale',
        item_id: item.item_id,
        quantity: qty,
        unit_price: item.sell_price,
        cost_price: item.cost_price,
        amount: amount,
        payment_status: isUdhaar ? 'due' : 'paid',
        paid_amount: isUdhaar ? 0 : amount,
        due_amount: isUdhaar ? amount : 0,
        description: `Purchased ${qty}x ${item.name}`,
        external_ref: `SIM-${currentDay.getTime()}-${t}`
      });
    }
  }

  // Insert in batches of 500
  for (let i = 0; i < txns.length; i += 500) {
    const batch = txns.slice(i, i + 500);
    const { error: tErr } = await supabase.from('canonical_txn').insert(batch);
    if (tErr) console.error("Error inserting batch:", tErr);
  }

  console.log(`Generation complete! Inserted ${txns.length} synthetic transactions for merchant ${merchant.user_id}.`);
}

generateSyntheticData().catch(console.error);
