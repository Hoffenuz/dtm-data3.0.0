import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';

const subjectLabels = {
  matematika: 'Matematika',
  ona_tili: 'Ona tili',
  tarix: 'Tarix',
  fizika: 'Fizika',
  ingliz_tili: 'Ingliz tili',
};

export default function PracticeTests() {
  useSeo({
    title: 'DTM testlar',
    description: 'DTM namuna testlari — natijalar hisobingizda saqlanadi.',
    path: '/tests',
  });

  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPracticeTests()
      .then(setTests)
      .catch(console.error)
      .finally(() => setLoading(false));

    if (user) {
      api.getPracticeHistory().then(setHistory).catch(() => {});
    }
  }, [user]);

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="heading-2 mb-2">DTM namuna testlari</h1>
        <p className="body-2 mb-8">
          Real DTM imtihoniga tayyorgarlik. Natijalar ro&apos;yxatdan o&apos;tgan foydalanuvchilarda saqlanadi.
          {!user && (
            <span> <Link to="/register" className="text-primary font-medium">Ro&apos;yxatdan o&apos;ting</Link> natijalarni saqlash uchun.</span>
          )}
        </p>

        {loading ? (
          <p className="text-grey text-center py-12">Yuklanmoqda...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {tests.map((test) => (
              <Link
                key={test.id}
                to={`/tests/${test.slug}`}
                className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition-all border-l-4 border-l-primary group"
              >
                <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                  {subjectLabels[test.subject] || test.subject}
                </span>
                <h3 className="heading-4 mt-3 mb-2 group-hover:text-primary transition-colors">{test.title}</h3>
                <p className="text-sm text-grey mb-4 line-clamp-2">{test.description}</p>
                <div className="flex gap-4 text-xs text-grey-light">
                  <span>{test.total_questions} savol</span>
                  <span>{test.duration_minutes} daqiqa</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {user && history.length > 0 && (
          <div>
            <h2 className="heading-3 mb-4">Mening natijalarim</h2>
            <div className="overflow-x-auto rounded-lg card-shadow">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary text-white">
                    <th className="px-4 py-3 text-sm">Test</th>
                    <th className="px-4 py-3 text-sm">Fan</th>
                    <th className="px-4 py-3 text-sm">Ball</th>
                    <th className="px-4 py-3 text-sm">To&apos;g&apos;ri</th>
                    <th className="px-4 py-3 text-sm">Sana</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b hover:bg-silver/50">
                      <td className="px-4 py-3 text-sm font-medium">{h.practice_tests?.title}</td>
                      <td className="px-4 py-3 text-sm">{subjectLabels[h.practice_tests?.subject] || h.practice_tests?.subject}</td>
                      <td className="px-4 py-3 text-sm font-bold text-primary">{h.score}%</td>
                      <td className="px-4 py-3 text-sm">{h.correct_count}/{h.total_count}</td>
                      <td className="px-4 py-3 text-sm text-grey">{new Date(h.completed_at).toLocaleDateString('uz-UZ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
