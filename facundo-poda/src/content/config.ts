export const SITE_CONFIG = {
  name: 'Facundo Gutiérrez — Poda en Fuengirola',
  phoneDisplay: '+34 632 227 016',
  phoneHref: 'tel:+34632227016',
  whatsappNumber: '34632227016',
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
