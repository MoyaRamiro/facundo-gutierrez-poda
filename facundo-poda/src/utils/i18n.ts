import es from '../content/landing.es.json';
import en from '../content/landing.en.json';

export interface ServiceItem {
  id: string;
  title: string;
  benefit: string;
  icon: 'palm' | 'tree' | 'axe' | 'alert';
}

export interface WhyItem {
  icon: 'shield' | 'clock' | 'leaf' | 'badge';
  title: string;
  desc: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  service: string;
}

export interface ReviewItem {
  author: string;
  rating: number;
  text: string;
  source: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface LandingContent {
  hero: { h1: string; subhead: string; ctaWhatsApp: string; ctaPhone: string; badges: string[] };
  services: ServiceItem[];
  areas: { title: string; subtitle: string; towns: string[] };
  whyUs: WhyItem[];
  gallery: GalleryItem[];
  reviews: ReviewItem[];
  faq: FaqItem[];
  contact: { title: string; subtitle: string; submit: string; success: string; viaWhatsApp: string };
}

export type Lang = 'es' | 'en';

const CONTENT: Record<Lang, LandingContent> = {
  es: es as LandingContent,
  en: en as LandingContent,
};

export function loadLanding(lang: Lang): LandingContent {
  return CONTENT[lang];
}
