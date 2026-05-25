import {
  DOMAIN,
  SITE_NAME,
  SITE_PHONE,
  SITE_PHONE_TEL,
  SITE_TELEGRAM,
  SITE_TELEGRAM_HANDLE,
  SITE_URL,
  SEO,
} from '../../../shared/site.constants.js';

export const SITE = {
  name: SITE_NAME,
  domain: DOMAIN,
  title: SEO.title,
  description: SEO.description,
  keywords: SEO.keywords,
  url: import.meta.env.VITE_SITE_URL || SITE_URL,
  phone: SITE_PHONE,
  phoneTel: SITE_PHONE_TEL,
  telegram: SITE_TELEGRAM,
  telegramHandle: SITE_TELEGRAM_HANDLE,
  locale: 'uz_UZ',
};
