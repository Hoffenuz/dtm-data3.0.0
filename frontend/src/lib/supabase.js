import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
const hasConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasConfig) {
  console.error(
    'VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY build vaqtida topilmadi. Cloudflare Pages → Settings → Environment variables → Build qiling.',
  );
}

export const supabase = createClient(
  hasConfig ? supabaseUrl : 'https://placeholder.supabase.co',
  hasConfig ? supabaseAnonKey : 'placeholder',
);

export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}
