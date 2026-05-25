import { DOMAIN, SITE_EMAIL, SITE_NAME, SITE_URL, SEO } from '../../../shared/site.constants.js';

export const SITE = {
  name: SITE_NAME,
  domain: DOMAIN,
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  url: import.meta.env.VITE_SITE_URL || SITE_URL,
  email: SITE_EMAIL,
  phone: '+998 71 123 45 67',
  locale: 'uz_UZ',
};
