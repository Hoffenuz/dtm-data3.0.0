import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabaseAdmin, { createUserClient } from './supabase.js';
import { buildRobotsTxt, buildSitemapXml } from './sitemap.js';
import { SITE_NAME, SITE_URL } from '../shared/site.constants.js';
import { optionalAuth, requireAuth } from './middleware/auth.js';
import { setupSecurity, corsOptions, sanitizeString, isValidEmail } from './middleware/security.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const distPath = path.join(__dirname, '../frontend/dist');
const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(distPath);

const { contactLimiter } = setupSecurity(app);

app.use(cors(corsOptions()));
app.use(express.json({ limit: '32kb' }));

const CAREER_RECOMMENDATIONS = {
  texnika: {
    field: 'Texnika va IT',
    description: 'Siz mantiqiy fikrlash va texnik masalalar hal qilishga moyilsiz.',
    directions: ['Dasturiy injiniring', 'Kompyuter injiniringi', 'Telekommunikatsiya', 'Mexanika'],
    universities: ['TATU', 'INHA', 'TDTU', 'TATU Urganch'],
  },
  tibbiyot: {
    field: 'Tibbiyot',
    description: 'Siz odamlarga yordam berish va tibbiyot sohasiga qiziqasiz.',
    directions: ['Davolash ishi', 'Stomatologiya', 'Farmasevtika', 'Hamshiralik'],
    universities: ['TTA', 'SamDTU', 'ADTI', 'TTA Urganch'],
  },
  gumanitar: {
    field: 'Gumanitar fanlar',
    description: 'Siz ijtimoiy fanlar, til va huquq sohasiga moyilsiz.',
    directions: ['Yurisprudensiya', 'Tarix', 'Filologiya', 'Pedagogika'],
    universities: ['TDYU', 'SamDU', "O'zMU", 'UrDU'],
  },
  iqtisod: {
    field: 'Iqtisodiyot va biznes',
    description: 'Siz moliya, iqtisodiyot va menejment sohasiga qiziqasiz.',
    directions: ['Buxgalteriya hisobi', 'Bank ishi', 'Menejment', 'Xalqaro iqtisodiyot'],
    universities: ['TDIU', 'TMI', 'JIDU', 'FarDU'],
  },
};

app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', site: SITE_NAME, url: SITE_URL, database: 'supabase' }),
);

app.get('/sitemap.xml', async (_, res) => {
  try {
    res.type('application/xml').send(await buildSitemapXml());
  } catch (err) {
    console.error(err);
    res.status(500).send('Sitemap xatoligi');
  }
});

app.get('/robots.txt', (_, res) => {
  res.type('text/plain').send(buildRobotsTxt());
});

app.get('/api/stats', async (_, res) => {
  try {
    const [uni, reg, dir, top] = await Promise.all([
      supabaseAdmin.from('universities').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('regions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('directions').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('universities').select('*', { count: 'exact', head: true }).eq('is_top', true),
    ]);
    res.json({
      universities: uni.count || 0,
      regions: reg.count || 0,
      directions: dir.count || 0,
      topUniversities: top.count || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/regions', async (_, res) => {
  const { data, error } = await supabaseAdmin.from('regions').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });

  const { data: unis } = await supabaseAdmin.from('universities').select('region_id');
  const counts = {};
  for (const u of unis || []) counts[u.region_id] = (counts[u.region_id] || 0) + 1;

  res.json(data.map((r) => ({ ...r, university_count: counts[r.id] || 0 })));
});

app.get('/api/universities', async (req, res) => {
  const { region, type, search, top } = req.query;
  let query = supabaseAdmin
    .from('universities')
    .select('*, regions(name, slug)')
    .order('is_top', { ascending: false })
    .order('name');

  if (type) query = query.eq('type', type);
  if (top === '1') query = query.eq('is_top', true);
  if (search) query = query.or(`name.ilike.%${search}%,short_name.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  let result = (data || []).map((u) => ({
    ...u,
    region_name: u.regions?.name,
    region_slug: u.regions?.slug,
    regions: undefined,
  }));

  if (region) result = result.filter((u) => u.region_slug === region);
  res.json(result);
});

app.get('/api/universities/:slug', async (req, res) => {
  const { data: uni, error } = await supabaseAdmin
    .from('universities')
    .select('*, regions(name, slug)')
    .eq('slug', req.params.slug)
    .single();

  if (error || !uni) return res.status(404).json({ error: 'OTM topilmadi' });

  const { data: directions } = await supabaseAdmin
    .from('directions')
    .select('*, admission_scores(grant_score, contract_score, year)')
    .eq('university_id', uni.id)
    .order('name');

  const flatDirections = (directions || []).map((d) => {
    const score = d.admission_scores?.[0];
    return {
      ...d,
      grant_score: score?.grant_score,
      contract_score: score?.contract_score,
      year: score?.year,
      admission_scores: undefined,
    };
  });

  res.json({
    ...uni,
    region_name: uni.regions?.name,
    region_slug: uni.regions?.slug,
    regions: undefined,
    directions: flatDirections,
  });
});

app.get('/api/scores', async (req, res) => {
  const { region, form, language, search } = req.query;
  const { data, error } = await supabaseAdmin
    .from('directions')
    .select(`
      name, faculty, education_form, education_language, quota,
      admission_scores(grant_score, contract_score, year),
      universities(name, short_name, slug, type, regions(name, slug))
    `);

  if (error) return res.status(500).json({ error: error.message });

  let rows = (data || []).map((d) => {
    const u = d.universities;
    const s = d.admission_scores?.[0];
    return {
      university_name: u?.name,
      short_name: u?.short_name,
      university_slug: u?.slug,
      type: u?.type,
      region_name: u?.regions?.name,
      region_slug: u?.regions?.slug,
      direction_name: d.name,
      faculty: d.faculty,
      education_form: d.education_form,
      education_language: d.education_language,
      quota: d.quota,
      grant_score: s?.grant_score,
      contract_score: s?.contract_score,
      year: s?.year,
    };
  });

  if (region) rows = rows.filter((r) => r.region_slug === region);
  if (form) rows = rows.filter((r) => r.education_form === form);
  if (language) rows = rows.filter((r) => r.education_language === language);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (r) => r.university_name?.toLowerCase().includes(q) || r.direction_name?.toLowerCase().includes(q),
    );
  }

  rows.sort((a, b) => (b.grant_score ?? 0) - (a.grant_score ?? 0));
  res.json(rows);
});

app.post('/api/calculator', async (req, res) => {
  const { subjects } = req.body;
  if (!subjects || typeof subjects !== 'object') {
    return res.status(400).json({ error: 'Fanlar ma\'lumotini kiriting' });
  }

  const weights = {
    matematika: 3.1, fizika: 2.5, kimyo: 2.5, biologiya: 2.5,
    ona_tili: 2.0, tarix: 2.0, ingliz_tili: 2.0, geografiya: 2.0,
  };

  let totalScore = 0;
  const maxPossible = Object.entries(subjects).reduce((sum, [s]) => sum + 100 * (weights[s] || 2.0), 0);

  for (const [subject, data] of Object.entries(subjects)) {
    const weight = weights[subject] || 2.0;
    const correct = Number(data.correct) || 0;
    const total = Number(data.total) || 30;
    totalScore += (correct / total) * 100 * weight;
  }

  const normalizedScore = Math.round((totalScore / maxPossible) * 189 * 10) / 10;

  const { data: directions } = await supabaseAdmin
    .from('directions')
    .select('name, education_form, universities(name, short_name, slug), admission_scores(grant_score, contract_score)');

  const matches = (directions || [])
    .filter((d) => {
      const s = d.admission_scores?.[0];
      return (s?.grant_score && s.grant_score <= normalizedScore)
        || (s?.contract_score && s.contract_score <= normalizedScore);
    })
    .map((d) => ({
      name: d.universities?.name,
      short_name: d.universities?.short_name,
      slug: d.universities?.slug,
      direction_name: d.name,
      education_form: d.education_form,
      grant_score: d.admission_scores?.[0]?.grant_score,
      contract_score: d.admission_scores?.[0]?.contract_score,
    }))
    .slice(0, 20);

  res.json({
    totalScore: normalizedScore,
    maxScore: 189,
    matches,
    message: normalizedScore >= 140
      ? 'Tabriklaymiz! Siz ko\'plab OTMlarga kirish imkoniyatiga egasiz.'
      : normalizedScore >= 100
        ? 'Kontrakt asosida ko\'plab yo\'nalishlarga ariza berishingiz mumkin.'
        : 'Ballaringizni oshirish uchun qo\'shimcha tayyorgarlik tavsiya etiladi.',
  });
});

app.get('/api/news', async (req, res) => {
  const { featured, category } = req.query;
  let query = supabaseAdmin.from('news').select('*').order('published_at', { ascending: false });
  if (featured === '1') query = query.eq('is_featured', true);
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/news/:slug', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('news').select('*').eq('slug', req.params.slug).single();
  if (error || !data) return res.status(404).json({ error: 'Yangilik topilmadi' });
  res.json(data);
});

app.get('/api/career-test', async (_, res) => {
  const { data, error } = await supabaseAdmin.from('career_questions').select('id, question, options').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/career-test/submit', optionalAuth, async (req, res) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Javoblarni yuboring' });
  }

  const fieldCounts = {};
  for (const answer of answers) {
    if (answer?.field) fieldCounts[answer.field] = (fieldCounts[answer.field] || 0) + 1;
  }

  const topField = Object.entries(fieldCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'texnika';
  const result = CAREER_RECOMMENDATIONS[topField];

  if (req.user) {
    const userClient = createUserClient(req.accessToken);
    await userClient.from('career_test_results').insert({
      user_id: req.user.id,
      result_field: topField,
      result_data: result,
      scores: fieldCounts,
    });
  }

  res.json({ result, scores: fieldCounts, saved: !!req.user });
});

app.get('/api/career-test/history', requireAuth, async (req, res) => {
  const userClient = createUserClient(req.accessToken);
  const { data, error } = await userClient
    .from('career_test_results')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── Aloqa ───
app.post('/api/contact', contactLimiter, optionalAuth, async (req, res) => {
  const name = sanitizeString(req.body.name, 100);
  const email = sanitizeString(req.body.email, 150);
  const phone = sanitizeString(req.body.phone, 20);
  const subject = sanitizeString(req.body.subject, 200);
  const message = sanitizeString(req.body.message, 2000);

  if (name.length < 2) return res.status(400).json({ error: 'Ism kamida 2 harf bo\'lishi kerak' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Email noto\'g\'ri' });
  if (subject.length < 3) return res.status(400).json({ error: 'Mavzu kiriting' });
  if (message.length < 10) return res.status(400).json({ error: 'Xabar kamida 10 ta belgi bo\'lishi kerak' });

  const { data, error } = await supabaseAdmin.rpc('submit_contact', {
    p_name: name,
    p_email: email,
    p_phone: phone || '',
    p_subject: subject,
    p_message: message,
    p_user_id: req.user?.id || null,
  });

  if (error) return res.status(500).json({ error: 'Xabar yuborilmadi. Keyinroq urinib ko\'ring.' });
  res.json({ success: true, message: 'Xabaringiz qabul qilindi. Tez orada javob beramiz!' });
});

// ─── DTM Practice Tests ───
app.get('/api/practice-tests', async (_, res) => {
  const { data, error } = await supabaseAdmin
    .from('practice_tests')
    .select('id, title, slug, description, subject, duration_minutes, total_questions')
    .eq('is_active', true)
    .order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/practice-tests/:slug', async (req, res) => {
  const { data: test, error } = await supabaseAdmin
    .from('practice_tests')
    .select('id, title, slug, description, subject, duration_minutes, total_questions')
    .eq('slug', req.params.slug)
    .eq('is_active', true)
    .single();

  if (error || !test) return res.status(404).json({ error: 'Test topilmadi' });

  const { data: questions } = await supabaseAdmin
    .from('practice_test_questions')
    .select('id, question, options, order_num')
    .eq('test_id', test.id)
    .order('order_num');

  res.json({ ...test, questions: questions || [] });
});

app.post('/api/practice-tests/:slug/submit', requireAuth, async (req, res) => {
  const { answers, time_spent_seconds } = req.body;
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Javoblarni yuboring' });
  }

  const { data: test } = await supabaseAdmin
    .from('practice_tests')
    .select('id, total_questions')
    .eq('slug', req.params.slug)
    .eq('is_active', true)
    .single();

  if (!test) return res.status(404).json({ error: 'Test topilmadi' });

  const { data: questions } = await supabaseAdmin
    .from('practice_test_questions')
    .select('id, correct_index')
    .eq('test_id', test.id);

  let correctCount = 0;
  const totalCount = questions?.length || 0;

  for (const q of questions || []) {
    if (Number(answers[q.id]) === q.correct_index) correctCount++;
  }

  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100 * 100) / 100 : 0;

  const userClient = createUserClient(req.accessToken);
  const { data: attempt, error } = await userClient
    .from('practice_test_attempts')
    .insert({
      user_id: req.user.id,
      test_id: test.id,
      answers,
      score,
      correct_count: correctCount,
      total_count: totalCount,
      time_spent_seconds: time_spent_seconds || null,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    score,
    correctCount,
    totalCount,
    percentage: score,
    attemptId: attempt.id,
  });
});

app.get('/api/practice-tests/history/me', requireAuth, async (req, res) => {
  const userClient = createUserClient(req.accessToken);
  const { data, error } = await userClient
    .from('practice_test_attempts')
    .select('*, practice_tests(title, slug, subject)')
    .order('completed_at', { ascending: false })
    .limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ─── Auth profile ───
app.get('/api/profile', requireAuth, async (req, res) => {
  const userClient = createUserClient(req.accessToken);
  const { data, error } = await userClient.from('profiles').select('*').single();
  if (error) return res.status(404).json({ error: 'Profil topilmadi' });
  res.json({ ...data, email: req.user.email });
});

app.put('/api/profile', requireAuth, async (req, res) => {
  const full_name = sanitizeString(req.body.full_name, 100);
  const phone = sanitizeString(req.body.phone, 20);
  const region = sanitizeString(req.body.region, 100);

  const userClient = createUserClient(req.accessToken);
  const { data, error } = await userClient
    .from('profiles')
    .update({ full_name, phone, region, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

if (isProduction && fs.existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: '1d', index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.message?.includes('CORS') ? 403 : 500).json({
    error: err.message?.includes('CORS') ? 'Ruxsat etilmagan manba' : 'Server xatoligi',
  });
});

app.listen(PORT, () => {
  console.log(`${SITE_NAME} → ${SITE_URL}`);
  console.log(`Supabase API: http://localhost:${PORT}`);
});
