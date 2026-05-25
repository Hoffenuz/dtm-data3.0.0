import { useEffect } from 'react';
import { SITE } from '../config/site';

export function useSeo({ title, description, path = '' } = {}) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE.name}` : SITE.title;
    document.title = pageTitle;

    const setMeta = (name, content, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const desc = description || SITE.description;
    setMeta('description', desc);
    setMeta('og:title', pageTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:url', `${SITE.url}${path}`, 'property');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE.url}${path || '/'}`;
  }, [title, description, path]);
}
