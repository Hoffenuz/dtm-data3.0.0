import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';

const formLabels = {
  kunduzgi: 'Kunduzgi',
  sirtqi: 'Sirtqi',
  kechki: 'Kechki',
  masofaviy: 'Masofaviy',
};

const langLabels = {
  uzbek: "O'zbek",
  rus: 'Rus',
  qoraqalpoq: 'Qoraqalpoq',
  ingliz: 'Ingliz',
};

const typeLabels = {
  davlat: 'Davlat OTM',
  xususiy: 'Xususiy OTM',
  xorijiy: 'Xorijiy filial',
};

export default function UniversityDetail() {
  const { slug } = useParams();
  const [uni, setUni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formFilter, setFormFilter] = useState('kunduzgi');

  useEffect(() => {
    api.getUniversity(slug)
      .then(setUni)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useSeo({
    title: uni?.name,
    description: uni?.description,
    path: uni ? `/universities/${slug}` : '/universities',
  });

  if (loading) return <div className="section-container py-20 text-center text-grey">Yuklanmoqda...</div>;
  if (!uni) return <div className="section-container py-20 text-center text-grey">OTM topilmadi</div>;

  const filteredDirections = formFilter
    ? uni.directions.filter((d) => d.education_form === formFilter)
    : uni.directions;

  return (
    <div className="py-12">
      <div className="section-container">
        <Link to="/universities" className="text-primary text-sm mb-6 inline-flex items-center gap-1 hover:underline">
          ← OTMlar ro&apos;yxati
        </Link>

        <div className="bg-silver rounded-xl p-8 mb-10">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary text-white">
              {typeLabels[uni.type]}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white text-grey">
              {uni.region_name}
            </span>
            {uni.is_top === 1 && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-warning/20 text-secondary">Top OTM</span>
            )}
          </div>
          <h1 className="heading-2 mb-2">{uni.name}</h1>
          <p className="body-2 mb-4">{uni.description}</p>
          {uni.website && (
            <a href={uni.website} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
              Rasmiy sayt →
            </a>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <h2 className="heading-3">Yo&apos;nalishlar va kirish ballari</h2>
          {uni.directions.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label htmlFor="form-filter" className="text-sm text-grey whitespace-nowrap">
                Ta&apos;lim shakli:
              </label>
              <select
                id="form-filter"
                value={formFilter}
                onChange={(e) => setFormFilter(e.target.value)}
                className="px-4 py-2.5 border border-grey-blue rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white min-w-[160px]"
              >
                {Object.entries(formLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
                <option value="">Barchasi</option>
              </select>
            </div>
          )}
        </div>

        {uni.directions.length === 0 ? (
          <p className="text-grey">Yo&apos;nalishlar ma&apos;lumoti hozircha mavjud emas.</p>
        ) : filteredDirections.length === 0 ? (
          <p className="text-grey">
            {formLabels[formFilter]} shaklida yo&apos;nalishlar topilmadi. Boshqa filtrni tanlang.
          </p>
        ) : (
          <>
            <p className="text-sm text-grey mb-4">
              {filteredDirections.length} ta yo&apos;nalish
              {formFilter && ` · ${formLabels[formFilter]}`}
            </p>
            <div className="overflow-x-auto rounded-lg card-shadow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary text-white">
                    <th className="px-4 py-3 text-sm font-medium">Yo&apos;nalish</th>
                    <th className="px-4 py-3 text-sm font-medium">Fakultet</th>
                    <th className="px-4 py-3 text-sm font-medium">Ta&apos;lim shakli</th>
                    <th className="px-4 py-3 text-sm font-medium">Til</th>
                    <th className="px-4 py-3 text-sm font-medium">Grant</th>
                    <th className="px-4 py-3 text-sm font-medium">Kontrakt</th>
                    <th className="px-4 py-3 text-sm font-medium">Kvota</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDirections.map((d, i) => (
                    <tr key={d.id} className={`border-b border-grey-blue/30 hover:bg-silver/50 ${i % 2 === 0 ? 'bg-white' : 'bg-silver/30'}`}>
                      <td className="px-4 py-3 text-sm font-medium">{d.name}</td>
                      <td className="px-4 py-3 text-sm text-grey">{d.faculty}</td>
                      <td className="px-4 py-3 text-sm">{formLabels[d.education_form]}</td>
                      <td className="px-4 py-3 text-sm">{langLabels[d.education_language]}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary">
                        {d.grant_score ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-info">
                        {d.contract_score ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm">{d.quota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <p className="text-xs text-grey-light mt-4">
          * Ballar 2024-yil o&apos;rtacha ko&apos;rsatkichlari (namuna). Har yili BMB saytidan yangilanadi.
        </p>
      </div>
    </div>
  );
}
