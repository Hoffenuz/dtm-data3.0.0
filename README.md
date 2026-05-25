# dtmdata

**Domen:** [dtmdata.uz](https://dtmdata.uz)

O'zbekiston OTMlari, DTM kirish ballari va qabul ma'lumotlari portali.

## Imkoniyatlar

- OTMlar katalogi — viloyat, tur va qidiruv bo'yicha
- Kirish ballari — grant/kontrakt jadvali
- Ball kalkulyatori — DTM test natijalari
- Yangiliklar — qabul, grant, imtihon xabarlari
- Kasbga yo'naltirish testi
- DTM amaliy testlar (login bilan natija saqlanadi)
- Ro'yxatdan o'tish / kirish (Supabase Auth)
- Aloqa formasi

## Texnologiyalar

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Ma'lumotlar bazasi:** Supabase (PostgreSQL)

## O'rnatish (development)

```bash
git clone https://github.com/YOUR_USERNAME/dtmdata.git
cd dtmdata
npm run install:all

# Muhit o'zgaruvchilari
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
# backend/.env va frontend/.env ichidagi Supabase kalitlarini to'ldiring

npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Production deploy

```bash
npm run install:all
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
# Production kalitlarini kiriting, NODE_ENV=production

npm run start:prod
```

Server `frontend/dist` ni avtomatik xizmat qiladi va API `/api` ostida ishlaydi.

**Port:** `PORT=3001` (`backend/.env` orqali)

## Muhit o'zgaruvchilari

| Fayl | O'zgaruvchilar |
|------|----------------|
| `backend/.env` | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `PORT`, `NODE_ENV` |
| `frontend/.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL` |

Namuna fayllar: `.env.example`, `frontend/.env.example`

## Aloqa (saytda ko'rsatiladi)

- Telegram: [@avtotestu_ad](https://t.me/avtotestu_ad)
- Telefon: +998-993333177

Sozlamalar: `shared/site.constants.js`

## Domen konfiguratsiyasi

```js
// shared/site.constants.js
DOMAIN = 'dtmdata.uz'
SITE_URL = 'https://dtmdata.uz'
```

## SEO fayllar

| Fayl | Manzil |
|------|--------|
| `robots.txt` | `/robots.txt` |
| `sitemap.xml` | `/sitemap.xml` |
| `manifest.json` | `/manifest.json` |

## API

| Method | Endpoint |
|--------|----------|
| GET | `/api/health` |
| GET | `/api/regions` |
| GET | `/api/universities` |
| GET | `/api/universities/:slug` |
| GET | `/api/scores` |
| POST | `/api/calculator` |
| GET | `/api/news` |
| GET | `/api/career-test` |
| POST | `/api/career-test/submit` |
| GET | `/api/practice-tests` |
| POST | `/api/contact` |
| GET/PUT | `/api/profile` (auth) |

## Litsenziya

MIT
