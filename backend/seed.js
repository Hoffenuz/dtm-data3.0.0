import db, { initDatabase } from './db.js';

initDatabase();

const count = db.prepare('SELECT COUNT(*) as c FROM regions').get();
if (count.c > 0) {
  console.log('Database already seeded.');
  process.exit(0);
}

const insertRegion = db.prepare('INSERT INTO regions (name, slug) VALUES (?, ?)');
const insertUni = db.prepare(`
  INSERT INTO universities (name, short_name, slug, region_id, type, description, website, is_top)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertDir = db.prepare(`
  INSERT INTO directions (university_id, name, faculty, education_form, education_language, quota)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const insertScore = db.prepare(`
  INSERT INTO admission_scores (direction_id, year, grant_score, contract_score)
  VALUES (?, ?, ?, ?)
`);
const insertNews = db.prepare(`
  INSERT INTO news (title, slug, excerpt, content, category, image_url, published_at, is_featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertQuestion = db.prepare('INSERT INTO career_questions (question, options) VALUES (?, ?)');

const regions = [
  ['Toshkent shahri', 'toshkent-sh'],
  ['Xorazm viloyati', 'xorazm'],
  ['Samarqand viloyati', 'samarqand'],
  ["Farg'ona viloyati", 'fargona'],
  ['Andijon viloyati', 'andijon'],
  ['Namangan viloyati', 'namangan'],
  ['Buxoro viloyati', 'buxoro'],
  ['Qashqadaryo viloyati', 'qashqadaryo'],
  ['Surxondaryo viloyati', 'surxondaryo'],
  ['Sirdaryo viloyati', 'sirdaryo'],
  ['Jizzax viloyati', 'jizzax'],
  ['Navoiy viloyati', 'navoiy'],
  ["Qoraqalpog'iston Respublikasi", 'qoraqalpogiston'],
];

const regionIds = {};
for (const [name, slug] of regions) {
  const r = insertRegion.run(name, slug);
  regionIds[slug] = r.lastInsertRowid;
}

const universities = [
  // Toshkent
  ["O'zbekiston Milliy universiteti", "O'zMU", 'ozmu', 'toshkent-sh', 'davlat', "Fundamental fanlar, matematika, fizika va ijtimoiy fanlar bo'yicha yetakchi OTM.", 'https://nuu.uz', 1],
  ['Toshkent davlat yuridik universiteti', 'TDYU', 'tdyu', 'toshkent-sh', 'davlat', "O'zbekistondagi eng raqobatbardosh yuridik OTM.", 'https://tsul.uz', 1],
  ['Toshkent axborot texnologiyalari universiteti', 'TATU', 'tatu', 'toshkent-sh', 'davlat', 'IT, telekommunikatsiya va dasturiy injiniring markazi.', 'https://tuit.uz', 1],
  ['Toshkent tibbiyot akademiyasi', 'TTA', 'tta', 'toshkent-sh', 'davlat', 'Tibbiyot va stomatologiya yo\'nalishlari.', 'https://tma.uz', 1],
  ['Toshkent moliya instituti', 'TMI', 'tmi', 'toshkent-sh', 'davlat', 'Moliya, bank ishi va iqtisodiyot.', 'https://tmi.uz', 1],
  ['Jahon iqtisodiyoti va diplomatiya universiteti', 'JIDU', 'jidu', 'toshkent-sh', 'davlat', 'Xalqaro iqtisodiyot va diplomatiya.', 'https://uwed.uz', 1],
  ['INHA universiteti Toshkent', 'INHA', 'inha', 'toshkent-sh', 'xorijiy', 'Koreya asosidagi IT universiteti.', 'https://inha.uz', 1],
  ['Amity universiteti', 'Amity', 'amity', 'toshkent-sh', 'xorijiy', 'Xalqaro standartlardagi ta\'lim.', 'https://amity.uz', 0],
  ['Webster universiteti', 'Webster', 'webster', 'toshkent-sh', 'xorijiy', 'AQSh litsenziyali xususiy universitet.', 'https://webster.uz', 0],
  ['Akfa universiteti', 'Akfa', 'akfa', 'toshkent-sh', 'xususiy', 'Zamonaviy texnologiyalar va biznes.', 'https://akfauniversity.org', 0],
  ['Toshkent davlat iqtisodiyot universiteti', 'TDIU', 'tdiu', 'toshkent-sh', 'davlat', 'Iqtisodiyot va menejment yo\'nalishlari.', 'https://tsue.uz', 1],
  ['Toshkent davlat texnika universiteti', 'TDTU', 'tdtu', 'toshkent-sh', 'davlat', 'Muhandislik va texnika fanlari.', 'https://tdtu.uz', 0],
  ['Toshkent davlat pedagogika universiteti', 'TDPU', 'tdpu', 'toshkent-sh', 'davlat', 'Pedagogika va psixologiya.', 'https://tdpu.uz', 0],
  // Xorazm
  ['Urganch davlat universiteti', 'UrDU', 'urdu', 'xorazm', 'davlat', 'Xorazm viloyatining eng yirik OTMsi.', 'https://urdu.uz', 1],
  ['Toshkent tibbiyot akademiyasi Urganch filiali', 'TTA Urganch', 'tta-urganch', 'xorazm', 'davlat', 'Tibbiyot yo\'nalishlari.', 'https://ttaf.uz', 0],
  ['Muhammad al-Xorazmiy nomidagi TATU Urganch filiali', 'TATU Urganch', 'tatu-urganch', 'xorazm', 'davlat', 'IT va kompyuter injiniringi.', 'https://tuit.uz', 0],
  ['Urganch davlat pedagogika instituti', 'UrDPI', 'urdpi', 'xorazm', 'davlat', 'O\'qituvchilar tayyorlash.', 'https://urspi.uz', 0],
  // Samarqand
  ['Samarqand davlat universiteti', 'SamDU', 'samdu', 'samarqand', 'davlat', 'Tarixi boy universitet.', 'https://samdu.uz', 1],
  ['Samarqand davlat tibbiyot universiteti', 'SamDTU', 'samdtu', 'samarqand', 'davlat', 'Tibbiyot yo\'nalishlari markazi.', 'https://sammu.uz', 1],
  ['Samarqand davlat chet tillar instituti', 'SamDChTI', 'samdchti', 'samarqand', 'davlat', 'Tilshunoslik va tarjimonlik.', 'https://samdchti.uz', 0],
  ['Samarqand davlat arxitektura-qurilish universiteti', 'SamDAQU', 'samdaqu', 'samarqand', 'davlat', 'Arxitektura va qurilish.', 'https://samdaqu.uz', 0],
  // Farg'ona
  ["Farg'ona davlat universiteti", 'FarDU', 'fardu', 'fargona', 'davlat', 'Farg\'ona vodiysining yetakchi OTMsi.', 'https://fdu.uz', 1],
  ["Farg'ona politexnika instituti", 'FarPI', 'farpi', 'fargona', 'davlat', 'Texnika va muhandislik.', 'https://fpi.uz', 0],
  // Andijon
  ['Andijon davlat universiteti', 'AndDU', 'anddu', 'andijon', 'davlat', 'Gumanitar va tabiiy fanlar.', 'https://adu.uz', 1],
  ['Andijon davlat tibbiyot instituti', 'ADTI', 'adti', 'andijon', 'davlat', 'Tibbiyot mutaxassislari tayyorlash.', 'https://adti.uz', 1],
  // Namangan
  ['Namangan davlat universiteti', 'NamDU', 'namdu', 'namangan', 'davlat', 'Ko\'p yo\'nalishli davlat universiteti.', 'https://namdu.uz', 1],
  ['Namangan muhandislik-qurilish instituti', 'NamMQI', 'nammqi', 'namangan', 'davlat', 'Muhandislik va qurilish.', 'https://nammqi.uz', 0],
  // Buxoro
  ['Buxoro davlat universiteti', 'BuxDU', 'buxdu', 'buxoro', 'davlat', 'Buxoro viloyat universiteti.', 'https://buxdu.uz', 1],
  ['Buxoro muhandislik-texnologiya instituti', 'BuxMTI', 'buxmti', 'buxoro', 'davlat', 'Muhandislik texnologiyalari.', 'https://buxmti.uz', 0],
  // Qashqadaryo
  ['Qarshi davlat universiteti', 'QarDU', 'qardu', 'qashqadaryo', 'davlat', 'Qashqadaryo viloyat OTMsi.', 'https://qarshidu.uz', 1],
  ['Qarshi muhandislik-iqtisodiyot instituti', 'QarMII', 'qarmii', 'qashqadaryo', 'davlat', 'Muhandislik va iqtisodiyot.', 'https://qarmii.uz', 0],
  // Surxondaryo
  ['Termiz davlat universiteti', 'TermizDU', 'termizdu', 'surxondaryo', 'davlat', 'Surxondaryo viloyat universiteti.', 'https://tdpu.uz', 0],
  ['Termiz muhandislik-texnologiya instituti', 'TermizMTI', 'termizmti', 'surxondaryo', 'davlat', 'Texnologiya va muhandislik.', 'https://termezmti.uz', 0],
  // Sirdaryo
  ['Guliston davlat universiteti', 'GulDU', 'guldu', 'sirdaryo', 'davlat', 'Sirdaryo viloyat OTMsi.', 'https://guldu.uz', 0],
  // Jizzax
  ['Jizzax davlat pedagogika universiteti', 'JizDPU', 'jizdpu', 'jizzax', 'davlat', 'Pedagogika va ta\'lim.', 'https://jizpi.uz', 0],
  ['Jizzax politexnika instituti', 'JizPI', 'jizpi', 'jizzax', 'davlat', 'Politexnika yo\'nalishlari.', 'https://jizpi.uz', 0],
  // Navoiy
  ['Navoiy davlat konchilik va texnologiyalar universiteti', 'NavMTU', 'navmtu', 'navoiy', 'davlat', 'Kon va metallurgiya.', 'https://ndki.uz', 1],
  ['Navoiy davlat pedagogika instituti', 'NavDPI', 'navdpi', 'navoiy', 'davlat', 'Pedagog kadrlar tayyorlash.', 'https://ndpi.uz', 0],
  // Qoraqalpog'iston
  ["Nukus davlat pedagogika instituti", 'NukDPI', 'nukdpi', 'qoraqalpogiston', 'davlat', 'Qoraqalpoq tilida ta\'lim.', 'https://ndpi.uz', 0],
  ['Karakalpak State University', 'QorDU', 'qordu', 'qoraqalpogiston', 'davlat', 'Qoraqalpog\'iston respublika universiteti.', 'https://karsu.uz', 1],
  ['TMC Institut', 'TMC', 'tmc', 'toshkent-sh', 'xususiy', 'Xalqaro menejment va biznes.', 'https://tmc.uz', 0],
  ['Cambridge School of Business', 'Cambridge', 'cambridge', 'toshkent-sh', 'xususiy', 'Biznes va menejment ta\'limi.', 'https://cambridge.uz', 0],
];

const uniIds = {};

const directions = [
  ['tdyu', 'Yurisprudensiya', 'Yuridik fakultet', 'kunduzgi', 'uzbek', 120, 180.5, 165.2],
  ['ozmu', 'Matematika', 'Aniq fanlar', 'kunduzgi', 'uzbek', 80, 156.4, 120.5],
  ['tatu', 'Dasturiy injiniring', 'Kompyuter injiniringi', 'kunduzgi', 'uzbek', 100, 168.0, 145.3],
  ['urdu', 'Xorijiy til: Ingliz tili', 'Filologiya', 'kunduzgi', 'uzbek', 60, 160.2, 135.8],
  ['samdtu', 'Davolash ishi', 'Tibbiyot fakulteti', 'kunduzgi', 'uzbek', 150, 172.5, 150.0],
  ['tdiu', 'Buxgalteriya hisobi', 'Iqtisodiyot', 'sirtqi', 'uzbek', 50, null, 140.5],
  ['tta', 'Stomatologiya', 'Stomatologiya fakulteti', 'kunduzgi', 'uzbek', 90, 175.0, 155.0],
  ['jidu', 'Xalqaro iqtisodiyot', 'Xalqaro iqtisodiyot', 'kunduzgi', 'ingliz', 70, 165.0, 140.0],
  ['inha', 'Kompyuter injiniringi', 'IT fakultet', 'kunduzgi', 'ingliz', 80, 170.0, 148.0],
  ['samdu', 'Tarix', 'Tarix fakulteti', 'kunduzgi', 'uzbek', 40, 145.0, 115.0],
  ['fardu', 'Iqtisodiyot', 'Iqtisodiyot fakulteti', 'kunduzgi', 'uzbek', 60, 140.0, 110.0],
  ['adti', 'Davolash ishi', 'Tibbiyot', 'kunduzgi', 'uzbek', 100, 168.0, 142.0],
  ['anddu', 'Pedagogika', 'Pedagogika', 'kunduzgi', 'uzbek', 80, 130.0, 100.0],
  ['namdu', 'Muhandislik', 'Muhandislik', 'kunduzgi', 'uzbek', 70, 135.0, 105.0],
  ['buxdu', 'Huquqshunoslik', 'Yuridik', 'kunduzgi', 'uzbek', 50, 150.0, 125.0],
  ['qardu', 'Agroinjeneriya', 'Agrar', 'kunduzgi', 'uzbek', 45, 125.0, 95.0],
  ['navmtu', 'Metallurgiya', 'Kon-metallurgiya', 'kunduzgi', 'uzbek', 55, 130.0, 100.0],
  ['webster', 'Biznes boshqaruvi', 'Biznes', 'kunduzgi', 'ingliz', 40, null, null],
  ['akfa', 'Axborot texnologiyalari', 'IT', 'kunduzgi', 'ingliz', 60, null, null],
  ['tmc', 'Menejment', 'Biznes', 'kunduzgi', 'ingliz', 50, null, null],
  ['urdu', 'Matematika', 'Aniq fanlar', 'kunduzgi', 'uzbek', 40, 142.0, 118.0],
  ['urdu', 'Iqtisodiyot', 'Iqtisodiyot', 'kunduzgi', 'uzbek', 50, 138.0, 112.0],
  ['tatu-urganch', 'Telekommunikatsiya', 'IT', 'kunduzgi', 'uzbek', 35, 155.0, 130.0],
  ['ozmu', 'Fizika', 'Aniq fanlar', 'kunduzgi', 'uzbek', 60, 152.0, 125.0],
  ['tdtu', 'Mexanika', 'Muhandislik', 'kunduzgi', 'uzbek', 70, 148.0, 120.0],
  ['tmi', 'Bank ishi', 'Moliya', 'kunduzgi', 'uzbek', 55, 160.0, 135.0],
  ['amity', 'Dasturiy ta\'minot', 'IT', 'kunduzgi', 'ingliz', 65, null, null],
  ['cambridge', 'MBA', 'Biznes', 'sirtqi', 'ingliz', 30, null, null],
];

const newsItems = [
  ['2025-yil qabul kvotalari tasdiqlandi', '2025-kvotalar', 'BMB tomonidan 2025-yil qabul kvotalari rasmiy e\'lon qilindi.', 'Oliy ta\'lim muassasalariga 2025-yil uchun qabul kvotalari tasdiqlandi. Abituriyentlar DTM tizimi orqali ariza topshirishlari mumkin.', 'qabul', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', '2025-05-20', 1],
  ['El-yurt umidi granti — yangi bosqich', 'el-yurt-umidi', 'Chet el universitetlarida o\'qish uchun grant dasturi davom etmoqda.', 'El-yurt umidi granti doirasida 500 ta abituriyent tanlov natijalari e\'lon qilindi.', 'grant', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600', '2025-05-15', 1],
  ['DTM test imtihonlari sanalari', 'dtm-sanalar', '2025-yil DTM test imtihonlari jadvali e\'lon qilindi.', 'Test imtihonlari iyun-iyul oylarida o\'tkaziladi. Ro\'yxatdan o\'tish 1-iyundan boshlanadi.', 'imtihon', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600', '2025-05-10', 1],
  ['Xususiy OTMlar qabul jarayoni', 'xususiy-qabul', 'Xususiy universitetlar ichki imtihon va IELTS asosida qabul qiladi.', 'Webster, Akfa, TMC kabi xususiy OTMlar alohida qabul tartibiga ega.', 'qabul', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600', '2025-05-05', 0],
  ['Xorazm viloyati OTMlari haqida', 'xorazm-otmlar', 'Xorazm viloyatidagi OTMlar va yo\'nalishlar ro\'yxati yangilandi.', 'UrDU, TTA filiali va TATU Urganch filiali haqida batafsil ma\'lumot.', 'viloyat', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600', '2025-05-01', 0],
  ['Kasbga yo\'naltirish testi yangilandi', 'test-yangilandi', 'Psixologik-professional test yangi savollar bilan boyitildi.', 'Abituriyentlar o\'z qiziqish yo\'nalishini aniqlash uchun testdan foydalanishlari mumkin.', 'test', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600', '2025-04-28', 0],
];

const seedTransaction = db.transaction(() => {
  for (const [name, short, slug, region, type, desc, web, top] of universities) {
    const r = insertUni.run(name, short, slug, regionIds[region], type, desc, web, top);
    uniIds[slug] = r.lastInsertRowid;
  }

  for (const [uniSlug, name, faculty, form, lang, quota, grant, contract] of directions) {
    const uniId = uniIds[uniSlug];
    if (!uniId) continue;
    const d = insertDir.run(uniId, name, faculty, form, lang, quota);
    insertScore.run(d.lastInsertRowid, 2024, grant, contract);
  }

  for (const [title, slug, excerpt, content, cat, img, date, featured] of newsItems) {
    insertNews.run(title, slug, excerpt, content, cat, img, date, featured);
  }

  const questions = [
    ['Qaysi fan sizga eng qiziq?', JSON.stringify([
      { text: 'Matematika va fizika', field: 'texnika' },
      { text: 'Biologiya va kimyo', field: 'tibbiyot' },
      { text: 'Tarix va adabiyot', field: 'gumanitar' },
      { text: 'Iqtisodiyot va biznes', field: 'iqtisod' },
    ])],
    ['Bo\'sh vaqtingizda nima qilishni yoqtirasiz?', JSON.stringify([
      { text: 'Kompyuter va dasturlash', field: 'texnika' },
      { text: 'Odamlarga yordam berish', field: 'tibbiyot' },
      { text: 'Kitob o\'qish va yozish', field: 'gumanitar' },
      { text: 'Savdo va moliya', field: 'iqtisod' },
    ])],
    ['Kelajakda qanday ish muhitini xohlaysiz?', JSON.stringify([
      { text: 'Laboratoriya yoki ofisda texnik ish', field: 'texnika' },
      { text: 'Kasalxonada yoki klinikada', field: 'tibbiyot' },
      { text: 'Maktab yoki universitetda', field: 'gumanitar' },
      { text: 'Bank yoki kompaniyada', field: 'iqtisod' },
    ])],
    ['Qaysi ko\'nikma sizda kuchli?', JSON.stringify([
      { text: 'Mantiqiy fikrlash va tahlil', field: 'texnika' },
      { text: 'Empatiya va sabr', field: 'tibbiyot' },
      { text: 'Nutq san\'ati va ijod', field: 'gumanitar' },
      { text: 'Rejalashtirish va tashkilot', field: 'iqtisod' },
    ])],
    ['Qaysi yo\'nalish sizga yaqinroq?', JSON.stringify([
      { text: 'Dasturiy injiniring', field: 'texnika' },
      { text: 'Davolash ishi', field: 'tibbiyot' },
      { text: 'Yurisprudensiya', field: 'gumanitar' },
      { text: 'Buxgalteriya hisobi', field: 'iqtisod' },
    ])],
  ];

  for (const [q, opts] of questions) {
    insertQuestion.run(q, opts);
  }
});

seedTransaction();
console.log(`Seeded ${universities.length} universities, ${directions.length} directions, ${newsItems.length} news items.`);
