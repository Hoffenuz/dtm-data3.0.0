import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';

const typeLabels = {
  davlat: 'Davlat',
  xususiy: 'Xususiy',
  xorijiy: 'Xorijiy filial',
};

export default function Universities() {
  useSeo({
    title: 'OTMlar katalogi',
    description: 'O\'zbekiston OTMlari viloyatlar, turi va ta\'lim shakli bo\'yicha — dtmdata katalogi.',
    path: '/universities',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [universities, setUniversities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  const region = searchParams.get('region') || '';
  const type = searchParams.get('type') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    api.getRegions().then(setRegions).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (region) params.region = region;
    if (type) params.type = type;
    if (search) params.search = search;
    api.getUniversities(params)
      .then(setUniversities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [region, type, search]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="heading-2 mb-2">Oliy ta&apos;lim muassasalari</h1>
        <p className="body-2 mb-8">Viloyatlar kesimida 150 dan ortiq OTMlar</p>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="OTM nomi bo'yicha qidirish..."
            defaultValue={search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="flex-1 px-4 py-3 border border-grey-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={region}
            onChange={(e) => updateFilter('region', e.target.value)}
            className="px-4 py-3 border border-grey-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Barcha viloyatlar</option>
            {regions.map((r) => (
              <option key={r.id} value={r.slug}>{r.name} ({r.university_count})</option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="px-4 py-3 border border-grey-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Barcha turlar</option>
            <option value="davlat">Davlat</option>
            <option value="xususiy">Xususiy</option>
            <option value="xorijiy">Xorijiy filial</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-grey">Yuklanmoqda...</div>
        ) : universities.length === 0 ? (
          <div className="text-center py-20 text-grey">OTM topilmadi</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni) => (
              <Link
                key={uni.id}
                to={`/universities/${uni.slug}`}
                className="bg-white rounded-lg p-6 card-shadow hover:shadow-lg transition-all border border-transparent hover:border-primary group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-silver text-grey">
                    {typeLabels[uni.type]}
                  </span>
                  {uni.is_top === 1 && (
                    <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">Top</span>
                  )}
                </div>
                <h3 className="heading-4 mb-1 group-hover:text-primary transition-colors">{uni.short_name}</h3>
                <p className="text-sm text-grey mb-2">{uni.name}</p>
                <p className="text-xs text-grey-light">{uni.region_name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
