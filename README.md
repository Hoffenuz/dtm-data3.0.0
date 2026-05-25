# dtmdata

**Domen:** [dtmdata.uz](https://dtmdata.uz)

O'zbekiston OTMlari, DTM kirish ballari va qabul ma'lumotlari portali.

## Imkoniyatlar

- OTMlar katalogi — viloyat, tur va qidiruv bo'yicha
- Kirish ballari — grant/kontrakt jadvali
- Ball kalkulyatori — DTM test natijalari
- Yangiliklar — qabul, grant, imtihon xabarlari
- Kasbga yo'naltirish testi
- Xususiy va xorijiy OTMlar

## Texnologiyalar

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** Node.js, Express, SQLite

## O'rnatish (development)

```bash
git clone https://github.com/YOUR_USERNAME/dtmdata.git
cd dtmdata
npm run install:all
npm run seed
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Production deploy

```bash
npm run install:all
cp .env.example .env          # SITE_URL ni o'zgartiring
npm run start:prod
```

Server `frontend/dist` ni avtomatik xizmat qiladi va API `/api` ostida ishlaydi.

**Port:** `PORT=3001` (`.env` orqali)

## GitHub ga yuklash

Repoda `node_modules` yo'q — `.gitignore` ularni chiqarib tashlaydi. Clone qilgach `npm run install:all` bajaring.

```bash
git init
git add .
git commit -m "Initial commit: dtmdata portal"
git remote add origin https://github.com/YOUR_USERNAME/dtmdata.git
git push -u origin main
```

## Domen konfiguratsiyasi

Barcha domen sozlamalari `shared/site.constants.js` faylida markazlashtirilgan:

```js
DOMAIN = 'dtmdata.uz'
SITE_URL = 'https://dtmdata.uz'
```

Build vaqtida `sitemap.xml` / `robots.txt` avtomatik yangilanadi (42+ OTM va yangiliklar URL lari bilan).

Production da server `/sitemap.xml` va `/robots.txt` ni dinamik ham xizmat qiladi.

## SEO fayllar

| Fayl | Manzil |
|------|--------|
| `robots.txt` | `/robots.txt` |
| `sitemap.xml` | `/sitemap.xml` |
| `manifest.json` | `/manifest.json` |

Domen o'zgarganda `frontend/public/sitemap.xml`, `robots.txt` va `VITE_SITE_URL` ni yangilang.

## API

| Method | Endpoint |
|--------|----------|
| GET | `/api/regions` |
| GET | `/api/universities` |
| GET | `/api/universities/:slug` |
| GET | `/api/scores` |
| POST | `/api/calculator` |
| GET | `/api/news` |
| GET | `/api/career-test` |
| POST | `/api/career-test/submit` |

## Litsenziya

MIT
