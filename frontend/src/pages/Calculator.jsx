import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';

const subjects = [
  { key: 'matematika', label: 'Matematika', total: 30 },
  { key: 'fizika', label: 'Fizika', total: 30 },
  { key: 'kimyo', label: 'Kimyo', total: 30 },
  { key: 'biologiya', label: 'Biologiya', total: 30 },
  { key: 'ona_tili', label: 'Ona tili', total: 30 },
  { key: 'tarix', label: 'Tarix', total: 30 },
  { key: 'ingliz_tili', label: 'Ingliz tili', total: 30 },
];

const formLabels = {
  kunduzgi: 'Kunduzgi',
  sirtqi: 'Sirtqi',
  kechki: 'Kechki',
  masofaviy: 'Masofaviy',
};

export default function Calculator() {
  useSeo({
    title: 'Ball kalkulyatori',
    description: 'DTM test ballaringizni hisoblang va qaysi OTMlarga kirish imkoniyati borligini bilib oling.',
    path: '/calculator',
  });
  const [values, setValues] = useState(
    Object.fromEntries(subjects.map((s) => [s.key, { correct: '', total: s.total }]))
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key, field, val) => {
    setValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: val },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {};
      for (const [key, data] of Object.entries(values)) {
        if (data.correct !== '') {
          payload[key] = { correct: Number(data.correct), total: Number(data.total) };
        }
      }
      const res = await api.calculateScore(payload);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="section-container max-w-4xl">
        <h1 className="heading-2 mb-2">Ball kalkulyatori</h1>
        <p className="body-2 mb-8">
          Har bir fandan to&apos;g&apos;ri javoblar sonini kiriting. Masalan: &ldquo;Tarixdan 15 ta, On tilidan 20 ta&rdquo;
        </p>

        <form onSubmit={handleSubmit} className="bg-silver rounded-xl p-8 mb-8">
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {subjects.map(({ key, label, total }) => (
              <div key={key} className="bg-white rounded-lg p-4 card-shadow">
                <label className="block text-sm font-semibold text-secondary mb-3">{label}</label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <span className="text-xs text-grey block mb-1">To&apos;g&apos;ri javoblar</span>
                    <input
                      type="number"
                      min="0"
                      max={total}
                      value={values[key].correct}
                      onChange={(e) => handleChange(key, 'correct', e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-grey-blue rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <span className="text-grey mt-5">/</span>
                  <div className="w-20">
                    <span className="text-xs text-grey block mb-1">Jami</span>
                    <input
                      type="number"
                      min="1"
                      value={values[key].total}
                      onChange={(e) => handleChange(key, 'total', e.target.value)}
                      className="w-full px-3 py-2 border border-grey-blue rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-error text-sm mb-4">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
            {loading ? 'Hisoblanmoqda...' : 'Ballni hisoblash'}
          </button>
        </form>

        {result && (
          <div className="space-y-6">
            <div className="bg-primary/10 border border-primary rounded-xl p-8 text-center">
              <p className="text-sm text-grey mb-2">Sizning taxminiy balingiz</p>
              <p className="text-5xl font-bold text-primary mb-2">{result.totalScore}</p>
              <p className="text-sm text-grey">Maksimal: {result.maxScore} ball</p>
              <p className="mt-4 text-secondary font-medium">{result.message}</p>
            </div>

            {result.matches.length > 0 && (
              <div>
                <h2 className="heading-3 mb-4">Kirish imkoniyati bor OTMlar</h2>
                <div className="overflow-x-auto rounded-lg card-shadow">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-secondary text-white">
                        <th className="px-4 py-3 text-sm">OTM</th>
                        <th className="px-4 py-3 text-sm">Yo&apos;nalish</th>
                        <th className="px-4 py-3 text-sm">Shakl</th>
                        <th className="px-4 py-3 text-sm">Grant</th>
                        <th className="px-4 py-3 text-sm">Kontrakt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.matches.map((m, i) => (
                        <tr key={i} className="border-b hover:bg-silver/50">
                          <td className="px-4 py-3">
                            <Link to={`/universities/${m.slug}`} className="font-medium hover:text-primary">
                              {m.short_name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm">{m.direction_name}</td>
                          <td className="px-4 py-3 text-sm">{formLabels[m.education_form]}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-primary">{m.grant_score ?? '—'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-info">{m.contract_score ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
