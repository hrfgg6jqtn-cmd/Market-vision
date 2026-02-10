import { createClient } from '@supabase/supabase-js';

// This client uses the SERVICE_ROLE_KEY. 
// It effectively has "Root" access to the database.
// NEVER use this in client-side components (React).
// Only use in /src/app/api/... routes.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
