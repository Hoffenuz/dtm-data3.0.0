import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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

export default function Scores() {
  useSeo({
    title: 'Kirish ballari',
    description: 'DTM grant va kontrakt kirish ballari jadvali — OTM va yo\'nalishlar bo\'yicha dtmdata.',
    path: '/scores',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [scores, setScores] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  const region = searchParams.get('region') || '';
  const form = searchParams.get('form') || '';
  const language = searchParams.get('language') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    api.getRegions().then(setRegions).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (region) params.region = region;
    if (form) params.form = form;
    if (language) params.language = language;
    if (search) params.search = search;
    api.getScores(params)
      .then(setScores)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [region, form, language, search]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="heading-2 mb-2">Kirish ballari</h1>
        <p className="body-2 mb-8">
          Grant va kontrakt ballari jadval ko&apos;rinishida — eng ko&apos;p ko&apos;riladigan sahifa
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <input
            type="text"
            placeholder="OTM yoki yo'nalish..."
            defaultValue={search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="px-4 py-3 border border-grey-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={region}
            onChange={(e) => updateFilter('region', e.target.value)}
            className="px-4 py-3 border border-grey-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Barcha viloyatlar</option>
            {regions.map((r) => (
              <option key={r.id} value={r.slug}>{r.name}</option>
            ))}
          </select>
          <select
            value={form}
            onChange={(e) => updateFilter('form', e.target.value)}
            className="px-4 py-3 border border-grey-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Ta&apos;lim shakli</option>
            {Object.entries(formLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={language}
            onChange={(e) => updateFilter('language', e.target.value)}
            className="px-4 py-3 border border-grey-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Ta&apos;lim tili</option>
            {Object.entries(langLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-grey">Yuklanmoqda...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg card-shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-4 text-sm font-semibold">OTM</th>
                  <th className="px-4 py-4 text-sm font-semibold">Yo&apos;nalish</th>
                  <th className="px-4 py-4 text-sm font-semibold">Shakl</th>
                  <th className="px-4 py-4 text-sm font-semibold">Til</th>
                  <th className="px-4 py-4 text-sm font-semibold">Grant balli</th>
                  <th className="px-4 py-4 text-sm font-semibold">Kontrakt balli</th>
                  <th className="px-4 py-4 text-sm font-semibold">Viloyat</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, i) => (
                  <tr key={i} className={`border-b border-grey-blue/20 ${i % 2 === 0 ? 'bg-white' : 'bg-silver/50'}`}>
                    <td className="px-4 py-3">
                      <Link to={`/universities/${s.university_slug}`} className="text-sm font-medium hover:text-primary">
                        {s.short_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm">{s.direction_name}</td>
                    <td className="px-4 py-3 text-sm">{formLabels[s.education_form]}</td>
                    <td className="px-4 py-3 text-sm">{langLabels[s.education_language]}</td>
                    <td className="px-4 py-3 text-sm font-bold text-primary">{s.grant_score ?? '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-info">{s.contract_score ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-grey">{s.region_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-xs text-grey-light mt-4">
          * Mock-data: 2024-yil o&apos;rtacha ko&apos;rsatkichlari. Har yili qabul yakunlangach BMB saytidan yangilanadi.
        </p>
      </div>
    </div>
  );
}
