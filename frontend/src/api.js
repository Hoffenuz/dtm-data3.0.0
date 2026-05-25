import { getAccessToken } from './lib/supabase';

const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const token = await getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Xatolik yuz berdi');
  return data;
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
  getCareerHistory: () => fetchAPI('/career-test/history'),
  sendContact: (payload) =>
    fetchAPI('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  getPracticeTests: () => fetchAPI('/practice-tests'),
  getPracticeTest: (slug) => fetchAPI(`/practice-tests/${slug}`),
  submitPracticeTest: (slug, answers, timeSpent) =>
    fetchAPI(`/practice-tests/${slug}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, time_spent_seconds: timeSpent }),
    }),
  getPracticeHistory: () => fetchAPI('/practice-tests/history/me'),
  getProfile: () => fetchAPI('/profile'),
  updateProfile: (data) =>
    fetchAPI('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
