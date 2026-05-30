import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { buildUniversityRecords } from './generate-universities-sql.js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY kerak (backend/.env)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureRegions() {
  const { error } = await supabase
    .from('regions')
    .upsert({ name: 'Toshkent viloyati', slug: 'toshkent-vil' }, { onConflict: 'slug' });
  if (error) throw error;
}

async function main() {
  await ensureRegions();

  const { data: existing, error } = await supabase.from('universities').select('name, slug');
  if (error) throw error;

  const { rows, skipped, total } = buildUniversityRecords(
    existing.map((u) => u.name),
    existing.map((u) => u.slug),
  );

  console.log(`Jami ro'yxat: ${total}, o'tkazildi (mavjud): ${skipped}, qo'shiladi: ${rows.length}`);

  if (!rows.length) {
    console.log('Yangi OTM yo\'q.');
    return;
  }

  const chunkSize = 50;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const batch = rows.slice(i, i + chunkSize);
    const records = await Promise.all(
      batch.map(async (r) => {
        const { data: region, error: regionError } = await supabase
          .from('regions')
          .select('id')
          .eq('slug', r.region_slug)
          .single();
        if (regionError) throw regionError;
        return {
          name: r.name,
          short_name: r.short_name,
          slug: r.slug,
          region_id: region.id,
          type: r.type,
          is_top: false,
        };
      }),
    );

    const { error: insertError } = await supabase.from('universities').insert(records);
    if (insertError) throw insertError;
    inserted += records.length;
    console.log(`  ${inserted}/${rows.length} qo'shildi...`);
  }

  const { count } = await supabase.from('universities').select('*', { count: 'exact', head: true });
  console.log(`\nTayyor! Bazada jami ${count} ta OTM.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
