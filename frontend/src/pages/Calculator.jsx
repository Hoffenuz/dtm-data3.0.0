import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';
import {
  MANDATORY_SUBJECTS,
  PROFILE_WEIGHTS,
  MAX_SCORE,
  TOTAL_QUESTIONS,
  PROFILE_QUESTIONS,
} from '../lib/calculator';
import {
  loadBallData,
  getPrimarySubjects,
  getSecondarySubjects,
} from '../lib/subject-pairs';

const formLabels = {
  kunduzgi: 'Kunduzgi',
  sirtqi: 'Sirtqi',
  kechki: 'Kechki',
  masofaviy: 'Masofaviy',
};

const STEPS = [
  { id: 'primary', label: 'Asosiy fan', hint: "O'ng tomondan asosiy profil fanini tanlang" },
  { id: 'secondary', label: 'Ikkinchi fan', hint: 'Asosiy fan bilan mos ikkinchi fanni tanlang' },
  { id: 'mandatory', label: 'Majburiy fanlar', hint: '3 ta majburiy fan natijasini kiriting' },
  { id: 'profile', label: 'Profil fanlar', hint: 'Tanlangan profil fanlar natijasini kiriting' },
];

function Sidebar({
  step,
  primarySubject,
  secondarySubject,
  pendingPrimary,
  pendingSecondary,
  onBack,
  onContinue,
  canContinue,
  continueLabel,
}) {
  return (
    <aside className="lg:sticky lg:top-[92px] space-y-3">
      {step > 0 && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-grey hover:text-primary transition-colors"
        >
          ← Orqaga
        </button>
      )}

      <div className="bg-white rounded-xl p-4 card-shadow">
        <ol className="space-y-1">
          {STEPS.map((s, i) => (
            <li
              key={s.id}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm ${
                i === step
                  ? 'bg-primary/10 text-primary font-medium'
                  : i < step
                    ? 'text-primary'
                    : 'text-grey-light'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                i === step
                  ? 'bg-primary text-white'
                  : i < step
                    ? 'bg-primary/20 text-primary'
                    : 'bg-silver text-grey-light'
              }`}
              >
                {i < step ? '✓' : i + 1}
              </span>
              {s.label}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-2 text-xs">
        <span className="flex-1 bg-info/10 text-info rounded-lg px-3 py-2 font-medium">{TOTAL_QUESTIONS} savol</span>
        <span className="flex-1 bg-primary/10 text-primary rounded-lg px-3 py-2 font-medium">{MAX_SCORE} ball</span>
        <span className="flex-1 bg-secondary/10 text-secondary rounded-lg px-3 py-2 font-medium">1.1/3.1/2.1</span>
      </div>

      {(primarySubject || pendingPrimary) && (
        <div className="bg-white rounded-xl p-4 card-shadow space-y-1.5 text-sm">
          {(primarySubject || pendingPrimary) && (
            <div className="flex justify-between gap-2">
              <span className="text-grey text-xs">Asosiy</span>
              <span className="font-medium text-secondary text-right text-xs">{pendingPrimary || primarySubject}</span>
            </div>
          )}
          {(secondarySubject || pendingSecondary) && (
            <div className="flex justify-between gap-2">
              <span className="text-grey text-xs">Ikkinchi</span>
              <span className="font-medium text-secondary text-right text-xs">{pendingSecondary || secondarySubject}</span>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-grey leading-relaxed lg:hidden">{STEPS[step]?.hint}</p>

      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed hidden lg:flex"
        >
          {continueLabel || 'Davom etish →'}
        </button>
      )}
    </aside>
  );
}

function SubjectGrid({ subjects, selected, onSelect, search, onSearchChange, emptyMessage }) {
  const filtered = useMemo(() => {
    if (!search.trim()) return subjects;
    const q = search.toLowerCase();
    return subjects.filter((s) => s.toLowerCase().includes(q));
  }, [subjects, search]);

  return (
    <div>
      {subjects.length > 6 && (
        <div className="mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Fan qidirish..."
            className="w-full px-4 py-2 border border-grey-blue/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-silver/50"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-grey py-8 text-center">{emptyMessage || 'Fan topilmadi'}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {filtered.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(label)}
              className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                selected === label
                  ? 'border-primary bg-primary text-white'
                  : 'border-transparent bg-silver hover:bg-primary/10 hover:border-primary/30 text-secondary'
              }`}
            >
              <span className="font-medium text-sm leading-snug">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Calculator() {
  useSeo({
    title: 'Ball kalkulyatori',
    description: 'DTM test ballaringizni hisoblang — 90 savol, maksimal 189 ball.',
    path: '/calculator',
  });

  const [ballData, setBallData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  const [step, setStep] = useState(0);
  const [primarySubject, setPrimarySubject] = useState('');
  const [secondarySubject, setSecondarySubject] = useState('');
  const [pendingPrimary, setPendingPrimary] = useState('');
  const [pendingSecondary, setPendingSecondary] = useState('');
  const [primarySearch, setPrimarySearch] = useState('');
  const [secondarySearch, setSecondarySearch] = useState('');
  const [mandatoryAnswers, setMandatoryAnswers] = useState(
    Object.fromEntries(MANDATORY_SUBJECTS.map((s) => [s.key, ''])),
  );
  const [profileAnswers, setProfileAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBallData()
      .then(setBallData)
      .catch((err) => setDataError(err.message))
      .finally(() => setDataLoading(false));
  }, []);

  const primarySubjects = ballData ? getPrimarySubjects(ballData) : [];
  const secondarySubjects = ballData && (primarySubject || pendingPrimary)
    ? getSecondarySubjects(ballData, primarySubject || pendingPrimary)
    : [];

  const mandatoryComplete = MANDATORY_SUBJECTS.every(
    (s) => mandatoryAnswers[s.key] !== '' && Number(mandatoryAnswers[s.key]) >= 0,
  );

  const profileComplete = primarySubject && secondarySubject
    && profileAnswers[primarySubject] !== '' && profileAnswers[primarySubject] !== undefined
    && profileAnswers[secondarySubject] !== '' && profileAnswers[secondarySubject] !== undefined;

  const confirmPrimary = () => {
    if (!pendingPrimary) return;
    setPrimarySubject(pendingPrimary);
    setPendingSecondary('');
    setSecondarySearch('');
    setStep(1);
  };

  const confirmSecondary = () => {
    if (!pendingSecondary) return;
    setSecondarySubject(pendingSecondary);
    setProfileAnswers({ [primarySubject]: '', [pendingSecondary]: '' });
    setStep(2);
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.calculateScore({
        primarySubject,
        secondarySubject,
        mandatoryAnswers: Object.fromEntries(
          MANDATORY_SUBJECTS.map((s) => [s.key, { correct: Number(mandatoryAnswers[s.key]) }]),
        ),
        profileAnswers: {
          [primarySubject]: { correct: Number(profileAnswers[primarySubject]) },
          [secondarySubject]: { correct: Number(profileAnswers[secondarySubject]) },
        },
      });
      setResult(res);
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setPrimarySubject('');
    setSecondarySubject('');
    setPendingPrimary('');
    setPendingSecondary('');
    setPrimarySearch('');
    setSecondarySearch('');
    setMandatoryAnswers(Object.fromEntries(MANDATORY_SUBJECTS.map((s) => [s.key, ''])));
    setProfileAnswers({});
    setResult(null);
    setError('');
  };

  if (dataLoading) {
    return <div className="section-container py-20 text-grey">Fanlar ro&apos;yxati yuklanmoqda...</div>;
  }

  if (dataError) {
    return <div className="section-container py-20 text-error">Xatolik: {dataError}</div>;
  }

  if (result && step === 4) {
    return (
      <div className="py-10 lg:py-14">
        <div className="section-container max-w-5xl space-y-6">
          <div className="bg-primary/10 border border-primary rounded-2xl p-8 text-center">
            <p className="text-sm text-grey mb-2">Sizning taxminiy balingiz</p>
            <p className="text-5xl font-bold text-primary mb-2">{result.totalScore}</p>
            <p className="text-sm text-grey">Maksimal: {result.maxScore} ball · {TOTAL_QUESTIONS} savol</p>
            <p className="mt-4 text-secondary font-medium">{result.message}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 card-shadow">
            <h3 className="font-semibold text-secondary mb-4">Kiritilgan natijalar</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {MANDATORY_SUBJECTS.map((s) => {
                const correct = Number(mandatoryAnswers[s.key]) || 0;
                const points = Math.round(correct * s.pointsPerCorrect * 10) / 10;
                return (
                  <div key={s.key} className="flex justify-between bg-silver rounded-lg px-4 py-3">
                    <span>{s.label} <span className="text-grey text-xs">(1.1)</span></span>
                    <span className="font-medium">{correct}/{s.total} · {points} ball</span>
                  </div>
                );
              })}
              <div className="flex justify-between bg-silver rounded-lg px-4 py-3">
                <span>{primarySubject} <span className="text-grey text-xs">(1-fan, 3.1)</span></span>
                <span className="font-medium">
                  {profileAnswers[primarySubject]}/{PROFILE_QUESTIONS} ·{' '}
                  {Math.round(Number(profileAnswers[primarySubject]) * PROFILE_WEIGHTS.primary * 10) / 10} ball
                </span>
              </div>
              <div className="flex justify-between bg-silver rounded-lg px-4 py-3">
                <span>{secondarySubject} <span className="text-grey text-xs">(2-fan, 2.1)</span></span>
                <span className="font-medium">
                  {profileAnswers[secondarySubject]}/{PROFILE_QUESTIONS} ·{' '}
                  {Math.round(Number(profileAnswers[secondarySubject]) * PROFILE_WEIGHTS.secondary * 10) / 10} ball
                </span>
              </div>
            </div>
          </div>

          {result.matches.length > 0 ? (
            <div className="bg-white rounded-2xl overflow-hidden card-shadow">
              <div className="px-6 py-4 border-b border-grey-blue/20">
                <h2 className="heading-4">Kirish imkoniyati bor yo&apos;nalishlar</h2>
                <p className="text-sm text-grey mt-1">
                  {primarySubject} + {secondarySubject} · {result.matches.length} ta natija
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-secondary text-white">
                      <th className="px-4 py-3 text-sm">OTM</th>
                      <th className="px-4 py-3 text-sm">Yo&apos;nalish</th>
                      <th className="px-4 py-3 text-sm">Shakl</th>
                      <th className="px-4 py-3 text-sm">Grant</th>
                      <th className="px-4 py-3 text-sm">Kontrakt</th>
                      <th className="px-4 py-3 text-sm">Viloyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.matches.map((m, i) => (
                      <tr key={i} className="border-b border-grey-blue/10 hover:bg-silver/50">
                        <td className="px-4 py-3 text-sm font-medium">{m.university_name || m.short_name}</td>
                        <td className="px-4 py-3 text-sm">{m.direction_name}</td>
                        <td className="px-4 py-3 text-sm">{formLabels[m.education_form] || m.education_form}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-primary">{m.grant_score ?? '—'}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-info">{m.contract_score ?? '—'}</td>
                        <td className="px-4 py-3 text-sm text-grey">{m.region_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-grey text-sm text-center py-6">
              {primarySubject} + {secondarySubject} bo&apos;yicha mos yo&apos;nalish topilmadi.
            </p>
          )}

          <button type="button" onClick={handleRestart} className="btn-secondary">
            Qayta hisoblash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-6 min-h-[calc(100dvh-84px)]">
      <div className="section-container h-full">
        <div className="lg:grid lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr] lg:gap-6 xl:gap-8 lg:items-start">
          <Sidebar
            step={step}
            primarySubject={primarySubject}
            secondarySubject={secondarySubject}
            pendingPrimary={step === 0 ? pendingPrimary : ''}
            pendingSecondary={step === 1 ? pendingSecondary : ''}
            onBack={
              step === 1 ? () => { setStep(0); setPendingSecondary(''); setSecondarySubject(''); }
              : step === 2 ? () => setStep(1)
              : step === 3 ? () => setStep(2)
              : null
            }
            onContinue={
              step === 0 ? confirmPrimary
              : step === 1 ? confirmSecondary
              : step === 2 ? () => setStep(3)
              : step === 3 ? handleCalculate
              : null
            }
            canContinue={
              step === 0 ? Boolean(pendingPrimary)
              : step === 1 ? Boolean(pendingSecondary)
              : step === 2 ? mandatoryComplete
              : step === 3 ? profileComplete && !loading
              : false
            }
            continueLabel={
              step === 3 ? (loading ? 'Hisoblanmoqda...' : 'Ballni hisoblash →') : 'Davom etish →'
            }
          />

          <main className="min-w-0 flex flex-col">
            <div className="bg-white rounded-xl p-4 lg:p-5 card-shadow flex-1">
              {step === 0 && (
                <>
                  <SubjectGrid
                    subjects={primarySubjects}
                    selected={pendingPrimary}
                    onSelect={setPendingPrimary}
                    search={primarySearch}
                    onSearchChange={setPrimarySearch}
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <p className="text-xs text-grey mb-4">
                    Asosiy fan: <strong className="text-secondary">{primarySubject}</strong>
                  </p>
                  <SubjectGrid
                    subjects={secondarySubjects}
                    selected={pendingSecondary}
                    onSelect={setPendingSecondary}
                    search={secondarySearch}
                    onSearchChange={setSecondarySearch}
                    emptyMessage="Bu fan uchun ikkinchi fan topilmadi"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {MANDATORY_SUBJECTS.map((s) => (
                      <div key={s.key} className="bg-silver rounded-xl p-5">
                        <label htmlFor={`mandatory-${s.key}`} className="block text-sm font-semibold text-secondary mb-3">
                          {s.label}
                          <span className="font-normal text-grey ml-1">({s.total} savol)</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id={`mandatory-${s.key}`}
                            type="number"
                            min="0"
                            max={s.total}
                            value={mandatoryAnswers[s.key]}
                            onChange={(e) => setMandatoryAnswers((p) => ({ ...p, [s.key]: e.target.value }))}
                            placeholder="0"
                            className="w-full px-3 py-2.5 border border-grey-blue/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                          />
                          <span className="text-grey text-sm whitespace-nowrap">/ {s.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[primarySubject, secondarySubject].filter(Boolean).map((label, i) => (
                      <div key={label} className="bg-silver rounded-xl p-5">
                        <label htmlFor={`profile-${label}`} className="block text-sm font-semibold text-secondary mb-3">
                          {label}
                          <span className="font-normal text-primary ml-2 text-xs">
                            {i === 0 ? 'asosiy' : 'ikkinchi'} · {i === 0 ? PROFILE_WEIGHTS.primary : PROFILE_WEIGHTS.secondary}
                          </span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id={`profile-${label}`}
                            type="number"
                            min="0"
                            max={PROFILE_QUESTIONS}
                            value={profileAnswers[label] ?? ''}
                            onChange={(e) => setProfileAnswers((p) => ({ ...p, [label]: e.target.value }))}
                            placeholder="0"
                            className="w-full px-3 py-2.5 border border-grey-blue/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                          />
                          <span className="text-grey text-sm whitespace-nowrap">/ {PROFILE_QUESTIONS}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {error && <p className="text-error text-sm mt-4">{error}</p>}
                </>
              )}
            </div>

            {/* Mobile continue button */}
            <div className="mt-4 lg:hidden">
              <button
                type="button"
                onClick={
                  step === 0 ? confirmPrimary
                  : step === 1 ? confirmSecondary
                  : step === 2 ? () => setStep(3)
                  : handleCalculate
                }
                disabled={
                  step === 0 ? !pendingPrimary
                  : step === 1 ? !pendingSecondary
                  : step === 2 ? !mandatoryComplete
                  : !profileComplete || loading
                }
                className="btn-primary w-full disabled:opacity-40"
              >
                {step === 3 ? (loading ? 'Hisoblanmoqda...' : 'Ballni hisoblash') : 'Davom etish →'}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
