import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildRobotsTxt, buildSitemapXml } from '../sitemap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../../frontend/public');

const sitemap = await buildSitemapXml();
const robots = buildRobotsTxt();

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);

console.log('dtmdata.uz — sitemap.xml va robots.txt yangilandi');
