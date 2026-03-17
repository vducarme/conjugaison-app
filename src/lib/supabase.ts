import { createClient } from "@supabase/supabase-js";

// [DECISÃO] Fallback URL para build time — evita crash quando env vars não existem durante `next build`
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// [DECISÃO] Client-side Supabase com anon key — Row Level Security no banco protege os dados por user
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
