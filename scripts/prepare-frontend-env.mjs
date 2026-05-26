import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = resolve(root, 'frontend/.env.production');

const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
const key = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
const siteUrl = (process.env.VITE_SITE_URL || 'https://dtmdata.uz').trim();

const lines = [];
if (url) lines.push(`VITE_SUPABASE_URL=${url}`);
if (key) lines.push(`VITE_SUPABASE_ANON_KEY=${key}`);
if (siteUrl) lines.push(`VITE_SITE_URL=${siteUrl}`);

if (lines.length) {
  writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
  console.log('[prepare-env] frontend/.env.production:', lines.map((l) => l.split('=')[0]).join(', '));
} else {
  console.warn('[prepare-env] Supabase env topilmadi — vite placeholder bilan build qiladi');
}

if (process.env.CF_PAGES === '1' && (!url || !key)) {
  console.error(
    '[prepare-env] Cloudflare build xato: VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY kerak.\n' +
      'Dashboard → Environment variables → Production + Preview, Build scope, keyin Retry deployment.',
  );
  process.exit(1);
}
