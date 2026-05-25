const WEIGHTS = {
  matematika: 3.1,
  fizika: 2.5,
  kimyo: 2.5,
  biologiya: 2.5,
  ona_tili: 2.0,
  tarix: 2.0,
  ingliz_tili: 2.0,
  geografiya: 2.0,
};

export function computeScore(subjects) {
  let totalScore = 0;
  const maxPossible = Object.entries(subjects).reduce(
    (sum, [s]) => sum + 100 * (WEIGHTS[s] || 2.0),
    0,
  );

  for (const [subject, data] of Object.entries(subjects)) {
    const weight = WEIGHTS[subject] || 2.0;
    const correct = Number(data.correct) || 0;
    const total = Number(data.total) || 30;
    totalScore += (correct / total) * 100 * weight;
  }

  const normalizedScore = Math.round((totalScore / maxPossible) * 189 * 10) / 10;
  const message =
    normalizedScore >= 140
      ? "Tabriklaymiz! Siz ko'plab OTMlarga kirish imkoniyatiga egasiz."
      : normalizedScore >= 100
        ? "Kontrakt asosida ko'plab yo'nalishlarga ariza berishingiz mumkin."
        : 'Ballaringizni oshirish uchun qo\'shimcha tayyorgarlik tavsiya etiladi.';

  return { totalScore: normalizedScore, maxScore: 189, message };
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
