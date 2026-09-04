export const SITE_CONFIG = {
  name: 'Facundo Gutiérrez — Poda en Fuengirola',
  phoneDisplay: '+34 952 XX XX XX',
  phoneHref: 'tel:+34952XXXXXX',
  whatsappNumber: '346XXXXXXXX',
  email: 'contacto@facundogutierrez-poda.es',
  address: 'Fuengirola, Málaga, España',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Fuengirola',
  social: {
    facebook: '',
    instagram: '',
  },
  areas: ['Fuengirola', 'Mijas', 'Benalmádena', 'Alhaurín'],
} as const;

export type SiteConfig = typeof SITE_CONFIG;
