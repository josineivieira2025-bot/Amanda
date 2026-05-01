import { useEffect } from 'react';

const DEFAULT_IMAGE = '/vida-em-foco-logo.jpeg';
const SITE_NAME = 'Vida em Foco Fotografia';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export function SeoMeta({ title, description, path = '', keywords = [], image = DEFAULT_IMAGE, schema }) {
  useEffect(() => {
    const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;
    const canonicalUrl = `${siteUrl.replace(/\/+$/, '')}${path || window.location.pathname}`;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: `${siteUrl}${image}` });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

    let schemaNode = document.head.querySelector('script[data-seo-schema="vida-em-foco"]');
    if (!schemaNode) {
      schemaNode = document.createElement('script');
      schemaNode.type = 'application/ld+json';
      schemaNode.dataset.seoSchema = 'vida-em-foco';
      document.head.appendChild(schemaNode);
    }

    schemaNode.textContent = JSON.stringify(schema);
  }, [description, image, keywords, path, schema, title]);

  return null;
}
