import { createClient } from "@supabase/supabase-js";

// [DECISÃO] Server client separado — usa service role para operações admin e API routes
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
