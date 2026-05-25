import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';

const categories = {
  qabul: 'Qabul',
  grant: 'Grantlar',
  imtihon: 'Imtihonlar',
  viloyat: 'Viloyatlar',
  test: 'Test',
  umumiy: 'Umumiy',
};

export default function News() {
  useSeo({
    title: 'Yangiliklar',
    description: 'DTM qabul, grantlar, imtihon sanalari va oliy ta\'lim yangiliklari — dtmdata.',
    path: '/news',
  });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNews()
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="heading-2 mb-2">&ldquo;Mening OTMim&rdquo; — Yangiliklar</h1>
        <p className="body-2 mb-10">
          Qabul kvotalari, imtihon sanalari, grantlar va ta&apos;lim tizimi yangiliklari
        </p>

        {loading ? (
          <div className="text-center py-20 text-grey">Yuklanmoqda...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article key={item.id} className="bg-white rounded-lg overflow-hidden card-shadow hover:shadow-lg transition-shadow">
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                    {categories[item.category] || item.category}
                  </span>
                  <h2 className="heading-4 mt-3 mb-2 line-clamp-2">{item.title}</h2>
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
      </div>
    </div>
  );
}
