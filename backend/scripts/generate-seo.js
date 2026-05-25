import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cloudflare build da env o'zgaruvchilari process.env da keladi; lokalda backend/.env
try {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const { default: dotenv } = await import('dotenv');
    dotenv.config({ path: envPath });
  }
} catch {
  // dotenv o'rnatilmagan bo'lsa (masalan, faqat frontend build) — davom etamiz
}

const { buildRobotsTxt, buildSitemapXml } = await import('../sitemap.js');

const publicDir = path.join(__dirname, '../../frontend/public');

const sitemap = await buildSitemapXml();
const robots = buildRobotsTxt();

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);

console.log('dtmdata.uz — sitemap.xml va robots.txt yangilandi');
