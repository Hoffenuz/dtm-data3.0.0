/** Markaziy domen konfiguratsiyasi — barcha fayllar shu yerdan foydalanadi */
export const DOMAIN = 'dtmdata.uz';
export const SITE_URL = `https://${DOMAIN}`;
export const SITE_NAME = 'dtmdata';
export const SITE_PHONE = '+998-993333177';
export const SITE_PHONE_TEL = '+998993333177';
export const SITE_TELEGRAM = 'https://t.me/avtotestu_ad';
export const SITE_TELEGRAM_HANDLE = '@avtotestu_ad';

export const SEO = {
  title: `${SITE_NAME} — OTMlar, DTM kirish ballari va qabul ma'lumotlari`,
  description:
    "Abituriyentlar va ota-onalar uchun O'zbekiston OTMlari, DTM kirish ballari, grant va kontrakt kvotalari, ball kalkulyatori va qabul yangiliklari.",
  keywords:
    "dtmdata, DTM, BMB, OTM, oliy ta'lim, kirish ballari, grant ball, kontrakt ball, abituriyent, universitet, qabul 2025, DTM test, ball kalkulyator, O'zbekiston universitetlari, viloyat OTMlari, Xorazm universitetlari, Toshkent OTM, xususiy universitet, qabul jarayoni, yo'nalishlar, ta'lim shakli",
};

export const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/universities', priority: '0.9', changefreq: 'weekly' },
  { path: '/scores', priority: '0.9', changefreq: 'weekly' },
  { path: '/calculator', priority: '0.8', changefreq: 'monthly' },
  { path: '/news', priority: '0.8', changefreq: 'daily' },
  { path: '/career-test', priority: '0.7', changefreq: 'monthly' },
  { path: '/private', priority: '0.7', changefreq: 'monthly' },
  { path: '/universities?region=xorazm', priority: '0.8', changefreq: 'weekly' },
  { path: '/universities?region=toshkent-sh', priority: '0.8', changefreq: 'weekly' },
  { path: '/universities?region=samarqand', priority: '0.7', changefreq: 'weekly' },
];
