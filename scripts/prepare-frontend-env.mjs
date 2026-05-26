import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = resolve(root, 'frontend/.env.production');

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

const existing = parseEnvFile(outPath);

const url = (
  process.env.VITE_SUPABASE_URL
  || process.env.SUPABASE_URL
  || existing.VITE_SUPABASE_URL
  || ''
).trim();

const key = (
  process.env.VITE_SUPABASE_ANON_KEY
  || process.env.SUPABASE_ANON_KEY
  || existing.VITE_SUPABASE_ANON_KEY
  || ''
).trim();

const siteUrl = (
  process.env.VITE_SITE_URL
  || existing.VITE_SITE_URL
  || 'https://dtmdata.uz'
).trim();

const merged = {
  ...(url ? { VITE_SUPABASE_URL: url } : {}),
  ...(key ? { VITE_SUPABASE_ANON_KEY: key } : {}),
  VITE_SITE_URL: siteUrl,
};

const lines = Object.entries(merged).map(([name, value]) => `${name}=${value}`);
writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
console.log('[prepare-env] frontend/.env.production:', Object.keys(merged).join(', '));

if (process.env.CF_PAGES === '1' && (!url || !key)) {
  console.error(
    '[prepare-env] Cloudflare build xato: VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY kerak.\n' +
      'Dashboard → Environment variables → Production + Preview, keyin Retry deployment.',
  );
  process.exit(1);
}
