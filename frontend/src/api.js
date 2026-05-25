import { supabase } from './lib/supabase';
import { computeScore, matchDirections } from './lib/calculator';
import { scoreCareerAnswers } from './lib/career';

function throwIfError(error, fallback = 'Xatolik yuz berdi') {
  if (error) throw new Error(error.message || fallback);
}

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export const api = {
  async getStats() {
    const [uni, reg, dir, top] = await Promise.all([
      supabase.from('universities').select('*', { count: 'exact', head: true }),
      supabase.from('regions').select('*', { count: 'exact', head: true }),
      supabase.from('directions').select('*', { count: 'exact', head: true }),
      supabase.from('universities').select('*', { count: 'exact', head: true }).eq('is_top', true),
    ]);
    throwIfError(uni.error || reg.error || dir.error || top.error);
    return {
      universities: uni.count || 0,
      regions: reg.count || 0,
      directions: dir.count || 0,
      topUniversities: top.count || 0,
    };
  },

  async getRegions() {
    const { data, error } = await supabase.from('regions').select('*').order('name');
    throwIfError(error);
    const { data: unis } = await supabase.from('universities').select('region_id');
    const counts = {};
    for (const u of unis || []) counts[u.region_id] = (counts[u.region_id] || 0) + 1;
    return data.map((r) => ({ ...r, university_count: counts[r.id] || 0 }));
  },

  async getUniversities(params = {}) {
    const { region, type, search, top } = params;
    let query = supabase
      .from('universities')
      .select('*, regions(name, slug)')
      .order('is_top', { ascending: false })
      .order('name');

    if (type) query = query.eq('type', type);
    if (top === '1') query = query.eq('is_top', true);
    if (search) query = query.or(`name.ilike.%${search}%,short_name.ilike.%${search}%`);

    const { data, error } = await query;
    throwIfError(error);

    let result = (data || []).map((u) => ({
      ...u,
      region_name: u.regions?.name,
      region_slug: u.regions?.slug,
      regions: undefined,
    }));

    if (region) result = result.filter((u) => u.region_slug === region);
    return result;
  },

  async getUniversity(slug) {
    const { data: uni, error } = await supabase
      .from('universities')
      .select('*, regions(name, slug)')
      .eq('slug', slug)
      .single();

    if (error || !uni) throw new Error('OTM topilmadi');

    const { data: directions } = await supabase
      .from('directions')
      .select('*, admission_scores(grant_score, contract_score, year)')
      .eq('university_id', uni.id)
      .order('name');

    const flatDirections = (directions || []).map((d) => {
      const score = d.admission_scores?.[0];
      return {
        ...d,
        grant_score: score?.grant_score,
        contract_score: score?.contract_score,
        year: score?.year,
        admission_scores: undefined,
      };
    });

    return {
      ...uni,
      region_name: uni.regions?.name,
      region_slug: uni.regions?.slug,
      regions: undefined,
      directions: flatDirections,
    };
  },

  async getScores(params = {}) {
    const { region, form, language, search } = params;
    const { data, error } = await supabase
      .from('directions')
      .select(`
        name, faculty, education_form, education_language, quota,
        admission_scores(grant_score, contract_score, year),
        universities(name, short_name, slug, type, regions(name, slug))
      `);

    throwIfError(error);

    let rows = (data || []).map((d) => {
      const u = d.universities;
      const s = d.admission_scores?.[0];
      return {
        university_name: u?.name,
        short_name: u?.short_name,
        university_slug: u?.slug,
        type: u?.type,
        region_name: u?.regions?.name,
        region_slug: u?.regions?.slug,
        direction_name: d.name,
        faculty: d.faculty,
        education_form: d.education_form,
        education_language: d.education_language,
        quota: d.quota,
        grant_score: s?.grant_score,
        contract_score: s?.contract_score,
        year: s?.year,
      };
    });

    if (region) rows = rows.filter((r) => r.region_slug === region);
    if (form) rows = rows.filter((r) => r.education_form === form);
    if (language) rows = rows.filter((r) => r.education_language === language);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) => r.university_name?.toLowerCase().includes(q) || r.direction_name?.toLowerCase().includes(q),
      );
    }

    rows.sort((a, b) => (b.grant_score ?? 0) - (a.grant_score ?? 0));
    return rows;
  },

  async calculateScore(subjects) {
    if (!subjects || typeof subjects !== 'object') {
      throw new Error('Fanlar ma\'lumotini kiriting');
    }

    const { totalScore, maxScore, message } = computeScore(subjects);

    const { data: directions, error } = await supabase
      .from('directions')
      .select('name, education_form, universities(name, short_name, slug), admission_scores(grant_score, contract_score)');

    throwIfError(error);

    return {
      totalScore,
      maxScore,
      matches: matchDirections(directions, totalScore),
      message,
    };
  },

  async getNews(params = {}) {
    const { featured, category } = params;
    let query = supabase.from('news').select('*').order('published_at', { ascending: false });
    if (featured === '1') query = query.eq('is_featured', true);
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    throwIfError(error);
    return data;
  },

  async getNewsArticle(slug) {
    const { data, error } = await supabase.from('news').select('*').eq('slug', slug).single();
    if (error || !data) throw new Error('Yangilik topilmadi');
    return data;
  },

  async getCareerTest() {
    const { data, error } = await supabase.from('career_questions').select('id, question, options').order('id');
    throwIfError(error);
    return data;
  },

  async submitCareerTest(answers) {
    if (!answers || !Array.isArray(answers)) throw new Error('Javoblarni yuboring');

    const { topField, fieldCounts, result } = scoreCareerAnswers(answers);
    const userId = await getUserId();

    if (userId) {
      await supabase.from('career_test_results').insert({
        user_id: userId,
        result_field: topField,
        result_data: result,
        scores: fieldCounts,
      });
    }

    return { result, scores: fieldCounts, saved: !!userId };
  },

  async getCareerHistory() {
    const { data, error } = await supabase
      .from('career_test_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    throwIfError(error);
    return data;
  },

  async sendContact(payload) {
    const { name, email, phone, subject, message } = payload;
    if (!name || name.length < 2) throw new Error('Ism kamida 2 harf bo\'lishi kerak');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email noto\'g\'ri');
    if (!subject || subject.length < 3) throw new Error('Mavzu kiriting');
    if (!message || message.length < 10) throw new Error('Xabar kamida 10 ta belgi bo\'lishi kerak');

    const userId = await getUserId();
    const { error } = await supabase.rpc('submit_contact', {
      p_name: name.slice(0, 100),
      p_email: email.slice(0, 150),
      p_phone: (phone || '').slice(0, 20),
      p_subject: subject.slice(0, 200),
      p_message: message.slice(0, 2000),
      p_user_id: userId,
    });

    if (error) throw new Error('Xabar yuborilmadi. Keyinroq urinib ko\'ring.');
    return { success: true, message: 'Xabaringiz qabul qilindi. Tez orada javob beramiz!' };
  },

  async getPracticeTests() {
    const { data, error } = await supabase
      .from('practice_tests')
      .select('id, title, slug, description, subject, duration_minutes, total_questions')
      .eq('is_active', true)
      .order('id');
    throwIfError(error);
    return data;
  },

  async getPracticeTest(slug) {
    const { data: test, error } = await supabase
      .from('practice_tests')
      .select('id, title, slug, description, subject, duration_minutes, total_questions')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !test) throw new Error('Test topilmadi');

    const { data: questions } = await supabase
      .from('practice_test_questions')
      .select('id, question, options, order_num')
      .eq('test_id', test.id)
      .order('order_num');

    return { ...test, questions: questions || [] };
  },

  async submitPracticeTest(slug, answers, timeSpent) {
    if (!answers || typeof answers !== 'object') throw new Error('Javoblarni yuboring');

    const userId = await getUserId();
    if (!userId) throw new Error('Test natijasini saqlash uchun tizimga kiring');

    const { data: test, error: testErr } = await supabase
      .from('practice_tests')
      .select('id, total_questions')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (testErr || !test) throw new Error('Test topilmadi');

    const { data: questions } = await supabase
      .from('practice_test_questions')
      .select('id, correct_index')
      .eq('test_id', test.id);

    let correctCount = 0;
    const totalCount = questions?.length || 0;
    for (const q of questions || []) {
      if (Number(answers[q.id]) === q.correct_index) correctCount++;
    }

    const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100 * 100) / 100 : 0;

    const { data: attempt, error } = await supabase
      .from('practice_test_attempts')
      .insert({
        user_id: userId,
        test_id: test.id,
        answers,
        score,
        correct_count: correctCount,
        total_count: totalCount,
        time_spent_seconds: timeSpent || null,
      })
      .select()
      .single();

    throwIfError(error);

    return {
      score,
      correctCount,
      totalCount,
      percentage: score,
      attemptId: attempt.id,
    };
  },

  async getPracticeHistory() {
    const { data, error } = await supabase
      .from('practice_test_attempts')
      .select('*, practice_tests(title, slug, subject)')
      .order('completed_at', { ascending: false })
      .limit(20);
    throwIfError(error);
    return data;
  },

  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Tizimga kiring');

    const { data, error } = await supabase.from('profiles').select('*').single();
    if (error) throw new Error('Profil topilmadi');
    return { ...data, email: user.email };
  },

  async updateProfile(body) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: (body.full_name || '').slice(0, 100),
        phone: (body.phone || '').slice(0, 20),
        region: (body.region || '').slice(0, 100),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    throwIfError(error);
    return data;
  },
};
