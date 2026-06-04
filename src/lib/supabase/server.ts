import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function createSupabaseClient(key: string): SupabaseClient {
  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
    },
  });
}

// Para Server Components públicos — respeita o RLS
export function getPublicServerClient(): SupabaseClient {
  return createSupabaseClient(anonKey);
}

// Para Server Actions do admin — bypassa o RLS
export function getAdminServerClient(): SupabaseClient {
  return createSupabaseClient(serviceRoleKey);
}

