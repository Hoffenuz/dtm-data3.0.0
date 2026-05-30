import { writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { UNIVERSITIES } from '../data/universities-full.js';

const REGION_ALIASES = {
  'buxoro viloyati': 'buxoro',
  'xorazm viloyati': 'xorazm',
  'qoraqalpogiston respublikasi': 'qoraqalpogiston',
  'toshkent shahri': 'toshkent-sh',
  'toshkent viloyati': 'toshkent-vil',
  'andijon viloyati': 'andijon',
  'fargona viloyati': 'fargona',
  'samarqand viloyati': 'samarqand',
  'sirdaryo viloyati': 'sirdaryo',
  'jizzax viloyati': 'jizzax',
  'namangan viloyati': 'namangan',
  'navoiy viloyati': 'navoiy',
  'qashqadaryo viloyati': 'qashqadaryo',
  'surxondaryo viloyati': 'surxondaryo',
};

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BB\u0060'‘’ʻ]/g, '')
    .replace(/[""]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(name) {
  let text = normalizeText(name).replace(/o'/g, 'o').replace(/g'/g, 'g');
  return text
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function makeShortName(name) {
  const cleaned = name.replace(/^["']|["']$/g, '').trim();
  if (cleaned.length <= 48) return cleaned;
  const words = cleaned.split(/\s+/).slice(0, 6);
  const acronym = words.map((w) => w[0]?.toUpperCase() || '').join('');
  return acronym.length >= 3 ? acronym.slice(0, 12) : cleaned.slice(0, 48);
}

function regionSlug(regionName) {
  const slug = REGION_ALIASES[normalizeText(regionName)];
  if (!slug) throw new Error(`Viloyat topilmadi: ${regionName}`);
  return slug;
}

function sqlEscape(value) {
  return value.replace(/'/g, "''");
}

export function buildUniversityRecords(existingNames = [], existingSlugs = []) {
  const usedSlugs = new Set(existingSlugs);
  const rows = [];
  let skipped = 0;

  for (const [name, regionName] of UNIVERSITIES) {
    const normalized = normalizeText(name);
    if (existingNames.some((n) => normalizeText(n) === normalized)) {
      skipped += 1;
      continue;
    }

    let slug = slugify(name);
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${regionSlug(regionName).replace('toshkent-sh', 'tsh')}`.slice(0, 90);
    }
    let counter = 2;
    const base = slug;
    while (usedSlugs.has(slug)) {
      slug = `${base}-${counter}`;
      counter += 1;
    }
    usedSlugs.add(slug);

    rows.push({
      name,
      short_name: makeShortName(name),
      slug,
      region_slug: regionSlug(regionName),
      type: 'davlat',
    });
  }

  return { rows, skipped, total: UNIVERSITIES.length };
}

export function rowsToSql(rows) {
  if (!rows.length) return '-- Hech narsa qo\'shilmaydi\n';

  const values = rows.map(
    (r) => `('${sqlEscape(r.name)}', '${sqlEscape(r.short_name)}', '${sqlEscape(r.slug)}', (SELECT id FROM regions WHERE slug = '${r.region_slug}'), '${r.type}', false)`,
  );

  return `INSERT INTO universities (name, short_name, slug, region_id, type, is_top)
VALUES
${values.join(',\n')}
ON CONFLICT (slug) DO NOTHING;`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { rows, skipped, total } = buildUniversityRecords();
  const sql = `-- ${rows.length} ta yangi OTM (${skipped} ta mavjud, jami ro'yxat ${total})\n` +
    `INSERT INTO regions (name, slug) VALUES ('Toshkent viloyati', 'toshkent-vil') ON CONFLICT (slug) DO NOTHING;\n\n` +
    rowsToSql(rows);

  const out = resolve(dirname(fileURLToPath(import.meta.url)), '../sql/seed-universities.sql');
  writeFileSync(out, sql, 'utf8');
  console.log(`SQL yozildi: ${out}`);
  console.log(`Qo'shiladi: ${rows.length}, o'tkazildi: ${skipped}`);
}
