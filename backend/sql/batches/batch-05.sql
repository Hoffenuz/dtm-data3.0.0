INSERT INTO universities (name, short_name, slug, region_id, type, is_top)
VALUES
('Toshkent davlat yuridik universiteti Ixtisoslashtirilgan filiali', 'TDYUIF', 'toshkent-davlat-yuridik-universiteti-ixtisoslashtirilgan-filiali', (SELECT id FROM regions WHERE slug = 'toshkent-sh'), 'davlat', false),
('Toshkent farmatsevtika instituti', 'Toshkent farmatsevtika instituti', 'toshkent-farmatsevtika-instituti', (SELECT id FROM regions WHERE slug = 'toshkent-sh'), 'davlat', false),
('"Toshkent irrigatsiya va qishloq xo‘jaligini mexanizatsiyalash muhandislari instituti" Milliy tadqiqot universiteti', 'TIVQXM', 'toshkent-irrigatsiya-va-qishloq-xojaligini-mexanizatsiyalash-muhandislari-instit', (SELECT id FROM regions WHERE slug = 'toshkent-sh'), 'davlat', false),
('Toshkent kimyo-texnologiya instituti', 'Toshkent kimyo-texnologiya instituti', 'toshkent-kimyo-texnologiya-instituti', (SELECT id FROM regions WHERE slug = 'toshkent-sh'), 'davlat', false),
('Toshkent kimyo-texnologiya instituti Shahrisabz filiali', 'TKISF', 'toshkent-kimyo-texnologiya-instituti-shahrisabz-filiali', (SELECT id FROM regions WHERE slug = 'qashqadaryo'), 'davlat', false),
('Toshkent kimyo-texnologiya instituti Yangiyer filiali', 'TKIYF', 'toshkent-kimyo-texnologiya-instituti-yangiyer-filiali', (SELECT id FROM regions WHERE slug = 'sirdaryo'), 'davlat', false),
('Toshkent pediatriya tibbiyot instituti', 'Toshkent pediatriya tibbiyot instituti', 'toshkent-pediatriya-tibbiyot-instituti', (SELECT id FROM regions WHERE slug = 'toshkent-sh'), 'davlat', false),
('Toshkent tibbiyot akademiyasi Chirchiq filiali', 'Toshkent tibbiyot akademiyasi Chirchiq filiali', 'toshkent-tibbiyot-akademiyasi-chirchiq-filiali', (SELECT id FROM regions WHERE slug = 'toshkent-vil'), 'davlat', false),
('Toshkent tibbiyot akademiyasi Urganch filiali', 'Toshkent tibbiyot akademiyasi Urganch filiali', 'toshkent-tibbiyot-akademiyasi-urganch-filiali', (SELECT id FROM regions WHERE slug = 'xorazm'), 'davlat', false),
('Toshkent tibbiyot akademiyasining Termiz filiali', 'Toshkent tibbiyot akademiyasining Termiz filiali', 'toshkent-tibbiyot-akademiyasining-termiz-filiali', (SELECT id FROM regions WHERE slug = 'surxondaryo'), 'davlat', false),
('Toshkent to‘qimachilik va yengil sanoat instituti', 'TTVYSI', 'toshkent-toqimachilik-va-yengil-sanoat-instituti', (SELECT id FROM regions WHERE slug = 'toshkent-sh'), 'davlat', false),
('Urganch davlat pedagogika instituti', 'Urganch davlat pedagogika instituti', 'urganch-davlat-pedagogika-instituti', (SELECT id FROM regions WHERE slug = 'xorazm'), 'davlat', false),
('Zahiriddin Muhammad Bobur nomidagi Andijon davlat universiteti', 'ZMBNAD', 'zahiriddin-muhammad-bobur-nomidagi-andijon-davlat-universiteti', (SELECT id FROM regions WHERE slug = 'andijon'), 'davlat', false)
ON CONFLICT (slug) DO NOTHING;