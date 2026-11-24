import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase public environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
}

// Client-safe Supabase instance enforced with Row Level Security (RLS).
// For privileged backend operations that bypass RLS, use supabaseServer from '@/lib/supabaseServer'.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
