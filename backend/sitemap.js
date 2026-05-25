import { DOMAIN, SITE_URL, STATIC_ROUTES } from '../shared/site.constants.js';

function xmlFromUrls(urls) {
  const entries = urls
    .map(({ loc, priority, changefreq, lastmod }) => {
      let entry = `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>`;
      if (lastmod) entry += `\n    <lastmod>${lastmod}</lastmod>`;
      entry += '\n  </url>';
      return entry;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export function buildStaticSitemapXml() {
  const urls = [
    ...STATIC_ROUTES.map(({ path, priority, changefreq }) => ({
      loc: `${SITE_URL}${path === '/' ? '/' : path}`,
      priority,
      changefreq,
    })),
    { loc: `${SITE_URL}/contact`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${SITE_URL}/tests`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/login`, priority: '0.4', changefreq: 'monthly' },
    { loc: `${SITE_URL}/register`, priority: '0.4', changefreq: 'monthly' },
  ];
  return xmlFromUrls(urls);
}

export async function buildSitemapXml() {
  let universities = [];
  let news = [];

  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
      const { default: supabaseAdmin } = await import('./supabase.js');
      const [uniRes, newsRes] = await Promise.all([
        supabaseAdmin.from('universities').select('slug').order('is_top', { ascending: false }),
        supabaseAdmin.from('news').select('slug, published_at').order('published_at', { ascending: false }),
      ]);
      universities = uniRes.data || [];
      news = newsRes.data || [];
    } catch (err) {
      console.warn('Sitemap: Supabase dan olinmadi, statik ro\'yxat ishlatiladi.', err.message);
    }
  }

  const urls = [
    ...STATIC_ROUTES.map(({ path, priority, changefreq }) => ({
      loc: `${SITE_URL}${path === '/' ? '/' : path}`,
      priority,
      changefreq,
    })),
    ...(universities || []).map((u) => ({
      loc: `${SITE_URL}/universities/${u.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
    })),
    ...(news || []).map((n) => ({
      loc: `${SITE_URL}/news/${n.slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod: n.published_at,
    })),
    { loc: `${SITE_URL}/contact`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${SITE_URL}/tests`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/login`, priority: '0.4', changefreq: 'monthly' },
    { loc: `${SITE_URL}/register`, priority: '0.4', changefreq: 'monthly' },
  ];

  return xmlFromUrls(urls);
}

export function buildRobotsTxt() {
  return `# https://${DOMAIN}/robots.txt
User-agent: *
Allow: /

Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}
