import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { buildUniversityRecords, rowsToSql } from './generate-universities-sql.js';

const EXISTING = [
  'Akfa universiteti',
  'Andijon davlat tibbiyot instituti',
  'Andijon davlat universiteti',
  'Buxoro davlat universiteti',
  "Farg'ona davlat universiteti",
  'INHA universiteti Toshkent',
  'Jahon iqtisodiyoti va diplomatiya universiteti',
  'Namangan davlat universiteti',
  "O'zbekiston Milliy universiteti",
  'Qarshi davlat universiteti',
  'Samarqand davlat tibbiyot universiteti',
  'Samarqand davlat universiteti',
  'TATU Urganch filiali',
  'Toshkent axborot texnologiyalari universiteti',
  'Toshkent davlat iqtisodiyot universiteti',
  'Toshkent davlat yuridik universiteti',
  'Toshkent moliya instituti',
  'Toshkent tibbiyot akademiyasi',
  'Urganch davlat universiteti',
  'Webster universiteti',
];

const { rows, skipped } = buildUniversityRecords(EXISTING, []);
const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../sql/batches');
mkdirSync(outDir, { recursive: true });

writeFileSync(
  resolve(outDir, '00-region.sql'),
  "INSERT INTO regions (name, slug) VALUES ('Toshkent viloyati', 'toshkent-vil') ON CONFLICT (slug) DO NOTHING;\n",
);

const batchSize = 25;
for (let i = 0; i < rows.length; i += batchSize) {
  const batch = rows.slice(i, i + batchSize);
  writeFileSync(resolve(outDir, `batch-${String(i / batchSize + 1).padStart(2, '0')}.sql`), rowsToSql(batch));
}

console.log(JSON.stringify({ total: rows.length, skipped, batches: Math.ceil(rows.length / batchSize) }));
