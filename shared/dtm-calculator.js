/** DTM ball kalkulyatori — 90 savol, maksimal 189 ball
 *  Rasmiy mezon: majburiy 1.1 ball/savol, 1-fan 3.1, 2-fan 2.1 ball/savol
 *  33 + 93 + 63 = 189
 */

export const MAX_SCORE = 189;
export const TOTAL_QUESTIONS = 90;

export const MANDATORY_SUBJECTS = [
  { key: 'ona_tili', label: "Ona tili", total: 10, pointsPerCorrect: 1.1, maxPoints: 11 },
  { key: 'tarix', label: 'Tarix', total: 10, pointsPerCorrect: 1.1, maxPoints: 11 },
  { key: 'matematika', label: 'Matematika', total: 10, pointsPerCorrect: 1.1, maxPoints: 11 },
];

export const MANDATORY_MAX = 33;

export const PROFILE_WEIGHTS = {
  primary: 3.1,
  secondary: 2.1,
};

export const PROFILE_MAX = {
  primary: 93,
  secondary: 63,
};

export const PROFILE_QUESTIONS = 30;

/** @deprecated ball.json dan dinamik yuklanadi */
export const PROFILE_SUBJECTS = [
  { key: 'fizika', label: 'Fizika', total: 30 },
  { key: 'kimyo', label: 'Kimyo', total: 30 },
  { key: 'biologiya', label: 'Biologiya', total: 30 },
  { key: 'geografiya', label: 'Geografiya', total: 30 },
  { key: 'ingliz_tili', label: 'Ingliz tili', total: 30 },
];

export function getMaxPossibleScore() {
  return MAX_SCORE;
}

export function computeScore({ mandatoryAnswers, primarySubject, secondarySubject, profileAnswers }) {
  if (!primarySubject || !secondarySubject) {
    throw new Error('Asosiy va ikkinchi fanlarni tanlang');
  }
  if (primarySubject === secondarySubject) {
    throw new Error('Asosiy va ikkinchi fan bir xil bo\'lmasligi kerak');
  }

  let totalScore = 0;

  for (const { key, total, pointsPerCorrect } of MANDATORY_SUBJECTS) {
    const correct = Math.min(Number(mandatoryAnswers?.[key]?.correct) || 0, total);
    totalScore += correct * pointsPerCorrect;
  }

  const primaryCorrect = Math.min(
    Number(profileAnswers?.[primarySubject]?.correct) || 0,
    PROFILE_QUESTIONS,
  );
  const secondaryCorrect = Math.min(
    Number(profileAnswers?.[secondarySubject]?.correct) || 0,
    PROFILE_QUESTIONS,
  );

  totalScore += primaryCorrect * PROFILE_WEIGHTS.primary;
  totalScore += secondaryCorrect * PROFILE_WEIGHTS.secondary;

  const normalizedScore = Math.round(totalScore * 10) / 10;
  const message =
    normalizedScore >= 140
      ? "Tabriklaymiz! Siz ko'plab OTMlarga kirish imkoniyatiga egasiz."
      : normalizedScore >= 100
        ? "Kontrakt asosida ko'plab yo'nalishlarga ariza berishingiz mumkin."
        : 'Ballaringizni oshirish uchun qo\'shimcha tayyorgarlik tavsiya etiladi.';

  return { totalScore: normalizedScore, maxScore: MAX_SCORE, message };
}

export function matchDirections(directions, normalizedScore) {
  return (directions || [])
    .filter((d) => {
      const s = d.admission_scores?.[0];
      return (
        (s?.grant_score && s.grant_score <= normalizedScore)
        || (s?.contract_score && s.contract_score <= normalizedScore)
      );
    })
    .map((d) => ({
      name: d.universities?.name,
      short_name: d.universities?.short_name,
      slug: d.universities?.slug,
      direction_name: d.name,
      education_form: d.education_form,
      grant_score: d.admission_scores?.[0]?.grant_score,
      contract_score: d.admission_scores?.[0]?.contract_score,
    }))
    .slice(0, 20);
}

/** Eski API formatidan ham qo'llab-quvvatlash */
export function computeScoreLegacy(subjects) {
  const profileKeys = Object.keys(subjects).filter(
    (k) => !MANDATORY_SUBJECTS.some((m) => m.key === k),
  );
  const mandatoryAnswers = {};
  for (const m of MANDATORY_SUBJECTS) {
    if (subjects[m.key]) mandatoryAnswers[m.key] = subjects[m.key];
  }
  const profileAnswers = {};
  for (const k of profileKeys) {
    profileAnswers[k] = subjects[k];
  }
  return computeScore({
    mandatoryAnswers,
    primarySubject: profileKeys[0],
    secondarySubject: profileKeys[1],
    profileAnswers,
  });
}
