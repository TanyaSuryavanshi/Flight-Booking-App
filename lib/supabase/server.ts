import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/db";

console.log("ENV URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Allow build-time execution without service role key (for static pages)
export const createSupabaseServerClient = () => {
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in environment variables.");
  }
  
  // Use anon key for public queries during build, service role key in production
  const key = supabaseServiceRole || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.");
  }

  return createClient<Database>(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};
