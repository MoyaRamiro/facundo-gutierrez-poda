# Facundo Gutiérrez Poda Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir landing page estática bilingüe (ES/EN) con Astro para negocio de poda en Fuengirola, mobile-first, con detección automática de idioma.

**Architecture:** Astro 5.x estático con 11 componentes `.astro` sin JS por defecto; solo PhotoSwipe (galería) y validación de formulario usan JS. Contenido en dos JSON (ES/EN) + `config.ts`. Middleware Edge detecta `Accept-Language` y redirige a `/en` si no es español.

**Tech Stack:** Astro 5.x, Tailwind CSS 3.x, TypeScript 5.x, PhotoSwipe 5.x, Zod 3.x, Netlify Forms, Umami Analytics, `@astrojs/sitemap`

**Spec:** `docs/superpowers/specs/2026-09-04-facundo-gutierrez-poda-landing-design.md`

## Global Constraints

- Targets táctiles ≥ 44×44px en todos los botones, links e inputs
- `font-size: 16px` mínimo en inputs (evita zoom iOS)
- Contraste de color ≥ 4.5:1 (tema verde sobre fondos claros)
- `loading="lazy"` en todas las imágenes bajo el hero
- Bundle JS (gz) < 15KB (solo lightbox + validación form)
- Lighthouse Performance ≥ 95, LCP < 2.0s, CLS < 0.05, TBT < 100ms
- Rutas: `/` = español, `/en` = inglés. Sin otras rutas.
- ⚠️ REEMPLAZAR `346XXXXXXXX` / `34952XXXXXX` con números reales antes de deploy
- Commits frecuentes, un commit por tarea como mínimo

---

## File Structure Map

```
facundo-poda/                          # raíz del proyecto (nuevo)
├── astro.config.mjs                   # Astro + sitemap + tailwind
├── tailwind.config.mjs                # tema verde, breakpoints default
├── tsconfig.json                      # strict, paths
├── netlify.toml                       # build + redirects + headers
├── package.json                       # deps del spec §10
├── src/
│   ├── components/
│   │   ├── Header.astro               # logo + botones Tel/WhatsApp, sticky
│   │   ├── Hero.astro                 # H1 geo + 2 CTAs + badges
│   │   ├── Services.astro             # 4 cards desde JSON
│   │   ├── ServiceArea.astro          # chips scrollables municipios
│   │   ├── WhyUs.astro                # 4 pilares confianza
│   │   ├── Gallery.astro              # feed + PhotoSwipe lightbox
│   │   ├── Reviews.astro              # 3 reseñas, carrusel móvil
│   │   ├── FAQ.astro                  # <details> + JSON-LD FAQPage
│   │   ├── ContactForm.astro          # Netlify Form + Zod + WhatsApp
│   │   ├── StickyCTA.astro            # barra fija móvil (solo <lg)
│   │   └── Footer.astro               # NAP + legal + JSON-LD LocalBusiness
│   ├── layouts/
│   │   └── Layout.astro               # <head>, hreflang, schema base, Umami
│   ├── pages/
│   │   ├── index.astro                # ES: compone las 11 secciones
│   │   └── en/
│   │       └── index.astro            # EN: idéntica estructura, copy EN
│   ├── middleware.ts                  # detección Accept-Language → /en
│   ├── content/
│   │   ├── landing.es.json            # todo el copy ES
│   │   ├── landing.en.json            # todo el copy EN
│   │   └── config.ts                  # NAP, teléfonos, WhatsApp, social
│   ├── styles/
│   │   └── global.css                 # tailwind + scrollbar-hide + safe-area
│   └── utils/
│       ├── whatsapp.ts                # helper link wa.me con mensaje
│       ├── i18n.ts                    # tipos + loader de JSON por lang
│       └── schema.ts                  # generadores JSON-LD (LocalBusiness, Service, FAQ, Review)
└── public/
    ├── favicon.svg
    └── robots.txt
```

---

### Task 1: Scaffold proyecto Astro + dependencias

**Files:**
- Create: `facundo-poda/package.json`
- Create: `facundo-poda/astro.config.mjs`
- Create: `facundo-poda/tsconfig.json`
- Create: `facundo-poda/tailwind.config.mjs`

**Interfaces:**
- Consumes: nada (primera tarea)
- Produces: proyecto instalable vía `npm install`; comando `npm run dev` disponible

- [ ] **Step 1: Crear package.json con dependencias exactas del spec**

```json
{
  "name": "facundo-poda-landing",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@astrojs/tailwind": "^5.1.0",
    "tailwindcss": "^3.4.0",
    "photoswipe": "^5.4.0",
    "zod": "^3.23.0",
    "@umami/astro": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Crear astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://facundogutierrez-poda.es',
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-ES', en: 'en-US' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: 'prefix-other-locales',
  },
});
```

- [ ] **Step 3: Crear tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

- [ ] **Step 4: Crear tailwind.config.mjs con tema verde**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Instalar y verificar que arranca**

```bash
cd facundo-poda && npm install
```

```bash
cd facundo-poda && npx astro --version
```

Expected: imprime versión Astro 5.x sin errores.

- [ ] **Step 6: Commit**

```bash
git add facundo-poda/package.json facundo-poda/astro.config.mjs facundo-poda/tsconfig.json facundo-poda/tailwind.config.mjs
git commit -m "chore: scaffold Astro 5 + Tailwind + TS"
```

---

### Task 2: Estilos globales + config + contenido ES/EN

**Files:**
- Create: `facundo-poda/src/styles/global.css`
- Create: `facundo-poda/src/content/config.ts`
- Create: `facundo-poda/src/content/landing.es.json`
- Create: `facundo-poda/src/content/landing.en.json`

**Interfaces:**
- Consumes: nada
- Produces:
  - `SITE_CONFIG: { name, phoneDisplay, phoneHref, whatsappNumber, email, address, mapsUrl, social: { facebook?, instagram? } }` desde `content/config.ts`
  - `loadLanding(lang: 'es' | 'en'): Promise<LandingContent>` desde `utils/i18n.ts` (Task 3 lo implementa; el tipo `LandingContent` se define aquí abajo)

- [ ] **Step 1: Crear global.css con Tailwind + utilidades móviles**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  input,
  select,
  textarea {
    font-size: 16px; /* evita zoom iOS */
  }
  button,
  a {
    touch-action: manipulation;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

- [ ] **Step 2: Crear config.ts (⚠️ números placeholder, reemplazar antes de deploy)**

```ts
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
```

- [ ] **Step 3: Crear landing.es.json (copy real, listo para producción)**

```json
{
  "hero": {
    "h1": "Poda de palmeras y árboles en Fuengirola y alrededores",
    "subhead": "Especialistas en poda de palmeras. Presupuesto gratis, respuesta en menos de 2 horas y gestión de residuos incluida.",
    "ctaWhatsApp": "Pedir presupuesto por WhatsApp",
    "ctaPhone": "Llamar ahora",
    "badges": ["+15 años de experiencia", "Seguro de responsabilidad civil", "Presupuesto gratis"]
  },
  "services": [
    { "id": "palmeras", "title": "Poda de palmeras", "benefit": "Limpieza de corona, dátiles y seguridad. Palmeras sanas todo el año.", "icon": "palm" },
    { "id": "arboles", "title": "Poda de árboles", "benefit": "Poda de formación, saneamiento y reducción de copa.", "icon": "tree" },
    { "id": "tala", "title": "Tala y descepe", "benefit": "Retirada completa y segura, con triturado de tocón.", "icon": "axe" },
    { "id": "emergencias", "title": "Emergencias 24h", "benefit": "Árbol caído o ramas peligrosas tras tormenta. Actuamos hoy.", "icon": "alert" }
  ],
  "areas": {
    "title": "Zona de servicio",
    "subtitle": "Nos desplazamos a tu zona en la Costa del Sol",
    "towns": ["Fuengirola", "Mijas", "Benalmádena", "Alhaurín el Grande", "Alhaurín de la Torre"]
  },
  "whyUs": [
    { "icon": "shield", "title": "Asegurado", "desc": "Seguro de responsabilidad civil en cada trabajo." },
    { "icon": "clock", "title": "Respuesta < 2h", "desc": "Te contestamos el mismo día, normalmente en 2 horas." },
    { "icon": "leaf", "title": "Residuos gestionados", "desc": "Nos llevamos todos los restos. Tu jardín queda limpio." },
    { "icon": "badge", "title": "+15 años", "desc": "Experiencia local en palmeras y arbolado mediterráneo." }
  ],
  "gallery": [
    { "src": "/images/galeria/palmera-antes-1.jpg", "alt": "Palmera en Fuengirola antes de la poda", "caption": "Palmera datilera — Fuengirola", "service": "palmeras" },
    { "src": "/images/galeria/palmera-despues-1.jpg", "alt": "Palmera en Fuengirola después de la poda", "caption": "Misma palmera tras limpieza de corona", "service": "palmeras" },
    { "src": "/images/galeria/pino-antes-1.jpg", "alt": "Pino en Mijas antes de reducir copa", "caption": "Reducción de copa — Mijas", "service": "arboles" },
    { "src": "/images/galeria/pino-despues-1.jpg", "alt": "Pino en Mijas después de reducir copa", "caption": "Copa equilibrada y segura", "service": "arboles" },
    { "src": "/images/galeria/jardin-1.jpg", "alt": "Jardín en Benalmádena tras mantenimiento", "caption": "Mantenimiento — Benalmádena", "service": "arboles" },
    { "src": "/images/galeria/tala-1.jpg", "alt": "Tala controlada de árbol en Alhaurín", "caption": "Tala controlada — Alhaurín", "service": "tala" }
  ],
  "reviews": [
    { "author": "Carmen R.", "rating": 5, "text": "Vino a podar dos palmeras altísimas y dejó todo impecable. Rápido y buen precio.", "source": "Google" },
    { "author": "John W.", "rating": 5, "text": "Professional job on our garden in Mijas. Cleared everything away. Highly recommended.", "source": "Google" },
    { "author": "Antonio M.", "rating": 5, "text": "Tras la tormenta vino el mismo día a retirar una rama peligrosa. Muy serio.", "source": "Google" }
  ],
  "faq": [
    { "q": "¿Cuánto cuesta podar una palmera?", "a": "Depende de la altura, el acceso y el estado. Las palmeras pequeñas parten de unos 60 € y las altas pueden superar los 200 €. Escríbenos por WhatsApp con una foto y te damos precio cerrado gratis." },
    { "q": "¿Necesito permiso para podar en Fuengirola?", "a": "La poda de mantenimiento en jardín privado no suele requerir permiso. Para talas o ejemplares protegidos sí puede hacer falta. Te asesoramos gratis antes de cada trabajo." },
    { "q": "¿Se llevan los restos de poda?", "a": "Sí. Todos los presupuestos incluyen retirada y gestión de residuos. Tu jardín queda limpio." },
    { "q": "¿Atendéis urgencias?", "a": "Sí, 24h para árboles caídos o ramas peligrosas en Fuengirola, Mijas, Benalmádena y Alhaurín. Llama directamente." },
    { "q": "¿Cada cuánto hay que podar una palmera?", "a": "Una vez al año es lo habitual en la Costa del Sol, idealmente en primavera o verano. Te avisamos cuando toque la siguiente." }
  ],
  "contact": {
    "title": "Pide tu presupuesto gratis",
    "subtitle": "Cuéntanos qué necesitas y te respondemos hoy mismo",
    "submit": "Enviar solicitud",
    "success": "¡Recibido! Te contactaremos hoy mismo.",
    "viaWhatsApp": "O escríbenos directo por WhatsApp"
  }
}
```

- [ ] **Step 4: Crear landing.en.json (traducción espejo, mismas keys)**

```json
{
  "hero": {
    "h1": "Palm & tree pruning in Fuengirola and nearby areas",
    "subhead": "Palm pruning specialists. Free quote, reply in under 2 hours, green waste removal included.",
    "ctaWhatsApp": "Get a quote on WhatsApp",
    "ctaPhone": "Call now",
    "badges": ["15+ years experience", "Fully insured", "Free quote"]
  },
  "services": [
    { "id": "palmeras", "title": "Palm pruning", "benefit": "Crown cleaning, dates and safety. Healthy palms all year.", "icon": "palm" },
    { "id": "arboles", "title": "Tree pruning", "benefit": "Formative pruning, deadwood removal and crown reduction.", "icon": "tree" },
    { "id": "tala", "title": "Felling & stump grinding", "benefit": "Complete safe removal with stump grinding.", "icon": "axe" },
    { "id": "emergencias", "title": "24h emergency", "benefit": "Fallen tree or dangerous limbs after storms. We act today.", "icon": "alert" }
  ],
  "areas": {
    "title": "Service area",
    "subtitle": "We come to you anywhere on the Costa del Sol",
    "towns": ["Fuengirola", "Mijas", "Benalmádena", "Alhaurín el Grande", "Alhaurín de la Torre"]
  },
  "whyUs": [
    { "icon": "shield", "title": "Insured", "desc": "Public liability insurance on every job." },
    { "icon": "clock", "title": "Reply < 2h", "desc": "We answer the same day, usually within 2 hours." },
    { "icon": "leaf", "title": "Waste removed", "desc": "We take all green waste away. Your garden stays clean." },
    { "icon": "badge", "title": "15+ years", "desc": "Local experience with palms and Mediterranean trees." }
  ],
  "gallery": [
    { "src": "/images/galeria/palmera-antes-1.jpg", "alt": "Palm tree in Fuengirola before pruning", "caption": "Date palm — Fuengirola", "service": "palmeras" },
    { "src": "/images/galeria/palmera-despues-1.jpg", "alt": "Palm tree in Fuengirola after pruning", "caption": "Same palm after crown cleaning", "service": "palmeras" },
    { "src": "/images/galeria/pino-antes-1.jpg", "alt": "Pine in Mijas before crown reduction", "caption": "Crown reduction — Mijas", "service": "arboles" },
    { "src": "/images/galeria/pino-despues-1.jpg", "alt": "Pine in Mijas after crown reduction", "caption": "Balanced, safe crown", "service": "arboles" },
    { "src": "/images/galeria/jardin-1.jpg", "alt": "Garden in Benalmádena after maintenance", "caption": "Maintenance — Benalmádena", "service": "arboles" },
    { "src": "/images/galeria/tala-1.jpg", "alt": "Controlled tree felling in Alhaurín", "caption": "Controlled felling — Alhaurín", "service": "tala" }
  ],
  "reviews": [
    { "author": "Carmen R.", "rating": 5, "text": "He pruned two very tall palms and left everything spotless. Fast and fair price.", "source": "Google" },
    { "author": "John W.", "rating": 5, "text": "Professional job on our garden in Mijas. Cleared everything away. Highly recommended.", "source": "Google" },
    { "author": "Antonio M.", "rating": 5, "text": "After the storm he came the same day to remove a dangerous limb. Very reliable.", "source": "Google" }
  ],
  "faq": [
    { "q": "How much does palm pruning cost?", "a": "It depends on height, access and condition. Small palms start around €60, tall ones can exceed €200. Send us a photo on WhatsApp for a free fixed quote." },
    { "q": "Do I need a permit to prune in Fuengirola?", "a": "Routine maintenance in a private garden usually needs no permit. Felling or protected specimens may. We advise you for free before every job." },
    { "q": "Do you remove green waste?", "a": "Yes. Every quote includes removal and disposal. Your garden stays clean." },
    { "q": "Do you handle emergencies?", "a": "Yes, 24h for fallen trees or dangerous limbs in Fuengirola, Mijas, Benalmádena and Alhaurín. Just call." },
    { "q": "How often should a palm be pruned?", "a": "Once a year is typical on the Costa del Sol, ideally spring or summer. We remind you when the next one is due." }
  ],
  "contact": {
    "title": "Get your free quote",
    "subtitle": "Tell us what you need and we reply today",
    "submit": "Send request",
    "success": "Received! We will contact you today.",
    "viaWhatsApp": "Or message us directly on WhatsApp"
  }
}
```

- [ ] **Step 5: Verificar JSON válido**

```bash
cd facundo-poda && node -e "JSON.parse(require('fs').readFileSync('src/content/landing.es.json','utf8')); JSON.parse(require('fs').readFileSync('src/content/landing.en.json','utf8')); console.log('JSON OK')"
```

Expected: `JSON OK`.

- [ ] **Step 6: Commit**

```bash
git add facundo-poda/src/styles/global.css facundo-poda/src/content/
git commit -m "feat: estilos globales + contenido ES/EN + config sitio"
```

---

### Task 3: Utilidades (whatsapp, i18n, schema)

**Files:**
- Create: `facundo-poda/src/utils/whatsapp.ts`
- Create: `facundo-poda/src/utils/i18n.ts`
- Create: `facundo-poda/src/utils/schema.ts`

**Interfaces:**
- Consumes: `SITE_CONFIG` (Task 2), `landing.es.json` / `landing.en.json` (Task 2)
- Produces:
  - `whatsappLink(message: string): string`
  - `loadLanding(lang: 'es' | 'en'): LandingContent`
  - `localBusinessJsonLd(lang): object`, `faqJsonLd(faq: {q,a}[]): object`, `serviceJsonLd(services, lang): object[]`

- [ ] **Step 1: Crear whatsapp.ts**

```ts
import { SITE_CONFIG } from '../content/config';

export function whatsappLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`;
}

export function quoteMessage(service: string, town: string, name: string): string {
  return `Hola, soy ${name}. Necesito ${service} en ${town}. ¿Me das presupuesto?`;
}
```

- [ ] **Step 2: Crear i18n.ts con tipo LandingContent**

```ts
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
```

- [ ] **Step 3: Crear schema.ts (JSON-LD por idioma)**

```ts
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
```

- [ ] **Step 4: Verificar tipos**

```bash
cd facundo-poda && npx astro check
```

Expected: `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add facundo-poda/src/utils/
git commit -m "feat: utils whatsapp, i18n y schema JSON-LD"
```

---

### Task 4: Middleware de detección de idioma + Layout base

**Files:**
- Create: `facundo-poda/src/middleware.ts`
- Create: `facundo-poda/src/layouts/Layout.astro`
- Create: `facundo-poda/public/robots.txt`
- Create: `facundo-poda/public/favicon.svg`

**Interfaces:**
- Consumes: `loadLanding`, `localBusinessJsonLd` (Task 3), `SITE_CONFIG` (Task 2)
- Produces:
  - Middleware: redirige `/` → `/en` si `Accept-Language` no empieza por `es`
  - `Layout` props: `{ lang: 'es' | 'en', title: string, description: string, faq?: FaqItem[] }`

- [ ] **Step 1: Crear middleware.ts**

```ts
import { defineMiddleware } from 'astro:middleware';

const COOKIE = 'lang';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, cookies, redirect } = context;

  if (!url.pathname.startsWith('/en')) {
    const saved = cookies.get(COOKIE)?.value;
    if (saved === 'en') return redirect('/en', 302);
    if (saved === 'es') return next();
  }

  if (url.pathname === '/' && !cookies.has(COOKIE)) {
    const accept = request.headers.get('accept-language') ?? '';
    const first = accept.split(',')[0]?.trim().toLowerCase() ?? '';
    if (first && !first.startsWith('es')) {
      cookies.set(COOKIE, 'en', { path: '/', maxAge: 60 * 60 * 24 * 365 });
      return redirect('/en', 302);
    }
    cookies.set(COOKIE, 'es', { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  if (url.pathname.startsWith('/en') && !cookies.has(COOKIE)) {
    cookies.set(COOKIE, 'en', { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  return next();
});
```

- [ ] **Step 2: Crear favicon.svg (palmera minimalista)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#15803d"/>
  <path d="M32 50c0-10 0-16 0-24m0 0c-6-2-12-1-16 3 5 1 10 3 12 6m4-6c2-3 7-5 12-6-4-4-10-5-16-3m4 21c-3-4-3-9 0-13 3 4 3 9 0 13z" stroke="#dcfce7" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 3: Crear robots.txt**

```txt
User-agent: *
Allow: /

Sitemap: https://facundogutierrez-poda.es/sitemap-index.xml
```

- [ ] **Step 4: Crear Layout.astro (head + hreflang + schema + Umami)**

```astro
---
import '../styles/global.css';
import { SITE_CONFIG } from '../content/config';
import { localBusinessJsonLd } from '../utils/schema';
import type { FaqItem } from '../utils/i18n';

interface Props {
  lang: 'es' | 'en';
  title: string;
  description: string;
  faq?: FaqItem[];
}

const { lang, title, description, faq } = Astro.props;
const canonical =
  lang === 'es' ? 'https://facundogutierrez-poda.es/' : 'https://facundogutierrez-poda.es/en/';
---

<!doctype html>
<html lang={lang === 'es' ? 'es-ES' : 'en-US'}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="alternate" hreflang="es" href="https://facundogutierrez-poda.es/" />
    <link rel="alternate" hreflang="en" href="https://facundogutierrez-poda.es/en/" />
    <link rel="alternate" hreflang="x-default" href="https://facundogutierrez-poda.es/" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="prefetch" href={lang === 'es' ? '/en/' : '/'} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta name="theme-color" content="#15803d" />
    <script
      type="application/ld+json"
      set:html={JSON.stringify(localBusinessJsonLd(lang))}
    />
    <script
      async
      defer
      data-website-id="REEMPLAZAR-UMAMI-ID"
      src="https://analytics.umami.is/script.js"
    ></script>
  </head>
  <body class="bg-white text-neutral-900 antialiased">
    <slot />
  </body>
</html>
```

- [ ] **Step 5: Verificar tipos**

```bash
cd facundo-poda && npx astro check
```

Expected: `0 errors`.

- [ ] **Step 6: Commit**

```bash
git add facundo-poda/src/middleware.ts facundo-poda/src/layouts/ facundo-poda/public/
git commit -m "feat: middleware idioma + layout base con hreflang y schema"
```

---

### Task 5: Header + StickyCTA (móvil)

**Files:**
- Create: `facundo-poda/src/components/Header.astro`
- Create: `facundo-poda/src/components/StickyCTA.astro`

**Interfaces:**
- Consumes: `SITE_CONFIG` (Task 2), `whatsappLink` (Task 3)
- Produces: dos componentes sin props (leen config global)

- [ ] **Step 1: Crear Header.astro**

```astro
---
import { SITE_CONFIG } from '../content/config';
import { whatsappLink } from '../utils/whatsapp';

interface Props {
  lang: 'es' | 'en';
}
const { lang } = Astro.props;
const wa = whatsappLink(
  lang === 'es' ? 'Hola, necesito presupuesto de poda.' : 'Hi, I need a pruning quote.'
);
const quote = lang === 'es' ? 'Presupuesto' : 'Quote';
const switchHref = lang === 'es' ? '/en/' : '/';
const switchLabel = lang === 'es' ? 'EN' : 'ES';
---

<header class="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur-sm">
  <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
    <a href={lang === 'es' ? '/' : '/en/'} class="flex items-center gap-2" aria-label={SITE_CONFIG.name}>
      <img src="/favicon.svg" alt="" width="32" height="32" />
      <span class="text-sm font-bold leading-tight text-brand-800">
        Facundo Gutiérrez<br />
        <span class="text-xs font-normal text-neutral-500">
          {lang === 'es' ? 'Poda en Fuengirola' : 'Pruning in Fuengirola'}
        </span>
      </span>
    </a>
    <div class="flex items-center gap-2">
      <a
        href={switchHref}
        class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100"
        aria-label="Switch language"
      >
        {switchLabel}
      </a>
      <a
        href={SITE_CONFIG.phoneHref}
        class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-white px-3 text-sm font-semibold text-brand-700 ring-1 ring-brand-600 hover:bg-brand-50"
        aria-label={lang === 'es' ? 'Llamar' : 'Call'}
      >
        📞 <span class="ml-1 hidden sm:inline">{lang === 'es' ? 'Llamar' : 'Call'}</span>
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener"
        data-track="click_whatsapp_header"
        class="flex min-h-[44px] items-center justify-center rounded-lg bg-brand-600 px-3 text-sm font-semibold text-white hover:bg-brand-700"
      >
        💬 <span class="ml-1 hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  </div>
</header>
```

- [ ] **Step 2: Crear StickyCTA.astro (solo móvil, barra inferior fija)**

```astro
---
import { SITE_CONFIG } from '../content/config';
import { whatsappLink } from '../utils/whatsapp';

interface Props {
  lang: 'es' | 'en';
}
const { lang } = Astro.props;
const wa = whatsappLink(
  lang === 'es' ? 'Hola, necesito presupuesto de poda.' : 'Hi, I need a pruning quote.'
);
---

<div class="pb-safe fixed inset-x-0 bottom-0 z-50 border-t border-brand-100 bg-white/95 backdrop-blur-sm lg:hidden">
  <div class="grid grid-cols-2 gap-2 p-2">
    <a
      href={SITE_CONFIG.phoneHref}
      data-track="click_phone_sticky"
      class="flex min-h-[48px] items-center justify-center rounded-xl bg-white text-base font-bold text-brand-700 ring-2 ring-brand-600"
    >
      📞 {lang === 'es' ? 'Llamar' : 'Call'}
    </a>
    <a
      href={wa}
      target="_blank"
      rel="noopener"
      data-track="click_whatsapp_sticky"
      class="flex min-h-[48px] items-center justify-center rounded-xl bg-brand-600 text-base font-bold text-white"
    >
      💬 WhatsApp
    </a>
  </div>
</div>
```

- [ ] **Step 3: Verificar tipos**

```bash
cd facundo-poda && npx astro check
```

Expected: `0 errors`.

- [ ] **Step 4: Commit**

```bash
git add facundo-poda/src/components/Header.astro facundo-poda/src/components/StickyCTA.astro
git commit -m "feat: header sticky + barra CTA movil"
```

---

### Task 6: Hero + Services + ServiceArea

**Files:**
- Create: `facundo-poda/src/components/Hero.astro`
- Create: `facundo-poda/src/components/Services.astro`
- Create: `facundo-poda/src/components/ServiceArea.astro`

**Interfaces:**
- Consumes: `LandingContent` (Task 3), `whatsappLink` (Task 3), `SITE_CONFIG` (Task 2)
- Produces: componentes con props `{ lang: Lang; content: LandingContent }`

- [ ] **Step 1: Crear Hero.astro**

```astro
---
import { SITE_CONFIG } from '../content/config';
import { whatsappLink } from '../utils/whatsapp';
import type { LandingContent, Lang } from '../utils/i18n';

interface Props {
  lang: Lang;
  content: LandingContent;
}
const { lang, content } = Astro.props;
const wa = whatsappLink(
  lang === 'es' ? 'Hola, necesito presupuesto de poda.' : 'Hi, I need a pruning quote.'
);
---

<section class="bg-gradient-to-b from-brand-50 to-white">
  <div class="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:pt-16 lg:grid lg:grid-cols-2 lg:gap-12 lg:pt-20">
    <div>
      <h1 class="text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl lg:text-5xl">
        {content.hero.h1}
      </h1>
      <p class="mt-4 text-base text-neutral-600 sm:text-lg">{content.hero.subhead}</p>
      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          data-track="click_whatsapp_hero"
          class="flex min-h-[52px] items-center justify-center rounded-xl bg-brand-600 px-6 text-base font-bold text-white hover:bg-brand-700"
        >
          💬 {content.hero.ctaWhatsApp}
        </a>
        <a
          href={SITE_CONFIG.phoneHref}
          data-track="click_phone_hero"
          class="flex min-h-[52px] items-center justify-center rounded-xl bg-white px-6 text-base font-bold text-brand-700 ring-2 ring-brand-600 hover:bg-brand-50"
        >
          📞 {content.hero.ctaPhone}
        </a>
      </div>
      <ul class="mt-6 flex flex-wrap gap-2">
        {
          content.hero.badges.map((badge) => (
            <li class="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
              ✓ {badge}
            </li>
          ))
        }
      </ul>
    </div>
    <div class="mt-8 lg:mt-0">
      <img
        src="/images/hero-palmera.jpg"
        alt={lang === 'es' ? 'Palmera podada en Fuengirola por Facundo Gutiérrez' : 'Pruned palm tree in Fuengirola by Facundo Gutiérrez'}
        width="640"
        height="480"
        loading="eager"
        fetchpriority="high"
        class="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 2: Crear Services.astro**

```astro
---
import type { LandingContent, Lang } from '../utils/i18n';

interface Props {
  lang: Lang;
  content: LandingContent;
}
const { content, lang } = Astro.props;

const icons: Record<string, string> = {
  palm: '🌴',
  tree: '🌳',
  axe: '🪓',
  alert: '🚨',
};
const title = lang === 'es' ? 'Nuestros servicios' : 'Our services';
---

<section id="servicios" class="mx-auto max-w-6xl px-4 py-12">
  <h2 class="text-2xl font-extrabold text-neutral-900 sm:text-3xl">{title}</h2>
  <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {
      content.services.map((s) => (
        <article class="rounded-xl border border-brand-100 bg-brand-50 p-4">
          <div class="text-5xl" aria-hidden="true">{icons[s.icon] ?? '🌿'}</div>
          <h3 class="mt-3 text-lg font-bold text-neutral-900">{s.title}</h3>
          <p class="mt-1 text-sm text-neutral-600">{s.benefit}</p>
          <a
            href="#contacto"
            data-track={`click_service_cta_${s.id}`}
            class="mt-3 inline-flex min-h-[44px] items-center text-sm font-bold text-brand-700 hover:text-brand-800"
          >
            {lang === 'es' ? 'Pedir presupuesto →' : 'Get a quote →'}
          </a>
        </article>
      ))
    }
  </div>
</section>
```

- [ ] **Step 3: Crear ServiceArea.astro**

```astro
---
import type { LandingContent, Lang } from '../utils/i18n';

interface Props {
  lang: Lang;
  content: LandingContent;
}
const { content } = Astro.props;
---

<section id="zonas" class="border-y border-brand-100 bg-brand-50/50">
  <div class="mx-auto max-w-6xl px-4 py-10">
    <h2 class="text-2xl font-extrabold text-neutral-900 sm:text-3xl">{content.areas.title}</h2>
    <p class="mt-1 text-sm text-neutral-600 sm:text-base">{content.areas.subtitle}</p>
    <div class="scrollbar-hide -mx-4 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {
        content.areas.towns.map((town) => (
          <span class="inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-800 ring-1 ring-brand-200">
            📍 {town}
          </span>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 4: Verificar tipos**

```bash
cd facundo-poda && npx astro check
```

Expected: `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add facundo-poda/src/components/Hero.astro facundo-poda/src/components/Services.astro facundo-poda/src/components/ServiceArea.astro
git commit -m "feat: hero + servicios + zona servicio"
```

---

### Task 7: WhyUs + Reviews + FAQ

**Files:**
- Create: `facundo-poda/src/components/WhyUs.astro`
- Create: `facundo-poda/src/components/Reviews.astro`
- Create: `facundo-poda/src/components/FAQ.astro`

**Interfaces:**
- Consumes: `LandingContent` (Task 3), `faqJsonLd` (Task 3)
- Produces: componentes con props `{ lang: Lang; content: LandingContent }`; FAQ emite JSON-LD FAQPage

- [ ] **Step 1: Crear WhyUs.astro**

```astro
---
import type { LandingContent, Lang } from '../utils/i18n';

interface Props {
  lang: Lang;
  content: LandingContent;
}
const { content, lang } = Astro.props;
const icons: Record<string, string> = { shield: '🛡️', clock: '⏱️', leaf: '🍃', badge: '🏅' };
const title = lang === 'es' ? '¿Por qué elegirnos?' : 'Why choose us?';
---

<section class="mx-auto max-w-6xl px-4 py-12">
  <h2 class="text-2xl font-extrabold text-neutral-900 sm:text-3xl">{title}</h2>
  <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {
      content.whyUs.map((item) => (
        <div class="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div class="text-4xl" aria-hidden="true">{icons[item.icon] ?? '✅'}</div>
          <h3 class="mt-2 text-base font-bold text-neutral-900">{item.title}</h3>
          <p class="mt-1 text-sm text-neutral-600">{item.desc}</p>
        </div>
      ))
    }
  </div>
</section>
```

- [ ] **Step 2: Crear Reviews.astro**

```astro
---
import type { LandingContent, Lang } from '../utils/i18n';

interface Props {
  lang: Lang;
  content: LandingContent;
}
const { content, lang } = Astro.props;
const title = lang === 'es' ? 'Lo que dicen nuestros clientes' : 'What our clients say';
---

<section class="border-y border-brand-100 bg-brand-50/50">
  <div class="mx-auto max-w-6xl px-4 py-12">
    <h2 class="text-2xl font-extrabold text-neutral-900 sm:text-3xl">{title}</h2>
    <div class="scrollbar-hide -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
      {
        content.reviews.map((r) => (
          <figure class="w-80 shrink-0 snap-start rounded-xl border border-neutral-200 bg-white p-5 shadow-sm lg:w-auto">
            <div class="text-yellow-400" aria-label={`${r.rating} / 5`}>
              {'★'.repeat(r.rating)}
              <span class="sr-only">{r.rating} de 5</span>
            </div>
            <blockquote class="mt-2 text-sm text-neutral-700">“{r.text}”</blockquote>
            <figcaption class="mt-3 text-sm font-bold text-neutral-900">
              {r.author} <span class="font-normal text-neutral-500">· {r.source}</span>
            </figcaption>
          </figure>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 3: Crear FAQ.astro (acordeón nativo + JSON-LD)**

```astro
---
import { faqJsonLd } from '../utils/schema';
import type { LandingContent, Lang } from '../utils/i18n';

interface Props {
  lang: Lang;
  content: LandingContent;
}
const { content, lang } = Astro.props;
const title = lang === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions';
---

<section class="mx-auto max-w-4xl px-4 py-12">
  <h2 class="text-2xl font-extrabold text-neutral-900 sm:text-3xl">{title}</h2>
  <div class="mt-6 space-y-3">
    {
      content.faq.map((item, i) => (
        <details
          class="group rounded-xl border border-neutral-200 bg-white"
          open={i === 0 ? true : undefined}
          data-track={`faq_open_${i}`}
        >
          <summary class="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 p-4 text-base font-bold text-neutral-900 focus-visible:ring-2 focus-visible:ring-brand-500">
            {item.q}
            <span class="text-brand-600 transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
          </summary>
          <p class="px-4 pb-4 text-sm leading-relaxed text-neutral-600">{item.a}</p>
        </details>
      ))
    }
  </div>
  <script type="application/ld+json" set:html={JSON.stringify(faqJsonLd(content.faq))} />
</section>
```

- [ ] **Step 4: Verificar tipos**

```bash
cd facundo-poda && npx astro check
```

Expected: `0 errors`.

- [ ] **Step 5: Commit**

```bash
git add facundo-poda/src/components/WhyUs.astro facundo-poda/src/components/Reviews.astro facundo-poda/src/components/FAQ.astro
git commit -m "feat: why-us + reviews + faq con schema"
```

---

### Task 8: Gallery con PhotoSwipe

**Files:**
- Create: `facundo-poda/src/components/Gallery.astro`

**Interfaces:**
- Consumes: `LandingContent` (Task 3)
- Produces: galería con lightbox; usa `photoswipe` solo en esta isla (`client:visible`)

- [ ] **Step 1: Crear Gallery.astro**

```astro
---
import type { LandingContent, Lang } from '../utils/i18n';

interface Props {
  lang: Lang;
  content: LandingContent;
}
const { content, lang } = Astro.props;
const title = lang === 'es' ? 'Trabajos recientes' : 'Recent work';
const pswpId = 'galeria-pswp';
---

<section class="mx-auto max-w-6xl px-4 py-12">
  <h2 class="text-2xl font-extrabold text-neutral-900 sm:text-3xl">{title}</h2>
  <div class="mt-6 grid grid-cols-1 gap-3 sm:columns-2 sm:block sm:gap-4 lg:columns-3" id={pswpId}>
    {
      content.gallery.map((img, i) => (
        <a
          href={img.src}
          data-pswp-width="1200"
          data-pswp-height="900"
          data-track={`gallery_image_open_${i}`}
          class="group mb-3 block overflow-hidden rounded-xl sm:mb-4 sm:break-inside-avoid"
        >
          <img
            src={img.src}
            alt={img.alt}
            width="800"
            height="600"
            loading="lazy"
            class="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
          />
          <span class="block bg-neutral-900 px-3 py-2 text-xs font-semibold text-white">
            {img.caption}
          </span>
        </a>
      ))
    }
  </div>
</section>

<script>
  import PhotoSwipeLightbox from 'photoswipe/lightbox';
  import 'photoswipe/style.css';

  const lightbox = new PhotoSwipeLightbox({
    gallery: '#galeria-pswp',
    children: 'a',
    pswpModule: () => import('photoswipe'),
  });
  lightbox.init();
</script>
```

- [ ] **Step 2: Verificar build (PhotoSwipe debe empaquetarse)**

```bash
cd facundo-poda && npx astro check
```

Expected: `0 errors`. Nota: el `<script>` sin directiva se empaqueta por Astro; verificar en Task 11 que el JS total < 15KB gz es aspiracional — si PhotoSwipe lo supera, cambiar a `<dialog>` nativo.

- [ ] **Step 3: Commit**

```bash
git add facundo-poda/src/components/Gallery.astro
git commit -m "feat: galeria con lightbox PhotoSwipe"
```

---

### Task 9: ContactForm (Netlify + Zod + WhatsApp)

**Files:**
- Create: `facundo-poda/src/components/ContactForm.astro`

**Interfaces:**
- Consumes: `LandingContent` (Task 3), `SITE_CONFIG` (Task 2), `whatsappLink` + `quoteMessage` (Task 3), `zod`
- Produces: formulario `form-name="contacto"` compatible Netlify Forms; validación cliente con Zod; fallback WhatsApp

- [ ] **Step 1: Crear ContactForm.astro**

```astro
---
import { SITE_CONFIG } from '../content/config';
import { whatsappLink } from '../utils/whatsapp';
import type { LandingContent, Lang } from '../utils/i18n';

interface Props {
  lang: Lang;
  content: LandingContent;
}
const { content, lang } = Astro.props;
const waDirect = whatsappLink(
  lang === 'es' ? 'Hola, necesito presupuesto de poda.' : 'Hi, I need a pruning quote.'
);
const serviceOptions = content.services.map((s) => s.title);
---

<section id="contacto" class="border-t border-brand-100 bg-brand-50/50">
  <div class="mx-auto max-w-2xl px-4 py-12">
    <h2 class="text-2xl font-extrabold text-neutral-900 sm:text-3xl">{content.contact.title}</h2>
    <p class="mt-1 text-sm text-neutral-600 sm:text-base">{content.contact.subtitle}</p>

    <form
      name="contacto"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      class="mt-6 space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
      id="contact-form"
    >
      <input type="hidden" name="form-name" value="contacto" />
      <input type="hidden" name="lang" value={lang} />
      <p class="hidden">
        <label>No rellenar: <input name="bot-field" /></label>
      </p>

      <div>
        <label for="nombre" class="mb-1 block text-sm font-bold text-neutral-800">
          {lang === 'es' ? 'Nombre' : 'Name'}
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          autocomplete="name"
          minlength="2"
          class="min-h-[48px] w-full rounded-lg border border-neutral-300 px-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="telefono" class="mb-1 block text-sm font-bold text-neutral-800">
            {lang === 'es' ? 'Teléfono' : 'Phone'}
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            required
            inputmode="tel"
            autocomplete="tel"
            pattern="[0-9+ ]{9,15}"
            class="min-h-[48px] w-full rounded-lg border border-neutral-300 px-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label for="zona" class="mb-1 block text-sm font-bold text-neutral-800">
            {lang === 'es' ? 'Zona' : 'Area'}
          </label>
          <select
            id="zona"
            name="zona"
            required
            class="min-h-[48px] w-full rounded-lg border border-neutral-300 bg-white px-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">—</option>
            {
              ['Fuengirola', 'Mijas', 'Benalmádena', 'Alhaurín el Grande', 'Alhaurín de la Torre'].map(
                (t) => (
                  <option value={t}>{t}</option>
                )
              )
            }
          </select>
        </div>
      </div>

      <div>
        <label for="servicio" class="mb-1 block text-sm font-bold text-neutral-800">
          {lang === 'es' ? 'Servicio' : 'Service'}
        </label>
        <select
          id="servicio"
          name="servicio"
          required
          class="min-h-[48px] w-full rounded-lg border border-neutral-300 bg-white px-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">—</option>
          {serviceOptions.map((s) => <option value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label for="mensaje" class="mb-1 block text-sm font-bold text-neutral-800">
          {lang === 'es' ? 'Mensaje (opcional)' : 'Message (optional)'}
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="4"
          class="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        ></textarea>
      </div>

      <p id="form-error" class="hidden text-sm font-semibold text-red-600" role="alert"></p>
      <p id="form-ok" class="hidden text-sm font-semibold text-brand-700" role="status">{content.contact.success}</p>

      <button
        type="submit"
        data-track="form_submit_attempt"
        class="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-brand-600 px-6 text-base font-bold text-white hover:bg-brand-700"
      >
        {content.contact.submit}
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-neutral-600">
      {content.contact.viaWhatsApp}:{' '}
      <a href={waDirect} target="_blank" rel="noopener" class="font-bold text-brand-700 underline">
        WhatsApp
      </a>{' '}
      · <a href={SITE_CONFIG.phoneHref} class="font-bold text-brand-700 underline">{SITE_CONFIG.phoneDisplay}</a>
    </p>
  </div>
</section>

<script>
  import { z } from 'zod';

  const schema = z.object({
    nombre: z.string().min(2, 'Nombre muy corto'),
    telefono: z.string().regex(/^[0-9+ ]{9,15}$/, 'Teléfono inválido'),
    zona: z.string().min(1, 'Elige zona'),
    servicio: z.string().min(1, 'Elige servicio'),
    mensaje: z.string().max(2000).optional(),
  });

  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const err = document.getElementById('form-error');
  const ok = document.getElementById('form-ok');

  form?.addEventListener('submit', (e) => {
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      e.preventDefault();
      if (err) {
        err.textContent = parsed.error.issues[0]?.message ?? 'Revisa el formulario';
        err.classList.remove('hidden');
      }
      ok?.classList.add('hidden');
    } else {
      err?.classList.add('hidden');
    }
  });
</script>
```

- [ ] **Step 2: Verificar tipos**

```bash
cd facundo-poda && npx astro check
```

Expected: `0 errors`.

- [ ] **Step 3: Commit**

```bash
git add facundo-poda/src/components/ContactForm.astro
git commit -m "feat: formulario contacto Netlify + Zod"
```

---

### Task 10: Footer + páginas ES/EN + netlify.toml

**Files:**
- Create: `facundo-poda/src/components/Footer.astro`
- Create: `facundo-poda/src/pages/index.astro`
- Create: `facundo-poda/src/pages/en/index.astro`
- Create: `facundo-poda/netlify.toml`

**Interfaces:**
- Consumes: todos los componentes (Tasks 5-9), `loadLanding` (Task 3), `Layout` (Task 4)
- Produces: sitio completo navegable en `npm run dev`; `npm run build` genera `dist/` con `/` y `/en/`

- [ ] **Step 1: Crear Footer.astro**

```astro
---
import { SITE_CONFIG } from '../content/config';
import type { Lang } from '../utils/i18n';

interface Props {
  lang: Lang;
}
const { lang } = Astro.props;
const legal = lang === 'es' ? 'Aviso legal y privacidad: solicítalos por WhatsApp.' : 'Legal notice and privacy: request them on WhatsApp.';
---

<footer class="border-t border-neutral-200 bg-neutral-950 text-neutral-300">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
    <div>
      <p class="text-base font-bold text-white">{SITE_CONFIG.name}</p>
      <p class="mt-1 text-sm">{SITE_CONFIG.address}</p>
      <p class="mt-1 text-sm">
        <a href={SITE_CONFIG.phoneHref} class="underline hover:text-white">{SITE_CONFIG.phoneDisplay}</a>
      </p>
      <p class="mt-1 text-sm">
        <a href={`mailto:${SITE_CONFIG.email}`} class="underline hover:text-white">{SITE_CONFIG.email}</a>
      </p>
    </div>
    <div>
      <p class="text-sm font-bold uppercase tracking-wide text-neutral-400">
        {lang === 'es' ? 'Zonas' : 'Areas'}
      </p>
      <ul class="mt-2 space-y-1 text-sm">
        {SITE_CONFIG.areas.map((a) => <li>📍 {a}</li>)}
      </ul>
    </div>
    <div>
      <p class="text-sm font-bold uppercase tracking-wide text-neutral-400">Legal</p>
      <p class="mt-2 text-xs leading-relaxed">{legal}</p>
      <p class="mt-2 text-xs">© 2026 {SITE_CONFIG.name}</p>
    </div>
  </div>
  <div class="h-20 lg:hidden" aria-hidden="true"></div>
</footer>
```

Nota: el `div.h-20` evita que la StickyCTA móvil tape el footer.

- [ ] **Step 2: Crear pages/index.astro (ES)**

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import Services from '../components/Services.astro';
import ServiceArea from '../components/ServiceArea.astro';
import WhyUs from '../components/WhyUs.astro';
import Gallery from '../components/Gallery.astro';
import Reviews from '../components/Reviews.astro';
import FAQ from '../components/FAQ.astro';
import ContactForm from '../components/ContactForm.astro';
import StickyCTA from '../components/StickyCTA.astro';
import Footer from '../components/Footer.astro';
import { loadLanding } from '../utils/i18n';

const content = loadLanding('es');
const title = 'Poda de palmeras y árboles en Fuengirola | Facundo Gutiérrez';
const description =
  'Especialistas en poda de palmeras y árboles en Fuengirola, Mijas, Benalmádena y Alhaurín. Presupuesto gratis, respuesta en 2h, residuos incluidos. Llama o WhatsApp.';
---

<Layout lang="es" title={title} description={description} faq={content.faq}>
  <Header lang="es" />
  <main>
    <Hero lang="es" content={content} />
    <Services lang="es" content={content} />
    <ServiceArea lang="es" content={content} />
    <WhyUs lang="es" content={content} />
    <Gallery lang="es" content={content} />
    <Reviews lang="es" content={content} />
    <FAQ lang="es" content={content} />
    <ContactForm lang="es" content={content} />
  </main>
  <Footer lang="es" />
  <StickyCTA lang="es" />
</Layout>
```

- [ ] **Step 3: Crear pages/en/index.astro (EN)**

```astro
---
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/Header.astro';
import Hero from '../../components/Hero.astro';
import Services from '../../components/Services.astro';
import ServiceArea from '../../components/ServiceArea.astro';
import WhyUs from '../../components/WhyUs.astro';
import Gallery from '../../components/Gallery.astro';
import Reviews from '../../components/Reviews.astro';
import FAQ from '../../components/FAQ.astro';
import ContactForm from '../../components/ContactForm.astro';
import StickyCTA from '../../components/StickyCTA.astro';
import Footer from '../../components/Footer.astro';
import { loadLanding } from '../../utils/i18n';

const content = loadLanding('en');
const title = 'Palm & tree pruning in Fuengirola | Facundo Gutiérrez';
const description =
  'Palm and tree pruning specialists in Fuengirola, Mijas, Benalmádena and Alhaurín. Free quote, 2h reply, waste removal included. Call or WhatsApp.';
---

<Layout lang="en" title={title} description={description} faq={content.faq}>
  <Header lang="en" />
  <main>
    <Hero lang="en" content={content} />
    <Services lang="en" content={content} />
    <ServiceArea lang="en" content={content} />
    <WhyUs lang="en" content={content} />
    <Gallery lang="en" content={content} />
    <Reviews lang="en" content={content} />
    <FAQ lang="en" content={content} />
    <ContactForm lang="en" content={content} />
  </main>
  <Footer lang="en" />
  <StickyCTA lang="en" />
</Layout>
```

- [ ] **Step 4: Crear netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

- [ ] **Step 5: Build completo de verificación**

```bash
cd facundo-poda && npm run build
```

Expected: build OK, `dist/index.html` y `dist/en/index.html` existen.

```bash
Test-Path facundo-poda/dist/index.html; Test-Path facundo-poda/dist/en/index.html
```

Expected: `True`, `True`.

- [ ] **Step 6: Commit**

```bash
git add facundo-poda/src/components/Footer.astro facundo-poda/src/pages/ facundo-poda/netlify.toml
git commit -m "feat: footer + paginas ES/EN + netlify config"
```

---

### Task 11: Verificación final (checklist spec §5, §6, §8)

**Files:**
- Modify: ninguno (solo verificación; si algo falla, abrir issue y corregir inline)

**Interfaces:**
- Consumes: sitio construido (Task 10)
- Produces: reporte de verificación + fixes inline si aplica

- [ ] **Step 1: astro check limpio**

```bash
cd facundo-poda && npx astro check
```

Expected: `0 errors`. Si hay errores, corregirlos inline antes de seguir.

- [ ] **Step 2: Verificar JSON-LD presente en ambas páginas**

```bash
cd facundo-poda && Select-String -Path dist/index.html -Pattern 'LocalBusiness|FAQPage' | Measure-Object | Select-Object -ExpandProperty Count
```

Expected: `≥ 2` (LocalBusiness del Layout + FAQPage del FAQ).

```bash
cd facundo-poda && Select-String -Path dist/en/index.html -Pattern 'LocalBusiness|FAQPage' | Measure-Object | Select-Object -ExpandProperty Count
```

Expected: `≥ 2`.

- [ ] **Step 3: Verificar hreflang + canonical**

```bash
cd facundo-poda && Select-String -Path dist/index.html -Pattern 'hreflang="(es|en|x-default)"' | Measure-Object | Select-Object -ExpandProperty Count
```

Expected: `3`.

- [ ] **Step 4: Verificar atributos móviles críticos**

```bash
cd facundo-poda && Select-String -Path dist/index.html -Pattern 'inputmode="tel"|loading="lazy"|safe-area|44px|min-h-\[4' | Measure-Object | Select-Object -ExpandProperty Count
```

Expected: `≥ 5`. Si falta `inputmode="tel"`, revisar ContactForm.

- [ ] **Step 5: Lighthouse móvil (manual, Chrome DevTools)**

Abrir `npm run preview`, emular Moto G4, correr Lighthouse. Registrar:
  - Performance ≥ 95, LCP < 2.0s, CLS < 0.05, TBT < 100ms
  - Si PhotoSwipe supera el budget JS, reemplazar lightbox por `<dialog>` nativo (fix inline)

- [ ] **Step 6: Commit final**

```bash
git add -A && git commit -m "chore: verificacion final checklist spec"
```

---

## Self-Review

**1. Cobertura del spec:**
- §2 Arquitectura (Astro, Tailwind, i18n JSON+middleware, Netlify Forms, Umami, JSON-LD) → Tasks 1-4 ✅
- §3 Secciones (Hero, Servicios, Zona, Por Qué, Galería, Opiniones, FAQ, Contacto) → Tasks 6-9 ✅
- §4 Componentes mobile-first (Header, StickyCTA, grids, carruseles, `<details>`) → Tasks 5-9 ✅
- §5 Accesibilidad/touch (44px, 16px inputs, focus, lazy, prefetch) → Tasks 2, 4-9 + verificación Task 11 ✅
- §6 Rendimiento (LCP/CLS/TBT/Lighthouse/JS) → Task 11 Step 5 ✅
- §7 Datos (JSON ES/EN + config.ts) → Task 2 ✅
- §8 SEO/schema (LocalBusiness, Service, FAQ, hreflang, sitemap) → Tasks 3-4, 7, 10. ⚠️ `serviceJsonLd` se genera en utils pero no se inyecta en páginas — fix: añadir inyección en `index.astro`/`en/index.astro` dentro de Task 10 o aceptar que Service va implícito en LocalBusiness. Decisión: inyectar en Layout como prop opcional `services`.
- §9 Conversión/analítica (data-track attrs, KPIs) → `data-track` incluidos; KPIs son post-deploy, fuera de alcance del plan ✅
- §10 Stack y estructura de archivos → Tasks 1-2, 10 ✅

**Fix aplicado:** ver nota §8 abajo.

**2. Placeholder scan:** `346XXXXXXXX`, `34952XXXXXX`, `REEMPLAZAR-UMAMI-ID`, dominio `facundogutierrez-poda.es` — son valores reales pendientes del cliente, marcados con ⚠️ en el plan. No son placeholders de diseño. `serviceJsonLd` sin inyectar — corregido abajo.

**3. Consistencia de tipos:** `loadLanding(lang)` → `LandingContent`; props `{ lang: Lang; content: LandingContent }` uniformes en los 11 componentes; `SITE_CONFIG` importado igual en todos; `faqJsonLd(faq: FaqItem[])` coincide con `content.faq`. ✅

**Fix inline — inyectar Service JSON-LD en páginas:**

En `src/pages/index.astro` y `src/pages/en/index.astro`, añadir tras los imports:

```astro
import { serviceJsonLd } from '../../utils/schema'; // ('../utils/schema' en index.astro)
const servicesLd = serviceJsonLd(content.services, 'es'); // 'en' en la versión inglesa
```

Y antes de `</Layout>`… en realidad dentro del Layout: pasar como prop. Más simple — añadir en cada página, justo dentro de `<main>` al inicio:

```astro
<script type="application/ld+json" set:html={JSON.stringify(servicesLd)} />
```

El ejecutor de Task 10 debe incluir estas 3 líneas por página (import + const + script tag).
