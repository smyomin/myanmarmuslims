import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseKey = supabaseAnonKey ?? supabasePublishableKey ?? "";

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or anon/publishable key — set them in .env.local"
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey);
