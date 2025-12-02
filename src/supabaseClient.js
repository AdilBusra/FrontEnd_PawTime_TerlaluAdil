import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client dengan environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
