import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';

export default function PracticeTest() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useSeo({
    title: test?.title || 'DTM test',
    path: `/tests/${slug}`,
  });

  useEffect(() => {
    api.getPracticeTest(slug)
      .then(setTest)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="section-container py-20 text-center text-grey">Yuklanmoqda...</div>;
  if (!test) return <div className="section-container py-20 text-center text-grey">Test topilmadi</div>;

  const questions = test.questions || [];
  const current = questions[step];
  const progress = questions.length ? ((step + 1) / questions.length) * 100 : 0;

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/tests/${slug}` } });
      return;
    }

    setSubmitting(true);
    try {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const res = await api.submitPracticeTest(slug, answers, timeSpent);
      setResult(res);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="section-container py-16 max-w-lg mx-auto text-center">
        <div className="bg-silver rounded-xl p-10">
          <p className="text-6xl font-bold text-primary mb-2">{result.score}%</p>
          <p className="heading-4 mb-4">Test yakunlandi!</p>
          <p className="body-2 mb-6">
            {result.correctCount} ta to&apos;g&apos;ri / {result.totalCount} ta savol
          </p>
          <p className="text-sm text-grey mb-8">Natija hisobingizda saqlandi.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tests" className="btn-primary">Boshqa testlar</Link>
            <button onClick={() => { setResult(null); setStep(0); setAnswers({}); }} className="btn-secondary">
              Qayta topshirish
            </button>
          </div>
        </div>
      </div>
    );
  }

  const options = current?.options;
  const optionsList = Array.isArray(options) ? options : [];

  return (
    <div className="section-container py-12 max-w-2xl mx-auto">
      <Link to="/tests" className="text-primary text-sm mb-6 inline-block hover:underline">← Testlar</Link>
      <h1 className="heading-3 mb-2">{test.title}</h1>
      <p className="text-sm text-grey mb-6">{test.description}</p>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-grey mb-2">
          <span>Savol {step + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-silver rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {current && (
        <div className="bg-white rounded-xl p-8 card-shadow mb-6">
          <h2 className="heading-4 mb-6">{current.question}</h2>
          <div className="space-y-3">
            {optionsList.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAnswer(current.id, i)}
                className={`w-full text-left px-6 py-4 rounded-lg border transition-all text-sm font-medium ${
                  answers[current.id] === i
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-grey-blue/40 hover:border-primary hover:bg-primary/5'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="btn-secondary disabled:opacity-40"
        >
          Oldingi
        </button>

        {step < questions.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={answers[current?.id] === undefined}
            className="btn-primary disabled:opacity-40"
          >
            Keyingi
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < questions.length}
            className="btn-primary disabled:opacity-40"
          >
            {submitting ? 'Tekshirilmoqda...' : user ? 'Yakunlash' : 'Kirish va yakunlash'}
          </button>
        )}
      </div>
    </div>
  );
}
