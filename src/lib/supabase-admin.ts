import { createClient } from "@supabase/supabase-js";

// EMERGNECY FIX: Vercel build is failing because it thinks this file exists and is trying to use env vars that might be missing during build.
// We provide a safe fallback to prevent build crash.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
