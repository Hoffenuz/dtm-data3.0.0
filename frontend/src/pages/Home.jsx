import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';
import { SITE } from '../config/site';

const topUnis = ["O'zMU", 'TDYU', 'TATU', 'TTA', 'SamDU', 'UrDU', 'INHA'];

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
    icon: '🧮',
    title: 'Ball kalkulyatori',
    desc: "Test natijalaringizni kiritib, qaysi universitetlarga kirish imkoniyatingiz borligini bilib oling.",
  },
];

const statsIcons = ['🏛️', '📍', '📚', '⭐'];

export default function Home() {
  useSeo({ path: '/' });
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
    api.getNews({ featured: '1' }).then(setNews).catch(console.error);
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
        <div className="section-container py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="heading-1 mb-4">
                Oliy ta&apos;lim haqida{' '}
                <span className="text-primary">to&apos;liq ma&apos;lumot</span>
              </h1>
              <p className="body-1 mb-8 max-w-lg">
                Abituriyentlar va ota-onalar uchun OTMlar, kirish ballari va qabul jarayonlari haqida yagona portal.
              </p>
              <Link to="/universities" className="btn-primary">
                OTMlarni ko&apos;rish
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=500&fit=crop"
                alt="Universitet"
                className="rounded-lg shadow-lg max-w-md w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 pb-6">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-grey-blue" />
          <span className="w-2 h-2 rounded-full bg-grey-blue" />
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

      {/* Kalkulyator */}
      <section className="py-16 bg-white">
        <div className="section-container grid lg:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=400&fit=crop"
            alt="Kalkulyator"
            className="rounded-lg mx-auto"
          />
          <div>
            <h2 className="heading-2 mb-4">
              Test ballaringiz bilan qaysi OTMga kirish mumkin?
            </h2>
            <p className="body-2 mb-6">
              Abituriyent o&apos;zining majburiy va asosiy fanlardan yechgan testlari sonini kiritadi va tizim uning umumiy ballini hisoblab, shu ball bilan qaysi universitetlarga kirish imkoni borligini ro&apos;yxat qilib chiqarib beradi.
            </p>
            <Link to="/calculator" className="btn-primary">
              Kalkulyatorni ochish
            </Link>
          </div>
        </div>
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

      {/* Yangiliklar */}
      <section className="py-16 bg-white">
        <div className="section-container text-center mb-12">
          <h2 className="heading-4 mb-3">&ldquo;Mening OTMim&rdquo; — yangiliklar</h2>
          <p className="body-2 max-w-xl mx-auto">
            Ta&apos;lim tizimidagi yangiliklar, qabul kvotalari, imtihon sanalari va grantlar haqida tezkor xabarlar
          </p>
        </div>
        <div className="section-container grid md:grid-cols-3 gap-8">
          {news.slice(0, 3).map((item) => (
            <article key={item.id} className="relative rounded-lg overflow-hidden card-shadow group">
              <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-white m-4 p-4 rounded-lg card-shadow">
                <h3 className="font-semibold text-secondary text-sm mb-3 line-clamp-2">{item.title}</h3>
                <Link
                  to={`/news/${item.slug}`}
                  className="text-primary text-sm font-medium flex items-center justify-center gap-1 hover:underline"
                >
                  Batafsil
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
