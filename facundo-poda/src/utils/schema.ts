import { SITE_CONFIG } from '../content/config';
import type { FaqItem, ServiceItem } from './i18n';

export function localBusinessJsonLd(lang: 'es' | 'en'): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://facundogutierrez-poda.es/#business',
    name: SITE_CONFIG.name,
    telephone: SITE_CONFIG.phoneHref.replace('tel:', ''),
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fuengirola',
      addressRegion: 'Málaga',
      addressCountry: 'ES',
    },
    areaServed: SITE_CONFIG.areas.map((town) => ({ '@type': 'City', name: town })),
    url: lang === 'es' ? 'https://facundogutierrez-poda.es/' : 'https://facundogutierrez-poda.es/en/',
    sameAs: [SITE_CONFIG.mapsUrl],
    priceRange: '€€',
    openingHours: 'Mo-Sa 08:00-20:00',
  };
}

export function serviceJsonLd(services: ServiceItem[], lang: 'es' | 'en'): object[] {
  const base = lang === 'es' ? 'https://facundogutierrez-poda.es/' : 'https://facundogutierrez-poda.es/en/';
  return services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.benefit,
    provider: { '@id': 'https://facundogutierrez-poda.es/#business' },
    areaServed: SITE_CONFIG.areas.map((town) => ({ '@type': 'City', name: town })),
    url: `${base}#servicios`,
  }));
}

export function faqJsonLd(faq: FaqItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
