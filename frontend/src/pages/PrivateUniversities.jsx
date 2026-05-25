import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';

export default function PrivateUniversities() {
  useSeo({
    title: 'Xususiy va xorijiy OTMlar',
    description: 'Webster, Akfa, INHA, TMC va boshqa xususiy universitetlar qabul shartlari — dtmdata.',
    path: '/private',
  });
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getUniversities({ type: 'xususiy' }),
      api.getUniversities({ type: 'xorijiy' }),
    ])
      .then(([private_, foreign]) => setUniversities([...private_, ...foreign]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="heading-2 mb-2">Xususiy va Xorijiy OTMlar</h1>
        <p className="body-2 mb-4 max-w-3xl">
          Webster, Akfa, Kimyo (sobiq Yeoju), Cambridge, TMC, INHA, Amity kabi universitetlar qabul shartlari
          davlat OTMlaridan farq qiladi — DTM emas, ichki imtihon yoki IELTS orqali qabul qilinadi.
        </p>

        <div className="bg-warning/10 border border-warning/30 rounded-lg p-6 mb-10">
          <h3 className="font-semibold text-secondary mb-2">Muhim eslatma</h3>
          <p className="text-sm text-grey">
            Xususiy va xorijiy OTMlarga ariza berish tartibi har bir universitetda alohida.
            Ko&apos;pincha IELTS yoki ichki imtihon talab qilinadi. Grant ballari DTM tizimida ko&apos;rsatilmaydi.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-grey">Yuklanmoqda...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni) => (
              <Link
                key={uni.id}
                to={`/universities/${uni.slug}`}
                className="bg-white rounded-lg p-6 card-shadow hover:shadow-lg transition-all border-l-4 border-l-info group"
              >
                <span className="text-xs font-medium px-2 py-1 rounded bg-info/10 text-info">
                  {uni.type === 'xususiy' ? 'Xususiy' : 'Xorijiy filial'}
                </span>
                <h3 className="heading-4 mt-3 mb-1 group-hover:text-primary transition-colors">{uni.short_name}</h3>
                <p className="text-sm text-grey mb-2">{uni.name}</p>
                <p className="text-xs text-grey-light mb-3">{uni.region_name}</p>
                <p className="text-sm text-grey line-clamp-2">{uni.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
