const PROFILE_QUESTIONS = 30;
let cache = null;

export async function loadBallData() {
  if (cache) return cache;

  const res = await fetch('/ball.json');
  if (!res.ok) throw new Error('Ball ma\'lumotlari yuklanmadi');

  const rows = await res.json();
  const primarySet = new Set();
  const pairs = new Map();

  for (const row of rows) {
    const fan1 = row.fan1?.trim();
    const fan2 = row.fan2?.trim();
    if (!fan1) continue;

    primarySet.add(fan1);
    if (!pairs.has(fan1)) pairs.set(fan1, new Set());
    if (fan2) pairs.get(fan1).add(fan2);
  }

  cache = {
    rows,
    primarySubjects: [...primarySet].sort((a, b) => a.localeCompare(b, 'uz')),
    pairs,
  };

  return cache;
}

export function getPrimarySubjects(data) {
  return data.primarySubjects;
}

export function getSecondarySubjects(data, primaryLabel) {
  const set = data.pairs.get(primaryLabel);
  if (!set) return [];
  return [...set].sort((a, b) => a.localeCompare(b, 'uz'));
}

export function matchBallDirections(rows, { primaryLabel, secondaryLabel, score }) {
  return rows
    .filter((r) => r.fan1 === primaryLabel && r.fan2 === secondaryLabel)
    .filter(
      (r) =>
        (r.grant_ball && r.grant_ball <= score)
        || (r.contract_ball && r.contract_ball <= score),
    )
    .sort((a, b) => (b.grant_ball ?? 0) - (a.grant_ball ?? 0))
    .slice(0, 50)
    .map((r) => ({
      university_name: r.universitet,
      direction_name: r.nomi?.split(' / ')[0]?.trim() || r.nomi,
      education_form: r.shakl,
      grant_score: r.grant_ball,
      contract_score: r.contract_ball,
      region_name: r.viloyat,
    }));
}

export { PROFILE_QUESTIONS };
