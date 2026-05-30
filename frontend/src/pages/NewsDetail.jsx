import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

export default function NewsDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNewsArticle(slug)
      .then(setArticle)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useSeo({
    title: article?.title,
    description: article?.excerpt,
    path: article ? `/news/${slug}` : '/news',
  });

  if (loading) return <div className="section-container py-20 text-grey">Yuklanmoqda...</div>;
  if (!article) return <div className="section-container py-20 text-grey">Yangilik topilmadi</div>;

  const categoryLabel = categories[article.category] || article.category;

  return (
    <div className="pb-12 lg:pb-16">
      <div className="section-container pt-8 lg:pt-12">
        <Link to="/news" className="text-primary text-sm inline-flex items-center gap-1 hover:underline">
          ← Yangiliklar
        </Link>
      </div>

      <div className="section-container mt-6 lg:mt-8">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-48 sm:h-64 lg:h-[400px] object-cover rounded-xl lg:rounded-2xl"
        />
      </div>

      <article className="section-container mt-8 lg:mt-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16 xl:gap-24">
          <div className="min-w-0">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              {categoryLabel}
            </span>
            <h1 className="heading-2 mt-4 mb-3 text-left">{article.title}</h1>
            <p className="text-sm text-grey-light mb-8 lg:hidden">{article.published_at}</p>

            <div className="article-content">
              <p className="article-lead">{article.excerpt}</p>
              <div className="article-body">{article.content}</div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-8 bg-silver/60 rounded-xl p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-grey-light mb-2">Sana</p>
              <p className="text-sm text-secondary mb-6">{article.published_at}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-grey-light mb-2">Kategoriya</p>
              <p className="text-sm text-secondary mb-6">{categoryLabel}</p>
              <Link to="/news" className="text-primary text-sm font-medium hover:underline">
                Barcha yangiliklar →
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
