export const CAREER_RECOMMENDATIONS = {
  texnika: {
    field: 'Texnika va IT',
    description: 'Siz mantiqiy fikrlash va texnik masalalar hal qilishga moyilsiz.',
    directions: ['Dasturiy injiniring', 'Kompyuter injiniringi', 'Telekommunikatsiya', 'Mexanika'],
    universities: ['TATU', 'INHA', 'TDTU', 'TATU Urganch'],
  },
  tibbiyot: {
    field: 'Tibbiyot',
    description: 'Siz odamlarga yordam berish va tibbiyot sohasiga qiziqasiz.',
    directions: ['Davolash ishi', 'Stomatologiya', 'Farmasevtika', 'Hamshiralik'],
    universities: ['TTA', 'SamDTU', 'ADTI', 'TTA Urganch'],
  },
  gumanitar: {
    field: 'Gumanitar fanlar',
    description: 'Siz ijtimoiy fanlar, til va huquq sohasiga moyilsiz.',
    directions: ['Yurisprudensiya', 'Tarix', 'Filologiya', 'Pedagogika'],
    universities: ['TDYU', 'SamDU', "O'zMU", 'UrDU'],
  },
  iqtisod: {
    field: 'Iqtisodiyot va biznes',
    description: 'Siz moliya, iqtisodiyot va menejment sohasiga qiziqasiz.',
    directions: ['Buxgalteriya hisobi', 'Bank ishi', 'Menejment', 'Xalqaro iqtisodiyot'],
    universities: ['TDIU', 'TMI', 'JIDU', 'FarDU'],
  },
};

export function scoreCareerAnswers(answers) {
  const fieldCounts = {};
  for (const answer of answers) {
    if (answer?.field) fieldCounts[answer.field] = (fieldCounts[answer.field] || 0) + 1;
  }
  const topField = Object.entries(fieldCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'texnika';
  return { topField, fieldCounts, result: CAREER_RECOMMENDATIONS[topField] };
}
