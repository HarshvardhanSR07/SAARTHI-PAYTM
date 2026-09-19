-- SAARTHI Canonical Domain Schema (Supabase)

-- 1. Merchant
CREATE TABLE IF NOT EXISTS public.merchant (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_name TEXT NOT NULL,
    category TEXT,
    city_tier TEXT,
    language_pref TEXT DEFAULT 'hi-IN',
    paytm_mid TEXT,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    opened_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Catalog Item
CREATE TABLE IF NOT EXISTS public.catalog_item (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchant(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    unit TEXT,
    cost_price NUMERIC(10,2) NOT NULL,
    sell_price NUMERIC(10,2) NOT NULL,
    category TEXT, -- staples, dairy, personal_care, impulse, seasonal
    velocity_class TEXT, -- fast, medium, slow
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Counterparty
CREATE TABLE IF NOT EXISTS public.counterparty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchant(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    type TEXT, -- customer, supplier, walk_in
    credit_limit NUMERIC(10,2),
    risk_band TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transaction (canonical_txn)
CREATE TABLE IF NOT EXISTS public.canonical_txn (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchant(user_id) ON DELETE CASCADE,
    counterparty_id UUID REFERENCES public.counterparty(id) ON DELETE SET NULL,
    booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    channel TEXT, -- upi, cash, card, soundbox
    classification TEXT NOT NULL, -- sale, uddhar_lend, uddhar_repay, expense, adjustment, void
    item_id UUID REFERENCES public.catalog_item(item_id) ON DELETE SET NULL,
    quantity NUMERIC(10,2),
    unit_price NUMERIC(10,2),
    cost_price NUMERIC(10,2),
    amount NUMERIC(10,2) NOT NULL,
    payment_status TEXT, -- paid, partial, due, void
    paid_amount NUMERIC(10,2),
    due_amount NUMERIC(10,2),
    description TEXT,
    external_ref TEXT, -- Paytm txn id when live
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(merchant_id, external_ref)
);

-- 5. Inventory Snapshot
CREATE TABLE IF NOT EXISTS public.inventory_snapshot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchant(user_id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.catalog_item(item_id) ON DELETE CASCADE,
    as_of TIMESTAMPTZ NOT NULL,
    on_hand NUMERIC(10,2) NOT NULL,
    days_of_cover NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Conversation Turn
CREATE TABLE IF NOT EXISTS public.conversation_turn (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES public.merchant(user_id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- user, assistant
    content TEXT NOT NULL,
    intent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Data Source Marker
CREATE TABLE IF NOT EXISTS public.data_source_marker (
    merchant_id UUID PRIMARY KEY REFERENCES public.merchant(user_id) ON DELETE CASCADE,
    mode TEXT NOT NULL, -- sim, live, hybrid
    last_sync_at TIMESTAMPTZ DEFAULT NOW(),
    sim_seed BIGINT
);

-- Enable RLS (Row Level Security) - basic policies
ALTER TABLE public.merchant ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counterparty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_txn ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_turn ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_source_marker ENABLE ROW LEVEL SECURITY;

-- Create policies allowing service role full access (and anon based on your auth setup later)
-- Note: Service Role bypasses RLS automatically, but creating policies is good practice.
CREATE POLICY "Enable read access for all users" ON public.merchant FOR SELECT USING (true);
