import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
  throw new Error('SUPABASE_URL va SUPABASE_ANON_KEY muhit o\'zgaruvchilari talab qilinadi');
}

const serverKey = supabaseServiceKey || supabaseAnonKey;

export const supabaseAdmin = createClient(supabaseUrl, serverKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export function createUserClient(accessToken) {
  return createClient(supabaseUrl, supabaseAnonKey || serverKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function verifyToken(accessToken) {
  if (!accessToken) return null;
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !user) return null;
  return user;
}

export default supabaseAdmin;
