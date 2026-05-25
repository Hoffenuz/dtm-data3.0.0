import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';

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

  if (loading) return <div className="section-container py-20 text-center text-grey">Yuklanmoqda...</div>;
  if (!article) return <div className="section-container py-20 text-center text-grey">Yangilik topilmadi</div>;

  return (
    <div className="py-12">
      <article className="section-container max-w-3xl">
        <Link to="/news" className="text-primary text-sm mb-6 inline-flex items-center gap-1 hover:underline">
          ← Yangiliklar
        </Link>
        <img src={article.image_url} alt={article.title} className="w-full h-64 object-cover rounded-xl mb-8" />
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
          {article.category}
        </span>
        <h1 className="heading-2 mt-4 mb-2">{article.title}</h1>
        <p className="text-sm text-grey-light mb-8">{article.published_at}</p>
        <div className="prose body-1 text-secondary leading-relaxed">
          <p className="mb-4 font-medium">{article.excerpt}</p>
          <p>{article.content}</p>
        </div>
      </article>
    </div>
  );
}
