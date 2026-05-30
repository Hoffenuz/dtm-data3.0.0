import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';
import { SITE } from '../config/site';

const topUnis = ["O'zMU", 'TDYU', 'TATU', 'TTA', 'SamDU', 'UrDU', 'INHA'];

const categories = {
  qabul: 'Qabul',
  grant: 'Grantlar',
  imtihon: 'Imtihonlar',
  viloyat: 'Viloyatlar',
  test: 'Test',
  umumiy: 'Umumiy',
};

const features = [
  {
    icon: '🎓',
    title: 'OTMlar katalogi',
    desc: "150 dan ortiq OTMlar viloyatlar, ta'lim shakli va tili bo'yicha tizimlashtirilgan.",
  },
  {
    icon: '📊',
    title: 'Kirish ballari',
    desc: "Grant va kontrakt ballari jadval ko'rinishida — qaysi yo'nalishga kirish mumkinligini bilib oling.",
  },
  {
    icon: '📰',
    title: 'Yangiliklar',
    desc: "Qabul kvotalari, imtihon sanalari va grantlar haqidagi tezkor xabarlar.",
  },
];

const statsIcons = ['🏛️', '📍', '📚', '⭐'];

export default function Home() {
  useSeo({ path: '/' });
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
    api.getNews().then(setNews).catch(console.error);
  }, []);

  const statItems = stats
    ? [
        { num: `${stats.universities}+`, label: 'OTMlar' },
        { num: `${stats.regions}`, label: 'Viloyat' },
        { num: `${stats.directions}+`, label: "Yo'nalishlar" },
        { num: `${stats.topUniversities}`, label: 'Top OTMlar' },
      ]
    : [];

  return (
    <>
      {/* Hero */}
      <section className="bg-silver relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="section-container relative py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <span className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Abituriyentlar uchun yagona portal
              </span>
              <h1 className="heading-1 mb-4">
                Oliy ta&apos;lim haqida{' '}
                <span className="text-primary">to&apos;liq ma&apos;lumot</span>
              </h1>
              <p className="body-1 mb-8 max-w-lg">
                Abituriyentlar va ota-onalar uchun OTMlar, kirish ballari va qabul jarayonlari haqida yagona portal.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/universities" className="btn-primary">
                  OTMlarni ko&apos;rish
                </Link>
                <Link to="/calculator" className="btn-secondary">
                  Ball kalkulyatori
                </Link>
                <Link to="/news" className="btn-secondary">
                  Yangiliklar
                </Link>
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="relative w-full max-w-lg">
                <div
                  className="absolute -inset-3 rotate-2 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5"
                  aria-hidden="true"
                />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/80">
                  <img
                    src="/images/oqish.webp"
                    alt="O'qish — oliy ta'lim va universitet hayoti"
                    className="aspect-[4/3] w-full object-cover object-center"
                    width={640}
                    height={480}
                    fetchPriority="high"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-secondary/50 via-secondary/5 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 backdrop-blur-sm card-shadow">
                    <p className="text-sm font-semibold text-secondary">2026-yil qabul mavsumi</p>
                    <p className="mt-1 text-xs text-grey">
                      OTMlar, kirish ballari va DTM testlari — barchasi {SITE.name} da
                    </p>
                  </div>
                </div>
                <div
                  className="absolute -bottom-4 -right-4 hidden rounded-xl bg-primary px-4 py-3 text-white shadow-lg sm:block"
                  aria-hidden="true"
                >
                  <p className="text-2xl font-bold leading-none">{stats?.universities || '150'}+</p>
                  <p className="text-xs font-medium opacity-90">OTMlar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center gap-2 pb-6" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-grey-blue" />
          <span className="h-2 w-2 rounded-full bg-grey-blue" />
        </div>
      </section>

      {/* Top OTMlar */}
      <section className="py-12 bg-white">
        <div className="section-container text-center mb-8">
          <h2 className="heading-4 mb-2">O&apos;zbekistonning yetakchi OTMlari</h2>
          <p className="body-2">Davlat va xorijiy universitetlar bir joyda</p>
        </div>
        <div className="section-container flex flex-wrap justify-center gap-8 lg:gap-16">
          {topUnis.map((name) => (
            <div
              key={name}
              className="w-16 h-16 rounded-full bg-silver flex items-center justify-center font-semibold text-secondary text-xs card-shadow hover:shadow-md transition-shadow"
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="section-container text-center mb-12">
          <h2 className="heading-2 mb-3">
            Nega <span className="text-primary">{SITE.name}</span>?
          </h2>
          <p className="body-2">Ma&apos;lumotlarni hududlar, ta&apos;lim shakllari va yo&apos;nalishlar bo&apos;yicha tizimlashtirdik</p>
        </div>
        <div className="section-container grid md:grid-cols-3 gap-8">
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="bg-silver rounded-lg p-8 text-center card-shadow hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="heading-4 mb-3">{title}</h3>
              <p className="body-3 text-sm leading-5 text-grey">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Yangiliklar */}
      <section className="py-16 bg-white">
        <div className="section-container flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="heading-2 mb-2">&ldquo;Mening OTMim&rdquo; — Yangiliklar</h2>
            <p className="body-2 max-w-xl">
              Qabul kvotalari, imtihon sanalari, grantlar va ta&apos;lim tizimi yangiliklari
            </p>
          </div>
          <Link to="/news" className="btn-secondary shrink-0">
            Barcha yangiliklar
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="section-container text-center py-12 text-grey">Yangiliklar tez orada...</div>
        ) : (
          <div className="section-container grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.slice(0, 6).map((item) => (
              <article key={item.id} className="bg-white rounded-lg overflow-hidden card-shadow hover:shadow-lg transition-shadow group">
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="p-6">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                    {categories[item.category] || item.category}
                  </span>
                  <h3 className="heading-4 mt-3 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="body-3 text-sm text-grey mb-4 line-clamp-2">{item.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-grey-light">{item.published_at}</span>
                    <Link
                      to={`/news/${item.slug}`}
                      className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      O&apos;qish
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="py-16 bg-silver">
        <div className="section-container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-2 mb-3">
              Raqamlarda <span className="text-primary">{SITE.name}</span>
            </h2>
            <p className="body-2 mb-6">O&apos;zbekistonning barcha viloyatlaridagi OTMlar haqida ma&apos;lumot</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {statItems.map(({ num, label }, i) => (
              <div key={label} className="flex items-center gap-4">
                <span className="text-2xl">{statsIcons[i]}</span>
                <div>
                  <p className="text-2xl font-semibold text-primary">{num}</p>
                  <p className="text-sm text-grey">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qabul jarayoni */}
      <section className="py-16 bg-white">
        <div className="section-container grid lg:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=400&fit=crop"
            alt="Qabul"
            className="rounded-lg mx-auto order-2 lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <h2 className="heading-2 mb-4">
              Qabul jarayonini qanday boshqarish kerak?
            </h2>
            <p className="body-2 mb-6">
              DTM tizimi orqali ariza topshirish, imtihon sanalari, kvotalar tasdiqlanishi va chet el universitetlariga grantlar (El-yurt umidi) haqidagi tezkor xabarlar — barchasi bir joyda.
            </p>
            <Link to="/news" className="btn-primary">
              Yangiliklarni o&apos;qish
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-silver">
        <div className="section-container grid lg:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=400&fit=crop"
            alt="Abituriyent"
            className="rounded-full w-56 h-56 object-cover mx-auto"
          />
          <div>
            <p className="body-1 italic mb-6 text-secondary">
              &ldquo;{SITE.name} yordamida Xorazmdagi barcha OTMlarni solishtirib, o&apos;zimga mos yo&apos;nalishni topdim.
              Kalkulyator orqali TDYU va UrDU ga kirish imkoniyatim borligini bilib oldim. Ota-onam ham sayt orqali
              qabul jarayonini kuzatib borishyapti.&rdquo;
            </p>
            <p className="font-semibold text-secondary">Aziza Karimova</p>
            <p className="text-sm text-grey">2024-yil abituriyenti, Xorazm viloyati</p>
            <div className="flex flex-wrap gap-4 mt-6 items-center">
              {topUnis.slice(0, 5).map((n) => (
                <span key={n} className="text-xs font-medium text-grey bg-white px-3 py-1 rounded">{n}</span>
              ))}
              <Link to="/universities" className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
                Barcha OTMlar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
