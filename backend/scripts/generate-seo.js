import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from '../db.js';
import { buildRobotsTxt, buildSitemapXml } from '../sitemap.js';

initDatabase();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../../frontend/public');

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), buildSitemapXml());
fs.writeFileSync(path.join(publicDir, 'robots.txt'), buildRobotsTxt());

console.log('dtmdata.uz — sitemap.xml va robots.txt yangilandi');
