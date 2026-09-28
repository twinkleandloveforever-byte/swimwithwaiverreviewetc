import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rblifplwgfnwzattljed.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pVs6uTsUjiI2E1QynJMRnQ_EZ0t82X';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
