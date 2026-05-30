import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

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

  if (loading) return <div className="section-container py-20 text-grey">Yuklanmoqda...</div>;
  if (!test) return <div className="section-container py-20 text-grey">Test topilmadi</div>;

  const questions = test.questions || [];
  const current = questions[step];
  const progress = questions.length ? ((step + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

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
    const scoreColor = result.score >= 70 ? 'text-primary' : result.score >= 40 ? 'text-warning' : 'text-error';
    return (
      <div className="section-container py-12 lg:py-16">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl p-8 lg:p-12 card-shadow text-center">
            <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-4 mb-6 ${scoreColor} border-current bg-silver/50`}>
              <span className={`text-4xl font-bold ${scoreColor}`}>{result.score}%</span>
            </div>
            <h2 className="heading-3 mb-2">Test yakunlandi!</h2>
            <p className="body-2 mb-1">
              {result.correctCount} ta to&apos;g&apos;ri / {result.totalCount} ta savol
            </p>
            <p className="text-sm text-grey mb-8">Natija hisobingizda saqlandi.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/tests" className="btn-primary">Boshqa testlar</Link>
              <button
                type="button"
                onClick={() => { setResult(null); setStep(0); setAnswers({}); }}
                className="btn-secondary"
              >
                Qayta topshirish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const options = current?.options;
  const optionsList = Array.isArray(options) ? options : [];

  return (
    <div className="pt-2 pb-8 min-h-[calc(100dvh-84px)]">
      <div className="section-container">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-8">
          <div className="min-w-0">
            <Link to="/tests" className="text-primary text-sm mb-4 inline-block hover:underline">
              ← Testlar
            </Link>

            <div className="mb-4 lg:hidden">
              <div className="flex justify-between text-sm text-grey mb-2">
                <span>Savol {step + 1} / {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-silver rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {current && (
              <div className="bg-white rounded-2xl p-6 lg:p-8 card-shadow mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                    {step + 1}
                  </span>
                  <h2 className="heading-4 pt-1.5">{current.question}</h2>
                </div>
                <div className="space-y-3">
                  {optionsList.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAnswer(current.id, i)}
                      className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                        answers[current.id] === i
                          ? 'border-primary bg-primary/5'
                          : 'border-grey-blue/30 hover:border-primary/50 hover:bg-silver/50'
                      }`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center ${
                        answers[current.id] === i
                          ? 'bg-primary text-white'
                          : 'bg-silver text-grey'
                      }`}
                      >
                        {OPTION_LETTERS[i]}
                      </span>
                      <span className="text-sm font-medium pt-1">{opt}</span>
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
                  disabled={submitting || answeredCount < questions.length}
                  className="btn-primary disabled:opacity-40"
                >
                  {submitting ? 'Tekshirilmoqda...' : user ? 'Yakunlash' : 'Kirish va yakunlash'}
                </button>
              )}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[92px] bg-silver/60 rounded-xl p-5">
              <p className="text-sm font-semibold text-secondary mb-4">Test jarayoni</p>
              <div className="flex justify-between text-sm text-grey mb-2">
                <span>Savol {step + 1} / {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden mb-6">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-grey mb-3">
                Javob berilgan: {answeredCount} / {questions.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setStep(i)}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors ${
                      i === step
                        ? 'bg-primary text-white'
                        : answers[q.id] !== undefined
                          ? 'bg-primary/20 text-primary'
                          : 'bg-white text-grey border border-grey-blue/30'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              {test.duration_minutes && (
                <p className="text-xs text-grey-light mt-6 pt-4 border-t border-grey-blue/20">
                  Tavsiya etilgan vaqt: {test.duration_minutes} daqiqa
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
