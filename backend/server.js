import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDatabase } from './db.js';
import { buildRobotsTxt, buildSitemapXml } from './sitemap.js';
import { SITE_NAME, SITE_URL } from '../shared/site.constants.js';

initDatabase();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const distPath = path.join(__dirname, '../frontend/dist');
const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(distPath);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ status: 'ok', site: SITE_NAME, url: SITE_URL }));

app.get('/sitemap.xml', (_, res) => {
  res.type('application/xml').send(buildSitemapXml());
});

app.get('/robots.txt', (_, res) => {
  res.type('text/plain').send(buildRobotsTxt());
});

app.get('/api/stats', (_, res) => {
  const stats = {
    universities: db.prepare('SELECT COUNT(*) as count FROM universities').get().count,
    regions: db.prepare('SELECT COUNT(*) as count FROM regions').get().count,
    directions: db.prepare('SELECT COUNT(*) as count FROM directions').get().count,
    topUniversities: db.prepare('SELECT COUNT(*) as count FROM universities WHERE is_top = 1').get().count,
  };
  res.json(stats);
});

app.get('/api/regions', (_, res) => {
  const regions = db.prepare(`
    SELECT r.*, COUNT(u.id) as university_count
    FROM regions r
    LEFT JOIN universities u ON u.region_id = r.id
    GROUP BY r.id
    ORDER BY r.name
  `).all();
  res.json(regions);
});

app.get('/api/universities', (req, res) => {
  const { region, type, search, top } = req.query;
  let sql = `
    SELECT u.*, r.name as region_name, r.slug as region_slug
    FROM universities u
    JOIN regions r ON r.id = u.region_id
    WHERE 1=1
  `;
  const params = [];

  if (region) {
    sql += ' AND r.slug = ?';
    params.push(region);
  }
  if (type) {
    sql += ' AND u.type = ?';
    params.push(type);
  }
  if (top === '1') {
    sql += ' AND u.is_top = 1';
  }
  if (search) {
    sql += ' AND (u.name LIKE ? OR u.short_name LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY u.is_top DESC, u.name';
  const universities = db.prepare(sql).all(...params);
  res.json(universities);
});

app.get('/api/universities/:slug', (req, res) => {
  const university = db.prepare(`
    SELECT u.*, r.name as region_name, r.slug as region_slug
    FROM universities u
    JOIN regions r ON r.id = u.region_id
    WHERE u.slug = ?
  `).get(req.params.slug);

  if (!university) return res.status(404).json({ error: 'OTM topilmadi' });

  const directions = db.prepare(`
    SELECT d.*, s.grant_score, s.contract_score, s.year
    FROM directions d
    LEFT JOIN admission_scores s ON s.direction_id = d.id
    WHERE d.university_id = ?
    ORDER BY d.name
  `).all(university.id);

  res.json({ ...university, directions });
});

app.get('/api/scores', (req, res) => {
  const { region, form, language, search } = req.query;
  let sql = `
    SELECT u.name as university_name, u.short_name, u.slug as university_slug,
           u.type, r.name as region_name,
           d.name as direction_name, d.faculty, d.education_form, d.education_language, d.quota,
           s.grant_score, s.contract_score, s.year
    FROM directions d
    JOIN universities u ON u.id = d.university_id
    JOIN regions r ON r.id = u.region_id
    LEFT JOIN admission_scores s ON s.direction_id = d.id
    WHERE 1=1
  `;
  const params = [];

  if (region) {
    sql += ' AND r.slug = ?';
    params.push(region);
  }
  if (form) {
    sql += ' AND d.education_form = ?';
    params.push(form);
  }
  if (language) {
    sql += ' AND d.education_language = ?';
    params.push(language);
  }
  if (search) {
    sql += ' AND (u.name LIKE ? OR d.name LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY s.grant_score IS NULL, s.grant_score DESC, u.name';
  const scores = db.prepare(sql).all(...params);
  res.json(scores);
});

app.post('/api/calculator', (req, res) => {
  const { subjects } = req.body;
  if (!subjects || typeof subjects !== 'object') {
    return res.status(400).json({ error: 'Fanlar ma\'lumotini kiriting' });
  }

  const weights = {
    matematika: 3.1,
    fizika: 2.5,
    kimyo: 2.5,
    biologiya: 2.5,
    ona_tili: 2.0,
    tarix: 2.0,
    ingliz_tili: 2.0,
    geografiya: 2.0,
  };

  let totalScore = 0;
  let totalQuestions = 0;

  for (const [subject, data] of Object.entries(subjects)) {
    const weight = weights[subject] || 2.0;
    const correct = Number(data.correct) || 0;
    const total = Number(data.total) || 30;
    const subjectScore = (correct / total) * 100 * weight;
    totalScore += subjectScore;
    totalQuestions += total;
  }

  const maxPossible = Object.entries(subjects).reduce((sum, [s, d]) => {
    const weight = weights[s] || 2.0;
    return sum + 100 * weight;
  }, 0);

  const normalizedScore = Math.round((totalScore / maxPossible) * 189 * 10) / 10;

  const matches = db.prepare(`
    SELECT u.name, u.short_name, u.slug, d.name as direction_name,
           s.grant_score, s.contract_score, d.education_form
    FROM directions d
    JOIN universities u ON u.id = d.university_id
    LEFT JOIN admission_scores s ON s.direction_id = d.id
    WHERE (s.grant_score IS NOT NULL AND s.grant_score <= ?)
       OR (s.contract_score IS NOT NULL AND s.contract_score <= ?)
    ORDER BY COALESCE(s.grant_score, s.contract_score) DESC
    LIMIT 20
  `).all(normalizedScore, normalizedScore);

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

app.get('/api/news', (req, res) => {
  const { featured, category } = req.query;
  let sql = 'SELECT * FROM news WHERE 1=1';
  const params = [];

  if (featured === '1') {
    sql += ' AND is_featured = 1';
  }
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  sql += ' ORDER BY published_at DESC';
  const news = db.prepare(sql).all(...params);
  res.json(news);
});

app.get('/api/news/:slug', (req, res) => {
  const article = db.prepare('SELECT * FROM news WHERE slug = ?').get(req.params.slug);
  if (!article) return res.status(404).json({ error: 'Yangilik topilmadi' });
  res.json(article);
});

app.get('/api/career-test', (_, res) => {
  const questions = db.prepare('SELECT id, question, options FROM career_questions ORDER BY id').all();
  const parsed = questions.map(q => ({
    ...q,
    options: JSON.parse(q.options),
  }));
  res.json(parsed);
});

app.post('/api/career-test/submit', (req, res) => {
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Javoblarni yuboring' });
  }

  const fieldCounts = {};
  for (const answer of answers) {
    fieldCounts[answer.field] = (fieldCounts[answer.field] || 0) + 1;
  }

  const topField = Object.entries(fieldCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'texnika';

  const recommendations = {
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
      universities: ['TDYU', 'SamDU', 'O\'zMU', 'UrDU'],
    },
    iqtisod: {
      field: 'Iqtisodiyot va biznes',
      description: 'Siz moliya, iqtisodiyot va menejment sohasiga qiziqasiz.',
      directions: ['Buxgalteriya hisobi', 'Bank ishi', 'Menejment', 'Xalqaro iqtisodiyot'],
      universities: ['TDIU', 'TMI', 'JIDU', 'FarDU'],
    },
  };

  res.json({
    result: recommendations[topField],
    scores: fieldCounts,
  });
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
  res.status(500).json({ error: 'Server xatoligi' });
});

app.listen(PORT, () => {
  console.log(`${SITE_NAME} → ${SITE_URL}`);
  console.log(`API server: http://localhost:${PORT}${isProduction ? ' (production)' : ''}`);
});
