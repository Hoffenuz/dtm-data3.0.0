import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';

export default function CareerTest() {
  useSeo({
    title: 'Kasbga yo\'naltirish testi',
    description: 'Qaysi sohaga mos ekansiz? Psixologik-professional test — dtmdata.',
    path: '/career-test',
  });
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCareerTest()
      .then(setQuestions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAnswer = async (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const res = await api.submitCareerTest(newAnswers);
        setResult(res);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  if (loading) return <div className="section-container py-20 text-center text-grey">Yuklanmoqda...</div>;

  if (result) {
    const { result: rec } = result;
    return (
      <div className="py-12">
        <div className="section-container max-w-2xl text-center">
          <div className="bg-silver rounded-xl p-10 mb-8">
            <div className="text-5xl mb-4">🎯</div>
            <h1 className="heading-2 mb-4">Sizning natijangiz</h1>
            <p className="text-2xl font-semibold text-primary mb-4">{rec.field}</p>
            <p className="body-2 mb-6">{rec.description}</p>

            <div className="text-left bg-white rounded-lg p-6 card-shadow mb-6">
              <h3 className="font-semibold mb-3">Tavsiya etilgan yo&apos;nalishlar:</h3>
              <ul className="space-y-2">
                {rec.directions.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-left bg-white rounded-lg p-6 card-shadow">
              <h3 className="font-semibold mb-3">Tavsiya etilgan OTMlar:</h3>
              <div className="flex flex-wrap gap-2">
                {rec.universities.map((u) => (
                  <span key={u} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={restart} className="btn-secondary">Qayta topshirish</button>
            <Link to="/universities" className="btn-primary">OTMlarni ko&apos;rish</Link>
          </div>
        </div>
      </div>
    );
  }

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="py-12">
      <div className="section-container max-w-2xl">
        <h1 className="heading-2 mb-2 text-center">Kasbga yo&apos;naltirish testi</h1>
        <p className="body-2 mb-8 text-center">
          Qaysi sohaga qiziqishini bilmaydigan maktab bitiruvchilari uchun psixologik-professional test
        </p>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-grey mb-2">
            <span>Savol {step + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-silver rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 card-shadow">
          <h2 className="heading-4 mb-6 text-center">{current?.question}</h2>
          <div className="space-y-3">
            {current?.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="w-full text-left px-6 py-4 rounded-lg border border-grey-blue/40 hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
