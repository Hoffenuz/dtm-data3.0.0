const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Xatolik yuz berdi');
  }
  return res.json();
}

export const api = {
  getStats: () => fetchAPI('/stats'),
  getRegions: () => fetchAPI('/regions'),
  getUniversities: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/universities${query ? `?${query}` : ''}`);
  },
  getUniversity: (slug) => fetchAPI(`/universities/${slug}`),
  getScores: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/scores${query ? `?${query}` : ''}`);
  },
  calculateScore: (subjects) =>
    fetchAPI('/calculator', { method: 'POST', body: JSON.stringify({ subjects }) }),
  getNews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/news${query ? `?${query}` : ''}`);
  },
  getNewsArticle: (slug) => fetchAPI(`/news/${slug}`),
  getCareerTest: () => fetchAPI('/career-test'),
  submitCareerTest: (answers) =>
    fetchAPI('/career-test/submit', { method: 'POST', body: JSON.stringify({ answers }) }),
};
